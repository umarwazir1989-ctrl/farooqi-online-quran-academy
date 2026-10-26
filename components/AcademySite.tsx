"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type Locale = "ur" | "en";

type QariId = "afasy" | "husary" | "sudais";

const QARI_LIST: {
  id: QariId;
  nameUr: string;
  nameEn: string;
  folder: string;
}[] = [
  {
    id: "afasy",
    nameUr: "شیخ مشاری راشد العفاسی",
    nameEn: "Sheikh Mishary Rashid Alafasy",
    folder: "Alafasy_128kbps",
  },
  {
    id: "husary",
    nameUr: "شیخ محمود خلیل الحصری (معلمِ تجوید)",
    nameEn: "Sheikh Mahmoud Khalil Al-Husary",
    folder: "Husary_128kbps",
  },
  {
    id: "sudais",
    nameUr: "شیخ عبدالرحمٰن السدیس (امامِ کعبہ)",
    nameEn: "Sheikh Abdur-Rahman As-Sudais",
    folder: "Abdurrahmaan_As-Sudais_192kbps",
  },
];

const TAJWEED_SAMPLES = [
  {
    surahEn: "Surah Al-Muzzammil (73:4)",
    surahUr: "سورۃ المزمل (آیت 4)",
    audioFiles: ["073004.mp3"],
    arabicHtml: `وَرَتِّلِ الْقُرْآنَ <span class="tj-madd" title="Madd Asli (2 Harakaat)">تَرْتِي</span><span class="tj-tanween" title="Madd Iwad (Stop on Tanween)">لًا</span>`,
    translationEn: "And recite the Quran with measured, clear recitation.",
    translationUr: "اور قرآنِ مجید کو خوب ٹھہر ٹھہر کر (واضح تجوید کے ساتھ) پڑھیے۔",
    ruleEn: "Focus: Raa Tafkheem/Tarqeeq, Lam Qamariyyah & Madd Iwad on stopping.",
    ruleUr: "تجویدی نکتہ: راء کی تفخیم و ترقیق، لامِ قمریہ اور وقف پر مدِّ عوض۔",
  },
  {
    surahEn: "Surah Al-Qamar (54:17)",
    surahUr: "سورۃ القمر (آیت 17)",
    audioFiles: ["054017.mp3"],
    arabicHtml: `وَلَقَ<span class="tj-qalqalah" title="Qalqalah Sugra">دْ</span> يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِ<span class="tj-idgham" title="Idgham bi-Ghunnah">ن مُّ</span>دَّكِرٍ`,
    translationEn: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
    translationUr: "اور بے شک ہم نے قرآن کو نصیحت اور یاد کرنے کے لیے آسان کر دیا ہے، تو کیا ہے کوئی نصیحت حاصل کرنے والا؟",
    ruleEn: "Focus: Qalqalah on Daal and Idgham bi-Ghunnah on Noon Saakin followed by Meem.",
    ruleUr: "تجویدی نکتہ: دال ساکن پر قلقلہ صغریٰ اور نون ساکن کے بعد میم پر ادغام مع الغنہ۔",
  },
  {
    surahEn: "Surah Al-Ikhlas (112:1–2)",
    surahUr: "سورۃ الاخلاص (آیات 1–2)",
    audioFiles: ["112001.mp3", "112002.mp3"],
    arabicHtml: `قُلْ هُوَ اللَّهُ أَحَ<span class="tj-qalqalah" title="Qalqalah Kubra">دٌ</span> ۝ اللَّهُ الصَّمَ<span class="tj-qalqalah" title="Qalqalah Kubra">دُ</span>`,
    translationEn: "Say, He is Allah, [who is] One. Allah, the Eternal Refuge.",
    translationUr: "کہہ دیجیے کہ وہ اللہ ایک ہے۔ اللہ بے نیاز ہے۔",
    ruleEn: "Focus: Heavy Lam in Lafz-ul-Jalalah and Qalqalah Kubra when stopping on Daal.",
    ruleUr: "تجویدی نکتہ: لفظِ اللہ کے لام کو پُر پڑھنا اور وقف کی صورت میں دال پر قلقلہ کبریٰ۔",
  },
];

const CURRENCY_RATES: Record<string, { symbol: string; labelEn: string; labelUr: string; basePerClass30: number }> = {
  GBP: { symbol: "£", labelEn: "UK (GBP £)", labelUr: "برطانیہ — پاؤنڈ (£)", basePerClass30: 3.4 },
  USD: { symbol: "$", labelEn: "USA (USD $)", labelUr: "امریکہ — ڈالر ($)", basePerClass30: 4.6 },
  EUR: { symbol: "€", labelEn: "Europe (EUR €)", labelUr: "یورپ — یورو (€)", basePerClass30: 4.1 },
  CAD: { symbol: "C$", labelEn: "Canada (CAD C$)", labelUr: "کینیڈا — کینیڈین ڈالر ($)", basePerClass30: 6.2 },
  AUD: { symbol: "A$", labelEn: "Australia (AUD A$)", labelUr: "آسٹریلیا — آسٹریلوی ڈالر ($)", basePerClass30: 7.0 },
  AED: { symbol: "AED ", labelEn: "UAE / Gulf (AED)", labelUr: "متحدہ عرب امارات — درہم", basePerClass30: 16.5 },
  PKR: { symbol: "Rs ", labelEn: "Pakistan (PKR ₨)", labelUr: "پاکستان — پاکستانی روپیہ", basePerClass30: 550 },
};

