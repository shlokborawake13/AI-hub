-- Run this in Supabase Dashboard → SQL Editor → New Query

alter table public.users
  add column if not exists prn        text unique,
  add column if not exists department text,
  add column if not exists year       text,
  add column if not exists division   text,
  add column if not exists phone      text,
  add column if not exists github     text,
  add column if not exists avatar_url text;

-- Allow authenticated users to update their own profile
-- (locked fields: name, phone, prn, department are enforced in the app layer)
drop policy if exists "Users update own" on public.users;
create policy "Users update own" on public.users
  for update using (auth.uid() = auth_id);

-- Storage bucket for profile pictures (run separately if needed)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
-- on conflict do nothing;
