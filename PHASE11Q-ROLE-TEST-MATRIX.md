# Phase 11Q — Final Role Test Matrix

This phase is a launch freeze. Do not add major features.

## Student
- Login works
- Logout returns to login without 405
- Qaida lesson opens
- Qaida audio plays
- Qaida recording uploads
- Teacher-reviewed weak item appears in adaptive practice
- Quran reading opens
- Surah/Ayah navigation works
- Word audio works
- Word recording uploads
- Full Ayah recording uploads
- Quran assignment opens
- Assignment submission works
- Quran progress/revision opens

## Teacher
- Login works
- Qaida review opens
- Qaida attempt audio can be reviewed
- Correct / Repeat / Makhraj status saves
- Qaida control opens
- Approve/unapprove works
- Quran assignment creation works for assigned student only
- Quran review opens
- Quran review status saves
- Submitted assignment can be completed
- Quran analytics opens

## Parent
- Login works
- Qaida progress opens
- Quran progress opens
- Weekly Quran digest opens
- Only linked child/children are visible

## Admin
- Login works
- Accounts opens
- Quran monitor opens
- Quran health opens
- Launch readiness opens
- Live tests opens
- Final release status opens
- PASS/WARN/FAIL audit can be recorded

## Rule
Record every non-pass item in `phase11q-test-results.json`.
Then run:

`node scripts/phase11q-collect-failures.mjs phase11q-test-results.json`

Fix only the real failures that appear.
