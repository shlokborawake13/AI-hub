-- Run in Supabase Dashboard → SQL Editor → New Query
-- Enables Realtime for instant updates on student dashboard

-- Enable realtime on content tables
alter publication supabase_realtime add table public.blogs;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.resources;
alter publication supabase_realtime add table public.users;
