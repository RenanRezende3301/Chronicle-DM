-- Bind a published scene to the exact live session that published it.
-- A scene from a previous session must never leak into the next one.

alter table public.vtt_rooms
  add column published_session_id uuid
  references public.room_sessions(id) on delete set null;

create index vtt_rooms_published_session_idx
  on public.vtt_rooms(published_session_id)
  where published_session_id is not null;

-- Existing active rooms predate session-scoped publication. Keep every scene
-- and item, but require the GM to explicitly publish the current scene again.
update public.vtt_rooms room
set active_scene_id = null,
    published_session_id = null
where exists (
  select 1
  from public.room_sessions session
  where session.room_id = room.id
    and session.status = 'active'
);

create or replace function public.is_active_scene(
  target_campaign_id uuid,
  target_scene_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.scenes scene
    join public.vtt_rooms room
      on room.id = scene.room_id
      and room.campaign_id = scene.campaign_id
    where scene.id = target_scene_id
      and scene.campaign_id = target_campaign_id
      and room.active_scene_id = scene.id
      and room.archived_at is null
      and (
        public.is_campaign_gm(target_campaign_id)
        or exists (
          select 1
          from public.room_sessions session
          join public.slot_occupancies occupancy
            on occupancy.room_session_id = session.id
          where session.room_id = room.id
            and session.status = 'active'
            and room.published_session_id = session.id
            and occupancy.user_id = auth.uid()
            and occupancy.expires_at > now()
        )
      )
  );
$$;

