import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { detectBatchDuplicates } from "@/lib/phase10Server";

export async function POST(
  request: Request,
  context: { params: Promise<{ batchId: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try {
    const {batchId}=await context.params;
    const rows=await detectBatchDuplicates(batchId);
    return NextResponse.json({ok:true,count:rows.length});
  } catch(error) {
    return NextResponse.json(
      {ok:false,error:error instanceof Error?error.message:"Duplicate scan failed."},
      {status:500}
    );
  }
}
