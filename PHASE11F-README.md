# Phase 11F — Adaptive Practice Engine

Requires Phase 11D and Phase 11E.

Adds:
- adaptive practice queue
- priority from teacher-reviewed mistakes
- student daily practice page
- lesson progress foundation
- parent Qaida summary
- teacher weekly report

New routes:
- /portal/student/qaida-practice
- /portal/parent/qaida-progress
- /portal/teacher/qaida-weekly-report

Install:
1. Copy files into project root.
2. Append phase11f-qaida.css to app/globals.css.
3. Run supabase/phase11f_adaptive_practice.sql in Supabase.
4. npm run build
5. npx vercel deploy --prod

Important:
Adaptive practice is based only on teacher-reviewed statuses. Teacher remains final authority.

Next Phase 11G:
- teacher lesson unlock/lock controls
- automatic spaced revision schedule
- student streak/rewards
- Quran reading engine foundation
