import fs from "node:fs";

const required = [
  "app/api/admin/quran/health/route.ts",
  "app/api/cron/quran-weekly-digest/route.ts",
  "app/api/cron/quran-rate-limit-cleanup/route.ts",
  "app/portal/admin/quran-monitor/page.tsx",
  "lib/quranReleaseHealth.ts",
  "lib/quranWeeklyDigest.ts",
  "supabase/phase11l_release_candidate.sql"
];

let failed = false;

for (const file of required) {
  if (fs.existsSync(file)) console.log(`PASS ${file}`);
  else {
    console.log(`MISSING ${file}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("All Phase 11L release-candidate files are present.");
