import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherQaidaReview from "@/components/qaida/TeacherQaidaReview";

export const dynamic = "force-dynamic";

export default async function TeacherQaidaReviewPage() {
  const profile = await requireRole(["teacher"]);
  const { teacher } = await getTeacherPortalData(profile.id);

  return (
    <DashboardShell
      role="Teacher"
      name={teacher?.full_name || profile.full_name}
      title="Qaida Recording Review"
      titleUr="قاعدہ ریکارڈنگ کی تصحیح"
      subtitle="Listen to assigned students and mark correct, repeat or makhraj issue."
      subtitleUr="اپنے طلبہ کی آواز سنیں اور درست، دوبارہ مشق یا مخرج کی غلطی درج کریں۔"
      cards={[
        ["✓", "Correct", "Approved pronunciation", "درست", "صحیح ادائیگی"],
        ["↻", "Repeat", "Needs another attempt", "دوبارہ", "مزید مشق درکار"],
        ["⚠", "Makhraj", "Articulation needs correction", "مخرج", "ادائیگی کی اصلاح"],
        ["Teacher", "Final Authority", "Human review stays final", "استاد", "حتمی تصحیح"],
      ]}
      links={[
        ["Dashboard", "/portal/teacher", "ڈیش بورڈ"],
        ["Record Classes", "/portal/teacher/classes", "کلاس ریکارڈ"],
        ["Qaida Review", "/portal/teacher/qaida-review", "قاعدہ تصحیح"],
        ["Calendar", "/portal/teacher/calendar", "کیلنڈر"],
        ["Leave", "/portal/teacher/leave", "رخصت"],
      ]}
    >
      <TeacherQaidaReview />
    </DashboardShell>
  );
}
