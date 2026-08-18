import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { archiveEntity } from "@/lib/phase7Server";

export async function POST(request:Request){
  const p=await getCurrentProfile();
  if(!p||p.role!=="admin"||p.status!=="active")return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  try{
    const b=await request.json();
    const result=await archiveEntity({
      adminUserId:p.id,entityType:String(b.entityType||""),entityId:String(b.entityId||""),
      reason:b.reason?String(b.reason):"",restore:Boolean(b.restore)
    });
    return NextResponse.json({ok:true,result});
  }catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:"Archive action failed."},{status:500});}
}
