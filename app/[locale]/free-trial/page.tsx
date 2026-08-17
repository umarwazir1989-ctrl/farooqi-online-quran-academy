import { notFound } from "next/navigation";
import InternalPage from "@/components/InternalPage";
import TrialApplicationForm from "@/components/TrialApplicationForm";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur", "en"] as const;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const t = siteData[locale];

  return (
    <InternalPage
      locale={locale}
      title={t.trialTitle}
      intro={t.trialIntro}
      pagePath="/free-trial"
    >
      <section>
        <div className="wrap trial-page-grid">
          <div className="trial-steps">
            {t.trialSteps.map((step, i) => (
              <div className="trial-step" key={step}>
                <strong>{i + 1}</strong>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <TrialApplicationForm locale={locale} />
        </div>
      </section>
    </InternalPage>
  );
}
