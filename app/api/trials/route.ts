import { NextResponse } from "next/server";
import { createTrialApplication } from "@/lib/supabaseServer";

const allowedLocales = new Set(["ur", "en"]);

function clean(value: unknown, max = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function optionalInt(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n < 120 ? Math.round(n) : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const student_name = clean(body.student_name, 120);
    const whatsapp = clean(body.whatsapp, 60);
    const country = clean(body.country, 100);
    const course = clean(body.course, 120);

    if (!student_name || !whatsapp || !country || !course) {
      return NextResponse.json(
        { ok: false, error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const locale = allowedLocales.has(body.locale) ? body.locale : "en";
    const preferred_days = Array.isArray(body.preferred_days)
      ? body.preferred_days.map((x: unknown) => clean(x, 20)).filter(Boolean)
      : [];

    const record = await createTrialApplication({
      student_name,
      parent_name: clean(body.parent_name, 120) || null,
      email: clean(body.email, 160) || null,
      whatsapp,
      country,
      city: clean(body.city, 100) || null,
      age: optionalInt(body.age),
      gender: clean(body.gender, 30) || null,
      preferred_teacher_gender:
        clean(body.preferred_teacher_gender, 30) || null,
      course,
      preferred_language: clean(body.preferred_language, 50) || null,
      timezone: clean(body.timezone, 100) || null,
      preferred_days,
      preferred_time: clean(body.preferred_time, 80) || null,
      previous_level: clean(body.previous_level, 300) || null,
      message: clean(body.message, 1200) || null,
      locale,
      source: "website",
      status: "new",
    });

    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (error) {
    console.error("trial application error", error);
    return NextResponse.json(
      { ok: false, error: "Unable to submit your request right now." },
      { status: 500 }
    );
  }
}
