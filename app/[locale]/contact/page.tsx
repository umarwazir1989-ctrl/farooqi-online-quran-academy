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
    <InternalPage locale={locale} title={t.contactTitle} intro={t.contactIntro} pagePath="/contact">
      
        <section>
          <div className="wrap contact-info-grid">
            <article className="info-card"><h3>WhatsApp</h3><p><a href="https://wa.me/923336519527">0333-6519527</a></p></article>
            <article className="info-card"><h3>{locale === "ur" ? "فون" : "Phone"}</h3><p><a href="tel:+923344323994">0334-4323994</a></p></article>
            <article className="info-card"><h3>Email</h3><p><a href="mailto:umarwazir1989@gmail.com">umarwazir1989@gmail.com</a></p></article>
          </div>
          <div className="wrap content-panel">
            <h2>{locale === "ur" ? "داخلہ یا Trial؟" : "Admission or Trial?"}</h2>
            <p>{locale === "ur"
              ? "اگر آپ نئے طالب علم کے لیے داخلہ چاہتے ہیں تو پہلے مفت trial class بک کریں۔"
              : "For a new learner, begin by booking a free trial class."}</p>
            <Link className="btn" href={`/${locale}/free-trial`}>{t.trial}</Link>
          </div>
        </section>
    </InternalPage>
  );
}
