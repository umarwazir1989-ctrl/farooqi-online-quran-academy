import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const allowed = new Set(["correct","repeat","makhraj_issue","tajweed_issue"]);

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || !["teacher","admin"].includes(profile.role) || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = String(body.status || "");
    const feedback = String(body.feedback || "").trim().slice(0, 2500);

    if (!allowed.has(status)) {
      return NextResponse.json({ ok:false, error:"Invalid review status." }, { status:400 });
    }

    const sb = getSupabaseAdmin();
    let teacherId: string | null = null;

    const { data: attempt, error: attemptError } = await sb
      .from("quran_attempts")
      .select("id,student_id")
      .eq("id", id)
      .maybeSingle();

    if (attemptError) throw attemptError;
    if (!attempt) return NextResponse.json({ ok:false, error:"Attempt not found." }, { status:404 });

    if (profile.role === "teacher") {
      const { data: teacher, error: teacherError } = await sb
        .from("teachers")
        .select("id")
        .eq("user_id", profile.id)
        .eq("status", "active")
        .maybeSingle();

      if (teacherError) throw teacherError;
      if (!teacher) return NextResponse.json({ ok:false, error:"Teacher not linked." }, { status:403 });

      teacherId = teacher.id;

      const { data: assigned, error: assignedError } = await sb
        .from("enrollments")
        .select("id")
        .eq("teacher_id", teacher.id)
        .eq("student_id", attempt.student_id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (assignedError) throw assignedError;
      if (!assigned) {
        return NextResponse.json({ ok:false, error:"Student is not assigned to you." }, { status:403 });
      }
    }

    const { data, error } = await sb
      .from("quran_attempts")
      .update({
        status,
        teacher_feedback: feedback || null,
        reviewed_by: teacherId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id,status,teacher_feedback,reviewed_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok:true, attempt:data });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Review failed." },
      { status:500 }
    );
  }
}
