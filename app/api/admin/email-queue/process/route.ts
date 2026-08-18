import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { processPendingEmails } from "@/lib/phase9Server";

export async function POST() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processPendingEmails(20);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Email processing failed.",
      },
      { status: 500 }
    );
  }
}
