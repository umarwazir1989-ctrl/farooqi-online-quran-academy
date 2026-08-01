"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Locale = "ur" | "en";

const content = {
  ur: {
    dir: "rtl", language: "اردو", other: "English", localePath: "/en",
    nav: ["کورسز", "خصوصیات", "طریقۂ کار", "اساتذہ", "فیس", "رابطہ"],
    ids: ["courses", "features", "process", "teachers", "pricing", "contact"],
    badge: "لاہور سے دنیا بھر کے لیے آن لائن قرآن تعلیم",
    titleA: "قرآنِ مجید سیکھیے", titleB: "تجوید اور محبت کے ساتھ",
    lead: "بچوں، خواتین اور بڑوں کے لیے مستند مرد و خواتین اساتذہ کے ساتھ انفرادی آن لائن کلاسز۔ گھر بیٹھے محفوظ، منظم اور آسان تعلیم۔",
    trial: "مفت ٹرائل کلاس بک کریں", whatsapp: "واٹس ایپ رابطہ",
    stats: [["10+", "سال کا تدریسی تجربہ"], ["1-to-1", "انفرادی لائیو کلاس"], ["24/7", "لچکدار اوقات"]],
    coursesTitle: "ہر عمر اور ہر سطح کے لیے کورسز",
    coursesSub: "ابتدائی قاعدہ سے حفظ، تجوید اور ترجمہ تک مرحلہ وار نصاب۔",
    courses: [
      ["نورانی قاعدہ", "حروف، حرکات، جوڑ اور درست تلفظ کی مضبوط بنیاد۔"],
      ["ناظرہ قرآن", "مخارج اور بنیادی تجوید کے ساتھ روانی سے تلاوت۔"],
      ["تجوید القرآن", "قواعدِ تجوید، عملی مشق اور تلاوت کی اصلاح۔"],
      ["حفظ القرآن", "منظم سبق، سبقی، منزل اور مسلسل نگرانی۔"],
      ["ترجمہ و تفسیر", "منتخب سورتوں کا آسان ترجمہ اور بنیادی فہم۔"],
      ["اسلامی تعلیمات", "نماز، دعائیں، آداب، عقیدہ اور روزمرہ مسائل۔"]
    ],
    whyTitle: "والدین ہمیں کیوں منتخب کرتے ہیں؟",
    why: [
      ["مستند اساتذہ", "تجربہ کار مرد اور خواتین اساتذہ، بچوں کے مزاج کے مطابق تدریس۔"],
      ["محفوظ ماحول", "انفرادی کلاس، والدین کی نگرانی اور طلبہ کی رازداری کا خیال۔"],
      ["لچکدار اوقات", "پاکستان، برطانیہ، یورپ، امریکہ اور خلیج کے اوقات کے مطابق۔"],
      ["ماہانہ رپورٹ", "حاضری، سبق، کارکردگی اور آئندہ اہداف کی واضح رپورٹ۔"],
      ["درست تلفظ", "ہر سبق میں مخارج، صفات اور عملی تلاوت کی اصلاح۔"],
      ["مفت ٹرائل", "داخلے سے پہلے استاد، طریقۂ تدریس اور کلاس سسٹم دیکھیے۔"]
    ],
    processTitle: "داخلہ کیسے ہوگا؟",
    steps: [["رابطہ", "مختصر فارم یا واٹس ایپ سے معلومات بھیجیں۔"], ["لیول چیک", "طالب علم کی عمر، سطح اور مقصد معلوم کیا جائے گا۔"], ["مفت ٹرائل", "موزوں استاد کے ساتھ عملی ٹرائل کلاس ہوگی۔"], ["باقاعدہ آغاز", "مناسب وقت، نصاب اور ماہانہ منصوبے کے ساتھ کلاس شروع۔"]],
    teachersTitle: "آپ کے لیے موزوں اساتذہ",
    teachers: [["مرد اساتذہ", "بچوں اور بڑوں کے لیے"], ["خواتین معلمات", "خواتین اور بچیوں کے لیے"], ["حفظ کے اساتذہ", "سبق، سبقی اور منزل"], ["تجوید ماہرین", "مخارج اور قراءت کی اصلاح"]],
    pricingTitle: "سادہ اور لچکدار فیس پلان",
    plans: [["بنیادی", "ہفتے میں 2 دن", ["انفرادی کلاس", "20–25 منٹ", "ماہانہ رپورٹ"]], ["مقبول", "ہفتے میں 3 دن", ["انفرادی کلاس", "30 منٹ", "تجوید کی عملی اصلاح"]], ["خصوصی", "ہفتے میں 5 دن", ["حفظ یا گہری تعلیم", "30–40 منٹ", "ترجیحی نگرانی"]]],
    priceNote: "حتمی فیس ملک، دورانیے اور ہفتہ وار کلاسز کے مطابق طے ہوگی۔",
    contactTitle: "آج ہی مفت ٹرائل کلاس بک کریں",
    contactSub: "فارم جمع ہونے کے بعد واٹس ایپ کھلے گا، جہاں آپ درخواست براہِ راست بھیج سکیں گے۔",
    labels: { name: "طالب علم کا نام", phone: "واٹس ایپ نمبر", country: "ملک / شہر", age: "عمر", course: "مطلوبہ کورس", message: "اضافی تفصیل", submit: "درخواست بھیجیں", select: "کورس منتخب کریں" },
    success: "درخواست تیار ہوگئی ہے۔ اب واٹس ایپ پر Send دبائیں۔",
    footer: "فاروقی آن لائن قرآن اکیڈمی، لاہور — قرآن کی تعلیم، تجوید اور اسلامی تربیت۔",
  },
  en: {
    dir: "ltr", language: "English", other: "اردو", localePath: "/ur",
    nav: ["Courses", "Why Us", "How It Works", "Teachers", "Fees", "Contact"],
    ids: ["courses", "features", "process", "teachers", "pricing", "contact"],
    badge: "Online Quran education from Lahore to the world",
    titleA: "Learn the Holy Quran", titleB: "with Tajweed and Care",
    lead: "Private online classes for children, women and adults with qualified male and female tutors. Safe, structured and convenient learning from home.",
    trial: "Book a Free Trial", whatsapp: "Chat on WhatsApp",
    stats: [["10+", "Years of teaching"], ["1-to-1", "Private live classes"], ["24/7", "Flexible scheduling"]],
    coursesTitle: "Courses for every age and level",
    coursesSub: "A step-by-step curriculum from beginner Qaida to Hifz, Tajweed and Quran understanding.",
    courses: [
      ["Noorani Qaida", "Build a strong foundation in letters, vowels, joining and pronunciation."],
      ["Quran Reading", "Develop fluent recitation with correct makharij and essential Tajweed."],
      ["Tajweed Course", "Learn Tajweed rules through guided practice and personal correction."],
      ["Quran Memorization", "Structured new lesson, revision and long-term retention plans."],
      ["Translation & Tafsir", "Understand selected Surahs through clear translation and explanation."],
      ["Islamic Studies", "Prayer, duas, manners, beliefs and practical daily guidance."]
    ],
    whyTitle: "Why families choose our academy",
    why: [
      ["Qualified Tutors", "Experienced male and female tutors who adapt to each learner."],
      ["Safe Learning", "Private classes, parent visibility and respect for student privacy."],
      ["Flexible Timings", "Schedules suitable for Pakistan, UK, Europe, USA and Gulf countries."],
      ["Monthly Reports", "Clear updates on attendance, lessons, progress and next goals."],
      ["Correct Pronunciation", "Makharij, Tajweed and recitation correction in every lesson."],
      ["Free Trial", "Experience the teacher, class system and teaching method before enrolling."]
    ],
    processTitle: "How enrollment works",
    steps: [["Contact Us", "Send your details through the short form or WhatsApp."], ["Level Check", "We review the learner’s age, level and goals."], ["Free Trial", "Attend a practical trial lesson with a suitable tutor."], ["Start Learning", "Begin with an agreed schedule, curriculum and monthly plan."]],
    teachersTitle: "The right tutor for every learner",
    teachers: [["Male Tutors", "For boys, men and families"], ["Female Tutors", "For women and girls"], ["Hifz Tutors", "New lesson and revision"], ["Tajweed Experts", "Makharij and recitation correction"]],
    pricingTitle: "Simple and flexible plans",
    plans: [["Essential", "2 days per week", ["Private class", "20–25 minutes", "Monthly report"]], ["Popular", "3 days per week", ["Private class", "30 minutes", "Practical Tajweed correction"]], ["Intensive", "5 days per week", ["Hifz or intensive study", "30–40 minutes", "Priority follow-up"]]],
    priceNote: "Final fees depend on country, lesson duration and weekly class frequency.",
    contactTitle: "Book your free trial today",
    contactSub: "After submitting, WhatsApp will open with your completed request ready to send.",
    labels: { name: "Student name", phone: "WhatsApp number", country: "Country / City", age: "Age", course: "Course", message: "Additional details", submit: "Send Request", select: "Select a course" },
    success: "Your request is ready. Tap Send in WhatsApp.",
    footer: "Farooqi Online Quran Academy, Lahore — Quran learning, Tajweed and Islamic education.",
  }
} as const;

