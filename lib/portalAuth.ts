import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabaseAuth";

export async function requireRole(
  allowed: Array<"admin" | "teacher" | "student" | "parent">
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/portal/login");
  }

  if (profile.status !== "active") {
    redirect("/portal/login?error=inactive");
  }

  if (!allowed.includes(profile.role)) {
    redirect(`/portal/${profile.role}`);
  }

  return profile;
}
