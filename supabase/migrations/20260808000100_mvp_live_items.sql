create or replace function public.save_gm_scene_item(
  target_item jsonb
)
returns public.scene_items
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_id uuid := nullif(target_item ->> 'id', '')::uuid;
  target_campaign_id uuid := nullif(target_item ->> 'campaign_id', '')::uuid;
  target_scene_id uuid := nullif(target_item ->> 'scene_id', '')::uuid;
  target_actor_id uuid := nullif(target_item ->> 'actor_id', '')::uuid;
  target_asset_id uuid := nullif(target_item ->> 'asset_id', '')::uuid;
  resolved_owner_id uuid;
  saved_item public.scene_items;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if target_id is null
    or target_campaign_id is null
    or target_scene_id is null
    or not public.is_campaign_gm(target_campaign_id)
  then
    raise exception 'GM scene item write was denied';
  end if;

  if exists (
    select 1
    from public.scene_items item
    where item.id = target_id
      and item.campaign_id <> target_campaign_id
  ) then
    raise exception 'Scene item belongs to another campaign';
  end if;

  if not exists (
    select 1
    from public.scenes scene
    where scene.id = target_scene_id
      and scene.campaign_id = target_campaign_id
  ) then
    raise exception 'Scene does not belong to this campaign';
  end if;

  if target_actor_id is not null then
    select actor.owner_user_id
    into resolved_owner_id
    from public.actors actor
    where actor.id = target_actor_id
      and actor.campaign_id = target_campaign_id;

    if not found then
      raise exception 'Actor does not belong to this campaign';
    end if;
  end if;

  if target_asset_id is not null and not exists (
    select 1
    from public.assets asset
    where asset.id = target_asset_id
      and asset.campaign_id = target_campaign_id
  ) then
    raise exception 'Asset does not belong to this campaign';
  end if;

  insert into public.scene_items as existing (
    id,
    campaign_id,
    scene_id,
    item_type,
    actor_id,
    asset_id,
    owner_user_id,
    x,
    y,
    width,
    height,
    rotation,
    z_index,
    is_hidden,
    data,
    version
  )
  values (
    target_id,
    target_campaign_id,
    target_scene_id,
    target_item ->> 'item_type',
    target_actor_id,
    target_asset_id,
    resolved_owner_id,
    coalesce((target_item ->> 'x')::numeric, 0),
    coalesce((target_item ->> 'y')::numeric, 0),
    greatest(coalesce((target_item ->> 'width')::numeric, 1), 1),
    greatest(coalesce((target_item ->> 'height')::numeric, 1), 1),
    coalesce((target_item ->> 'rotation')::numeric, 0),
    coalesce((target_item ->> 'z_index')::integer, 0),
    coalesce((target_item ->> 'is_hidden')::boolean, false),
    coalesce(target_item -> 'data', '{}'::jsonb),
    1
  )
  on conflict (id) do update
  set scene_id = excluded.scene_id,
      item_type = excluded.item_type,
      actor_id = excluded.actor_id,
      asset_id = excluded.asset_id,
      owner_user_id = excluded.owner_user_id,
      x = excluded.x,
      y = excluded.y,
      width = excluded.width,
      height = excluded.height,
      rotation = excluded.rotation,
      z_index = excluded.z_index,
      is_hidden = excluded.is_hidden,
      data = excluded.data,
      version = existing.version + 1
  returning * into saved_item;

  return saved_item;
end;
$$;

revoke execute on function public.save_gm_scene_item(jsonb) from public, anon;
grant execute on function public.save_gm_scene_item(jsonb) to authenticated;
