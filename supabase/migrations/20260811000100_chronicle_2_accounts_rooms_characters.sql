-- Chronicle 2.0: permanent identities, reusable characters, rooms and transient slots.
-- This migration is additive so the current Chronicle can keep running while the
-- new interfaces are connected on the chronicle-2.0 branch.

alter table public.profiles
  add column username text,
  add column preferred_mode text not null default 'player'
    check (preferred_mode in ('gm', 'player'));

update public.profiles
set username = 'user_' || left(replace(id::text, '-', ''), 12)
where username is null;

alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_format
    check (username ~ '^[a-z0-9_]{3,32}$');

create unique index profiles_username_unique_idx
  on public.profiles (lower(username));

alter table public.campaigns
  add column archived_at timestamptz;

create table public.vtt_rooms (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 120),
  status text not null default 'closed' check (status in ('open', 'closed')),
  active_scene_id uuid references public.scenes(id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, id)
);

create unique index vtt_rooms_active_name_idx
  on public.vtt_rooms (campaign_id, lower(name))
  where archived_at is null;

insert into public.vtt_rooms (
  campaign_id,
  created_by,
  name,
  status,
  active_scene_id
)
select
  campaign.id,
  campaign.owner_id,
  'Sala principal',
  'open',
  campaign.active_scene_id
from public.campaigns campaign;

alter table public.scenes add column room_id uuid;

update public.scenes scene
set room_id = room.id
from public.vtt_rooms room
where room.campaign_id = scene.campaign_id
  and room.name = 'Sala principal';

alter table public.scenes
  alter column room_id set not null,
  add constraint scenes_room_campaign_fkey
    foreign key (campaign_id, room_id)
    references public.vtt_rooms(campaign_id, id)
    on delete cascade;

create index scenes_room_sort_idx on public.scenes(room_id, sort_order);

create or replace function public.assign_scene_room()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.room_id is null then
    select room.id into new.room_id
    from public.vtt_rooms room
    where room.campaign_id = new.campaign_id
      and room.archived_at is null
    order by (room.name = 'Sala principal') desc, room.created_at, room.id
    limit 1;
  end if;

  if new.room_id is null then
    raise exception 'Create a room before adding scenes';
  end if;

  return new;
end;
$$;

create trigger scenes_assign_room
before insert or update of campaign_id, room_id on public.scenes
for each row execute function public.assign_scene_room();

create or replace function public.sync_default_room_active_scene()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.active_scene_id is distinct from old.active_scene_id then
    update public.vtt_rooms room
    set active_scene_id = new.active_scene_id
    where room.campaign_id = new.id
      and room.name = 'Sala principal'
      and room.archived_at is null;
  end if;

  return new;
end;
$$;

create trigger campaigns_sync_default_room_scene
after update of active_scene_id on public.campaigns
for each row execute function public.sync_default_room_active_scene();

create or replace function public.ensure_room_active_scene()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.active_scene_id is not null and not exists (
    select 1
    from public.scenes scene
    where scene.id = new.active_scene_id
      and scene.campaign_id = new.campaign_id
      and scene.room_id = new.id
  ) then
    raise exception 'Active scene must belong to the same room';
  end if;

  return new;
end;
$$;

create trigger vtt_rooms_validate_active_scene
before insert or update of campaign_id, active_scene_id on public.vtt_rooms
for each row execute function public.ensure_room_active_scene();

alter table public.campaign_invites
  add column room_id uuid references public.vtt_rooms(id) on delete cascade;

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  system_key text not null default 'vtm-v5'
    check (char_length(system_key) between 1 and 80),
  schema_version integer not null check (schema_version > 0),
  name text not null check (char_length(name) between 1 and 120),
  character_data jsonb not null check (jsonb_typeof(character_data) = 'object'),
  portrait_asset_id uuid references public.assets(id) on delete set null,
  portrait_path text,
  version bigint not null default 1 check (version > 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index characters_owner_updated_idx
  on public.characters(owner_id, updated_at desc)
  where archived_at is null;

create table public.chronicle_characters (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  shared_by uuid not null references auth.users(id) on delete cascade,
  can_gm_edit boolean not null default false,
  session_state jsonb not null default '{}'::jsonb
    check (jsonb_typeof(session_state) = 'object'),
  session_state_version bigint not null default 1 check (session_state_version > 0),
  archived_at timestamptz,
  shared_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, character_id),
  unique (campaign_id, id)
);

