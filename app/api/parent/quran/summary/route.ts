import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quranReviewScore } from "@/lib/quranProgress";

export async function GET(){
  const profile=await getCurrentProfile();
  if(!profile||profile.role!=="parent"||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});

  try{
    const sb=getSupabaseAdmin();
    const {data:parent}=await sb.from("parents").select("id").eq("user_id",profile.id).maybeSingle();
    if(!parent)return NextResponse.json({ok:true,children:[]});

    const {data:children,error}=await sb.from("students")
      .select("id,full_name,student_code").eq("parent_id",parent.id).eq("status","active");
    if(error)throw error;

    const rows=await Promise.all((children||[]).map(async(c:any)=>{
      const {data:attempts}=await sb.from("quran_attempts")
        .select("status,created_at").eq("student_id",c.id).order("created_at",{ascending:false}).limit(150);

      const {data:assignments}=await sb.from("quran_assignments")
        .select("id,status,due_date").eq("student_id",c.id).in("status",["assigned","in_progress","submitted"]);

      const reviewed=(attempts||[]).filter((a:any)=>a.status!=="pending");
      const score=reviewed.length
        ? Math.round(reviewed.reduce((s:number,a:any)=>s+quranReviewScore(a.status),0)/reviewed.length)
        : 0;

      return {
        id:c.id,
        fullName:c.full_name,
        studentCode:c.student_code,
        score,
        reviewed:reviewed.length,
        correct:reviewed.filter((a:any)=>a.status==="correct").length,
        makhraj:reviewed.filter((a:any)=>a.status==="makhraj_issue").length,
        tajweed:reviewed.filter((a:any)=>a.status==="tajweed_issue").length,
        activeAssignments:(assignments||[]).length,
        lastPracticeAt:attempts?.[0]?.created_at||null,
      };
    }));

    return NextResponse.json({ok:true,children:rows});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
