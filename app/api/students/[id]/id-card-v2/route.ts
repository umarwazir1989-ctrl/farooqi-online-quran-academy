import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getStudentPrintProfile } from "@/lib/phase8Server";
import { buildQrStudentIdCard } from "@/lib/studentQrPdf";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const { student } = await getStudentPrintProfile(id);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://farooqi-online-quran-academy.vercel.app";

    const bytes = await buildQrStudentIdCard(student, siteUrl);

    return new NextResponse(bytes as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${student.student_code || "student"}-qr-id-card.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not generate ID card.",
      },
      { status: 500 }
    );
  }
}
