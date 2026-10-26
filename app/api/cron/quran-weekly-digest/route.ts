import { NextResponse } from "next/server";
import { buildCurrentWeekParentDigests } from "@/lib/quranWeeklyDigest";

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
    const result = await buildCurrentWeekParentDigests();
    return NextResponse.json({ ok:true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Digest generation failed." },
      { status:500 }
    );
  }
}
