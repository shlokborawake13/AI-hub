-- Run this in Supabase Dashboard → SQL Editor → New Query
-- This fixes the "new row violates row-level security policy" error on storage

-- 1. Create avatars bucket (public)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2. Drop all old storage policies for avatars
do $$
declare r record;
begin
  for r in select policyname from pg_policies
    where tablename = 'objects' and schemaname = 'storage'
    and policyname ilike '%avatar%'
  loop
    execute 'drop policy if exists "' || r.policyname || '" on storage.objects';
  end loop;
end $$;

-- 3. Allow ANY authenticated user to upload to avatars bucket
create policy "avatars_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

-- 4. Allow ANY authenticated user to update files in avatars bucket
create policy "avatars_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

-- 5. Allow public (anyone) to read avatars
create policy "avatars_select"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

-- 6. Allow authenticated users to delete from avatars
create policy "avatars_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars');
