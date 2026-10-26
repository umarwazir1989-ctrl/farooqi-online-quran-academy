import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(){
  const profile=await getCurrentProfile();
  if(!profile||profile.role!=="teacher"||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  try{
    const sb=getSupabaseAdmin();
    const {data:teacher,error:teacherError}=await sb.from("teachers").select("id").eq("user_id",profile.id).eq("status","active").maybeSingle();
    if(teacherError) throw teacherError;
    if(!teacher) return NextResponse.json({ok:true,students:[]});

    const {data:enrollments,error:enrollmentError}=await sb.from("enrollments")
      .select("student_id,students:student_id(full_name,student_code)")
      .eq("teacher_id",teacher.id).eq("status","active");
    if(enrollmentError) throw enrollmentError;

    const since=new Date(Date.now()-7*24*60*60*1000).toISOString();
    const rows=await Promise.all((enrollments||[]).map(async(e:any)=>{
      const {data:attempts}=await sb.from("qaida_attempts").select("status,item_text,lesson_slug,created_at")
        .eq("student_id",e.student_id).gte("created_at",since);
      const total=attempts?.length||0;
      const correct=(attempts||[]).filter((a:any)=>a.status==="correct").length;
      const repeat=(attempts||[]).filter((a:any)=>a.status==="repeat").length;
      const makhraj=(attempts||[]).filter((a:any)=>a.status==="makhraj_issue").length;
      const weak=(attempts||[]).find((a:any)=>a.status==="makhraj_issue"||a.status==="repeat");
      return {studentId:e.student_id,fullName:e.students?.full_name||"Student",studentCode:e.students?.student_code||"",total,correct,repeat,makhraj,weakItem:weak?.item_text||null,weakLesson:weak?.lesson_slug||null};
    }));

    return NextResponse.json({ok:true,students:rows,since});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
