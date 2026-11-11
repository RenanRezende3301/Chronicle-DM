-- Upgrade 3: compact sheet data is loaded through one room-scoped RPC.
-- Players receive full character data only for their own linked character;
-- the GM receives every linked character plus NPC actor data for the scene.

create or replace function public.load_room_session_sheet_bundle(target_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_session public.room_sessions;
  caller_is_gm boolean;
begin
  select * into target_session from public.get_active_room_session(target_room_id);
  caller_is_gm := public.is_campaign_gm(target_session.campaign_id);

  return (
    with actor_ids as (
      select distinct item.actor_id as id
      from public.scene_items item
      join public.vtt_rooms room on room.active_scene_id = item.scene_id
      where room.id = target_room_id
        and item.actor_id is not null
      union
      select distinct slot.actor_id as id
      from public.player_slots slot
      where slot.room_id = target_room_id
        and slot.archived_at is null
        and slot.actor_id is not null
    ),
    sheet_rows as (
      select
        actor.*,
        link.id as link_id,
        link.session_state,
        link.session_state_version,
        character.id as character_id,
        character.owner_id as character_owner_id,
        character.character_data
      from actor_ids ids
      join public.actors actor on actor.id = ids.id
      left join public.chronicle_characters link
        on link.id = actor.character_link_id
        and link.archived_at is null
      left join public.characters character on character.id = link.character_id
    )
    select jsonb_build_object(
      'session', to_jsonb(target_session),
      'sheets', coalesce(
        jsonb_agg(
          jsonb_strip_nulls(jsonb_build_object(
            'actor', jsonb_build_object(
              'id', id,
              'name', name,
              'actor_type', actor_type,
              'owner_user_id', owner_user_id,
              'portrait_asset_id', portrait_asset_id,
              'system_key', system_key,
              'system_data', system_data,
              'character_link_id', character_link_id
            ),
            'link', case
              when caller_is_gm or character_owner_id = auth.uid() then jsonb_build_object(
                'id', link_id,
                'session_state', session_state,
                'session_state_version', session_state_version
              )
              else null
            end,
            'character', case
              when caller_is_gm or character_owner_id = auth.uid() then jsonb_build_object(
                'id', character_id,
                'owner_id', character_owner_id,
                'character_data', character_data
              )
              else null
            end
          ))
        ),
        '[]'::jsonb
      )
    )
    from sheet_rows
  );
end;
$$;

revoke all on function public.load_room_session_sheet_bundle(uuid) from public, anon;
grant execute on function public.load_room_session_sheet_bundle(uuid) to authenticated;
