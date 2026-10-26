import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherQaidaLessonControl from "@/components/qaida/TeacherQaidaLessonControl";

export const dynamic = "force-dynamic";

export default async function Page() {
  const p = await requireRole(["teacher"]);
  const { teacher } = await getTeacherPortalData(p.id);

  return <DashboardShell
    role="Teacher"
    name={teacher?.full_name || p.full_name}
    title="Qaida Lesson Control"
    titleUr="قاعدہ سبق کنٹرول"
    subtitle="Unlock, lock and approve lessons for assigned students."
    subtitleUr="اپنے طلبہ کے اسباق کھولیں، بند کریں اور منظوری دیں۔"
    cards={[
      ["17","Lessons","Controlled progression","17","مرحلہ وار اسباق"],
      ["Lock","Control","Teacher decides access","کنٹرول","استاد کی اجازت"],
      ["Approve","Mastery","Teacher confirms completion","منظوری","استاد کی تصدیق"],
      ["Safe","Progression","No auto-promotion without teacher","محفوظ","خودکار ترقی نہیں"],
    ]}
    links={[
      ["Dashboard","/portal/teacher","ڈیش بورڈ"],
      ["Qaida Review","/portal/teacher/qaida-review","قاعدہ تصحیح"],
      ["Qaida Control","/portal/teacher/qaida-control","سبق کنٹرول"],
      ["Weekly Report","/portal/teacher/qaida-weekly-report","ہفتہ وار رپورٹ"],
    ]}
  >
    <TeacherQaidaLessonControl />
  </DashboardShell>;
}
