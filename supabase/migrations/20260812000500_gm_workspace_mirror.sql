-- Chronicle 2.0: reversible bridge from the monolithic Shield state to
-- owner-scoped Supabase collections. The legacy backend remains untouched.

create table public.gm_workspaces (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer not null default 1 check (schema_version > 0),
  source_checksum text not null check (source_checksum ~ '^[a-f0-9]{64}$'),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  migration_status text not null default 'mirrored'
    check (migration_status in ('mirrored', 'verified')),
  mirrored_at timestamptz not null default now(),
  verified_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.gm_workspace_revisions (
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_checksum text not null check (source_checksum ~ '^[a-f0-9]{64}$'),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_at timestamptz not null default now(),
  primary key (owner_id, source_checksum)
);

create table public.gm_npc_categories (
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text not null,
  sort_order integer not null default 0,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (owner_id, legacy_id)
);

create table public.gm_npcs (
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text not null,
  sort_order integer not null default 0,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (owner_id, legacy_id)
);

create table public.gm_gallery_categories (
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text not null,
  sort_order integer not null default 0,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (owner_id, legacy_id)
);

create table public.gm_gallery_items (
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text not null,
  sort_order integer not null default 0,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (owner_id, legacy_id)
);

create table public.gm_notes (
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text not null,
  sort_order integer not null default 0,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (owner_id, legacy_id)
);

create table public.gm_tracker_scenes (
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text not null,
  sort_order integer not null default 0,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (owner_id, legacy_id)
);

alter table public.gm_workspaces enable row level security;
alter table public.gm_workspace_revisions enable row level security;
alter table public.gm_npc_categories enable row level security;
alter table public.gm_npcs enable row level security;
alter table public.gm_gallery_categories enable row level security;
alter table public.gm_gallery_items enable row level security;
alter table public.gm_notes enable row level security;
alter table public.gm_tracker_scenes enable row level security;

create policy "owners manage their gm workspace"
on public.gm_workspaces for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners read their gm workspace revisions"
on public.gm_workspace_revisions for select to authenticated
using (owner_id = (select auth.uid()));

create policy "owners manage their gm npc categories"
on public.gm_npc_categories for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners manage their gm npcs"
on public.gm_npcs for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners manage their gm gallery categories"
on public.gm_gallery_categories for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners manage their gm gallery items"
on public.gm_gallery_items for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners manage their gm notes"
on public.gm_notes for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners manage their gm tracker scenes"
on public.gm_tracker_scenes for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create or replace function public.mirror_gm_workspace(
  workspace_snapshot jsonb,
  workspace_checksum text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_checksum text := lower(trim(coalesce(workspace_checksum, '')));
  migration_time timestamptz := now();
begin
  if current_user_id is null or not public.is_permanent_user() then
    raise exception 'A permanent account is required';
  end if;

  if jsonb_typeof(workspace_snapshot) is distinct from 'object' then
    raise exception 'Workspace snapshot must be an object';
  end if;

  if normalized_checksum !~ '^[a-f0-9]{64}$' then
    raise exception 'Workspace checksum is invalid';
  end if;

  if pg_column_size(workspace_snapshot) > 25 * 1024 * 1024 then
    raise exception 'Workspace snapshot is too large';
  end if;

  if jsonb_typeof(workspace_snapshot->'categories') is distinct from 'array'
    or jsonb_typeof(workspace_snapshot->'npcs') is distinct from 'array'
    or jsonb_typeof(workspace_snapshot->'galleryCategories') is distinct from 'array'
    or jsonb_typeof(workspace_snapshot->'gallery') is distinct from 'array'
    or jsonb_typeof(workspace_snapshot->'notes') is distinct from 'array'
    or jsonb_typeof(workspace_snapshot->'sceneSaved') is distinct from 'array'
  then
    raise exception 'Workspace collections must be arrays';
  end if;

  insert into public.gm_workspace_revisions (
    owner_id, source_checksum, snapshot, created_at
  ) values (
    current_user_id, normalized_checksum, workspace_snapshot, migration_time
  ) on conflict (owner_id, source_checksum) do nothing;

  insert into public.gm_workspaces (
    owner_id, schema_version, source_checksum, snapshot,
    migration_status, mirrored_at, verified_at, updated_at
  ) values (
    current_user_id, 1, normalized_checksum, workspace_snapshot,
    'mirrored', migration_time, null, migration_time
  )
  on conflict (owner_id) do update set
    schema_version = excluded.schema_version,
    source_checksum = excluded.source_checksum,
    snapshot = excluded.snapshot,
    migration_status = 'mirrored',
    mirrored_at = excluded.mirrored_at,
    verified_at = null,
    updated_at = excluded.updated_at;

  insert into public.gm_npc_categories (
    owner_id, legacy_id, sort_order, data, archived_at, updated_at
  )
  select current_user_id,
    coalesce(nullif(entry.item->>'id', ''), '__row_' || entry.ordinality),
    entry.ordinality - 1, entry.item, null, migration_time
  from jsonb_array_elements(workspace_snapshot->'categories')
    with ordinality as entry(item, ordinality)
  on conflict (owner_id, legacy_id) do update set
    sort_order = excluded.sort_order, data = excluded.data,
    archived_at = null, updated_at = excluded.updated_at;

  update public.gm_npc_categories target set
    archived_at = migration_time, updated_at = migration_time
  where target.owner_id = current_user_id and target.archived_at is null
    and not exists (
      select 1 from jsonb_array_elements(workspace_snapshot->'categories')
        with ordinality as entry(item, ordinality)
      where target.legacy_id = coalesce(
        nullif(entry.item->>'id', ''), '__row_' || entry.ordinality
      )
    );

  insert into public.gm_npcs (
    owner_id, legacy_id, sort_order, data, archived_at, updated_at
  )
  select current_user_id,
    coalesce(nullif(entry.item->>'id', ''), '__row_' || entry.ordinality),
    entry.ordinality - 1, entry.item, null, migration_time
  from jsonb_array_elements(workspace_snapshot->'npcs')
    with ordinality as entry(item, ordinality)
  on conflict (owner_id, legacy_id) do update set
    sort_order = excluded.sort_order, data = excluded.data,
    archived_at = null, updated_at = excluded.updated_at;

  update public.gm_npcs target set
    archived_at = migration_time, updated_at = migration_time
  where target.owner_id = current_user_id and target.archived_at is null
    and not exists (
      select 1 from jsonb_array_elements(workspace_snapshot->'npcs')
        with ordinality as entry(item, ordinality)
      where target.legacy_id = coalesce(
        nullif(entry.item->>'id', ''), '__row_' || entry.ordinality
      )
    );

  insert into public.gm_gallery_categories (
    owner_id, legacy_id, sort_order, data, archived_at, updated_at
  )
  select current_user_id,
    coalesce(nullif(entry.item->>'id', ''), '__row_' || entry.ordinality),
    entry.ordinality - 1, entry.item, null, migration_time
  from jsonb_array_elements(workspace_snapshot->'galleryCategories')
    with ordinality as entry(item, ordinality)
  on conflict (owner_id, legacy_id) do update set
    sort_order = excluded.sort_order, data = excluded.data,
    archived_at = null, updated_at = excluded.updated_at;

  update public.gm_gallery_categories target set
    archived_at = migration_time, updated_at = migration_time
  where target.owner_id = current_user_id and target.archived_at is null
    and not exists (
      select 1 from jsonb_array_elements(workspace_snapshot->'galleryCategories')
        with ordinality as entry(item, ordinality)
      where target.legacy_id = coalesce(
        nullif(entry.item->>'id', ''), '__row_' || entry.ordinality
      )
    );

  insert into public.gm_gallery_items (
    owner_id, legacy_id, sort_order, data, archived_at, updated_at
  )
  select current_user_id,
    coalesce(nullif(entry.item->>'id', ''), '__row_' || entry.ordinality),
    entry.ordinality - 1, entry.item, null, migration_time
  from jsonb_array_elements(workspace_snapshot->'gallery')
    with ordinality as entry(item, ordinality)
  on conflict (owner_id, legacy_id) do update set
    sort_order = excluded.sort_order, data = excluded.data,
    archived_at = null, updated_at = excluded.updated_at;

  update public.gm_gallery_items target set
    archived_at = migration_time, updated_at = migration_time
  where target.owner_id = current_user_id and target.archived_at is null
    and not exists (
      select 1 from jsonb_array_elements(workspace_snapshot->'gallery')
        with ordinality as entry(item, ordinality)
      where target.legacy_id = coalesce(
        nullif(entry.item->>'id', ''), '__row_' || entry.ordinality
      )
    );

  insert into public.gm_notes (
    owner_id, legacy_id, sort_order, data, archived_at, updated_at
  )
  select current_user_id,
    coalesce(nullif(entry.item->>'id', ''), '__row_' || entry.ordinality),
    entry.ordinality - 1, entry.item, null, migration_time
  from jsonb_array_elements(workspace_snapshot->'notes')
    with ordinality as entry(item, ordinality)
  on conflict (owner_id, legacy_id) do update set
    sort_order = excluded.sort_order, data = excluded.data,
    archived_at = null, updated_at = excluded.updated_at;

  update public.gm_notes target set
    archived_at = migration_time, updated_at = migration_time
  where target.owner_id = current_user_id and target.archived_at is null
    and not exists (
      select 1 from jsonb_array_elements(workspace_snapshot->'notes')
        with ordinality as entry(item, ordinality)
      where target.legacy_id = coalesce(
        nullif(entry.item->>'id', ''), '__row_' || entry.ordinality
      )
    );

  insert into public.gm_tracker_scenes (
    owner_id, legacy_id, sort_order, data, archived_at, updated_at
  )
  select current_user_id,
    coalesce(nullif(entry.item->>'id', ''), '__row_' || entry.ordinality),
    entry.ordinality - 1, entry.item, null, migration_time
  from jsonb_array_elements(workspace_snapshot->'sceneSaved')
    with ordinality as entry(item, ordinality)
  on conflict (owner_id, legacy_id) do update set
    sort_order = excluded.sort_order, data = excluded.data,
    archived_at = null, updated_at = excluded.updated_at;

  update public.gm_tracker_scenes target set
    archived_at = migration_time, updated_at = migration_time
  where target.owner_id = current_user_id and target.archived_at is null
    and not exists (
      select 1 from jsonb_array_elements(workspace_snapshot->'sceneSaved')
        with ordinality as entry(item, ordinality)
      where target.legacy_id = coalesce(
        nullif(entry.item->>'id', ''), '__row_' || entry.ordinality
      )
    );

  return jsonb_build_object(
    'checksum', normalized_checksum,
    'status', 'mirrored',
    'counts', jsonb_build_object(
      'npcCategories', jsonb_array_length(workspace_snapshot->'categories'),
      'npcs', jsonb_array_length(workspace_snapshot->'npcs'),
      'galleryCategories', jsonb_array_length(workspace_snapshot->'galleryCategories'),
      'galleryItems', jsonb_array_length(workspace_snapshot->'gallery'),
      'notes', jsonb_array_length(workspace_snapshot->'notes'),
      'trackerScenes', jsonb_array_length(workspace_snapshot->'sceneSaved')
    )
  );
end;
$$;

create or replace function public.verify_gm_workspace_mirror(
  expected_checksum text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  workspace_row public.gm_workspaces%rowtype;
  expected_counts jsonb;
  actual_counts jsonb;
  is_valid boolean;
begin
  if current_user_id is null or not public.is_permanent_user() then
    raise exception 'A permanent account is required';
  end if;

  select * into workspace_row
  from public.gm_workspaces workspace
  where workspace.owner_id = current_user_id;

  if not found then
    raise exception 'No mirrored workspace was found';
  end if;

  expected_counts := jsonb_build_object(
    'npcCategories', jsonb_array_length(workspace_row.snapshot->'categories'),
    'npcs', jsonb_array_length(workspace_row.snapshot->'npcs'),
    'galleryCategories', jsonb_array_length(workspace_row.snapshot->'galleryCategories'),
    'galleryItems', jsonb_array_length(workspace_row.snapshot->'gallery'),
    'notes', jsonb_array_length(workspace_row.snapshot->'notes'),
    'trackerScenes', jsonb_array_length(workspace_row.snapshot->'sceneSaved')
  );

  actual_counts := jsonb_build_object(
    'npcCategories', (select count(*) from public.gm_npc_categories where owner_id = current_user_id and archived_at is null),
    'npcs', (select count(*) from public.gm_npcs where owner_id = current_user_id and archived_at is null),
    'galleryCategories', (select count(*) from public.gm_gallery_categories where owner_id = current_user_id and archived_at is null),
    'galleryItems', (select count(*) from public.gm_gallery_items where owner_id = current_user_id and archived_at is null),
    'notes', (select count(*) from public.gm_notes where owner_id = current_user_id and archived_at is null),
    'trackerScenes', (select count(*) from public.gm_tracker_scenes where owner_id = current_user_id and archived_at is null)
  );

  is_valid := expected_counts = actual_counts
    and (expected_checksum is null or lower(trim(expected_checksum)) = workspace_row.source_checksum);

  if is_valid then
    update public.gm_workspaces set
      migration_status = 'verified', verified_at = now(), updated_at = now()
    where owner_id = current_user_id;
  end if;

  return jsonb_build_object(
    'valid', is_valid,
    'checksum', workspace_row.source_checksum,
    'expectedCounts', expected_counts,
    'actualCounts', actual_counts,
    'status', case when is_valid then 'verified' else 'mismatch' end
  );
end;
$$;

create or replace function public.restore_gm_workspace_revision(
  revision_checksum text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_checksum text := lower(trim(coalesce(revision_checksum, '')));
  revision_snapshot jsonb;
begin
  if current_user_id is null or not public.is_permanent_user() then
    raise exception 'A permanent account is required';
  end if;

  select revision.snapshot into revision_snapshot
  from public.gm_workspace_revisions revision
  where revision.owner_id = current_user_id
    and revision.source_checksum = normalized_checksum;

  if revision_snapshot is null then
    raise exception 'Workspace revision was not found';
  end if;

  return public.mirror_gm_workspace(revision_snapshot, normalized_checksum);
end;
$$;

revoke all on table public.gm_workspaces from anon;
revoke all on table public.gm_workspace_revisions from anon;
revoke all on table public.gm_npc_categories from anon;
revoke all on table public.gm_npcs from anon;
revoke all on table public.gm_gallery_categories from anon;
revoke all on table public.gm_gallery_items from anon;
revoke all on table public.gm_notes from anon;
revoke all on table public.gm_tracker_scenes from anon;

grant select on table public.gm_workspaces to authenticated;
grant select on table public.gm_workspace_revisions to authenticated;
grant select on table public.gm_npc_categories to authenticated;
grant select on table public.gm_npcs to authenticated;
grant select on table public.gm_gallery_categories to authenticated;
grant select on table public.gm_gallery_items to authenticated;
grant select on table public.gm_notes to authenticated;
grant select on table public.gm_tracker_scenes to authenticated;

revoke all on function public.mirror_gm_workspace(jsonb, text) from public;
revoke all on function public.mirror_gm_workspace(jsonb, text) from anon;
grant execute on function public.mirror_gm_workspace(jsonb, text) to authenticated;

revoke all on function public.verify_gm_workspace_mirror(text) from public;
revoke all on function public.verify_gm_workspace_mirror(text) from anon;
grant execute on function public.verify_gm_workspace_mirror(text) to authenticated;

revoke all on function public.restore_gm_workspace_revision(text) from public;
revoke all on function public.restore_gm_workspace_revision(text) from anon;
grant execute on function public.restore_gm_workspace_revision(text) to authenticated;
