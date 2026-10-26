# Phase 11K — Parent Weekly Digest + Security Hardening + Completion UI

Requires Phase 11J.

## Adds

Teacher
- assignment list/history
- submitted assignment review & completion UI
- completion score display

Parent
- weekly Quran digest
- teacher-reviewed weekly score
- Makhraj/Tajweed/Repeat counts
- active/completed assignment counts

Security
- server-side rate limiting for Quran recording uploads
- server-side rate limiting for assignment creation
- audio MIME normalization (handles `audio/webm;codecs=opus`)
- assignment ownership validation before recording upload
- private-storage workflow preserved

Admin
- Quran system health API/component foundation

Database
- `quran_parent_digests`
- `quran_api_rate_limits`

## New route

Parent:
- `/portal/parent/quran-weekly`

Teacher:
- `/portal/teacher/quran-assignments` is upgraded

Admin API:
- `/api/admin/quran/health`

## Important replacement files

Allow replacement of:
- `app/api/student/quran/attempts/route.ts`
- `app/api/teacher/quran/assignments/route.ts`
- `app/portal/teacher/quran-assignments/page.tsx`

## Install

1. Extract ZIP into project root.
2. Append `phase11k-quran.css` to `app/globals.css`.
3. Run:
   `supabase/phase11k_security_digest.sql`
4. Build:
   `npm run build`
5. Deploy:
   `npx vercel deploy --prod`

## Production check

Use:
`PRODUCTION-READINESS-PHASE11K.md`

Do not put service-role keys, Quran Foundation secret, admin keys, or Brevo keys in chat or GitHub.

## Next Phase 11L

Recommended:
- wire Admin Quran Health into admin monitoring page
- cron-ready weekly digest delivery
- cleanup expired rate-limit rows
- full automated smoke-test script
- final dashboard navigation merge
- launch checklist and release candidate
