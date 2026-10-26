import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { adaptivePriority } from "@/lib/qaidaAdaptive";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || profile.status !== "active")
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });

  try {
    const sb = getSupabaseAdmin();
    const { data: student, error: studentError } = await sb
      .from("students")
      .select("id")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (studentError) throw studentError;
    if (!student) return NextResponse.json({ ok:true, queue:[], progress:[] });

    // Adaptive practice must be driven by teacher-reviewed problem attempts only.
    const { data: attempts, error: attemptsError } = await sb
      .from("qaida_attempts")
      .select("id,lesson_slug,item_text,status,created_at,reviewed_at")
      .eq("student_id", student.id)
      .in("status", ["repeat","makhraj_issue"])
      .not("reviewed_at", "is", null)
      .order("created_at", { ascending:false })
      .limit(100);

    if (attemptsError) throw attemptsError;

    for (const attempt of attempts || []) {
      const ageHours = Math.max(
        0,
        (Date.now() - new Date(attempt.created_at).getTime()) / 36e5
      );

      const { data: existing, error: existingError } = await sb
        .from("qaida_practice_queue")
        .select("id")
        .eq("student_id", student.id)
        .eq("source_attempt_id", attempt.id)
        .in("status", ["pending","started"])
        .limit(1)
        .maybeSingle();

      if (existingError) throw existingError;

      if (!existing) {
        const { error: insertError } = await sb.from("qaida_practice_queue").insert({
          student_id: student.id,
          lesson_slug: attempt.lesson_slug,
          item_text: attempt.item_text,
          reason: "adaptive",
          priority: adaptivePriority(attempt.status, ageHours),
          source_attempt_id: attempt.id,
          status: "pending",
        });

        if (insertError && insertError.code !== "23505") throw insertError;
      }
    }

    const { data: queue, error: queueError } = await sb
      .from("qaida_practice_queue")
      .select("id,lesson_slug,item_text,reason,priority,status,created_at")
      .eq("student_id", student.id)
      .in("status", ["pending","started"])
      .order("priority", { ascending:false })
      .order("created_at", { ascending:false })
      .limit(30);

    if (queueError) throw queueError;

    const { data: progress, error: progressError } = await sb
      .from("qaida_lesson_progress")
      .select("lesson_slug,status,completion_percent,teacher_approved,last_practiced_at,completed_at")
      .eq("student_id", student.id);

    if (progressError) throw progressError;

    return NextResponse.json({ ok:true, queue:queue || [], progress:progress || [] });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || profile.status !== "active")
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });

  try {
    const { queueId, action } = await request.json();

    if (!queueId || !["start","done"].includes(action))
      return NextResponse.json({ ok:false, error:"Invalid request." }, { status:400 });

    const sb = getSupabaseAdmin();

    const { data: student } = await sb
      .from("students")
      .select("id")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (!student)
      return NextResponse.json({ ok:false, error:"Student not linked." }, { status:400 });

    const { data, error } = await sb
      .from("qaida_practice_queue")
      .update({
        status: action === "start" ? "started" : "done",
        completed_at: action === "done" ? new Date().toISOString() : null,
      })
      .eq("id", String(queueId))
      .eq("student_id", student.id)
      .in("status", ["pending","started"])
      .select("id,status")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok:true, queue:data });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Failed." },
      { status:500 }
    );
  }
}