const content = {
  ur: {
    dir: "rtl",
    language: "اردو",
    other: "English",
    localePath: "/en",
    nav: ["کورسز", "تجوید اسٹوڈیو", "اساتذہ", "فیس کیلکولیٹر", "تصدیق", "رابطہ"],
    ids: ["courses", "tajweed-preview", "teachers", "pricing", "faq", "contact"],
    badge: "دنیا بھر کے طلبہ کے لیے پریمیم آن لائن قرآن اکیڈمی",
    titleA: "قرآنِ مجید سیکھیے",
    titleB: "تجوید، محبت اور اعتماد کے ساتھ",
    lead:
      "بچوں، خواتین اور بڑوں کے لیے مستند مرد و خواتین اساتذہ کے ساتھ انفرادی آن لائن کلاسز۔ محفوظ ماحول، ڈیجیٹل پورٹل ٹریکنگ اور آپ کے مقامی وقت کے مطابق قرآن سیکھنے کا جدید نظام۔",
    trial: "مفت ٹرائل کلاس بک کریں",
    whatsapp: "واٹس ایپ پر رابطہ",
    portal: "پورٹل ڈیش بورڈ",
    stats: [
      ["50+", "زیرِ تعلیم طلبہ"],
      ["5+", "مستند قراء و معلمات"],
      ["انفرادی", "براہِ راست لائیو کلاسز"],
      ["100%", "والدین پورٹل و ماہانہ رپورٹ"],
    ],
    coursesTitle: "ہر عمر اور ہر سطح کے لیے جامع قرآنی نصاب",
    coursesSub:
      "ابتدائی نورانی قاعدہ سے ناظرہ، حفظ، تجوید، ترجمہ و تفسیر، عربی اور بنیادی اسلامی تعلیمات تک مرحلہ وار نصاب۔",
    courses: [
      ["نورانی قاعدہ", "حروف، حرکات، جوڑ، مخارج اور درست تلفظ کی مضبوط بنیاد۔", "ابتدائی طلبہ اور بچوں کے لیے"],
      ["ناظرہ قرآن مع تجوید", "مخارج اور بنیادی تجوید کے ساتھ روانی سے قرآنِ مجید کی تلاوت۔", "قاعدہ مکمل کرنے والوں کے لیے"],
      ["تجوید و قراءات کورس", "قواعدِ تجوید، صفاتِ حروف، عملی مشق اور انفرادی تلاوت کی اصلاح۔", "تلاوت خوبصورت بنانے کے لیے"],
      ["حفظ القرآن الکریم", "منظم سبق، سبقی، منزل اور مسلسل نگرانی کے ساتھ پختہ حفظ۔", "بچوں اور بڑوں کے لیے"],
      ["ترجمہ و تفسیر القرآن", "منتخب سورتوں اور پورے قرآن کا آسان ترجمہ، مفہوم اور عملی تشریح۔", "فہمِ قرآن کے خواہش مندوں کے لیے"],
      ["نماز، سیرت و اسلامیات", "نماز، مسنون دعائیں، سیرت النبی ﷺ، عقیدہ اور روزمرہ اسلامی آداب۔", "بچوں اور خاندانوں کے لیے"],
    ],
    whyTitle: "والدین فاروقی اکیڈمی کو کیوں ترجیح دیتے ہیں؟",
    why: [
      ["مستند قراء و معلمات", "اجازہ یافتہ اور تجربہ کار مرد و خواتین اساتذہ، جو ہر طالب علم کی نفسیات اور رفتار کے مطابق پڑھاتے ہیں۔"],
      ["مکمل محفوظ ماحول", "انفرادی کلاس، خواتین و بچیوں کے لیے الگ معلمات اور والدین کے لیے براہِ راست نگرانی کی سہولت۔"],
      ["عالمی ٹائم زون سہولت", "پاکستان، برطانیہ، یورپ، امریکہ، کینیڈا، آسٹریلیا اور خلیجی ممالک کے مطابق لچکدار اوقات۔"],
      ["ڈیجیٹل پورٹل و ماہانہ رپورٹ", "ہر کلاس کا سبق، حاضری، ہوم ورک اور ماہانہ رپورٹ کارڈ آن لائن پورٹل میں دستیاب۔"],
      ["عملی تجوید و مخارج", "صرف پڑھانا نہیں بلکہ ہر آیت میں مخارج، غنہ، مد اور قلقلہ کی فوری عملی مشق۔"],
      ["3 دن مفت ٹرائل و اسسمنٹ", "داخلے سے پہلے استاد، طریقۂ تدریس اور کلاس سسٹم کا اطمینان بخش تجربہ۔"],
    ],
    processTitle: "داخلے کا سادہ 4 مرحلہ وار طریقۂ کار",
    steps: [
      ["آن لائن درخواست", "مختصر فارم یا واٹس ایپ کے ذریعے طالب علم کی بنیادی معلومات اور پسندیدہ وقت بھیجیں۔"],
      ["تعلیمی سطح کا جائزہ", "طالب علم کی عمر، موجودہ قرآنی سطح، مقصد اور موزوں اوقات کا جائزہ لیا جاتا ہے۔"],
      ["مفت ٹرائل کلاس", "مناسب مرد استاد یا خاتون معلمہ کے ساتھ عملی ٹرائل کلاس اور ابتدائی تعلیمی جائزہ۔"],
      ["باقاعدہ کلاس و پورٹل", "موزوں وقت، کورس اور ذاتی پورٹل اکاؤنٹ کے ساتھ باقاعدہ کلاسز کا آغاز۔"],
    ],
    teachersTitle: "ہمارے مستند اساتذہ اور معلمات",
    teachers: [
      ["قاری محمد فاروقی", "حافظ و قاری (10+ سال تجربہ)", "حفظ، تجوید، قراءات اور ناظرہ قرآن کے ماہر استاد۔ اردو، انگلش اور عربی۔"],
      ["عالمہ و قاریہ عائشہ", "فاضلہ و ماہرِ تجوید (7+ سال تجربہ)", "خواتین، بچیوں اور کم عمر بچوں کے لیے نورانی قاعدہ، تجوید اور ترجمہ۔"],
      ["قاری عبد الرحمٰن", "متخصص فی التجوید والحفظ", "سبق، سبقی، منزل اور مضبوط قرآنی دہرائی کے لیے ماہر استاد۔"],
      ["معلمہ حفصہ صدیقی", "ایم اے اسلامک اسٹڈیز و قاریہ", "بچوں کی اسلامی تربیت، مسنون دعائیں، سیرت النبی ﷺ اور قاعدہ۔"],
    ],
    teachersBadge: "مستند اور تربیت یافتہ اساتذہ",
    pricingTitle: "لچکدار فیس پلان اور انٹرایکٹو فیس کیلکولیٹر",
    plans: [
      ["بنیادی پلان", "ہفتے میں 2 دن (8 کلاسز / ماہ)", ["30 منٹ انفرادی لائیو کلاس", "نورانی قاعدہ / ناظرہ و اسلامیات", "ماہانہ ڈیجیٹل تعلیمی رپورٹ"]],
      ["مقبول پلان", "ہفتے میں 3 دن (12 کلاسز / ماہ)", ["30 منٹ انفرادی لائیو کلاس", "مخارج و تجوید کی خصوصی اصلاح", "والدین پورٹل رسائی اور ماہانہ تعلیمی رپورٹ"]],
      ["خصوصی و حفظ پلان", "ہفتے میں 5 دن (20 کلاسز / ماہ)", ["حفظِ قرآن یا تیز رفتار کورس", "روزانہ سبق، سبقی اور منزل ٹریکنگ", "ترجیحی اوقات، سرٹیفکیٹ اور کیو آر شناختی کارڈ"]],
    ],
    priceNote:
      "فیس ملک، کلاس کے دورانیے اور ہفتہ وار کلاسز کے مطابق مقرر کی جاتی ہے۔ ایک ہی خاندان کے دوسرے اور تیسرے بچے پر 10% تا 20% خصوصی رعایت دستیاب ہے۔",
    testimonialsTitle: "دنیا بھر سے والدین اور طلبہ کے تاثرات",
    testimonials: [
      ["طاہر محمود (مانچسٹر، برطانیہ)", "میرے دونوں بچے پچھلے ایک سال سے فاروقی اکیڈمی میں پڑھ رہے ہیں۔ قاری صاحب کا تجوید سکھانے کا انداز اور ماہانہ پورٹل رپورٹنگ واقعی قابلِ ستائش ہے۔"],
      ["سدرہ خان (ہیوسٹن، امریکہ)", "بحیثیتِ خاتون مجھے اپنی بچیوں کے لیے ایک باپردہ اور ماہر معلمہ کی تلاش تھی۔ معلمہ عائشہ نے بہت محبت اور صبر سے بچیوں کا قاعدہ مکمل کروایا۔"],
      ["عمران صدیقی (دبئی، یو اے ای)", "میری جاب کے اوقات بدلتے رہتے ہیں، لیکن اکیڈمی کے لچکدار شیڈول اور ری شیڈول سسٹم کی وجہ سے میرا ترجمہ و تجوید کورس بغیر تعطل کے جاری ہے۔"],
    ],
    faqTitle: "اکثر پوچھے گئے سوالات",
    faqs: [
      ["کلاسز کس سافٹ ویئر پر ہوتی ہیں؟", "تمام کلاسز زوم، گوگل میٹ، مائیکروسافٹ ٹیمز یا واٹس ایپ کے ذریعے طالب علم کی سہولت کے مطابق انفرادی طور پر لی جاتی ہیں، جہاں اسکرین شیئرنگ سے قرآنِ مجید کی آیات واضح نظر آتی ہیں۔"],
      ["کیا خواتین اور بچیوں کے لیے الگ خواتین معلمات موجود ہیں؟", "جی ہاں! الحمدللہ ہمارے پاس مستند، تجربہ کار اور شائستہ خواتین معلمات موجود ہیں جو صرف خواتین، بچیوں اور کم عمر بچوں کو پڑھاتی ہیں۔"],
      ["اگر کسی دن کلاس چھوٹ جائے تو کیا متبادل کلاس ملتی ہے؟", "جی ہاں، پیشگی اطلاع دینے پر آن لائن پورٹل کے ذریعے کلاس کا وقت تبدیل یا متبادل کلاس طے کی جاتی ہے۔"],
      ["فیس کی ادائیگی کیسے کی جاتی ہے؟", "مفت ٹرائل کلاسز سے مطمئن ہونے کے بعد آپ ماہانہ فیس بینک ٹرانسفر، وائز، ریمیٹلی، ویسٹرن یونین یا پاکستان میں جیز کیش اور ایزی پیسہ کے ذریعے ادا کر سکتے ہیں۔"],
    ],
    contactTitle: "آج ہی مفت ٹرائل کلاس بک کریں",
    contactSub:
      "مختصر فارم پُر کریں۔ آپ کی درخواست ہمارے ڈیٹا بیس میں محفوظ ہوگی اور واٹس ایپ پر بھی تیار شدہ پیغام کھل جائے گا۔",
    labels: {
      name: "طالب علم کا نام *",
      phone: "واٹس ایپ نمبر (مع کنٹری کوڈ) *",
      country: "ملک / شہر *",
      age: "عمر",
      course: "مطلوبہ کورس *",
      message: "پسندیدہ وقت یا اضافی تفصیل",
      submit: "مفت ٹرائل درخواست بھیجیں",
      select: "کورس منتخب کریں",
    },
    success: "الحمدللہ! آپ کی درخواست محفوظ ہوگئی ہے۔ واٹس ایپ کھل رہا ہے۔",
    footer:
      "فاروقی آن لائن قرآن اکیڈمی — بچوں، خواتین اور بڑوں کے لیے تجوید کے ساتھ معیاری آن لائن قرآن تعلیم۔",
    verseTranslation: "اور قرآن کو خوب ٹھہر ٹھہر کر پڑھیں۔ (سورۃ المزمل: 4)",
    miniList: [
      "انفرادی براہِ راست لائیو کلاسز",
      "مستند مرد و خواتین اساتذہ",
      "مفت تعلیمی جائزہ اور ٹرائل کلاس",
      "آن لائن پورٹل اور ماہانہ تعلیمی رپورٹ",
    ],
    freeTrialLabel: "مفت ٹرائل داخلہ",
    sectionLabel: "فاروقی قرآن اکیڈمی",
    topbar: "لاہور، پاکستان · دنیا بھر کے لیے آن لائن قرآن کلاسز",
  },
  en: {
    dir: "ltr",
    language: "English",
    other: "اردو",
    localePath: "/ur",
    nav: ["Courses", "Tajweed Studio", "Teachers", "Fee Calculator", "Verify ID", "Contact"],
    ids: ["courses", "tajweed-preview", "teachers", "pricing", "faq", "contact"],
    badge: "Premium online Quran education for learners worldwide",
    titleA: "Learn the Holy Quran",
    titleB: "with Tajweed, Care & Confidence",
    lead:
      "Private 1-to-1 online Quran classes for children, women and adults with certified male and female tutors. Safe environment, smart parent portal tracking and flexible scheduling around your local timezone.",
    trial: "Book a Free Trial",
    whatsapp: "Chat on WhatsApp",
    portal: "Portal Login",
    stats: [
      ["50+", "Active students"],
      ["5+", "Certified Qaris & Ustadhas"],
      ["1-to-1", "Private live classes"],
      ["100%", "Parent portal & PDF reports"],
    ],
    coursesTitle: "Comprehensive Quran & Islamic courses for every level",
    coursesSub:
      "A structured learning path from Noorani Qaida and Quran reading to Hifz, Tajweed, translation, Arabic and essential Islamic studies.",
    courses: [
      ["Noorani Qaida", "Build a rock-solid foundation in Arabic letters, vowels, joining and articulation points.", "For beginners & children"],
      ["Quran Reading with Tajweed", "Develop fluent recitation with correct makharij and applied Tajweed rules.", "After completing Qaida"],
      ["Tajweed & Qira'at Mastery", "Master Tajweed rules, sifaat and beauty of recitation with personal correction.", "For improving recitation"],
      ["Quran Memorization (Hifz)", "Structured Sabaq, Sabqi and Manzil retention plan with continuous supervision.", "For children & adults"],
      ["Translation & Tafsir", "Understand the divine message through clear translation and practical commentary.", "For deeper understanding"],
      ["Salah, Seerah & Islamic Studies", "Prayer, daily Sunnah duas, Prophetic Seerah, Aqeedah and Islamic manners.", "For kids & families"],
    ],
    whyTitle: "Why families worldwide trust Farooqi Academy",
    why: [
      ["Certified Male & Female Tutors", "Ijazah-holding and experienced male and female teachers who adapt to each student's pace."],
      ["Safe & Private 1-to-1 Classes", "Dedicated individual attention, female tutors for sisters/girls, and full parent visibility."],
      ["Global Timezone Scheduling", "Convenient timings tailored for UK, USA, Canada, Europe, Australia, UAE/Gulf and Pakistan."],
      ["Smart Portal & PDF Reports", "Track daily Sabaq, attendance, homework and downloadable monthly PDF report cards."],
      ["Practical Tajweed Focus", "Every session emphasizes accurate makharij, Ghunnah, Madd and Qalqalah in real time."],
      ["Free Trial & Assessment", "Experience our teaching methodology, tutor match and class system before paying a cent."],
    ],
    processTitle: "How enrollment works in 4 simple steps",
    steps: [
      ["Submit Request", "Share the learner's details and preferred timings via our form or WhatsApp."],
      ["Level Assessment", "We review age, current Quran level, goals and match the ideal male or female tutor."],
      ["Free Trial Class", "Attend a live 1-to-1 trial lesson with interactive screen-sharing and level evaluation."],
      ["Start & Track Progress", "Begin regular classes with full access to your Student & Parent Portal."],
    ],
    teachersTitle: "Meet our qualified teachers & Ustadhas",
    teachers: [
      ["Qari Muhammad Farooqi", "Head Qari & Hafiz (10+ Yrs Exp)", "Specialist in Hifz-ul-Quran, Advanced Tajweed & Qira'at. Speaks English, Urdu & Arabic."],
      ["Ustadha Aisha Siddiqua", "Alimah & Tajweed Specialist (7+ Yrs)", "Dedicated female tutor for sisters, girls and young children in Qaida, Tajweed & Tafsir."],
      ["Qari Abdur Rahman", "Hifz & Makharij Specialist", "Expert in structured Sabaq, Sabqi and Manzil retention for youth and adults."],
      ["Ustadha Hafsa Noor", "M.A. Islamic Studies & Qariyah", "Specializes in kids' Noorani Qaida, Salah, Duas and Prophetic Seerah."],
    ],
    teachersBadge: "Certified Male & Female Tutors",
    pricingTitle: "Transparent fee plans & interactive calculator",
    plans: [
      ["Essential Plan", "2 days / week (8 classes / mo)", ["30-min 1-to-1 live class", "Qaida, Reading or Islamic Studies", "Monthly Portal Progress Report"]],
      ["Popular Plan", "3 days / week (12 classes / mo)", ["30-min 1-to-1 live class", "Applied Tajweed & Makharij correction", "Parent Portal + Monthly PDF Report"]],
      ["Intensive / Hifz Plan", "5 days / week (20 classes / mo)", ["Hifz or accelerated Quran track", "Daily Sabaq, Sabqi & Manzil tracking", "Priority scheduling + Verified QR ID"]],
    ],
    priceNote:
      "Fees are tailored by region, class duration and weekly frequency. Enjoy an automatic 10% to 20% family discount when enrolling 2 or more siblings.",
    testimonialsTitle: "What parents & students say worldwide",
    testimonials: [
      ["Tahir Mahmood (Manchester, UK)", "Both my children have been studying with Farooqi Academy for over a year. Their Tajweed improvement and the monthly PDF reports on the Parent Portal are outstanding."],
      ["Sidra Khan (Houston, USA)", "As a mother, finding a patient, qualified female teacher for my daughters was my top priority. Ustadha Aisha made Noorani Qaida joyful and effortless."],
      ["Imran Siddiqui (Dubai, UAE)", "My work schedule shifts often, and the academy's flexible timing and portal reschedule system have allowed me to continue my Tajweed and Tafsir seamlessly."],
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      ["How are the online classes conducted?", "Classes are conducted live 1-to-1 via Zoom, Google Meet, Microsoft Teams or WhatsApp with high-definition Quran screen sharing and audio."],
      ["Do you have female teachers for sisters and young girls?", "Yes! We have dedicated, certified and experienced female tutors (Ustadhas) exclusively for women, girls and young children."],
      ["What happens if a student misses a class?", "With prior notice, teachers or parents can request a make-up or rescheduled slot directly through the Academy Portal."],
      ["How do we pay the monthly tuition fee?", "After completing your free trial class, you can pay securely via Bank Transfer, Wise, Remitly, Western Union or local Pakistan banking."],
    ],
    contactTitle: "Book your free trial class today",
    contactSub:
      "Complete the short form below. Your application is saved to our admissions portal and opens a ready-to-send WhatsApp confirmation.",
    labels: {
      name: "Student name *",
      phone: "WhatsApp number (with country code) *",
      country: "Country / City *",
      age: "Student age",
      course: "Preferred course *",
      message: "Preferred days/time or notes",
      submit: "Submit Free Trial Request",
      select: "Select a course",
    },
    success: "Alhamdulillah! Your request has been saved. Opening WhatsApp…",
    footer:
      "Farooqi Online Quran Academy — premium 1-to-1 online Quran learning with Tajweed for children, women and adults worldwide.",
    verseTranslation: "And recite the Quran with measured recitation. (Surah Al-Muzzammil: 4)",
    miniList: [
      "Private 1-to-1 live classes",
      "Certified male & female tutors",
      "Free assessment & trial lesson",
      "Smart Portal & monthly PDF reports",
    ],
    freeTrialLabel: "Free Trial Admission",
    sectionLabel: "Farooqi Quran Academy",
    topbar: "Lahore, Pakistan · Worldwide Online Quran Classes",
  },
} as const;

