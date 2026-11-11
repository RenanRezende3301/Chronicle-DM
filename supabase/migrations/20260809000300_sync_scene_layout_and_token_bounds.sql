-- Scene dimensions are edited locally and can briefly lag behind the shared
-- row. Token ownership is already enforced below, so do not reject a valid
-- move just because an older scene width/height has not reached the database.
create or replace function public.move_gm_token(
  target_item_id uuid,
  next_x numeric,
  next_y numeric,
  next_width numeric,
  next_height numeric
)
returns public.scene_items
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_scene public.scenes%rowtype;
  moved_item public.scene_items;
begin
  if auth.uid() is null then raise exception 'Authentication is required'; end if;
  if next_x is null or next_y is null or next_width is null or next_height is null
    or abs(next_x) > 1000000 or abs(next_y) > 1000000
    or next_width < 20 or next_height < 20
    or next_width > 10000 or next_height > 10000 then
    raise exception 'Token geometry is invalid';
  end if;

  select scene.* into target_scene
  from public.scene_items item
  join public.scenes scene on scene.id = item.scene_id
  where item.id = target_item_id and item.item_type = 'token';
  if target_scene.id is null then raise exception 'Token not found in this campaign'; end if;
  if not exists (
    select 1 from public.campaign_members member
    where member.campaign_id = target_scene.campaign_id
      and member.user_id = auth.uid() and member.role = 'gm'
  ) then raise exception 'GM permission is required to move this token'; end if;

  update public.scene_items item
  set x = next_x, y = next_y, width = next_width, height = next_height,
      version = item.version + 1
  where item.id = target_item_id
  returning item.* into moved_item;
  return moved_item;
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
declare moved_item public.scene_items;
begin
  if auth.uid() is null then raise exception 'Authentication is required'; end if;
  if next_x is null or next_y is null or next_width is null or next_height is null or expected_version is null
    or abs(next_x) > 1000000 or abs(next_y) > 1000000
    or next_width < 20 or next_height < 20 or next_width > 10000 or next_height > 10000 then
    raise exception 'Token geometry is invalid';
  end if;
  update public.scene_items item
  set x = next_x, y = next_y, width = next_width, height = next_height,
      version = item.version + 1
  from public.campaigns campaign
  where item.id = target_item_id and item.campaign_id = campaign.id
    and item.scene_id = campaign.active_scene_id and item.item_type = 'token'
    and item.owner_user_id = auth.uid() and public.is_campaign_member(item.campaign_id)
    and item.version = expected_version
  returning item.* into moved_item;
  if moved_item.id is null then raise exception 'Token movement was denied or conflicted'; end if;
  return moved_item;
end;
$$;

create or replace function public.update_gm_scene_layout(
  target_scene_id uuid,
  next_width numeric,
  next_height numeric,
  next_map_scale numeric
)
returns public.scenes
language plpgsql
security definer
set search_path = ''
as $$
declare updated_scene public.scenes;
begin
  if auth.uid() is null then raise exception 'Authentication is required'; end if;
  if next_width is null or next_height is null or next_map_scale is null
    or next_width < 320 or next_height < 240
    or next_width > 1000000 or next_height > 1000000
    or next_map_scale < 0.1 or next_map_scale > 4 then
    raise exception 'Scene layout is invalid';
  end if;
  update public.scenes scene
  set width = next_width, height = next_height,
      map_config = coalesce(scene.map_config, '{}'::jsonb)
        || jsonb_build_object('scale', next_map_scale)
  where scene.id = target_scene_id and public.is_campaign_gm(scene.campaign_id)
  returning scene.* into updated_scene;
  if updated_scene.id is null then raise exception 'GM permission is required to update this scene'; end if;
  return updated_scene;
end;
$$;

revoke execute on function public.update_gm_scene_layout(uuid, numeric, numeric, numeric) from public, anon;
grant execute on function public.update_gm_scene_layout(uuid, numeric, numeric, numeric) to authenticated;
