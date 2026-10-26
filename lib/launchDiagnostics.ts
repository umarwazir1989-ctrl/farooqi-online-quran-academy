import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

async function tableCheck(table: string): Promise<Check> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from(table).select("*", { head: true, count: "exact" }).limit(1);

  return {
    name: `table:${table}`,
    ok: !error,
    detail: error ? error.message : "OK",
  };
}

export async function runLaunchDiagnostics() {
  const sb = getSupabaseAdmin();

  const tables = [
    "profiles",
    "parents",
    "teachers",
    "students",
    "courses",
    "enrollments",
    "qaida_attempts",
    "qaida_lesson_progress",
    "qaida_practice_queue",
    "quran_assignments",
    "quran_attempts",
    "quran_revision_queue",
    "quran_parent_digests",
    "quran_system_events",
    "quran_launch_audits",
  ];

  const tableChecks = await Promise.all(tables.map(tableCheck));

  const { data: buckets, error: bucketError } = await sb.storage.listBuckets();
  const bucketNames = new Set((buckets || []).map((b: any) => b.name));

  const bucketChecks: Check[] = [
    {
      name: "bucket:qaida-recordings",
      ok: !bucketError && bucketNames.has("qaida-recordings"),
      detail: bucketError?.message || (bucketNames.has("qaida-recordings") ? "OK" : "Missing"),
    },
    {
      name: "bucket:quran-recordings",
      ok: !bucketError && bucketNames.has("quran-recordings"),
      detail: bucketError?.message || (bucketNames.has("quran-recordings") ? "OK" : "Missing"),
    },
  ];

  const envChecks: Check[] = [
    {
      name: "env:NEXT_PUBLIC_SUPABASE_URL",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configured" : "Missing",
    },
    {
      name: "env:NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      detail: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configured" : "Missing",
    },
    {
      name: "env:SUPABASE_SERVICE_ROLE_KEY",
      ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      detail: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Configured" : "Missing",
    },
    {
      name: "env:QF_ENV",
      ok: Boolean(process.env.QF_ENV),
      detail: process.env.QF_ENV || "Missing",
    },
    {
      name: "env:QF_CLIENT_ID",
      ok: Boolean(process.env.QF_CLIENT_ID),
      detail: process.env.QF_CLIENT_ID ? "Configured" : "Missing",
    },
    {
      name: "env:QF_CLIENT_SECRET",
      ok: Boolean(process.env.QF_CLIENT_SECRET),
      detail: process.env.QF_CLIENT_SECRET ? "Configured" : "Missing",
    },
    {
      name: "env:CRON_SECRET",
      ok: Boolean(process.env.CRON_SECRET),
      detail: process.env.CRON_SECRET ? "Configured" : "Missing",
    },
  ];

  const checks = [...envChecks, ...tableChecks, ...bucketChecks];
  const failed = checks.filter((c) => !c.ok);

  return {
    ok: failed.length === 0,
    checks,
    summary: {
      total: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
    },
    generatedAt: new Date().toISOString(),
  };
}
