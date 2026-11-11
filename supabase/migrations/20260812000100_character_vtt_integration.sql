-- Chronicle 2.0 · shared sheet session state and automatic VTT actors.

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
    'humanityStains', coalesce((character_data #>> '{ephemeral,humanityStains}')::integer, 0)
  );
$$;

create or replace function public.character_actor_summary(character_data jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'source', 'shared-character',
    'clan', nullif(character_data ->> 'clan', ''),
    'concept', nullif(character_data ->> 'description', ''),
    'generation', case
      when (character_data ->> 'generation') ~ '^[0-9]+$'
        then (character_data ->> 'generation')::integer
      else null
    end
  ));
$$;

create or replace function public.ensure_shared_character_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  shared_character public.characters;
begin
  select character.* into shared_character
  from public.characters character
  where character.id = new.character_id
    and character.owner_id = new.shared_by;

  if shared_character.id is null then
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

  if tg_op = 'INSERT' and new.session_state = '{}'::jsonb then
    new.session_state = public.character_session_defaults(shared_character.character_data);
  end if;

  return new;
end;
$$;

create or replace function public.sync_character_link_actor()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  linked_character public.characters;
  usable_portrait_id uuid;
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

  insert into public.actors (
    campaign_id,
    actor_type,
    name,
    portrait_asset_id,
    system_key,
    system_data,
    character_link_id
  ) values (
    new.campaign_id,
    'pc',
    linked_character.name,
    usable_portrait_id,
    linked_character.system_key,
    public.character_actor_summary(linked_character.character_data),
    new.id
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

create trigger chronicle_characters_sync_actor
after insert or update of archived_at on public.chronicle_characters
for each row execute function public.sync_character_link_actor();

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
      system_data = public.character_actor_summary(new.character_data),
      portrait_asset_id = case
        when exists (
          select 1
          from public.assets asset
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

create trigger characters_sync_linked_actors
after update of name, character_data, portrait_asset_id on public.characters
for each row execute function public.sync_character_actor_data();

insert into public.actors (
  campaign_id,
  actor_type,
  name,
  portrait_asset_id,
  system_key,
  system_data,
  character_link_id
)
select
  link.campaign_id,
  'pc',
  character.name,
  portrait.id,
  character.system_key,
  public.character_actor_summary(character.character_data),
  link.id
from public.chronicle_characters link
join public.characters character on character.id = link.character_id
left join public.assets portrait
  on portrait.id = character.portrait_asset_id
  and portrait.campaign_id = link.campaign_id
where link.archived_at is null
on conflict (character_link_id) where character_link_id is not null
do update set
  name = excluded.name,
  actor_type = 'pc',
  portrait_asset_id = excluded.portrait_asset_id,
  system_key = excluded.system_key,
  system_data = excluded.system_data;

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
  saved_link public.chronicle_characters;
  session_value jsonb;
begin
  if jsonb_typeof(next_session_state) <> 'object' then
    raise exception 'Session state must be an object';
  end if;

  if octet_length(next_session_state::text) > 16384 then
    raise exception 'Session state is too large';
  end if;

  for session_value in
    select value
    from jsonb_each(next_session_state)
  loop
    if jsonb_typeof(session_value) = 'number'
      and (session_value::text)::numeric < 0
    then
      raise exception 'Session counters cannot be negative';
    end if;
  end loop;

  select link.* into target_link
  from public.chronicle_characters link
  where link.id = target_link_id
    and link.archived_at is null
  for update;

  if target_link.id is null then
    raise exception 'Shared character was not found';
  end if;

  if not public.is_campaign_gm(target_link.campaign_id)
    and not exists (
      select 1
      from public.characters character
      where character.id = target_link.character_id
        and character.owner_id = auth.uid()
    )
  then
    raise exception 'Only the character owner or chronicle GM can edit session state';
  end if;

  if target_link.session_state_version <> expected_session_version then
    raise exception 'Session state version conflict';
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

revoke all on function public.update_character_session_state(uuid, bigint, jsonb) from public;
revoke all on function public.update_character_session_state(uuid, bigint, jsonb) from anon;
grant execute on function public.update_character_session_state(uuid, bigint, jsonb) to authenticated;
