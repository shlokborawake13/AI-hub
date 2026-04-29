-- ============================================================
-- Sanjivani AI Hub — Auto-create user profile on signup
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- This trigger fires every time a new user signs up via Supabase Auth
-- and automatically inserts a row into public.users
-- ============================================================

-- 1. Function that runs on new auth user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (auth_id, name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    'active'
  )
  on conflict (auth_id) do nothing;  -- safe to call multiple times
  return new;
end;
$$;

-- 2. Trigger: fires after every INSERT into auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Also update RLS so the trigger (security definer) can insert
-- without needing the user's session to be active yet
-- ============================================================

-- Drop old restrictive insert policy if it exists
drop policy if exists "Users insert own" on public.users;

-- Allow the trigger function (security definer = runs as postgres superuser)
-- to insert freely. Authenticated users can also insert their own row.
create policy "Users insert own" on public.users
  for insert with check (
    auth.uid() = auth_id          -- normal client insert
    or auth.uid() is null         -- trigger / service role insert
  );

-- Allow authenticated users to read all users (needed for admin dashboard)
drop policy if exists "Users read own" on public.users;
create policy "Users read own" on public.users
  for select using (true);

-- Allow authenticated users to update their own row
create policy "Users update own" on public.users
  for update using (auth.uid() = auth_id);
