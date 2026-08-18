import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { saveClassRecord } from "@/lib/learningServer";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "teacher" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = await saveClassRecord({
      enrollmentId: String(body.enrollmentId || ""),
      teacherUserId: profile.id,
      classDate: String(body.classDate || ""),
      attendanceStatus: String(body.attendanceStatus || "present"),
      lessonType: String(body.lessonType || "quran_reading"),
      lessonTitle: body.lessonTitle ? String(body.lessonTitle) : "",
      lessonFrom: body.lessonFrom ? String(body.lessonFrom) : "",
      lessonTo: body.lessonTo ? String(body.lessonTo) : "",
      newLesson: body.newLesson ? String(body.newLesson) : "",
      sabqiRevision: body.sabqiRevision ? String(body.sabqiRevision) : "",
      manzilRevision: body.manzilRevision ? String(body.manzilRevision) : "",
      tajweedFocus: body.tajweedFocus ? String(body.tajweedFocus) : "",
      mistakesNotes: body.mistakesNotes ? String(body.mistakesNotes) : "",
      homework: body.homework ? String(body.homework) : "",
      teacherNotes: body.teacherNotes ? String(body.teacherNotes) : "",
      performanceScore: body.performanceScore ? Number(body.performanceScore) : null,
      durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : 30,
    });

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not save class record." },
      { status: 500 }
    );
  }
}
