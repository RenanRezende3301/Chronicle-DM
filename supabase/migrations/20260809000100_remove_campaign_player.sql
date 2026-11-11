-- Allows a GM to clean up a player entry without leaving a character assigned.
create or replace function public.remove_campaign_player(
  target_campaign_id uuid,
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_role text;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if not public.is_campaign_gm(target_campaign_id) then
    raise exception 'Only a GM can remove players';
  end if;

  select member.role
  into target_role
  from public.campaign_members member
  where member.campaign_id = target_campaign_id
    and member.user_id = target_user_id;

  if target_role is null then
    raise exception 'Player was not found in this campaign';
  end if;

  if target_role <> 'player' then
    raise exception 'A GM cannot be removed with this action';
  end if;

  -- Do this before removing membership so the ownership validation trigger keeps
  -- the actor valid throughout the transaction.
  update public.actors actor
  set actor_type = 'npc',
      owner_user_id = null
  where actor.campaign_id = target_campaign_id
    and actor.owner_user_id = target_user_id;

  delete from public.campaign_members member
  where member.campaign_id = target_campaign_id
    and member.user_id = target_user_id;
end;
$$;

revoke execute on function public.remove_campaign_player(uuid, uuid) from public, anon;
grant execute on function public.remove_campaign_player(uuid, uuid) to authenticated;
