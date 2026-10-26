const base = process.env.NEXT_PUBLIC_SITE_URL || process.argv[2];

if (!base) {
  console.error("Set NEXT_PUBLIC_SITE_URL or pass the production URL as the first argument.");
  process.exit(1);
}

const checks = [
  ["/portal/login", [200, 307, 308]],
  ["/portal/student/quran-reading", [200, 302, 303, 307, 308]],
  ["/portal/student/quran-assignments", [200, 302, 303, 307, 308]],
  ["/portal/student/quran-progress", [200, 302, 303, 307, 308]],
  ["/portal/teacher/quran-assignments", [200, 302, 303, 307, 308]],
  ["/portal/teacher/quran-review", [200, 302, 303, 307, 308]],
  ["/portal/teacher/quran-analytics", [200, 302, 303, 307, 308]],
  ["/portal/parent/quran-progress", [200, 302, 303, 307, 308]],
  ["/portal/parent/quran-weekly", [200, 302, 303, 307, 308]],
  ["/portal/admin/quran-monitor", [200, 302, 303, 307, 308]]
];

let failed = 0;

for (const [path, allowed] of checks) {
  try {
    const r = await fetch(new URL(path, base), { redirect:"manual" });
    const ok = allowed.includes(r.status);
    console.log(`${ok ? "PASS" : "FAIL"} ${r.status} ${path}`);
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL ERR ${path} ${e.message}`);
    failed++;
  }
}

if (failed) {
  console.error(`Smoke test failed: ${failed} route(s).`);
  process.exit(1);
}

console.log("Phase 11L smoke test passed.");
