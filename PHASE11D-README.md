# Phase 11D — Student Recording + Teacher Review

## Adds

- Private Supabase `qaida_attempts` table
- Private `qaida-recordings` Storage bucket
- Student microphone recording upload
- Student attempt history API
- Teacher assigned-student recording list
- Signed private playback URLs
- Teacher decisions:
  - Correct
  - Repeat
  - Makhraj Issue
- Teacher feedback
- New route:
  `/portal/teacher/qaida-review`
- Test account creation script

## Installation order

1. Copy Phase 11D files into project root.
2. Append `phase11d-qaida.css` to `app/globals.css`.
3. Run `supabase/phase11d_qaida_attempts.sql` in Supabase SQL Editor.
4. Ensure Phase 11B + 11C files are already installed.
5. Build:

```powershell
npm run build
```

## Create test login accounts

Run from project root:

```powershell
node .\scripts\create-phase11d-test-accounts.mjs
```

It uses your existing `.env.local`.
Do NOT paste `SUPABASE_SERVICE_ROLE_KEY` into chat.

After it succeeds:

Teacher:
- Email: `teacher.qaida.test@example.com`
- Password: `Teacher@FQ2026!`

Student:
- Email: `student.qaida.test@example.com`
- Password: `Student@FQ2026!`

These are TEST credentials. Change or delete them after testing.

## Testing

Student:
- `/portal/login`
- `/portal/student/qaida`
- Record a lesson item and send to teacher.

Teacher:
- `/portal/login`
- `/portal/teacher/qaida-review`
- Listen and mark Correct / Repeat / Makhraj Issue.

## Security

- Recordings are stored in a PRIVATE bucket.
- Student cannot directly browse the bucket.
- Teacher gets a short-lived signed URL only.
- Teacher API checks that the student is actively assigned to that teacher.
- Admin can review all attempts.
