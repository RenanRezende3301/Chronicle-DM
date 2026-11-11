-- A filtered Realtime subscription needs campaign_id from the deleted row.
-- PostgreSQL otherwise publishes only the primary key for DELETE events,
-- which made removed tokens, drawings and censor areas remain visible to
-- connected players until their next full scene reload.
alter table public.scene_items replica identity full;
