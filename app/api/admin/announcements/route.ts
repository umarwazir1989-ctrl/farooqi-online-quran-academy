import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { createAnnouncement } from "@/lib/adminOpsServer";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = await createAnnouncement({
      actorUserId: profile.id,
      titleEn: String(body.titleEn || ""),
      titleUr: body.titleUr ? String(body.titleUr) : "",
      bodyEn: String(body.bodyEn || ""),
      bodyUr: body.bodyUr ? String(body.bodyUr) : "",
      audience: String(body.audience || "all"),
      priority: String(body.priority || "normal"),
      publishUntil: body.publishUntil ? String(body.publishUntil) : null,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not create announcement." },
      { status: 500 }
    );
  }
}
