import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { updateCalendarEvent } from "@/lib/phase7Server";

export async function POST(request: Request, context:{params:Promise<{id:string}>}) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try {
    const {id}=await context.params;
    const body=await request.json();
    const result=await updateCalendarEvent(id,body,profile.id);
    return NextResponse.json({ok:true,result});
  } catch(e) {
    return NextResponse.json({ok:false,error:e instanceof Error?e.message:"Update failed."},{status:500});
  }
}
