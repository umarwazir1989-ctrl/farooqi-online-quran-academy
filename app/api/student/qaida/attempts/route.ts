import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
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
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("audio");
    const lessonSlug = String(form.get("lessonSlug") || "").trim();
    const itemText = String(form.get("itemText") || "").trim();
    const audioKey = String(form.get("audioKey") || "").trim() || null;

    if (!(file instanceof File) || !lessonSlug || !itemText) {
      return NextResponse.json(
        { ok: false, error: "Audio, lesson and item are required." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Recording must be between 1 byte and 10 MB." },
        { status: 400 }
      );
    }

    const mime = normalizeMime(file.type);

    if (!ALLOWED_TYPES.has(mime)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported audio type: ${mime}` },
        { status: 400 }
      );
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
      return NextResponse.json(
        { ok: false, error: "Student record is not linked to this login." },
        { status: 400 }
      );
    }

    const ext =
      mime === "audio/ogg" ? "ogg" :
      mime === "audio/mp4" ? "m4a" :
      mime === "audio/mpeg" ? "mp3" :
      mime === "audio/wav" ? "wav" : "webm";

    const safeLesson = lessonSlug.replace(/[^a-zA-Z0-9_-]/g, "-");
    const path = `${student.id}/${safeLesson}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await sb.storage
      .from("qaida-recordings")
      .upload(path, bytes, {
        contentType: mime,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: attempt, error: insertError } = await sb
      .from("qaida_attempts")
      .insert({
        student_id: student.id,
        lesson_slug: lessonSlug,
        item_text: itemText,
        audio_key: audioKey,
        recording_path: path,
        status: "pending",
      })
      .select("id,status,created_at")
      .single();

    if (insertError) {
      await sb.storage.from("qaida-recordings").remove([path]);
      throw insertError;
    }

    return NextResponse.json({ ok: true, attempt });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Recording upload failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sb = getSupabaseAdmin();

    const { data: student } = await sb
      .from("students")
      .select("id")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (!student) {
      return NextResponse.json({ ok: true, attempts: [] });
    }

    const { data, error } = await sb
      .from("qaida_attempts")
      .select("id,lesson_slug,item_text,status,teacher_feedback,reviewed_at,created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ ok: true, attempts: data || [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed." },
      { status: 500 }
    );
  }
}
