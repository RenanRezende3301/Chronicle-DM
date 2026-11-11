-- A legacy VTT can be published before its local NPC has a canonical
-- npc_sheets row. When that sheet is persisted later, reuse the existing actor
-- identified by legacy_npc_id instead of creating a duplicate.

create or replace function public.sync_changed_npc_sheet_actors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_data jsonb;
  target_campaign record;
  legacy_actor_id uuid;
begin
  actor_data := jsonb_strip_nulls(
    new.npc_data || jsonb_build_object('portraitPath', new.portrait_path)
  );

  for target_campaign in
    select campaign.id
    from public.campaigns campaign
    where campaign.owner_id = new.owner_id
  loop
    if not exists (
      select 1
      from public.actors actor
      where actor.campaign_id = target_campaign.id
        and actor.npc_sheet_id = new.id
    ) then
      select actor.id into legacy_actor_id
      from public.actors actor
      where actor.campaign_id = target_campaign.id
        and actor.npc_sheet_id is null
        and actor.character_link_id is null
        and actor.legacy_npc_id = new.id
      order by actor.created_at, actor.id
      limit 1;

      if legacy_actor_id is not null then
        update public.actors actor
        set npc_sheet_id = new.id
        where actor.id = legacy_actor_id;
      else
        insert into public.actors (
          campaign_id,
          actor_type,
          name,
          owner_user_id,
          system_key,
          system_data,
          legacy_npc_id,
          npc_sheet_id
        ) values (
          target_campaign.id,
          'npc',
          coalesce(nullif(new.npc_data ->> 'name', ''), 'NPC sem nome'),
          null,
          'vtm-v5',
          actor_data,
          new.id,
          new.id
        );
      end if;
    end if;
  end loop;

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
