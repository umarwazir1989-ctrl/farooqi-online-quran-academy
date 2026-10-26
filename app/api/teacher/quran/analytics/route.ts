import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quranReviewScore } from "@/lib/quranProgress";
import { masteryLevel } from "@/lib/quranMastery";

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "teacher" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();

    const { data: teacher, error: teacherError } = await sb
      .from("teachers").select("id").eq("user_id",profile.id).eq("status","active").maybeSingle();

    if (teacherError) throw teacherError;
    if (!teacher) return NextResponse.json({ ok:true, students:[] });

    const { data: enrollments, error: enrollmentError } = await sb
      .from("enrollments")
      .select("student_id,students:student_id(id,full_name,student_code)")
      .eq("teacher_id",teacher.id)
      .eq("status","active");

    if (enrollmentError) throw enrollmentError;

    const rows = await Promise.all((enrollments || []).map(async (e:any) => {
      const { data: attempts } = await sb.from("quran_attempts")
        .select("status,created_at")
        .eq("student_id",e.student_id)
        .order("created_at",{ascending:false})
        .limit(150);

      const reviewed = (attempts || []).filter((a:any) => a.status !== "pending");
      const score = reviewed.length
        ? Math.round(reviewed.reduce((s:number,a:any)=>s+quranReviewScore(a.status),0)/reviewed.length)
        : 0;

      const { count: pendingAssignments } = await sb
        .from("quran_assignments")
        .select("id",{ count:"exact", head:true })
        .eq("student_id",e.student_id)
        .in("status",["assigned","in_progress","submitted"]);

      return {
        ...(e.students || {}),
        reviewed:reviewed.length,
        score,
        mastery:masteryLevel(score,reviewed.length),
        pendingAssignments:pendingAssignments || 0,
        makhraj:reviewed.filter((a:any)=>a.status==="makhraj_issue").length,
        tajweed:reviewed.filter((a:any)=>a.status==="tajweed_issue").length,
        lastPracticeAt:attempts?.[0]?.created_at || null,
      };
    }));

    return NextResponse.json({ ok:true, students:rows });
  } catch (error) {
    return NextResponse.json({ ok:false, error:error instanceof Error ? error.message : "Failed." }, { status:500 });
  }
}
