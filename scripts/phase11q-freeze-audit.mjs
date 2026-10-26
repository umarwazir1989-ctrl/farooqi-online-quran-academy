import fs from "node:fs";

const forbiddenLargePhasePatterns = [
  "phase11r",
  "phase12",
  "new major feature",
];

const tracked = [
  "PHASE11Q-TEST-RESULTS.example.json",
  "scripts/phase11q-collect-failures.mjs",
  "scripts/phase11q-freeze-audit.mjs",
  "PHASE11Q-README.md",
];

let failed = 0;

for (const f of tracked) {
  if (fs.existsSync(f)) console.log(`PASS ${f}`);
  else {
    console.log(`MISSING ${f}`);
    failed++;
  }
}

const pkg = fs.existsSync("package.json") ? fs.readFileSync("package.json", "utf8").toLowerCase() : "";
for (const token of forbiddenLargePhasePatterns) {
  if (pkg.includes(token)) {
    console.log(`WARN package.json contains freeze-sensitive token: ${token}`);
  }
}

if (failed) process.exit(1);
console.log("Phase 11Q freeze audit passed.");
