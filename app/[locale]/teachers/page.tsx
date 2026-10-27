import { notFound } from "next/navigation";
import Link from "next/link";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur", "en"] as const;

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const t = siteData[locale];
  const isUrdu = locale === "ur";

  return (
    <InternalPage
      locale={locale}
      title={isUrdu ? "ہمارے مستند و سند یافتہ اساتذہ" : "Our Qualified & Certified Tutors"}
      intro={
        isUrdu
          ? "فاروقی آن لائن قرآن اکیڈمی کے تمام اساتذہ اور معلمات وفاق المدارس العربیہ سے فاضل درس نظامی اور قراءات سبعہ و عشرہ کی مستند اسناد کے حامل ہیں۔"
          : "All male Qaris and female Ustadhas at Farooqi Academy are certified graduates of Dars-e-Nizami and formal holders of 7 and 10 Qira'at certifications."
      }
      pagePath="/teachers"
    >
      <section style={{ padding: "50px 0" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">
              <span className="eyebrow-star">✦</span>
              {isUrdu ? "مستند قراء اور معلمات کی ٹیم" : "Faculty of Certified Scholars"}
            </span>
            <h2>{isUrdu ? "اساتذہ کی باضابطہ فہرست و اسناد" : "Official Faculty & Qualifications"}</h2>
            <p>
              {isUrdu
                ? "طالب علم کی عمر، جنس اور تعلیمی سطح کے مطابق موزوں استاد یا معلمہ کا انتخاب کیا جاتا ہے۔ خواتین اور بچیوں کے لیے الگ مستند معلمات موجود ہیں۔"
                : "Tutors are matched individually based on the learner's age, gender, course, and timezone. Dedicated female scholars teach sisters and young girls."}
            </p>
          </div>

          <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
            {t.teachersList.map((teacher) => (
              <article className="card" key={teacher.name} style={{ textAlign: "start" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className="verified-tag">✓ {isUrdu ? "مصدقہ سند یافتہ" : "Verified Scholar"}</span>
                    <small style={{ color: "var(--gold)", fontWeight: 700 }}>{teacher.experience}</small>
                  </div>
                  <h3 style={{ margin: "4px 0 6px" }}>{teacher.name}</h3>
                  <div className="teacher-qualification">{teacher.qualification}</div>
                  <p style={{ fontWeight: 600, color: "var(--green)", fontSize: "0.85rem", marginBottom: "10px" }}>
                    {teacher.role}
                  </p>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "14px" }}>
                    {teacher.bio}
                  </p>
                  <div style={{ marginBottom: "16px" }}>
                    <small style={{ display: "block", color: "var(--deep)", fontWeight: 700, marginBottom: "4px" }}>
                      {isUrdu ? "تخصصی شعبہ جات:" : "Specializations:"}
                    </small>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {teacher.specialties.map((spec) => (
                        <span key={spec} className="teacher-specialty-pill">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Link className="btn btn-small btn-gold" href={`/${locale}/free-trial`}>
                    {isUrdu ? "مفت ٹرائل کلاس لیں" : "Book Free Trial"}
                  </Link>
                  <a
                    className="text-link"
                    href={`https://wa.me/923336519527?text=${encodeURIComponent(
                      isUrdu
                        ? `السلام علیکم! میں ${teacher.name} کی زیرِ نگرانی آن لائن کلاسز کے لیے معلومات چاہتا ہوں۔`
                        : `Assalamu Alaikum! I would like to inquire about classes with ${teacher.name}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {isUrdu ? "واٹس ایپ رابطہ →" : "WhatsApp →"}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="section-cta-bar" style={{ marginTop: "44px" }}>
            <div>
              <strong>{isUrdu ? "استاد کے انتخاب میں رہنمائی چاہیے؟" : "Need help choosing the right tutor?"}</strong>
              <p>
                {isUrdu
                  ? "ہمارے ناظمِ تعلیمات سے براہِ راست مشورہ کریں اور اپنے بچے یا اپنے لیے موزوں ترین استاد کے ساتھ مفت ٹرائل حاصل کریں۔"
                  : "Consult directly with our academic advisor to find the perfect teacher for your child or yourself with a free trial."}
              </p>
            </div>
            <Link className="btn btn-gold" href={`/${locale}/free-trial`}>
              {isUrdu ? "مفت تعلیمی جائزہ حاصل کریں" : "Get Free Assessment"}
            </Link>
          </div>
        </div>
      </section>
    </InternalPage>
  );
}
