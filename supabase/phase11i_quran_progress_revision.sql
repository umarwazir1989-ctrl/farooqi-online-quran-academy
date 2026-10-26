-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11I
-- Quran Progress Analytics + Revision Queue
-- Run AFTER Phase 11H SQL.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.quran_revision_queue (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  surah_number integer not null check (surah_number between 1 and 114),
  ayah_number integer not null check (ayah_number > 0),
  word_position integer,
  reason text not null default 'teacher_review'
    check (reason in ('teacher_review','revision','assignment','manual')),
  priority integer not null default 50
    check (priority between 1 and 100),
  due_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending','started','done','dismissed')),
  source_attempt_id uuid references public.quran_attempts(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists quran_revision_queue_student_idx
on public.quran_revision_queue(student_id, status, priority desc, due_at);

alter table public.quran_revision_queue enable row level security;

drop policy if exists "No direct Quran revision queue access"
on public.quran_revision_queue;

create policy "No direct Quran revision queue access"
on public.quran_revision_queue
for all to authenticated
using (false)
with check (false);
