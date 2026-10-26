const base = process.env.NEXT_PUBLIC_SITE_URL || process.argv[2];

if (!base) {
  console.error("Pass production URL or set NEXT_PUBLIC_SITE_URL.");
  process.exit(1);
}

const routes = [
  "/portal/login",
  "/portal/student/quran-reading",
  "/portal/student/quran-assignments",
  "/portal/student/quran-progress",
  "/portal/student/qaida",
  "/portal/student/qaida-practice",
  "/portal/student/qaida-revision",
  "/portal/teacher/quran-assignments",
  "/portal/teacher/quran-review",
  "/portal/teacher/quran-analytics",
  "/portal/teacher/qaida-review",
  "/portal/teacher/qaida-control",
  "/portal/parent/quran-progress",
  "/portal/parent/quran-weekly",
  "/portal/admin/quran-monitor",
  "/portal/admin/quran-launch"
];

let failed=0;

for(const path of routes){
  try{
    const r=await fetch(new URL(path,base),{redirect:"manual"});
    const ok=[200,302,303,307,308].includes(r.status);
    console.log(`${ok?"PASS":"FAIL"} ${r.status} ${path}`);
    if(!ok)failed++;
  }catch(e){
    console.log(`FAIL ERR ${path} ${e.message}`);
    failed++;
  }
}

if(failed){
  console.error(`${failed} route(s) failed.`);
  process.exit(1);
}

console.log("All Phase 11N route checks passed.");
