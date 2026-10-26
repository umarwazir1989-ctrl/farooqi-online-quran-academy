import { notFound } from "next/navigation";
import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import QaidaLessonPlayer from "@/components/qaida/QaidaLessonPlayer";
import { getQaidaLesson, QAIDA_LESSONS } from "@/lib/qaidaCurriculum";

export const dynamic = "force-dynamic";

export default async function QaidaLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const profile = await requireRole(["student"]);
  const { student } = await getStudentPortalData(profile.id);
  const { slug } = await params;
  const lesson = getQaidaLesson(slug);

  if (!lesson) notFound();

  return (
    <DashboardShell
      role="Student"
      name={student?.full_name || profile.full_name}
      title={`Qaida Lesson ${lesson.number}`}
      titleUr={`قاعدہ سبق ${lesson.number}: ${lesson.titleUr}`}
      subtitle={lesson.titleEn}
      subtitleUr={lesson.descriptionUr}
      cards={[
        [String(lesson.number), "Lesson", lesson.titleEn, "سبق", lesson.titleUr],
        [String(lesson.items.length), "Cards", "Practice items", "کارڈز", "مشق کے اجزاء"],
        [String(QAIDA_LESSONS.length), "Course Lessons", "Full prototype curriculum", "کل اسباق", "مکمل prototype"],
        ["Audio", "Real Reciter", "No synthetic Quran audio", "آڈیو", "حقیقی قاری"],
      ]}
      links={[
        ["Dashboard", "/portal/student", "ڈیش بورڈ"],
        ["Qaida Index", "/portal/student/qaida", "قاعدہ فہرست"],
        ["Progress", "/portal/student/progress", "پیش رفت"],
      ]}
    >
      <QaidaLessonPlayer lesson={lesson} />
    </DashboardShell>
  );
}
