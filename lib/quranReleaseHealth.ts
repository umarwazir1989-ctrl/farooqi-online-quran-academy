import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function collectQuranReleaseHealth() {
  const sb = getSupabaseAdmin();
  const started = Date.now();

  const [assignments, attempts, pendingAttempts, revisions, digests, events] = await Promise.all([
    sb.from("quran_assignments").select("id", { count: "exact", head: true }),
    sb.from("quran_attempts").select("id", { count: "exact", head: true }),
    sb.from("quran_attempts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("quran_revision_queue").select("id", { count: "exact", head: true }).in("status", ["pending", "started"]),
    sb.from("quran_parent_digests").select("id", { count: "exact", head: true }),
    sb.from("quran_system_events").select("id", { count: "exact", head: true }),
  ]);

  const errors = [assignments.error, attempts.error, pendingAttempts.error, revisions.error, digests.error, events.error].filter(Boolean);

  const qfConfigured = Boolean(process.env.QF_ENV && process.env.QF_CLIENT_ID && process.env.QF_CLIENT_SECRET);
  const cronSecretConfigured = Boolean(process.env.CRON_SECRET);
  const brevoConfigured = Boolean(process.env.BREVO_API_KEY);

  return {
    ok: errors.length === 0 && qfConfigured,
    latencyMs: Date.now() - started,
    databaseOk: errors.length === 0,
    quranFoundationConfigured: qfConfigured,
    cronSecretConfigured,
    brevoConfigured,
    counts: {
      assignments: assignments.count || 0,
      attempts: attempts.count || 0,
      pendingAttempts: pendingAttempts.count || 0,
      activeRevisions: revisions.count || 0,
      digests: digests.count || 0,
      events: events.count || 0,
    },
    errors: errors.map((e: any) => e?.message || "Unknown database error"),
  };
}
