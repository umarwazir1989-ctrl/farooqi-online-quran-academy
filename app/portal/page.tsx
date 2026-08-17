import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabaseAuth";

export default async function PortalHome() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/portal/login");
  }

  redirect(`/portal/${profile.role}`);
}
