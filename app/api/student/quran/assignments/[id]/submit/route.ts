import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const sb = getSupabaseAdmin();

    const { data: student, error: studentError } = await sb
      .from("students")
      .select("id")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .maybeSingle();

    if (studentError) throw studentError;
    if (!student) {
      return NextResponse.json({ ok: false, error: "Student not linked." }, { status: 400 });
    }

    const { data: assignment, error: assignmentError } = await sb
      .from("quran_assignments")
      .select("id,student_id,status")
      .eq("id", id)
      .eq("student_id", student.id)
      .maybeSingle();

    if (assignmentError) throw assignmentError;
    if (!assignment) {
      return NextResponse.json({ ok: false, error: "Assignment not found." }, { status: 404 });
    }

    if (!["assigned", "in_progress"].includes(assignment.status)) {
      return NextResponse.json(
        { ok: false, error: "Assignment cannot be submitted in its current state." },
        { status: 400 }
      );
    }

    const { data: attempts, error: attemptsError } = await sb
      .from("quran_attempts")
      .select("id")
      .eq("student_id", student.id)
      .eq("assignment_id", assignment.id);

    if (attemptsError) throw attemptsError;
    if (!attempts?.length) {
      return NextResponse.json(
        { ok: false, error: "Record at least one Quran attempt before submitting." },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();

    const { data, error } = await sb
      .from("quran_assignments")
      .update({
        status: "submitted",
        submitted_at: submittedAt,
      })
      .eq("id", assignment.id)
      .select("id,status,submitted_at")
      .single();

    if (error) throw error;

    await sb.from("quran_system_events").insert({
      event_type: "assignment_submitted",
      student_id: student.id,
      assignment_id: assignment.id,
      metadata: { attempt_count: attempts.length },
    });

    return NextResponse.json({ ok: true, assignment: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Submission failed." },
      { status: 500 }
    );
  }
}
