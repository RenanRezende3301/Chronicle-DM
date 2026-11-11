-- Chronicle 2.0: expose only a shared character portrait to fellow chronicle
-- members so linked VTT tokens can render it. The character sheet stays private.

create or replace function public.can_read_character_portrait(target_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
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
  );
$$;

drop policy if exists "permitted users read character portraits" on storage.objects;
create policy "chronicle members read shared character portraits" on storage.objects
for select to authenticated using (
  bucket_id = 'character-portraits'
  and public.can_read_character_portrait(name)
);

create or replace function public.sync_character_link_actor()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  linked_character public.characters;
  usable_portrait_id uuid;
  linked_system_data jsonb;
begin
  if new.archived_at is not null then
    update public.actors actor
    set character_link_id = null
    where actor.character_link_id = new.id;
    return new;
  end if;

  select character.* into linked_character
  from public.characters character
  where character.id = new.character_id;

  if linked_character.id is null then
    return new;
  end if;

  select asset.id into usable_portrait_id
  from public.assets asset
  where asset.id = linked_character.portrait_asset_id
    and asset.campaign_id = new.campaign_id;

  linked_system_data := jsonb_strip_nulls(
    public.character_actor_summary(linked_character.character_data)
    || jsonb_build_object('portraitPath', linked_character.portrait_path)
  );

  insert into public.actors (
    campaign_id, actor_type, name, portrait_asset_id,
    system_key, system_data, character_link_id
  ) values (
    new.campaign_id, 'pc', linked_character.name, usable_portrait_id,
    linked_character.system_key, linked_system_data, new.id
  )
  on conflict (character_link_id) where character_link_id is not null
  do update set
    name = excluded.name,
    actor_type = 'pc',
    portrait_asset_id = excluded.portrait_asset_id,
    system_key = excluded.system_key,
    system_data = excluded.system_data;

  return new;
end;
$$;

create or replace function public.sync_character_actor_data()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.actors actor
  set name = new.name,
      system_key = new.system_key,
      system_data = jsonb_strip_nulls(
        public.character_actor_summary(new.character_data)
        || jsonb_build_object('portraitPath', new.portrait_path)
      ),
      portrait_asset_id = case
        when exists (
          select 1 from public.assets asset
          where asset.id = new.portrait_asset_id
            and asset.campaign_id = actor.campaign_id
        ) then new.portrait_asset_id
        else null
      end
  from public.chronicle_characters link
  where link.id = actor.character_link_id
    and link.character_id = new.id
    and link.archived_at is null;

  return new;
end;
$$;

drop trigger if exists characters_sync_linked_actors on public.characters;
create trigger characters_sync_linked_actors
after update of name, character_data, portrait_asset_id, portrait_path on public.characters
for each row execute function public.sync_character_actor_data();

update public.actors actor
set system_data = jsonb_strip_nulls(
  public.character_actor_summary(character.character_data)
  || jsonb_build_object('portraitPath', character.portrait_path)
)
from public.chronicle_characters link
join public.characters character on character.id = link.character_id
where actor.character_link_id = link.id
  and link.archived_at is null;

revoke all on function public.can_read_character_portrait(text) from public;
revoke all on function public.can_read_character_portrait(text) from anon;
grant execute on function public.can_read_character_portrait(text) to authenticated;
