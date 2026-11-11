-- Chronicle 2.0: isolate publication and player access by VTT room.

-- Migrated rooms used to inherit the campaign's old "open" flag without an
-- active room session. Normalize only that impossible state.
update public.vtt_rooms room
set status = 'closed'
where room.status = 'open'
  and not exists (
    select 1
    from public.room_sessions session
    where session.room_id = room.id
      and session.status = 'active'
  );

create or replace function public.is_active_scene(
  target_campaign_id uuid,
  target_scene_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.scenes scene
    join public.vtt_rooms room
      on room.id = scene.room_id
      and room.campaign_id = scene.campaign_id
    where scene.id = target_scene_id
      and scene.campaign_id = target_campaign_id
      and room.active_scene_id = scene.id
      and room.archived_at is null
      and (
        public.is_campaign_gm(target_campaign_id)
        or exists (
          select 1
          from public.room_sessions session
          join public.slot_occupancies occupancy
            on occupancy.room_session_id = session.id
          where session.room_id = room.id
            and session.status = 'active'
            and occupancy.user_id = auth.uid()
            and occupancy.expires_at > now()
        )
      )
  );
$$;

create or replace function public.can_read_actor(target_actor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.actors actor
    where actor.id = target_actor_id
      and (
        public.is_campaign_gm(actor.campaign_id)
        or (
          public.is_campaign_member(actor.campaign_id)
          and (
            actor.owner_user_id = auth.uid()
            or exists (
              select 1
              from public.scene_items item
              where item.actor_id = actor.id
                and item.campaign_id = actor.campaign_id
                and item.item_type = 'token'
                and public.is_active_scene(item.campaign_id, item.scene_id)
                and (not item.is_hidden or item.owner_user_id = auth.uid())
            )
          )
        )
      )
  );
$$;

create or replace function public.can_read_asset(target_asset_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.assets asset
    where asset.id = target_asset_id
      and (
        public.is_campaign_gm(asset.campaign_id)
        or (
          public.is_campaign_member(asset.campaign_id)
          and (
            exists (
              select 1
              from public.scenes scene
              where scene.map_asset_id = asset.id
                and public.is_active_scene(scene.campaign_id, scene.id)
            )
            or exists (
              select 1
              from public.actors actor
              where actor.portrait_asset_id = asset.id
                and public.can_read_actor(actor.id)
            )
            or exists (
              select 1
              from public.scene_items item
              where item.asset_id = asset.id
                and item.campaign_id = asset.campaign_id
                and public.is_active_scene(item.campaign_id, item.scene_id)
                and (not item.is_hidden or item.owner_user_id = auth.uid())
            )
          )
        )
      )
  );
$$;

