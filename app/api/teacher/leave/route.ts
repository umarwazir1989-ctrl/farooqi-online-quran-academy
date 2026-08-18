import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { submitTeacherLeave } from "@/lib/adminOpsServer";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "teacher" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = await submitTeacherLeave({
      teacherUserId: profile.id,
      leaveType: String(body.leaveType || "personal"),
      startDate: String(body.startDate || ""),
      endDate: String(body.endDate || ""),
      reason: body.reason ? String(body.reason) : null,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Leave request failed." },
      { status: 500 }
    );
  }
}
