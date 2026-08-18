import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { createCalendarEvent } from "@/lib/phase7Server";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try {
    const b = await request.json();
    const result = await createCalendarEvent({
      adminUserId: profile.id,
      titleEn: String(b.titleEn || ""),
      titleUr: b.titleUr ? String(b.titleUr) : "",
      eventType: String(b.eventType || "holiday"),
      startDate: String(b.startDate || ""),
      endDate: String(b.endDate || ""),
      descriptionEn: b.descriptionEn ? String(b.descriptionEn) : "",
      descriptionUr: b.descriptionUr ? String(b.descriptionUr) : "",
      appliesTo: String(b.appliesTo || "all"),
    });
    return NextResponse.json({ok:true,result});
  } catch (e) {
    return NextResponse.json({ok:false,error:e instanceof Error?e.message:"Create failed."},{status:500});
  }
}
