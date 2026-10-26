create extension if not exists pgcrypto;

create table if not exists public.qaida_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_slug text not null,
  status text not null default 'locked'
    check (status in ('locked','available','in_progress','review','completed')),
  completion_percent integer not null default 0
    check (completion_percent between 0 and 100),
  teacher_approved boolean not null default false,
  last_practiced_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(student_id, lesson_slug)
);

create table if not exists public.qaida_practice_queue (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_slug text not null,
  item_text text not null,
  reason text not null default 'adaptive'
    check (reason in ('adaptive','teacher_homework','revision','manual')),
  priority integer not null default 50 check (priority between 1 and 100),
  status text not null default 'pending'
    check (status in ('pending','started','done','dismissed')),
  source_attempt_id uuid references public.qaida_attempts(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists qaida_lesson_progress_student_idx
on public.qaida_lesson_progress(student_id, status, updated_at desc);

create index if not exists qaida_practice_queue_student_idx
on public.qaida_practice_queue(student_id, status, priority desc, created_at desc);

alter table public.qaida_lesson_progress enable row level security;
alter table public.qaida_practice_queue enable row level security;
