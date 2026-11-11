-- The gallery mirror tables already have owner-scoped RLS policies, but were
-- originally exposed as read-only audit data. The live Chronicle gallery now
-- uses them as its canonical metadata store.
grant insert, update, delete on table public.gm_gallery_categories to authenticated;
grant insert, update, delete on table public.gm_gallery_items to authenticated;
