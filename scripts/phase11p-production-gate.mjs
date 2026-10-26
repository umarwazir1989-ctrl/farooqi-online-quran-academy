const base = process.env.NEXT_PUBLIC_SITE_URL || process.argv[2];

if (!base) {
  console.error("Usage: node scripts/phase11p-production-gate.mjs https://your-site.example");
  process.exit(1);
}

const publicChecks = [
  ["/portal/login", [200,307,308]],
  ["/portal/admin/release-status", [200,302,303,307,308]],
  ["/portal/admin/launch-tests", [200,302,303,307,308]],
  ["/portal/teacher/quran-review", [200,302,303,307,308]],
  ["/portal/student/quran-reading", [200,302,303,307,308]],
  ["/portal/parent/quran-weekly", [200,302,303,307,308]],
];

let failed=0;

for(const [path,statuses] of publicChecks){
  try{
    const r=await fetch(new URL(path,base),{redirect:"manual"});
    const ok=statuses.includes(r.status);
    console.log(`${ok?"PASS":"FAIL"} ${r.status} ${path}`);
    if(!ok)failed++;
  }catch(e){
    console.log(`FAIL ERR ${path} ${e.message}`);
    failed++;
  }
}

const protectedApis=[
  "/api/admin/quran/release-status",
  "/api/admin/launch-diagnostics",
  "/api/admin/quran/health",
];

for(const path of protectedApis){
  try{
    const r=await fetch(new URL(path,base),{redirect:"manual"});
    const ok=[401,403,302,303,307,308].includes(r.status);
    console.log(`${ok?"PASS":"FAIL"} ${r.status} ${path} (unauthenticated boundary)`);
    if(!ok)failed++;
  }catch(e){
    console.log(`FAIL ERR ${path} ${e.message}`);
    failed++;
  }
}

if(failed){
  console.error(`Production gate failed with ${failed} problem(s).`);
  process.exit(1);
}

console.log("Phase 11P production gate passed.");
