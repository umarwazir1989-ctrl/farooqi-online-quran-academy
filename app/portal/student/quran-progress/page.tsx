import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import QuranProgressDashboard from "@/components/quran/QuranProgressDashboard";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["student"]);
  const {student}=await getStudentPortalData(p.id);

  return <DashboardShell
    role="Student"
    name={student?.full_name||p.full_name}
    title="Quran Learning Progress"
    titleUr="قرآن تعلیمی پیش رفت"
    subtitle="Teacher-reviewed Quran accuracy, weak areas and revision."
    subtitleUr="استاد کی تصحیح کے مطابق تلاوت، کمزور حصے اور اعادہ۔"
    cards={[
      ["Score","Review","Teacher-reviewed score","اسکور","استاد کی تصحیح"],
      ["Makhraj","Track","Articulation history","مخرج","غلطیوں کی ہسٹری"],
      ["Tajweed","Track","Rule corrections","تجوید","قاعدوں کی اصلاح"],
      ["Revision","Queue","Focused repeat practice","اعادہ","منتخب مشق"],
    ]}
    links={[
      ["Dashboard","/portal/student","ڈیش بورڈ"],
      ["Quran Reading","/portal/student/quran-reading","قرآن ریڈنگ"],
      ["Assignments","/portal/student/quran-assignments","اسائنمنٹس"],
      ["Quran Progress","/portal/student/quran-progress","قرآن پیش رفت"],
    ]}
  >
    <QuranProgressDashboard/>
  </DashboardShell>;
}
