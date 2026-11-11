create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 120),
  system_key text not null default 'vtm-v5',
  active_scene_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaign_members (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('gm', 'player')),
  display_name text not null check (char_length(display_name) between 1 and 80),
  permissions jsonb not null default '{"drawing":false,"text":false,"assets":false}'::jsonb,
  joined_at timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

create table public.campaign_invites (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  max_uses integer not null default 20 check (max_uses between 1 and 100),
  use_count integer not null default 0 check (use_count >= 0),
  expires_at timestamptz not null default (now() + interval '30 days'),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  asset_type text not null check (asset_type in ('map', 'portrait', 'prop', 'handout')),
  bucket_id text not null default 'vtt-assets',
  object_path text not null unique,
  file_name text not null,
  content_type text not null check (content_type in ('image/png', 'image/jpeg', 'image/webp')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 52428800),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now()
);

create table public.actors (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  actor_type text not null check (actor_type in ('pc', 'npc')),
  name text not null check (char_length(name) between 1 and 120),
  owner_user_id uuid references auth.users(id) on delete set null,
  portrait_asset_id uuid references public.assets(id) on delete set null,
  system_key text not null default 'vtm-v5',
  system_data jsonb not null default '{}'::jsonb,
  legacy_npc_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, legacy_npc_id)
);

create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  sort_order integer not null default 0,
  width numeric not null default 1920 check (width >= 320),
  height numeric not null default 1080 check (height >= 240),
  background_color text not null default '#151515',
  map_asset_id uuid references public.assets(id) on delete set null,
  map_config jsonb not null default '{"scale":1}'::jsonb,
  grid_config jsonb not null default '{"enabled":false,"snap":false,"size":70,"color":"#9b742e","opacity":0.24}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaigns
  add constraint campaigns_active_scene_id_fkey
  foreign key (active_scene_id) references public.scenes(id) on delete set null;

