"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Locale = "ur" | "en";

const content = {
  ur: {
    dir: "rtl",
    language: "اردو",
    other: "English",
    localePath: "/en",
    nav: ["کورسز", "خصوصیات", "طریقۂ کار", "اساتذہ", "فیس", "رابطہ"],
    ids: ["courses", "features", "process", "teachers", "pricing", "contact"],
    badge: "دنیا بھر کے طلبہ کے لیے معیاری آن لائن قرآن تعلیم",
    titleA: "قرآنِ مجید سیکھیے",
    titleB: "تجوید، محبت اور اعتماد کے ساتھ",
    lead:
      "بچوں، خواتین اور بڑوں کے لیے مستند مرد و خواتین اساتذہ کے ساتھ انفرادی آن لائن کلاسز۔ محفوظ، منظم اور آپ کے مقامی وقت کے مطابق قرآن سیکھنے کا آسان نظام۔",
    trial: "مفت ٹرائل کلاس بک کریں",
    whatsapp: "واٹس ایپ پر رابطہ کریں",
    portal: "پورٹل لاگ اِن",
    stats: [
      ["50+", "زیرِ تعلیم طلبہ"],
      ["5", "مستند اساتذہ"],
      ["1-to-1", "انفرادی براہِ راست کلاسز"],
      ["Global", "لچکدار بین الاقوامی اوقات"],
    ],
    coursesTitle: "ہر عمر اور ہر سطح کے لیے قرآن کورسز",
    coursesSub:
      "ابتدائی نورانی قاعدہ سے ناظرہ، حفظ، تجوید، ترجمہ اور بنیادی اسلامی تعلیمات تک مرحلہ وار نصاب۔",
    courses: [
      ["نورانی قاعدہ", "حروف، حرکات، جوڑ اور درست تلفظ کی مضبوط بنیاد۔"],
      ["ناظرہ قرآن", "مخارج اور بنیادی تجوید کے ساتھ روانی سے قرآنِ مجید کی تلاوت۔"],
      ["تجوید القرآن", "قواعدِ تجوید، عملی مشق اور انفرادی تلاوت کی اصلاح۔"],
      ["حفظ القرآن", "منظم سبق، سبقی، منزل اور مسلسل نگرانی کے ساتھ حفظ۔"],
      ["ترجمہ و تفسیر", "منتخب سورتوں کا آسان ترجمہ، مفہوم اور بنیادی تشریح۔"],
      ["اسلامی تعلیمات", "نماز، دعائیں، آداب، عقیدہ اور روزمرہ اسلامی رہنمائی۔"],
    ],
    whyTitle: "والدین فاروقی اکیڈمی کیوں منتخب کرتے ہیں؟",
    why: [
      ["مستند اساتذہ", "تجربہ کار مرد و خواتین اساتذہ، ہر طالب علم کی سطح اور رفتار کے مطابق تدریس۔"],
      ["محفوظ ماحول", "انفرادی کلاس، والدین کی نگرانی اور طالب علم کی رازداری کا خیال۔"],
      ["لچکدار اوقات", "پاکستان، برطانیہ، یورپ، امریکہ، کینیڈا، آسٹریلیا اور خلیجی ممالک کے مطابق اوقات۔"],
      ["ماہانہ رپورٹ", "حاضری، سبق، کارکردگی اور آئندہ اہداف کی واضح پیش رفت رپورٹ۔"],
      ["درست تلفظ", "ہر سبق میں مخارج، صفات، تجوید اور عملی تلاوت کی مسلسل اصلاح۔"],
      ["مفت ٹرائل", "داخلے سے پہلے استاد، طریقۂ تدریس اور کلاس سسٹم کا عملی تجربہ۔"],
    ],
    processTitle: "داخلے کا طریقۂ کار",
    steps: [
      ["درخواست", "مختصر فارم یا واٹس ایپ کے ذریعے طالب علم کی بنیادی معلومات بھیجیں۔"],
      ["سطح کا جائزہ", "عمر، موجودہ قرآنی سطح، مقصد اور موزوں اوقات کا مختصر جائزہ لیا جائے گا۔"],
      ["مفت ٹرائل", "مناسب استاد کے ساتھ عملی ٹرائل کلاس اور ابتدائی assessment ہوگا۔"],
      ["باقاعدہ آغاز", "موزوں وقت، کورس اور ماہانہ تعلیمی منصوبے کے ساتھ باقاعدہ کلاس شروع ہوگی۔"],
    ],
    teachersTitle: "ہر طالب علم کے لیے موزوں استاد",
    teachers: [
      ["مرد اساتذہ", "بچوں، نوجوانوں اور مرد حضرات کے لیے"],
      ["خواتین معلمات", "خواتین، بچیوں اور کم عمر طلبہ کے لیے"],
      ["حفظ کے اساتذہ", "سبق، سبقی، منزل اور مضبوط revision کے لیے"],
      ["تجوید کے ماہرین", "مخارج، صفات اور تلاوت کی عملی اصلاح کے لیے"],
    ],
    teachersBadge: "5 مستند اساتذہ",
    pricingTitle: "سادہ اور لچکدار فیس پلان",
    plans: [
      ["بنیادی", "ہفتے میں 2 دن", ["انفرادی کلاس", "مقررہ دورانیہ", "ماہانہ progress report"]],
      ["مقبول", "ہفتے میں 3 دن", ["انفرادی کلاس", "تجوید کی عملی اصلاح", "والدین کے لیے ماہانہ رپورٹ"]],
      ["خصوصی", "ہفتے میں 5 دن", ["حفظ یا intensive learning", "ترجیحی follow-up", "مسلسل progress tracking"]],
    ],
    priceNote:
      "بین الاقوامی فیس ملک، کلاس کے دورانیے اور ہفتہ وار کلاسز کی تعداد کے مطابق مقرر کی جائے گی۔ حتمی نرخ Free Trial کے بعد واضح کیے جائیں گے۔",
    contactTitle: "آج ہی مفت ٹرائل کلاس بک کریں",
    contactSub:
      "مختصر فارم پُر کریں۔ آپ کی درخواست محفوظ ہوگی اور واٹس ایپ پر بھی تیار شدہ پیغام کھل جائے گا۔",
    labels: {
      name: "طالب علم کا نام",
      phone: "واٹس ایپ نمبر",
      country: "ملک / شہر",
      age: "عمر",
      course: "مطلوبہ کورس",
      message: "اضافی تفصیل",
      submit: "درخواست بھیجیں",
      select: "کورس منتخب کریں",
    },
    success: "درخواست تیار ہوگئی ہے۔ اب واٹس ایپ پر Send دبائیں۔",
    footer:
      "فاروقی آن لائن قرآن اکیڈمی — بچوں، خواتین اور بڑوں کے لیے تجوید کے ساتھ معیاری آن لائن قرآن تعلیم۔",
    verseTranslation: "اور قرآن کو خوب ٹھہر ٹھہر کر پڑھیں۔",
    miniList: ["انفرادی براہِ راست کلاسز", "مرد و خواتین اساتذہ", "مفت assessment اور trial", "ماہانہ progress report"],
    freeTrialLabel: "مفت ٹرائل",
    sectionLabel: "فاروقی قرآن اکیڈمی",
    topbar: "لاہور، پاکستان · دنیا بھر کے لیے آن لائن کلاسز",
  },
  en: {
    dir: "ltr",
    language: "English",
    other: "اردو",
    localePath: "/ur",
    nav: ["Courses", "Why Us", "How It Works", "Teachers", "Fees", "Contact"],
    ids: ["courses", "features", "process", "teachers", "pricing", "contact"],
    badge: "Quality online Quran education for learners worldwide",
    titleA: "Learn the Holy Quran",
    titleB: "with Tajweed, Care and Confidence",
    lead:
      "Private online Quran classes for children, women and adults with qualified male and female tutors. Safe, structured learning scheduled around your local time.",
    trial: "Book a Free Trial",
    whatsapp: "Chat on WhatsApp",
    portal: "Portal Login",
    stats: [
      ["50+", "Active students"],
      ["5", "Qualified teachers"],
      ["1-to-1", "Private live classes"],
      ["Global", "Flexible international timings"],
    ],
    coursesTitle: "Quran courses for every age and level",
    coursesSub:
      "A structured learning path from Noorani Qaida and Quran reading to Hifz, Tajweed, translation and essential Islamic studies.",
    courses: [
      ["Noorani Qaida", "Build a strong foundation in Arabic letters, vowels, joining and correct pronunciation."],
      ["Quran Reading", "Develop fluent recitation with correct makharij and essential Tajweed."],
      ["Tajweed Course", "Learn Tajweed rules through guided practice and personal recitation correction."],
      ["Quran Memorization", "Structured new lesson, revision and long-term retention with regular follow-up."],
      ["Translation & Tafsir", "Understand selected Surahs through clear translation and accessible explanation."],
      ["Islamic Studies", "Prayer, duas, manners, beliefs and practical Islamic guidance for daily life."],
    ],
    whyTitle: "Why families choose Farooqi Academy",
    why: [
      ["Qualified Tutors", "Experienced male and female tutors who adapt lessons to each learner's level and pace."],
      ["Safe Learning", "Private classes, parent visibility and clear respect for student privacy."],
      ["Flexible Timings", "Schedules for Pakistan, UK, Europe, USA, Canada, Australia and Gulf countries."],
      ["Monthly Reports", "Clear updates on attendance, lessons, progress and the learner's next goals."],
      ["Correct Pronunciation", "Makharij, Tajweed and recitation correction are built into every lesson."],
      ["Free Trial", "Experience the teacher, teaching method and class system before enrolling."],
    ],
    processTitle: "How enrollment works",
    steps: [
      ["Send Details", "Share the learner's basic information through the short form or WhatsApp."],
      ["Level Review", "We review age, current Quran level, learning goals and suitable timings."],
      ["Free Trial", "Attend a practical trial lesson and initial assessment with a suitable tutor."],
      ["Start Learning", "Begin regular classes with an agreed schedule, course and monthly learning plan."],
    ],
    teachersTitle: "The right tutor for every learner",
    teachers: [
      ["Male Tutors", "For boys, young learners, men and families"],
      ["Female Tutors", "For women, girls and younger learners"],
      ["Hifz Tutors", "For new lesson, revision and long-term retention"],
      ["Tajweed Experts", "For makharij, Tajweed and recitation correction"],
    ],
    teachersBadge: "5 qualified teachers",
    pricingTitle: "Simple and flexible fee plans",
    plans: [
      ["Essential", "2 days per week", ["Private class", "Structured lesson duration", "Monthly progress report"]],
      ["Popular", "3 days per week", ["Private class", "Practical Tajweed correction", "Monthly parent update"]],
      ["Intensive", "5 days per week", ["Hifz or intensive learning", "Priority follow-up", "Continuous progress tracking"]],
    ],
    priceNote:
      "International fees will be set according to country, lesson duration and weekly class frequency. Final pricing is confirmed after the free trial.",
    contactTitle: "Book your free trial today",
    contactSub:
      "Complete the short form. Your request will be recorded and a ready-to-send WhatsApp message will also open.",
    labels: {
      name: "Student name",
      phone: "WhatsApp number",
      country: "Country / City",
      age: "Age",
      course: "Course",
      message: "Additional details",
      submit: "Send Request",
      select: "Select a course",
    },
    success: "Your request is ready. Tap Send in WhatsApp.",
    footer:
      "Farooqi Online Quran Academy — quality online Quran learning with Tajweed for children, women and adults.",
    verseTranslation: "And recite the Quran with measured recitation.",
    miniList: ["One-to-one live classes", "Male & female tutors", "Free assessment and trial", "Monthly progress report"],
    freeTrialLabel: "Free Trial",
    sectionLabel: "Farooqi Quran Academy",
    topbar: "Lahore, Pakistan · Worldwide Online Classes",
  },
} as const;

