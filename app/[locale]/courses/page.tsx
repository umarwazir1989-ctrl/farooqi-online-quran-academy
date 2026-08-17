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
    <InternalPage locale={locale} title={t.coursesTitle} intro={t.coursesIntro} pagePath="/courses">
      <section className="course-tracks-section">
        <div className="wrap">
          <div className="course-tracks">
            {t.courseTracks.map(([title, text]) => (
              <article className="track-card" key={title}>
                <span>✦</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="course-catalog-section">
        <div className="wrap">
          <div className="course-detail-grid">
            {t.coursesList.map(([name, desc, audience], i) => (
              <article className="course-detail-card" key={name}>
                <span className="number">{String(i + 1).padStart(2, "0")}</span>
                <h2>{name}</h2>
                <p>{desc}</p>
                <small>{audience}</small>
                <Link className="text-link" href={`/${locale}/free-trial`}>
                  {locale === "ur" ? "مفت ٹرائل بک کریں ←" : "Book a free trial →"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </InternalPage>
  );
}
