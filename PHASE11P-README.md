# Phase 11P — Final Launch Patch

Requires Phase 11O and prior migrations.

This is a small launch-control patch, not a new feature phase.

## Adds
- one-page Final Release Status
- release blockers vs warnings
- consolidated navigation constants for Quran launch pages
- production gate script
- final file verification
- safe operational indexes

## New route
`/portal/admin/release-status`

## New API
`/api/admin/quran/release-status`

## Install
1. Extract ZIP into project root.
2. Append `phase11p-final.css` to `app/globals.css`.
3. Run `supabase/phase11p_launch_patch.sql`.
4. Run:
   `node scripts/phase11p-final-files.mjs`
5. Run:
   `npm run build`
6. Deploy:
   `npx vercel deploy --prod`
7. Run:
   `node scripts/phase11p-production-gate.mjs https://farooqi-online-quran-academy.vercel.app`

## Final rule
If the production gate or manual role tests fail, do not start Phase 11Q as a large feature phase.
Patch the exact real error only.
