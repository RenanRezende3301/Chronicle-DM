-- Keep GM movement validation explicit. Besides producing useful errors, this
-- avoids a permission predicate being folded into the UPDATE and turning a
-- valid token move into an indistinguishable denied update.
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

  select scene.*
  into target_scene
  from public.scene_items item
  join public.scenes scene on scene.id = item.scene_id
  where item.id = target_item_id
    and item.item_type = 'token';

  if target_scene.id is null then
    raise exception 'Token not found in this campaign';
  end if;

  if not exists (
    select 1
    from public.campaign_members member
    where member.campaign_id = target_scene.campaign_id
      and member.user_id = auth.uid()
      and member.role = 'gm'
  ) then
    raise exception 'GM permission is required to move this token';
  end if;

  if next_width > least(target_scene.width * 2, 10000)
    or next_height > least(target_scene.height * 2, 10000)
    or next_x < -next_width
    or next_x > target_scene.width
    or next_y < -next_height
    or next_y > target_scene.height
  then
    raise exception 'Token position is outside the scene';
  end if;

  update public.scene_items item
  set x = next_x,
      y = next_y,
      width = next_width,
      height = next_height,
      version = item.version + 1
  where item.id = target_item_id
  returning item.* into moved_item;

  return moved_item;
end;
$$;
