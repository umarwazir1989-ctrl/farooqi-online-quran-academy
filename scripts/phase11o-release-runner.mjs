import { spawnSync } from "node:child_process";

const base = process.env.NEXT_PUBLIC_SITE_URL || process.argv[2];

if (!base) {
  console.error("Pass production URL, for example:");
  console.error("node scripts/phase11o-release-runner.mjs https://farooqi-online-quran-academy.vercel.app");
  process.exit(1);
}

const steps = [
  ["Phase 11N pre-build checks", process.execPath, ["scripts/phase11n-final-check.mjs"]],
  ["Live route test", process.execPath, ["scripts/phase11o-live-route-test.mjs", base]],
  ["Protected API boundary test", process.execPath, ["scripts/phase11o-api-boundary-test.mjs", base]],
];

let failed = 0;

for (const [label, command, args] of steps) {
  console.log(`\n========== ${label} ==========`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });

  if (result.status !== 0) {
    failed++;
    console.log(`FAILED: ${label}`);
  }
}

if (failed) {
  console.error(`\nRelease validation found ${failed} failing group(s).`);
  process.exit(1);
}

console.log("\nAll automated Phase 11O launch checks passed.");
console.log("Next: complete manual Student / Teacher / Parent / Admin role tests.");
