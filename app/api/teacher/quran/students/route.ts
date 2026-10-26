import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

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

    const { data, error } = await sb
      .from("enrollments")
      .select(`
        student_id,
        students:student_id (
          id,
          full_name,
          student_code,
          status
        ),
        courses:course_id (
          code,
          name_en,
          name_ur
        )
      `)
      .eq("teacher_id", teacher.id)
      .eq("status", "active");

    if (error) throw error;

    return NextResponse.json({
      ok:true,
      students:(data || [])
        .filter((row:any) => row.students?.status === "active")
        .map((row:any) => ({
          ...row.students,
          course:row.courses || null,
        })),
    });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}
