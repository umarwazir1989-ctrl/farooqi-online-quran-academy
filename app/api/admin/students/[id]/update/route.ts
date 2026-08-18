import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { updateStudentProfile } from "@/lib/phase10Server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    await updateStudentProfile({
      adminUserId: profile.id,
      studentId: id,
      fullName: String(body.fullName || ""),
      email: body.email ? String(body.email) : "",
      country: body.country ? String(body.country) : "",
      timezone: body.timezone ? String(body.timezone) : "",
      status: String(body.status || "active"),
      parentName: body.parentName ? String(body.parentName) : "",
      parentEmail: body.parentEmail ? String(body.parentEmail) : "",
      parentPhone: body.parentPhone ? String(body.parentPhone) : "",
    });

    return NextResponse.json({ ok:true });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Update failed." },
      { status:500 }
    );
  }
}
