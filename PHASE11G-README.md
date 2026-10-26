# Phase 11G — Lesson Control + Revision + Quran Reading Foundation

Requires Phase 11D, 11E and 11F.

## Adds

Teacher:
- `/portal/teacher/qaida-control`
- lock/unlock/approve Qaida lessons

Student:
- `/portal/student/qaida-revision`
- spaced revision
- streaks
- reward points

Quran Foundation:
- `/portal/student/quran-reading`
- word → segment teaching structure
- teacher-guided design
- no synthetic authoritative Quran correction

Database:
- extends `qaida_lesson_progress`
- adds `qaida_revision_schedule`
- adds `qaida_student_metrics`
- adds `quran_learning_progress`

## Install

1. Copy all files into the project root.
2. Append `phase11g-qaida-quran.css` to `app/globals.css`.
3. Run `supabase/phase11g_control_revision_quran_foundation.sql`.
4. Run:

```powershell
npm run build
```

5. If build succeeds:

```powershell
npx vercel deploy --prod
```

## Important Quran rule

The Quran Reading page in Phase 11G is a FOUNDATION only.
Before full release, use a verified/versioned Quran text source, verified reciter audio,
and teacher-reviewed tajweed metadata. Do not treat browser TTS or automated analysis
as the final authority for Quran pronunciation.

## Next Phase 11H

Recommended:
- verified Quran text/data provider integration
- word-by-word recitation audio
- ayah/word navigator
- teacher Quran assignment
- student recording against selected ayah/word
