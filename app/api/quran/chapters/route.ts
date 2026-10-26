import { NextResponse } from "next/server";
import { requireRole } from "@/lib/portalAuth";
import { qfFetch } from "@/lib/quranFoundationClient";

export const runtime = "nodejs";

export async function GET() {
  await requireRole(["student", "teacher", "parent", "admin"]);

  try {
    const data = await qfFetch<any>("/content/api/v4/chapters");
    return NextResponse.json({ ok: true, chapters: data.chapters || data || [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed." },
      { status: 500 }
    );
  }
}
