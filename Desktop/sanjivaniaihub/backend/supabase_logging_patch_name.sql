-- Run in Supabase Dashboard → SQL Editor → New Query
-- Adds the name column to the existing unauthorized_access_log table

alter table public.unauthorized_access_log
  add column if not exists name text;
