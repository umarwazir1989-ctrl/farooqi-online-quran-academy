import { notFound } from "next/navigation";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur","en"] as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const t = siteData[locale];

  return (
    <InternalPage locale={locale} title={t.about} intro={t.intro} pagePath="/about">
      
        <section>
          <div className="wrap">
            <div className="info-grid">
              {t.aboutPoints.map(([a,b]) => (
                <article className="info-card" key={a}><h3>{a}</h3><p>{b}</p></article>
              ))}
            </div>
            <div className="content-panel">
              <h2>{locale === "ur" ? "ہمارا تعلیمی تصور" : "Our Learning Approach"}</h2>
              <p>{locale === "ur"
                ? "ہر طالب علم کے لیے یکساں طریقہ اختیار کرنے کے بجائے ہم اس کی موجودہ سطح، عمر، رفتار، کورس اور دستیاب وقت کے مطابق تعلیمی منصوبہ ترتیب دیتے ہیں۔"
                : "Rather than using one method for every learner, we shape the learning plan around the student's current level, age, pace, course and available time."}</p>
            </div>
          </div>
        </section>
    </InternalPage>
  );
}
