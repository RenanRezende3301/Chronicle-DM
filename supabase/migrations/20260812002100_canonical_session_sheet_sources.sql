-- A ficha compacta da sessão deve nascer da mesma fonte canônica usada fora do
-- VTT. Para NPCs, npc_sheets.npc_data é o pai; actors.system_data permanece
-- apenas como cache compatível para tokens e código legado.

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
      select actor.id
      from public.actors actor
      where caller_is_gm
        and actor.campaign_id = target_session.campaign_id

      union

      select slot.actor_id as id
      from public.slot_occupancies occupancy
      join public.player_slots slot on slot.id = occupancy.slot_id
      where not caller_is_gm
        and occupancy.room_session_id = target_session.id
        and occupancy.user_id = auth.uid()
        and occupancy.expires_at > now()
        and slot.room_id = target_room_id
        and slot.archived_at is null
        and slot.actor_id is not null
    ),
    sheet_rows as (
      select
        actor.*,
        coalesce(npc_sheet.npc_data, actor.system_data) as canonical_actor_data,
        link.id as link_id,
        link.session_state,
        link.session_state_version,
        character.id as character_id,
        character.owner_id as character_owner_id,
        character.character_data,
        actor_state.session_state as actor_session_state,
        actor_state.version as actor_session_version
      from actor_ids ids
      join public.actors actor on actor.id = ids.id
      left join public.npc_sheets npc_sheet on npc_sheet.id = actor.npc_sheet_id
      left join public.chronicle_characters link
        on link.id = actor.character_link_id
        and link.archived_at is null
      left join public.characters character on character.id = link.character_id
      left join public.room_actor_session_states actor_state
        on actor_state.room_session_id = target_session.id
        and actor_state.actor_id = actor.id
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
              'system_data', canonical_actor_data,
              'character_link_id', character_link_id,
              'npc_sheet_id', npc_sheet_id
            ),
            'link', case
              when caller_is_gm or character_owner_id = auth.uid()
                then jsonb_build_object(
                  'id', link_id,
                  'session_state', session_state,
                  'session_state_version', session_state_version
                )
              else null
            end,
            'character', case
              when caller_is_gm or character_owner_id = auth.uid()
                then jsonb_build_object(
                  'id', character_id,
                  'owner_id', character_owner_id,
                  'character_data', character_data
                )
              else null
            end,
            'actor_session', case
              when caller_is_gm and character_id is null
                then jsonb_build_object(
                  'session_state', coalesce(actor_session_state, '{}'::jsonb),
                  'version', coalesce(actor_session_version, 0)
                )
              else null
            end
          ))
          order by name
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

-- Mantém o estado canônico coerente quando o tipo de um NPC muda. Fome antiga
-- não reaparece ao alternar um mortal/ghoul/outro para outra tela do sistema.
create or replace function public.apply_npc_sheet_capabilities()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  normalized_type text := lower(trim(coalesce(new.npc_data ->> 'type', 'vampire')));
begin
  if normalized_type <> 'vampire' then
    new.npc_data := jsonb_set(new.npc_data, '{hunger}', '0'::jsonb, true);
    if jsonb_typeof(new.npc_data -> 'vttConditions') = 'object' then
      new.npc_data := jsonb_set(new.npc_data, '{vttConditions,hunger}', '0'::jsonb, true);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists npc_sheets_apply_capabilities on public.npc_sheets;
create trigger npc_sheets_apply_capabilities
before insert or update of npc_data on public.npc_sheets
for each row execute function public.apply_npc_sheet_capabilities();
