import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateStreak, rewardPointsForStatus, revisionIntervalForStatus } from "@/lib/qaidaSpacedRevision";

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();
    const { data: student, error: studentError } = await sb
      .from("students").select("id").eq("user_id", profile.id).maybeSingle();

    if (studentError) throw studentError;
    if (!student) return NextResponse.json({ ok:true, due:[], metrics:null });

    const { data: attempts, error: attemptsError } = await sb
      .from("qaida_attempts")
      .select("id,lesson_slug,item_text,status,created_at")
      .eq("student_id", student.id)
      .in("status", ["correct","repeat","makhraj_issue"])
      .order("created_at", { ascending:false })
      .limit(250);

    if (attemptsError) throw attemptsError;

    for (const a of attempts || []) {
      const { data: existing } = await sb.from("qaida_revision_schedule").select("id")
        .eq("student_id", student.id).eq("source_attempt_id", a.id).limit(1).maybeSingle();

      if (!existing) {
        const days = revisionIntervalForStatus(a.status as any, 1);
        const dueAt = new Date(new Date(a.created_at).getTime() + days * 86400000).toISOString();
        await sb.from("qaida_revision_schedule").insert({
          student_id: student.id,
          lesson_slug: a.lesson_slug,
          item_text: a.item_text,
          source_attempt_id: a.id,
          interval_days: days,
          due_at: dueAt,
          status: "due",
        });
      }
    }

    const { data: due, error: dueError } = await sb.from("qaida_revision_schedule")
      .select("id,lesson_slug,item_text,interval_days,due_at,status")
      .eq("student_id", student.id)
      .eq("status", "due")
      .lte("due_at", new Date().toISOString())
      .order("due_at", { ascending:true })
      .limit(30);

    if (dueError) throw dueError;

    const dates = (attempts || []).map((a:any) => a.created_at);
    const streak = calculateStreak(dates);
    const rewardPoints = (attempts || []).reduce(
      (sum:number, a:any) => sum + rewardPointsForStatus(a.status),
      0
    );

    const metrics = {
      student_id: student.id,
      current_streak: streak.currentStreak,
      longest_streak: streak.longestStreak,
      total_practice_days: streak.totalPracticeDays,
      total_attempts: attempts?.length || 0,
      last_practice_date: attempts?.[0]?.created_at?.slice(0,10) || null,
      reward_points: rewardPoints,
      updated_at: new Date().toISOString(),
    };

    await sb.from("qaida_student_metrics").upsert(metrics, { onConflict:"student_id" });

    return NextResponse.json({ ok:true, due: due || [], metrics });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}
