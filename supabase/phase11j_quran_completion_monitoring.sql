-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11J
-- Quran Completion Workflow + Monitoring
-- Run AFTER Phase 11I SQL.
-- ==========================================================

create extension if not exists pgcrypto;

alter table public.quran_assignments
  add column if not exists submitted_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_note text,
  add column if not exists completion_score integer
    check (completion_score is null or completion_score between 0 and 100);

alter table public.quran_revision_queue
  add column if not exists review_count integer not null default 0,
  add column if not exists last_reviewed_at timestamptz;

create table if not exists public.quran_system_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null
    check (event_type in (
      'assignment_created',
      'assignment_submitted',
      'assignment_completed',
      'attempt_uploaded',
      'attempt_reviewed',
      'revision_created',
      'revision_completed'
    )),
  student_id uuid references public.students(id) on delete set null,
  teacher_id uuid references public.teachers(id) on delete set null,
  assignment_id uuid references public.quran_assignments(id) on delete set null,
  attempt_id uuid references public.quran_attempts(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quran_system_events_created_idx
  on public.quran_system_events(created_at desc);

create index if not exists quran_system_events_student_idx
  on public.quran_system_events(student_id, created_at desc);

alter table public.quran_system_events enable row level security;

drop policy if exists "No direct Quran system events access"
on public.quran_system_events;

create policy "No direct Quran system events access"
on public.quran_system_events
for all to authenticated
using (false)
with check (false);
