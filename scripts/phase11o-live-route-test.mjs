const base = process.env.NEXT_PUBLIC_SITE_URL || process.argv[2];

if (!base) {
  console.error("Usage: node scripts/phase11o-live-route-test.mjs https://your-site.example");
  process.exit(1);
}

const routes = [
  "/portal/login",
  "/portal/student/qaida",
  "/portal/student/qaida-practice",
  "/portal/student/qaida-revision",
  "/portal/student/quran-reading",
  "/portal/student/quran-assignments",
  "/portal/student/quran-progress",
  "/portal/teacher/qaida-review",
  "/portal/teacher/qaida-control",
  "/portal/teacher/quran-review",
  "/portal/teacher/quran-assignments",
  "/portal/teacher/quran-analytics",
  "/portal/parent/qaida-progress",
  "/portal/parent/quran-progress",
  "/portal/parent/quran-weekly",
  "/portal/admin/quran-monitor",
  "/portal/admin/quran-launch",
  "/portal/admin/launch-tests",
];

const okStatuses = new Set([200, 302, 303, 307, 308]);
let failed = 0;

for (const route of routes) {
  try {
    const response = await fetch(new URL(route, base), { redirect: "manual" });
    const ok = okStatuses.has(response.status);
    console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${route}`);
    if (!ok) failed++;
  } catch (error) {
    failed++;
    console.log(`FAIL ERR ${route} ${error.message}`);
  }
}

console.log(`\nResult: ${routes.length - failed}/${routes.length} routes passed.`);

if (failed) process.exit(1);
