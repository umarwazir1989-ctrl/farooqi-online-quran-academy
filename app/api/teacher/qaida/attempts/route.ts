import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  const profile = await getCurrentProfile();

  if (
    !profile ||
    !["teacher", "admin"].includes(profile.role) ||
    profile.status !== "active"
  ) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sb = getSupabaseAdmin();

    let studentIds: string[] | null = null;

    if (profile.role === "teacher") {
      const { data: teacher, error: teacherError } = await sb
        .from("teachers")
        .select("id")
        .eq("user_id", profile.id)
        .eq("status", "active")
        .maybeSingle();

      if (teacherError) throw teacherError;
      if (!teacher) {
        return NextResponse.json({ ok: true, attempts: [] });
      }

      const { data: enrollments, error: enrollmentError } = await sb
        .from("enrollments")
        .select("student_id")
        .eq("teacher_id", teacher.id)
        .eq("status", "active");

      if (enrollmentError) throw enrollmentError;

      studentIds = Array.from(
        new Set((enrollments || []).map((row: any) => row.student_id).filter(Boolean))
      );

      if (studentIds.length === 0) {
        return NextResponse.json({ ok: true, attempts: [] });
      }
    }

    let query = sb
      .from("qaida_attempts")
      .select(`
        id,
        student_id,
        lesson_slug,
        item_text,
        audio_key,
        recording_path,
        status,
        teacher_feedback,
        reviewed_at,
        created_at,
        students:student_id (
          full_name,
          student_code
        )
      `)
      .order("created_at", { ascending: false })
      .limit(200);

    if (studentIds) {
      query = query.in("student_id", studentIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    const attempts = await Promise.all(
      (data || []).map(async (attempt: any) => {
        const { data: signed } = await sb.storage
          .from("qaida-recordings")
          .createSignedUrl(attempt.recording_path, 60 * 30);

        return {
          ...attempt,
          recordingUrl: signed?.signedUrl || null,
          recording_path: undefined,
        };
      })
    );

    return NextResponse.json({ ok: true, attempts });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed." },
      { status: 500 }
    );
  }
}
