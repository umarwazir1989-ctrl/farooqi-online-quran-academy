# Phase 11J — Quran Completion + Analytics + Monitoring

Requires Phase 11I.

## Adds

Student:
- submit Quran assignment after at least one linked recording
- improved assignments list
- revision completion tracking

Teacher:
- Quran analytics dashboard
- review-based mastery level
- assignment completion backend
- assignment score calculation

Admin:
- Quran system monitor
- total attempts
- pending reviews
- total/active assignments
- active revision queue
- recent Quran system events

Database:
- assignment completion metadata
- revision review counters
- `quran_system_events`

## New routes

Student API:
- `/api/student/quran/assignments/[id]/submit`

Teacher:
- `/portal/teacher/quran-analytics`

Teacher API:
- `/api/teacher/quran/analytics`
- `/api/teacher/quran/assignments/[id]/complete`

Admin:
- `/portal/admin/quran-monitor`

Admin API:
- `/api/admin/quran/monitor`

## Install

1. Copy ZIP contents to project root and allow replacement of:
   - `app/api/student/quran/revision/route.ts`
   - `components/quran/QuranAssignmentsList.tsx`

2. Append `phase11j-quran.css` to `app/globals.css`.

3. Run:
   `supabase/phase11j_quran_completion_monitoring.sql`

4. Build:
   `npm run build`

5. Deploy:
   `npx vercel deploy --prod`

## Important operational note

Phase 11J still keeps Quran correctness human-reviewed.
Scores and mastery levels are summaries of teacher review statuses, not automated fatwa/tajweed judgments.

## Next Phase 11K

Recommended:
- parent weekly Quran digest generation
- teacher assignment completion UI
- revision rescheduling with new recordings
- end-to-end role testing
- security hardening and rate limits
- production readiness checklist
