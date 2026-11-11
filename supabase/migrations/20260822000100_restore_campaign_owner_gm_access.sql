-- A campaign owner is always its GM. Older campaign records can be missing
-- the corresponding membership row, which made owner-only checks pass while
-- GM-only scene RPCs rejected the same authenticated user.
insert into public.campaign_members (campaign_id, user_id, role, display_name)
select
  campaign.id,
  campaign.owner_id,
  'gm',
  coalesce(nullif(trim(profile.display_name), ''), 'Narrador')
from public.campaigns campaign
left join public.profiles profile on profile.id = campaign.owner_id
on conflict (campaign_id, user_id) do update
set role = 'gm';

create or replace function public.is_campaign_member(target_campaign_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.campaigns
    where id = target_campaign_id
      and owner_id = auth.uid()
  )
  or exists (
    select 1
    from public.campaign_members
    where campaign_id = target_campaign_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_campaign_gm(target_campaign_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.campaigns
    where id = target_campaign_id
      and owner_id = auth.uid()
  )
  or exists (
    select 1
    from public.campaign_members
    where campaign_id = target_campaign_id
      and user_id = auth.uid()
      and role = 'gm'
  );
$$;
