-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11H
-- Quran assignments + student recordings + teacher review
-- Run AFTER Phase 11G SQL.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.quran_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  surah_number integer not null check (surah_number between 1 and 114),
  ayah_from integer not null check (ayah_from > 0),
  ayah_to integer not null check (ayah_to >= ayah_from),
  instructions text,
  due_date date,
  status text not null default 'assigned'
    check (status in ('assigned','in_progress','submitted','completed','cancelled')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists quran_assignments_student_idx
  on public.quran_assignments(student_id, status, due_date);

create table if not exists public.quran_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  assignment_id uuid references public.quran_assignments(id) on delete set null,
  surah_number integer not null check (surah_number between 1 and 114),
  ayah_number integer not null check (ayah_number > 0),
  word_position integer,
  recording_path text not null,
  status text not null default 'pending'
    check (status in ('pending','correct','repeat','makhraj_issue','tajweed_issue')),
  teacher_feedback text,
  reviewed_by uuid references public.teachers(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists quran_attempts_student_idx
  on public.quran_attempts(student_id, created_at desc);

create index if not exists quran_attempts_status_idx
  on public.quran_attempts(status, created_at desc);

alter table public.quran_assignments enable row level security;
alter table public.quran_attempts enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'quran-recordings',
  'quran-recordings',
  false,
  15728640,
  array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
