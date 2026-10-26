-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11P
-- Launch Patch / Final Operational Polish
-- Run AFTER Phase 11N SQL.
-- ==========================================================

-- Keep launch audit history efficient.
create index if not exists quran_launch_audits_type_result_idx
on public.quran_launch_audits(audit_type, result, created_at desc);

-- Helpful lookup for parent weekly digest screens.
create index if not exists quran_parent_digests_student_week_idx
on public.quran_parent_digests(student_id, week_start desc);

-- Helpful assignment review lookup.
create index if not exists quran_assignments_student_status_idx
on public.quran_assignments(student_id, status, created_at desc);

-- Helpful Qaida lesson progress lookup.
create index if not exists qaida_lesson_progress_student_lesson_idx
on public.qaida_lesson_progress(student_id, lesson_slug);

-- No destructive schema changes in final launch patch.
