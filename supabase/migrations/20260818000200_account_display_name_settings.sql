-- A conta possui um único nome público. campaign_members mantém uma cópia para
-- consultas rápidas no multiplayer, portanto ela precisa acompanhar o perfil.

create or replace function public.sync_profile_display_name_to_memberships()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.display_name is not distinct from old.display_name then
    return new;
  end if;

  update public.campaign_members member
  set display_name = new.display_name
  where member.user_id = new.id
    and member.display_name is distinct from new.display_name;

  return new;
end;
$$;

drop trigger if exists profiles_sync_display_name_to_memberships on public.profiles;
create trigger profiles_sync_display_name_to_memberships
after update of display_name on public.profiles
for each row execute function public.sync_profile_display_name_to_memberships();

create or replace function public.update_my_display_name(public_display_name text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_display_name text := left(trim(public_display_name), 80);
  saved_profile public.profiles;
begin
  if not public.is_permanent_user() then
    raise exception 'A permanent account is required';
  end if;

  if normalized_display_name is null or char_length(normalized_display_name) < 1 then
    raise exception 'Display name is required';
  end if;

  update public.profiles profile
  set display_name = normalized_display_name
  where profile.id = auth.uid()
  returning profile.* into saved_profile;

  if saved_profile.id is null then
    raise exception 'Public profile was not found';
  end if;

  return saved_profile;
end;
$$;

revoke all on function public.update_my_display_name(text) from public, anon;
grant execute on function public.update_my_display_name(text) to authenticated;