create index chronicle_characters_character_idx
  on public.chronicle_characters(character_id);

alter table public.actors
  add column character_link_id uuid,
  add constraint actors_character_link_campaign_fkey
    foreign key (campaign_id, character_link_id)
    references public.chronicle_characters(campaign_id, id)
    on delete set null (character_link_id);

create unique index actors_character_link_idx
  on public.actors(character_link_id)
  where character_link_id is not null;

create table public.player_slots (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.vtt_rooms(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  actor_id uuid references public.actors(id) on delete set null,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (campaign_id, room_id)
    references public.vtt_rooms(campaign_id, id)
    on delete cascade
);

create unique index player_slots_active_name_idx
  on public.player_slots(room_id, lower(name))
  where archived_at is null;

create unique index player_slots_active_actor_idx
  on public.player_slots(room_id, actor_id)
  where actor_id is not null and archived_at is null;

-- Existing player rows become unclaimed slots. No account or membership is
-- deleted by this migration, which keeps the rollback path intact.
insert into public.player_slots (room_id, campaign_id, name, actor_id, sort_order)
select
  room.id,
  member.campaign_id,
  member.display_name,
  owned_actor.id,
  row_number() over (
    partition by member.campaign_id
    order by member.joined_at, member.user_id
  )::integer
from public.campaign_members member
join public.vtt_rooms room
  on room.campaign_id = member.campaign_id
  and room.name = 'Sala principal'
left join lateral (
  select actor.id
  from public.actors actor
  where actor.campaign_id = member.campaign_id
    and actor.owner_user_id = member.user_id
  order by actor.created_at, actor.id
  limit 1
) owned_actor on true
where member.role = 'player'
on conflict do nothing;

create table public.room_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.vtt_rooms(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  started_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'ended')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  foreign key (campaign_id, room_id)
    references public.vtt_rooms(campaign_id, id)
    on delete cascade,
  check (
    (status = 'active' and ended_at is null)
    or (status = 'ended' and ended_at is not null)
  )
);

create unique index room_sessions_one_active_idx
  on public.room_sessions(room_id)
  where status = 'active';

create table public.slot_occupancies (
  id uuid primary key default gen_random_uuid(),
  room_session_id uuid not null references public.room_sessions(id) on delete cascade,
  slot_id uuid not null references public.player_slots(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid not null,
  claimed_at timestamptz not null default now(),
  heartbeat_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '45 seconds'),
  unique (room_session_id, slot_id),
  unique (room_session_id, user_id),
  unique (connection_id),
  check (expires_at > claimed_at)
);

create index slot_occupancies_expiry_idx on public.slot_occupancies(expires_at);

create table public.character_xp_events (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  performed_by uuid not null references auth.users(id) on delete restrict,
  event_type text not null check (event_type in ('grant', 'withdraw', 'spend', 'refund')),
  xp_delta integer not null check (xp_delta <> 0),
  reason text not null default '' check (char_length(reason) <= 500),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  reverses_event_id uuid references public.character_xp_events(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (
    (event_type in ('grant', 'refund') and xp_delta > 0)
    or (event_type in ('withdraw', 'spend') and xp_delta < 0)
  )
);

create index character_xp_events_character_idx
  on public.character_xp_events(character_id, created_at desc);

create trigger vtt_rooms_set_updated_at before update on public.vtt_rooms
for each row execute function public.set_updated_at();
create trigger characters_set_updated_at before update on public.characters
for each row execute function public.set_updated_at();
create trigger chronicle_characters_set_updated_at before update on public.chronicle_characters
for each row execute function public.set_updated_at();
create trigger player_slots_set_updated_at before update on public.player_slots
for each row execute function public.set_updated_at();

create or replace function public.can_read_character(target_character_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.characters character
    where character.id = target_character_id
      and (
        character.owner_id = auth.uid()
        or exists (
          select 1
          from public.chronicle_characters link
          where link.character_id = character.id
            and link.archived_at is null
            and public.is_campaign_gm(link.campaign_id)
        )
      )
  );
$$;

create or replace function public.can_edit_character(target_character_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.characters character
    where character.id = target_character_id
      and (
        character.owner_id = auth.uid()
        or exists (
          select 1
          from public.chronicle_characters link
          where link.character_id = character.id
            and link.archived_at is null
            and link.can_gm_edit
            and public.is_campaign_gm(link.campaign_id)
        )
      )
  );
$$;

create or replace function public.ensure_character_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'Character ownership is immutable';
  end if;

  if new.system_key is distinct from old.system_key then
    raise exception 'Character system is immutable';
  end if;

  if new.schema_version < old.schema_version then
    raise exception 'Character schema version cannot move backwards';
  end if;

  new.version = old.version + 1;
  return new;
end;
$$;

create trigger characters_protect_identity
before update on public.characters
for each row execute function public.ensure_character_identity();

create or replace function public.ensure_character_storage_path()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.portrait_path is not null
    and split_part(new.portrait_path, '/', 1) <> new.owner_id::text
  then
    raise exception 'Character portrait path must start with its owner id';
  end if;

  return new;
end;
$$;

create trigger characters_validate_storage_path
before insert or update of owner_id, portrait_path on public.characters
for each row execute function public.ensure_character_storage_path();

create or replace function public.ensure_shared_character_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.characters character
    where character.id = new.character_id
      and character.owner_id = new.shared_by
  ) then
    raise exception 'Only the character owner can share this character';
  end if;

  if not exists (
    select 1
    from public.campaign_members member
    where member.campaign_id = new.campaign_id
      and member.user_id = new.shared_by
  ) then
    raise exception 'Character owner must be a chronicle member';
  end if;

  return new;
