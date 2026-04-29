-- ================================================================
-- STEP 1: Run this entire file in Supabase SQL Editor
-- ================================================================

-- Drop old users table if it has the old password column
-- (skip this if you want to keep existing data)
-- drop table if exists public.users cascade;

-- Recreate users table without password column (auth is handled by Supabase Auth)
create table if not exists public.users (
  id         bigint generated always as identity primary key,
  auth_id    uuid unique references auth.users(id) on delete cascade,
  name       text not null,
  email      text unique not null,
  role       text not null default 'student',
  status     text not null default 'active',
  created_at timestamptz default now()
);

-- Add auth_id column if table already exists without it
alter table public.users add column if not exists
  auth_id uuid unique references auth.users(id) on delete cascade;

-- ================================================================
-- STEP 2: Auto-insert profile on signup (bypasses RLS completely)
-- ================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (auth_id, name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'student',
    'active'
  )
  on conflict (auth_id) do update
    set name  = coalesce(excluded.name, public.users.name),
        email = excluded.email;
  return new;
end;
$$;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================================
-- STEP 3: RLS Policies (clean slate)
-- ================================================================
alter table public.users        enable row level security;
alter table public.applications enable row level security;
alter table public.blogs        enable row level security;
alter table public.projects     enable row level security;
alter table public.events       enable row level security;
alter table public.resources    enable row level security;

-- Drop all old policies first
drop policy if exists "Users read own"             on public.users;
drop policy if exists "Users insert own"           on public.users;
drop policy if exists "Users update own"           on public.users;
drop policy if exists "Public read blogs"          on public.blogs;
drop policy if exists "Public read projects"       on public.projects;
drop policy if exists "Public read events"         on public.events;
drop policy if exists "Public read resources"      on public.resources;
drop policy if exists "Auth write blogs"           on public.blogs;
drop policy if exists "Auth write projects"        on public.projects;
drop policy if exists "Auth write events"          on public.events;
drop policy if exists "Auth write resources"       on public.resources;
drop policy if exists "Public insert applications" on public.applications;
drop policy if exists "Auth read applications"     on public.applications;

-- Users: authenticated users can read all, update own row
create policy "Users read all"   on public.users for select using (auth.role() = 'authenticated');
create policy "Users update own" on public.users for update using (auth.uid() = auth_id);
create policy "Users delete own" on public.users for delete using (auth.uid() = auth_id);
-- Insert is handled by the trigger (security definer), no client insert needed

-- Public read for content tables
create policy "Public read blogs"     on public.blogs     for select using (true);
create policy "Public read projects"  on public.projects  for select using (true);
create policy "Public read events"    on public.events    for select using (true);
create policy "Public read resources" on public.resources for select using (true);

-- Authenticated write for content tables
create policy "Auth write blogs"     on public.blogs     for all using (auth.role() = 'authenticated');
create policy "Auth write projects"  on public.projects  for all using (auth.role() = 'authenticated');
create policy "Auth write events"    on public.events    for all using (auth.role() = 'authenticated');
create policy "Auth write resources" on public.resources for all using (auth.role() = 'authenticated');

-- Applications: anyone can submit, authenticated can read
create policy "Public insert applications" on public.applications for insert with check (true);
create policy "Auth read applications"     on public.applications for select using (auth.role() = 'authenticated');
create policy "Auth update applications"   on public.applications for update using (auth.role() = 'authenticated');
create policy "Auth delete applications"   on public.applications for delete using (auth.role() = 'authenticated');

