import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request:Request){
  const profile=await getCurrentProfile();
  if(!profile||!["teacher","admin"].includes(profile.role)||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});

  try{
    const body=await request.json();
    const studentId=String(body.studentId||"");
    const lessonSlug=String(body.lessonSlug||"").trim();
    const itemText=String(body.itemText||"").trim()||null;
    const instructions=String(body.instructions||"").trim().slice(0,2000)||null;
    const dueDate=body.dueDate?String(body.dueDate):null;
    if(!studentId||!lessonSlug) return NextResponse.json({ok:false,error:"Student and lesson are required."},{status:400});

    const sb=getSupabaseAdmin();
    let teacherId:string|null=null;

    if(profile.role==="teacher"){
      const {data:teacher,error:teacherError}=await sb.from("teachers").select("id").eq("user_id",profile.id).eq("status","active").maybeSingle();
      if(teacherError) throw teacherError;
      if(!teacher) return NextResponse.json({ok:false,error:"Teacher not linked."},{status:403});
      teacherId=teacher.id;

      const {data:assigned,error:assignedError}=await sb.from("enrollments").select("id")
        .eq("teacher_id",teacher.id).eq("student_id",studentId).eq("status","active").limit(1).maybeSingle();
      if(assignedError) throw assignedError;
      if(!assigned) return NextResponse.json({ok:false,error:"This student is not assigned to you."},{status:403});
    }

    const {data,error}=await sb.from("qaida_homework").insert({
      student_id:studentId,teacher_id:teacherId,lesson_slug:lessonSlug,item_text:itemText,
      instructions,due_date:dueDate,status:"assigned"
    }).select("id,status,created_at").single();
    if(error) throw error;
    return NextResponse.json({ok:true,homework:data});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Homework failed."},{status:500});
  }
}
