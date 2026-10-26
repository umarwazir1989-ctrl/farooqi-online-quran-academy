import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import StudentRevisionAndStreak from "@/components/qaida/StudentRevisionAndStreak";

export const dynamic = "force-dynamic";

export default async function Page() {
  const p = await requireRole(["student"]);
  const { student } = await getStudentPortalData(p.id);

  return <DashboardShell
    role="Student"
    name={student?.full_name || p.full_name}
    title="Qaida Revision & Streak"
    titleUr="قاعدہ اعادہ اور تسلسل"
    subtitle="Spaced revision based on teacher-reviewed practice."
    subtitleUr="استاد کی تصحیح کے مطابق مناسب وقفوں سے اعادہ اور روزانہ تسلسل۔"
    cards={[
      ["Spaced","Revision","Weak items return sooner","اعادہ","کمزور چیز جلد واپس"],
      ["🔥","Streak","Daily consistency","تسلسل","روزانہ مشق"],
      ["⭐","Rewards","Practice motivation","پوائنٹس","حوصلہ افزائی"],
      ["Teacher","Grounded","Based on reviewed work","استاد","تصحیح پر مبنی"],
    ]}
    links={[
      ["Dashboard","/portal/student","ڈیش بورڈ"],
      ["Noorani Qaida","/portal/student/qaida","نورانی قاعدہ"],
      ["Adaptive Practice","/portal/student/qaida-practice","ذاتی مشق"],
      ["Revision","/portal/student/qaida-revision","اعادہ"],
    ]}
  >
    <StudentRevisionAndStreak />
  </DashboardShell>;
}