end;
$$;

create trigger chronicle_characters_validate_owner
before insert or update of campaign_id, character_id, shared_by
on public.chronicle_characters
for each row execute function public.ensure_shared_character_owner();

create or replace function public.protect_character_link_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  character_owner_id uuid;
begin
  if new.campaign_id is distinct from old.campaign_id
    or new.character_id is distinct from old.character_id
    or new.shared_by is distinct from old.shared_by
  then
    raise exception 'Character link identity is immutable';
  end if;

  if new.can_gm_edit is distinct from old.can_gm_edit then
    select character.owner_id into character_owner_id
    from public.characters character
    where character.id = old.character_id;

    if character_owner_id is distinct from auth.uid() then
      raise exception 'Only the character owner can change GM edit permission';
    end if;
  end if;

  new.session_state_version = case
    when new.session_state is distinct from old.session_state
      then old.session_state_version + 1
    else old.session_state_version
  end;

  return new;
end;
$$;

create trigger chronicle_characters_protect_identity
before update on public.chronicle_characters
for each row execute function public.protect_character_link_identity();

create or replace function public.ensure_player_slot_links()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.vtt_rooms room
    where room.id = new.room_id
      and room.campaign_id = new.campaign_id
  ) then
    raise exception 'Slot and room must belong to the same chronicle';
  end if;

  if new.actor_id is not null and not exists (
    select 1
    from public.actors actor
    where actor.id = new.actor_id
      and actor.campaign_id = new.campaign_id
  ) then
    raise exception 'Slot actor must belong to the same chronicle';
  end if;

  return new;
end;
$$;

create trigger player_slots_validate_links
before insert or update of room_id, campaign_id, actor_id on public.player_slots
for each row execute function public.ensure_player_slot_links();

create or replace function public.ensure_invite_room()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.room_id is not null and not exists (
    select 1
    from public.vtt_rooms room
    where room.id = new.room_id
      and room.campaign_id = new.campaign_id
  ) then
    raise exception 'Invite room must belong to the same chronicle';
  end if;

  return new;
end;
$$;

create trigger campaign_invites_validate_room
before insert or update of campaign_id, room_id on public.campaign_invites
for each row execute function public.ensure_invite_room();

alter table public.vtt_rooms enable row level security;
alter table public.characters enable row level security;
alter table public.chronicle_characters enable row level security;
alter table public.player_slots enable row level security;
alter table public.room_sessions enable row level security;
alter table public.slot_occupancies enable row level security;
alter table public.character_xp_events enable row level security;

revoke all on table public.vtt_rooms from anon;
revoke all on table public.characters from anon;
revoke all on table public.chronicle_characters from anon;
revoke all on table public.player_slots from anon;
revoke all on table public.room_sessions from anon;
revoke all on table public.slot_occupancies from anon;
revoke all on table public.character_xp_events from anon;

