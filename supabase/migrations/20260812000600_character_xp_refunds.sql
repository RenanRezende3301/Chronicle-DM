-- Chronicle 2.0: safe, auditable undo for the latest XP purchase.

create or replace function public.spend_character_xp(
  target_character_id uuid,
  expected_character_version bigint,
  xp_cost integer,
  change_reason text,
  next_character_data jsonb,
  event_details jsonb default '{}'::jsonb,
  target_campaign_id uuid default null
)
returns public.characters
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_character public.characters;
  saved_character public.characters;
  current_total integer;
  current_spent integer;
  next_total integer;
  next_spent integer;
  protected_details jsonb;
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required to spend XP';
  end if;

  if xp_cost is null or xp_cost <= 0 then
    raise exception 'XP cost must be positive';
  end if;

  if jsonb_typeof(next_character_data) <> 'object'
    or jsonb_typeof(coalesce(event_details, '{}'::jsonb)) <> 'object'
  then
    raise exception 'Character data and event details must be objects';
  end if;

  select character.* into current_character
  from public.characters character
  where character.id = target_character_id
  for update;

  if current_character.id is null or current_character.owner_id <> auth.uid() then
    raise exception 'Only the character owner can spend XP';
  end if;

  if current_character.version <> expected_character_version then
    raise exception 'Character version conflict';
  end if;

  if target_campaign_id is not null and not exists (
    select 1 from public.chronicle_characters link
    where link.character_id = current_character.id
      and link.campaign_id = target_campaign_id
      and link.archived_at is null
  ) then
    raise exception 'Character is not shared with this chronicle';
  end if;

  current_total := coalesce((current_character.character_data ->> 'experience')::integer, 0);
  current_spent := coalesce(
    (current_character.character_data #>> '{ephemeral,experienceSpent}')::integer,
    0
  );
  next_total := coalesce((next_character_data ->> 'experience')::integer, -1);
  next_spent := coalesce((next_character_data #>> '{ephemeral,experienceSpent}')::integer, -1);

  if current_total - current_spent < xp_cost then
    raise exception 'Insufficient XP';
  end if;

  if next_total <> current_total or next_spent <> current_spent + xp_cost then
    raise exception 'Invalid XP totals in character update';
  end if;

  update public.characters character
  set character_data = next_character_data,
      name = left(coalesce(nullif(trim(next_character_data ->> 'name'), ''), character.name), 120)
  where character.id = current_character.id
    and character.version = expected_character_version
  returning character.* into saved_character;

  if saved_character.id is null then
    raise exception 'Character version conflict';
  end if;

  protected_details := coalesce(event_details, '{}'::jsonb) || jsonb_build_object(
    'previousCharacterData', current_character.character_data,
    'purchasedCharacterData', saved_character.character_data,
    'refundable', true
  );

  insert into public.character_xp_events (
    character_id, campaign_id, performed_by, event_type,
    xp_delta, reason, details
  ) values (
    current_character.id, target_campaign_id, auth.uid(), 'spend',
    -xp_cost, left(coalesce(change_reason, ''), 500), protected_details
  );

  return saved_character;
end;
$$;

create or replace function public.refund_character_xp_purchase(
  target_event_id uuid,
  expected_character_version bigint,
  refund_reason text default ''
)
returns public.characters
language plpgsql
security definer
set search_path = ''
as $$
declare
  purchase_event public.character_xp_events;
  current_character public.characters;
  saved_character public.characters;
  previous_data jsonb;
  purchased_data jsonb;
  refund_amount integer;
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required to refund XP';
  end if;

  select event.* into purchase_event
  from public.character_xp_events event
  where event.id = target_event_id;

  if purchase_event.id is null or purchase_event.event_type <> 'spend' then
    raise exception 'XP purchase was not found';
  end if;

  select character.* into current_character
  from public.characters character
  where character.id = purchase_event.character_id
  for update;

  if current_character.id is null
    or (
      current_character.owner_id <> auth.uid()
      and (
        purchase_event.campaign_id is null
        or not public.is_campaign_gm(purchase_event.campaign_id)
      )
    )
  then
    raise exception 'Only the owner or chronicle GM can refund this purchase';
  end if;

  if current_character.version <> expected_character_version then
    raise exception 'Character version conflict';
  end if;

  if exists (
    select 1 from public.character_xp_events reversal
    where reversal.reverses_event_id = purchase_event.id
  ) then
    raise exception 'This XP purchase was already refunded';
  end if;

  previous_data := purchase_event.details -> 'previousCharacterData';
  purchased_data := purchase_event.details -> 'purchasedCharacterData';
  if jsonb_typeof(previous_data) is distinct from 'object'
    or jsonb_typeof(purchased_data) is distinct from 'object'
  then
    raise exception 'This legacy XP purchase cannot be safely refunded';
  end if;

  if current_character.character_data <> purchased_data then
    raise exception 'Only the latest unchanged purchase can be refunded';
  end if;

  refund_amount := -purchase_event.xp_delta;
  if refund_amount <= 0 then
    raise exception 'Invalid XP purchase amount';
  end if;

  update public.characters character
  set character_data = previous_data,
      name = left(coalesce(nullif(trim(previous_data ->> 'name'), ''), character.name), 120)
  where character.id = current_character.id
    and character.version = expected_character_version
  returning character.* into saved_character;

  if saved_character.id is null then
    raise exception 'Character version conflict';
  end if;

  insert into public.character_xp_events (
    character_id, campaign_id, performed_by, event_type,
    xp_delta, reason, details, reverses_event_id
  ) values (
    current_character.id,
    purchase_event.campaign_id,
    auth.uid(),
    'refund',
    refund_amount,
    left(
      coalesce(nullif(trim(refund_reason), ''), 'Estorno: ' || purchase_event.reason),
      500
    ),
    jsonb_build_object(
      'sourceEventId', purchase_event.id,
      'category', purchase_event.details -> 'category',
      'label', purchase_event.details -> 'label'
    ),
    purchase_event.id
  );

  return saved_character;
end;
$$;

create unique index character_xp_events_one_refund_idx
  on public.character_xp_events(reverses_event_id)
  where reverses_event_id is not null;

revoke all on function public.refund_character_xp_purchase(uuid, bigint, text) from public;
revoke all on function public.refund_character_xp_purchase(uuid, bigint, text) from anon;
grant execute on function public.refund_character_xp_purchase(uuid, bigint, text) to authenticated;
