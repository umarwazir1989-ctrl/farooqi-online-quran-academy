import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { queueEmail } from "@/lib/phase8Server";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const body = await request.json();

    const result = await queueEmail({
      adminUserId: profile.id,
      recipientEmail: String(body.recipientEmail || ""),
      recipientName: body.recipientName ? String(body.recipientName) : "",
      subject: String(body.subject || ""),
      bodyText: String(body.bodyText || ""),
      templateKey: body.templateKey ? String(body.templateKey) : "",
      relatedEntityType: body.relatedEntityType ? String(body.relatedEntityType) : "",
      relatedEntityId: body.relatedEntityId ? String(body.relatedEntityId) : "",
    });

    return NextResponse.json({ ok:true, result });
  } catch (error) {
    return NextResponse.json(
      { ok:false, error:error instanceof Error ? error.message : "Queue failed." },
      { status:500 }
    );
  }
}
