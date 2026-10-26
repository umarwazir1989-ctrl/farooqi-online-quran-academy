# Phase 11Q — Final Launch Freeze & Defect Collection

This is the correct next step after Phase 11P.

It does NOT add a new major feature.

## Purpose
- freeze feature development
- run real role-by-role tests
- collect exact failures
- create a clean defect list
- prepare only targeted launch patches

## Install
Extract into project root.

No CSS.
No Supabase migration.
No Vercel config change.

## Run
1. Copy:
   `PHASE11Q-TEST-RESULTS.example.json`
   to:
   `phase11q-test-results.json`

2. Perform tests from:
   `PHASE11Q-ROLE-TEST-MATRIX.md`

3. Record exact failures.

4. Generate failure report:
   `node scripts/phase11q-collect-failures.mjs phase11q-test-results.json`

5. Run freeze audit:
   `node scripts/phase11q-freeze-audit.mjs`

## Next
Send the exact first real failure.
That becomes Launch Patch 11Q.1.
Then fix 11Q.2, 11Q.3, etc., only if additional real failures remain.
