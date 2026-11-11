-- Chronicle 2.0 · private portraits owned by permanent character accounts.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'character-portraits',
  'character-portraits',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "permitted users read character portraits" on storage.objects
for select to authenticated using (
  bucket_id = 'character-portraits'
  and exists (
    select 1
    from public.characters character
    where character.portrait_path = name
      and public.can_read_character(character.id)
  )
);

create policy "owners upload character portraits" on storage.objects
for insert to authenticated with check (
  bucket_id = 'character-portraits'
  and split_part(name, '/', 1) = auth.uid()::text
  and public.is_permanent_user()
);

create policy "owners update character portraits" on storage.objects
for update to authenticated using (
  bucket_id = 'character-portraits'
  and split_part(name, '/', 1) = auth.uid()::text
) with check (
  bucket_id = 'character-portraits'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "owners delete character portraits" on storage.objects
for delete to authenticated using (
  bucket_id = 'character-portraits'
  and split_part(name, '/', 1) = auth.uid()::text
);
