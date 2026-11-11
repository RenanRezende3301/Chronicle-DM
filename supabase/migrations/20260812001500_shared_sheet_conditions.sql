-- Uma ficha deve ter uma única fonte de verdade, dentro ou fora do VTT.
-- Estados de combate de PCs passam a morar em character_data.ephemeral.
-- NPCs recebem uma ficha canônica, que também alimenta seus atores no VTT.

create table public.npc_categories (
  id text primary key check (char_length(id) between 1 and 100),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  color text not null default '#9b742e' check (char_length(color) between 1 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.npc_sheets (
  id text primary key check (char_length(id) between 1 and 100),
  owner_id uuid not null references auth.users(id) on delete cascade,
  category_id text references public.npc_categories(id) on delete set null,
  npc_data jsonb not null check (jsonb_typeof(npc_data) = 'object'),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index npc_categories_owner_idx on public.npc_categories(owner_id, name);
create index npc_sheets_owner_updated_idx on public.npc_sheets(owner_id, updated_at desc);

create trigger npc_categories_set_updated_at
before update on public.npc_categories
for each row execute function public.set_updated_at();

create or replace function public.bump_npc_sheet_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.version = old.version + 1;
  new.updated_at = now();
  return new;
end;
$$;

create trigger npc_sheets_bump_version
before update on public.npc_sheets
for each row execute function public.bump_npc_sheet_version();

alter table public.npc_categories enable row level security;
alter table public.npc_sheets enable row level security;
revoke all on table public.npc_categories, public.npc_sheets from anon;
grant select, insert, update, delete on table public.npc_categories, public.npc_sheets to authenticated;

create policy "owners manage npc categories" on public.npc_categories
for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "owners manage npc sheets" on public.npc_sheets
for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

alter table public.actors
  add column if not exists npc_sheet_id text references public.npc_sheets(id) on delete set null;

create index if not exists actors_npc_sheet_idx
  on public.actors(npc_sheet_id)
  where npc_sheet_id is not null;

create or replace function public.sync_npc_sheet_actor()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.actors actor
  set name = coalesce(nullif(new.npc_data ->> 'name', ''), actor.name),
      system_data = new.npc_data,
      owner_user_id = new.owner_id
  where actor.npc_sheet_id = new.id;
  return new;
end;
$$;

create trigger npc_sheets_sync_actors
after update of npc_data on public.npc_sheets
for each row execute function public.sync_npc_sheet_actor();

-- Estados salvos em sala anteriormente eram a versão mais recente durante o
-- jogo. Eles são incorporados à ficha apenas quando são mais novos que ela.
update public.characters character
set character_data = jsonb_set(
  character.character_data,
  '{ephemeral}',
  coalesce(character.character_data -> 'ephemeral', '{}'::jsonb) || link.session_state,
  true
)
from public.chronicle_characters link
where link.character_id = character.id
  and link.session_state <> '{}'::jsonb
  and link.updated_at >= character.updated_at;

create or replace function public.update_room_sheet_conditions(
  target_room_id uuid,
  target_actor_id uuid,
  next_conditions jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  target_actor public.actors;
  linked_character public.characters;
  linked_npc public.npc_sheets;
  caller_is_gm boolean;
  caller_controls_actor boolean;
  state_key text;
  current_ephemeral jsonb;
  saved_data jsonb;
  max_hunger integer;
begin
  if jsonb_typeof(next_conditions) <> 'object' then
    raise exception 'Sheet conditions must be an object';
  end if;

  for state_key in select jsonb_object_keys(next_conditions)
  loop
    if state_key not in (
      'hunger', 'superficialDamage', 'aggravatedDamage',
      'superficialWillpowerDamage', 'aggravatedWillpowerDamage',
      'humanityStains', 'capitalLiquido'
    )
    or jsonb_typeof(next_conditions -> state_key) <> 'number'
    or (next_conditions ->> state_key) !~ '^[0-9]+$' then
      raise exception 'Invalid sheet condition';
    end if;
  end loop;

  select * into target_session from public.get_active_room_session(target_room_id);
  caller_is_gm := public.is_campaign_gm(target_session.campaign_id);

  select actor.* into target_actor
  from public.actors actor
  where actor.id = target_actor_id
    and actor.campaign_id = target_session.campaign_id;

  if target_actor.id is null then
    raise exception 'Actor not found in this campaign';
  end if;

  select character.* into linked_character
  from public.chronicle_characters link
  join public.characters character on character.id = link.character_id
  where link.id = target_actor.character_link_id
    and link.archived_at is null;

  select exists (
    select 1
    from public.slot_occupancies occupancy
    join public.player_slots slot on slot.id = occupancy.slot_id
    where occupancy.room_session_id = target_session.id
      and occupancy.user_id = auth.uid()
      and occupancy.expires_at > now()
      and slot.room_id = target_room_id
      and slot.archived_at is null
      and slot.actor_id = target_actor.id
  ) into caller_controls_actor;

  if not caller_is_gm and not (
    linked_character.owner_id = auth.uid() and caller_controls_actor
  ) then
    raise exception 'You cannot update these sheet conditions';
  end if;

  if linked_character.id is not null then
    max_hunger := greatest(5, coalesce((linked_character.character_data ->> 'bloodPotency')::integer, 0));
    if coalesce((next_conditions ->> 'hunger')::integer, 0) > max_hunger then
      raise exception 'Hunger exceeds the character limit';
    end if;

    current_ephemeral := coalesce(linked_character.character_data -> 'ephemeral', '{}'::jsonb);
    update public.characters character
    set character_data = jsonb_set(
      jsonb_set(
        character.character_data,
        '{ephemeral}',
        current_ephemeral || (next_conditions - 'capitalLiquido'),
        true
      ),
      '{capitalLiquido}',
      coalesce(next_conditions -> 'capitalLiquido', character.character_data -> 'capitalLiquido', '0'::jsonb),
      true
    )
    where character.id = linked_character.id
    returning character.character_data into saved_data;

    return jsonb_build_object(
      'actor_id', target_actor.id,
      'character_id', linked_character.id,
      'character_data', saved_data
    );
  end if;

  if not caller_is_gm then
    raise exception 'Only the GM can update NPC conditions';
  end if;

  select sheet.* into linked_npc
  from public.npc_sheets sheet
  where sheet.id = target_actor.npc_sheet_id;

  if linked_npc.id is null then
    -- Ator legado: conserva a compatibilidade até ele ser vinculado à ficha
    -- canônica no primeiro sincronismo da biblioteca.
    update public.actors actor
    set system_data = coalesce(actor.system_data, '{}'::jsonb) || jsonb_build_object(
      'hunger', coalesce((next_conditions ->> 'hunger')::integer, 0),
      'humanityStains', coalesce((next_conditions ->> 'humanityStains')::integer, 0),
      'capitalLiquido', coalesce((next_conditions ->> 'capitalLiquido')::integer, 0),
      'vttConditions', next_conditions
    )
    where actor.id = target_actor.id
    returning actor.system_data into saved_data;
  else
    update public.npc_sheets sheet
    set npc_data = coalesce(sheet.npc_data, '{}'::jsonb) || jsonb_build_object(
      'hunger', coalesce((next_conditions ->> 'hunger')::integer, 0),
      'humanityStains', coalesce((next_conditions ->> 'humanityStains')::integer, 0),
      'capitalLiquido', coalesce((next_conditions ->> 'capitalLiquido')::integer, 0),
      'vttConditions', next_conditions
    )
    where sheet.id = linked_npc.id
    returning sheet.npc_data into saved_data;
  end if;

  return jsonb_build_object(
    'actor_id', target_actor.id,
    'actor_system_data', saved_data
  );
end;
$$;

revoke all on function public.update_room_sheet_conditions(uuid, uuid, jsonb) from public, anon;
grant execute on function public.update_room_sheet_conditions(uuid, uuid, jsonb) to authenticated;

create or replace function public.update_character_conditions(
  target_character_id uuid,
  next_conditions jsonb
)
returns public.characters
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_character public.characters;
  state_key text;
begin
  if jsonb_typeof(next_conditions) <> 'object' then raise exception 'Sheet conditions must be an object'; end if;
  for state_key in select jsonb_object_keys(next_conditions)
  loop
    if state_key not in ('hunger', 'superficialDamage', 'aggravatedDamage', 'superficialWillpowerDamage', 'aggravatedWillpowerDamage', 'humanityStains', 'capitalLiquido')
      or jsonb_typeof(next_conditions -> state_key) <> 'number'
      or (next_conditions ->> state_key) !~ '^[0-9]+$' then
      raise exception 'Invalid sheet condition';
    end if;
  end loop;
  if not public.can_edit_character(target_character_id) then raise exception 'You cannot update this character'; end if;
  update public.characters character
  set character_data = jsonb_set(
    jsonb_set(
      character.character_data,
      '{ephemeral}',
      coalesce(character.character_data -> 'ephemeral', '{}'::jsonb) || (next_conditions - 'capitalLiquido'),
      true
    ),
    '{capitalLiquido}',
    coalesce(next_conditions -> 'capitalLiquido', character.character_data -> 'capitalLiquido', '0'::jsonb),
    true
  )
  where character.id = target_character_id
  returning character.* into target_character;
  return target_character;
end;
$$;

revoke all on function public.update_character_conditions(uuid, jsonb) from public, anon;
grant execute on function public.update_character_conditions(uuid, jsonb) to authenticated;

create or replace function public.update_room_sheet_humanity(
  target_room_id uuid,
  target_actor_id uuid,
  next_humanity integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  target_actor public.actors;
  linked_character public.characters;
  linked_npc public.npc_sheets;
  safe_humanity integer := greatest(0, least(10, coalesce(next_humanity, 0)));
  caller_is_gm boolean;
  caller_controls_actor boolean;
  saved_data jsonb;
begin
  select * into target_session from public.get_active_room_session(target_room_id);
  caller_is_gm := public.is_campaign_gm(target_session.campaign_id);

  select actor.* into target_actor from public.actors actor
  where actor.id = target_actor_id and actor.campaign_id = target_session.campaign_id;
  if target_actor.id is null then raise exception 'Actor not found in this campaign'; end if;

  select character.* into linked_character
  from public.chronicle_characters link join public.characters character on character.id = link.character_id
  where link.id = target_actor.character_link_id and link.archived_at is null;

  select exists (
    select 1 from public.slot_occupancies occupancy
    join public.player_slots slot on slot.id = occupancy.slot_id
    where occupancy.room_session_id = target_session.id and occupancy.user_id = auth.uid()
      and occupancy.expires_at > now() and slot.room_id = target_room_id
      and slot.archived_at is null and slot.actor_id = target_actor.id
  ) into caller_controls_actor;

  if not caller_is_gm and not (linked_character.owner_id = auth.uid() and caller_controls_actor) then
    raise exception 'You cannot update this actor humanity';
  end if;

  if linked_character.id is not null then
    update public.characters character
    set character_data = jsonb_set(coalesce(character.character_data, '{}'::jsonb), '{humanity}', to_jsonb(safe_humanity), true)
    where character.id = linked_character.id
    returning character.character_data into saved_data;
    return jsonb_build_object('actor_id', target_actor.id, 'character_id', linked_character.id, 'character_data', saved_data);
  end if;

  if not caller_is_gm then raise exception 'Only the GM can update NPC humanity'; end if;
  select sheet.* into linked_npc from public.npc_sheets sheet where sheet.id = target_actor.npc_sheet_id;
  if linked_npc.id is not null then
    update public.npc_sheets sheet
    set npc_data = jsonb_set(coalesce(sheet.npc_data, '{}'::jsonb), '{humanity}', to_jsonb(safe_humanity), true)
    where sheet.id = linked_npc.id
    returning sheet.npc_data into saved_data;
  else
    update public.actors actor
    set system_data = jsonb_set(coalesce(actor.system_data, '{}'::jsonb), '{humanity}', to_jsonb(safe_humanity), true)
    where actor.id = target_actor.id
    returning actor.system_data into saved_data;
  end if;
  return jsonb_build_object('actor_id', target_actor.id, 'actor_system_data', saved_data);
end;
$$;

alter publication supabase_realtime add table public.characters, public.npc_categories, public.npc_sheets;
