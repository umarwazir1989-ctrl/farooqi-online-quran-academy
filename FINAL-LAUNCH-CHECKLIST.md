# Farooqi Quran Portal — Final Launch Checklist (Phase 11N)

## Install
- Extract Phase 11N into project root.
- Append `phase11n-launch.css` to `app/globals.css`.
- Run `supabase/phase11n_launch_validation.sql`.
- Merge `vercel.phase11n.example.json` into existing `vercel.json`.

## Pre-build
Run:
`node scripts/phase11n-final-check.mjs`

## Build
Run:
`npm run build`

## Deploy
Run:
`npx vercel deploy --prod`

## Route audit
Run:
`node scripts/phase11n-route-audit.mjs https://farooqi-online-quran-academy.vercel.app`

## Manual role validation
Use real test accounts for Student / Teacher / Parent / Admin.

Student:
- Login/logout
- Qaida audio + recording
- Qaida adaptive practice/revision
- Quran Surah/Ayah navigation
- Word audio
- Quran recording
- Assignment submit
- Progress/revision

Teacher:
- Qaida review
- Qaida lesson control
- Quran assignment create
- Quran recording review
- Quran analytics
- Assignment completion

Parent:
- Qaida progress
- Quran progress
- Weekly Quran digest

Admin:
- Accounts
- Quran monitor
- Quran health
- Launch readiness

## Release decision
At:
`/portal/admin/quran-launch`
record PASS / WARN / FAIL after manual testing.

## Important
Do not publish secret values.
Do not treat automated score as a replacement for qualified Quran teacher review.
