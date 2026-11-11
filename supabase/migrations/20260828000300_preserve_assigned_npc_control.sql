-- The portrait migration redefined this trigger after assigned-player control
-- was introduced and accidentally restored every edited NPC to an unowned
-- actor. Keep the canonical portrait data without revoking an active occupant.

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
  set actor_type = case
        when public.active_actor_occupant(actor.id) is null then 'npc'
        else 'pc'
      end,
      name = coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
      owner_user_id = public.active_actor_occupant(actor.id),
      system_key = 'vtm-v5',
      system_data = actor_data,
      legacy_npc_id = new.id
  where actor.npc_sheet_id = new.id;

  return new;
end;
$$;
