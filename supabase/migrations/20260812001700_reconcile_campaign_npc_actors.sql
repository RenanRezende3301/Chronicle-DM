-- A Biblioteca do Narrador é a fonte de verdade dos NPCs. Esta migração
-- elimina atores órfãos/duplicados e mantém uma ficha de NPC por campanha.

create table public.npc_actor_reconciliation_audit (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  npc_sheet_id text,
  actor_snapshot jsonb not null,
  removed_token_count integer not null default 0,
  removed_at timestamptz not null default now(),
  removed_by uuid references auth.users(id) on delete set null
);

alter table public.npc_actor_reconciliation_audit enable row level security;
revoke all on table public.npc_actor_reconciliation_audit from anon;
grant select on table public.npc_actor_reconciliation_audit to authenticated;
create policy "gms read npc actor reconciliation audit" on public.npc_actor_reconciliation_audit
for select to authenticated using (public.is_campaign_gm(campaign_id));

create or replace function public.reconcile_campaign_npc_actors_for_owner(
  target_campaign_id uuid,
  target_owner_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  removed_actor_count integer := 0;
  removed_token_count integer := 0;
  upserted_actor_count integer := 0;
begin
  -- Remove todo NPC que não pertence mais à biblioteca atual do GM, além de
  -- cópias repetidas da mesma ficha. PCs ficam totalmente fora desta consulta.
  with ranked_actors as (
    select actor.id,
      row_number() over (
        partition by actor.npc_sheet_id
        order by actor.created_at asc, actor.id asc
      ) as duplicate_rank
    from public.actors actor
    where actor.campaign_id = target_campaign_id
      and actor.actor_type = 'npc'
      and actor.character_link_id is null
      and actor.npc_sheet_id is not null
  ), removable_actors as (
    select actor.*
    from public.actors actor
    left join public.npc_sheets sheet
      on sheet.id = actor.npc_sheet_id
      and sheet.owner_id = target_owner_id
    left join ranked_actors ranked on ranked.id = actor.id
    where actor.campaign_id = target_campaign_id
      and actor.actor_type = 'npc'
      and actor.character_link_id is null
      and (
        sheet.id is null
        or actor.npc_sheet_id is null
        or ranked.duplicate_rank > 1
      )
  ), token_counts as (
    select item.actor_id, count(*)::integer as count
    from public.scene_items item
    join removable_actors actor on actor.id = item.actor_id
    where item.item_type = 'token'
    group by item.actor_id
  ), audited as (
    insert into public.npc_actor_reconciliation_audit (
      campaign_id, npc_sheet_id, actor_snapshot, removed_token_count, removed_by
    )
    select target_campaign_id, actor.npc_sheet_id, to_jsonb(actor), coalesce(tokens.count, 0), auth.uid()
    from removable_actors actor
    left join token_counts tokens on tokens.actor_id = actor.id
  ), deleted_items as (
    delete from public.scene_items item
    using removable_actors actor
    where item.actor_id = actor.id
      and item.item_type = 'token'
    returning item.id
  ), deleted_actors as (
    delete from public.actors actor
    using removable_actors removable
    where actor.id = removable.id
    returning actor.id
  )
  select
    (select count(*) from deleted_actors),
    (select count(*) from deleted_items)
  into removed_actor_count, removed_token_count;

  update public.actors actor
  set actor_type = 'npc',
      name = coalesce(nullif(sheet.npc_data ->> 'name', ''), 'NPC sem nome'),
      owner_user_id = null,
      system_key = 'vtm-v5',
      system_data = sheet.npc_data,
      legacy_npc_id = sheet.id
  from public.npc_sheets sheet
  where actor.campaign_id = target_campaign_id
    and actor.npc_sheet_id = sheet.id
    and sheet.owner_id = target_owner_id;

  insert into public.actors (
    campaign_id, actor_type, name, owner_user_id, system_key,
    system_data, legacy_npc_id, npc_sheet_id
  )
  select
    target_campaign_id,
    'npc',
    coalesce(nullif(sheet.npc_data ->> 'name', ''), 'NPC sem nome'),
    null,
    'vtm-v5',
    sheet.npc_data,
    sheet.id,
    sheet.id
  from public.npc_sheets sheet
  where sheet.owner_id = target_owner_id
    and not exists (
      select 1 from public.actors actor
      where actor.campaign_id = target_campaign_id
        and actor.npc_sheet_id = sheet.id
    );

  select count(*) into upserted_actor_count
  from public.npc_sheets sheet
  where sheet.owner_id = target_owner_id;

  return jsonb_build_object(
    'removedActors', removed_actor_count,
    'removedTokens', removed_token_count,
    'activeNpcActors', upserted_actor_count
  );
end;
$$;

-- Troca o sincronismo anterior por uma reconciliação completa. Isso também
-- evita atribuir o GM como dono de um ator NPC (atores NPC não são jogadores).
drop trigger if exists npc_sheets_sync_actors on public.npc_sheets;

create or replace function public.reconcile_npc_actors_after_sheet_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  sheet_owner_id uuid;
  campaign_row record;
begin
  if tg_op = 'DELETE' then
    sheet_owner_id := old.owner_id;
  else
    sheet_owner_id := new.owner_id;
  end if;
  for campaign_row in
    select campaign.id
    from public.campaigns campaign
    where campaign.owner_id = sheet_owner_id
  loop
    perform public.reconcile_campaign_npc_actors_for_owner(campaign_row.campaign_id, sheet_owner_id);
  end loop;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger npc_sheets_reconcile_actors
after insert or update of npc_data or delete on public.npc_sheets
for each row execute function public.reconcile_npc_actors_after_sheet_change();

-- Corrige o banco já existente antes de impor a unicidade da relação.
do $$
declare campaign_row record;
begin
  for campaign_row in
    select campaign.id as campaign_id, campaign.owner_id as user_id
    from public.campaigns campaign
  loop
    perform public.reconcile_campaign_npc_actors_for_owner(campaign_row.campaign_id, campaign_row.user_id);
  end loop;
end;
$$;

create unique index actors_campaign_npc_sheet_idx
  on public.actors(campaign_id, npc_sheet_id)
  where npc_sheet_id is not null;

create or replace function public.reconcile_campaign_npc_actors(target_campaign_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_owner_id uuid;
begin
  if not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a campaign GM can reconcile NPC actors';
  end if;
  select owner_id into campaign_owner_id from public.campaigns where id = target_campaign_id;
  return public.reconcile_campaign_npc_actors_for_owner(target_campaign_id, campaign_owner_id);
end;
$$;

revoke all on function public.reconcile_campaign_npc_actors(uuid) from public, anon;
grant execute on function public.reconcile_campaign_npc_actors(uuid) to authenticated;
