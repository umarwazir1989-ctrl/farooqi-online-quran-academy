import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import ParentWeeklyQuranDigest from "@/components/quran/ParentWeeklyQuranDigest";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["parent"]);

  return <DashboardShell
    role="Parent"
    name={p.full_name}
    title="Weekly Quran Digest"
    titleUr="ہفتہ وار قرآن خلاصہ"
    subtitle="A weekly summary of teacher-reviewed Quran progress."
    subtitleUr="استاد کی تصحیح کے مطابق بچے کی ہفتہ وار قرآن پیش رفت۔"
    cards={[
      ["Weekly","Summary","One clear weekly view","ہفتہ","ایک نظر میں"],
      ["Score","Review","Teacher-based average","اسکور","استاد کی بنیاد"],
      ["Issues","Track","Makhraj and Tajweed","اصلاح","مخرج و تجوید"],
      ["Tasks","Progress","Assignments completed","اسباق","مکمل کام"],
    ]}
    links={[
      ["Dashboard","/portal/parent","ڈیش بورڈ"],
      ["Quran Progress","/portal/parent/quran-progress","قرآن پیش رفت"],
      ["Weekly Quran","/portal/parent/quran-weekly","ہفتہ وار قرآن"],
      ["Notifications","/portal/parent/notifications","اطلاعات"],
    ]}
  >
    <ParentWeeklyQuranDigest/>
  </DashboardShell>;
}
