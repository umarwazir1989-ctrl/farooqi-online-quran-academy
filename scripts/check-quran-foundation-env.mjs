const required = ["QF_CLIENT_ID", "QF_CLIENT_SECRET"];
let ok = true;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key}`);
    ok = false;
  }
}

const env = process.env.QF_ENV || "prelive";
if (!["prelive","production"].includes(env)) {
  console.error("QF_ENV must be prelive or production");
  ok = false;
}

if (!ok) process.exit(1);

console.log("Quran Foundation server environment variables look configured.");
console.log(`QF_ENV=${env}`);
console.log("Secrets were not printed.");
