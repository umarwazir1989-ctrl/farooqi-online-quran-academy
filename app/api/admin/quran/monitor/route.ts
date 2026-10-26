import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(){
  const profile=await getCurrentProfile();

  if(!profile||profile.role!=="admin"||profile.status!=="active"){
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try{
    const sb=getSupabaseAdmin();

    const [
      attempts,
      pendingAttempts,
      assignments,
      activeAssignments,
      revisions,
      recentEvents,
    ] = await Promise.all([
      sb.from("quran_attempts").select("id",{count:"exact",head:true}),
      sb.from("quran_attempts").select("id",{count:"exact",head:true}).eq("status","pending"),
      sb.from("quran_assignments").select("id",{count:"exact",head:true}),
      sb.from("quran_assignments").select("id",{count:"exact",head:true}).in("status",["assigned","in_progress","submitted"]),
      sb.from("quran_revision_queue").select("id",{count:"exact",head:true}).in("status",["pending","started"]),
      sb.from("quran_system_events")
        .select("id,event_type,student_id,teacher_id,assignment_id,attempt_id,metadata,created_at")
        .order("created_at",{ascending:false})
        .limit(50),
    ]);

    return NextResponse.json({
      ok:true,
      summary:{
        attempts:attempts.count||0,
        pendingAttempts:pendingAttempts.count||0,
        assignments:assignments.count||0,
        activeAssignments:activeAssignments.count||0,
        activeRevisions:revisions.count||0,
      },
      events:recentEvents.data||[],
    });
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
