import { NextResponse } from "next/server";
import { processPendingEmails } from "@/lib/phase9Server";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try {
    const result=await processPendingEmails(50);
    return NextResponse.json({ok:true,...result});
  } catch(error) {
    return NextResponse.json(
      {ok:false,error:error instanceof Error?error.message:"Cron failed."},
      {status:500}
    );
  }
}
