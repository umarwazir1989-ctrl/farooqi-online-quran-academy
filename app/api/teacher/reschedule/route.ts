import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { createRescheduleRequest } from "@/lib/operationsServer";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "teacher" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = await createRescheduleRequest({
      teacherUserId: profile.id,
      enrollmentId: String(body.enrollmentId || ""),
      originalDate: String(body.originalDate || ""),
      requestedDate: String(body.requestedDate || ""),
      requestedTime: body.requestedTime ? String(body.requestedTime) : null,
      timezone: body.timezone ? String(body.timezone) : "Asia/Karachi",
      reason: body.reason ? String(body.reason) : null,
      requestType: body.requestType ? String(body.requestType) : "reschedule",
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not submit request." },
      { status: 500 }
    );
  }
}
