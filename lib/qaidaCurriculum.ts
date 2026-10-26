export type QaidaLesson = {
  slug: string;
  number: number;
  titleEn: string;
  titleUr: string;
  descriptionUr: string;
  items: Array<{
    text: string;
    hintUr: string;
    audioKey?: string;
  }>;
};

export const QAIDA_LESSONS: QaidaLesson[] = [
  {
    slug: "letters-01",
    number: 1,
    titleEn: "Arabic Letters",
    titleUr: "مفرد حروف",
    descriptionUr: "حروف کی بنیادی پہچان اور صحیح نام۔",
    items: [
      { text: "ا", hintUr: "الف", audioKey: "alif" },
      { text: "ب", hintUr: "باء", audioKey: "baa" },
      { text: "ت", hintUr: "تاء", audioKey: "taa" },
      { text: "ث", hintUr: "ثاء", audioKey: "thaa" },
      { text: "ج", hintUr: "جیم", audioKey: "jeem" },
      { text: "ح", hintUr: "حاء", audioKey: "haa_halq" },
      { text: "خ", hintUr: "خاء", audioKey: "khaa" },
    ],
  },
  {
    slug: "letters-02",
    number: 2,
    titleEn: "Arabic Letters II",
    titleUr: "مفرد حروف — حصہ دوم",
    descriptionUr: "مزید حروف کی پہچان اور امتیاز۔",
    items: [
      { text: "د", hintUr: "دال", audioKey: "daal" },
      { text: "ذ", hintUr: "ذال", audioKey: "dhaal" },
      { text: "ر", hintUr: "راء", audioKey: "raa" },
      { text: "ز", hintUr: "زائے", audioKey: "zay" },
      { text: "س", hintUr: "سین", audioKey: "seen" },
      { text: "ش", hintUr: "شین", audioKey: "sheen" },
      { text: "ص", hintUr: "صاد", audioKey: "saad" },
    ],
  },
  {
    slug: "letters-03",
    number: 3,
    titleEn: "Arabic Letters III",
    titleUr: "مفرد حروف — حصہ سوم",
    descriptionUr: "بھاری اور مشابہ حروف کی پہچان۔",
    items: [
      { text: "ض", hintUr: "ضاد", audioKey: "daad" },
      { text: "ط", hintUr: "طاء", audioKey: "taa_heavy" },
      { text: "ظ", hintUr: "ظاء", audioKey: "zaa_heavy" },
      { text: "ع", hintUr: "عین", audioKey: "ain" },
      { text: "غ", hintUr: "غین", audioKey: "ghain" },
      { text: "ف", hintUr: "فاء", audioKey: "faa" },
      { text: "ق", hintUr: "قاف", audioKey: "qaaf" },
    ],
  },
  {
    slug: "letters-04",
    number: 4,
    titleEn: "Arabic Letters IV",
    titleUr: "مفرد حروف — حصہ چہارم",
    descriptionUr: "باقی حروف اور مکمل alphabet review۔",
    items: [
      { text: "ك", hintUr: "کاف", audioKey: "kaaf" },
      { text: "ل", hintUr: "لام", audioKey: "laam" },
      { text: "م", hintUr: "میم", audioKey: "meem" },
      { text: "ن", hintUr: "نون", audioKey: "noon" },
      { text: "و", hintUr: "واو", audioKey: "waaw" },
      { text: "ه", hintUr: "ہاء", audioKey: "haa" },
      { text: "ي", hintUr: "یاء", audioKey: "yaa" },
    ],
  },
  {
    slug: "joined-forms",
    number: 5,
    titleEn: "Joined Letter Forms",
    titleUr: "مرکب حروف",
    descriptionUr: "حروف کی ابتدائی، درمیانی اور آخری شکلوں کی پہچان۔",
    items: [
      { text: "بـ ـبـ ـب", hintUr: "باء کی مختلف شکلیں" },
      { text: "تـ ـتـ ـت", hintUr: "تاء کی مختلف شکلیں" },
      { text: "سـ ـسـ ـس", hintUr: "سین کی مختلف شکلیں" },
      { text: "عـ ـعـ ـع", hintUr: "عین کی مختلف شکلیں" },
    ],
  },
  {
    slug: "harakat",
    number: 6,
    titleEn: "Fatha Kasra Damma",
    titleUr: "زبر، زیر، پیش",
    descriptionUr: "حرکات کو حرف کے ساتھ مختصر آواز میں پڑھنا۔",
    items: [
      { text: "بَ", hintUr: "باء زبر: مختصر آواز", audioKey: "baa_fatha" },
      { text: "بِ", hintUr: "باء زیر: مختصر آواز", audioKey: "baa_kasra" },
      { text: "بُ", hintUr: "باء پیش: مختصر آواز", audioKey: "baa_damma" },
      { text: "ضَ", hintUr: "ضاد زبر", audioKey: "daad_fatha" },
    ],
  },
  {
    slug: "sukoon",
    number: 7,
    titleEn: "Sukoon",
    titleUr: "جزم / سکون",
    descriptionUr: "ساکن حرف کو پچھلی حرکت کے ساتھ ملا کر پڑھنا۔",
    items: [
      { text: "أَبْ", hintUr: "اَبْ — درمیان میں وقفہ نہ کریں", audioKey: "ab_sukoon" },
      { text: "إِبْ", hintUr: "اِبْ — زیر مختصر رہے", audioKey: "ib_sukoon" },
      { text: "أُبْ", hintUr: "اُبْ — پیش مختصر رہے", audioKey: "ub_sukoon" },
    ],
  },
  {
    slug: "tanween",
    number: 8,
    titleEn: "Tanween",
    titleUr: "تنوین",
    descriptionUr: "دو زبر، دو زیر اور دو پیش کے ساتھ نون کی خفیف آواز۔",
    items: [
      { text: "بً", hintUr: "دو زبر", audioKey: "baa_tanween_fath" },
      { text: "بٍ", hintUr: "دو زیر", audioKey: "baa_tanween_kasr" },
      { text: "بٌ", hintUr: "دو پیش", audioKey: "baa_tanween_damm" },
    ],
  },
  {
    slug: "shaddah",
    number: 9,
    titleEn: "Shaddah",
    titleUr: "تشدید",
    descriptionUr: "مشدد حرف کو دو حرفوں کے حکم کے ساتھ پڑھنا۔",
    items: [
      { text: "بَّ", hintUr: "پہلا ب ساکن، دوسرا متحرک", audioKey: "baa_shaddah" },
      { text: "رَّ", hintUr: "راء مشدد", audioKey: "raa_shaddah" },
    ],
  },
  {
    slug: "madd",
    number: 10,
    titleEn: "Madd",
    titleUr: "حروفِ مد",
    descriptionUr: "الف، واو اور یاء مدی کی صحیح مقدار کے ساتھ مشق۔",
    items: [
      { text: "بَا", hintUr: "باء زبر + الف", audioKey: "baa_madd_alif" },
      { text: "بُو", hintUr: "باء پیش + واو", audioKey: "baa_madd_waaw" },
      { text: "بِي", hintUr: "باء زیر + یاء", audioKey: "baa_madd_yaa" },
    ],
  },
  {
    slug: "qalqalah",
    number: 11,
    titleEn: "Qalqalah",
    titleUr: "قلقلہ",
    descriptionUr: "قطب جد کے ساکن حروف میں bounce کی مشق۔",
    items: [
      { text: "أَقْ", hintUr: "قاف ساکن", audioKey: "aq_qalqalah" },
      { text: "أَبْ", hintUr: "باء ساکن", audioKey: "ab_qalqalah" },
    ],
  },
  {
    slug: "ghunnah",
    number: 12,
    titleEn: "Ghunnah",
    titleUr: "غنہ",
    descriptionUr: "نون و میم مشدد اور متعلقہ مقامات پر ناک کی آواز کی مشق۔",
    items: [
      { text: "إِنَّ", hintUr: "نون مشدد کے ساتھ غنہ", audioKey: "inna" },
      { text: "ثُمَّ", hintUr: "میم مشدد کے ساتھ غنہ", audioKey: "thumma" },
    ],
  },
  {
    slug: "ikhfa-izhar",
    number: 13,
    titleEn: "Ikhfa & Izhar",
    titleUr: "اخفاء و اظہار",
    descriptionUr: "نون ساکن و تنوین کے بنیادی قواعد۔",
    items: [
      { text: "مِنْ قَبْلِ", hintUr: "اخفاء کی مثال" },
      { text: "مِنْ هَادٍ", hintUr: "اظہار کی مثال" },
    ],
  },
  {
    slug: "idgham-iqlab",
    number: 14,
    titleEn: "Idgham & Iqlab",
    titleUr: "ادغام و اقلاب",
    descriptionUr: "نون ساکن و تنوین کے ادغام اور اقلاب کی بنیادی پہچان۔",
    items: [
      { text: "مِنْ رَبِّهِمْ", hintUr: "ادغام کی مثال" },
      { text: "سَمِيعٌ بَصِيرٌ", hintUr: "اقلاب کی مثال" },
    ],
  },
  {
    slug: "laam-ra",
    number: 15,
    titleEn: "Laam & Raa",
    titleUr: "لام اور راء کے قواعد",
    descriptionUr: "لفظ اللہ اور راء کی تفخیم و ترقیق کی ابتدائی مشق۔",
    items: [
      { text: "اللّٰه", hintUr: "لامِ جلالہ کا حکم سیاق سے پہچانیں" },
      { text: "رَبِّ", hintUr: "راء کی ادائیگی" },
    ],
  },
  {
    slug: "waqf",
    number: 16,
    titleEn: "Waqf",
    titleUr: "وقف",
    descriptionUr: "آیت کے آخر اور مختلف علاماتِ وقف پر صحیح رکنے کی مشق۔",
    items: [
      { text: "الْعَالَمِينَ", hintUr: "وقف کی صورت میں آخری حرکت ساقط ہوگی" },
      { text: "الرَّحِيمِ", hintUr: "وقف کے ساتھ مشق" },
    ],
  },
  {
    slug: "practice",
    number: 17,
    titleEn: "Integrated Practice",
    titleUr: "جامع مشق",
    descriptionUr: "قاعدہ کے بنیادی اصولوں کو مختصر قرآنی مثالوں میں جمع کر کے پڑھنا۔",
    items: [
      { text: "بِسْمِ اللَّهِ", hintUr: "حرکات، ساکن اور لامِ جلالہ کی مشق" },
      { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", hintUr: "مخارج، وقف اور روانی کی مشق" },
    ],
  },
];

export function getQaidaLesson(slug: string) {
  return QAIDA_LESSONS.find((lesson) => lesson.slug === slug);
}
