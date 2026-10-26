# Phase 11O — Manual Role Tests

Use dedicated test accounts. Do not use production passwords in chat.

## Student
1. Login.
2. Open Qaida.
3. Play Qaida audio.
4. Record one Qaida item.
5. Confirm attempt reaches teacher review.
6. Open adaptive practice.
7. Confirm only teacher-reviewed weak items appear.
8. Open Quran Reading.
9. Select a Surah and Ayah.
10. Play word audio.
11. Record one word.
12. Record full Ayah.
13. Open Quran Assignments.
14. Submit a linked assignment.
15. Open Quran Progress and Revision.
16. Logout and confirm login page opens without 405.

## Teacher
1. Login.
2. Open Qaida Review.
3. Review student attempt.
4. Mark Correct / Repeat / Makhraj.
5. Open Qaida Control and approve/unapprove a lesson.
6. Confirm unapprove clears prior approval state.
7. Create Quran assignment only for an assigned student.
8. Review Quran recording.
9. Complete submitted assignment.
10. Open Quran Analytics.

## Parent
1. Login.
2. Open Qaida Progress.
3. Open Quran Progress.
4. Open Weekly Quran Digest.
5. Confirm only linked child/children appear.

## Admin
1. Login.
2. Open Quran Monitor.
3. Open Launch Readiness.
4. Open Live Tests.
5. Confirm required tables and both private recording buckets pass.
6. Record PASS/WARN/FAIL only after manual testing.

## Failure rule
If any step fails:
- capture exact URL
- copy exact error text
- note which role/account was used
- do not continue changing unrelated files

Use those real failures for the final launch patch.
