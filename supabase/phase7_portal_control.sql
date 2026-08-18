-- ==========================================================
-- Farooqi Online Quran Academy — Phase 7
-- Portal language + calendar CRUD + substitutions
-- + student transfer + archive/restore support
-- Run AFTER Phase 6.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.teacher_substitutions (
  id uuid primary key default gen_random_uuid(),
  original_teacher_id uuid not null references public.teachers(id) on delete cascade,
  substitute_teacher_id uuid not null references public.teachers(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  status text not null default 'active'
    check (status in ('active','completed','cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date),
  check (original_teacher_id <> substitute_teacher_id)
);

create index if not exists teacher_substitutions_dates_idx
on public.teacher_substitutions(start_date, end_date, status);

create table if not exists public.student_transfers (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  from_teacher_id uuid references public.teachers(id) on delete set null,
  to_teacher_id uuid not null references public.teachers(id) on delete restrict,
  effective_date date not null default current_date,
  reason text,
  status text not null default 'completed'
    check (status in ('completed','reversed')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists student_transfers_student_idx
on public.student_transfers(student_id, created_at desc);

create table if not exists public.archive_records (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('student','teacher','parent','trial','announcement')),
  entity_id text not null,
  reason text,
  archived_by uuid references public.profiles(id) on delete set null,
  archived_at timestamptz not null default now(),
  restored_by uuid references public.profiles(id) on delete set null,
  restored_at timestamptz,
  status text not null default 'archived'
    check (status in ('archived','restored'))
);

create index if not exists archive_records_entity_idx
on public.archive_records(entity_type, entity_id, status);

create or replace function public.set_phase7_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_teacher_substitutions_updated_at on public.teacher_substitutions;
create trigger set_teacher_substitutions_updated_at
before update on public.teacher_substitutions
for each row execute function public.set_phase7_updated_at();

alter table public.teacher_substitutions enable row level security;
alter table public.student_transfers enable row level security;
alter table public.archive_records enable row level security;

create or replace view public.teacher_substitution_overview as
select
  ts.id,
  ts.start_date,
  ts.end_date,
  ts.reason,
  ts.status,
  ot.id as original_teacher_id,
  ot.full_name as original_teacher_name,
  st.id as substitute_teacher_id,
  st.full_name as substitute_teacher_name,
  s.id as student_id,
  s.full_name as student_name,
  s.student_code,
  ts.enrollment_id
from public.teacher_substitutions ts
join public.teachers ot on ot.id = ts.original_teacher_id
join public.teachers st on st.id = ts.substitute_teacher_id
left join public.students s on s.id = ts.student_id;

create or replace view public.student_transfer_overview as
select
  tr.id,
  tr.effective_date,
  tr.reason,
  tr.status,
  s.id as student_id,
  s.full_name as student_name,
  s.student_code,
  ft.full_name as from_teacher_name,
  tt.full_name as to_teacher_name,
  tr.enrollment_id,
  tr.created_at
from public.student_transfers tr
join public.students s on s.id = tr.student_id
left join public.teachers ft on ft.id = tr.from_teacher_id
join public.teachers tt on tt.id = tr.to_teacher_id;
