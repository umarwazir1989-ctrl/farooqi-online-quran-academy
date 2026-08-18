import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { transferStudent } from "@/lib/phase7Server";

export async function POST(request:Request){
  const p=await getCurrentProfile();
  if(!p||p.role!=="admin"||p.status!=="active")return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  try{
    const b=await request.json();
    const result=await transferStudent({
      adminUserId:p.id,enrollmentId:String(b.enrollmentId||""),toTeacherId:String(b.toTeacherId||""),
      effectiveDate:String(b.effectiveDate||""),reason:b.reason?String(b.reason):""
    });
    return NextResponse.json({ok:true,result});
  }catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:"Transfer failed."},{status:500});}
}
