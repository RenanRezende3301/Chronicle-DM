-- Allow an owner to upsert a portrait before characters.portrait_path is saved.

drop policy if exists "chronicle members read shared character portraits" on storage.objects;
create policy "owners and chronicle members read character portraits" on storage.objects
for select to authenticated using (
  bucket_id = 'character-portraits'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.can_read_character_portrait(name)
  )
);