create table public.scene_items (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  item_type text not null check (item_type in ('token', 'drawing', 'shape', 'text', 'prop', 'ping')),
  actor_id uuid references public.actors(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete set null,
  x numeric not null default 0,
  y numeric not null default 0,
  width numeric not null default 1 check (width > 0),
  height numeric not null default 1 check (height > 0),
  rotation numeric not null default 0,
  z_index integer not null default 0,
  is_hidden boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  version bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index campaign_members_user_idx on public.campaign_members(user_id);
create index actors_campaign_idx on public.actors(campaign_id);
create index scenes_campaign_sort_idx on public.scenes(campaign_id, sort_order);
create index scene_items_scene_z_idx on public.scene_items(scene_id, z_index);
create index scene_items_actor_idx on public.scene_items(actor_id) where actor_id is not null;
create index scene_items_asset_idx on public.scene_items(asset_id) where asset_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger campaigns_set_updated_at before update on public.campaigns
for each row execute function public.set_updated_at();
create trigger actors_set_updated_at before update on public.actors
for each row execute function public.set_updated_at();
create trigger scenes_set_updated_at before update on public.scenes
for each row execute function public.set_updated_at();
create trigger scene_items_set_updated_at before update on public.scene_items
for each row execute function public.set_updated_at();

create or replace function public.is_campaign_member(target_campaign_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.campaign_members
    where campaign_id = target_campaign_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_campaign_gm(target_campaign_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.campaign_members
    where campaign_id = target_campaign_id
      and user_id = auth.uid()
      and role = 'gm'
  );
$$;

create or replace function public.is_permanent_user()
returns boolean
language sql
stable
set search_path = ''
as $$
  select auth.uid() is not null
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is false;
$$;

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
    from public.campaigns campaign
    where campaign.id = target_campaign_id
      and campaign.active_scene_id = target_scene_id
  );
$$;

create or replace function public.can_read_actor(target_actor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.actors actor
    join public.campaigns campaign on campaign.id = actor.campaign_id
    where actor.id = target_actor_id
      and (
        public.is_campaign_gm(actor.campaign_id)
        or (
          public.is_campaign_member(actor.campaign_id)
          and (
            actor.owner_user_id = auth.uid()
            or exists (
              select 1
              from public.scene_items item
              where item.actor_id = actor.id
                and item.campaign_id = actor.campaign_id
                and item.scene_id = campaign.active_scene_id
                and item.item_type = 'token'
                and (not item.is_hidden or item.owner_user_id = auth.uid())
            )
          )
        )
      )
  );
$$;

create or replace function public.can_read_asset(target_asset_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.assets asset
    join public.campaigns campaign on campaign.id = asset.campaign_id
    where asset.id = target_asset_id
      and (
        public.is_campaign_gm(asset.campaign_id)
        or (
          public.is_campaign_member(asset.campaign_id)
          and (
            exists (
              select 1 from public.scenes scene
              where scene.id = campaign.active_scene_id
                and scene.map_asset_id = asset.id
            )
            or exists (
              select 1
              from public.actors actor
              where actor.portrait_asset_id = asset.id
                and public.can_read_actor(actor.id)
            )
            or exists (
              select 1
              from public.scene_items item
              where item.asset_id = asset.id
                and item.campaign_id = asset.campaign_id
                and item.scene_id = campaign.active_scene_id
                and (not item.is_hidden or item.owner_user_id = auth.uid())
            )
          )
        )
      )
  );
$$;

create or replace function public.can_access_campaign_topic(target_topic text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_campaign_id uuid;
begin
  if target_topic is null or target_topic !~* '^campaign:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_campaign_id := split_part(target_topic, ':', 2)::uuid;
  return public.is_campaign_member(target_campaign_id);
end;
$$;

create or replace function public.can_manage_vtt_storage_path(target_path text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_campaign_id uuid;
begin
  if target_path is null or target_path !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.+' then
    return false;
  end if;

  target_campaign_id := split_part(target_path, '/', 1)::uuid;
  return public.is_campaign_gm(target_campaign_id);
end;
$$;

create or replace function public.ensure_scene_item_campaign()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  linked_actor_owner uuid;
begin
  if not exists (
    select 1 from public.scenes
    where id = new.scene_id and campaign_id = new.campaign_id
  ) then
    raise exception 'Scene and item must belong to the same campaign';
  end if;

  if new.actor_id is not null then
    if new.item_type <> 'token' then
      raise exception 'Only token items can reference an actor';
    end if;

    select actor.owner_user_id into linked_actor_owner
    from public.actors actor
    where actor.id = new.actor_id
      and actor.campaign_id = new.campaign_id;

    if not found then
      raise exception 'Actor and item must belong to the same campaign';
    end if;

    if new.owner_user_id is distinct from linked_actor_owner then
      raise exception 'Token ownership must match actor ownership';
    end if;
  end if;

  if new.asset_id is not null and not exists (
    select 1 from public.assets asset
    where asset.id = new.asset_id
      and asset.campaign_id = new.campaign_id
  ) then
    raise exception 'Asset and item must belong to the same campaign';
  end if;

  if new.owner_user_id is not null and not exists (
    select 1 from public.campaign_members member
    where member.campaign_id = new.campaign_id
      and member.user_id = new.owner_user_id
  ) then
    raise exception 'Item owner must be a campaign member';
  end if;

  return new;
end;
$$;

create trigger scene_items_validate_campaign
before insert or update of scene_id, campaign_id on public.scene_items
for each row execute function public.ensure_scene_item_campaign();

create or replace function public.ensure_active_scene_campaign()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.active_scene_id is not null and not exists (
    select 1 from public.scenes scene
    where scene.id = new.active_scene_id
      and scene.campaign_id = new.id
  ) then
    raise exception 'Active scene must belong to the campaign';
  end if;

  return new;
end;
$$;

create trigger campaigns_validate_active_scene
before insert or update of active_scene_id on public.campaigns
for each row execute function public.ensure_active_scene_campaign();

create or replace function public.ensure_actor_owner_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_user_id is not null and not exists (
    select 1 from public.campaign_members member
    where member.campaign_id = new.campaign_id
      and member.user_id = new.owner_user_id
      and member.role = 'player'
  ) then
    raise exception 'Actor owner must be a player in the campaign';
  end if;

  return new;
end;
$$;

create trigger actors_validate_owner_membership
before insert or update of campaign_id, owner_user_id on public.actors
for each row execute function public.ensure_actor_owner_membership();

create or replace function public.sync_actor_token_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_user_id is distinct from old.owner_user_id then
    update public.scene_items
    set owner_user_id = new.owner_user_id
    where actor_id = new.id
      and item_type = 'token';
  end if;

  return new;
end;
$$;

create trigger actors_sync_token_owner
after update of owner_user_id on public.actors
for each row execute function public.sync_actor_token_owner();

create or replace function public.ensure_asset_storage_path()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if split_part(new.object_path, '/', 1) <> new.campaign_id::text then
    raise exception 'Asset path must start with its campaign id';
  end if;

  return new;
end;
$$;

create trigger assets_validate_storage_path
before insert or update of campaign_id, object_path on public.assets
for each row execute function public.ensure_asset_storage_path();

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.campaign_invites enable row level security;
alter table public.assets enable row level security;
alter table public.actors enable row level security;
alter table public.scenes enable row level security;
alter table public.scene_items enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.campaigns from anon;
revoke all on table public.campaign_members from anon;
revoke all on table public.campaign_invites from anon;
revoke all on table public.assets from anon;
revoke all on table public.actors from anon;
revoke all on table public.scenes from anon;
revoke all on table public.scene_items from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.campaigns to authenticated;
grant select, insert, update, delete on table public.campaign_members to authenticated;
grant select, insert, update, delete on table public.campaign_invites to authenticated;
grant select, insert, update, delete on table public.assets to authenticated;
grant select, insert, update, delete on table public.actors to authenticated;
grant select, insert, update, delete on table public.scenes to authenticated;
grant select, insert, update, delete on table public.scene_items to authenticated;

create policy "profiles read own" on public.profiles
for select to authenticated using (id = auth.uid());
create policy "profiles insert own" on public.profiles
for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "members read campaigns" on public.campaigns
for select to authenticated using (
  owner_id = auth.uid() or public.is_campaign_member(id)
);
create policy "owners create campaigns" on public.campaigns
for insert to authenticated with check (
  owner_id = auth.uid() and public.is_permanent_user()
);
create policy "gms update campaigns" on public.campaigns
for update to authenticated using (public.is_campaign_gm(id)) with check (public.is_campaign_gm(id));
create policy "owners delete campaigns" on public.campaigns
for delete to authenticated using (owner_id = auth.uid());

create policy "members read membership" on public.campaign_members
for select to authenticated using (public.is_campaign_member(campaign_id));
create policy "campaign owner adds first gm" on public.campaign_members
for insert to authenticated with check (
  user_id = auth.uid()
  and role = 'gm'
  and public.is_permanent_user()
  and exists (
    select 1 from public.campaigns
    where id = campaign_id and owner_id = auth.uid()
  )
);
create policy "gms manage membership" on public.campaign_members
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id));

create policy "gms manage invites" on public.campaign_invites
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id) and created_by = auth.uid());

