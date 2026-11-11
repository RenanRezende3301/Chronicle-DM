-- Deliver durable multiplayer changes through the same authorized private
-- campaign channel used by transient VTT interactions. Public Postgres Changes
-- cannot safely scope DELETE events because row-level security is not applied
-- after the source row has been removed.

create or replace function public.broadcast_campaign_database_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb := case
    when tg_op = 'DELETE' then to_jsonb(old)
    else to_jsonb(new)
  end;
  target_campaign_id uuid;
begin
  if tg_table_name = 'campaigns' then
    target_campaign_id := nullif(row_data ->> 'id', '')::uuid;
  elsif tg_table_name = 'slot_occupancies' then
    select session.campaign_id into target_campaign_id
    from public.room_sessions session
    where session.id = nullif(row_data ->> 'room_session_id', '')::uuid;
  else
    target_campaign_id := nullif(row_data ->> 'campaign_id', '')::uuid;
  end if;

  if target_campaign_id is not null then
    perform realtime.broadcast_changes(
      'campaign:' || target_campaign_id::text,
      tg_op,
      tg_op,
      tg_table_name,
      tg_table_schema,
      new,
      old
    );
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function public.broadcast_campaign_database_change() from public, anon, authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'campaigns',
    'campaign_members',
    'vtt_rooms',
    'room_sessions',
    'player_slots',
    'slot_occupancies',
    'chronicle_characters',
    'assets',
    'actors',
    'scenes',
    'scene_items',
    'room_turn_states',
    'room_session_events',
    'room_actor_session_states'
  ]
  loop
    execute format(
      'drop trigger if exists broadcast_campaign_change on public.%I',
      target_table
    );
    execute format(
      'create trigger broadcast_campaign_change after insert or update or delete on public.%I for each row execute function public.broadcast_campaign_database_change()',
      target_table
    );
  end loop;
end;
$$;
