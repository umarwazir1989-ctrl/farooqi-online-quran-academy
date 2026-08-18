-- ==========================================================
-- Farooqi Online Quran Academy — Phase 4
-- Attendance + Class Completion + Quran Progress + Homework
-- + Monthly Reports
-- Run AFTER Phase 3B/3C migrations.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.class_records (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,

  class_date date not null default current_date,

  attendance_status text not null default 'present'
    check (attendance_status in ('present','absent','late','leave','cancelled')),

  class_status text not null default 'completed'
    check (class_status in ('scheduled','completed','cancelled')),

  lesson_type text not null default 'quran_reading'
    check (
      lesson_type in (
        'qaida',
        'quran_reading',
        'hifz',
        'tajweed',
        'translation_tafsir',
        'islamic_studies',
        'arabic',
        'other'
      )
    ),

  lesson_title text,
  lesson_from text,
  lesson_to text,

  new_lesson text,
  sabqi_revision text,
  manzil_revision text,

  tajweed_focus text,
  mistakes_notes text,
  homework text,
  teacher_notes text,

  performance_score integer
    check (performance_score is null or performance_score between 1 and 5),

  duration_minutes integer not null default 30
    check (duration_minutes between 10 and 180),

  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (enrollment_id, class_date)
);

create index if not exists class_records_student_date_idx
on public.class_records(student_id, class_date desc);

create index if not exists class_records_teacher_date_idx
on public.class_records(teacher_id, class_date desc);

create index if not exists class_records_attendance_idx
on public.class_records(attendance_status);

create table if not exists public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  teacher_id uuid references public.teachers(id) on delete set null,

  report_month date not null,

  total_classes integer not null default 0,
  present_classes integer not null default 0,
  absent_classes integer not null default 0,
  late_classes integer not null default 0,
  leave_classes integer not null default 0,

  attendance_percentage numeric(5,2) not null default 0,
  average_performance numeric(4,2),

  progress_summary text,
  strengths text,
  improvement_areas text,
  next_month_goal text,
  teacher_comment text,

  status text not null default 'draft'
    check (status in ('draft','published')),

  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(student_id, report_month)
);

create index if not exists monthly_reports_student_month_idx
on public.monthly_reports(student_id, report_month desc);

create or replace function public.set_learning_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_class_records_updated_at on public.class_records;
create trigger set_class_records_updated_at
before update on public.class_records
for each row execute function public.set_learning_updated_at();

drop trigger if exists set_monthly_reports_updated_at on public.monthly_reports;
create trigger set_monthly_reports_updated_at
before update on public.monthly_reports
for each row execute function public.set_learning_updated_at();

alter table public.class_records enable row level security;
alter table public.monthly_reports enable row level security;

-- Admin/teacher server routes use the server-side secret key.
-- More granular user RLS can be added in a later hardening phase.

create or replace view public.class_record_overview as
select
  cr.id,
  cr.class_date,
  cr.attendance_status,
  cr.class_status,
  cr.lesson_type,
  cr.lesson_title,
  cr.lesson_from,
  cr.lesson_to,
  cr.new_lesson,
  cr.sabqi_revision,
  cr.manzil_revision,
  cr.tajweed_focus,
  cr.homework,
  cr.teacher_notes,
  cr.performance_score,
  cr.duration_minutes,
  s.id as student_id,
  s.student_code,
  s.full_name as student_name,
  t.id as teacher_id,
  t.teacher_code,
  t.full_name as teacher_name,
  c.id as course_id,
  c.name_en as course_name_en,
  c.name_ur as course_name_ur,
  e.id as enrollment_id
from public.class_records cr
join public.students s on s.id = cr.student_id
left join public.teachers t on t.id = cr.teacher_id
join public.enrollments e on e.id = cr.enrollment_id
join public.courses c on c.id = e.course_id;

create or replace view public.student_progress_summary as
select
  s.id as student_id,
  s.student_code,
  s.full_name as student_name,
  count(cr.id) as total_recorded_classes,
  count(cr.id) filter (where cr.attendance_status = 'present') as present_classes,
  count(cr.id) filter (where cr.attendance_status = 'absent') as absent_classes,
  count(cr.id) filter (where cr.attendance_status = 'late') as late_classes,
  round(avg(cr.performance_score)::numeric, 2) as average_performance,
  max(cr.class_date) as last_class_date
from public.students s
left join public.class_records cr on cr.student_id = s.id
group by s.id, s.student_code, s.full_name;
