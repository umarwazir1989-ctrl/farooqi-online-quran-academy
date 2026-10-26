import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const allowedStatuses = new Set([
  "locked",
  "available",
  "in_progress",
  "review",
  "completed",
]);

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "teacher" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();

    const { data: teacher, error: teacherError } = await sb
      .from("teachers")
      .select("id")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .maybeSingle();

    if (teacherError) throw teacherError;
    if (!teacher) return NextResponse.json({ ok:true, students:[] });

    const { data: enrollments, error: enrollmentError } = await sb
      .from("enrollments")
      .select("student_id")
      .eq("teacher_id", teacher.id)
      .eq("status", "active");

    if (enrollmentError) throw enrollmentError;

    const studentIds = Array.from(
      new Set((enrollments || []).map((e:any) => e.student_id).filter(Boolean))
    );

    if (!studentIds.length) {
      return NextResponse.json({ ok:true, students:[] });
    }

    const [{ data: students, error: studentsError }, { data: progress, error: progressError }] =
      await Promise.all([
        sb.from("students")
          .select("id,full_name,student_code,status")
          .in("id", studentIds)
          .eq("status", "active"),
        sb.from("qaida_lesson_progress")
          .select("student_id,lesson_slug,status,completion_percent,teacher_approved,approved_at,next_review_at")
          .in("student_id", studentIds),
      ]);

    if (studentsError) throw studentsError;
    if (progressError) throw progressError;

    return NextResponse.json({
      ok:true,
      students:(students || []).map((student:any) => ({
        ...student,
        progress:(progress || []).filter((p:any) => p.student_id === student.id),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "teacher" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const body = await request.json();
    const studentId = String(body.studentId || "");
    const lessonSlug = String(body.lessonSlug || "").trim();
    const status = String(body.status || "");
    const approved = Boolean(body.approved);

    if (!studentId || !lessonSlug || !allowedStatuses.has(status)) {
      return NextResponse.json({ ok:false, error:"Invalid request." }, { status:400 });
    }

    const sb = getSupabaseAdmin();

    const { data: teacher, error: teacherError } = await sb
      .from("teachers")
      .select("id")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .maybeSingle();

    if (teacherError) throw teacherError;
    if (!teacher) {
      return NextResponse.json({ ok:false, error:"Teacher not linked." }, { status:403 });
    }

    const { data: assigned, error: assignedError } = await sb
      .from("enrollments")
      .select("id")
      .eq("teacher_id", teacher.id)
      .eq("student_id", studentId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (assignedError) throw assignedError;
    if (!assigned) {
      return NextResponse.json(
        { ok:false, error:"This student is not assigned to you." },
        { status:403 }
      );
    }

    const now = new Date().toISOString();

    const payload:any = {
      student_id: studentId,
      lesson_slug: lessonSlug,
      status,
      teacher_approved: approved,
      unlocked_by: teacher.id,
      approved_by: approved ? teacher.id : null,
      approved_at: approved ? now : null,
      updated_at: now,
    };

    const { data, error } = await sb
      .from("qaida_lesson_progress")
      .upsert(payload, { onConflict:"student_id,lesson_slug" })
      .select("student_id,lesson_slug,status,completion_percent,teacher_approved,approved_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok:true, progress:data });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}
