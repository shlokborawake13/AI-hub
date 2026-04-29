-- Run in Supabase SQL Editor
-- Audit log for unauthorized admin access attempts

create table if not exists public.unauthorized_access_log (
  id           bigint generated always as identity primary key,
  user_id      uuid,
  email        text,
  path         text,
  method       text,
  attempted_at timestamptz default now()
);

-- Only service role can read/write (backend only)
alter table public.unauthorized_access_log enable row level security;

-- No public access — only service role (backend) can insert/read
create policy "Service role only" on public.unauthorized_access_log
  for all using (false);
