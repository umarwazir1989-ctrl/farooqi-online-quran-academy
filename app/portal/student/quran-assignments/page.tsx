import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import QuranAssignmentsList from "@/components/quran/QuranAssignmentsList";

export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["student"]);
  const {student}=await getStudentPortalData(p.id);

  return <DashboardShell
    role="Student"
    name={student?.full_name||p.full_name}
    title="My Quran Assignments"
    titleUr="میرے قرآن اسائنمنٹس"
    subtitle="Practice the exact Quran ranges assigned by your teacher."
    subtitleUr="استاد کی مقرر کردہ سورت اور آیات کی مشق کریں۔"
    cards={[
      ["Teacher","Assigned","Personal Quran tasks","استاد","مقررہ سبق"],
      ["Ayah","Range","Clear start and end","آیات","واضح حد"],
      ["Due","Date","Target completion","تاریخ","ہدف"],
      ["Record","Submit","Send recitation","ریکارڈ","تلاوت بھیجیں"],
    ]}
    links={[
      ["Dashboard","/portal/student","ڈیش بورڈ"],
      ["Quran Reading","/portal/student/quran-reading","قرآن ریڈنگ"],
      ["Assignments","/portal/student/quran-assignments","اسائنمنٹس"],
      ["Quran Progress","/portal/student/quran-progress","قرآن پیش رفت"],
    ]}
  >
    <QuranAssignmentsList/>
  </DashboardShell>;
}
