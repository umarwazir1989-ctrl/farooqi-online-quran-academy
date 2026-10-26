# Phase 11H — Verified Quran Data + Word Audio + Teacher Review

This phase integrates the current Quran Foundation Content API architecture.

## Official integration model

Quran Foundation Content APIs currently require:
- backend/server app credentials
- OAuth2 Client Credentials flow
- scope: `content`
- server-only `QF_CLIENT_ID`
- server-only `QF_CLIENT_SECRET`
- `x-auth-token` + `x-client-id` on content requests
- prelive and production credentials/hosts must not be mixed

Word audio is read from the word data returned by the Content API and normalized to:
`https://audio.qurancdn.com/...`

## Adds

- server-only Quran Foundation client with cached 1-hour token
- one retry after API 401
- `/api/quran/chapters`
- `/api/quran/verse/[key]`
- verified Quran verse/word data provider foundation
- word-by-word audio playback
- student full-ayah or word recording
- private `quran-recordings` storage
- teacher Quran review:
  - Correct
  - Repeat
  - Makhraj Issue
  - Tajweed Issue
- Quran teacher assignments backend
- student Quran assignments backend

## New/updated routes

Student:
- `/portal/student/quran-reading`

Teacher:
- `/portal/teacher/quran-review`

APIs:
- `/api/quran/chapters`
- `/api/quran/verse/[key]`
- `/api/student/quran/attempts`
- `/api/student/quran/assignments`
- `/api/teacher/quran/attempts`
- `/api/teacher/quran/attempts/[id]/review`
- `/api/teacher/quran/assignments`

## Database

Run:
`supabase/phase11h_quran_assignments_recordings.sql`

This creates:
- `quran_assignments`
- `quran_attempts`
- private `quran-recordings` bucket

## Environment setup

Create a Backend/server app in Quran Foundation Developer Console.

Start with PRELIVE credentials.

Add locally to `.env.local`:

QF_ENV=prelive
QF_CLIENT_ID=...
QF_CLIENT_SECRET=...

Do not paste these secrets into ChatGPT and do not commit them to GitHub.

For Vercel, add the same values as server environment variables.

After Quran Foundation approves production access, switch together:
- `QF_ENV=production`
- production client ID
- production client secret

Do not mix prelive and production credentials.

## Install

1. Copy the ZIP contents into project root.
2. Append `phase11h-quran.css` to `app/globals.css`.
3. Run the SQL file in Supabase SQL Editor.
4. Configure the three QF environment variables.
5. Build:
   `npm run build`
6. Deploy:
   `npx vercel deploy --prod`

## Quran integrity rules

- Quran text containers use `translate="no"` where rendered.
- Browser automatic translation must not modify Quran text.
- No browser TTS is used for Quran pronunciation.
- Word audio comes from the Quran content provider.
- The human Quran teacher remains the final correction authority.
- Review Quran Foundation Developer Terms before caching, redistributing, or using audio offline.

## Next Phase 11I

Recommended:
- full Surah/Ayah navigator
- Quran assignment UI for teachers
- Tajweed-tag visualization using verified metadata
- word/ayah progress analytics
- Quran revision queue
- parent Quran progress summary