create policy "members read permitted assets" on public.assets
for select to authenticated using (public.can_read_asset(id));
create policy "gms manage assets" on public.assets
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id) and uploaded_by = auth.uid());

create policy "members read permitted actors" on public.actors
for select to authenticated using (public.can_read_actor(id));
create policy "gms manage actors" on public.actors
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id));

create policy "members read scenes" on public.scenes
for select to authenticated using (
  public.is_campaign_gm(campaign_id)
  or (
    public.is_campaign_member(campaign_id)
    and public.is_active_scene(campaign_id, id)
  )
);
create policy "gms manage scenes" on public.scenes
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id));

create policy "members read permitted scene items" on public.scene_items
for select to authenticated using (
  public.is_campaign_gm(campaign_id)
  or (
    public.is_campaign_member(campaign_id)
    and public.is_active_scene(campaign_id, scene_id)
    and (not is_hidden or owner_user_id = auth.uid())
  )
);
create policy "gms manage scene items" on public.scene_items
for all to authenticated using (public.is_campaign_gm(campaign_id))
with check (public.is_campaign_gm(campaign_id));

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

  insert into public.profiles (id, display_name)
  values (auth.uid(), normalized_display_name)
  on conflict (id) do update
    set display_name = excluded.display_name;

  insert into public.campaigns (owner_id, name)
  values (auth.uid(), normalized_campaign_name)
  returning id into created_campaign_id;

  insert into public.campaign_members (campaign_id, user_id, role, display_name)
  values (created_campaign_id, auth.uid(), 'gm', normalized_display_name);

  return created_campaign_id;
