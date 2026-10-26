create extension if not exists pgcrypto;

create table if not exists public.qaida_homework (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  lesson_slug text not null,
  item_text text,
  instructions text,
  due_date date,
  status text not null default 'assigned'
    check (status in ('assigned','in_progress','submitted','completed','cancelled')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.qaida_mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  skill_key text not null,
  skill_label text not null,
  total_attempts integer not null default 0,
  correct_attempts integer not null default 0,
  repeat_attempts integer not null default 0,
  makhraj_issues integer not null default 0,
  score integer not null default 0 check (score between 0 and 100),
  level text not null default 'needs_practice'
    check (level in ('needs_practice','developing','good','mastered')),
  updated_at timestamptz not null default now(),
  unique(student_id, skill_key)
);

alter table public.qaida_homework enable row level security;
alter table public.qaida_mastery enable row level security;
