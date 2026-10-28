import { notFound } from "next/navigation";
import Link from "next/link";
import InternalPage from "@/components/InternalPage";
import { siteData, type Locale } from "@/lib/siteData";

const locales = ["ur", "en"] as const;

export default async function Page(props: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolved = await Promise.resolve(props.params);
  const rawLocale = resolved?.locale;
  const locale: Locale = rawLocale === "ur" ? "ur" : "en";
  const t = siteData[locale];
  const isUrdu = locale === "ur";

  return (
    <InternalPage
      locale={locale}
      title={isUrdu ? "جامع قرآنی و اسلامی تعلیمی نصاب" : "Comprehensive Quran & Islamic Syllabi"}
      intro={
        isUrdu
          ? "ابتدائی نورانی قاعدہ سے لے کر ناظرہ، تجوید، حفظ، ترجمہ و تفسیر، حدیث، سیرت، فقہ اور عربی زبان تک ۱۲ منظم تعلیمی کورسز کا مکمل خاکہ و نصاب۔"
          : "Explore detailed syllabi, learning modules and objectives across all 12 specialized Quranic and Islamic studies tracks."
      }
      pagePath="/courses"
    >
      <section style={{ padding: "40px 0 20px" }}>
        <div className="wrap">
          <div className="course-tracks" style={{ marginBottom: "35px" }}>
            <article className="track-card">
              <span>📖</span>
              <h3>{isUrdu ? "شعبہ قرآن و تجوید" : "Quran & Tajweed Track"}</h3>
              <p>
                {isUrdu
                  ? "نورانی قاعدہ، ناظرہ مع تجوید، تجوید و قراءات، اور حفظ القرآن الکریم کا منظم نصاب۔"
                  : "Structured tracks for Noorani Qaida, Nazra, Tajweed Mastery and complete Hifz memorization."}
              </p>
            </article>
            <article className="track-card">
              <span>🕌</span>
              <h3>{isUrdu ? "شعبہ علومِ اسلامیہ" : "Islamic Studies Track"}</h3>
              <p>
                {isUrdu
                  ? "ترجمہ و تفسیر، فہم الحدیث، سیرت النبی ﷺ، عقیدہ اور نماز و مسنون دعاؤں کا نصاب۔"
                  : "Essential Tafsir, authentic Hadith, Prophetic Seerah, daily Fiqh and prayer supplications."}
              </p>
            </article>
            <article className="track-card">
              <span>📜</span>
              <h3>{isUrdu ? "شعبہ عربی و قراءات" : "Arabic & Advanced Qira'at"}</h3>
              <p>
                {isUrdu
                  ? "قرآنی عربی زبان، صرف و نحو، اور قراءات سبعہ و عشرہ کا تحقیقی و عملی مطالعہ۔"
                  : "Direct Quranic Arabic comprehension, grammar, and scholarly study of the 10 canonical Qira'at."}
              </p>
            </article>
          </div>

          <div className="section-head">
            <span className="eyebrow">
              <span className="eyebrow-star">✦</span>
              {isUrdu ? "تمام ۱۲ کورسز کا تفصیلی نصاب" : "Detailed Outlines of All 12 Courses"}
            </span>
            <h2>{isUrdu ? "کورس آؤٹ لائن اور ہفتہ وار نصاب" : "Course Outlines & Weekly Syllabi"}</h2>
            <p>
              {isUrdu
                ? "ہر کورس انفرادی کلاسز، مرحلہ وار ماڈیولز، عملی ٹیسٹ اور سرٹیفکیٹ پر مشتمل ہے:"
                : "Each course includes 1-to-1 private tutoring, modular lessons, milestone tests, and completion certificates:"}
            </p>
          </div>

          <div style={{ display: "grid", gap: "28px" }}>
            {t.coursesDetailed.map((course) => (
              <article
                key={course.code}
                style={{
                  background: "#fff",
                  border: "1.5px solid rgba(198, 149, 47, 0.28)",
                  borderRadius: "24px",
                  padding: "32px",
                  boxShadow: "0 14px 36px -26px rgba(5, 40, 31, 0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span className="number">#{course.code}</span>
                      <span className="course-audience-pill">{course.audience}</span>
                    </div>
                    <h2 style={{ fontSize: "1.85rem", color: "var(--deep)", margin: "4px 0" }}>
                      {course.name}
                    </h2>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.94rem" }}>
                      {course.shortDesc}
                    </p>
                  </div>
                  <div style={{ textAlign: isUrdu ? "left" : "right" }}>
                    <div style={{ color: "var(--green)", fontWeight: 700, fontSize: "0.95rem" }}>
                      ⏱ {course.duration}
                    </div>
                    <small style={{ color: "var(--muted)" }}>{course.sessions}</small>
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <h3 style={{ fontSize: "1.15rem", color: "var(--deep)", marginBottom: "12px" }}>
                    {isUrdu ? "مرحلہ وار نصاب و موضوعات (Syllabus Modules):" : "Syllabus Modules & Topics:"}
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "14px",
                    }}
                  >
                    {course.modules.map((mod, mi) => (
                      <div
                        key={mi}
                        style={{
                          background: "var(--cream)",
                          border: "1px solid rgba(198, 149, 47, 0.22)",
                          borderRadius: "14px",
                          padding: "16px",
                        }}
                      >
                        <strong
                          style={{
                            display: "block",
                            color: "var(--green)",
                            fontSize: "0.92rem",
                            marginBottom: "8px",
                          }}
                        >
                          {mod.title}
                        </strong>
                        <ul style={{ margin: 0, paddingInlineStart: "16px", fontSize: "0.84rem", color: "var(--muted)" }}>
                          {mod.topics.map((top, ti) => (
                            <li key={ti} style={{ marginBottom: "4px" }}>
                              {top}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(11, 79, 63, 0.05)",
                    border: "1px solid rgba(11, 79, 63, 0.15)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    marginBottom: "20px",
                  }}
                >
                  <strong style={{ display: "block", color: "var(--deep)", fontSize: "0.9rem", marginBottom: "6px" }}>
                    {isUrdu ? "کورس کے حاصلاتِ تعلّم (Learning Outcomes):" : "Learning Outcomes:"}
                  </strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "8px" }}>
                    {course.outcomes.map((out, oi) => (
                      <div key={oi} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.84rem" }}>
                        <span style={{ color: "var(--gold)", fontWeight: 800 }}>✓</span>
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                    <b>{isUrdu ? "پیشگی شرط:" : "Prerequisites:"}</b> {course.prerequisites}
                  </span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link className="btn btn-small btn-gold" href={`/${locale}/free-trial`}>
                      {isUrdu ? "اس کورس کا مفت ٹرائل لیں" : "Start Free Trial"}
                    </Link>
                    <a
                      className="btn btn-small btn-outline"
                      href={`https://wa.me/923336519527?text=${encodeURIComponent(
                        isUrdu
                          ? `السلام علیکم! میں "${course.name}" کے نصاب اور داخلے کے بارے میں رہنمائی چاہتا ہوں۔`
                          : `Assalamu Alaikum! I would like details about "${course.name}" syllabus and admission.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {isUrdu ? "واٹس ایپ معلومات" : "WhatsApp Inquiry"}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="section-cta-bar" style={{ marginTop: "44px" }}>
            <div>
              <strong>{isUrdu ? "اپنی پسند کا کورس شروع کرنے کے لیے تیار ہیں؟" : "Ready to begin your Quranic journey?"}</strong>
              <p>
                {isUrdu
                  ? "آج ہی مفت ٹرائل بک کریں اور ہمارے مستند قاری صاحب یا معلمہ کے ساتھ انفرادی کلاس لیں۔"
                  : "Book your free trial session today and experience structured one-to-one learning with our certified faculty."}
              </p>
            </div>
            <Link className="btn btn-gold" href={`/${locale}/free-trial`}>
              {isUrdu ? "مفت ٹرائل کلاس بک کریں" : "Book a Free Trial"}
            </Link>
          </div>
        </div>
      </section>
    </InternalPage>
  );
}
