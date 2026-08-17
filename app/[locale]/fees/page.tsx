import { notFound } from "next/navigation";
import Link from "next/link";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur", "en"] as const;

const prices = [
  {
    nameEn: "Essential",
    nameUr: "بنیادی",
    classes: "8",
    daysEn: "2 days / week",
    daysUr: "ہفتے میں 2 دن",
    duration: "30 min",
    gbp: "£29",
    usd: "$39",
    cad: "C$55",
    eur: "€35",
    aud: "A$60",
  },
  {
    nameEn: "Progress",
    nameUr: "مقبول",
    classes: "12",
    daysEn: "3 days / week",
    daysUr: "ہفتے میں 3 دن",
    duration: "30 min",
    gbp: "£39",
    usd: "$55",
    cad: "C$75",
    eur: "€49",
    aud: "A$85",
  },
  {
    nameEn: "Intensive",
    nameUr: "خصوصی",
    classes: "20",
    daysEn: "5 days / week",
    daysUr: "ہفتے میں 5 دن",
    duration: "30 min",
    gbp: "£59",
    usd: "$79",
    cad: "C$105",
    eur: "€75",
    aud: "A$120",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const t = siteData[locale];
  const ur = locale === "ur";

  return (
    <InternalPage
      locale={locale}
      title={t.feesTitle}
      intro={
        ur
          ? "30 منٹ کی انفرادی live classes کے لیے واضح ماہانہ فیس۔ ہر نئے طالب علم کے لیے پہلے مفت Trial دستیاب ہے۔"
          : "Clear monthly pricing for 30-minute private live classes. Every new learner can begin with a free trial."
      }
      pagePath="/fees"
    >
      <section>
        <div className="wrap">
          <div className="fee-table-wrap">
            <table className="fee-table">
              <thead>
                <tr>
                  <th>{ur ? "پلان" : "Plan"}</th>
                  <th>{ur ? "کلاسز" : "Classes"}</th>
                  <th>UK</th>
                  <th>USA</th>
                  <th>Canada</th>
                  <th>Europe</th>
                  <th>Australia</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p, i) => (
                  <tr className={i === 1 ? "recommended-row" : ""} key={p.nameEn}>
                    <td>
                      <strong>{ur ? p.nameUr : p.nameEn}</strong>
                      <small>{ur ? p.daysUr : p.daysEn} · {p.duration}</small>
                    </td>
                    <td>{p.classes} / {ur ? "ماہ" : "month"}</td>
                    <td>{p.gbp}</td>
                    <td>{p.usd}</td>
                    <td>{p.cad}</td>
                    <td>{p.eur}</td>
                    <td>{p.aud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="fee-benefits">
            <article><strong>1-to-1</strong><span>{ur ? "انفرادی کلاس" : "Private class"}</span></article>
            <article><strong>30 min</strong><span>{ur ? "فی کلاس" : "per class"}</span></article>
            <article><strong>Free</strong><span>{ur ? "پہلا Trial" : "first trial"}</span></article>
            <article><strong>10%</strong><span>{ur ? "دوسرے sibling پر رعایت" : "second sibling discount"}</span></article>
          </div>

          <div className="content-panel notice-panel">
            <h2>{ur ? "خصوصی کورسز" : "Specialised Programs"}</h2>
            <p>
              {ur
                ? "حفظ، اعلیٰ تجوید/قراءات، 45 یا 60 منٹ کی کلاسز اور خصوصی حدیث/سیرت پروگرام کے لیے فیس طالب علم کی ضرورت کے مطابق طے ہوگی۔"
                : "Hifz, advanced Tajweed/Qira'at, 45- or 60-minute lessons, and specialised Hadith/Seerah programs are quoted according to the learner's requirements."}
            </p>
            <Link className="btn" href={`/${locale}/free-trial`}>{t.trial}</Link>
          </div>
        </div>
      </section>
    </InternalPage>
  );
}
