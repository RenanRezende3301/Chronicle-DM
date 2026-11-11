-- Upgrade 3: shared, room-scoped session tools (turns, chat and roll log).
--
-- The records below intentionally belong to a room_session, rather than a
-- campaign. A session is transient: closing it removes its chat/roll history
-- and a new visit to the same room starts with a clean table conversation.

create table public.room_turn_states (
  room_session_id uuid primary key references public.room_sessions(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  room_id uuid not null references public.vtt_rooms(id) on delete cascade,
  participants jsonb not null default '[]'::jsonb
    check (jsonb_typeof(participants) = 'array'),
  current_turn_index integer not null default 0 check (current_turn_index >= 0),
  round integer not null default 1 check (round >= 1),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (campaign_id, room_id)
    references public.vtt_rooms(campaign_id, id)
    on delete cascade
);

create table public.room_session_events (
  id uuid primary key default gen_random_uuid(),
  room_session_id uuid not null references public.room_sessions(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  room_id uuid not null references public.vtt_rooms(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_name text not null default '' check (char_length(sender_name) <= 120),
  event_kind text not null check (event_kind in ('message', 'roll', 'system')),
  visibility text not null default 'all' check (visibility in ('all', 'gm')),
  body text not null default '' check (char_length(body) <= 2000),
  payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 16384),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  foreign key (campaign_id, room_id)
    references public.vtt_rooms(campaign_id, id)
    on delete cascade
);

create index room_session_events_feed_idx
  on public.room_session_events(room_session_id, created_at);
create index room_session_events_expiry_idx
  on public.room_session_events(expires_at);

create trigger room_turn_states_set_updated_at
before update on public.room_turn_states
for each row execute function public.set_updated_at();

-- Capital Liquido is session-editable in the compact VTT sheet. It lives in
-- the link state together with damage and Hunger so a GM can adjust it during
-- play without editing a character's creation/XP data.
create or replace function public.character_session_defaults(character_data jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'hunger', coalesce((character_data #>> '{ephemeral,hunger}')::integer, 0),
    'superficialDamage', coalesce((character_data #>> '{ephemeral,superficialDamage}')::integer, 0),
    'aggravatedDamage', coalesce((character_data #>> '{ephemeral,aggravatedDamage}')::integer, 0),
    'superficialWillpowerDamage', coalesce((character_data #>> '{ephemeral,superficialWillpowerDamage}')::integer, 0),
    'aggravatedWillpowerDamage', coalesce((character_data #>> '{ephemeral,aggravatedWillpowerDamage}')::integer, 0),
    'humanityStains', coalesce((character_data #>> '{ephemeral,humanityStains}')::integer, 0),
    'capitalLiquido', coalesce((character_data ->> 'capitalLiquido')::integer, 0)
  );
$$;

update public.chronicle_characters link
set session_state = link.session_state || jsonb_build_object(
  'capitalLiquido', coalesce((character.character_data ->> 'capitalLiquido')::integer, 0)
)
from public.characters character
where character.id = link.character_id
  and not (link.session_state ? 'capitalLiquido');

create or replace function public.update_character_session_state(
  target_link_id uuid,
  expected_session_version bigint,
  next_session_state jsonb
)
returns public.chronicle_characters
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_link public.chronicle_characters;
  target_character public.characters;
  saved_link public.chronicle_characters;
  max_hunger integer;
  session_key text;
begin
  if jsonb_typeof(next_session_state) <> 'object' then
    raise exception 'Session state must be an object';
  end if;

  if octet_length(next_session_state::text) > 16384 then
    raise exception 'Session state is too large';
  end if;

  for session_key in select jsonb_object_keys(next_session_state)
  loop
    if session_key not in (
      'hunger',
      'superficialDamage',
      'aggravatedDamage',
      'superficialWillpowerDamage',
      'aggravatedWillpowerDamage',
      'humanityStains',
      'capitalLiquido'
    ) then
      raise exception 'Session field is not allowed';
    end if;

    if jsonb_typeof(next_session_state -> session_key) <> 'number'
      or (next_session_state ->> session_key) !~ '^[0-9]+$' then
      raise exception 'Session counters must be non-negative integers';
    end if;
  end loop;

  select link.* into target_link
  from public.chronicle_characters link
  where link.id = target_link_id
    and link.archived_at is null
  for update of link;

  if target_link.id is null then
    raise exception 'Shared character was not found';
  end if;

  select character.* into target_character
  from public.characters character
  where character.id = target_link.character_id;

  if not public.is_campaign_gm(target_link.campaign_id)
    and target_character.owner_id <> auth.uid() then
    raise exception 'Only the character owner or chronicle GM can edit session state';
  end if;

  if target_link.session_state_version <> expected_session_version then
    raise exception 'Session state version conflict';
  end if;

  max_hunger := greatest(
    5,
    coalesce((target_character.character_data ->> 'bloodPotency')::integer, 0)
  );
  if coalesce((next_session_state ->> 'hunger')::integer, 0) > max_hunger then
    raise exception 'Hunger exceeds this character''s Blood Potency limit';
  end if;

  update public.chronicle_characters link
  set session_state = next_session_state
  where link.id = target_link.id
    and link.session_state_version = expected_session_version
  returning link.* into saved_link;

  if saved_link.id is null then
    raise exception 'Session state version conflict';
  end if;

  return saved_link;
end;
$$;

alter table public.room_turn_states enable row level security;
alter table public.room_session_events enable row level security;

revoke all on table public.room_turn_states from anon;
revoke all on table public.room_session_events from anon;
grant select on table public.room_turn_states to authenticated;
grant select on table public.room_session_events to authenticated;

create policy "participants read room turn state" on public.room_turn_states
for select to authenticated using (
  public.is_campaign_gm(campaign_id)
  or exists (
    select 1
    from public.room_sessions session
    join public.slot_occupancies occupancy on occupancy.room_session_id = session.id
    where session.id = room_turn_states.room_session_id
      and session.status = 'active'
      and occupancy.user_id = auth.uid()
      and occupancy.expires_at > now()
  )
);

create policy "participants read visible room events" on public.room_session_events
for select to authenticated using (
  expires_at > now()
  and (
    public.is_campaign_gm(campaign_id)
    or (
      visibility = 'all'
      and exists (
        select 1
        from public.room_sessions session
        join public.slot_occupancies occupancy on occupancy.room_session_id = session.id
        where session.id = room_session_events.room_session_id
          and session.status = 'active'
          and occupancy.user_id = auth.uid()
          and occupancy.expires_at > now()
      )
    )
  )
);

create or replace function public.get_active_room_session(target_room_id uuid)
returns public.room_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
begin
  select session.* into target_session
  from public.room_sessions session
  where session.room_id = target_room_id
    and session.status = 'active';

  if target_session.id is null then
    raise exception 'Room session is not active';
  end if;

  if not public.is_campaign_gm(target_session.campaign_id)
    and not exists (
      select 1
      from public.slot_occupancies occupancy
      where occupancy.room_session_id = target_session.id
        and occupancy.user_id = auth.uid()
        and occupancy.expires_at > now()
    ) then
    raise exception 'An active room slot is required';
  end if;

  return target_session;
end;
$$;

create or replace function public.save_room_turn_state(
  target_room_id uuid,
  next_participants jsonb,
  next_turn_index integer,
  next_round integer
)
returns public.room_turn_states
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  saved_state public.room_turn_states;
begin
  if jsonb_typeof(next_participants) <> 'array'
    or jsonb_array_length(next_participants) > 100
    or octet_length(next_participants::text) > 65536
    or next_turn_index < 0
    or next_round < 1 then
    raise exception 'Turn state is invalid';
  end if;

  select * into target_session from public.get_active_room_session(target_room_id);
  if not public.is_campaign_gm(target_session.campaign_id) then
    raise exception 'Only a GM can manage turns';
  end if;

  if jsonb_array_length(next_participants) = 0 then
    next_turn_index := 0;
  elsif next_turn_index >= jsonb_array_length(next_participants) then
    raise exception 'Current turn is outside the participant list';
  end if;

  insert into public.room_turn_states (
    room_session_id, campaign_id, room_id, participants, current_turn_index, round, updated_by
  ) values (
    target_session.id, target_session.campaign_id, target_session.room_id,
    next_participants, next_turn_index, next_round, auth.uid()
  )
  on conflict (room_session_id) do update set
    participants = excluded.participants,
    current_turn_index = excluded.current_turn_index,
    round = excluded.round,
    updated_by = excluded.updated_by
  returning * into saved_state;

  return saved_state;
end;
$$;

create or replace function public.record_room_session_event(
  target_room_id uuid,
  next_event_kind text,
  next_body text default '',
  next_payload jsonb default '{}'::jsonb,
  is_secret boolean default false
)
returns public.room_session_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  sender_label text;
  saved_event public.room_session_events;
begin
  if next_event_kind not in ('message', 'roll', 'system')
    or char_length(coalesce(next_body, '')) > 2000
    or jsonb_typeof(next_payload) <> 'object'
    or octet_length(next_payload::text) > 16384 then
    raise exception 'Room event is invalid';
  end if;

  select * into target_session from public.get_active_room_session(target_room_id);
  if is_secret and not public.is_campaign_gm(target_session.campaign_id) then
    raise exception 'Only a GM can make a secret roll';
  end if;
  if next_event_kind = 'system' and not public.is_campaign_gm(target_session.campaign_id) then
    raise exception 'Only a GM can create system events';
  end if;

  select coalesce(profile.display_name, profile.username, '') into sender_label
  from public.profiles profile
  where profile.id = auth.uid();

  delete from public.room_session_events where expires_at <= now();

  insert into public.room_session_events (
    room_session_id, campaign_id, room_id, sender_id, sender_name,
    event_kind, visibility, body, payload
  ) values (
    target_session.id, target_session.campaign_id, target_session.room_id,
    auth.uid(), coalesce(sender_label, ''), next_event_kind,
    case when is_secret then 'gm' else 'all' end,
    coalesce(next_body, ''), next_payload
  ) returning * into saved_event;

  return saved_event;
end;
$$;

-- New sessions always begin with a fresh combat tracker and an empty chat.
create or replace function public.start_room_session(target_room_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_campaign_id uuid;
  active_session_id uuid;
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
  end if;

  update public.vtt_rooms set status = 'open' where id = target_room_id;
  return active_session_id;
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

  update public.vtt_rooms set status = 'closed' where id = target_room_id;
end;
$$;

revoke all on function public.get_active_room_session(uuid) from public, anon;
revoke all on function public.save_room_turn_state(uuid, jsonb, integer, integer) from public, anon;
revoke all on function public.record_room_session_event(uuid, text, text, jsonb, boolean) from public, anon;
grant execute on function public.get_active_room_session(uuid) to authenticated;
grant execute on function public.save_room_turn_state(uuid, jsonb, integer, integer) to authenticated;
grant execute on function public.record_room_session_event(uuid, text, text, jsonb, boolean) to authenticated;

alter publication supabase_realtime add table public.room_turn_states;
alter publication supabase_realtime add table public.room_session_events;
