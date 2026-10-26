# Phase 11L — Release Candidate

Requires Phase 11K.

## Adds
- Admin Quran Health integrated into Quran Monitor
- Release health metrics
- Weekly parent digest generation cron endpoint
- Quran API rate-limit cleanup cron endpoint
- Supabase cleanup function
- smoke-test script for production routes
- local required-files verification script
- Release Candidate checklist
- Vercel cron example for merge

## Important replacement files
Allow replacement of:
- `app/api/admin/quran/health/route.ts`
- `components/quran/AdminQuranHealth.tsx`
- `app/portal/admin/quran-monitor/page.tsx`

## New endpoints
- `/api/cron/quran-weekly-digest`
- `/api/cron/quran-rate-limit-cleanup`

Both require:
`Authorization: Bearer <CRON_SECRET>`

Do not paste CRON_SECRET in chat.

## Install
1. Extract ZIP into the project root.
2. Append `phase11l-release.css` to `app/globals.css`.
3. Run `supabase/phase11l_release_candidate.sql`.
4. Merge cron entries from `vercel.phase11l.example.json` into your existing `vercel.json`.
5. Run `node scripts/verify-phase11l-files.mjs`
6. Run `npm run build`
7. Deploy with `npx vercel deploy --prod`
8. Smoke test with:
   `node scripts/smoke-test-phase11l.mjs https://farooqi-online-quran-academy.vercel.app`

## Notes
- This phase generates/stores weekly parent digest records.
- It does not force email delivery if Brevo is not configured.
- The Health panel intentionally shows Brevo as optional.
- Cron routes are protected with CRON_SECRET.
- Existing Vercel Hobby cron limits should be respected; keep schedules daily/weekly, not hourly.

## Next
Phase 11M should be reserved for bug fixes found by real role-by-role testing and final launch polish rather than adding major new features.
