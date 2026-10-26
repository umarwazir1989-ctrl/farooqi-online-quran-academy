# Phase 11M — Final Hardening & Bug Fixes

This phase should be installed after Phase 11L.

## Fixes included

1. Qaida recording MIME normalization
   - fixes browser values such as:
     `audio/webm;codecs=opus`

2. Adaptive Qaida practice
   - only teacher-reviewed `repeat` and `makhraj_issue` attempts create adaptive tasks
   - `pending` attempts no longer create weak-area practice
   - active `pending` + `started` items are deduplicated

3. Teacher Qaida lesson control
   - student data and progress are fetched separately for more predictable Supabase relation handling
   - removing approval now clears `approved_by` and `approved_at`

4. Logout
   - POST logout now redirects with HTTP 303
   - prevents POST being preserved into `/portal/login` and causing 405

5. Database hardening
   - active source-attempt uniqueness for Qaida practice queue
   - active source-attempt uniqueness for Quran revision queue
   - operational indexes

6. Release audit
   - checks critical files
   - reports missing environment variable names without printing secret values

## Install

1. Extract ZIP into the project root and allow replacement.
2. Append:
   `phase11m-polish.css`
   to:
   `app/globals.css`
3. Run Supabase SQL:
   `supabase/phase11m_final_hardening.sql`
4. Run:
   `node scripts/release-audit-phase11m.mjs`
5. Run:
   `npm run build`
6. Deploy:
   `npx vercel deploy --prod`
7. Then run your Phase 11L production smoke test.

## Important

Do not paste:
- SUPABASE_SERVICE_ROLE_KEY
- QF_CLIENT_SECRET
- CRON_SECRET
- BREVO_API_KEY

into chat or GitHub.

## After Phase 11M

Do not add another major feature phase immediately.
Use actual Student / Teacher / Parent / Admin accounts and record the bugs found during end-to-end testing.
Those real defects should determine the final launch patch.
