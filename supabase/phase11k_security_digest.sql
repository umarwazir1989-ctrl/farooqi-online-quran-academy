-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11K
-- Parent Weekly Digest + Security + Assignment Completion UI
-- Run AFTER Phase 11J SQL.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.quran_parent_digests (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  reviewed_attempts integer not null default 0,
  correct_count integer not null default 0,
  repeat_count integer not null default 0,
  makhraj_count integer not null default 0,
  tajweed_count integer not null default 0,
  average_score integer not null default 0
    check (average_score between 0 and 100),
  active_assignments integer not null default 0,
  completed_assignments integer not null default 0,
  summary_text text,
  created_at timestamptz not null default now(),
  unique(parent_id, student_id, week_start)
);

create table if not exists public.quran_api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  bucket text not null,
  window_start timestamptz not null,
  hit_count integer not null default 1,
  updated_at timestamptz not null default now(),
  unique(user_id, bucket, window_start)
);

create index if not exists quran_parent_digests_parent_idx
  on public.quran_parent_digests(parent_id, week_start desc);

create index if not exists quran_api_rate_limits_idx
  on public.quran_api_rate_limits(user_id, bucket, window_start desc);

alter table public.quran_parent_digests enable row level security;
alter table public.quran_api_rate_limits enable row level security;

drop policy if exists "No direct Quran parent digest access"
on public.quran_parent_digests;

create policy "No direct Quran parent digest access"
on public.quran_parent_digests
for all to authenticated
using (false)
with check (false);

drop policy if exists "No direct Quran rate limit access"
on public.quran_api_rate_limits;

create policy "No direct Quran rate limit access"
on public.quran_api_rate_limits
for all to authenticated
using (false)
with check (false);
