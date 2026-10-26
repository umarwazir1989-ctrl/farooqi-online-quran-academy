import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import ParentQaidaSummary from "@/components/qaida/ParentQaidaSummary";
export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["parent"]);
  return <DashboardShell role="Parent" name={p.full_name}
    title="Child Qaida Progress" titleUr="بچے کی قاعدہ پیش رفت"
    subtitle="A simple parent summary based on teacher-reviewed practice."
    subtitleUr="استاد کی تصحیح کی بنیاد پر بچے کی آسان اور واضح تعلیمی رپورٹ۔"
    cards={[["Progress","Overview","Simple child summary","پیش رفت","آسان خلاصہ"],["Teacher","Reviewed","Human-reviewed attempts","استاد","تصحیح شدہ مشق"],["Homework","Visible","Active Qaida tasks","ہوم ورک","موجودہ مشق"],["Privacy","Linked Child","Only your linked children","پرائیویسی","صرف اپنے بچے"]]}
    links={[["Dashboard","/portal/parent","ڈیش بورڈ"],["Qaida Progress","/portal/parent/qaida-progress","قاعدہ پیش رفت"],["Progress","/portal/parent/progress","عمومی پیش رفت"],["Notifications","/portal/parent/notifications","اطلاعات"]]}>
    <ParentQaidaSummary/>
  </DashboardShell>;
}
