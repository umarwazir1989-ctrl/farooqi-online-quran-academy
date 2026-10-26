-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11M
-- Final Bug Fixes / Data Hardening / Release Polish
-- Run AFTER Phase 11L SQL.
-- ==========================================================

-- Prevent duplicate active Qaida practice items for the same source attempt.
create unique index if not exists qaida_practice_queue_active_source_unique
on public.qaida_practice_queue(student_id, source_attempt_id)
where source_attempt_id is not null
  and status in ('pending','started');

-- Prevent duplicate active Quran revision rows for the same source attempt.
create unique index if not exists quran_revision_queue_active_source_unique
on public.quran_revision_queue(student_id, source_attempt_id)
where source_attempt_id is not null
  and status in ('pending','started');

-- Helpful operational indexes.
create index if not exists qaida_attempts_student_status_idx
on public.qaida_attempts(student_id, status, created_at desc);

create index if not exists quran_attempts_student_status_idx
on public.quran_attempts(student_id, status, created_at desc);

create index if not exists quran_assignments_teacher_status_idx
on public.quran_assignments(teacher_id, status, created_at desc);
