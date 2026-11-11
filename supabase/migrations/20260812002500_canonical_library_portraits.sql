-- Chronicle 2.0: one durable portrait source for player characters and NPCs.
-- Portrait files remain private. Their canonical path lives on the source
-- sheet and actors only receive a derived reference for VTT rendering.

alter table public.npc_sheets
  add column if not exists portrait_path text;

create or replace function public.ensure_npc_portrait_storage_path()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.portrait_path is not null
    and split_part(new.portrait_path, '/', 1) <> new.owner_id::text
  then
    raise exception 'NPC portrait path must start with its owner id';
  end if;

  -- Keep older actor reconciliation functions compatible while portrait_path
  -- remains the authoritative, queryable column.
  if new.portrait_path is null then
    new.npc_data := new.npc_data - 'portraitPath';
  else
    new.npc_data := jsonb_set(
      new.npc_data,
      '{portraitPath}',
      to_jsonb(new.portrait_path),
      true
    );
  end if;

  return new;
end;
$$;

drop trigger if exists npc_sheets_validate_portrait_path on public.npc_sheets;
create trigger npc_sheets_validate_portrait_path
before insert or update of owner_id, portrait_path, npc_data on public.npc_sheets
for each row execute function public.ensure_npc_portrait_storage_path();

create or replace function public.can_read_library_portrait(target_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    split_part(target_path, '/', 1) = auth.uid()::text
    or exists (
      select 1
      from public.characters character
      where character.portrait_path = target_path
        and (
          character.owner_id = auth.uid()
          or exists (
            select 1
            from public.chronicle_characters link
            join public.campaign_members member
              on member.campaign_id = link.campaign_id
            where link.character_id = character.id
              and link.archived_at is null
              and member.user_id = auth.uid()
          )
        )
    )
    or exists (
      select 1
      from public.npc_sheets sheet
      join public.actors actor on actor.npc_sheet_id = sheet.id
      left join public.campaign_members member
        on member.campaign_id = actor.campaign_id
       and member.user_id = auth.uid()
      join public.campaigns campaign on campaign.id = actor.campaign_id
      where sheet.portrait_path = target_path
        and (sheet.owner_id = auth.uid() or campaign.owner_id = auth.uid() or member.user_id is not null)
    );
$$;

drop policy if exists "owners and chronicle members read character portraits" on storage.objects;
drop policy if exists "chronicle members read shared character portraits" on storage.objects;
drop policy if exists "permitted users read character portraits" on storage.objects;
create policy "permitted users read library portraits" on storage.objects
for select to authenticated using (
  bucket_id = 'character-portraits'
  and public.can_read_library_portrait(name)
);

create or replace function public.sync_changed_npc_sheet_actors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_data jsonb;
begin
  actor_data := jsonb_strip_nulls(
    new.npc_data || jsonb_build_object('portraitPath', new.portrait_path)
  );

  insert into public.actors (
    campaign_id,
    actor_type,
    name,
    owner_user_id,
    system_key,
    system_data,
    legacy_npc_id,
    npc_sheet_id
  )
  select
    campaign.id,
    'npc',
    coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
    null,
    'vtm-v5',
    actor_data,
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
  set actor_type = 'npc',
      name = coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
      owner_user_id = null,
      system_key = 'vtm-v5',
      system_data = actor_data,
      legacy_npc_id = new.id
  where actor.npc_sheet_id = new.id;

  return new;
end;
$$;

drop trigger if exists npc_sheets_sync_changed_actors on public.npc_sheets;
create trigger npc_sheets_sync_changed_actors
after insert or update of npc_data, portrait_path on public.npc_sheets
for each row execute function public.sync_changed_npc_sheet_actors();

-- Repair current actor summaries. Player portrait propagation already exists,
-- but the update also repairs actors created before that trigger was installed.
update public.actors actor
set system_data = jsonb_strip_nulls(
  actor.system_data || jsonb_build_object('portraitPath', character.portrait_path)
)
from public.chronicle_characters link
join public.characters character on character.id = link.character_id
where actor.character_link_id = link.id
  and link.archived_at is null;

update public.actors actor
set system_data = jsonb_strip_nulls(
  sheet.npc_data || jsonb_build_object('portraitPath', sheet.portrait_path)
)
from public.npc_sheets sheet
where actor.npc_sheet_id = sheet.id;

revoke all on function public.can_read_library_portrait(text) from public, anon;
grant execute on function public.can_read_library_portrait(text) to authenticated;
