import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherWeeklyQaidaReport from "@/components/qaida/TeacherWeeklyQaidaReport";
export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["teacher"]);
  const {teacher}=await getTeacherPortalData(p.id);
  return <DashboardShell role="Teacher" name={teacher?.full_name||p.full_name}
    title="Weekly Qaida Report" titleUr="ہفتہ وار قاعدہ رپورٹ"
    subtitle="See the last seven days of student practice and weak areas."
    subtitleUr="گزشتہ سات دن کی مشق، درستیاں اور کمزور حصے ایک جگہ دیکھیں۔"
    cards={[["7 Days","Window","Recent student practice","7 دن","حالیہ مشق"],["✓","Correct","Reviewed correct attempts","درست","صحیح مشق"],["↻","Repeat","Needs more practice","دوبارہ","مزید مشق"],["⚠","Makhraj","Articulation focus","مخرج","ادائیگی کی توجہ"]]}
    links={[["Dashboard","/portal/teacher","ڈیش بورڈ"],["Qaida Review","/portal/teacher/qaida-review","قاعدہ تصحیح"],["Qaida Intelligence","/portal/teacher/qaida-intelligence","قاعدہ تجزیہ"],["Weekly Report","/portal/teacher/qaida-weekly-report","ہفتہ وار رپورٹ"]]}>
    <TeacherWeeklyQaidaReport/>
  </DashboardShell>;
}
