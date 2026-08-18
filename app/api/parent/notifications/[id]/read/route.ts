import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request:Request,context:{params:Promise<{id:string}>}){
  const p=await getCurrentProfile();
  if(!p||p.role!=="parent"||p.status!=="active")return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});

  const {id}=await context.params;
  const sb=getSupabaseAdmin();
  const {data:parent,error:pErr}=await sb.from("parents").select("id").eq("user_id",p.id).maybeSingle();
  if(pErr)return NextResponse.json({ok:false,error:pErr.message},{status:500});
  if(!parent)return NextResponse.json({ok:false,error:"Parent profile missing."},{status:404});

  const {error}=await sb.from("parent_notifications").update({
    is_read:true,read_at:new Date().toISOString()
  }).eq("id",id).eq("parent_id",parent.id);

  if(error)return NextResponse.json({ok:false,error:error.message},{status:500});
  return NextResponse.json({ok:true});
}
