-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11G
-- Lesson Control + Spaced Revision + Streaks + Quran Foundation
-- Run AFTER Phase 11F SQL.
-- ==========================================================

create extension if not exists pgcrypto;

-- Extend lesson progress with teacher-control metadata.
alter table public.qaida_lesson_progress
  add column if not exists unlocked_by uuid references public.teachers(id) on delete set null,
  add column if not exists approved_by uuid references public.teachers(id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists next_review_at timestamptz;

create table if not exists public.qaida_revision_schedule (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_slug text not null,
  item_text text not null,
  source_attempt_id uuid references public.qaida_attempts(id) on delete set null,
  interval_days integer not null default 1
    check (interval_days between 1 and 365),
  due_at timestamptz not null default now(),
  status text not null default 'due'
    check (status in ('due','completed','skipped')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists qaida_revision_due_idx
  on public.qaida_revision_schedule(student_id, status, due_at);

create table if not exists public.qaida_student_metrics (
  student_id uuid primary key references public.students(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  total_practice_days integer not null default 0,
  total_attempts integer not null default 0,
  last_practice_date date,
  reward_points integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.qaida_revision_schedule enable row level security;
alter table public.qaida_student_metrics enable row level security;

-- All Phase 11G access is server-side through authenticated routes.
drop policy if exists "No direct qaida revision access" on public.qaida_revision_schedule;
create policy "No direct qaida revision access"
on public.qaida_revision_schedule
for all to authenticated
using (false) with check (false);

drop policy if exists "No direct qaida metrics access" on public.qaida_student_metrics;
create policy "No direct qaida metrics access"
on public.qaida_student_metrics
for all to authenticated
using (false) with check (false);

-- Quran learning foundation.
create table if not exists public.quran_learning_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  surah_number integer not null check (surah_number between 1 and 114),
  ayah_number integer not null check (ayah_number > 0),
  word_index integer,
  status text not null default 'not_started'
    check (status in ('not_started','learning','review','completed')),
  teacher_note text,
  last_practiced_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(student_id, surah_number, ayah_number, word_index)
);

alter table public.quran_learning_progress enable row level security;

drop policy if exists "No direct quran learning progress access" on public.quran_learning_progress;
create policy "No direct quran learning progress access"
on public.quran_learning_progress
for all to authenticated
using (false) with check (false);
