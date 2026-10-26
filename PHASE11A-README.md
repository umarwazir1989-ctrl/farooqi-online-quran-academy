# Phase 11A — Digital Quran Teacher / Noorani Qaida Prototype

Adds `/portal/student/qaida`.

Features:
- ض + ر + ب → ضَرَبَ sample lesson
- letter recognition
- harakah
- joining
- full word
- color boxes
- articulation notes
- audio hooks
- microphone recording
- local prototype progress
- updated Student Dashboard links

Install:
1. Copy files into project root.
2. Append `phase11a-qaida.css` to `app/globals.css`.
3. Add verified MP3 files in `public/audio/qaida/phase11a/`.
4. Run `npm run build`.
5. Test locally.
6. Deploy with `npx vercel deploy --prod`.

No npm package or SQL is required for Phase 11A.

Next: Phase 11B should add Supabase lesson/progress tables, teacher review, homework, attempt history, and verified audio metadata.
