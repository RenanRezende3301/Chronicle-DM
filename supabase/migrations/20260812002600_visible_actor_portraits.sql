-- Players may read portraits for every actor they can actually see on the
-- published table, not only portraits owned by their own account.

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
            from public.actors actor
            join public.chronicle_characters link
              on link.id = actor.character_link_id
             and link.character_id = character.id
             and link.archived_at is null
            where public.can_read_actor(actor.id)
          )
        )
    )
    or exists (
      select 1
      from public.actors actor
      where actor.system_data ->> 'portraitPath' = target_path
        and public.can_read_actor(actor.id)
    )
    or exists (
      select 1
      from public.scene_items item
      where item.item_type = 'token'
        and item.data ->> 'characterPortraitPath' = target_path
        and item.actor_id is not null
        and public.can_read_actor(item.actor_id)
    );
$$;

-- Link legacy actors to their canonical NPC sheet when the legacy identity is
-- unambiguous. Existing canonical actors win, avoiding duplicates and unique
-- index conflicts.
with candidates as (
  select
    actor.id as actor_id,
    sheet.id as sheet_id,
    sheet.npc_data,
    sheet.portrait_path,
    row_number() over (
      partition by actor.campaign_id, sheet.id
      order by actor.created_at, actor.id
    ) as candidate_rank
  from public.actors actor
  join public.campaigns campaign on campaign.id = actor.campaign_id
  join public.npc_sheets sheet
    on sheet.owner_id = campaign.owner_id
   and sheet.id = actor.legacy_npc_id
  where actor.npc_sheet_id is null
    and actor.character_link_id is null
    and not exists (
      select 1
      from public.actors canonical
      where canonical.campaign_id = actor.campaign_id
        and canonical.npc_sheet_id = sheet.id
    )
)
update public.actors actor
set npc_sheet_id = candidate.sheet_id,
    system_data = jsonb_strip_nulls(
      actor.system_data || candidate.npc_data || jsonb_build_object(
        'portraitPath', candidate.portrait_path
      )
    )
from candidates candidate
where actor.id = candidate.actor_id
  and candidate.candidate_rank = 1;

-- Repair the derived portrait reference even when an older actor was already
-- linked but predates canonical portrait propagation.
update public.actors actor
set system_data = jsonb_strip_nulls(
  actor.system_data || sheet.npc_data || jsonb_build_object(
    'portraitPath', sheet.portrait_path
  )
)
from public.npc_sheets sheet
where actor.npc_sheet_id = sheet.id;

revoke all on function public.can_read_library_portrait(text) from public, anon;
grant execute on function public.can_read_library_portrait(text) to authenticated;
