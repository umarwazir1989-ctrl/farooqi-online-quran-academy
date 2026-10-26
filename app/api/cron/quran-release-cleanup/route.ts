import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb=getSupabaseAdmin();

    const [rateLimits, releaseChecks] = await Promise.all([
      sb.rpc("cleanup_quran_api_rate_limits"),
      sb.rpc("cleanup_quran_release_checks"),
    ]);

    if (rateLimits.error) throw rateLimits.error;
    if (releaseChecks.error) throw releaseChecks.error;

    return NextResponse.json({
      ok:true,
      deleted:{
        rateLimits:Number(rateLimits.data||0),
        releaseChecks:Number(releaseChecks.data||0),
      },
      generatedAt:new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Cleanup failed." },
      { status:500 }
    );
  }
}
