import fs from "node:fs";

const input = process.argv[2] || "phase11q-test-results.json";
const output = process.argv[3] || "phase11q-failures.md";

if (!fs.existsSync(input)) {
  console.error(`Missing input file: ${input}`);
  console.error("Create JSON test results first. See PHASE11Q-TEST-RESULTS.example.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, "utf8"));
const failures = Array.isArray(data.results)
  ? data.results.filter((x) => x && x.status !== "pass")
  : [];

let md = "# Phase 11Q — Launch Failures\n\n";

if (!failures.length) {
  md += "No failures recorded.\n";
} else {
  for (const [i, f] of failures.entries()) {
    md += `## ${i + 1}. ${f.role || "Unknown role"} — ${f.area || "Unknown area"}\n\n`;
    md += `- Status: ${f.status || "unknown"}\n`;
    md += `- URL: ${f.url || "-"}\n`;
    md += `- Error: ${f.error || "-"}\n`;
    md += `- Expected: ${f.expected || "-"}\n`;
    md += `- Actual: ${f.actual || "-"}\n`;
    md += `- Notes: ${f.notes || "-"}\n\n`;
  }
}

fs.writeFileSync(output, md, "utf8");
console.log(`Created ${output}`);
