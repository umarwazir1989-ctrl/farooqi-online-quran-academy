import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { collectQuranReleaseHealth } from "@/lib/quranReleaseHealth";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const health = await collectQuranReleaseHealth();
    return NextResponse.json({ ok: health.ok, health, generatedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Health check failed." },
      { status:500 }
    );
  }
}
