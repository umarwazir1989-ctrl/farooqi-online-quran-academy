import { NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/supabaseAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const session = await signInWithPassword(email, password);

    const response = NextResponse.json({ ok: true });

    response.cookies.set("fq_access_token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: session.expires_in || 3600,
    });

    response.cookies.set("fq_refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 401 }
    );
  }
}