export default function AcademySite({ locale }: { locale: Locale }) {
  const t = content[locale];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923336519527";
    const lines = Object.entries(payload).map(([key, value]) => `${key}: ${value}`).join("\n");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(`Farooqi Quran Academy - Free Trial\n\n${lines}`)}`, "_blank", "noopener,noreferrer");
    setStatus(t.success);
  }

  return (
    <div dir={t.dir} lang={locale} className={locale === "ur" ? "urdu" : "english"}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="topbar"><div className="wrap topbar-inner"><span>Lahore, Pakistan · Worldwide Online Classes</span><div><a href="tel:+923336519527">0333-6519527</a><a href="mailto:umarwazir1989@gmail.com">umarwazir1989@gmail.com</a></div></div></div>
      <header>
        <div className="wrap nav">
          <Link href={`/${locale}`} className="brand"><Image src="/logo.jpg" alt="Farooqi Online Quran Academy logo" width={52} height={52} priority/><span><strong>{locale === "ur" ? "فاروقی آن لائن قرآن اکیڈمی" : "Farooqi Online Quran Academy"}</strong><small>Lahore · Pakistan</small></span></Link>
          <nav className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
            {t.nav.map((item, i) => <a key={item} href={`#${t.ids[i]}`} onClick={() => setOpen(false)}>{item}</a>)}
            <Link className="language-mobile" href={t.localePath}>{t.other}</Link>
          </nav>
          <div className="nav-actions"><Link className="language" href={t.localePath}>{t.other}</Link><a className="btn btn-small" href="#contact">{t.trial}</a><button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/><span/></button></div>
        </div>
      </header>
      <main id="main">
        <section className="hero"><div className="wrap hero-grid"><div><span className="eyebrow">{t.badge}</span><h1>{t.titleA}<em>{t.titleB}</em></h1><p className="lead">{t.lead}</p><div className="hero-actions"><a className="btn" href="#contact">{t.trial}</a><a className="btn btn-outline" href="https://wa.me/923336519527" target="_blank" rel="noreferrer">{t.whatsapp}</a></div><div className="stats">{t.stats.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div></div><div className="hero-card"><div className="arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div><p>{locale === "ur" ? "اور قرآن کو خوب ٹھہر ٹھہر کر پڑھیے" : "And recite the Quran with measured recitation."}</p><div className="mini-list"><span>✓ One-to-one live classes</span><span>✓ Male & female tutors</span><span>✓ Free assessment and trial</span><span>✓ Monthly progress report</span></div></div></div></section>
        <section id="courses"><div className="wrap"><SectionHead title={t.coursesTitle} text={t.coursesSub}/><div className="cards">{t.courses.map(([a,b],i)=><article className="card" key={a}><span className="number">0{i+1}</span><h3>{a}</h3><p>{b}</p></article>)}</div></div></section>
        <section id="features" className="dark"><div className="wrap"><SectionHead title={t.whyTitle} text="" light/><div className="feature-grid">{t.why.map(([a,b])=><article key={a}><span>✦</span><h3>{a}</h3><p>{b}</p></article>)}</div></div></section>
        <section id="process"><div className="wrap"><SectionHead title={t.processTitle} text=""/><div className="steps">{t.steps.map(([a,b],i)=><article key={a}><strong>{i+1}</strong><h3>{a}</h3><p>{b}</p></article>)}</div></div></section>
        <section id="teachers" className="soft"><div className="wrap"><SectionHead title={t.teachersTitle} text=""/><div className="teacher-grid">{t.teachers.map(([a,b])=><article key={a}><div className="avatar">◈</div><h3>{a}</h3><p>{b}</p></article>)}</div></div></section>
        <section id="pricing"><div className="wrap"><SectionHead title={t.pricingTitle} text={t.priceNote}/><div className="plans">{t.plans.map(([a,b,c],i)=><article className={i===1?"plan featured":"plan"} key={a}><span className="plan-tag">{b}</span><h3>{a}</h3><ul>{c.map(x=><li key={x}>✓ {x}</li>)}</ul><a className={i===1?"btn btn-gold":"btn btn-outline"} href="#contact">{t.trial}</a></article>)}</div></div></section>
        <section id="contact"><div className="wrap contact"><div><span className="eyebrow">Free Trial</span><h2>{t.contactTitle}</h2><p>{t.contactSub}</p><div className="contact-lines"><a href="tel:+923336519527">☎ 0333-6519527</a><a href="tel:+923344323994">☎ 0334-4323994</a><a href="mailto:umarwazir1989@gmail.com">✉ umarwazir1989@gmail.com</a></div></div><form onSubmit={submit}><label>{t.labels.name}<input name="name" required/></label><div className="form-row"><label>{t.labels.phone}<input name="phone" inputMode="tel" required/></label><label>{t.labels.country}<input name="country" required/></label></div><div className="form-row"><label>{t.labels.age}<input name="age" inputMode="numeric"/></label><label>{t.labels.course}<select name="course" required defaultValue=""><option value="" disabled>{t.labels.select}</option>{t.courses.map(([x])=><option key={x}>{x}</option>)}</select></label></div><label>{t.labels.message}<textarea name="message" rows={4}/></label><button className="btn btn-gold" type="submit">{t.labels.submit}</button><p className="form-status" aria-live="polite">{status}</p></form></div></section>
      </main>
      <footer><div className="wrap footer"><div className="brand"><Image src="/logo.jpg" alt="" width={48} height={48}/><span><strong>{locale === "ur" ? "فاروقی آن لائن قرآن اکیڈمی" : "Farooqi Online Quran Academy"}</strong><small>Lahore · Pakistan</small></span></div><p>{t.footer}</p><p>© {new Date().getFullYear()} Farooqi Online Quran Academy</p></div></footer>
      <a className="floating-whatsapp" href="https://wa.me/923336519527" target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
    </div>
  );
}

function SectionHead({ title, text, light = false }: { title: string; text: string; light?: boolean }) {
  return <div className={`section-head ${light ? "light" : ""}`}><span className="eyebrow">Farooqi Academy</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}
