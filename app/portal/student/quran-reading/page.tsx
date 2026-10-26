import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
import QuranStudentLesson from "@/components/quran/QuranStudentLesson";

export const dynamic = "force-dynamic";

export default async function Page() {
  const p=await requireRole(["student"]);
  const {student}=await getStudentPortalData(p.id);

  return <DashboardShell
    role="Student"
    name={student?.full_name||p.full_name}
    title="Quran Reading Teacher"
    titleUr="ڈیجیٹل قرآن ٹیچر"
    subtitle="Verified Quran data, word audio, recording and teacher review."
    subtitleUr="مصدقہ قرآن متن، لفظی آڈیو، طالب علم کی recording اور استاد کی تصحیح۔"
    cards={[
      ["114","Surahs","Quran navigation","114","سورتیں"],
      ["Word","Audio","Word-by-word playback","لفظ","الگ آڈیو"],
      ["🎙️","Record","Send recitation to teacher","ریکارڈ","استاد کو سنائیں"],
      ["Teacher","Final","Human correction remains final","استاد","حتمی تصحیح"],
    ]}
    links={[
      ["Dashboard","/portal/student","ڈیش بورڈ"],
      ["Noorani Qaida","/portal/student/qaida","نورانی قاعدہ"],
      ["Quran Reading","/portal/student/quran-reading","قرآن ریڈنگ"],
      ["Revision","/portal/student/qaida-revision","اعادہ"],
    ]}
  >
    <QuranStudentLesson/>
  </DashboardShell>;
}
