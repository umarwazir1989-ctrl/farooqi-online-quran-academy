import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { runLaunchDiagnostics } from "@/lib/launchDiagnostics";
import { collectQuranReleaseHealth } from "@/lib/quranReleaseHealth";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();

    const [diagnostics, health, latestAudit] = await Promise.all([
      runLaunchDiagnostics(),
      collectQuranReleaseHealth(),
      sb.from("quran_launch_audits")
        .select("id,audit_type,result,details,created_at")
        .eq("audit_type","release")
        .order("created_at",{ascending:false})
        .limit(1)
        .maybeSingle(),
    ]);

    if (latestAudit.error) throw latestAudit.error;

    const blockers = [
      !diagnostics.ok ? "Launch diagnostics have failing checks." : null,
      !health.databaseOk ? "Database health check failed." : null,
      !health.quranFoundationConfigured ? "Quran Foundation environment is incomplete." : null,
      latestAudit.data?.result === "fail" ? "Latest release audit is marked FAIL." : null,
    ].filter(Boolean);

    const warnings = [
      !health.cronSecretConfigured ? "CRON_SECRET is not configured." : null,
      !health.brevoConfigured ? "Brevo email delivery is not configured." : null,
      (health.counts?.pendingAttempts || 0) > 0 ? `${health.counts.pendingAttempts} Quran attempt(s) are pending teacher review.` : null,
      !latestAudit.data ? "No release audit has been recorded yet." : null,
      latestAudit.data?.result === "warn" ? "Latest release audit is marked WARN." : null,
    ].filter(Boolean);

    return NextResponse.json({
      ok:true,
      releaseReady:blockers.length === 0,
      blockers,
      warnings,
      diagnostics:diagnostics.summary,
      health,
      latestAudit:latestAudit.data || null,
      generatedAt:new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Release status failed." },
      { status:500 }
    );
  }
}
