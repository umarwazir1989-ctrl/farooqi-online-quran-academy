import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { updateTeacherProfile } from "@/lib/phase10Server";

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

    await updateTeacherProfile({
      adminUserId: profile.id,
      teacherId: id,
      fullName: String(body.fullName || ""),
      email: body.email ? String(body.email) : "",
      phone: body.phone ? String(body.phone) : "",
      country: body.country ? String(body.country) : "",
      timezone: body.timezone ? String(body.timezone) : "",
      maxStudents: body.maxStudents ? Number(body.maxStudents) : null,
      status: String(body.status || "active"),
    });

    return NextResponse.json({ ok:true });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Update failed." },
      { status:500 }
    );
  }
}