export default function AcademySite({ locale }: { locale: Locale }) {
  const t = content[locale];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923336519527";
    const lines = Object.entries(payload)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(
        `Farooqi Quran Academy - Free Trial\n\n${lines}`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );

    setStatus(t.success);
  }

  return (
    <div dir={t.dir} lang={locale} className={locale === "ur" ? "urdu" : "english"}>
      <a className="skip-link" href="#main">
        {locale === "ur" ? "اصل مواد پر جائیں" : "Skip to content"}
      </a>

      <div className="topbar">
        <div className="wrap topbar-inner">
          <span>{t.topbar}</span>
          <div>
            <a href="tel:+923336519527">0333-6519527</a>
            <a href="mailto:umarwazir1989@gmail.com">umarwazir1989@gmail.com</a>
          </div>
        </div>
      </div>

      <header>
        <div className="wrap nav">
          <Link href={`/${locale}`} className="brand">
            <Image
              src="/logo.jpg"
              alt="Farooqi Online Quran Academy logo"
              width={52}
              height={52}
              priority
            />
            <span>
              <strong>
                {locale === "ur"
                  ? "فاروقی آن لائن قرآن اکیڈمی"
                  : "Farooqi Online Quran Academy"}
              </strong>
              <small>Lahore · Pakistan</small>
            </span>
          </Link>

          <nav className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
            {t.nav.map((item, i) => (
              <a
                key={item}
                href={`#${t.ids[i]}`}
                onClick={() => setOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link className="portal-mobile" href="/portal">
              {t.portal}
            </Link>
            <Link className="language-mobile" href={t.localePath}>
              {t.other}
            </Link>
          </nav>

          <div className="nav-actions">
            <Link className="portal-link" href="/portal">
              {t.portal}
            </Link>
            <Link className="language" href={t.localePath}>
              {t.other}
            </Link>
            <a className="btn btn-small" href="#contact">
              {t.trial}
            </a>
            <button
              className="menu"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">{t.badge}</span>
              <h1>
                {t.titleA}
                <em>{t.titleB}</em>
              </h1>
              <p className="lead">{t.lead}</p>

              <div className="hero-actions">
                <a className="btn" href="#contact">
                  {t.trial}
                </a>
                <a
                  className="btn btn-outline"
                  href="https://wa.me/923336519527"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.whatsapp}
                </a>
              </div>

              <div className="stats">
                {t.stats.map(([n, l]) => (
                  <div key={l}>
                    <strong>{n}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-card">
              <div className="arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
              <p>{t.verseTranslation}</p>
              <div className="mini-list">
                {t.miniList.map((item) => (
                  <span key={item}>✓ {item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="courses">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.coursesTitle}
              text={t.coursesSub}
            />
            <div className="cards">
              {t.courses.map(([a, b], i) => (
                <article className="card" key={a}>
                  <span className="number">0{i + 1}</span>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="dark">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.whyTitle}
              text=""
              light
            />
            <div className="feature-grid">
              {t.why.map(([a, b]) => (
                <article key={a}>
                  <span>✦</span>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.processTitle}
              text=""
            />
            <div className="steps">
              {t.steps.map(([a, b], i) => (
                <article key={a}>
                  <strong>{i + 1}</strong>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="teachers" className="soft">
          <div className="wrap">
            <SectionHead
              label={t.teachersBadge}
              title={t.teachersTitle}
              text=""
            />
            <div className="teacher-grid">
              {t.teachers.map(([a, b]) => (
                <article key={a}>
                  <div className="avatar">◈</div>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.pricingTitle}
              text={t.priceNote}
            />
            <div className="plans">
              {t.plans.map(([a, b, c], i) => (
                <article
                  className={i === 1 ? "plan featured" : "plan"}
                  key={a}
                >
                  <span className="plan-tag">{b}</span>
                  <h3>{a}</h3>
                  <ul>
                    {c.map((x) => (
                      <li key={x}>✓ {x}</li>
                    ))}
                  </ul>
                  <a
                    className={i === 1 ? "btn btn-gold" : "btn btn-outline"}
                    href="#contact"
                  >
                    {t.trial}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="wrap contact">
            <div>
              <span className="eyebrow">{t.freeTrialLabel}</span>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactSub}</p>
              <div className="contact-lines">
                <a href="tel:+923336519527">☎ 0333-6519527</a>
                <a href="tel:+923344323994">☎ 0334-4323994</a>
                <a href="mailto:umarwazir1989@gmail.com">✉ umarwazir1989@gmail.com</a>
              </div>
            </div>

            <form onSubmit={submit}>
              <label>
                {t.labels.name}
                <input name="name" required />
              </label>

              <div className="form-row">
                <label>
                  {t.labels.phone}
                  <input name="phone" inputMode="tel" required />
                </label>
                <label>
                  {t.labels.country}
                  <input name="country" required />
                </label>
              </div>

              <div className="form-row">
                <label>
                  {t.labels.age}
                  <input name="age" inputMode="numeric" />
                </label>
                <label>
                  {t.labels.course}
                  <select name="course" required defaultValue="">
                    <option value="" disabled>
                      {t.labels.select}
                    </option>
                    {t.courses.map(([x]) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                {t.labels.message}
                <textarea name="message" rows={4} />
              </label>

              <button className="btn btn-gold" type="submit">
                {t.labels.submit}
              </button>
              <p className="form-status" aria-live="polite">
                {status}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer">
          <div className="brand">
            <Image src="/logo.jpg" alt="" width={48} height={48} />
            <span>
              <strong>
                {locale === "ur"
                  ? "فاروقی آن لائن قرآن اکیڈمی"
                  : "Farooqi Online Quran Academy"}
              </strong>
              <small>Lahore · Pakistan</small>
            </span>
          </div>
          <p>{t.footer}</p>
          <p>© {new Date().getFullYear()} Farooqi Online Quran Academy</p>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href="https://wa.me/923336519527"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        WA
      </a>
    </div>
  );
}

function SectionHead({
  label,
  title,
  text,
  light = false,
}: {
  label: string;
  title: string;
  text: string;
  light?: boolean;
}) {
  return (
    <div className={`section-head ${light ? "light" : ""}`}>
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
