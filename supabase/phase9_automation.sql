-- ==========================================================
-- Farooqi Online Quran Academy — Phase 9
-- Import approval + email queue automation support
-- Run AFTER Phase 8 FIXED SQL.
-- ==========================================================

alter table public.student_import_batches
add column if not exists imported_rows integer not null default 0;

alter table public.student_import_batches
add column if not exists completed_at timestamptz;

alter table public.student_import_rows
add column if not exists imported_student_id uuid references public.students(id) on delete set null;

alter table public.student_import_rows
add column if not exists imported_parent_id uuid references public.parents(id) on delete set null;

alter table public.student_import_rows
add column if not exists imported_enrollment_id uuid references public.enrollments(id) on delete set null;

create index if not exists student_import_rows_imported_student_idx
on public.student_import_rows(imported_student_id)
where imported_student_id is not null;

alter table public.email_notification_queue
add column if not exists provider_message_id text;

alter table public.email_notification_queue
add column if not exists next_attempt_at timestamptz;

create or replace view public.admin_action_center as
select
  (select count(*) from public.trial_applications where status = 'new') as new_trials,
  (select count(*) from public.class_reschedules where status = 'pending') as pending_reschedules,
  (select count(*) from public.teacher_leave_requests where status = 'pending') as pending_leave_requests,
  (select count(*) from public.student_import_batches where status = 'review') as import_batches_to_review,
  (select count(*) from public.email_notification_queue where status = 'pending') as pending_emails,
  (select count(*) from public.parent_notifications where is_read = false) as unread_parent_notifications;
