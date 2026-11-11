-- Chronicle 2.0 · atomic, auditable character experience changes.

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
    select 1
    from public.chronicle_characters link
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

  insert into public.character_xp_events (
    character_id,
    campaign_id,
    performed_by,
    event_type,
    xp_delta,
    reason,
    details
  ) values (
    current_character.id,
    target_campaign_id,
    auth.uid(),
    'spend',
    -xp_cost,
    left(coalesce(change_reason, ''), 500),
    coalesce(event_details, '{}'::jsonb)
  );

  return saved_character;
end;
$$;

create or replace function public.grant_character_xp(
  target_character_id uuid,
  target_campaign_id uuid,
  expected_character_version bigint,
  xp_amount integer,
  grant_reason text default ''
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
  next_data jsonb;
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required to grant XP';
  end if;

  if xp_amount is null or xp_amount <= 0 then
    raise exception 'XP grant must be positive';
  end if;

  if not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only the chronicle GM can grant XP';
  end if;

  select character.* into current_character
  from public.characters character
  join public.chronicle_characters link on link.character_id = character.id
  where character.id = target_character_id
    and link.campaign_id = target_campaign_id
    and link.archived_at is null
  for update of character;

  if current_character.id is null then
    raise exception 'Shared character was not found';
  end if;

  if current_character.version <> expected_character_version then
    raise exception 'Character version conflict';
  end if;

  current_total := coalesce((current_character.character_data ->> 'experience')::integer, 0);
  next_data := jsonb_set(
    current_character.character_data,
    '{experience}',
    to_jsonb(current_total + xp_amount),
    true
  );

  update public.characters character
  set character_data = next_data
  where character.id = current_character.id
    and character.version = expected_character_version
  returning character.* into saved_character;

  if saved_character.id is null then
    raise exception 'Character version conflict';
  end if;

  insert into public.character_xp_events (
    character_id,
    campaign_id,
    performed_by,
    event_type,
    xp_delta,
    reason
  ) values (
    current_character.id,
    target_campaign_id,
    auth.uid(),
    'grant',
    xp_amount,
    left(coalesce(grant_reason, ''), 500)
  );

  return saved_character;
end;
$$;

revoke all on function public.spend_character_xp(uuid, bigint, integer, text, jsonb, jsonb, uuid) from public;
revoke all on function public.spend_character_xp(uuid, bigint, integer, text, jsonb, jsonb, uuid) from anon;
grant execute on function public.spend_character_xp(uuid, bigint, integer, text, jsonb, jsonb, uuid) to authenticated;

revoke all on function public.grant_character_xp(uuid, uuid, bigint, integer, text) from public;
revoke all on function public.grant_character_xp(uuid, uuid, bigint, integer, text) from anon;
grant execute on function public.grant_character_xp(uuid, uuid, bigint, integer, text) to authenticated;
