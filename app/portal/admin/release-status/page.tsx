import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import AdminReleaseStatus from "@/components/quran/AdminReleaseStatus";
import { adminQuranLinks } from "@/lib/portalLaunchLinks";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["admin"]);

  return <DashboardShell
    role="Admin"
    name={p.full_name}
    title="Final Release Status"
    titleUr="حتمی ریلیز اسٹیٹس"
    subtitle="One-page launch decision summary."
    subtitleUr="لانچ سے پہلے تمام اہم چیکس کا ایک صفحے میں خلاصہ۔"
    cards={[
      ["Ready","Decision","Core release decision","حالت","لانچ فیصلہ"],
      ["Health","System","Database and provider","صحت","سسٹم"],
      ["Audit","Latest","Latest release audit","آڈٹ","تازہ نتیجہ"],
      ["Warnings","Review","Non-blocking items","تنبیہ","جائزہ"],
    ]}
    links={[...adminQuranLinks,["Release Status","/portal/admin/release-status","ریلیز اسٹیٹس"]]}
  >
    <AdminReleaseStatus/>
  </DashboardShell>;
}
