-- ==========================================================
-- Farooqi Online Quran Academy — Phase 5
-- Calendar + Reschedule/Make-up + Parent Notifications
-- + Analytics support
-- Run AFTER Phase 4.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.class_reschedules (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,

  original_date date not null,
  requested_date date not null,
  requested_time time,
  timezone text not null default 'Asia/Karachi',

  reason text,
  request_type text not null default 'reschedule'
    check (request_type in ('reschedule','makeup')),

  status text not null default 'pending'
    check (status in ('pending','approved','rejected','completed','cancelled')),

  admin_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_reschedules_status_idx
on public.class_reschedules(status, requested_date);

create index if not exists class_reschedules_teacher_idx
on public.class_reschedules(teacher_id, requested_date);

create index if not exists class_reschedules_student_idx
on public.class_reschedules(student_id, requested_date);

create table if not exists public.parent_notifications (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.parents(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,

  notification_type text not null default 'general'
    check (
      notification_type in (
        'general',
        'attendance',
        'homework',
        'monthly_report',
        'reschedule',
        'announcement'
      )
    ),

  title text not null,
  message text not null,
  action_url text,

  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists parent_notifications_parent_idx
on public.parent_notifications(parent_id, created_at desc);

create index if not exists parent_notifications_unread_idx
on public.parent_notifications(parent_id, is_read);

create or replace function public.set_phase5_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_class_reschedules_updated_at on public.class_reschedules;
create trigger set_class_reschedules_updated_at
before update on public.class_reschedules
for each row execute function public.set_phase5_updated_at();

alter table public.class_reschedules enable row level security;
alter table public.parent_notifications enable row level security;

-- Operational views

create or replace view public.reschedule_overview as
select
  r.id,
  r.enrollment_id,
  r.original_date,
  r.requested_date,
  r.requested_time,
  r.timezone,
  r.reason,
  r.request_type,
  r.status,
  r.admin_notes,
  r.created_at,
  s.id as student_id,
  s.student_code,
  s.full_name as student_name,
  t.id as teacher_id,
  t.teacher_code,
  t.full_name as teacher_name,
  c.name_en as course_name_en,
  c.name_ur as course_name_ur
from public.class_reschedules r
join public.students s on s.id = r.student_id
left join public.teachers t on t.id = r.teacher_id
join public.enrollments e on e.id = r.enrollment_id
join public.courses c on c.id = e.course_id;

create or replace view public.admin_academy_analytics as
select
  (select count(*) from public.students where status = 'active') as active_students,
  (select count(*) from public.teachers where status = 'active') as active_teachers,
  (select count(*) from public.enrollments where status = 'active') as active_enrollments,
  (select count(*) from public.class_schedules where status = 'active') as active_schedules,
  (select count(*) from public.class_records
    where class_date >= date_trunc('month', current_date)::date) as classes_this_month,
  (select count(*) from public.class_records
    where class_date >= date_trunc('month', current_date)::date
    and attendance_status = 'present') as present_this_month,
  (select count(*) from public.class_records
    where class_date >= date_trunc('month', current_date)::date
    and attendance_status = 'absent') as absent_this_month,
  (select count(*) from public.class_reschedules where status = 'pending') as pending_reschedules,
  (select count(*) from public.monthly_reports
    where status = 'published'
    and report_month >= date_trunc('month', current_date)::date) as reports_published_this_month;
