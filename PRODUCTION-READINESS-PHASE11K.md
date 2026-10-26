# Phase 11K Production Readiness Checklist

## Security
- [ ] Run Phase 11K SQL.
- [ ] Keep `QF_CLIENT_SECRET` server-only.
- [ ] Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- [ ] Confirm `.env.local` is ignored by Git.
- [ ] Confirm Vercel environment variables are added separately.
- [ ] Test HTTP 429 on repeated Quran uploads.
- [ ] Test teacher cannot access another teacher's student assignments.
- [ ] Test parent cannot access unrelated children.
- [ ] Test student cannot submit another student's assignment.
- [ ] Confirm Quran recording bucket remains private.

## Quran integrity
- [ ] Quran text source verified.
- [ ] Tajweed metadata renders without browser translation.
- [ ] No browser TTS used as Quran authority.
- [ ] Word audio provider terms reviewed.
- [ ] Teacher remains final reviewer of Makhraj/Tajweed.

## End-to-end role tests
Student:
- [ ] Login
- [ ] Open Quran Reading
- [ ] Select Surah/Ayah
- [ ] Play word audio
- [ ] Record word
- [ ] Record full Ayah
- [ ] View assignment
- [ ] Submit assignment
- [ ] View progress/revision

Teacher:
- [ ] Login
- [ ] Create assignment
- [ ] Listen to recording
- [ ] Mark Correct / Repeat / Makhraj / Tajweed
- [ ] Complete submitted assignment
- [ ] View Quran analytics

Parent:
- [ ] Login
- [ ] View Quran progress
- [ ] View weekly digest

Admin:
- [ ] Login
- [ ] View Quran monitor
- [ ] View Quran system health

## Build/deploy
- [ ] `npm run build`
- [ ] `npx vercel deploy --prod`
- [ ] Verify production routes after deployment
