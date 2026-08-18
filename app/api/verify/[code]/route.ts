import { NextResponse } from "next/server";
import { getVerificationByCode } from "@/lib/phase10Server";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const {code}=await context.params;
    const data=await getVerificationByCode(code);

    if(!data) {
      return NextResponse.json({valid:false},{status:404});
    }

    return NextResponse.json({
      valid:true,
      studentCode:data.student_code,
      studentName:data.full_name,
      studentStatus:data.student_status,
      course:data.course_name,
      teacher:data.teacher_name,
    });
  } catch(error) {
    return NextResponse.json(
      {valid:false,error:error instanceof Error?error.message:"Verification failed."},
      {status:500}
    );
  }
}
