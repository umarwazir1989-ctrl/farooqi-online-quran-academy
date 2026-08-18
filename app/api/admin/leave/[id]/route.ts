import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { decideTeacherLeave } from "@/lib/adminOpsServer";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const decision = body.decision === "approved" ? "approved" : "rejected";

    const result = await decideTeacherLeave({
      id,
      adminUserId: profile.id,
      decision,
      adminNotes: body.adminNotes ? String(body.adminNotes) : null,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not update leave request." },
      { status: 500 }
    );
  }
}
