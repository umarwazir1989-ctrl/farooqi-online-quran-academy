import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherQuranReview from "@/components/quran/TeacherQuranReview";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["teacher"]);
  const {teacher}=await getTeacherPortalData(p.id);

  return <DashboardShell
    role="Teacher"
    name={teacher?.full_name||p.full_name}
    title="Quran Recitation Review"
    titleUr="قرآن تلاوت کی تصحیح"
    subtitle="Listen to assigned students and give human Quran reading feedback."
    subtitleUr="اپنے طلبہ کی تلاوت سنیں اور مخرج، تجوید اور روانی کی تصحیح کریں۔"
    cards={[
      ["✓","Correct","Approved reading","درست","صحیح ادائیگی"],
      ["↻","Repeat","Practice again","دوبارہ","مزید مشق"],
      ["⚠","Makhraj","Articulation issue","مخرج","ادائیگی کی اصلاح"],
      ["◉","Tajweed","Rule correction","تجوید","قاعدے کی اصلاح"],
    ]}
    links={[
      ["Dashboard","/portal/teacher","ڈیش بورڈ"],
      ["Qaida Review","/portal/teacher/qaida-review","قاعدہ تصحیح"],
      ["Quran Review","/portal/teacher/quran-review","قرآن تصحیح"],
      ["Weekly Report","/portal/teacher/qaida-weekly-report","ہفتہ وار رپورٹ"],
    ]}
  >
    <TeacherQuranReview/>
  </DashboardShell>;
}
