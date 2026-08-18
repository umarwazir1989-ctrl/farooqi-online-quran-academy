alter table public.teachers add column if not exists email text;

create unique index if not exists teachers_email_unique
on public.teachers(lower(email)) where email is not null;

create unique index if not exists students_user_id_unique
on public.students(user_id) where user_id is not null;

create unique index if not exists parents_user_id_unique
on public.parents(user_id) where user_id is not null;

create unique index if not exists teachers_user_id_unique
on public.teachers(user_id) where user_id is not null;

create index if not exists enrollments_student_status_idx
on public.enrollments(student_id, status);

create index if not exists enrollments_teacher_status_idx
on public.enrollments(teacher_id, status);

create index if not exists schedules_enrollment_status_idx
on public.class_schedules(enrollment_id, status);

create or replace view public.portal_account_overview as
select 'student'::text as role, s.id as record_id, s.full_name, s.email, s.user_id,
       s.status, s.student_code as reference_code
from public.students s
union all
select 'parent'::text, p.id, p.full_name, p.email, p.user_id,
       p.status, null::text
from public.parents p
union all
select 'teacher'::text, t.id, t.full_name, t.email, t.user_id,
       t.status, t.teacher_code
from public.teachers t;
