import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherQaidaIntelligence from "@/components/qaida/TeacherQaidaIntelligence";
export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["teacher"]);
  const {teacher}=await getTeacherPortalData(p.id);
  return <DashboardShell role="Teacher" name={teacher?.full_name||p.full_name}
    title="Qaida Learning Intelligence" titleUr="قاعدہ تعلیمی تجزیہ"
    subtitle="Find repeated mistakes and assign targeted practice."
    subtitleUr="بار بار ہونے والی غلطیاں دیکھیں اور مخصوص مشق مقرر کریں۔"
    cards={[["History","Mistakes","Repeated errors become visible","ہسٹری","بار بار کی غلطیاں"],["Targeted","Homework","Assign weak-area practice","ہدفی","کمزور حصے کی مشق"],["Teacher","Decision","Human review drives analytics","استاد","تجزیہ استاد کی تصحیح سے"],["Next","Adaptive","Foundation for smart practice","اگلا","ذاتی نوعیت کی مشق"]]}
    links={[["Dashboard","/portal/teacher","ڈیش بورڈ"],["Qaida Review","/portal/teacher/qaida-review","قاعدہ تصحیح"],["Qaida Intelligence","/portal/teacher/qaida-intelligence","قاعدہ تجزیہ"],["Classes","/portal/teacher/classes","کلاسز"]]}>
    <TeacherQaidaIntelligence/>
  </DashboardShell>;
}