grant select, insert, update, delete on table public.vtt_rooms to authenticated;
grant select, insert, update, delete on table public.characters to authenticated;
grant select, insert, update, delete on table public.chronicle_characters to authenticated;
grant select, insert, update, delete on table public.player_slots to authenticated;
grant select on table public.room_sessions to authenticated;
grant select on table public.slot_occupancies to authenticated;
grant select on table public.character_xp_events to authenticated;

create policy "authenticated read public profiles" on public.profiles
for select to authenticated using (true);

create policy "members read rooms" on public.vtt_rooms
for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "gms create rooms" on public.vtt_rooms
for insert to authenticated with check (
  public.is_campaign_gm(campaign_id) and created_by = auth.uid()
);
create policy "gms update rooms" on public.vtt_rooms
for update to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id));
create policy "gms delete rooms" on public.vtt_rooms
for delete to authenticated using (public.is_campaign_gm(campaign_id));

create policy "permitted users read characters" on public.characters
for select to authenticated using (
  owner_id = auth.uid() or public.can_read_character(id)
);
create policy "owners create characters" on public.characters
for insert to authenticated with check (
  owner_id = auth.uid() and public.is_permanent_user()
);
create policy "permitted users update characters" on public.characters
for update to authenticated using (public.can_edit_character(id))
with check (public.can_edit_character(id));
create policy "owners delete characters" on public.characters
for delete to authenticated using (owner_id = auth.uid());

create policy "owners and gms read character links" on public.chronicle_characters
for select to authenticated using (
  public.is_campaign_gm(campaign_id)
  or exists (
    select 1 from public.characters character
    where character.id = character_id and character.owner_id = auth.uid()
  )
);
create policy "owners share characters" on public.chronicle_characters
for insert to authenticated with check (
  shared_by = auth.uid()
  and public.is_campaign_member(campaign_id)
  and exists (
    select 1 from public.characters character
    where character.id = character_id and character.owner_id = auth.uid()
  )
);
create policy "owners and gms update character links" on public.chronicle_characters
for update to authenticated using (
  public.is_campaign_gm(campaign_id)
  or exists (
    select 1 from public.characters character
    where character.id = character_id and character.owner_id = auth.uid()
  )
) with check (
  public.is_campaign_gm(campaign_id)
  or exists (
    select 1 from public.characters character
    where character.id = character_id and character.owner_id = auth.uid()
  )
);
create policy "owners and gms remove character links" on public.chronicle_characters
for delete to authenticated using (
  public.is_campaign_gm(campaign_id)
  or exists (
    select 1 from public.characters character
    where character.id = character_id and character.owner_id = auth.uid()
  )
);

create policy "members read player slots" on public.player_slots
for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "gms manage player slots" on public.player_slots
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id));

create policy "members read room sessions" on public.room_sessions
for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "members read slot availability" on public.slot_occupancies
for select to authenticated using (
  exists (
    select 1
    from public.room_sessions session
    where session.id = room_session_id
      and public.is_campaign_member(session.campaign_id)
  )
);

create policy "owners and gms read xp history" on public.character_xp_events
for select to authenticated using (
  public.can_read_character(character_id)
);

