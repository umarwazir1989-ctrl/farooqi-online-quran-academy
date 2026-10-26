import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherQuranAnalytics from "@/components/quran/TeacherQuranAnalytics";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["teacher"]);
  const {teacher}=await getTeacherPortalData(p.id);

  return <DashboardShell
    role="Teacher"
    name={teacher?.full_name||p.full_name}
    title="Quran Teaching Analytics"
    titleUr="قرآن تدریسی تجزیہ"
    subtitle="Teacher-reviewed student mastery, weak areas and assignments."
    subtitleUr="طلبہ کی استاد سے تصحیح شدہ پیش رفت، کمزوریاں اور اسائنمنٹس۔"
    cards={[
      ["Score","Mastery","Review-based score","اسکور","تصحیح پر مبنی"],
      ["Makhraj","Track","Articulation issues","مخرج","غلطیاں"],
      ["Tajweed","Track","Rule issues","تجوید","قواعد"],
      ["Tasks","Monitor","Pending assignments","کام","زیرِ التوا"],
    ]}
    links={[
      ["Dashboard","/portal/teacher","ڈیش بورڈ"],
      ["Quran Assignments","/portal/teacher/quran-assignments","قرآن اسائنمنٹس"],
      ["Quran Review","/portal/teacher/quran-review","قرآن تصحیح"],
      ["Quran Analytics","/portal/teacher/quran-analytics","قرآن تجزیہ"],
    ]}
  >
    <TeacherQuranAnalytics/>
  </DashboardShell>;
}
