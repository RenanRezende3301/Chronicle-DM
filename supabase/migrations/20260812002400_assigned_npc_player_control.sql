-- A player may control and edit an NPC only while occupying the room slot to
-- which that NPC is assigned. The NPC library remains owned by the GM.

create or replace function public.can_control_assigned_actor(target_actor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.slot_occupancies occupancy
    join public.room_sessions session
      on session.id = occupancy.room_session_id
      and session.status = 'active'
    join public.player_slots slot
      on slot.id = occupancy.slot_id
      and slot.room_id = session.room_id
      and slot.archived_at is null
    where slot.actor_id = target_actor_id
      and occupancy.user_id = auth.uid()
      and occupancy.expires_at > now()
  );
$$;

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
  caller_controls_actor boolean;
  state_key text;
  current_ephemeral jsonb;
  saved_data jsonb;
  max_hunger integer;
begin
  if jsonb_typeof(next_conditions) <> 'object' then
    raise exception 'Sheet conditions must be an object';
  end if;

  for state_key in select jsonb_object_keys(next_conditions)
  loop
    if state_key not in (
      'hunger',
      'superficialDamage',
      'aggravatedDamage',
      'superficialWillpowerDamage',
      'aggravatedWillpowerDamage',
      'humanityStains',
      'capitalLiquido'
    )
      or jsonb_typeof(next_conditions -> state_key) <> 'number'
      or (next_conditions ->> state_key) !~ '^[0-9]+$'
    then
      raise exception 'Invalid sheet condition';
    end if;
  end loop;

  select actor.* into target_actor
  from public.actors actor
  where actor.id = target_actor_id;

  if target_actor.id is null then raise exception 'Actor not found'; end if;

  caller_is_gm := public.is_campaign_gm(target_actor.campaign_id);
  caller_controls_actor := public.can_control_assigned_actor(target_actor.id);

  select character.* into linked_character
  from public.chronicle_characters link
  join public.characters character on character.id = link.character_id
  where link.id = target_actor.character_link_id
    and link.archived_at is null;

  if linked_character.id is not null
    and not caller_is_gm
    and linked_character.owner_id <> auth.uid()
    and not caller_controls_actor
  then
    raise exception 'You cannot update these sheet conditions';
  end if;

  if linked_character.id is null
    and not caller_is_gm
    and not caller_controls_actor
  then
    raise exception 'Only the GM or the assigned player can update NPC conditions';
  end if;

  if linked_character.id is not null then
    max_hunger := greatest(
      5,
      least(10, coalesce((linked_character.character_data ->> 'bloodPotency')::integer, 0))
    );
    if coalesce((next_conditions ->> 'hunger')::integer, 0) > max_hunger then
      raise exception 'Hunger exceeds the character limit';
    end if;

    current_ephemeral := coalesce(
      linked_character.character_data -> 'ephemeral',
      '{}'::jsonb
    );
    update public.characters character
    set character_data = jsonb_set(
      jsonb_set(
        character.character_data,
        '{ephemeral}',
        current_ephemeral || (next_conditions - 'capitalLiquido'),
        true
      ),
      '{capitalLiquido}',
      coalesce(
        next_conditions -> 'capitalLiquido',
        character.character_data -> 'capitalLiquido',
        '0'::jsonb
      ),
      true
    )
    where character.id = linked_character.id
    returning character.character_data into saved_data;

    return jsonb_build_object(
      'actor_id', target_actor.id,
      'character_id', linked_character.id,
      'character_data', saved_data
    );
  end if;

  select sheet.* into linked_npc
  from public.npc_sheets sheet
  where sheet.id = target_actor.npc_sheet_id;

  if linked_npc.id is not null then
    max_hunger := greatest(
      5,
      least(10, coalesce((linked_npc.npc_data ->> 'bloodPotency')::integer, 0))
    );
    if lower(trim(coalesce(linked_npc.npc_data ->> 'type', 'vampire'))) <> 'vampire'
      and coalesce((next_conditions ->> 'hunger')::integer, 0) <> 0
    then
      raise exception 'This character does not use Hunger';
    end if;
    if coalesce((next_conditions ->> 'hunger')::integer, 0) > max_hunger then
      raise exception 'Hunger exceeds the character limit';
    end if;

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

  return jsonb_build_object(
    'actor_id', target_actor.id,
    'actor_system_data', saved_data
  );
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
  caller_controls_actor boolean;
  safe_humanity integer := greatest(0, least(10, coalesce(next_humanity, 0)));
  saved_data jsonb;
