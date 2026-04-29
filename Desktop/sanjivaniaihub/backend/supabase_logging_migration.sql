-- ================================================================
-- Run in Supabase Dashboard → SQL Editor → New Query
-- Drops and recreates unauthorized_access_log with all required
-- columns for the full activity + security logging system.
-- ================================================================

-- Drop old table completely (removes old schema with attempted_at etc.)
drop table if exists public.unauthorized_access_log cascade;

-- Create fresh with all required columns
create table public.unauthorized_access_log (
  id         bigint generated always as identity primary key,
  user_id    bigint,
  name       text,
  email      text        not null default 'guest',
  role       text        not null default 'guest',
  event_type text        not null default 'PAGE_VISIT',
  path       text,
  method     text        not null default 'GET',
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Indexes for fast filtering in the admin log viewer
create index idx_log_event_type on public.unauthorized_access_log (event_type);
create index idx_log_email      on public.unauthorized_access_log (email);
create index idx_log_created_at on public.unauthorized_access_log (created_at desc);

-- RLS: backend uses service_role key which bypasses RLS entirely.
-- Enable RLS so anon/authenticated clients cannot read raw logs directly.
alter table public.unauthorized_access_log enable row level security;

-- No client-side policies needed — all access goes through the backend.
-- (service_role bypasses RLS, so the backend can always insert/select.)

-- Enable realtime so the admin dashboard receives live log rows
alter publication supabase_realtime add table public.unauthorized_access_log;
