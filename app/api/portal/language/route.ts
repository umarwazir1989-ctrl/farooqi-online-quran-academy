import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const lang = body.lang === "ur" ? "ur" : "en";

  const response = NextResponse.json({ ok: true, lang });

  response.cookies.set("fq_portal_lang", lang, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