begin
  select actor.* into target_actor
  from public.actors actor
  where actor.id = target_actor_id;

  if target_actor.id is null then raise exception 'Actor not found'; end if;

  caller_is_gm := public.is_campaign_gm(target_actor.campaign_id);
  caller_controls_actor := public.can_control_assigned_actor(target_actor.id);

  select character.* into linked_character
  from public.chronicle_characters link
  join public.characters character on character.id = link.character_id
  where link.id = target_actor.character_link_id
    and link.archived_at is null;

  if linked_character.id is not null
    and not caller_is_gm
    and linked_character.owner_id <> auth.uid()
    and not caller_controls_actor
  then
    raise exception 'You cannot update this actor humanity';
  end if;

  if linked_character.id is null
    and not caller_is_gm
    and not caller_controls_actor
  then
    raise exception 'Only the GM or the assigned player can update NPC humanity';
  end if;

  if linked_character.id is not null then
    update public.characters character
    set character_data = jsonb_set(
      character.character_data,
      '{humanity}',
      to_jsonb(safe_humanity),
      true
    )
    where character.id = linked_character.id
    returning character.character_data into saved_data;

    return jsonb_build_object(
      'actor_id', target_actor.id,
      'character_id', linked_character.id,
      'character_data', saved_data
    );
  end if;

  select sheet.* into linked_npc
  from public.npc_sheets sheet
  where sheet.id = target_actor.npc_sheet_id;

  if linked_npc.id is not null then
    update public.npc_sheets sheet
    set npc_data = jsonb_set(
      coalesce(sheet.npc_data, '{}'::jsonb),
      '{humanity}',
      to_jsonb(safe_humanity),
      true
    )
    where sheet.id = linked_npc.id
    returning sheet.npc_data into saved_data;
  else
    update public.actors actor
    set system_data = jsonb_set(
      coalesce(actor.system_data, '{}'::jsonb),
      '{humanity}',
      to_jsonb(safe_humanity),
      true
    )
    where actor.id = target_actor.id
    returning actor.system_data into saved_data;
  end if;

  return jsonb_build_object(
    'actor_id', target_actor.id,
    'actor_system_data', saved_data
  );
end;
$$;

create or replace function public.active_actor_occupant(target_actor_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select occupancy.user_id
  from public.slot_occupancies occupancy
  join public.room_sessions session
    on session.id = occupancy.room_session_id
    and session.status = 'active'
  join public.player_slots slot
    on slot.id = occupancy.slot_id
    and slot.room_id = session.room_id
    and slot.archived_at is null
  where slot.actor_id = target_actor_id
    and occupancy.expires_at > now()
  order by occupancy.heartbeat_at desc
  limit 1;
$$;

-- Updating an NPC sheet must preserve transient player control while its slot
-- occupancy is alive. Without this, the first edit revokes token movement.
create or replace function public.sync_changed_npc_sheet_actors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.actors (
    campaign_id, actor_type, name, owner_user_id, system_key,
    system_data, legacy_npc_id, npc_sheet_id
  )
  select
    campaign.id,
    'npc',
    coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
    null,
    'vtm-v5',
    new.npc_data,
    new.id,
    new.id
  from public.campaigns campaign
  where campaign.owner_id = new.owner_id
    and not exists (
      select 1
      from public.actors actor
      where actor.campaign_id = campaign.id
        and actor.npc_sheet_id = new.id
    );

  update public.actors actor
  set actor_type = case
        when public.active_actor_occupant(actor.id) is null then 'npc'
        else 'pc'
      end,
      name = coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
      owner_user_id = public.active_actor_occupant(actor.id),
      system_key = 'vtm-v5',
      system_data = new.npc_data,
      legacy_npc_id = new.id
  where actor.npc_sheet_id = new.id;

  return new;
end;
$$;

-- Actor ownership is the canonical control signal used by token RLS and the
-- player canvas. Keep all tokens for that actor aligned automatically.
create or replace function public.sync_actor_token_control()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.scene_items item
  set owner_user_id = new.owner_user_id
  where item.actor_id = new.id
    and item.item_type = 'token'
    and item.owner_user_id is distinct from new.owner_user_id;
  return new;
end;
$$;

drop trigger if exists actors_sync_token_control on public.actors;
create trigger actors_sync_token_control
after update of owner_user_id on public.actors
for each row
when (old.owner_user_id is distinct from new.owner_user_id)
execute function public.sync_actor_token_control();

-- Align already occupied actors and their existing tokens immediately.
update public.actors actor
set owner_user_id = public.active_actor_occupant(actor.id),
    actor_type = case
      when public.active_actor_occupant(actor.id) is not null then 'pc'
      when actor.npc_sheet_id is not null then 'npc'
      else actor.actor_type
    end
where actor.id in (
  select slot.actor_id
  from public.player_slots slot
  where slot.actor_id is not null
);

revoke all on function public.can_control_assigned_actor(uuid) from public, anon;
revoke all on function public.active_actor_occupant(uuid) from public, anon;
revoke all on function public.update_actor_sheet_conditions(uuid, jsonb) from public, anon;
revoke all on function public.update_actor_sheet_humanity(uuid, integer) from public, anon;

grant execute on function public.can_control_assigned_actor(uuid) to authenticated;
grant execute on function public.update_actor_sheet_conditions(uuid, jsonb) to authenticated;
grant execute on function public.update_actor_sheet_humanity(uuid, integer) to authenticated;
