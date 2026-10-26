import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quranReviewScore } from "@/lib/quranProgress";

function currentWeekRange() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day + 6) % 7;
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff));
  const end = new Date(start.getTime() + 6 * 86400000);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    fromIso: start.toISOString(),
    toIso: new Date(end.getTime() + 86400000 - 1).toISOString(),
  };
}

export async function buildCurrentWeekParentDigests() {
  const sb = getSupabaseAdmin();
  const w = currentWeekRange();

  const { data: parents, error: parentsError } = await sb
    .from("parents")
    .select("id")
    .not("user_id", "is", null);

  if (parentsError) throw parentsError;
  let generated = 0;

  for (const parent of parents || []) {
    const { data: children, error: childrenError } = await sb
      .from("students")
      .select("id,full_name,student_code")
      .eq("parent_id", parent.id)
      .eq("status", "active");

    if (childrenError) throw childrenError;

    for (const child of children || []) {
      const { data: attempts } = await sb
        .from("quran_attempts")
        .select("status,created_at")
        .eq("student_id", child.id)
        .gte("created_at", w.fromIso)
        .lte("created_at", w.toIso);

      const reviewed = (attempts || []).filter((a:any) => a.status !== "pending");
      const correct = reviewed.filter((a:any) => a.status === "correct").length;
      const repeat = reviewed.filter((a:any) => a.status === "repeat").length;
      const makhraj = reviewed.filter((a:any) => a.status === "makhraj_issue").length;
      const tajweed = reviewed.filter((a:any) => a.status === "tajweed_issue").length;

      const score = reviewed.length
        ? Math.round(reviewed.reduce((s:number,a:any)=>s + quranReviewScore(a.status),0) / reviewed.length)
        : 0;

      const { count: activeAssignments } = await sb.from("quran_assignments")
        .select("id",{count:"exact",head:true})
        .eq("student_id",child.id)
        .in("status",["assigned","in_progress","submitted"]);

      const { count: completedAssignments } = await sb.from("quran_assignments")
        .select("id",{count:"exact",head:true})
        .eq("student_id",child.id)
        .eq("status","completed")
        .gte("completed_at",w.fromIso)
        .lte("completed_at",w.toIso);

      const summaryText = reviewed.length === 0
        ? "اس ہفتے ابھی کوئی teacher-reviewed Quran attempt موجود نہیں۔"
        : `اس ہفتے ${reviewed.length} تلاوتوں کا جائزہ ہوا، ${correct} درست، ${makhraj} مخرج اور ${tajweed} تجوید کی اصلاحات ریکارڈ ہوئیں۔`;

      const { error } = await sb.from("quran_parent_digests").upsert({
        parent_id: parent.id,
        student_id: child.id,
        week_start: w.startDate,
        week_end: w.endDate,
        reviewed_attempts: reviewed.length,
        correct_count: correct,
        repeat_count: repeat,
        makhraj_count: makhraj,
        tajweed_count: tajweed,
        average_score: score,
        active_assignments: activeAssignments || 0,
        completed_assignments: completedAssignments || 0,
        summary_text: summaryText,
        delivery_status: "queued",
      }, { onConflict:"parent_id,student_id,week_start" });

      if (error) throw error;
      generated++;
    }
  }

  return { generated, weekStart:w.startDate, weekEnd:w.endDate };
}
