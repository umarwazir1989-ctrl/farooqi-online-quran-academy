import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceQuranRateLimit } from "@/lib/quranRateLimit";

export const runtime = "nodejs";
const MAX = 15 * 1024 * 1024;
const allowedMime = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
]);

function normalizeMime(type: string) {
  return (type || "audio/webm").split(";")[0].trim().toLowerCase();
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const limited = await enforceQuranRateLimit(profile.id, "quran-attempt-upload", 10, 60);
    if (!limited.allowed) {
      return NextResponse.json(
        { ok:false, error:"Too many uploads. Please wait and try again." },
        { status:429, headers:{ "Retry-After": String(limited.retryAfterSeconds) } }
      );
    }

    const form = await request.formData();
    const file = form.get("audio");

    if (!(file instanceof File) || file.size <= 0 || file.size > MAX) {
      return NextResponse.json(
        { ok:false, error:"Valid audio recording up to 15 MB is required." },
        { status:400 }
      );
    }

    const mime = normalizeMime(file.type);
    if (!allowedMime.has(mime)) {
      return NextResponse.json(
        { ok:false, error:"Unsupported audio format." },
        { status:400 }
      );
    }

    const surahNumber = Number(form.get("surahNumber"));
    const ayahNumber = Number(form.get("ayahNumber"));
    const wordPositionRaw = form.get("wordPosition");
    const wordPosition = wordPositionRaw ? Number(wordPositionRaw) : null;
    const assignmentId = String(form.get("assignmentId") || "") || null;

    if (
      !Number.isInteger(surahNumber) ||
      surahNumber < 1 ||
      surahNumber > 114 ||
      !Number.isInteger(ayahNumber) ||
      ayahNumber < 1
    ) {
      return NextResponse.json({ ok:false, error:"Invalid Quran location." }, { status:400 });
    }

    const sb = getSupabaseAdmin();

    const { data: student, error: studentError } = await sb
      .from("students")
      .select("id")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .maybeSingle();

    if (studentError) throw studentError;
    if (!student) {
      return NextResponse.json({ ok:false, error:"Student not linked." }, { status:400 });
    }

    if (assignmentId) {
      const { data: assignment, error: assignmentError } = await sb
        .from("quran_assignments")
        .select("id,student_id,status")
        .eq("id", assignmentId)
        .eq("student_id", student.id)
        .maybeSingle();

      if (assignmentError) throw assignmentError;
      if (!assignment || !["assigned","in_progress","submitted"].includes(assignment.status)) {
        return NextResponse.json(
          { ok:false, error:"Invalid assignment reference." },
          { status:400 }
        );
      }
    }

    const ext =
      mime === "audio/ogg" ? "ogg" :
      mime === "audio/mp4" ? "m4a" :
      mime === "audio/mpeg" ? "mp3" :
      mime === "audio/wav" ? "wav" : "webm";

    const path = `${student.id}/${surahNumber}/${ayahNumber}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await sb.storage
      .from("quran-recordings")
      .upload(path, bytes, {
        contentType: mime,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data, error } = await sb
      .from("quran_attempts")
      .insert({
        student_id: student.id,
        assignment_id: assignmentId,
        surah_number: surahNumber,
        ayah_number: ayahNumber,
        word_position: wordPosition,
        recording_path: path,
        status: "pending",
      })
      .select("id,status,created_at")
      .single();

    if (error) {
      await sb.storage.from("quran-recordings").remove([path]);
      throw error;
    }

    if (assignmentId) {
      await sb.from("quran_assignments")
        .update({ status:"in_progress" })
        .eq("id",assignmentId)
        .eq("student_id",student.id)
        .eq("status","assigned");
    }

    await sb.from("quran_system_events").insert({
      event_type:"attempt_uploaded",
      student_id:student.id,
      assignment_id:assignmentId,
      attempt_id:data.id,
      metadata:{ surah_number:surahNumber, ayah_number:ayahNumber, word_position:wordPosition },
    });

    return NextResponse.json({ ok:true, attempt:data });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Upload failed." },
      { status:500 }
    );
  }
}
