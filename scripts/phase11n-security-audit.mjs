import fs from "node:fs";

const secretNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "QF_CLIENT_SECRET",
  "CRON_SECRET",
  "BREVO_API_KEY"
];

const publicFiles = [
  "app",
  "components",
  "public"
];

let failed=0;

function walk(dir){
  if(!fs.existsSync(dir))return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const p=`${dir}/${entry.name}`;
    return entry.isDirectory()?walk(p):[p];
  });
}

const files=publicFiles.flatMap(walk).filter(p=>/\.(ts|tsx|js|jsx|mjs|json|css|html)$/.test(p));

for(const file of files){
  const text=fs.readFileSync(file,"utf8");
  for(const name of secretNames){
    if(text.includes(name) && file.startsWith("public/")){
      console.log(`FAIL secret env name referenced in public asset: ${file} -> ${name}`);
      failed++;
    }
  }
}

const envGitignored = fs.existsSync(".gitignore") &&
  fs.readFileSync(".gitignore","utf8").split(/\r?\n/).some(x=>x.trim()===".env.local");

console.log(`${envGitignored?"PASS":"WARN"} .env.local gitignore`);

if(failed){
  process.exit(1);
}

console.log("Phase 11N basic security audit passed.");