-- Keep the existing RPC compatible with the new mandatory profile columns.
-- The provisional username can be replaced during onboarding.
create or replace function public.create_campaign(
  campaign_name text,
  gm_display_name text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_campaign_id uuid;
  normalized_campaign_name text := left(trim(campaign_name), 120);
  normalized_display_name text := left(trim(gm_display_name), 80);
  provisional_username text := 'user_' || left(replace(auth.uid()::text, '-', ''), 12);
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required to create a campaign';
  end if;

  if normalized_campaign_name is null or char_length(normalized_campaign_name) < 1 then
    raise exception 'Campaign name is required';
  end if;

  if normalized_display_name is null or char_length(normalized_display_name) < 1 then
    raise exception 'GM display name is required';
  end if;

  insert into public.profiles (id, username, display_name, preferred_mode)
  values (auth.uid(), provisional_username, normalized_display_name, 'gm')
  on conflict (id) do update set
    display_name = excluded.display_name,
    preferred_mode = 'gm';

  insert into public.campaigns (owner_id, name)
  values (auth.uid(), normalized_campaign_name)
  returning id into created_campaign_id;

  insert into public.campaign_members (campaign_id, user_id, role, display_name)
  values (created_campaign_id, auth.uid(), 'gm', normalized_display_name);

  insert into public.vtt_rooms (campaign_id, created_by, name)
  values (created_campaign_id, auth.uid(), 'Sala principal');

  return created_campaign_id;
end;
$$;

-- Chronicle 2.0 requires a permanent account and a completed public profile.
-- The legacy player_name argument remains temporarily so old clients receive a
-- clear authorization error instead of an RPC signature error.
create or replace function public.join_campaign(invite_token uuid, player_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  matching_invite public.campaign_invites%rowtype;
  profile_display_name text;
  existing_member boolean;
begin
  -- Kept only for compatibility with links opened by the previous client.
  perform player_name;

  if not public.is_permanent_user() then
    raise exception 'A permanent account is required to join a chronicle';
  end if;

  select profile.display_name into profile_display_name
  from public.profiles profile
  where profile.id = auth.uid();

  if profile_display_name is null then
    raise exception 'Complete your public profile before joining a chronicle';
  end if;

  select * into matching_invite
  from public.campaign_invites
  where token_hash = encode(extensions.digest(invite_token::text, 'sha256'), 'hex')
    and revoked_at is null
    and expires_at > now()
  for update;

  if matching_invite.id is null then
    raise exception 'Invite is invalid or expired';
  end if;

  select exists (
    select 1
    from public.campaign_members member
    where member.campaign_id = matching_invite.campaign_id
      and member.user_id = auth.uid()
  ) into existing_member;

  if existing_member then
    update public.campaign_members
    set display_name = profile_display_name
    where campaign_id = matching_invite.campaign_id
      and user_id = auth.uid();

    return matching_invite.campaign_id;
  end if;

  if matching_invite.use_count >= matching_invite.max_uses then
    raise exception 'Invite has reached its usage limit';
  end if;

  insert into public.campaign_members (campaign_id, user_id, role, display_name)
  values (matching_invite.campaign_id, auth.uid(), 'player', profile_display_name);

  update public.campaign_invites
  set use_count = use_count + 1
  where id = matching_invite.id;

  return matching_invite.campaign_id;
end;
$$;

create or replace function public.set_public_profile(
  public_username text,
  public_display_name text,
  initial_mode text default 'player'
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_username text := lower(trim(public_username));
  normalized_display_name text := left(trim(public_display_name), 80);
  saved_profile public.profiles;
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required';
  end if;

  if normalized_username !~ '^[a-z0-9_]{3,32}$' then
    raise exception 'Username must have 3 to 32 letters, numbers or underscores';
  end if;

  if normalized_display_name is null or char_length(normalized_display_name) < 1 then
    raise exception 'Display name is required';
  end if;

  if initial_mode not in ('gm', 'player') then
    raise exception 'Initial mode is invalid';
  end if;

  insert into public.profiles (id, username, display_name, preferred_mode)
  values (auth.uid(), normalized_username, normalized_display_name, initial_mode)
  on conflict (id) do update set
    username = excluded.username,
    display_name = excluded.display_name,
    preferred_mode = excluded.preferred_mode
  returning * into saved_profile;

  return saved_profile;
exception
  when unique_violation then
    raise exception 'Username is already in use';
end;
$$;

create or replace function public.create_vtt_room(
  target_campaign_id uuid,
  room_name text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_room_id uuid;
  normalized_name text := left(trim(room_name), 120);
begin
  if not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a GM can create rooms';
  end if;

  if normalized_name is null or char_length(normalized_name) < 1 then
    raise exception 'Room name is required';
  end if;

  insert into public.vtt_rooms (campaign_id, created_by, name)
  values (target_campaign_id, auth.uid(), normalized_name)
  returning id into created_room_id;

  return created_room_id;
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
begin
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

create or replace function public.set_room_open(
  target_room_id uuid,
  should_open boolean
)
returns public.vtt_rooms
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_room public.vtt_rooms;
begin
  select room.* into saved_room
  from public.vtt_rooms room
  where room.id = target_room_id;

  if saved_room.id is null or not public.is_campaign_gm(saved_room.campaign_id) then
    raise exception 'Only a GM can open or close this room';
  end if;

  if should_open and not exists (
    select 1 from public.room_sessions session
    where session.room_id = target_room_id and session.status = 'active'
  ) then
    raise exception 'Start a session before opening the room';
  end if;

  update public.vtt_rooms room
  set status = case when should_open then 'open' else 'closed' end
  where room.id = target_room_id
  returning * into saved_room;

  return saved_room;
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

  if target_room.id is null or target_room.status <> 'open' then
    raise exception 'Room is closed';
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

create or replace function public.heartbeat_player_slot(client_connection_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_expiry timestamptz;
begin
  update public.slot_occupancies occupancy
  set heartbeat_at = now(),
      expires_at = now() + interval '45 seconds'
  from public.room_sessions session
  where occupancy.connection_id = client_connection_id
    and occupancy.user_id = auth.uid()
    and session.id = occupancy.room_session_id
    and session.status = 'active'
  returning occupancy.expires_at into next_expiry;

  if next_expiry is null then
    raise exception 'Active slot occupancy was not found';
  end if;

  return next_expiry;
end;
$$;

create or replace function public.release_player_slot(client_connection_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  released_actor_id uuid;
begin
  select slot.actor_id into released_actor_id
  from public.slot_occupancies occupancy
  join public.player_slots slot on slot.id = occupancy.slot_id
  where occupancy.connection_id = client_connection_id
    and occupancy.user_id = auth.uid()
  for update of occupancy;

  delete from public.slot_occupancies occupancy
  where occupancy.connection_id = client_connection_id
    and occupancy.user_id = auth.uid();

  if released_actor_id is not null and not exists (
    select 1
    from public.slot_occupancies occupancy
    join public.player_slots slot on slot.id = occupancy.slot_id
    where slot.actor_id = released_actor_id
      and occupancy.expires_at > now()
  ) then
    update public.actors actor
    set owner_user_id = null
    where actor.id = released_actor_id and actor.owner_user_id = auth.uid();
  end if;
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

    delete from public.slot_occupancies
    where room_session_id = target_session_id;

    update public.room_sessions
    set status = 'ended', ended_at = now()
    where id = target_session_id;
  end if;

  update public.vtt_rooms set status = 'closed' where id = target_room_id;
end;
$$;

revoke execute on function public.can_read_character(uuid) from public, anon;
revoke execute on function public.can_edit_character(uuid) from public, anon;
revoke execute on function public.set_public_profile(text, text, text) from public, anon;
revoke execute on function public.create_vtt_room(uuid, text) from public, anon;
revoke execute on function public.start_room_session(uuid) from public, anon;
revoke execute on function public.set_room_open(uuid, boolean) from public, anon;
revoke execute on function public.claim_player_slot(uuid, uuid, uuid) from public, anon;
revoke execute on function public.heartbeat_player_slot(uuid) from public, anon;
revoke execute on function public.release_player_slot(uuid) from public, anon;
revoke execute on function public.end_room_session(uuid) from public, anon;

grant execute on function public.can_read_character(uuid) to authenticated;
grant execute on function public.can_edit_character(uuid) to authenticated;
grant execute on function public.set_public_profile(text, text, text) to authenticated;
grant execute on function public.create_vtt_room(uuid, text) to authenticated;
grant execute on function public.start_room_session(uuid) to authenticated;
grant execute on function public.set_room_open(uuid, boolean) to authenticated;
grant execute on function public.claim_player_slot(uuid, uuid, uuid) to authenticated;
grant execute on function public.heartbeat_player_slot(uuid) to authenticated;
grant execute on function public.release_player_slot(uuid) to authenticated;
grant execute on function public.end_room_session(uuid) to authenticated;

alter publication supabase_realtime add table public.vtt_rooms;
alter publication supabase_realtime add table public.player_slots;
alter publication supabase_realtime add table public.room_sessions;
alter publication supabase_realtime add table public.slot_occupancies;
alter publication supabase_realtime add table public.chronicle_characters;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'character-assets',
  'character-assets',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "permitted users read character storage" on storage.objects
for select to authenticated using (
  bucket_id = 'character-assets'
  and exists (
    select 1
    from public.characters character
    where character.portrait_path = name
      and public.can_read_character(character.id)
  )
);

create policy "owners upload character storage" on storage.objects
for insert to authenticated with check (
  bucket_id = 'character-assets'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "owners update character storage" on storage.objects
for update to authenticated using (
  bucket_id = 'character-assets'
  and split_part(name, '/', 1) = auth.uid()::text
) with check (
  bucket_id = 'character-assets'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "owners delete character storage" on storage.objects
for delete to authenticated using (
  bucket_id = 'character-assets'
  and split_part(name, '/', 1) = auth.uid()::text
);