create or replace function public.load_room_vtt_bundle(target_room_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with selected_room as (
    select room.*
    from public.vtt_rooms room
    where room.id = target_room_id
      and room.archived_at is null
      and public.is_campaign_member(room.campaign_id)
  ),
  selected_campaign as (
    select campaign.*
    from public.campaigns campaign
    join selected_room room on room.campaign_id = campaign.id
  ),
  visible_room as (
    select room.*
    from selected_room room
    where public.is_campaign_gm(room.campaign_id)
      or exists (
        select 1
        from public.room_sessions session
        join public.slot_occupancies occupancy
          on occupancy.room_session_id = session.id
        where session.room_id = room.id
          and session.status = 'active'
          and room.published_session_id = session.id
          and occupancy.user_id = auth.uid()
          and occupancy.expires_at > now()
      )
  ),
  selected_scenes as (
    select scene.*
    from public.scenes scene
    join visible_room room
      on room.id = scene.room_id
      and room.active_scene_id = scene.id
  ),
  selected_items as (
    select item.*
    from public.scene_items item
    join selected_scenes scene on scene.id = item.scene_id
    order by item.z_index
  ),
  selected_actors as (
    select actor.*
    from public.actors actor
    where actor.id in (
      select item.actor_id
      from selected_items item
      where item.actor_id is not null
    )
  ),
  selected_asset_ids as (
    select scene.map_asset_id as id
    from selected_scenes scene
    where scene.map_asset_id is not null
    union
    select item.asset_id
    from selected_items item
    where item.asset_id is not null
    union
    select actor.portrait_asset_id
    from selected_actors actor
    where actor.portrait_asset_id is not null
  ),
  selected_assets as (
    select asset.*
    from public.assets asset
    where asset.id in (select id from selected_asset_ids)
  )
  select jsonb_build_object(
    'campaign', coalesce(
      (select to_jsonb(campaign) from selected_campaign campaign limit 1),
      'null'::jsonb
    ),
    'room', coalesce(
      (select to_jsonb(room) from selected_room room limit 1),
      'null'::jsonb
    ),
    'scenes', coalesce(
      (select jsonb_agg(to_jsonb(scene) order by scene.sort_order)
       from selected_scenes scene),
      '[]'::jsonb
    ),
    'items', coalesce(
      (select jsonb_agg(to_jsonb(item) order by item.z_index)
       from selected_items item),
      '[]'::jsonb
    ),
    'actors', coalesce(
      (select jsonb_agg(to_jsonb(actor)) from selected_actors actor),
      '[]'::jsonb
    ),
    'assets', coalesce(
      (select jsonb_agg(to_jsonb(asset)) from selected_assets asset),
      '[]'::jsonb
    )
  );
$$;

create or replace function public.publish_room_scene(
  target_room_id uuid,
  target_scene_id uuid
)
returns public.vtt_rooms
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_room public.vtt_rooms;
  target_session_id uuid;
begin
  select room.* into target_room
  from public.vtt_rooms room
  where room.id = target_room_id
    and room.archived_at is null
  for update;

  if target_room.id is null or not public.is_campaign_gm(target_room.campaign_id) then
    raise exception 'Only a GM can publish a scene in this room';
  end if;

  select session.id into target_session_id
  from public.room_sessions session
  where session.room_id = target_room.id
    and session.status = 'active'
  for update;

  if target_session_id is null then
    raise exception 'Room session is not active';
  end if;

  if not exists (
    select 1
    from public.scenes scene
    where scene.id = target_scene_id
      and scene.room_id = target_room.id
      and scene.campaign_id = target_room.campaign_id
  ) then
    raise exception 'Scene does not belong to this room';
  end if;

  update public.vtt_rooms room
  set active_scene_id = target_scene_id,
      published_session_id = target_session_id
  where room.id = target_room.id
  returning room.* into target_room;

  if target_room.name = 'Sala principal' then
    update public.campaigns campaign
    set active_scene_id = target_scene_id
    where campaign.id = target_room.campaign_id;
  end if;

  return target_room;
end;
$$;

create or replace function public.start_room_session(target_room_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_campaign_id uuid;
  active_session_id uuid;
  created_new_session boolean := false;
begin
  delete from public.room_session_events where expires_at <= now();

  select room.campaign_id into target_campaign_id
  from public.vtt_rooms room
  where room.id = target_room_id and room.archived_at is null
  for update;

  if target_campaign_id is null or not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a GM can start this room session';
  end if;

  select session.id into active_session_id
  from public.room_sessions session
  where session.room_id = target_room_id and session.status = 'active';

  if active_session_id is null then
    insert into public.room_sessions (room_id, campaign_id, started_by)
    values (target_room_id, target_campaign_id, auth.uid())
    returning id into active_session_id;
    created_new_session := true;
  end if;

  update public.vtt_rooms room
  set status = 'open',
      active_scene_id = case when created_new_session then null else room.active_scene_id end,
      published_session_id = case when created_new_session then null else room.published_session_id end
  where room.id = target_room_id;

  return active_session_id;
end;
$$;

create or replace function public.claim_player_slot(
  target_room_id uuid,
  target_slot_id uuid,
  client_connection_id uuid
)
returns public.slot_occupancies
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_room public.vtt_rooms;
  target_session public.room_sessions;
  target_slot public.player_slots;
  occupied_by uuid;
  existing_user_slot_id uuid;
  saved_occupancy public.slot_occupancies;
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required to occupy a slot';
  end if;

  if client_connection_id is null then
    raise exception 'Connection id is required';
  end if;

  select room.* into target_room
  from public.vtt_rooms room
  where room.id = target_room_id and room.archived_at is null
  for update;

  if target_room.id is null then
    raise exception 'Room is unavailable';
  end if;

  if not public.is_campaign_member(target_room.campaign_id) then
    raise exception 'Chronicle membership is required';
  end if;

  select session.* into target_session
  from public.room_sessions session
  where session.room_id = target_room_id and session.status = 'active'
  for update;

  if target_session.id is null then
    raise exception 'Room session is not active';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_session.id::text, 0));

  select slot.* into target_slot
  from public.player_slots slot
  where slot.id = target_slot_id
    and slot.room_id = target_room_id
    and slot.archived_at is null
  for update;

  if target_slot.id is null then
    raise exception 'Player slot is unavailable';
  end if;

  update public.actors actor
  set owner_user_id = null
  where actor.id in (
    select expired_slot.actor_id
    from public.slot_occupancies expired
    join public.player_slots expired_slot on expired_slot.id = expired.slot_id
    where expired.room_session_id = target_session.id
      and expired.expires_at <= now()
      and expired_slot.actor_id is not null
  ) and not exists (
    select 1
    from public.slot_occupancies live
    join public.player_slots live_slot on live_slot.id = live.slot_id
    where live_slot.actor_id = actor.id
      and live.expires_at > now()
  );

  delete from public.slot_occupancies occupancy
  where occupancy.room_session_id = target_session.id
    and occupancy.expires_at <= now();

  select occupancy.slot_id into existing_user_slot_id
  from public.slot_occupancies occupancy
  where occupancy.room_session_id = target_session.id
    and occupancy.user_id = auth.uid();

  -- A closed room rejects new entries but still permits the same authenticated
  -- user to recover their live slot after a browser refresh.
  if target_room.status <> 'open'
    and existing_user_slot_id is distinct from target_slot_id
  then
    raise exception 'Room is closed';
  end if;

  select occupancy.user_id into occupied_by
  from public.slot_occupancies occupancy
  where occupancy.room_session_id = target_session.id
    and occupancy.slot_id = target_slot_id;

  if occupied_by is not null and occupied_by <> auth.uid() then
    raise exception 'Player slot is already occupied';
  end if;

  if target_slot.actor_id is not null and exists (
    select 1
    from public.slot_occupancies occupancy
    join public.player_slots slot on slot.id = occupancy.slot_id
    join public.room_sessions session on session.id = occupancy.room_session_id
    where slot.actor_id = target_slot.actor_id
      and occupancy.user_id <> auth.uid()
      and occupancy.expires_at > now()
      and session.status = 'active'
  ) then
    raise exception 'The assigned character is already in use';
  end if;

  update public.actors actor
  set owner_user_id = null
  where actor.owner_user_id = auth.uid()
    and actor.id in (
      select current_slot.actor_id
      from public.slot_occupancies current_occupancy
      join public.player_slots current_slot on current_slot.id = current_occupancy.slot_id
      where current_occupancy.room_session_id = target_session.id
        and current_occupancy.user_id = auth.uid()
        and current_slot.actor_id is not null
    );

  delete from public.slot_occupancies occupancy
  where occupancy.room_session_id = target_session.id
    and occupancy.user_id = auth.uid();

  insert into public.slot_occupancies (
    room_session_id,
    slot_id,
    user_id,
    connection_id
  ) values (
    target_session.id,
    target_slot_id,
    auth.uid(),
    client_connection_id
  )
  returning * into saved_occupancy;

  if target_slot.actor_id is not null then
    update public.actors actor
    set owner_user_id = auth.uid(), actor_type = 'pc'
    where actor.id = target_slot.actor_id;
  end if;

  return saved_occupancy;
