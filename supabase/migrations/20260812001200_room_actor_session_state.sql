-- NPC combat/session values belong to the room session, never to the NPC's
-- reusable base actor. Only the GM can read or change them.

create table public.room_actor_session_states (
  room_session_id uuid not null references public.room_sessions(id) on delete cascade,
  actor_id uuid not null references public.actors(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  room_id uuid not null references public.vtt_rooms(id) on delete cascade,
  session_state jsonb not null default '{}'::jsonb
    check (jsonb_typeof(session_state) = 'object' and octet_length(session_state::text) <= 16384),
  version bigint not null default 1 check (version > 0),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (room_session_id, actor_id),
  foreign key (campaign_id, room_id)
    references public.vtt_rooms(campaign_id, id) on delete cascade
);

create trigger room_actor_session_states_set_updated_at
before update on public.room_actor_session_states
for each row execute function public.set_updated_at();

alter table public.room_actor_session_states enable row level security;
revoke all on table public.room_actor_session_states from anon;
grant select on table public.room_actor_session_states to authenticated;

create policy "gms read npc room session state" on public.room_actor_session_states
for select to authenticated using (public.is_campaign_gm(campaign_id));

create or replace function public.update_room_actor_session_state(
  target_room_id uuid,
  target_actor_id uuid,
  expected_version bigint,
  next_session_state jsonb
)
returns public.room_actor_session_states
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  target_actor public.actors;
  saved_state public.room_actor_session_states;
  state_key text;
  max_hunger integer;
begin
  if jsonb_typeof(next_session_state) <> 'object' then
    raise exception 'Session state must be an object';
  end if;
  for state_key in select jsonb_object_keys(next_session_state)
  loop
    if state_key not in ('hunger', 'superficialDamage', 'aggravatedDamage', 'superficialWillpowerDamage', 'aggravatedWillpowerDamage', 'humanityStains', 'capitalLiquido')
      or jsonb_typeof(next_session_state -> state_key) <> 'number'
      or (next_session_state ->> state_key) !~ '^[0-9]+$' then
      raise exception 'NPC session state is invalid';
    end if;
  end loop;

  select * into target_session from public.get_active_room_session(target_room_id);
  if not public.is_campaign_gm(target_session.campaign_id) then
    raise exception 'Only a GM can edit NPC session state';
  end if;

  select actor.* into target_actor
  from public.actors actor
  where actor.id = target_actor_id
    and actor.campaign_id = target_session.campaign_id;
  if target_actor.id is null then
    raise exception 'Actor does not belong to this chronicle';
  end if;

  max_hunger := greatest(5, coalesce((target_actor.system_data ->> 'bloodPotency')::integer, 0));
  if coalesce((next_session_state ->> 'hunger')::integer, 0) > max_hunger then
    raise exception 'Hunger exceeds this actor''s Blood Potency limit';
  end if;

  insert into public.room_actor_session_states (
    room_session_id, actor_id, campaign_id, room_id, session_state, version, updated_by
  ) values (
    target_session.id, target_actor.id, target_session.campaign_id, target_session.room_id,
    next_session_state, 1, auth.uid()
  )
  on conflict (room_session_id, actor_id) do update set
    session_state = excluded.session_state,
    version = room_actor_session_states.version + 1,
    updated_by = excluded.updated_by
  where room_actor_session_states.version = expected_version
  returning * into saved_state;

  if saved_state.actor_id is null then
    raise exception 'NPC session state changed in another device';
  end if;
  return saved_state;
end;
$$;

create or replace function public.load_room_session_sheet_bundle(target_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  caller_is_gm boolean;
begin
  select * into target_session from public.get_active_room_session(target_room_id);
  caller_is_gm := public.is_campaign_gm(target_session.campaign_id);
  return (
    with actor_ids as (
      select distinct item.actor_id as id from public.scene_items item join public.vtt_rooms room on room.active_scene_id = item.scene_id where room.id = target_room_id and item.actor_id is not null
      union
      select distinct slot.actor_id as id from public.player_slots slot where slot.room_id = target_room_id and slot.archived_at is null and slot.actor_id is not null
    ), sheet_rows as (
      select actor.*, link.id as link_id, link.session_state, link.session_state_version, character.id as character_id, character.owner_id as character_owner_id, character.character_data,
        actor_state.session_state as actor_session_state, actor_state.version as actor_session_version
      from actor_ids ids join public.actors actor on actor.id = ids.id
      left join public.chronicle_characters link on link.id = actor.character_link_id and link.archived_at is null
      left join public.characters character on character.id = link.character_id
      left join public.room_actor_session_states actor_state on actor_state.room_session_id = target_session.id and actor_state.actor_id = actor.id
    )
    select jsonb_build_object(
      'session', to_jsonb(target_session),
      'sheets', coalesce(
        jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
          'actor', jsonb_build_object('id',id,'name',name,'actor_type',actor_type,'owner_user_id',owner_user_id,'portrait_asset_id',portrait_asset_id,'system_key',system_key,'system_data',system_data,'character_link_id',character_link_id),
          'link', case when caller_is_gm or character_owner_id = auth.uid() then jsonb_build_object('id',link_id,'session_state',session_state,'session_state_version',session_state_version) else null end,
          'character', case when caller_is_gm or character_owner_id = auth.uid() then jsonb_build_object('id',character_id,'owner_id',character_owner_id,'character_data',character_data) else null end,
          'actor_session', case when caller_is_gm and character_id is null then jsonb_build_object('session_state',coalesce(actor_session_state,'{}'::jsonb),'version',coalesce(actor_session_version,0)) else null end
        ))),
        '[]'::jsonb
      )
    )
    from sheet_rows
  );
end;
$$;

revoke all on function public.update_room_actor_session_state(uuid, uuid, bigint, jsonb) from public, anon;
grant execute on function public.update_room_actor_session_state(uuid, uuid, bigint, jsonb) to authenticated;
alter publication supabase_realtime add table public.room_actor_session_states;
