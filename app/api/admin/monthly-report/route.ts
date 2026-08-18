import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { generateMonthlyReport } from "@/lib/learningServer";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const report = await generateMonthlyReport({
      studentId: String(body.studentId || ""),
      month: String(body.month || ""),
      publish: Boolean(body.publish),
      progressSummary: body.progressSummary ? String(body.progressSummary) : "",
      strengths: body.strengths ? String(body.strengths) : "",
      improvementAreas: body.improvementAreas ? String(body.improvementAreas) : "",
      nextMonthGoal: body.nextMonthGoal ? String(body.nextMonthGoal) : "",
      teacherComment: body.teacherComment ? String(body.teacherComment) : "",
    });

    return NextResponse.json({ ok: true, report });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not generate report." },
      { status: 500 }
    );
  }
}
