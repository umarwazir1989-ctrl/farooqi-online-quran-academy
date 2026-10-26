import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { nextRevisionDate } from "@/lib/quranMastery";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const sb = getSupabaseAdmin();
    const { data: student } = await sb.from("students").select("id").eq("user_id", profile.id).maybeSingle();
    if (!student) return NextResponse.json({ ok:true, revision:[] });

    const { data, error } = await sb.from("quran_revision_queue")
      .select("id,surah_number,ayah_number,word_position,reason,priority,due_at,status,review_count")
      .eq("student_id", student.id)
      .in("status", ["pending","started"])
      .order("priority", { ascending:false })
      .order("due_at", { ascending:true })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ ok:true, revision:data || [] });
  } catch (error) {
    return NextResponse.json({ ok:false, error:error instanceof Error ? error.message : "Failed." }, { status:500 });
  }
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const { id, action } = await request.json();
    if (!id || !["start","done"].includes(action)) {
      return NextResponse.json({ ok:false, error:"Invalid request." }, { status:400 });
    }

    const sb = getSupabaseAdmin();
    const { data: student } = await sb.from("students").select("id").eq("user_id", profile.id).maybeSingle();
    if (!student) return NextResponse.json({ ok:false, error:"Student not linked." }, { status:400 });

    const { data: existing, error: existingError } = await sb
      .from("quran_revision_queue")
      .select("id,status,review_count,source_attempt_id")
      .eq("id", id)
      .eq("student_id", student.id)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) return NextResponse.json({ ok:false, error:"Revision item not found." }, { status:404 });

    if (action === "start") {
      const { data, error } = await sb.from("quran_revision_queue")
        .update({ status:"started" })
        .eq("id", id)
        .eq("student_id", student.id)
        .select("id,status")
        .single();

      if (error) throw error;
      return NextResponse.json({ ok:true, revision:data });
    }

    let sourceStatus = "correct";
    if (existing.source_attempt_id) {
      const { data: sourceAttempt } = await sb
        .from("quran_attempts")
        .select("status")
        .eq("id", existing.source_attempt_id)
        .maybeSingle();
      sourceStatus = sourceAttempt?.status || sourceStatus;
    }

    const reviewCount = Number(existing.review_count || 0) + 1;
    const dueAt = nextRevisionDate(sourceStatus, reviewCount);
    const completedAt = new Date().toISOString();

    const { data, error } = await sb.from("quran_revision_queue")
      .update({
        status:"done",
        completed_at:completedAt,
        review_count:reviewCount,
        last_reviewed_at:completedAt,
      })
      .eq("id", id)
      .eq("student_id", student.id)
      .select("id,status,review_count")
      .single();

    if (error) throw error;

    await sb.from("quran_system_events").insert({
      event_type:"revision_completed",
      student_id:student.id,
      metadata:{ revision_id:id, next_due_at:dueAt, review_count:reviewCount },
    });

    return NextResponse.json({ ok:true, revision:data, nextDueAt:dueAt });
  } catch (error) {
    return NextResponse.json({ ok:false, error:error instanceof Error ? error.message : "Failed." }, { status:500 });
  }
}
