-- ==========================================================
-- Farooqi Online Quran Academy — Phase 8 (FIXED)
-- Fix: public.students has no "phone" column.
-- The student contact phone is taken from the linked parent record.
-- Safe to run even if some Phase 8 tables already exist.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.student_import_batches (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  source_type text not null default 'csv'
    check (source_type in ('csv','xlsx')),
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  invalid_rows integer not null default 0,
  status text not null default 'review'
    check (status in ('review','completed','cancelled')),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.student_import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.student_import_batches(id) on delete cascade,
  row_number integer not null,
  student_name text,
  parent_name text,
  email text,
  phone text,
  country text,
  timezone text,
  course text,
  notes text,
  validation_status text not null default 'valid'
    check (validation_status in ('valid','invalid','imported','skipped')),
  validation_message text,
  created_at timestamptz not null default now()
);

create index if not exists student_import_rows_batch_idx
on public.student_import_rows(batch_id, row_number);

create table if not exists public.email_notification_queue (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  recipient_name text,
  subject text not null,
  body_text text not null,
  template_key text,
  related_entity_type text,
  related_entity_id text,
  status text not null default 'pending'
    check (status in ('pending','sent','failed','cancelled')),
  attempts integer not null default 0,
  last_error text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists email_queue_status_idx
on public.email_notification_queue(status, created_at);

alter table public.student_import_batches enable row level security;
alter table public.student_import_rows enable row level security;
alter table public.email_notification_queue enable row level security;

-- IMPORTANT FIX:
-- students table does not contain s.phone.
-- We expose parent phone as the student's primary contact phone.
drop view if exists public.student_admin_search;

create view public.student_admin_search as
select
  s.id,
  s.student_code,
  s.full_name,
  s.email,
  p.phone as phone,
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
left join public.enrollments e
  on e.student_id = s.id
 and e.status = 'active'
left join public.courses c on c.id = e.course_id
left join public.teachers t on t.id = e.teacher_id;