-- ================================================================
-- STEP 4: Seed content data (safe to run multiple times)
-- ================================================================
insert into public.blogs (title, excerpt, category, author, image_url)
select * from (values
  ('Implementing Precision Neural Architectures', 'A clinical deep-dive into Transformer models for diagnostic accuracy.', 'Featured', 'Dr. Aris Thorne', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfo6pfgJxL748pUebQfU7lqoFTuXX2R0cZK95hVRIFvftWC7_J6eyVW9erC3zkM0f0sr6oLSQx95crEYob3CMJ44KZEdPGoCI4r2VQQ3Md_mDLrSLVf3sii6Hdk628fDZPRdD0f42gGtKJUAoI1yNTxm0lEBH79p5D0WotGMacyuSo1XvkduY8Qnksr1bnj8oAsSTz-ro0iTv8EwJcc_h53ihd6R3JgrlLeRDeVyQMFyohLdFSYY6CuiBWJFHJ7av_eBrzOiLCsRI'),
  ('Secure Data Handling in Clinical AI Pipelines', 'A step-by-step guide on HIPAA compliance through automated encryption.', 'Tutorial', 'Dr. Aris Thorne', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJX9DBAPtTD1aEGNF-cOj8pJ0oKejyqL7No7e98ru68QQm-z23fpvbe72SBqg5HunkNJq6ld2pewVFKP-GgOIKAubKIhRXw6mdhPJBtpfkOX0zob_LOG-95wl4RxurgxEpXThzZakYRAeMidyMa8BRfAl8OM41Ac_OnYA25qGYkmYcwHizjZFL1MQ13GNwUEu4O2DalTrcG-JNyp1XyzpyAjd5i_AgeG6e0oTk67-dlUTehMka6iwDVIasjUC9JgNGz3mLdKRs1oU'),
  ('Fine-tuning LLMs for Medical NLP Tasks', 'Hyperparameters for aligning LLMs with medical terminology.', 'Tutorial', 'Sarah Chen', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyJ9lmoFQ8AhXF-CGNT66Qz22BPizdsNZcKNf7xQrNgnjtnbnKIs8Q3v9EL8nwReEQsq_S_OHIjg2LQxUiq48vM5OwZL7Wt_eK0vtjyKY1iD06hfFoFPx-t_sPoIKWkX1vge6DKnqholFnIM00D8xZgd-zVazbBuYjclCpE1NsguIFR7h4SDLtI4qh2KL_cxq2qqlhPTYKj6ZtzK6a_UqX54vq6az7LUzTRB60Zw1G-JR5ht3GN6o2SZtKw4KfLEQQqFM7G5aM7D4')
) as v(title, excerpt, category, author, image_url)
where not exists (select 1 from public.blogs limit 1);

insert into public.projects (title, description, tags, image_url)
select * from (values
  ('Neural Architect v2', 'Autonomous generation of structural blueprints using diffusion models.', 'Python,PyTorch', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEJh4Qt-9YySGztSKjVPKikuoRQ8GF4nKh_aRduBNcWTAf-ZQ8er9EJvXNRKjT8eESFniswE5nD9aP76JY76KSgs2MTlQrFMpr-aYZLMbJlxvaxDQOUoR1Pr_3hg795lYlJs1w_G5ntGupz7ZofSXN2LQabtT3rB78op5wZssAik_X-OfRpKhAf8axJJz1-EzgKeEChhkkMb0TJ2T4B_59jtprTsE8Zow-gnwD2AHXPJJVhlBTPdWCCKM1cNj52fpAp81XtwR09-Q'),
  ('Tactile Sense Pro', 'Advanced feedback loop systems for surgical robotics.', 'C++,ROS2', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPv1nljkmqjnLcWv1tMw5kSUvIojeII0Ku9NIPbqwin2m-zGWi17nDVEdY62yrvFFHeGsTAYwa0cbNxg3k6AweZ5tICt_mVW579wZR70XvTYRI4yTbIJ3PwTawgmB1SKre8QxIOdfDviEmIpTWZW7KBKaj4L80tyNgEXA33ZGeHuztgxJuPbzlgkMgBUWjRJAUnIQD_c44tuTPx0wJINXzk5xBTFdpTTEP2tiM-ck8ktKuXP7niu6QokVDiuWyC7TTeVaTb92F9Yo'),
  ('BioVision Lab', 'Early-stage pathology detection through computer vision.', 'Python,SciKit-Learn', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPWQJ4k8KAgxSnTMTQpj47BGLyfvVxVfx4JsbMl8KtEBg9jkmBqkS1EFDuX6mizTQM_7SFpGfANzeAR30Qo2hIyf3I8qFle0iHma7hyfplJA8FxjufeSnh9i8lpwVJT9CGiwo-Gw4wo0MUx2_JyduN3b5kcz5QI7X-bRLgf7k93E9phm4ya4kwxuFRe9T7Xsqcxr9hv9CFSplQNCsLE7bP5iqKfaQ-PJE8eIRTDk0dV6qcfFixvhPk_BBIidgROfoQM1BVxwPkOEU')
) as v(title, description, tags, image_url)
where not exists (select 1 from public.projects limit 1);

insert into public.events (title, description, type, location, event_date, event_time, image_url)
select * from (values
  ('The Generative Frontier: AI Builders Summit', 'A 48-hour intensive session focused on deploying LLMs at scale.', 'Hackathon', 'Room 402', '2024-10-24'::date, '09:00 AM EST', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEoQRIOUzVzg2Y3RLPnHE0ZFBgD6IX8YLCM-3hafs0kYKeNwPEkJvcI4V0fzzHltf6Wy3ah4A1be4NLJDNWOwMi35Zy6g-rWS4LNsSjiOgNmU0ULWu10U5-MpOI3cor5ozyBJcnsKPXimHRnPmwChcFndgmA-9OOdm1H_hDDwPOxItMmynWBxPwdRZv5ze8j5p32DYuX-0Y2nzqyNzwd2shpbFleLgRFbDxZMaUC5lPIEq2pu4Vt8k0gscEvl6dobSFexC_sz2Ogk'),
  ('Ethical Frameworks in LLM Deployment', 'Deep dive into ethical AI deployment practices.', 'Seminar', 'Virtual', '2024-11-15'::date, '02:00 PM EST', null),
  ('PyTorch for Production Workflows', 'Hands-on workshop for production ML pipelines.', 'Workshop', 'Room 402', '2024-11-20'::date, '10:00 AM EST', null)
) as v(title, description, type, location, event_date, event_time, image_url)
where not exists (select 1 from public.events limit 1);

insert into public.resources (title, description, type, url)
select * from (values
  ('Medical Imaging Dataset', 'Curated dataset of 50k+ annotated medical images.', 'Dataset', '#'),
  ('NLP Research Papers', 'Collection of 200+ peer-reviewed NLP papers.', 'Papers', '#'),
  ('GPU Cluster Access Guide', 'Documentation for accessing NVIDIA A100 clusters.', 'Documentation', '#')
) as v(title, description, type, url)
where not exists (select 1 from public.resources limit 1);

insert into public.applications (name, email, course, skills, motivation, status)
select * from (values
  ('Dr. Elena Vance', 'elena@example.com', 'PhD AI', 'Python,TensorFlow', 'Passionate about AI diagnostics', 'reviewing'),
  ('Sanjivani Robotics Lab', 'robotics@sanjivani.edu', 'Research', 'C++,ROS2', 'Surgical automation research', 'received'),
  ('Marcus Sterling', 'marcus@example.com', 'MPH', 'Python,R', 'Public health AI research', 'processed')
) as v(name, email, course, skills, motivation, status)
where not exists (select 1 from public.applications limit 1);
