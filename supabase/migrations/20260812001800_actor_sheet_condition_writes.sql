-- Condições pertencem à ficha, não à vida efêmera de uma sala. Estas RPCs
-- usam o ator como escopo e aceitam o dono da ficha ou o GM da campanha.

create or replace function public.update_actor_sheet_conditions(
  target_actor_id uuid,
  next_conditions jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_actor public.actors;
  linked_character public.characters;
  linked_npc public.npc_sheets;
  caller_is_gm boolean;
  state_key text;
  current_ephemeral jsonb;
  saved_data jsonb;
  max_hunger integer;
begin
  if jsonb_typeof(next_conditions) <> 'object' then raise exception 'Sheet conditions must be an object'; end if;
  for state_key in select jsonb_object_keys(next_conditions)
  loop
    if state_key not in ('hunger', 'superficialDamage', 'aggravatedDamage', 'superficialWillpowerDamage', 'aggravatedWillpowerDamage', 'humanityStains', 'capitalLiquido')
      or jsonb_typeof(next_conditions -> state_key) <> 'number'
      or (next_conditions ->> state_key) !~ '^[0-9]+$' then
      raise exception 'Invalid sheet condition';
    end if;
  end loop;

  select actor.* into target_actor from public.actors actor where actor.id = target_actor_id;
  if target_actor.id is null then raise exception 'Actor not found'; end if;
  caller_is_gm := public.is_campaign_gm(target_actor.campaign_id);

  select character.* into linked_character
  from public.chronicle_characters link join public.characters character on character.id = link.character_id
  where link.id = target_actor.character_link_id and link.archived_at is null;

  if linked_character.id is not null and not caller_is_gm and linked_character.owner_id <> auth.uid() then
    raise exception 'You cannot update these sheet conditions';
  end if;
  if linked_character.id is null and not caller_is_gm then
    raise exception 'Only the GM can update NPC conditions';
  end if;

  if linked_character.id is not null then
    max_hunger := greatest(5, coalesce((linked_character.character_data ->> 'bloodPotency')::integer, 0));
    if coalesce((next_conditions ->> 'hunger')::integer, 0) > max_hunger then raise exception 'Hunger exceeds the character limit'; end if;
    current_ephemeral := coalesce(linked_character.character_data -> 'ephemeral', '{}'::jsonb);
    update public.characters character
    set character_data = jsonb_set(
      jsonb_set(character.character_data, '{ephemeral}', current_ephemeral || (next_conditions - 'capitalLiquido'), true),
      '{capitalLiquido}', coalesce(next_conditions -> 'capitalLiquido', character.character_data -> 'capitalLiquido', '0'::jsonb), true
    )
    where character.id = linked_character.id
    returning character.character_data into saved_data;
    return jsonb_build_object('actor_id', target_actor.id, 'character_id', linked_character.id, 'character_data', saved_data);
  end if;

  select sheet.* into linked_npc from public.npc_sheets sheet where sheet.id = target_actor.npc_sheet_id;
  if linked_npc.id is not null then
    update public.npc_sheets sheet
    set npc_data = coalesce(sheet.npc_data, '{}'::jsonb) || jsonb_build_object(
      'hunger', coalesce((next_conditions ->> 'hunger')::integer, 0),
      'humanityStains', coalesce((next_conditions ->> 'humanityStains')::integer, 0),
      'capitalLiquido', coalesce((next_conditions ->> 'capitalLiquido')::integer, 0),
      'vttConditions', next_conditions
    )
    where sheet.id = linked_npc.id
    returning sheet.npc_data into saved_data;
  else
    update public.actors actor
    set system_data = coalesce(actor.system_data, '{}'::jsonb) || jsonb_build_object(
      'hunger', coalesce((next_conditions ->> 'hunger')::integer, 0),
      'humanityStains', coalesce((next_conditions ->> 'humanityStains')::integer, 0),
      'capitalLiquido', coalesce((next_conditions ->> 'capitalLiquido')::integer, 0),
      'vttConditions', next_conditions
    )
    where actor.id = target_actor.id
    returning actor.system_data into saved_data;
  end if;
  return jsonb_build_object('actor_id', target_actor.id, 'actor_system_data', saved_data);
end;
$$;

create or replace function public.update_actor_sheet_humanity(
  target_actor_id uuid,
  next_humanity integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_actor public.actors;
  linked_character public.characters;
  linked_npc public.npc_sheets;
  caller_is_gm boolean;
  safe_humanity integer := greatest(0, least(10, coalesce(next_humanity, 0)));
  saved_data jsonb;
begin
  select actor.* into target_actor from public.actors actor where actor.id = target_actor_id;
  if target_actor.id is null then raise exception 'Actor not found'; end if;
  caller_is_gm := public.is_campaign_gm(target_actor.campaign_id);
  select character.* into linked_character
  from public.chronicle_characters link join public.characters character on character.id = link.character_id
  where link.id = target_actor.character_link_id and link.archived_at is null;
  if linked_character.id is not null and not caller_is_gm and linked_character.owner_id <> auth.uid() then raise exception 'You cannot update this actor humanity'; end if;
  if linked_character.id is null and not caller_is_gm then raise exception 'Only the GM can update NPC humanity'; end if;

  if linked_character.id is not null then
    update public.characters character
    set character_data = jsonb_set(character.character_data, '{humanity}', to_jsonb(safe_humanity), true)
    where character.id = linked_character.id
    returning character.character_data into saved_data;
    return jsonb_build_object('actor_id', target_actor.id, 'character_id', linked_character.id, 'character_data', saved_data);
  end if;

  select sheet.* into linked_npc from public.npc_sheets sheet where sheet.id = target_actor.npc_sheet_id;
  if linked_npc.id is not null then
    update public.npc_sheets sheet
    set npc_data = jsonb_set(sheet.npc_data, '{humanity}', to_jsonb(safe_humanity), true)
    where sheet.id = linked_npc.id
    returning sheet.npc_data into saved_data;
  else
    update public.actors actor
    set system_data = jsonb_set(actor.system_data, '{humanity}', to_jsonb(safe_humanity), true)
    where actor.id = target_actor.id
    returning actor.system_data into saved_data;
  end if;
  return jsonb_build_object('actor_id', target_actor.id, 'actor_system_data', saved_data);
end;
$$;

revoke all on function public.update_actor_sheet_conditions(uuid, jsonb) from public, anon;
revoke all on function public.update_actor_sheet_humanity(uuid, integer) from public, anon;
grant execute on function public.update_actor_sheet_conditions(uuid, jsonb) to authenticated;
grant execute on function public.update_actor_sheet_humanity(uuid, integer) to authenticated;
