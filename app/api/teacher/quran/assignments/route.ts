import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceQuranRateLimit } from "@/lib/quranRateLimit";

export async function GET(){
  const profile=await getCurrentProfile();
  if(!profile||profile.role!=="teacher"||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});

  try{
    const sb=getSupabaseAdmin();
    const {data:teacher}=await sb.from("teachers").select("id").eq("user_id",profile.id).eq("status","active").maybeSingle();
    if(!teacher)return NextResponse.json({ok:true,assignments:[]});

    const {data,error}=await sb.from("quran_assignments")
      .select(`
        id,student_id,surah_number,ayah_from,ayah_to,instructions,due_date,status,
        submitted_at,reviewed_at,review_note,completion_score,created_at,
        students:student_id(full_name,student_code)
      `)
      .eq("teacher_id",teacher.id)
      .order("created_at",{ascending:false})
      .limit(200);

    if(error)throw error;
    return NextResponse.json({ok:true,assignments:data||[]});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}

export async function POST(request:Request){
  const profile=await getCurrentProfile();

  if(!profile||profile.role!=="teacher"||profile.status!=="active"){
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try{
    const limited=await enforceQuranRateLimit(profile.id,"quran-assignment-create",20,60);
    if(!limited.allowed){
      return NextResponse.json(
        {ok:false,error:"Too many assignment requests. Please wait."},
        {status:429,headers:{"Retry-After":String(limited.retryAfterSeconds)}}
      );
    }

    const body=await request.json();
    const studentId=String(body.studentId||"");
    const surahNumber=Number(body.surahNumber);
    const ayahFrom=Number(body.ayahFrom);
    const ayahTo=Number(body.ayahTo);
    const instructions=String(body.instructions||"").trim().slice(0,2500)||null;
    const dueDate=body.dueDate?String(body.dueDate):null;

    if(!studentId||!Number.isInteger(surahNumber)||surahNumber<1||surahNumber>114||
       !Number.isInteger(ayahFrom)||ayahFrom<1||!Number.isInteger(ayahTo)||ayahTo<ayahFrom){
      return NextResponse.json({ok:false,error:"Invalid assignment."},{status:400});
    }

    const sb=getSupabaseAdmin();

    const {data:teacher,error:teacherError}=await sb.from("teachers").select("id")
      .eq("user_id",profile.id).eq("status","active").maybeSingle();

    if(teacherError)throw teacherError;
    if(!teacher)return NextResponse.json({ok:false,error:"Teacher not linked."},{status:403});

    const {data:assigned,error:assignedError}=await sb.from("enrollments").select("id")
      .eq("teacher_id",teacher.id).eq("student_id",studentId).eq("status","active").limit(1).maybeSingle();

    if(assignedError)throw assignedError;
    if(!assigned)return NextResponse.json({ok:false,error:"Student is not assigned to you."},{status:403});

    const {data,error}=await sb.from("quran_assignments").insert({
      student_id:studentId,
      teacher_id:teacher.id,
      surah_number:surahNumber,
      ayah_from:ayahFrom,
      ayah_to:ayahTo,
      instructions,
      due_date:dueDate,
      status:"assigned",
    }).select("id,status,created_at").single();

    if(error)throw error;

    await sb.from("quran_system_events").insert({
      event_type:"assignment_created",
      student_id:studentId,
      teacher_id:teacher.id,
      assignment_id:data.id,
      metadata:{surah_number:surahNumber,ayah_from:ayahFrom,ayah_to:ayahTo,due_date:dueDate},
    });

    return NextResponse.json({ok:true,assignment:data});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Assignment failed."},{status:500});
  }
}
