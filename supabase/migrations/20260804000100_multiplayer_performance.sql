create or replace function public.load_published_vtt_bundle(
  target_campaign_id uuid
)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with selected_campaign as (
    select campaign.*
    from public.campaigns campaign
    where campaign.id = target_campaign_id
  ),
  selected_scenes as (
    select scene.*
    from public.scenes scene
    join selected_campaign campaign
      on campaign.active_scene_id = scene.id
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
  moved_item public.scene_items;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if next_x is null
    or next_y is null
    or next_width is null
    or next_height is null
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
    and public.is_campaign_gm(item.campaign_id)
    and next_width <= least(scene.width * 2, 10000)
    and next_height <= least(scene.height * 2, 10000)
    and next_x between -next_width and scene.width
    and next_y between -next_height and scene.height
  returning item.* into moved_item;

  if moved_item.id is null then
    raise exception 'GM token movement was denied';
  end if;

  return moved_item;
end;
$$;

revoke execute on function public.load_published_vtt_bundle(uuid) from public, anon;
revoke execute on function public.move_gm_token(uuid, numeric, numeric, numeric, numeric) from public, anon;

grant execute on function public.load_published_vtt_bundle(uuid) to authenticated;
grant execute on function public.move_gm_token(uuid, numeric, numeric, numeric, numeric) to authenticated;
