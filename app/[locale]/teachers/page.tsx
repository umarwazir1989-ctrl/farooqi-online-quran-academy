import { notFound } from "next/navigation";
import Link from "next/link";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur","en"] as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const t = siteData[locale];

  return (
    <InternalPage locale={locale} title={t.teachersTitle} intro={t.teachersIntro} pagePath="/teachers">
      
        <section>
          <div className="wrap">
            <div className="teacher-detail-grid">
              {t.teacherTypes.map(([a,b]) => (
                <article className="teacher-detail-card" key={a}>
                  <div className="avatar">◈</div><h2>{a}</h2><p>{b}</p>
                </article>
              ))}
            </div>
            <div className="content-panel">
              <h2>{locale === "ur" ? "استاد کی تعیین کیسے ہوگی؟" : "How tutor assignment works"}</h2>
              <p>{locale === "ur"
                ? "ٹرائل کے بعد طالب علم کی سطح، جنس کی ترجیح، کورس، زبان اور دستیاب وقت کو سامنے رکھ کر موزوں استاد مقرر کیا جائے گا۔"
                : "After the trial, we assign a suitable tutor based on level, gender preference, course, language and availability."}</p>
            </div>
          </div>
        </section>
    </InternalPage>
  );
}
