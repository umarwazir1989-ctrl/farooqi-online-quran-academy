# Phase 11O — Live Launch Testing

This phase follows Phase 11N.

It intentionally adds diagnostics and test tooling instead of another large feature set.

## Adds
- Admin Live Launch Tests page
- database table checks
- private storage bucket checks
- required environment-name checks without revealing secret values
- live route testing script
- unauthenticated protected-API boundary test
- release validation runner
- manual role-by-role test plan

## New admin route
`/portal/admin/launch-tests`

## New admin API
`/api/admin/launch-diagnostics`

## Install
1. Extract this ZIP into project root.
2. Append `phase11o-live-testing.css` to `app/globals.css`.
3. No new Supabase migration is required for Phase 11O itself.
4. Run:
   `npm run build`
5. Deploy:
   `npx vercel deploy --prod`
6. Run:
   `node scripts/phase11o-release-runner.mjs https://farooqi-online-quran-academy.vercel.app`
7. Then perform:
   `PHASE11O-MANUAL-ROLE-TESTS.md`

## Important
Automated route checks cannot prove that role-specific workflows are correct.
The final launch patch must be based on the real errors found while logged in as Student, Teacher, Parent and Admin.
