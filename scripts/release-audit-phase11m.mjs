import fs from "node:fs";

const required = [
  "app/api/auth/logout/route.ts",
  "app/api/student/qaida/attempts/route.ts",
  "app/api/student/qaida/adaptive/route.ts",
  "app/api/teacher/qaida/lesson-control/route.ts",
  "app/api/student/quran/attempts/route.ts",
  "app/api/admin/quran/health/route.ts",
  "app/portal/admin/quran-monitor/page.tsx",
  "supabase/phase11m_final_hardening.sql",
];

let failed = 0;

for (const file of required) {
  if (fs.existsSync(file)) {
    console.log(`PASS ${file}`);
  } else {
    console.log(`MISSING ${file}`);
    failed++;
  }
}

const envNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "QF_ENV",
  "QF_CLIENT_ID",
  "QF_CLIENT_SECRET",
  "CRON_SECRET",
];

for (const name of envNames) {
  console.log(`${process.env[name] ? "PASS" : "WARN"} ENV ${name}`);
}

if (failed) {
  console.error(`Release audit failed: ${failed} required file(s) missing.`);
  process.exit(1);
}

console.log("Phase 11M file audit passed. Review WARN environment entries before production.");
