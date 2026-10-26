import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(){
  const profile=await getCurrentProfile();
  if(!profile||profile.role!=="student"||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});

  try{
    const sb=getSupabaseAdmin();
    const {data:student,error:studentError}=await sb.from("students").select("id")
      .eq("user_id",profile.id).maybeSingle();

    if(studentError)throw studentError;
    if(!student)return NextResponse.json({ok:true,assignments:[]});

    const {data,error}=await sb.from("quran_assignments")
      .select("id,surah_number,ayah_from,ayah_to,instructions,due_date,status,created_at")
      .eq("student_id",student.id)
      .in("status",["assigned","in_progress","submitted"])
      .order("due_date",{ascending:true,nullsFirst:false});

    if(error)throw error;
    return NextResponse.json({ok:true,assignments:data||[]});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
