-- A chronicle has one live table at a time. Starting another room must use the
-- same cleanup path as ending the previous session: release player ownership,
-- clear occupancies/events and unpublish the old room.

do $$
declare
  stale_session record;
begin
  -- Repair any data created before the campaign-wide invariant existed. The
  -- newest active session remains live; older rooms are ended safely.
  for stale_session in
    select id, room_id
    from (
      select
        session.id,
        session.room_id,
        row_number() over (
          partition by session.campaign_id
          order by session.started_at desc, session.id desc
        ) as active_rank
      from public.room_sessions session
      where session.status = 'active'
    ) ranked
    where active_rank > 1
  loop
    update public.actors actor
    set owner_user_id = null
    where actor.id in (
      select slot.actor_id
      from public.slot_occupancies occupancy
      join public.player_slots slot on slot.id = occupancy.slot_id
      where occupancy.room_session_id = stale_session.id
        and slot.actor_id is not null
    );

    delete from public.slot_occupancies
    where room_session_id = stale_session.id;

    delete from public.room_session_events
    where room_session_id = stale_session.id;

    update public.room_sessions
    set status = 'ended', ended_at = now()
    where id = stale_session.id;

    update public.vtt_rooms
    set status = 'closed',
        active_scene_id = null,
        published_session_id = null
    where id = stale_session.room_id;
  end loop;
end;
$$;

create unique index if not exists room_sessions_one_active_campaign_idx
  on public.room_sessions(campaign_id)
  where status = 'active';

create or replace function public.start_room_session(target_room_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_campaign_id uuid;
  active_session_id uuid;
  previous_room_id uuid;
  created_new_session boolean := false;
begin
  delete from public.room_session_events where expires_at <= now();

  -- Resolve the campaign before locking its lifecycle. The advisory lock
  -- serializes starts for different rooms in the same chronicle, avoiding a
  -- deadlock where two tabs each lock one room and then try to close the other.
  select room.campaign_id into target_campaign_id
  from public.vtt_rooms room
  where room.id = target_room_id and room.archived_at is null;

  if target_campaign_id is null or not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a GM can start this room session';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_campaign_id::text, 0));

  select room.campaign_id into target_campaign_id
  from public.vtt_rooms room
  where room.id = target_room_id and room.archived_at is null
  for update;

  if target_campaign_id is null then
    raise exception 'Room is unavailable';
  end if;

  -- Calling the canonical end function keeps the behavior identical to an
  -- explicit "Encerrar sessão", including disconnecting/releasing players.
  for previous_room_id in
    select session.room_id
    from public.room_sessions session
    where session.campaign_id = target_campaign_id
      and session.status = 'active'
      and session.room_id <> target_room_id
    order by session.started_at, session.id
  loop
    perform public.end_room_session(previous_room_id);
  end loop;

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

revoke all on function public.start_room_session(uuid) from public, anon;
grant execute on function public.start_room_session(uuid) to authenticated;
