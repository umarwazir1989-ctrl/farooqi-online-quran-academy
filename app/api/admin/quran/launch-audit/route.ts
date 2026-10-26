import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { collectQuranReleaseHealth } from "@/lib/quranReleaseHealth";

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();

    const [{ data: audits, error: auditError }, health] = await Promise.all([
      sb.from("quran_launch_audits")
        .select("id,audit_type,result,details,created_at")
        .order("created_at", { ascending:false })
        .limit(50),
      collectQuranReleaseHealth(),
    ]);

    if (auditError) throw auditError;

    return NextResponse.json({
      ok:true,
      health,
      audits:audits || [],
    });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const body = await request.json();
    const auditType = String(body.auditType || "");
    const result = String(body.result || "");
    const details = body.details && typeof body.details === "object" ? body.details : {};

    if (!["smoke","role_test","security","release"].includes(auditType) ||
        !["pass","warn","fail"].includes(result)) {
      return NextResponse.json({ ok:false, error:"Invalid audit payload." }, { status:400 });
    }

    const sb = getSupabaseAdmin();

    const { data, error } = await sb.from("quran_launch_audits")
      .insert({
        audit_type:auditType,
        result,
        details,
      })
      .select("id,audit_type,result,created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok:true, audit:data });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}
