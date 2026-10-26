# Farooqi Quran Portal — Phase 11L Release Candidate Checklist

## 1. Database
- Run `supabase/phase11l_release_candidate.sql`.
- Confirm `quran_parent_digests` has delivery fields.
- Confirm `quran_release_checks` exists.
- Confirm `cleanup_quran_api_rate_limits()` exists.

## 2. Environment
Keep these server-only:
- `QF_CLIENT_ID`
- `QF_CLIENT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `BREVO_API_KEY` if email delivery is enabled

Never expose them with `NEXT_PUBLIC_`.

## 3. Vercel cron
Merge the new cron entries into your existing `vercel.json`.
Do not blindly replace an existing file.

Recommended Hobby-safe schedules:
- existing email queue: daily
- Quran weekly digest: weekly Monday
- rate-limit cleanup: daily

## 4. Build
Run:
`npm run build`

## 5. Local file check
Run:
`node scripts/verify-phase11l-files.mjs`

## 6. Deploy
Run:
`npx vercel deploy --prod`

## 7. Production smoke test
Run:
`node scripts/smoke-test-phase11l.mjs https://farooqi-online-quran-academy.vercel.app`

## 8. Manual role test
Student:
- Quran reading
- word audio
- recording upload
- assignment submit
- revision/progress

Teacher:
- assignment create
- review recording
- assignment complete
- analytics

Parent:
- Quran progress
- weekly digest

Admin:
- Quran monitor
- Quran health
- account access

## 9. Quran integrity
- Quran text remains provider-sourced and not browser-generated.
- Browser TTS is not a Quran pronunciation authority.
- Human Quran teacher remains final reviewer.
- Provider licensing/terms must be respected for audio/content use.
