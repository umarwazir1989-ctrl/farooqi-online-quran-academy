import { notFound } from "next/navigation";
import Link from "next/link";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur","en"] as const;

export default async function Page(props: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolved = await Promise.resolve(props.params);
  const rawLocale = resolved?.locale;
  const locale: Locale = rawLocale === "ur" ? "ur" : "en";
  const t = siteData[locale];
  const isUrdu = locale === "ur";

  return (
    <InternalPage locale={locale} title={t.contactTitle} intro={t.contactIntro} pagePath="/contact">
      <section>
        <div className="wrap contact-info-grid">
          <article className="info-card">
            <h3>{isUrdu ? "واٹس ایپ" : "WhatsApp"}</h3>
            <p><a href="https://wa.me/923336519527">0333-6519527</a></p>
          </article>
          <article className="info-card">
            <h3>{isUrdu ? "فون" : "Phone"}</h3>
            <p><a href="tel:+923344323994">0334-4323994</a></p>
          </article>
          <article className="info-card">
            <h3>{isUrdu ? "ای میل" : "Email"}</h3>
            <p><a href="mailto:umarwazir1989@gmail.com">umarwazir1989@gmail.com</a></p>
          </article>
        </div>
        <div className="wrap content-panel">
          <h2>{isUrdu ? "داخلہ یا مفت ٹرائل کلاس؟" : "Admission or Trial?"}</h2>
          <p>
            {isUrdu
              ? "اگر آپ نئے طالب علم کے لیے داخلہ چاہتے ہیں تو پہلے مفت ٹرائل کلاس بک کریں۔"
              : "For a new learner, begin by booking a free trial class."}
          </p>
          <Link className="btn" href={`/${locale}/free-trial`}>{t.trial}</Link>
        </div>
      </section>
    </InternalPage>
  );
}
