import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const required = ["name", "phone", "course", "country"];
    if (required.some((key) => !String(data[key] || "").trim())) {
      return NextResponse.json({ ok: false, message: "Required fields are missing." }, { status: 400 });
    }
    // The starter records the request in Vercel logs. Connect Resend, Supabase,
    // Google Sheets or another provider here when permanent storage is required.
    console.log("New trial request", { ...data, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, message: "Request received." });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
}
