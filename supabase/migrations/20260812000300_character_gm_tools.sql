-- Chronicle 2.0 · safe GM tools for shared characters.

create or replace function public.copy_shared_character_as_npc(
  target_link_id uuid,
  requested_name text default null
)
returns public.actors
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_link public.chronicle_characters;
  source_character public.characters;
  copied_actor public.actors;
  normalized_name text;
  usable_portrait_id uuid;
begin
  select link.* into target_link
  from public.chronicle_characters link
  where link.id = target_link_id
    and link.archived_at is null;

  if target_link.id is null or not public.is_campaign_gm(target_link.campaign_id) then
    raise exception 'Only the chronicle GM can create an NPC copy';
  end if;

  select character.* into source_character
  from public.characters character
  where character.id = target_link.character_id;

  normalized_name := left(
    coalesce(nullif(trim(requested_name), ''), source_character.name || ' (NPC)'),
    120
  );

  select asset.id into usable_portrait_id
  from public.assets asset
  where asset.id = source_character.portrait_asset_id
    and asset.campaign_id = target_link.campaign_id;

  insert into public.actors (
    campaign_id,
    actor_type,
    name,
    portrait_asset_id,
    system_key,
    system_data
  ) values (
    target_link.campaign_id,
    'npc',
    normalized_name,
    usable_portrait_id,
    source_character.system_key,
    jsonb_strip_nulls(jsonb_build_object(
      'source', 'shared-character-copy',
      'clan', nullif(source_character.character_data ->> 'clan', ''),
      'concept', nullif(source_character.character_data ->> 'description', ''),
      'generation', source_character.character_data -> 'generation',
      'bloodPotency', source_character.character_data -> 'bloodPotency',
      'humanity', source_character.character_data -> 'humanity',
      'maxHealth', source_character.character_data -> 'maxHealth',
      'willpower', source_character.character_data -> 'willpower',
      'attributes', source_character.character_data -> 'attributes',
      'skills', source_character.character_data -> 'skills',
      'disciplines', source_character.character_data -> 'disciplines'
    ))
  )
  returning * into copied_actor;

  return copied_actor;
end;
$$;

create or replace function public.withdraw_character_xp(
  target_character_id uuid,
  target_campaign_id uuid,
  expected_character_version bigint,
  xp_amount integer,
  withdraw_reason text default ''
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
  next_data jsonb;
begin
  if xp_amount is null or xp_amount <= 0 then
    raise exception 'XP withdrawal must be positive';
  end if;

  if not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only the chronicle GM can withdraw XP';
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
  current_spent := coalesce(
    (current_character.character_data #>> '{ephemeral,experienceSpent}')::integer,
    0
  );

  if current_total - xp_amount < current_spent then
    raise exception 'Cannot withdraw XP that has already been spent';
  end if;

  next_data := jsonb_set(
    current_character.character_data,
    '{experience}',
    to_jsonb(current_total - xp_amount),
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
    'withdraw',
    -xp_amount,
    left(coalesce(withdraw_reason, ''), 500)
  );

  return saved_character;
end;
$$;

revoke all on function public.copy_shared_character_as_npc(uuid, text) from public;
revoke all on function public.copy_shared_character_as_npc(uuid, text) from anon;
grant execute on function public.copy_shared_character_as_npc(uuid, text) to authenticated;

revoke all on function public.withdraw_character_xp(uuid, uuid, bigint, integer, text) from public;
revoke all on function public.withdraw_character_xp(uuid, uuid, bigint, integer, text) from anon;
grant execute on function public.withdraw_character_xp(uuid, uuid, bigint, integer, text) to authenticated;
