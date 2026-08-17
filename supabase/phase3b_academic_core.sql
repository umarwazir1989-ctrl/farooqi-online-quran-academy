-- ==========================================================
-- Farooqi Online Quran Academy — Phase 3B
-- Academic Core: Students, Parents, Teachers, Courses,
-- Enrollments and Class Schedules
-- Run in Supabase SQL Editor AFTER Phase 2B + Phase 3A SQL.
-- ==========================================================

create extension if not exists pgcrypto;

-- ---------- Parents ----------
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text,
  email text,
  phone text,
  country text,
  city text,
  status text not null default 'active'
    check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Teachers ----------
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  teacher_code text unique,
  full_name text not null,
  gender text check (gender in ('male','female')),
  qualification text,
  languages text[],
  specialties text[],
  timezone text,
  max_students integer not null default 20,
  status text not null default 'active'
    check (status in ('active','inactive','on_leave')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Students ----------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  parent_id uuid references public.parents(id) on delete set null,
  source_trial_id uuid unique references public.trial_applications(id) on delete set null,
  student_code text unique,
  full_name text not null,
  email text,
  whatsapp text,
  age integer,
  gender text check (gender in ('male','female')),
  country text,
  city text,
  timezone text,
  preferred_language text,
  admission_date date not null default current_date,
  status text not null default 'active'
    check (status in ('trial','active','paused','completed','left')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Courses ----------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_en text not null,
  name_ur text not null,
  category text not null,
  description_en text,
  description_ur text,
  status text not null default 'active'
    check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

-- ---------- Enrollments ----------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  teacher_id uuid references public.teachers(id) on delete set null,
  start_date date not null default current_date,
  status text not null default 'active'
    check (status in ('active','paused','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent accidental duplicate active enrollment in same course.
create unique index if not exists one_active_course_enrollment
on public.enrollments(student_id, course_id)
where status = 'active';

-- ---------- Class Schedules ----------
create table if not exists public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  days_of_week text[] not null default '{}',
  start_time time,
  duration_minutes integer not null default 30,
  timezone text not null default 'Asia/Karachi',
  status text not null default 'active'
    check (status in ('active','paused','ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Indexes ----------
create index if not exists students_status_idx on public.students(status);
create index if not exists students_parent_idx on public.students(parent_id);
create index if not exists enrollments_teacher_idx on public.enrollments(teacher_id);
create index if not exists schedules_teacher_idx on public.class_schedules(teacher_id);
create index if not exists schedules_student_idx on public.class_schedules(student_id);

-- ---------- Updated-at trigger ----------
create or replace function public.set_academic_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_parents_updated_at on public.parents;
create trigger set_parents_updated_at
before update on public.parents
for each row execute function public.set_academic_updated_at();

drop trigger if exists set_teachers_updated_at on public.teachers;
create trigger set_teachers_updated_at
before update on public.teachers
for each row execute function public.set_academic_updated_at();

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row execute function public.set_academic_updated_at();

drop trigger if exists set_enrollments_updated_at on public.enrollments;
create trigger set_enrollments_updated_at
before update on public.enrollments
for each row execute function public.set_academic_updated_at();

drop trigger if exists set_class_schedules_updated_at on public.class_schedules;
create trigger set_class_schedules_updated_at
before update on public.class_schedules
for each row execute function public.set_academic_updated_at();

-- ---------- RLS ----------
alter table public.parents enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.class_schedules enable row level security;

-- Public authenticated users may read active course catalog.
drop policy if exists "Authenticated users can read courses" on public.courses;
create policy "Authenticated users can read courses"
on public.courses for select
to authenticated
using (status = 'active');

-- Portal-specific RLS policies will be expanded in Phase 4.
-- Admin server actions use the secret server key and do not rely on public RLS.

-- ---------- Course Seed ----------
insert into public.courses (code, name_en, name_ur, category, description_en, description_ur)
values
('NQ','Noorani Qaida','نورانی قاعدہ','quran','Foundation in Arabic letters and pronunciation.','حروف، حرکات اور درست تلفظ کی بنیاد۔'),
('QR','Quran Reading','ناظرہ قرآن','quran','Fluent Quran reading with correct makharij.','مخارج کے ساتھ رواں ناظرہ قرآن۔'),
('TJ','Tajweed Course','تجوید القرآن','quran','Tajweed rules and personal recitation correction.','قواعد تجوید اور عملی اصلاح تلاوت۔'),
('HF','Quran Memorization','حفظ القرآن','quran','Structured Hifz with lesson and revision.','سبق، سبقی اور منزل کے ساتھ حفظ۔'),
('TT','Quran Translation & Tafsir','ترجمہ و تفسیر القرآن','quran','Accessible Quran translation and brief Tafsir.','آسان ترجمہ اور مختصر تفسیر۔'),
('HD','Hadith Studies','حدیث کورس','islamic_studies','Selected authentic Hadith with explanation.','منتخب صحیح احادیث مع آسان تشریح۔'),
('SR','Seerah of the Prophet ﷺ','سیرت النبی ﷺ کورس','islamic_studies','Study of the Prophetic life and guidance.','حیات نبوی ﷺ اور عملی رہنمائی۔'),
('AQ','Aqeedah & Islamic Beliefs','اسلامی عقیدہ و ایمانیات','islamic_studies','Essential Islamic beliefs and pillars of faith.','ضروری اسلامی عقائد اور ایمانیات۔'),
('FW','Fiqh of Worship','فقہ العبادات','islamic_studies','Purification, prayer, fasting and Zakat.','طہارت، نماز، روزہ اور زکوٰۃ۔'),
('DA','Salah, Duas & Adhkar','نماز، دعائیں اور اذکار','islamic_studies','Prayer, daily duas and adhkar.','نماز، مسنون دعائیں اور اذکار۔'),
('AR','Arabic for Quran Understanding','عربی زبان برائے فہم قرآن','arabic','Quranic vocabulary and basic grammar.','قرآنی الفاظ اور بنیادی صرف و نحو۔'),
('QA','Advanced Tajweed & Introduction to Qiraat','اعلیٰ تجوید و قراءات کا تعارف','advanced','Advanced Tajweed and introduction to Qiraat.','اعلیٰ تجوید اور قراءات کا تعارف۔')
on conflict (code) do update set
  name_en = excluded.name_en,
  name_ur = excluded.name_ur,
  category = excluded.category,
  description_en = excluded.description_en,
  description_ur = excluded.description_ur;

-- ---------- Helper view ----------
create or replace view public.student_enrollment_overview as
select
  s.id as student_id,
  s.student_code,
  s.full_name as student_name,
  s.country,
  s.status as student_status,
  c.name_en as course_name,
  t.full_name as teacher_name,
  e.status as enrollment_status,
  cs.days_of_week,
  cs.start_time,
  cs.duration_minutes,
  cs.timezone
from public.students s
left join public.enrollments e
  on e.student_id = s.id and e.status = 'active'
left join public.courses c
  on c.id = e.course_id
left join public.teachers t
  on t.id = e.teacher_id
left join public.class_schedules cs
  on cs.enrollment_id = e.id and cs.status = 'active';