create or replace function public.load_room_vtt_bundle(target_room_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with selected_room as (
    select room.*
    from public.vtt_rooms room
    where room.id = target_room_id
      and room.archived_at is null
      and public.is_campaign_member(room.campaign_id)
  ),
  selected_campaign as (
    select campaign.*
    from public.campaigns campaign
    join selected_room room on room.campaign_id = campaign.id
  ),
  selected_scenes as (
    select scene.*
    from public.scenes scene
    join selected_room room
      on room.id = scene.room_id
      and room.active_scene_id = scene.id
  ),
  selected_items as (
    select item.*
    from public.scene_items item
    join selected_scenes scene on scene.id = item.scene_id
    order by item.z_index
  ),
  selected_actors as (
    select actor.*
    from public.actors actor
    where actor.id in (
      select item.actor_id
      from selected_items item
      where item.actor_id is not null
    )
  ),
  selected_asset_ids as (
    select scene.map_asset_id as id
    from selected_scenes scene
    where scene.map_asset_id is not null
    union
    select item.asset_id
    from selected_items item
    where item.asset_id is not null
    union
    select actor.portrait_asset_id
    from selected_actors actor
    where actor.portrait_asset_id is not null
  ),
  selected_assets as (
    select asset.*
    from public.assets asset
    where asset.id in (select id from selected_asset_ids)
  )
  select jsonb_build_object(
    'campaign', coalesce(
      (select to_jsonb(campaign) from selected_campaign campaign limit 1),
      'null'::jsonb
    ),
    'room', coalesce(
      (select to_jsonb(room) from selected_room room limit 1),
      'null'::jsonb
    ),
    'scenes', coalesce(
      (select jsonb_agg(to_jsonb(scene) order by scene.sort_order)
       from selected_scenes scene),
      '[]'::jsonb
    ),
    'items', coalesce(
      (select jsonb_agg(to_jsonb(item) order by item.z_index)
       from selected_items item),
      '[]'::jsonb
    ),
    'actors', coalesce(
      (select jsonb_agg(to_jsonb(actor)) from selected_actors actor),
      '[]'::jsonb
    ),
    'assets', coalesce(
      (select jsonb_agg(to_jsonb(asset)) from selected_assets asset),
      '[]'::jsonb
    )
  );
$$;

create or replace function public.publish_room_scene(
  target_room_id uuid,
  target_scene_id uuid
)
returns public.vtt_rooms
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_room public.vtt_rooms;
begin
  select room.* into target_room
  from public.vtt_rooms room
  where room.id = target_room_id
    and room.archived_at is null
  for update;

  if target_room.id is null or not public.is_campaign_gm(target_room.campaign_id) then
    raise exception 'Only a GM can publish a scene in this room';
  end if;

  if not exists (
    select 1
    from public.scenes scene
    where scene.id = target_scene_id
      and scene.room_id = target_room.id
      and scene.campaign_id = target_room.campaign_id
  ) then
    raise exception 'Scene does not belong to this room';
  end if;

  update public.vtt_rooms room
  set active_scene_id = target_scene_id
  where room.id = target_room.id
  returning room.* into target_room;

  -- Preserve the old campaign pointer only for the compatibility room.
  if target_room.name = 'Sala principal' then
    update public.campaigns campaign
    set active_scene_id = target_scene_id
    where campaign.id = target_room.campaign_id;
  end if;

  return target_room;
end;
$$;

create or replace function public.move_owned_token(
  target_item_id uuid,
  next_x numeric,
  next_y numeric,
  next_width numeric,
  next_height numeric,
  expected_version bigint
)
returns public.scene_items
language plpgsql
security definer
set search_path = ''
as $$
declare
  moved_item public.scene_items;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if next_x is null
    or next_y is null
    or next_width is null
    or next_height is null
    or expected_version is null
    or abs(next_x) > 1000000
    or abs(next_y) > 1000000
    or next_width < 20
    or next_height < 20
  then
    raise exception 'Token geometry is invalid';
  end if;

  update public.scene_items item
  set x = next_x,
      y = next_y,
      width = next_width,
      height = next_height,
      version = item.version + 1
  from public.scenes scene
  where item.id = target_item_id
    and item.scene_id = scene.id
    and item.item_type = 'token'
    and item.owner_user_id = auth.uid()
    and public.is_active_scene(item.campaign_id, item.scene_id)
    and next_width <= least(scene.width * 2, 10000)
    and next_height <= least(scene.height * 2, 10000)
    and next_x between -next_width and scene.width
    and next_y between -next_height and scene.height
    and item.version = expected_version
  returning item.* into moved_item;

  if moved_item.id is null then
    raise exception 'Token movement was denied or conflicted';
  end if;

  return moved_item;
end;
$$;

revoke execute on function public.load_room_vtt_bundle(uuid) from public, anon;
revoke execute on function public.publish_room_scene(uuid, uuid) from public, anon;

grant execute on function public.load_room_vtt_bundle(uuid) to authenticated;
grant execute on function public.publish_room_scene(uuid, uuid) to authenticated;
