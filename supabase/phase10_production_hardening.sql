-- ==========================================================
-- Farooqi Online Quran Academy — Phase 10 (Upgraded)
-- Production hardening + schema alignment + duplicate review + verification
-- Run AFTER Phase 9.
-- ==========================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------
-- Schema Alignment Fixes (Teachers contact fields & Student archive status)
-- ----------------------------------------------------------

alter table public.teachers
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists country text;

alter table public.students
  drop constraint if exists students_status_check;

alter table public.students
  add constraint students_status_check
  check (status in ('trial','active','paused','completed','left','inactive'));

-- ----------------------------------------------------------
-- Public verification tokens
-- ----------------------------------------------------------

create table if not exists public.student_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  verification_code text not null unique,
  status text not null default 'active'
    check (status in ('active','revoked')),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists student_verification_tokens_student_idx
on public.student_verification_tokens(student_id, status);

-- ----------------------------------------------------------
-- Duplicate review queue
-- ----------------------------------------------------------

create table if not exists public.import_duplicate_reviews (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.student_import_batches(id) on delete cascade,
  import_row_id uuid not null references public.student_import_rows(id) on delete cascade,
  suspected_student_id uuid references public.students(id) on delete set null,
  suspected_parent_id uuid references public.parents(id) on delete set null,
  match_reason text not null,
  decision text not null default 'pending'
    check (decision in ('pending','reuse','create_new','skip')),
  decided_by uuid references public.profiles(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique(import_row_id, suspected_student_id, suspected_parent_id)
);

create index if not exists import_duplicate_reviews_batch_idx
on public.import_duplicate_reviews(batch_id, decision);

-- ----------------------------------------------------------
-- Security helper indexes
-- ----------------------------------------------------------

create unique index if not exists profiles_id_unique
on public.profiles(id);

create index if not exists students_status_idx
on public.students(status);

create index if not exists teachers_status_idx
on public.teachers(status);

create index if not exists parents_status_idx
on public.parents(status);

-- ----------------------------------------------------------
-- Verification view & Updated Student Admin Search View
-- ----------------------------------------------------------

create or replace view public.student_public_verification as
select
  coalesce(v.verification_code, s.student_code) as verification_code,
  coalesce(v.status, 'active') as verification_status,
  s.id as student_id,
  s.student_code,
  s.full_name,
  s.status as student_status,
  c.name_en as course_name,
  t.full_name as teacher_name
from public.students s
left join public.student_verification_tokens v
  on v.student_id = s.id
 and v.status = 'active'
left join public.enrollments e
  on e.student_id = s.id
 and e.status = 'active'
left join public.courses c on c.id = e.course_id
left join public.teachers t on t.id = e.teacher_id
where s.status in ('active','completed','trial');

drop view if exists public.student_admin_search;

create view public.student_admin_search as
select
  s.id,
  s.student_code,
  v.verification_code,
  s.full_name,
  s.email,
  coalesce(s.whatsapp, p.phone) as phone,
  s.whatsapp,
  s.country,
  s.timezone,
  s.status,
  p.full_name as parent_name,
  p.email as parent_email,
  p.phone as parent_phone,
  c.name_en as course_name,
  t.full_name as teacher_name,
  e.id as enrollment_id,
  e.status as enrollment_status
from public.students s
left join public.parents p on p.id = s.parent_id
left join public.student_verification_tokens v
  on v.student_id = s.id
 and v.status = 'active'
left join public.enrollments e
  on e.student_id = s.id
 and e.status = 'active'
left join public.courses c on c.id = e.course_id
left join public.teachers t on t.id = e.teacher_id;

-- ----------------------------------------------------------
-- RLS hardening
-- ----------------------------------------------------------

alter table public.student_verification_tokens enable row level security;
alter table public.import_duplicate_reviews enable row level security;

drop policy if exists "Users can update own basic profile"
on public.profiles;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- ----------------------------------------------------------
-- Generate verification tokens for current active students
-- ----------------------------------------------------------

insert into public.student_verification_tokens (student_id, verification_code)
select
  s.id,
  'FQV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
from public.students s
where s.status = 'active'
  and not exists (
    select 1
    from public.student_verification_tokens v
    where v.student_id = s.id
      and v.status = 'active'
  );
