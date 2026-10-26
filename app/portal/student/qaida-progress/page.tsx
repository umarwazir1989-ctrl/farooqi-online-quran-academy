import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import StudentQaidaIntelligence from "@/components/qaida/StudentQaidaIntelligence";
export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["student"]);
  const {student}=await getStudentPortalData(p.id);
  return <DashboardShell role="Student" name={student?.full_name||p.full_name}
    title="Qaida Learning Intelligence" titleUr="قاعدہ تعلیمی پیش رفت"
    subtitle="Teacher-reviewed strengths, weak areas and homework."
    subtitleUr="استاد کی تصحیح کی بنیاد پر مضبوطیاں، کمزوریاں اور ہوم ورک۔"
    cards={[["AI Assist","Analysis","Teacher-reviewed data only","تجزیہ","استاد کی تصحیح پر مبنی"],["Weak → Strong","Practice","Focus on repeated mistakes","مشق","بار بار کی غلطیوں پر توجہ"],["Homework","Teacher Assigned","Personal practice tasks","ہوم ورک","استاد کی مقررہ مشق"],["Teacher","Final Review","Human correction remains final","استاد","حتمی تصحیح"]]}
    links={[["Dashboard","/portal/student","ڈیش بورڈ"],["Noorani Qaida","/portal/student/qaida","نورانی قاعدہ"],["Qaida Progress","/portal/student/qaida-progress","قاعدہ پیش رفت"],["General Progress","/portal/student/progress","عمومی پیش رفت"]]}>
    <StudentQaidaIntelligence/>
  </DashboardShell>;
}