end;
$$;

create or replace function public.create_campaign_invite(
  target_campaign_id uuid,
  valid_for interval default interval '30 days',
  allowed_uses integer default 20
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  plain_token uuid := gen_random_uuid();
  bounded_valid_for interval;
begin
  if not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a GM can create an invite';
  end if;

  bounded_valid_for := least(
    greatest(coalesce(valid_for, interval '30 days'), interval '1 hour'),
    interval '90 days'
  );

  insert into public.campaign_invites (
    campaign_id,
    created_by,
    token_hash,
    max_uses,
    expires_at
  ) values (
    target_campaign_id,
    auth.uid(),
    encode(extensions.digest(plain_token::text, 'sha256'), 'hex'),
    greatest(1, least(coalesce(allowed_uses, 20), 100)),
    now() + bounded_valid_for
  );

  return plain_token;
end;
$$;

create or replace function public.join_campaign(invite_token uuid, player_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  matching_invite public.campaign_invites%rowtype;
  normalized_name text := left(trim(player_name), 80);
  existing_member boolean;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if normalized_name is null or char_length(normalized_name) < 1 then
    raise exception 'Player name is required';
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
    set display_name = normalized_name
    where campaign_id = matching_invite.campaign_id
      and user_id = auth.uid();

    return matching_invite.campaign_id;
  end if;

  if matching_invite.use_count >= matching_invite.max_uses then
    raise exception 'Invite has reached its usage limit';
  end if;

  insert into public.campaign_members (campaign_id, user_id, role, display_name)
  values (matching_invite.campaign_id, auth.uid(), 'player', normalized_name)
  on conflict (campaign_id, user_id) do nothing;

  update public.campaign_invites
  set use_count = use_count + 1
  where id = matching_invite.id;

  return matching_invite.campaign_id;
end;
$$;

create or replace function public.move_owned_token(
  target_item_id uuid,
  next_x numeric,
  next_y numeric,
  next_width numeric,
  next_height numeric,
  expected_version bigint
)
returns public.scene_items
language plpgsql
security definer
set search_path = ''
as $$
declare
  moved_item public.scene_items;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if next_x is null
    or next_y is null
    or next_width is null
    or next_height is null
    or expected_version is null
    or abs(next_x) > 1000000
    or abs(next_y) > 1000000
    or next_width < 20
    or next_height < 20
  then
    raise exception 'Token geometry is invalid';
  end if;

  update public.scene_items item
  set x = next_x,
      y = next_y,
      width = next_width,
      height = next_height,
      version = item.version + 1
  from public.campaigns campaign
  join public.scenes scene on scene.id = campaign.active_scene_id
  where item.id = target_item_id
    and item.campaign_id = campaign.id
    and item.scene_id = scene.id
    and item.item_type = 'token'
    and item.owner_user_id = auth.uid()
    and public.is_campaign_member(item.campaign_id)
    and next_width <= least(scene.width * 2, 10000)
    and next_height <= least(scene.height * 2, 10000)
    and next_x between -next_width and scene.width
    and next_y between -next_height and scene.height
    and item.version = expected_version
  returning item.* into moved_item;

  if moved_item.id is null then
    raise exception 'Token movement was denied or conflicted';
  end if;

  return moved_item;
end;
$$;

grant execute on function public.create_campaign(text, text) to authenticated;
grant execute on function public.create_campaign_invite(uuid, interval, integer) to authenticated;
grant execute on function public.join_campaign(uuid, text) to authenticated;
grant execute on function public.move_owned_token(uuid, numeric, numeric, numeric, numeric, bigint) to authenticated;

revoke execute on function public.is_campaign_member(uuid) from public, anon;
revoke execute on function public.is_campaign_gm(uuid) from public, anon;
revoke execute on function public.is_permanent_user() from public, anon;
revoke execute on function public.is_active_scene(uuid, uuid) from public, anon;
revoke execute on function public.can_read_actor(uuid) from public, anon;
revoke execute on function public.can_read_asset(uuid) from public, anon;
revoke execute on function public.can_access_campaign_topic(text) from public, anon;
revoke execute on function public.can_manage_vtt_storage_path(text) from public, anon;
revoke execute on function public.create_campaign(text, text) from public, anon;
revoke execute on function public.create_campaign_invite(uuid, interval, integer) from public, anon;
revoke execute on function public.join_campaign(uuid, text) from public, anon;
revoke execute on function public.move_owned_token(uuid, numeric, numeric, numeric, numeric, bigint) from public, anon;

grant execute on function public.is_campaign_member(uuid) to authenticated;
grant execute on function public.is_campaign_gm(uuid) to authenticated;
grant execute on function public.is_permanent_user() to authenticated;
grant execute on function public.is_active_scene(uuid, uuid) to authenticated;
grant execute on function public.can_read_actor(uuid) to authenticated;
grant execute on function public.can_read_asset(uuid) to authenticated;
grant execute on function public.can_access_campaign_topic(text) to authenticated;
grant execute on function public.can_manage_vtt_storage_path(text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vtt-assets',
  'vtt-assets',
  false,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "members read vtt storage" on storage.objects
for select to authenticated using (
  bucket_id = 'vtt-assets'
  and exists (
    select 1 from public.assets asset
    where asset.object_path = name
      and public.can_read_asset(asset.id)
  )
);

create policy "gms upload vtt storage" on storage.objects
for insert to authenticated with check (
  bucket_id = 'vtt-assets'
  and public.can_manage_vtt_storage_path(name)
);

create policy "gms update vtt storage" on storage.objects
for update to authenticated using (
  bucket_id = 'vtt-assets'
  and public.can_manage_vtt_storage_path(name)
) with check (
  bucket_id = 'vtt-assets'
  and public.can_manage_vtt_storage_path(name)
);

create policy "gms delete vtt storage" on storage.objects
for delete to authenticated using (
  bucket_id = 'vtt-assets'
  and public.can_manage_vtt_storage_path(name)
);

create policy "campaign members receive realtime" on realtime.messages
for select to authenticated using (
  public.can_access_campaign_topic((select realtime.topic()))
  and realtime.messages.extension in ('broadcast', 'presence')
);

create policy "campaign members send realtime" on realtime.messages
for insert to authenticated with check (
  public.can_access_campaign_topic((select realtime.topic()))
  and realtime.messages.extension in ('broadcast', 'presence')
);

alter publication supabase_realtime add table public.campaigns;
alter publication supabase_realtime add table public.campaign_members;
alter publication supabase_realtime add table public.assets;
alter publication supabase_realtime add table public.actors;
alter publication supabase_realtime add table public.scenes;
alter publication supabase_realtime add table public.scene_items;
