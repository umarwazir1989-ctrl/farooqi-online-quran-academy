import fs from "node:fs";

const required=[
  "app/portal/admin/release-status/page.tsx",
  "app/api/admin/quran/release-status/route.ts",
  "components/quran/AdminReleaseStatus.tsx",
  "lib/portalLaunchLinks.ts",
  "supabase/phase11p_launch_patch.sql",
  "scripts/phase11p-production-gate.mjs",
];

let missing=0;

for(const file of required){
  if(fs.existsSync(file))console.log(`PASS ${file}`);
  else{
    console.log(`MISSING ${file}`);
    missing++;
  }
}

if(missing)process.exit(1);
console.log("Phase 11P files are present.");
