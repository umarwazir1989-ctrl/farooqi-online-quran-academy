# Phase 11N — Final Launch Validation

Requires Phase 11M.

This phase is not a large new feature phase. It formalizes launch validation.

## Adds
- Admin Launch Readiness page
- launch audit history
- PASS / WARN / FAIL release decision record
- release cleanup cron
- route audit script
- security audit script
- final pre-build check
- final launch checklist

## New route
`/portal/admin/quran-launch`

## New API
`/api/admin/quran/launch-audit`

## New cron
`/api/cron/quran-release-cleanup`

## Install
1. Extract into project root.
2. Append `phase11n-launch.css` to `app/globals.css`.
3. Run `supabase/phase11n_launch_validation.sql`.
4. Merge cron entries from `vercel.phase11n.example.json` into existing `vercel.json`.
5. Run:
   `node scripts/phase11n-final-check.mjs`
6. Run:
   `npm run build`
7. Deploy:
   `npx vercel deploy --prod`
8. Route audit:
   `node scripts/phase11n-route-audit.mjs https://farooqi-online-quran-academy.vercel.app`

After this, use real role testing. Any failures should become a small Launch Patch rather than another major phase.
