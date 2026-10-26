import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quranReviewScore, quranRevisionDays, quranRevisionPriority } from "@/lib/quranProgress";

export async function GET(){
  const profile=await getCurrentProfile();

  if(!profile||profile.role!=="student"||profile.status!=="active"){
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try{
    const sb=getSupabaseAdmin();

    const {data:student,error:studentError}=await sb.from("students")
      .select("id").eq("user_id",profile.id).maybeSingle();

    if(studentError)throw studentError;
    if(!student)return NextResponse.json({ok:true,summary:null,recent:[],weak:[]});

    const {data:attempts,error}=await sb.from("quran_attempts")
      .select("id,surah_number,ayah_number,word_position,status,teacher_feedback,reviewed_at,created_at")
      .eq("student_id",student.id)
      .order("created_at",{ascending:false})
      .limit(300);

    if(error)throw error;

    const reviewed=(attempts||[]).filter((a:any)=>a.status!=="pending");
    const correct=reviewed.filter((a:any)=>a.status==="correct").length;
    const repeat=reviewed.filter((a:any)=>a.status==="repeat").length;
    const makhraj=reviewed.filter((a:any)=>a.status==="makhraj_issue").length;
    const tajweed=reviewed.filter((a:any)=>a.status==="tajweed_issue").length;

    const score=reviewed.length
      ? Math.round(reviewed.reduce((s:number,a:any)=>s+quranReviewScore(a.status),0)/reviewed.length)
      : 0;

    for(const a of reviewed.filter((x:any)=>["repeat","makhraj_issue","tajweed_issue"].includes(x.status))){
      const {data:existing}=await sb.from("quran_revision_queue")
        .select("id").eq("student_id",student.id).eq("source_attempt_id",a.id)
        .in("status",["pending","started"]).limit(1).maybeSingle();

      if(!existing){
        const days=quranRevisionDays(a.status);
        await sb.from("quran_revision_queue").insert({
          student_id:student.id,
          surah_number:a.surah_number,
          ayah_number:a.ayah_number,
          word_position:a.word_position,
          reason:"teacher_review",
          priority:quranRevisionPriority(a.status),
          due_at:new Date(Date.now()+days*86400000).toISOString(),
          source_attempt_id:a.id,
          status:"pending",
        });
      }
    }

    const weak=reviewed
      .filter((a:any)=>["repeat","makhraj_issue","tajweed_issue"].includes(a.status))
      .slice(0,20);

    return NextResponse.json({
      ok:true,
      summary:{reviewed:reviewed.length,correct,repeat,makhraj,tajweed,score},
      recent:(attempts||[]).slice(0,25),
      weak,
    });
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
