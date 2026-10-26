import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import { QAIDA_LESSONS } from "@/lib/qaidaCurriculum";

export const dynamic = "force-dynamic";

export default async function QaidaIndexPage() {
  const profile = await requireRole(["student"]);
  const { student } = await getStudentPortalData(profile.id);

  return (
    <DashboardShell
      role="Student"
      name={student?.full_name || profile.full_name}
      title="Digital Quran Teacher"
      titleUr="ڈیجیٹل قرآن ٹیچر"
      subtitle="Structured Noorani Qaida with real reciter audio hooks."
      subtitleUr="مصدقہ قاری کی آڈیو کے ساتھ مرحلہ وار نورانی قاعدہ۔"
      cards={[
        [String(QAIDA_LESSONS.length), "Lessons", "Structured Qaida curriculum", "اسباق", "مرحلہ وار قاعدہ"],
        ["75", "Audio-ready", "Qamar/HifzPal source supports 75 bundled drills", "آڈیو", "75 drill recordings کا source"],
        ["CC BY-SA", "Licensed Source", "Attribution required", "لائسنس", "حوالہ اور ShareAlike لازم"],
        ["Teacher", "Final Review", "App supports, teacher verifies", "استاد", "حتمی تصحیح استاد کرے"],
      ]}
      links={[
        ["Dashboard", "/portal/student", "ڈیش بورڈ"],
        ["Noorani Qaida", "/portal/student/qaida", "نورانی قاعدہ"],
        ["Progress", "/portal/student/progress", "پیش رفت"],
        ["Announcements", "/portal/student/announcements", "اعلانات"],
      ]}
    >
      <section className="qaida-index-intro">
        <h2>نورانی قاعدہ — 17 مرحلہ وار اسباق</h2>
        <p>حروف سے شروع ہو کر حرکات، سکون، تنوین، تشدید، مد، قلقلہ، غنہ اور جامع مشق تک۔</p>
      </section>

      <div className="qaida-lesson-grid">
        {QAIDA_LESSONS.map((lesson) => (
          <Link key={lesson.slug} href={`/portal/student/qaida/${lesson.slug}`} className="qaida-lesson-tile">
            <span>{String(lesson.number).padStart(2, "0")}</span>
            <h3>{lesson.titleUr}</h3>
            <p>{lesson.descriptionUr}</p>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
