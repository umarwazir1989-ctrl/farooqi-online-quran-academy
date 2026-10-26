const base = process.env.NEXT_PUBLIC_SITE_URL || process.argv[2];

if (!base) {
  console.error("Usage: node scripts/phase11o-api-boundary-test.mjs https://your-site.example");
  process.exit(1);
}

const protectedApis = [
  "/api/admin/quran/health",
  "/api/admin/quran/monitor",
  "/api/admin/quran/launch-audit",
  "/api/admin/launch-diagnostics",
  "/api/student/quran/progress",
  "/api/student/quran/revision",
  "/api/student/quran/assignments",
  "/api/teacher/quran/analytics",
  "/api/teacher/quran/assignments",
  "/api/parent/quran/summary",
  "/api/parent/quran/weekly-digest",
];

let failed = 0;

for (const route of protectedApis) {
  try {
    const r = await fetch(new URL(route, base), {
      redirect: "manual",
      headers: { accept: "application/json" },
    });

    const ok = [401, 403, 302, 303, 307, 308].includes(r.status);
    console.log(`${ok ? "PASS" : "FAIL"} ${r.status} ${route}`);
    if (!ok) failed++;
  } catch (error) {
    failed++;
    console.log(`FAIL ERR ${route} ${error.message}`);
  }
}

console.log(`\nProtected API boundary: ${protectedApis.length - failed}/${protectedApis.length} passed.`);
if (failed) process.exit(1);
