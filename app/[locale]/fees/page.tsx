import { notFound } from "next/navigation";
import Link from "next/link";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur", "en"] as const;

const prices = [
  {
    nameEn: "Essential",
    nameUr: "بنیادی پلان",
    classes: "8",
    daysEn: "2 days / week",
    daysUr: "ہفتے میں 2 دن",
    durationEn: "30 min",
    durationUr: "30 منٹ",
    gbp: "£29",
    usd: "$39",
    cadEn: "C$55",
    cadUr: "$55",
    eur: "€35",
    audEn: "A$60",
    audUr: "$60",
    aedEn: "AED 135",
    aedUr: "135 درہم",
    pkrEn: "Rs 4,500",
    pkrUr: "4,500 روپے",
  },
  {
    nameEn: "Popular",
    nameUr: "مقبول پلان",
    classes: "12",
    daysEn: "3 days / week",
    daysUr: "ہفتے میں 3 دن",
    durationEn: "30 min",
    durationUr: "30 منٹ",
    gbp: "£39",
    usd: "$55",
    cadEn: "C$75",
    cadUr: "$75",
    eur: "€49",
    audEn: "A$85",
    audUr: "$85",
    aedEn: "AED 195",
    aedUr: "195 درہم",
    pkrEn: "Rs 6,500",
    pkrUr: "6,500 روپے",
  },
  {
    nameEn: "Intensive / Hifz",
    nameUr: "خصوصی / حفظ پلان",
    classes: "20",
    daysEn: "5 days / week",
    daysUr: "ہفتے میں 5 دن",
    durationEn: "30 min",
    durationUr: "30 منٹ",
    gbp: "£59",
    usd: "$79",
    cadEn: "C$105",
    cadUr: "$105",
    eur: "€75",
    audEn: "A$120",
    audUr: "$120",
    aedEn: "AED 290",
    aedUr: "290 درہم",
    pkrEn: "Rs 10,500",
    pkrUr: "10,500 روپے",
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
          ? "30 منٹ کی انفرادی آن لائن لائیو کلاسز کے لیے واضح ماہانہ فیس شیڈول۔ ہر نئے طالب علم کے لیے پہلے مفت ٹرائل دستیاب ہے، اور بہن بھائیوں کے لیے 10% تا 20% فیملی ڈسکاؤنٹ ہے۔"
          : "Clear monthly pricing for 30-minute private 1-to-1 live classes. Every new learner begins with a free trial, with 10%–20% sibling discounts available."
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
                  <th>{ur ? "برطانیہ" : "UK"}</th>
                  <th>{ur ? "امریکہ" : "USA"}</th>
                  <th>{ur ? "کینیڈا" : "Canada"}</th>
                  <th>{ur ? "یورپ" : "Europe"}</th>
                  <th>{ur ? "آسٹریلیا" : "Australia"}</th>
                  <th>{ur ? "متحدہ عرب امارات" : "UAE / Gulf"}</th>
                  <th>{ur ? "پاکستان" : "Pakistan"}</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p, i) => (
                  <tr className={i === 1 ? "recommended-row" : ""} key={p.nameEn}>
                    <td>
                      <strong>{ur ? p.nameUr : p.nameEn}</strong>
                      <small>{ur ? `${p.daysUr} · ${p.durationUr}` : `${p.daysEn} · ${p.durationEn}`}</small>
                    </td>
                    <td>{p.classes} / {ur ? "ماہ" : "month"}</td>
                    <td>{p.gbp}</td>
                    <td>{p.usd}</td>
                    <td>{ur ? p.cadUr : p.cadEn}</td>
                    <td>{p.eur}</td>
                    <td>{ur ? p.audUr : p.audEn}</td>
                    <td>{ur ? p.aedUr : p.aedEn}</td>
                    <td>{ur ? p.pkrUr : p.pkrEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="fee-benefits">
            <article><strong>{ur ? "انفرادی" : "1-to-1"}</strong><span>{ur ? "انفرادی لائیو کلاس" : "Private live class"}</span></article>
            <article><strong>{ur ? "30–60 منٹ" : "30–60m"}</strong><span>{ur ? "حسبِ ضرورت دورانیہ" : "Flexible duration"}</span></article>
            <article><strong>{ur ? "مفت" : "Free"}</strong><span>{ur ? "پہلا ٹرائل اور تعلیمی جائزہ" : "First trial & assessment"}</span></article>
            <article><strong>10–20%</strong><span>{ur ? "بہن بھائیوں پر فیملی رعایت" : "Family sibling discount"}</span></article>
          </div>

          <div className="content-panel notice-panel">
            <h2>{ur ? "خصوصی کورسز اور فیملی پیکجز" : "Specialised Programs & Family Packages"}</h2>
            <p>
              {ur
                ? "حفظ القرآن، اعلیٰ تجوید و قراءات، 45 یا 60 منٹ کی کلاسز اور خصوصی حدیث و سیرت پروگرام کے لیے فیس طالب علم کی ضرورت کے مطابق طے کی جاتی ہے۔ ہوم پیج پر موجود انٹرایکٹو فیس کیلکولیٹر سے آپ فوری حساب بھی لگا سکتے ہیں۔"
                : "Hifz, advanced Tajweed/Qira'at, 45- or 60-minute lessons, and specialised Hadith/Seerah programs are customized to the learner's requirements. You can also use the interactive Fee Calculator on our home page."}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
              <Link className="btn" href={`/${locale}/free-trial`}>{t.trial}</Link>
              <Link className="btn btn-outline" href={`/${locale}#pricing`}>
                {ur ? "انٹرایکٹو فیس کیلکولیٹر" : "Interactive Fee Calculator"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </InternalPage>
  );
}
