import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherQuranAssignmentsManager from "@/components/quran/TeacherQuranAssignmentsManager";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["teacher"]);
  const {teacher}=await getTeacherPortalData(p.id);

  return <DashboardShell
    role="Teacher"
    name={teacher?.full_name||p.full_name}
    title="Quran Assignments"
    titleUr="قرآن اسائنمنٹس"
    subtitle="Create, review and complete Quran assignments."
    subtitleUr="طلبہ کے قرآن اسائنمنٹس بنائیں، جائزہ لیں اور مکمل کریں۔"
    cards={[
      ["Create","Assign","Set Surah and Ayah range","بنائیں","سبق مقرر کریں"],
      ["Submit","Review","Student sends work","جمع","طالب علم بھیجے"],
      ["Score","Complete","Teacher finalizes result","اسکور","استاد مکمل کرے"],
      ["Track","History","See assignment lifecycle","ہسٹری","مکمل ریکارڈ"],
    ]}
    links={[
      ["Dashboard","/portal/teacher","ڈیش بورڈ"],
      ["Quran Assignments","/portal/teacher/quran-assignments","قرآن اسائنمنٹس"],
      ["Quran Review","/portal/teacher/quran-review","قرآن تصحیح"],
      ["Quran Analytics","/portal/teacher/quran-analytics","قرآن تجزیہ"],
    ]}
  >
    <TeacherQuranAssignmentsManager/>
  </DashboardShell>;
}
