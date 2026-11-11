-- Alterar uma condição da ficha não pode disparar a reconciliação completa da
-- biblioteca. A reconciliação continua disponível como RPC de manutenção, mas
-- o caminho normal passa a tocar somente os atores ligados à ficha alterada.

drop trigger if exists npc_sheets_reconcile_actors on public.npc_sheets;

create or replace function public.sync_changed_npc_sheet_actors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Garante que uma ficha nova exista uma única vez em cada campanha do GM.
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
    new.npc_data,
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

  -- Atualiza apenas as cópias VTT desta ficha. owner_user_id permanece nulo:
  -- um NPC não representa o slot de um jogador.
  update public.actors actor
  set actor_type = 'npc',
      name = coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
      owner_user_id = null,
      system_key = 'vtm-v5',
      system_data = new.npc_data,
      legacy_npc_id = new.id
  where actor.npc_sheet_id = new.id;

  return new;
end;
$$;

create trigger npc_sheets_sync_changed_actors
after insert or update of npc_data on public.npc_sheets
for each row execute function public.sync_changed_npc_sheet_actors();

-- A exclusão continua removendo os atores e tokens correspondentes, porém sem
-- varrer ou regravar as demais fichas da biblioteca.
create or replace function public.delete_removed_npc_sheet_actors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.npc_actor_reconciliation_audit (
    campaign_id,
    npc_sheet_id,
    actor_snapshot,
    removed_token_count,
    removed_by
  )
  select
    actor.campaign_id,
    actor.npc_sheet_id,
    to_jsonb(actor),
    (
      select count(*)::integer
      from public.scene_items item
      where item.actor_id = actor.id
        and item.item_type = 'token'
    ),
    auth.uid()
  from public.actors actor
  join public.campaigns campaign on campaign.id = actor.campaign_id
  where actor.npc_sheet_id = old.id
    and campaign.owner_id = old.owner_id;

  delete from public.scene_items item
  using public.actors actor, public.campaigns campaign
  where item.actor_id = actor.id
    and item.item_type = 'token'
    and actor.npc_sheet_id = old.id
    and campaign.id = actor.campaign_id
    and campaign.owner_id = old.owner_id;

  delete from public.actors actor
  using public.campaigns campaign
  where actor.npc_sheet_id = old.id
    and campaign.id = actor.campaign_id
    and campaign.owner_id = old.owner_id;

  return old;
end;
$$;

create trigger npc_sheets_delete_linked_actors
before delete on public.npc_sheets
for each row execute function public.delete_removed_npc_sheet_actors();
