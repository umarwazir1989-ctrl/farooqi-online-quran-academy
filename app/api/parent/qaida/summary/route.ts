import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(){
  const profile=await getCurrentProfile();
  if(!profile||profile.role!=="parent"||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  try{
    const sb=getSupabaseAdmin();
    const {data:parent,error:parentError}=await sb.from("parents").select("id").eq("user_id",profile.id).maybeSingle();
    if(parentError) throw parentError;
    if(!parent) return NextResponse.json({ok:true,children:[]});

    const {data:children,error:childrenError}=await sb.from("students").select("id,full_name,student_code")
      .eq("parent_id",parent.id).eq("status","active");
    if(childrenError) throw childrenError;

    const summaries=await Promise.all((children||[]).map(async(child:any)=>{
      const {data:attempts}=await sb.from("qaida_attempts").select("status,created_at")
        .eq("student_id",child.id).order("created_at",{ascending:false}).limit(100);
      const {data:homework}=await sb.from("qaida_homework").select("id,status,due_date")
        .eq("student_id",child.id).in("status",["assigned","in_progress","submitted"]);

      const reviewed=(attempts||[]).filter((a:any)=>["correct","repeat","makhraj_issue"].includes(a.status));
      const correct=reviewed.filter((a:any)=>a.status==="correct").length;
      const repeat=reviewed.filter((a:any)=>a.status==="repeat").length;
      const makhraj=reviewed.filter((a:any)=>a.status==="makhraj_issue").length;
      const score=reviewed.length?Math.round((correct*100+repeat*35+makhraj*15)/reviewed.length):0;

      return {id:child.id,fullName:child.full_name,studentCode:child.student_code,reviewedAttempts:reviewed.length,correct,repeat,makhraj,score,activeHomework:(homework||[]).length,lastPracticeAt:attempts?.[0]?.created_at||null};
    }));

    return NextResponse.json({ok:true,children:summaries});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
