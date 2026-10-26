import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { assignmentScore } from "@/lib/quranMastery";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || !["teacher", "admin"].includes(profile.role) || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const note = String(body.note || "").trim().slice(0, 2500) || null;
    const sb = getSupabaseAdmin();

    const { data: assignment, error: assignmentError } = await sb
      .from("quran_assignments")
      .select("id,student_id,teacher_id,status")
      .eq("id", id)
      .maybeSingle();

    if (assignmentError) throw assignmentError;
    if (!assignment) {
      return NextResponse.json({ ok: false, error: "Assignment not found." }, { status: 404 });
    }

    let teacherId: string | null = null;

    if (profile.role === "teacher") {
      const { data: teacher, error: teacherError } = await sb
        .from("teachers")
        .select("id")
        .eq("user_id", profile.id)
        .eq("status", "active")
        .maybeSingle();

      if (teacherError) throw teacherError;
      if (!teacher || teacher.id !== assignment.teacher_id) {
        return NextResponse.json({ ok: false, error: "Not your assignment." }, { status: 403 });
      }
      teacherId = teacher.id;
    }

    const { data: attempts, error: attemptsError } = await sb
      .from("quran_attempts")
      .select("status")
      .eq("assignment_id", assignment.id);

    if (attemptsError) throw attemptsError;

    const statuses = (attempts || []).map((a: any) => a.status);
    const score = assignmentScore(statuses);

    const reviewedAt = new Date().toISOString();

    const { data, error } = await sb
      .from("quran_assignments")
      .update({
        status: "completed",
        completed_at: reviewedAt,
        reviewed_at: reviewedAt,
        review_note: note,
        completion_score: score,
      })
      .eq("id", assignment.id)
      .select("id,status,completion_score,completed_at")
      .single();

    if (error) throw error;

    await sb.from("quran_system_events").insert({
      event_type: "assignment_completed",
      student_id: assignment.student_id,
      teacher_id: teacherId,
      assignment_id: assignment.id,
      metadata: { completion_score: score },
    });

    return NextResponse.json({ ok: true, assignment: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Completion failed." },
      { status: 500 }
    );
  }
}