export default function AcademySite({ locale }: { locale: Locale }) {
  const t = content[locale];
  const isUrdu = locale === "ur";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  // Interactive Tajweed & World-Renowned Qari Audio state
  const [sampleIdx, setSampleIdx] = useState(0);
  const [selectedQari, setSelectedQari] = useState<QariId>("afasy");
  const [playingAudio, setPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Interactive Fee Calculator state
  const [currency, setCurrency] = useState<string>("GBP");
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [durationMin, setDurationMin] = useState<number>(30);
  const [studentsCount, setStudentsCount] = useState<number>(1);

  // Interactive FAQ & Student Verification state
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [verifyCode, setVerifyCode] = useState("");

  // Fee Calculation logic
  const currInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.GBP;
  const classesPerMonth = daysPerWeek * 4;
  const durationMultiplier = durationMin === 30 ? 1 : durationMin === 45 ? 1.4 : 1.75;
  const rawPerStudent = currInfo.basePerClass30 * classesPerMonth * durationMultiplier;
  const discountRate = studentsCount === 1 ? 0 : studentsCount === 2 ? 0.1 : studentsCount === 3 ? 0.15 : 0.2;
  const totalMonthly = Math.round(rawPerStudent * studentsCount * (1 - discountRate));
  const savedMonthly = Math.round(rawPerStudent * studentsCount * discountRate);

  function stopCurrentAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAudio(false);
  }

  function playRecitationSample(customSampleIndex?: number) {
    if (typeof window === "undefined") return;

    if (playingAudio && customSampleIndex === undefined) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();
    const targetIdx = customSampleIndex !== undefined ? customSampleIndex : sampleIdx;
    const sample = TAJWEED_SAMPLES[targetIdx];
    const qariObj = QARI_LIST.find((q) => q.id === selectedQari) || QARI_LIST[0];
    const urls = sample.audioFiles.map(
      (file) => `https://everyayah.com/data/${qariObj.folder}/${file}`
    );

    setPlayingAudio(true);
    let currentTrackIndex = 0;

    const playNextTrack = () => {
      if (currentTrackIndex >= urls.length) {
        setPlayingAudio(false);
        audioRef.current = null;
        return;
      }

      const audio = new Audio(urls[currentTrackIndex]);
      audioRef.current = audio;

      audio.onended = () => {
        currentTrackIndex += 1;
        playNextTrack();
      };

      audio.onerror = () => {
        // Fallback if offline
        try {
          if ("speechSynthesis" in window) {
            const plainArabic = sample.arabicHtml.replace(/<[^>]+>/g, "");
            const utter = new SpeechSynthesisUtterance(plainArabic);
            utter.lang = "ar-SA";
            utter.rate = 0.78;
            utter.onend = () => setPlayingAudio(false);
            utter.onerror = () => setPlayingAudio(false);
            window.speechSynthesis.speak(utter);
            return;
          }
        } catch {
          // ignore
        }
        setPlayingAudio(false);
      };

      audio.play().catch(() => {
        audio.onerror?.(new Event("error"));
      });
    };

    playNextTrack();
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(form.entries());
    payload.locale = locale;

    let appId = "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.id) appId = String(data.id);
    } catch {
      // Continue to WhatsApp fallback
    }

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923336519527";
    const lines = [
      isUrdu ? "السلام علیکم! نئی مفت ٹرائل درخواست:" : "Assalamu Alaikum! New Free Trial Request:",
      appId ? `Application ID: ${appId}` : "",
      `Student: ${payload.name || ""}`,
      `WhatsApp: ${payload.phone || ""}`,
      `Country/City: ${payload.country || ""}`,
      `Age: ${payload.age || "—"}`,
      `Course: ${payload.course || ""}`,
      `Notes: ${payload.message || "—"}`,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus(t.success);
    setBusy(false);

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(lines)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleVerifySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleaned = verifyCode.trim();
    if (!cleaned) return;
    router.push(`/verify/${encodeURIComponent(cleaned)}`);
  }

  const currentSample = TAJWEED_SAMPLES[sampleIdx];
  const activeQariObj = QARI_LIST.find((q) => q.id === selectedQari) || QARI_LIST[0];

  return (
    <div dir={t.dir} lang={locale} className={isUrdu ? "urdu" : "english"}>
      <a className="skip-link" href="#main">
        {isUrdu ? "اصل مواد پر جائیں" : "Skip to content"}
      </a>

      <div className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-tagline">
            <i className="topbar-dot" aria-hidden="true" />
            {t.topbar}
          </span>
          <div className="topbar-contacts">
            <a href="tel:+923336519527">☎ 0333-6519527</a>
            <a href="tel:+923344323994">☎ 0334-4323994</a>
            <a href="mailto:umarwazir1989@gmail.com">✉ umarwazir1989@gmail.com</a>
          </div>
        </div>
      </div>

      <header>
        <div className="wrap nav">
          <Link href={`/${locale}`} className="brand">
            <div className="brand-logo-frame">
              <Image
                src="/logo.jpg"
                alt="Farooqi Online Quran Academy logo"
                width={50}
                height={50}
                priority
              />
            </div>
            <span>
              <strong>
                {isUrdu
                  ? "فاروقی آن لائن قرآن اکیڈمی"
                  : "Farooqi Online Quran Academy"}
              </strong>
              <small>{isUrdu ? "لاہور · پاکستان" : "Lahore · Pakistan"}</small>
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
            <Link className="nav-pill-link" href={`/${locale}/courses`} onClick={() => setOpen(false)}>
              {isUrdu ? "12 کورسز" : "12 Courses"}
            </Link>
            <Link className="portal-mobile" href="/portal" onClick={() => setOpen(false)}>
              {t.portal}
            </Link>
            <Link className="language-mobile" href={t.localePath} onClick={() => setOpen(false)}>
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
            <Link className="btn btn-gold btn-small" href={`/${locale}/free-trial`}>
              {t.trial}
            </Link>
            <button
              className="menu"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle navigation"
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-content">
              <span className="eyebrow">
                <b className="eyebrow-star" aria-hidden="true">✦</b> {t.badge}
              </span>
              <h1>
                {t.titleA}
                <em>{t.titleB}</em>
              </h1>
              <p className="lead">{t.lead}</p>

              <div className="hero-actions">
                <Link className="btn" href={`/${locale}/free-trial`}>
                  {t.trial}
                </Link>
                <a className="btn btn-gold" href="#pricing">
                  {isUrdu ? "فیس کیلکولیٹر دیکھیں" : "Calculate Monthly Fee"}
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
                  <div key={l} className="stat-box">
                    <strong>{n}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-topbar">
                <span className="hero-surah-pill">
                  {isUrdu ? "سورۃ المزمل · آیت 4" : "Surah Al-Muzzammil · 73:4"}
                </span>
                <span className="hero-live-pill">
                  <i className="live-dot" aria-hidden="true" />
                  {isUrdu ? "انفرادی لائیو کلاسز" : "1-to-1 Live Sessions"}
                </span>
              </div>

              <div className="hero-verse-frame">
                <div className="hero-card-badge">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <div className="arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
                <p className="hero-verse-translation">{t.verseTranslation}</p>
                <button
                  type="button"
                  className="hero-audio-btn"
                  onClick={() => {
                    setSampleIdx(0);
                    playRecitationSample(0);
                  }}
                >
                  {playingAudio && sampleIdx === 0
                    ? isUrdu
                      ? "⏸ تلاوت روکیں (شیخ مشاری العفاسی)"
                      : "⏸ Pause Recitation (Sheikh Alafasy)"
                    : isUrdu
                    ? "🔊 دلنشین تلاوت سنیں (شیخ مشاری العفاسی)"
                    : "🔊 Listen to Soulful Recitation (Sheikh Alafasy)"}
                </button>
              </div>

              <div className="mini-list">
                {t.miniList.map((item) => (
                  <div key={item} className="mini-list-item">
                    <span className="mini-check" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="hero-card-links">
                <Link href={`/${locale}/courses`}>
                  {isUrdu ? "مکمل نصاب (12 کورسز) ←" : "Explore All 12 Courses →"}
                </Link>
                <Link href={`/${locale}/fees`}>
                  {isUrdu ? "مکمل فیس شیڈول ←" : "Full Tuition Schedule →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* COURSES SECTION */}
        <section id="courses">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.coursesTitle}
              text={t.coursesSub}
            />
            <div className="cards">
              {t.courses.map(([name, desc, badge], i) => (
                <article className="card" key={name}>
                  <div className="card-top-meta">
                    <span className="number">0{i + 1}</span>
                    <span className="course-audience-pill">{badge}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                  <div className="card-footer-row">
                    <Link className="text-link" href={`/${locale}/free-trial`}>
                      {isUrdu ? "اس کورس کا مفت ٹرائل لیں ←" : "Start Free Trial →"}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="section-cta-bar">
              <div>
                <strong>
                  {isUrdu ? "مکمل 12 کورسز کا نصاب اور تفصیل" : "Complete Catalog of 12 Specialized Tracks"}
                </strong>
                <p>
                  {isUrdu
                    ? "قرآن، حدیث، سیرت النبی ﷺ، فقہ اور عربی سمیت تمام 12 کورسز کی تفصیل دیکھیے۔"
                    : "Explore detailed syllabi for Quran, Hadith, Prophetic Seerah, Fiqh and Arabic."}
                </p>
              </div>
              <Link className="btn btn-gold" href={`/${locale}/courses`}>
                {isUrdu ? "تمام 12 کورسز دیکھیں" : "View All 12 Courses"}
              </Link>
            </div>
          </div>
        </section>

        {/* INTERACTIVE TAJWEED & WORLD-RENOWNED QARI RECITATION STUDIO */}
        <section id="tajweed-preview" className="soft">
          <div className="wrap">
            <SectionHead
              label={isUrdu ? "عملی تجوید و عالمی قراء کی تلاوت" : "Interactive Tajweed & Recitation Studio"}
              title={
                isUrdu
                  ? "عالمی شہرت یافتہ قراء کی دلنشین آواز اور رنگین قواعدِ تجوید"
                  : "Soulful Recitation by World-Renowned Qaris & Color-Coded Tajweed"
              }
              text={
                isUrdu
                  ? "اپنے پسندیدہ قاری (شیخ مشاری العفاسی، شیخ محمود خلیل الحصری یا شیخ عبدالرحمٰن السدیس) کا انتخاب کریں اور رنگین تجویدی قواعد کے ساتھ دل کو چھو لینے والی تلاوت سنیں۔"
                  : "Select your preferred world-renowned Qari (Sheikh Mishary Alafasy, Sheikh Al-Husary or Sheikh As-Sudais) and experience crystal-clear recitation with visual Tajweed rules."
              }
            />

            <div className="tajweed-showcase">
              {/* Qari Selector Bar */}
              <div className="qari-selector-bar">
                <span className="qari-selector-label">
                  🎙️ {isUrdu ? "قاری منتخب کریں:" : "Select Reciter (Qari):"}
                </span>
                <div className="qari-pills">
                  {QARI_LIST.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      className={selectedQari === q.id ? "qari-pill active" : "qari-pill"}
                      onClick={() => {
                        stopCurrentAudio();
                        setSelectedQari(q.id);
                      }}
                    >
                      {isUrdu ? q.nameUr : q.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tajweed-tabs">
                {TAJWEED_SAMPLES.map((s, idx) => (
                  <button
                    key={s.surahEn}
                    type="button"
                    className={sampleIdx === idx ? "tj-tab active" : "tj-tab"}
                    onClick={() => {
                      stopCurrentAudio();
                      setSampleIdx(idx);
                    }}
                  >
                    {isUrdu ? s.surahUr : s.surahEn}
                  </button>
                ))}
              </div>

              <div className="tajweed-display">
                <div
                  className="tajweed-verse"
                  dangerouslySetInnerHTML={{ __html: currentSample.arabicHtml }}
                />
                <p className="tajweed-translation">
                  {isUrdu ? currentSample.translationUr : currentSample.translationEn}
                </p>
                <div className="tajweed-rule-box">
                  <strong>{isUrdu ? currentSample.ruleUr : currentSample.ruleEn}</strong>
                </div>

                <div className="tajweed-legend-row">
                  <div className="tj-legend-items">
                    <span><i className="dot-qalqalah" /> {isUrdu ? "قلقلہ (آواز کی گونج)" : "Qalqalah (Echo)"}</span>
                    <span><i className="dot-idgham" /> {isUrdu ? "ادغام و غنہ (ناک میں آواز)" : "Idgham & Ghunnah"}</span>
                    <span><i className="dot-madd" /> {isUrdu ? "مد (آواز کو کھینچنا)" : "Madd (Elongation)"}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-gold btn-small"
                    onClick={() => playRecitationSample()}
                  >
                    {playingAudio
                      ? isUrdu
                        ? `⏸ تلاوت روکیں (${activeQariObj.nameUr})`
                        : `⏸ Stop Recitation (${activeQariObj.nameEn})`
                      : isUrdu
                      ? `🔊 تلاوت سنیں — ${activeQariObj.nameUr}`
                      : `🔊 Listen — ${activeQariObj.nameEn}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
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
                  <span className="feature-icon">✦</span>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="process">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.processTitle}
              text=""
            />
            <div className="steps">
              {t.steps.map(([a, b], i) => (
                <article key={a} className="step-card">
                  <strong>0{i + 1}</strong>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TEACHERS SECTION */}
        <section id="teachers" className="soft">
          <div className="wrap">
            <SectionHead
              label={t.teachersBadge}
              title={t.teachersTitle}
              text=""
            />
            <div className="teacher-grid">
              {t.teachers.map(([name, role, bio]) => (
                <article key={name} className="teacher-profile-card">
                  <div className="avatar">◈</div>
                  <h3>{name}</h3>
                  <span className="teacher-role-tag">{role}</span>
                  <p>{bio}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING & INTERACTIVE FEE CALCULATOR */}
        <section id="pricing">
          <div className="wrap">
            <SectionHead
              label={t.sectionLabel}
              title={t.pricingTitle}
              text={t.priceNote}
            />

            {/* Interactive Fee Calculator */}
            <div className="fee-calculator-card">
              <div className="calc-controls">
                <h3>
                  {isUrdu
                    ? "اپنی ماہانہ فیس اور فیملی ڈسکاؤنٹ کا حساب لگائیں"
                    : "Interactive Monthly Tuition & Family Discount Calculator"}
                </h3>

                <div className="calc-grid">
                  <label>
                    {isUrdu ? "ملک / کرنسی منتخب کریں" : "Select Country / Currency"}
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      {Object.entries(CURRENCY_RATES).map(([code, info]) => (
                        <option key={code} value={code}>
                          {isUrdu ? info.labelUr : info.labelEn}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    {isUrdu ? "ہفتہ وار کلاسز" : "Classes per Week"}
                    <select
                      value={daysPerWeek}
                      onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    >
                      <option value={2}>{isUrdu ? "ہفتے میں 2 دن (8 کلاسز/ماہ)" : "2 Days / Week (8 classes/mo)"}</option>
                      <option value={3}>{isUrdu ? "ہفتے میں 3 دن (12 کلاسز/ماہ)" : "3 Days / Week (12 classes/mo)"}</option>
                      <option value={5}>{isUrdu ? "ہفتے میں 5 دن (20 کلاسز/ماہ)" : "5 Days / Week (20 classes/mo)"}</option>
                      <option value={6}>{isUrdu ? "ہفتے میں 6 دن (24 کلاسز/ماہ)" : "6 Days / Week (24 classes/mo)"}</option>
                    </select>
                  </label>

                  <label>
                    {isUrdu ? "کلاس کا دورانیہ" : "Class Duration"}
                    <select
                      value={durationMin}
                      onChange={(e) => setDurationMin(Number(e.target.value))}
                    >
                      <option value={30}>{isUrdu ? "30 منٹ (معیاری انفرادی کلاس)" : "30 Minutes (Standard 1-to-1)"}</option>
                      <option value={45}>{isUrdu ? "45 منٹ (تفصیلی کلاس)" : "45 Minutes (Extended 1-to-1)"}</option>
                      <option value={60}>{isUrdu ? "60 منٹ (حفظ / ایڈوانسڈ)" : "60 Minutes (Hifz / Intensive)"}</option>
                    </select>
                  </label>

                  <label>
                    {isUrdu ? "طلبہ کی تعداد (فیملی ڈسکاؤنٹ)" : "Number of Students (Family Discount)"}
                    <select
                      value={studentsCount}
                      onChange={(e) => setStudentsCount(Number(e.target.value))}
                    >
                      <option value={1}>{isUrdu ? "1 طالب علم" : "1 Student"}</option>
                      <option value={2}>{isUrdu ? "2 بہن بھائی (10% رعایت)" : "2 Siblings (10% Family Discount)"}</option>
                      <option value={3}>{isUrdu ? "3 بہن بھائی (15% رعایت)" : "3 Siblings (15% Family Discount)"}</option>
                      <option value={4}>{isUrdu ? "4 بہن بھائی (20% رعایت)" : "4 Siblings (20% Family Discount)"}</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="calc-summary">
                <span className="calc-badge">
                  {isUrdu ? "تخمینی ماہانہ فیس" : "Estimated Monthly Tuition"}
                </span>
                <div className="calc-price">
                  {currInfo.symbol}
                  {totalMonthly.toLocaleString()}
                  <small> / {isUrdu ? "ماہ" : "month"}</small>
                </div>
                <p className="calc-detail">
                  {isUrdu
                    ? `${classesPerMonth * studentsCount} انفرادی کلاسز فی ماہ · ${durationMin} منٹ فی کلاس`
                    : `${classesPerMonth * studentsCount} private classes/month · ${durationMin} mins each`}
                </p>
                {savedMonthly > 0 && (
                  <div className="calc-savings">
                    {isUrdu
                      ? `🎉 فیملی ڈسکاؤنٹ کی مد میں ماہانہ بچت: ${currInfo.symbol}${savedMonthly.toLocaleString()}`
                      : `🎉 Family Discount Applied: You save ${currInfo.symbol}${savedMonthly.toLocaleString()}/mo`}
                  </div>
                )}
                <Link className="btn btn-gold" href={`/${locale}/free-trial`}>
                  {t.trial}
                </Link>
              </div>
            </div>

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
                  <Link
                    className={i === 1 ? "btn btn-gold" : "btn btn-outline"}
                    href={`/${locale}/free-trial`}
                  >
                    {t.trial}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PARENT TESTIMONIALS */}
        <section className="soft">
          <div className="wrap">
            <SectionHead
              label={isUrdu ? "والدین کا اعتماد" : "Parent Reviews"}
              title={t.testimonialsTitle}
              text=""
            />
            <div className="cards">
              {t.testimonials.map(([author, quote]) => (
                <article className="card testimonial-card" key={author}>
                  <div className="stars">★★★★★</div>
                  <p>“{quote}”</p>
                  <strong>— {author}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ & STUDENT CERTIFICATE VERIFICATION */}
        <section id="faq">
          <div className="wrap faq-verify-grid">
            <div>
              <SectionHead
                label={isUrdu ? "رہنمائی" : "FAQ"}
                title={t.faqTitle}
                text=""
              />
              <div className="faq-list">
                {t.faqs.map(([q, a], idx) => (
                  <div
                    key={q}
                    className={openFaq === idx ? "faq-item open" : "faq-item"}
                  >
                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    >
                      <span>{q}</span>
                      <b>{openFaq === idx ? "−" : "+"}</b>
                    </button>
                    {openFaq === idx && <p className="faq-answer">{a}</p>}
                  </div>
                ))}
              </div>
            </div>

            <aside className="verify-widget-card">
              <span className="eyebrow">
                {isUrdu ? "تصدیقی نظام" : "Instant Verification"}
              </span>
              <h3>
                {isUrdu
                  ? "طالب علم کا کارڈ یا سرٹیفکیٹ تصدیق کریں"
                  : "Verify Student ID Card or Certificate"}
              </h3>
              <p>
                {isUrdu
                  ? "طالب علم کے کارڈ یا سرٹیفکیٹ پر درج کوڈ (مثلاً FQV-... یا FQA-...) درج کر کے ریکارڈ کی آن لائن تصدیق کریں۔"
                  : "Enter the verification code or Student ID printed on an academy certificate or QR ID card."}
              </p>
              <form onSubmit={handleVerifySubmit} className="verify-widget-form">
                <input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder={isUrdu ? "کوڈ درج کریں (مثلاً FQA-1042)" : "Enter code (e.g. FQA-1042)"}
                  required
                />
                <button type="submit" className="btn btn-gold">
                  {isUrdu ? "تصدیق کریں" : "Verify Now"}
                </button>
              </form>
            </aside>
          </div>
        </section>

        {/* CONTACT & QUICK TRIAL FORM */}
        <section id="contact">
          <div className="wrap contact">
            <div>
              <span className="eyebrow">{t.freeTrialLabel}</span>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactSub}</p>
              <div className="contact-lines">
                <a href="tel:+923336519527">{isUrdu ? "☎ 0333-6519527 (واٹس ایپ اور کال)" : "☎ 0333-6519527 (WhatsApp & Call)"}</a>
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
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                {t.labels.message}
                <textarea name="message" rows={3} />
              </label>

              <button className="btn btn-gold" type="submit" disabled={busy}>
                {busy
                  ? isUrdu ? "محفوظ ہو رہا ہے…" : "Saving…"
                  : t.labels.submit}
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
            <div className="brand-logo-frame">
              <Image src="/logo.jpg" alt="" width={46} height={46} />
            </div>
            <span>
              <strong>
                {isUrdu
                  ? "فاروقی آن لائن قرآن اکیڈمی"
                  : "Farooqi Online Quran Academy"}
              </strong>
              <small>{isUrdu ? "لاہور · پاکستان" : "Lahore · Pakistan"}</small>
            </span>
          </div>
          <p>{t.footer}</p>
          <p>{isUrdu ? `© ${new Date().getFullYear()} فاروقی آن لائن قرآن اکیڈمی · جملہ حقوق محفوظ ہیں` : `© ${new Date().getFullYear()} Farooqi Online Quran Academy`}</p>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href="https://wa.me/923336519527"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.625.846 5.059 2.284 7.033l-1.492 5.448 5.601-1.469c1.912 1.044 4.103 1.638 6.433 1.638 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
        </svg>
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
      <span className="eyebrow">
        <b className="eyebrow-star" aria-hidden="true">✦</b> {label}
      </span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
