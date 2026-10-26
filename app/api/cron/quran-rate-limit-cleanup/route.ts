import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.rpc("cleanup_quran_api_rate_limits");
    if (error) throw error;

    return NextResponse.json({
      ok:true,
      deleted:Number(data || 0),
      generatedAt:new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Cleanup failed." },
      { status:500 }
    );
  }
}
