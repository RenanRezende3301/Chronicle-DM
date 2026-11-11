-- Humanidade é permanente na ficha, mas precisa poder ser ajustada durante a
-- sessão pelo dono da ficha e pelo narrador da crônica.

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
  safe_humanity integer := greatest(0, least(10, coalesce(next_humanity, 0)));
  caller_is_gm boolean;
  caller_controls_actor boolean;
  saved_data jsonb;
begin
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
    linked_character.owner_id = auth.uid()
    and caller_controls_actor
  ) then
    raise exception 'You cannot update this actor humanity';
  end if;

  if linked_character.id is not null then
    update public.characters character
    set character_data = jsonb_set(
      coalesce(character.character_data, '{}'::jsonb),
      '{humanity}',
      to_jsonb(safe_humanity),
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

  -- NPCs não possuem uma ficha compartilhada. Apenas o narrador pode gravar
  -- Humanidade diretamente no resumo do ator.
  if not caller_is_gm then
    raise exception 'Only the GM can update NPC humanity';
  end if;

  update public.actors actor
  set system_data = jsonb_set(
    coalesce(actor.system_data, '{}'::jsonb),
    '{humanity}',
    to_jsonb(safe_humanity),
    true
  )
  where actor.id = target_actor.id
  returning actor.system_data into saved_data;

  return jsonb_build_object(
    'actor_id', target_actor.id,
    'actor_system_data', saved_data
  );
end;
$$;

revoke all on function public.update_room_sheet_humanity(uuid, uuid, integer) from public, anon;
grant execute on function public.update_room_sheet_humanity(uuid, uuid, integer) to authenticated;
