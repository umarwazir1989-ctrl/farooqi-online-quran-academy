import { spawnSync } from "node:child_process";

const steps=[
  ["Node version", process.execPath, ["--version"]],
  ["Required files", process.execPath, ["scripts/verify-phase11l-files.mjs"]],
  ["Phase 11M audit", process.execPath, ["scripts/release-audit-phase11m.mjs"]],
  ["Phase 11N security", process.execPath, ["scripts/phase11n-security-audit.mjs"]],
];

let failed=0;

for(const [name,cmd,args] of steps){
  console.log(`\n=== ${name} ===`);
  const r=spawnSync(cmd,args,{stdio:"inherit",shell:false});
  if(r.status!==0){
    failed++;
    console.log(`FAILED: ${name}`);
  }
}

if(failed){
  console.error(`\nFinal check failed in ${failed} step(s).`);
  process.exit(1);
}

console.log("\nPhase 11N pre-build checks passed.");
console.log("Next run: npm run build");
