import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import ParentQuranSummary from "@/components/quran/ParentQuranSummary";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["parent"]);

  return <DashboardShell
    role="Parent"
    name={p.full_name}
    title="Child Quran Progress"
    titleUr="بچے کی قرآن پیش رفت"
    subtitle="Teacher-reviewed Quran progress and active assignments."
    subtitleUr="استاد کی تصحیح کے مطابق قرآن کی پیش رفت اور جاری اسائنمنٹس۔"
    cards={[
      ["Score","Overview","Simple learning score","اسکور","آسان خلاصہ"],
      ["Makhraj","History","Articulation corrections","مخرج","ادائیگی کی اصلاح"],
      ["Tajweed","History","Rule corrections","تجوید","قواعد کی اصلاح"],
      ["Tasks","Active","Current Quran assignments","اسباق","موجودہ اسائنمنٹ"],
    ]}
    links={[
      ["Dashboard","/portal/parent","ڈیش بورڈ"],
      ["Qaida Progress","/portal/parent/qaida-progress","قاعدہ پیش رفت"],
      ["Quran Progress","/portal/parent/quran-progress","قرآن پیش رفت"],
      ["Notifications","/portal/parent/notifications","اطلاعات"],
    ]}
  >
    <ParentQuranSummary/>
  </DashboardShell>;
}
