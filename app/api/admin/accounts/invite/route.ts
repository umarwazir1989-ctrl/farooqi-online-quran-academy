import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const roles = new Set(["student","parent","teacher"]);

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  }

  try {
    const body = await request.json();
    const role = String(body.role || "");
    const recordId = String(body.recordId || "");
    const email = String(body.email || "").trim().toLowerCase();
    const fullName = String(body.fullName || "").trim();

    if (!roles.has(role) || !recordId || !email) {
      return NextResponse.json({ok:false,error:"Role, record and email are required."},{status:400});
    }

    const table = role === "student" ? "students" : role === "parent" ? "parents" : "teachers";
    const sb = getSupabaseAdmin();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://farooqi-online-quran-academy.vercel.app";

    const { data, error } = await sb.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName, role, academy: "Farooqi Online Quran Academy" },
      redirectTo: `${siteUrl}/portal/set-password`,
    });

    if (error) return NextResponse.json({ok:false,error:error.message},{status:400});
    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ok:false,error:"Invitation user ID was not returned."},{status:500});

    const { error: linkError } = await sb.from(table).update({user_id:userId,email}).eq("id",recordId);
    if (linkError) return NextResponse.json({ok:false,error:linkError.message},{status:500});

    const { error: profileError } = await sb.from("profiles").upsert({
      id:userId, full_name:fullName, role, status:"active"
    }, { onConflict:"id" });
    if (profileError) return NextResponse.json({ok:false,error:profileError.message},{status:500});

    return NextResponse.json({ok:true,userId});
  } catch (e) {
    return NextResponse.json({ok:false,error:e instanceof Error ? e.message : "Invitation failed."},{status:500});
  }
}
