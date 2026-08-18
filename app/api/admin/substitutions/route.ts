import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { createSubstitution } from "@/lib/phase7Server";

export async function POST(request:Request){
  const p=await getCurrentProfile();
  if(!p||p.role!=="admin"||p.status!=="active")return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  try{
    const b=await request.json();
    const result=await createSubstitution({
      adminUserId:p.id,
      originalTeacherId:String(b.originalTeacherId||""),
      substituteTeacherId:String(b.substituteTeacherId||""),
      studentId:b.studentId?String(b.studentId):"",
      enrollmentId:b.enrollmentId?String(b.enrollmentId):"",
      startDate:String(b.startDate||""),
      endDate:String(b.endDate||""),
      reason:b.reason?String(b.reason):"",
    });
    return NextResponse.json({ok:true,result});
  }catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:"Failed."},{status:500});}
}
