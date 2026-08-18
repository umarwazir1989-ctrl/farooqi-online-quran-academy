-- ==========================================================
-- Farooqi Online Quran Academy — Phase 10
-- Production hardening + duplicate review + verification
-- Run AFTER Phase 9.
-- ==========================================================

create extension if not exists pgcrypto;

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
-- Verification view
-- ----------------------------------------------------------

create or replace view public.student_public_verification as
select
  v.verification_code,
  v.status as verification_status,
  s.id as student_id,
  s.student_code,
  s.full_name,
  s.status as student_status,
  c.name_en as course_name,
  t.full_name as teacher_name
from public.student_verification_tokens v
join public.students s on s.id = v.student_id
left join public.enrollments e
  on e.student_id = s.id
 and e.status = 'active'
left join public.courses c on c.id = e.course_id
left join public.teachers t on t.id = e.teacher_id
where v.status = 'active';

-- ----------------------------------------------------------
-- RLS hardening
-- ----------------------------------------------------------

alter table public.student_verification_tokens enable row level security;
alter table public.import_duplicate_reviews enable row level security;

-- Remove insecure self-profile role update policy if still present.
drop policy if exists "Users can update own basic profile"
on public.profiles;

-- Users may only read their own profile through anon/authenticated client.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Do NOT allow client-side profile role/status updates.
-- Role/status changes remain server-only via service-role API.

-- Public verification view is read through a trusted server route.
-- No direct public table policy is added here.

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
