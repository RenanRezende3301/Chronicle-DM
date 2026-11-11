-- Corrige o nome do campo produzido pelo loop do gatilho de reconciliação.
-- Sem o alias, o record expunha `id`, mas o corpo lia `campaign_id`, fazendo
-- qualquer atualização de uma ficha de NPC abortar.

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
    select campaign.id as campaign_id
    from public.campaigns campaign
    where campaign.owner_id = sheet_owner_id
  loop
    perform public.reconcile_campaign_npc_actors_for_owner(
      campaign_row.campaign_id,
      sheet_owner_id
    );
  end loop;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;
