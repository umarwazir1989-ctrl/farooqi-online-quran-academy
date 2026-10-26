import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { qaidaMasteryStats } from "@/lib/qaidaIntelligence";

function skill(attempt:any){
  const slug=String(attempt.lesson_slug||"general");
  const item=String(attempt.item_text||"").trim();
  if(slug.startsWith("letters")) return {key:`letter:${item}`,label:`حرف ${item}`};
  const labels:any={harakat:"زبر، زیر، پیش",sukoon:"سکون",tanween:"تنوین",shaddah:"تشدید",madd:"مد",qalqalah:"قلقلہ",ghunnah:"غنہ","ikhfa-izhar":"اخفاء و اظہار","idgham-iqlab":"ادغام و اقلاب","laam-ra":"لام اور راء",waqf:"وقف"};
  return {key:slug,label:labels[slug]||item||slug};
}

export async function GET(){
  const profile=await getCurrentProfile();
  if(!profile||profile.role!=="student"||profile.status!=="active")
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});

  try{
    const sb=getSupabaseAdmin();
    const {data:student,error:studentError}=await sb.from("students").select("id").eq("user_id",profile.id).maybeSingle();
    if(studentError) throw studentError;
    if(!student) return NextResponse.json({ok:true,skills:[],recent:[]});

    const {data:attempts,error}=await sb.from("qaida_attempts")
      .select("id,lesson_slug,item_text,status,teacher_feedback,created_at,reviewed_at")
      .eq("student_id",student.id).order("created_at",{ascending:false}).limit(300);
    if(error) throw error;

    const grouped=new Map<string,any[]>(); const labels=new Map<string,string>();
    for(const a of attempts||[]){ const s=skill(a); labels.set(s.key,s.label); grouped.set(s.key,[...(grouped.get(s.key)||[]),a]); }
    const skills=Array.from(grouped.entries()).map(([key,rows])=>({key,label:labels.get(key)||key,...qaidaMasteryStats(rows)})).sort((a,b)=>a.score-b.score);

    return NextResponse.json({ok:true,skills,recent:(attempts||[]).slice(0,25)});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Failed."},{status:500});
  }
}
