-- Ao importar a biblioteca antiga, reconecta automaticamente os atores que
-- já existem nas campanhas usando o identificador legado estável do NPC.

create or replace function public.sync_npc_sheet_actor()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.actors actor
  set npc_sheet_id = new.id
  where actor.npc_sheet_id is null
    and actor.legacy_npc_id = new.id
    and exists (
      select 1
      from public.campaign_members member
      where member.campaign_id = actor.campaign_id
        and member.user_id = new.owner_id
        and member.role = 'gm'
    );

  update public.actors actor
  set name = coalesce(nullif(new.npc_data ->> 'name', ''), actor.name),
      system_data = new.npc_data,
      owner_user_id = new.owner_id
  where actor.npc_sheet_id = new.id;
  return new;
end;
$$;

drop trigger if exists npc_sheets_sync_actors on public.npc_sheets;
create trigger npc_sheets_sync_actors
after insert or update of npc_data on public.npc_sheets
for each row execute function public.sync_npc_sheet_actor();
