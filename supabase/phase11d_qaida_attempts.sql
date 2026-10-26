-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11D
-- Qaida student recordings + teacher review
-- Run in Supabase SQL Editor once.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.qaida_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_slug text not null,
  item_text text not null,
  audio_key text,
  recording_path text not null,
  status text not null default 'pending'
    check (status in ('pending','correct','repeat','makhraj_issue')),
  teacher_feedback text,
  reviewed_by uuid references public.teachers(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists qaida_attempts_student_idx
  on public.qaida_attempts(student_id, created_at desc);

create index if not exists qaida_attempts_status_idx
  on public.qaida_attempts(status, created_at desc);

alter table public.qaida_attempts enable row level security;

-- All reads/writes in Phase 11D go through authenticated server routes
-- using the server-side Supabase admin client. Keep browser access closed.
drop policy if exists "No direct qaida attempts access" on public.qaida_attempts;
create policy "No direct qaida attempts access"
on public.qaida_attempts
for all
to authenticated
using (false)
with check (false);

-- Private storage bucket for student recordings.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'qaida-recordings',
  'qaida-recordings',
  false,
  10485760,
  array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
