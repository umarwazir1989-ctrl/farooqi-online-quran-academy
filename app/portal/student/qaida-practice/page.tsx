import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import AdaptivePracticePanel from "@/components/qaida/AdaptivePracticePanel";
export const dynamic="force-dynamic";

export default async function Page(){
  const p=await requireRole(["student"]);
  const {student}=await getStudentPortalData(p.id);
  return <DashboardShell role="Student" name={student?.full_name||p.full_name}
    title="Adaptive Qaida Practice" titleUr="ذاتی نوعیت کی قاعدہ مشق"
    subtitle="Practice weak items first, based on teacher-reviewed history."
    subtitleUr="استاد کی تصحیح کے مطابق پہلے اپنی کمزور جگہوں کی مشق کریں۔"
    cards={[["Smart","Priority","Weak items appear first","ذہین","کمزور مشق پہلے"],["Teacher","Grounded","Built from teacher reviews","استاد","تصحیح پر مبنی"],["Daily","Revision","Focused daily queue","روزانہ","منتخب اعادہ"],["Safe","Assistive","Teacher remains final","محفوظ","استاد حتمی فیصلہ"]]}
    links={[["Dashboard","/portal/student","ڈیش بورڈ"],["Noorani Qaida","/portal/student/qaida","نورانی قاعدہ"],["Adaptive Practice","/portal/student/qaida-practice","ذاتی مشق"],["Qaida Progress","/portal/student/qaida-progress","قاعدہ پیش رفت"]]}>
    <AdaptivePracticePanel/>
  </DashboardShell>;
}
