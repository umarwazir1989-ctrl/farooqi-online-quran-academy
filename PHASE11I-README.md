# Phase 11I — Quran Navigator + Assignments + Tajweed + Analytics

Requires Phase 11H.

## Adds

- Full 114-Surah selector using Quran Foundation chapters API
- Ayah selector with previous/next navigation
- Verified `text_uthmani_tajweed` request from Quran Foundation
- Tajweed-tag color rendering
- Teacher Quran Assignment UI
- Student Quran Assignments page
- Quran progress analytics
- Quran weak-area tracking
- Quran revision queue
- Parent Quran progress summary

## Database

Run:

`supabase/phase11i_quran_progress_revision.sql`

Creates:

- `quran_revision_queue`

## Updated existing file

Phase 11I replaces:

`app/api/quran/verse/[key]/route.ts`

It now requests these verified Quran Foundation fields:

- Verse: `text_uthmani_tajweed`
- Word: `text_uthmani_tajweed`

The Quran Foundation field reference documents both as supported fields.

## New routes

Teacher:
- `/portal/teacher/quran-assignments`

Student:
- `/portal/student/quran-assignments`
- `/portal/student/quran-progress`

Parent:
- `/portal/parent/quran-progress`

## Installation

1. Copy all ZIP files into the project root.
2. Allow replacement of the existing Phase 11H Quran verse route and QuranStudentLesson component.
3. Append:
   `phase11i-quran.css`
   to:
   `app/globals.css`
4. Run:
   `supabase/phase11i_quran_progress_revision.sql`
5. Ensure Phase 11H Quran Foundation env vars are configured:
   - QF_ENV
   - QF_CLIENT_ID
   - QF_CLIENT_SECRET
6. Build:
   `npm run build`
7. Deploy:
   `npx vercel deploy --prod`

## Quran integrity

- Tajweed text comes from Quran Foundation `text_uthmani_tajweed`.
- Tajweed styling is instructional visualization only.
- Browser TTS is not used.
- Student recordings are reviewed by a human teacher.
- Teacher remains the final authority on pronunciation and tajweed correction.

## Next Phase 11J

Recommended final Digital Quran Teacher core:
- assignment completion workflow
- Quran revision completion/rescheduling
- teacher Quran analytics dashboard
- lesson/ayah mastery gate
- parent weekly digest
- admin Quran system monitoring
- production QA / security pass
