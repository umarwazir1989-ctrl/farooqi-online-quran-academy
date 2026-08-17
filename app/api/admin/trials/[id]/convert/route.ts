import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { createStudentFromTrial } from "@/lib/academyServer";

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

    const result = await createStudentFromTrial({
      trialId: id,
      courseId: String(body.courseId || ""),
      teacherId: body.teacherId ? String(body.teacherId) : null,
      days: Array.isArray(body.days) ? body.days.map(String) : [],
      startTime: body.startTime ? String(body.startTime) : null,
      durationMinutes: Math.max(15, Math.min(120, Number(body.durationMinutes) || 30)),
      timezone: String(body.timezone || "Asia/Karachi"),
      adminNotes: body.adminNotes ? String(body.adminNotes) : null,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Conversion failed",
      },
      { status: 500 }
    );
  }
}