end;
$$;

create or replace function public.end_room_session(target_room_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_campaign_id uuid;
  target_session_id uuid;
begin
  select room.campaign_id into target_campaign_id
  from public.vtt_rooms room
  where room.id = target_room_id
  for update;

  if target_campaign_id is null or not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a GM can end this room session';
  end if;

  select session.id into target_session_id
  from public.room_sessions session
  where session.room_id = target_room_id and session.status = 'active'
  for update;

  if target_session_id is not null then
    update public.actors actor
    set owner_user_id = null
    where actor.id in (
      select slot.actor_id
      from public.slot_occupancies occupancy
      join public.player_slots slot on slot.id = occupancy.slot_id
      where occupancy.room_session_id = target_session_id
        and slot.actor_id is not null
    );

    delete from public.slot_occupancies where room_session_id = target_session_id;
    delete from public.room_session_events where room_session_id = target_session_id;

    update public.room_sessions
    set status = 'ended', ended_at = now()
    where id = target_session_id;
  end if;

  update public.vtt_rooms
  set status = 'closed',
      active_scene_id = null,
      published_session_id = null
  where id = target_room_id;
end;
$$;

revoke all on function public.is_active_scene(uuid, uuid) from public, anon;
revoke all on function public.load_room_vtt_bundle(uuid) from public, anon;
revoke all on function public.publish_room_scene(uuid, uuid) from public, anon;
revoke all on function public.start_room_session(uuid) from public, anon;
revoke all on function public.claim_player_slot(uuid, uuid, uuid) from public, anon;
revoke all on function public.end_room_session(uuid) from public, anon;

grant execute on function public.is_active_scene(uuid, uuid) to authenticated;
grant execute on function public.load_room_vtt_bundle(uuid) to authenticated;
grant execute on function public.publish_room_scene(uuid, uuid) to authenticated;
grant execute on function public.start_room_session(uuid) to authenticated;
grant execute on function public.claim_player_slot(uuid, uuid, uuid) to authenticated;
grant execute on function public.end_room_session(uuid) to authenticated;
