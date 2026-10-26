import { NextResponse } from "next/server";
import { createTrialApplication } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const student_name = String(data.name || data.student_name || "").trim();
    const whatsapp = String(data.phone || data.whatsapp || "").trim();
    const course = String(data.course || "").trim();
    const country = String(data.country || "").trim();

    if (!student_name || !whatsapp || !course || !country) {
      return NextResponse.json(
        { ok: false, message: "Required fields are missing." },
        { status: 400 }
      );
    }

    let id: string | null = null;

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      try {
        const record = await createTrialApplication({
          student_name: student_name.slice(0, 120),
          parent_name: data.parent_name ? String(data.parent_name).trim().slice(0, 120) : null,
          email: data.email ? String(data.email).trim().slice(0, 160) : null,
          whatsapp: whatsapp.slice(0, 60),
          country: country.slice(0, 100),
          city: data.city ? String(data.city).trim().slice(0, 100) : null,
          age: Number.isFinite(Number(data.age)) && Number(data.age) > 0 ? Math.round(Number(data.age)) : null,
          course: course.slice(0, 120),
          preferred_time: data.preferred_time ? String(data.preferred_time).trim().slice(0, 80) : null,
          message: data.message ? String(data.message).trim().slice(0, 1200) : null,
          locale: data.locale === "ur" ? "ur" : "en",
          source: "homepage_quick_form",
          status: "new",
        });
        id = record?.id || null;
      } catch (dbErr) {
        console.warn("Supabase trial save fallback:", dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      id: id || `FQA-${Date.now().toString().slice(-6)}`,
      message: "Request received.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }
}
