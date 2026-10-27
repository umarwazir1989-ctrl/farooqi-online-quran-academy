export type Locale = "ur" | "en";

export interface TeacherInfo {
  name: string;
  qualification: string;
  role: string;
  experience: string;
  bio: string;
  specialties: string[];
}

export interface CourseOutlineModule {
  title: string;
  topics: string[];
}

export interface CourseDetail {
  code: string;
  name: string;
  shortDesc: string;
  audience: string;
  duration: string;
  sessions: string;
  track: "quran" | "islamic" | "advanced";
  modules: CourseOutlineModule[];
  outcomes: string[];
  prerequisites: string;
}

export interface SurahMeta {
  number: number;
  nameAr: string;
  nameEn: string;
  nameUr: string;
  ayahs: number;
  type: "Makki" | "Madani";
}

export const QURAN_SURAHS: SurahMeta[] = [
  { number: 1, nameAr: "الفاتحة", nameEn: "Al-Fatihah", nameUr: "سورۃ الفاتحہ", ayahs: 7, type: "Makki" },
  { number: 2, nameAr: "البقرة", nameEn: "Al-Baqarah", nameUr: "سورۃ البقرہ", ayahs: 286, type: "Madani" },
  { number: 3, nameAr: "آل عمران", nameEn: "Ali 'Imran", nameUr: "سورۃ آل عمران", ayahs: 200, type: "Madani" },
  { number: 4, nameAr: "النساء", nameEn: "An-Nisa", nameUr: "سورۃ النساء", ayahs: 176, type: "Madani" },
  { number: 5, nameAr: "المائدة", nameEn: "Al-Ma'idah", nameUr: "سورۃ المائدہ", ayahs: 120, type: "Madani" },
  { number: 6, nameAr: "الأنعام", nameEn: "Al-An'am", nameUr: "سورۃ الانعام", ayahs: 165, type: "Makki" },
  { number: 7, nameAr: "الأعراف", nameEn: "Al-A'raf", nameUr: "سورۃ الاعراف", ayahs: 206, type: "Makki" },
  { number: 8, nameAr: "الأنفال", nameEn: "Al-Anfal", nameUr: "سورۃ الانفال", ayahs: 75, type: "Madani" },
  { number: 9, nameAr: "التوبة", nameEn: "At-Tawbah", nameUr: "سورۃ التوبہ", ayahs: 129, type: "Madani" },
  { number: 10, nameAr: "يونس", nameEn: "Yunus", nameUr: "سورۃ یونس", ayahs: 109, type: "Makki" },
  { number: 11, nameAr: "هود", nameEn: "Hud", nameUr: "سورۃ ہود", ayahs: 123, type: "Makki" },
  { number: 12, nameAr: "يوسف", nameEn: "Yusuf", nameUr: "سورۃ یوسف", ayahs: 111, type: "Makki" },
  { number: 13, nameAr: "الرعد", nameEn: "Ar-Ra'd", nameUr: "سورۃ الرعد", ayahs: 43, type: "Madani" },
  { number: 14, nameAr: "إبراهيم", nameEn: "Ibrahim", nameUr: "سورۃ ابراہیم", ayahs: 52, type: "Makki" },
  { number: 15, nameAr: "الحجر", nameEn: "Al-Hijr", nameUr: "سورۃ الحجر", ayahs: 99, type: "Makki" },
  { number: 16, nameAr: "النحل", nameEn: "An-Nahl", nameUr: "سورۃ النحل", ayahs: 128, type: "Makki" },
  { number: 17, nameAr: "الإسراء", nameEn: "Al-Isra", nameUr: "سورۃ بنی اسرائیل (الاسراء)", ayahs: 111, type: "Makki" },
  { number: 18, nameAr: "الكهف", nameEn: "Al-Kahf", nameUr: "سورۃ الکہف", ayahs: 110, type: "Makki" },
  { number: 19, nameAr: "مريم", nameEn: "Maryam", nameUr: "سورۃ مریم", ayahs: 98, type: "Makki" },
  { number: 20, nameAr: "طه", nameEn: "Taha", nameUr: "سورۃ طٰہٰ", ayahs: 135, type: "Makki" },
  { number: 21, nameAr: "الأنبياء", nameEn: "Al-Anbiya", nameUr: "سورۃ الانبیاء", ayahs: 112, type: "Makki" },
  { number: 22, nameAr: "الحج", nameEn: "Al-Hajj", nameUr: "سورۃ الحج", ayahs: 78, type: "Madani" },
  { number: 23, nameAr: "المؤمنون", nameEn: "Al-Mu'minun", nameUr: "سورۃ المؤمنون", ayahs: 118, type: "Makki" },
  { number: 24, nameAr: "النور", nameEn: "An-Nur", nameUr: "سورۃ النور", ayahs: 64, type: "Madani" },
  { number: 25, nameAr: "الفرقان", nameEn: "Al-Furqan", nameUr: "سورۃ الفرقان", ayahs: 77, type: "Makki" },
  { number: 26, nameAr: "الشعراء", nameEn: "Ash-Shu'ara", nameUr: "سورۃ الشعراء", ayahs: 227, type: "Makki" },
  { number: 27, nameAr: "النمل", nameEn: "An-Naml", nameUr: "سورۃ النمل", ayahs: 93, type: "Makki" },
  { number: 28, nameAr: "القصص", nameEn: "Al-Qasas", nameUr: "سورۃ القصص", ayahs: 88, type: "Makki" },
  { number: 29, nameAr: "العنكبوت", nameEn: "Al-'Ankabut", nameUr: "سورۃ العنکبوت", ayahs: 69, type: "Makki" },
  { number: 30, nameAr: "الروم", nameEn: "Ar-Rum", nameUr: "سورۃ الروم", ayahs: 60, type: "Makki" },
  { number: 31, nameAr: "لقمان", nameEn: "Luqman", nameUr: "سورۃ لقمان", ayahs: 34, type: "Makki" },
  { number: 32, nameAr: "السجدة", nameEn: "As-Sajdah", nameUr: "سورۃ السجدہ", ayahs: 30, type: "Makki" },
  { number: 33, nameAr: "الأحزاب", nameEn: "Al-Ahzab", nameUr: "سورۃ الاحزاب", ayahs: 73, type: "Madani" },
  { number: 34, nameAr: "سبأ", nameEn: "Saba", nameUr: "سورۃ سبا", ayahs: 54, type: "Makki" },
  { number: 35, nameAr: "فاطر", nameEn: "Fatir", nameUr: "سورۃ فاطر", ayahs: 45, type: "Makki" },
  { number: 36, nameAr: "يس", nameEn: "Ya-Sin", nameUr: "سورۃ یٰسٓ", ayahs: 83, type: "Makki" },
  { number: 37, nameAr: "الصافات", nameEn: "As-Saffat", nameUr: "سورۃ الصافات", ayahs: 182, type: "Makki" },
  { number: 38, nameAr: "ص", nameEn: "Sad", nameUr: "سورۃ صٓ", ayahs: 88, type: "Makki" },
  { number: 39, nameAr: "الزمر", nameEn: "Az-Zumar", nameUr: "سورۃ الزمر", ayahs: 75, type: "Makki" },
  { number: 40, nameAr: "غافر", nameEn: "Ghafir", nameUr: "سورۃ غافر (المؤمن)", ayahs: 85, type: "Makki" },
  { number: 41, nameAr: "فصلت", nameEn: "Fussilat", nameUr: "سورۃ فصلت", ayahs: 54, type: "Makki" },
  { number: 42, nameAr: "الشورى", nameEn: "Ash-Shura", nameUr: "سورۃ الشوریٰ", ayahs: 53, type: "Makki" },
  { number: 43, nameAr: "الزخرف", nameEn: "Az-Zukhruf", nameUr: "سورۃ الزخرف", ayahs: 89, type: "Makki" },
  { number: 44, nameAr: "الدخان", nameEn: "Ad-Dukhan", nameUr: "سورۃ الدخان", ayahs: 59, type: "Makki" },
  { number: 45, nameAr: "الجاثية", nameEn: "Al-Jathiyah", nameUr: "سورۃ الجاثیہ", ayahs: 37, type: "Makki" },
  { number: 46, nameAr: "الأحقاف", nameEn: "Al-Ahqaf", nameUr: "سورۃ الاحقاف", ayahs: 35, type: "Makki" },
  { number: 47, nameAr: "محمد", nameEn: "Muhammad", nameUr: "سورۃ محمد ﷺ", ayahs: 38, type: "Madani" },
  { number: 48, nameAr: "الفتح", nameEn: "Al-Fath", nameUr: "سورۃ الفتح", ayahs: 29, type: "Madani" },
  { number: 49, nameAr: "الحجرات", nameEn: "Al-Hujurat", nameUr: "سورۃ الحجرات", ayahs: 18, type: "Madani" },
  { number: 50, nameAr: "ق", nameEn: "Qaf", nameUr: "سورۃ قٓ", ayahs: 45, type: "Makki" },
  { number: 51, nameAr: "الذاريات", nameEn: "Adh-Dhariyat", nameUr: "سورۃ الذاریات", ayahs: 60, type: "Makki" },
  { number: 52, nameAr: "الطور", nameEn: "At-Tur", nameUr: "سورۃ الطور", ayahs: 49, type: "Makki" },
  { number: 53, nameAr: "النجم", nameEn: "An-Najm", nameUr: "سورۃ النجم", ayahs: 62, type: "Makki" },
  { number: 54, nameAr: "القمر", nameEn: "Al-Qamar", nameUr: "سورۃ القمر", ayahs: 55, type: "Makki" },
  { number: 55, nameAr: "الرحمن", nameEn: "Ar-Rahman", nameUr: "سورۃ الرحمٰن", ayahs: 78, type: "Madani" },
  { number: 56, nameAr: "الواقعة", nameEn: "Al-Waqi'ah", nameUr: "سورۃ الواقعہ", ayahs: 96, type: "Makki" },
  { number: 57, nameAr: "الحديد", nameEn: "Al-Hadid", nameUr: "سورۃ الحدید", ayahs: 29, type: "Madani" },
  { number: 58, nameAr: "المجادلة", nameEn: "Al-Mujadila", nameUr: "سورۃ المجادلہ", ayahs: 22, type: "Madani" },
  { number: 59, nameAr: "الحشر", nameEn: "Al-Hashr", nameUr: "سورۃ الحشر", ayahs: 24, type: "Madani" },
  { number: 60, nameAr: "الممتحنة", nameEn: "Al-Mumtahanah", nameUr: "سورۃ الممتحنہ", ayahs: 13, type: "Madani" },
  { number: 61, nameAr: "الصف", nameEn: "As-Saff", nameUr: "سورۃ الصف", ayahs: 14, type: "Madani" },
  { number: 62, nameAr: "الجمعة", nameEn: "Al-Jumu'ah", nameUr: "سورۃ الجمعہ", ayahs: 11, type: "Madani" },
  { number: 63, nameAr: "المنافقون", nameEn: "Al-Munafiqun", nameUr: "سورۃ المنافقون", ayahs: 11, type: "Madani" },
  { number: 64, nameAr: "التغابن", nameEn: "At-Taghabun", nameUr: "سورۃ التغابن", ayahs: 18, type: "Madani" },
  { number: 65, nameAr: "الطلاق", nameEn: "At-Talaq", nameUr: "سورۃ الطلاق", ayahs: 12, type: "Madani" },
  { number: 66, nameAr: "التحريم", nameEn: "At-Tahrim", nameUr: "سورۃ التحریم", ayahs: 12, type: "Madani" },
  { number: 67, nameAr: "الملك", nameEn: "Al-Mulk", nameUr: "سورۃ الملک", ayahs: 30, type: "Makki" },
  { number: 68, nameAr: "القلم", nameEn: "Al-Qalam", nameUr: "سورۃ القلم", ayahs: 52, type: "Makki" },
  { number: 69, nameAr: "الحاقة", nameEn: "Al-Haqqah", nameUr: "سورۃ الحاقہ", ayahs: 52, type: "Makki" },
  { number: 70, nameAr: "المعارج", nameEn: "Al-Ma'arij", nameUr: "سورۃ المعارج", ayahs: 44, type: "Makki" },
  { number: 71, nameAr: "نوح", nameEn: "Nuh", nameUr: "سورۃ نوح", ayahs: 28, type: "Makki" },
  { number: 72, nameAr: "الجن", nameEn: "Al-Jinn", nameUr: "سورۃ الجن", ayahs: 28, type: "Makki" },
  { number: 73, nameAr: "المزمل", nameEn: "Al-Muzzammil", nameUr: "سورۃ المزمل", ayahs: 20, type: "Makki" },
  { number: 74, nameAr: "المدثر", nameEn: "Al-Muddaththir", nameUr: "سورۃ المدثر", ayahs: 56, type: "Makki" },
  { number: 75, nameAr: "القيامة", nameEn: "Al-Qiyamah", nameUr: "سورۃ القیامہ", ayahs: 40, type: "Makki" },
  { number: 76, nameAr: "الإنسان", nameEn: "Al-Insan", nameUr: "سورۃ الانسان (الدھر)", ayahs: 31, type: "Madani" },
  { number: 77, nameAr: "المرسلات", nameEn: "Al-Mursalat", nameUr: "سورۃ المرسلات", ayahs: 50, type: "Makki" },
  { number: 78, nameAr: "النبأ", nameEn: "An-Naba", nameUr: "سورۃ النبأ", ayahs: 40, type: "Makki" },
  { number: 79, nameAr: "النازعات", nameEn: "An-Nazi'at", nameUr: "سورۃ النازعات", ayahs: 46, type: "Makki" },
  { number: 80, nameAr: "عبس", nameEn: "'Abasa", nameUr: "سورۃ عبس", ayahs: 42, type: "Makki" },
  { number: 81, nameAr: "التكوير", nameEn: "At-Takwir", nameUr: "سورۃ التکویر", ayahs: 29, type: "Makki" },
  { number: 82, nameAr: "الانفطار", nameEn: "Al-Infitar", nameUr: "سورۃ الانفطار", ayahs: 19, type: "Makki" },
  { number: 83, nameAr: "المطففين", nameEn: "Al-Mutaffifin", nameUr: "سورۃ المطففین", ayahs: 36, type: "Makki" },
  { number: 84, nameAr: "الانشقاق", nameEn: "Al-Inshiqaq", nameUr: "سورۃ الانشقاق", ayahs: 25, type: "Makki" },
  { number: 85, nameAr: "البروج", nameEn: "Al-Buruj", nameUr: "سورۃ البروج", ayahs: 22, type: "Makki" },
  { number: 86, nameAr: "الطارق", nameEn: "At-Tariq", nameUr: "سورۃ الطارق", ayahs: 17, type: "Makki" },
  { number: 87, nameAr: "الأعلى", nameEn: "Al-A'la", nameUr: "سورۃ الاعلیٰ", ayahs: 19, type: "Makki" },
  { number: 88, nameAr: "الغاشية", nameEn: "Al-Ghashiyah", nameUr: "سورۃ الغاشیہ", ayahs: 26, type: "Makki" },
  { number: 89, nameAr: "الفجر", nameEn: "Al-Fajr", nameUr: "سورۃ الفجر", ayahs: 30, type: "Makki" },
  { number: 90, nameAr: "البلد", nameEn: "Al-Balad", nameUr: "سورۃ البلد", ayahs: 20, type: "Makki" },
  { number: 91, nameAr: "الشمس", nameEn: "Ash-Shams", nameUr: "سورۃ الشمس", ayahs: 15, type: "Makki" },
  { number: 92, nameAr: "الليل", nameEn: "Al-Layl", nameUr: "سورۃ اللیل", ayahs: 21, type: "Makki" },
  { number: 93, nameAr: "الضحى", nameEn: "Ad-Duha", nameUr: "سورۃ الضحیٰ", ayahs: 11, type: "Makki" },
  { number: 94, nameAr: "الشرح", nameEn: "Ash-Sharh", nameUr: "سورۃ الشرح (الانشراح)", ayahs: 8, type: "Makki" },
  { number: 95, nameAr: "التين", nameEn: "At-Tin", nameUr: "سورۃ التین", ayahs: 8, type: "Makki" },
  { number: 96, nameAr: "العلق", nameEn: "Al-'Alaq", nameUr: "سورۃ العلق", ayahs: 19, type: "Makki" },
  { number: 97, nameAr: "القدر", nameEn: "Al-Qadr", nameUr: "سورۃ القدر", ayahs: 5, type: "Makki" },
  { number: 98, nameAr: "البينة", nameEn: "Al-Bayyinah", nameUr: "سورۃ البینہ", ayahs: 8, type: "Madani" },
  { number: 99, nameAr: "الزلزلة", nameEn: "Az-Zalzalah", nameUr: "سورۃ الزلزال", ayahs: 8, type: "Madani" },
  { number: 100, nameAr: "العاديات", nameEn: "Al-'Adiyat", nameUr: "سورۃ العادیات", ayahs: 11, type: "Makki" },
  { number: 101, nameAr: "القارعة", nameEn: "Al-Qari'ah", nameUr: "سورۃ القارعہ", ayahs: 11, type: "Makki" },
  { number: 102, nameAr: "التكاثر", nameEn: "At-Takathur", nameUr: "سورۃ التکاثر", ayahs: 8, type: "Makki" },
  { number: 103, nameAr: "العصر", nameEn: "Al-'Asr", nameUr: "سورۃ العصر", ayahs: 3, type: "Makki" },
  { number: 104, nameAr: "الهمزة", nameEn: "Al-Humazah", nameUr: "سورۃ الہمزہ", ayahs: 9, type: "Makki" },
  { number: 105, nameAr: "الفيل", nameEn: "Al-Fil", nameUr: "سورۃ الفیل", ayahs: 5, type: "Makki" },
  { number: 106, nameAr: "قريش", nameEn: "Quraysh", nameUr: "سورۃ قریش", ayahs: 4, type: "Makki" },
  { number: 107, nameAr: "الماعون", nameEn: "Al-Ma'un", nameUr: "سورۃ الماعون", ayahs: 7, type: "Makki" },
  { number: 108, nameAr: "الكوثر", nameEn: "Al-Kawthar", nameUr: "سورۃ الکوثر", ayahs: 3, type: "Makki" },
  { number: 109, nameAr: "الكافرون", nameEn: "Al-Kafirun", nameUr: "سورۃ الکافرون", ayahs: 6, type: "Makki" },
  { number: 110, nameAr: "النصر", nameEn: "An-Nasr", nameUr: "سورۃ النصر", ayahs: 3, type: "Madani" },
  { number: 111, nameAr: "المسد", nameEn: "Al-Masad", nameUr: "سورۃ المسد (لہب)", ayahs: 5, type: "Makki" },
  { number: 112, nameAr: "الإخلاص", nameEn: "Al-Ikhlas", nameUr: "سورۃ الاخلاص", ayahs: 4, type: "Makki" },
  { number: 113, nameAr: "الفلق", nameEn: "Al-Falaq", nameUr: "سورۃ الفلق", ayahs: 5, type: "Makki" },
  { number: 114, nameAr: "الناس", nameEn: "An-Nas", nameUr: "سورۃ الناس", ayahs: 6, type: "Makki" }
];

export const NOORANI_QAIDA_LESSONS = [
  {
    id: 1,
    titleUr: "تختی نمبر ۱: حروفِ مفردات",
    titleEn: "Lesson 1: Individual Letters (Mufaradat)",
    descUr: "۲۹ حروفِ تہجی کی درست ادائیگی، مخارج اور صوت کی پہچان۔",
    descEn: "Recognition and correct articulation of the 29 individual Arabic letters.",
    letters: [
      { ar: "ا", name: "Alif", note: "حلق کا نچلا حصہ / خالی دہن" },
      { ar: "ب", name: "Baa", note: "دونوں ہونٹوں کی تری سے" },
      { ar: "ت", name: "Taa", note: "زبان کی نوک اور سامنے والے اوپر کے دانت" },
      { ar: "ث", name: "Thaa", note: "زبان کی نوک اور اوپر کے دانتوں کے سرے" },
      { ar: "ج", name: "Jeem", note: "زبان کا درمیانی حصہ اور تالو" },
      { ar: "ح", name: "Haa", note: "حلق کا درمیانی حصہ" },
      { ar: "خ", name: "Khaa", note: "حلق کا اوپر والا حصہ (پُر پڑھا جائے گا)" },
      { ar: "د", name: "Daal", note: "زبان کی نوک اور ثنایا علیا کی جڑ" },
      { ar: "ذ", name: "Dhaal", note: "زبان کی نوک اور سامنے کے اوپر والے دانت" },
      { ar: "ر", name: "Raa", note: "زبان کی پشت اور تالو کا اگلا حصہ" },
      { ar: "ز", name: "Zay", note: "زبان کی نوک اور دانتوں کی سختی مع سیٹی" },
      { ar: "س", name: "Seen", note: "سیٹی والے حروف میں سے ہے" },
      { ar: "ش", name: "Sheen", note: "زبان کا درمیانی حصہ اور تالو" },
      { ar: "ص", name: "Saad", note: "پُر پڑھا جانے والا سیٹی دار حرف" },
      { ar: "ض", name: "Daad", note: "زبان کی کروٹ اور اوپر کی ڈاڑھیں" },
      { ar: "ط", name: "Taa", note: "پُر حرف، زبان کی نوک اور دانتوں کی جڑ" },
      { ar: "ظ", name: "Zaa", note: "پُر حرف، زبان کی نوک اور دانتوں کے سرے" },
      { ar: "ع", name: "'Ayn", note: "حلق کا درمیانی حصہ، واضح آواز" },
      { ar: "غ", name: "Ghayn", note: "حلق کا اوپر والا حصہ، پُر آواز" },
      { ar: "ف", name: "Faa", note: "اوپر کے دانتوں کے سرے اور نچلا ہونٹ" },
      { ar: "ق", name: "Qaaf", note: "زبان کی جڑ اور کوے کے پاس کا نرم تالو" },
      { ar: "ك", name: "Kaaf", note: "زبان کی جڑ کا اگلا سخت تالو" },
      { ar: "ل", name: "Laam", note: "زبان کی کروٹ کا اگلا حصہ اور تالو" },
      { ar: "م", name: "Meem", note: "دونوں ہونٹوں کی خشکی سے" },
      { ar: "ن", name: "Noon", note: "زبان کی نوک اور اوپر کے تالو کی ہڈی" },
      { ar: "و", name: "Waw", note: "دونوں ہونٹوں کو گول کر کے" },
      { ar: "هـ", name: "Haa", note: "حلق کا سب سے نچلا حصہ (سینے کے پاس)" },
      { ar: "ء", name: "Hamzah", note: "حلق کا نچلا حصہ، ہلکا جھٹکا" },
      { ar: "ي", name: "Yaa", note: "زبان کا درمیانی حصہ اور تالو" }
    ]
  },
  {
    id: 2,
    titleUr: "تختی نمبر ۲: حروفِ مرکبات",
    titleEn: "Lesson 2: Compound Letters (Murakkabat)",
    descUr: "دو یا دو سے زیادہ حروف کے جوڑ اور مختلف اشکال کی پہچان۔",
    descEn: "Recognizing combined letter shapes at the beginning, middle, and end.",
    letters: [
      { ar: "لا", name: "Lam-Alif", note: "لام اور الف کا جوڑ" },
      { ar: "با", name: "Baa-Alif", note: "با کے نیچے ایک نقطہ" },
      { ar: "تا", name: "Taa-Alif", note: "تا کے اوپر دو نقطے" },
      { ar: "ثا", name: "Thaa-Alif", note: "ثا کے اوپر تین نقطے" },
      { ar: "بل", name: "Baa-Lam", note: "با کا سرا اور لام" },
      { ar: "تل", name: "Taa-Lam", note: "تا کا سرا اور لام" },
      { ar: "ثل", name: "Thaa-Lam", note: "ثا کا سرا اور لام" },
      { ar: "نل", name: "Noon-Lam", note: "نون کا سرا اور لام" },
      { ar: "يل", name: "Yaa-Lam", note: "یا کا سرا اور لام" },
      { ar: "بـح", name: "Baa-Haa", note: "با اور حلق کا حا" },
      { ar: "تـخ", name: "Taa-Khaa", note: "تا اور پُر خا" },
      { ar: "نـج", name: "Noon-Jeem", note: "نون اور جیم کا جوڑ" }
    ]
  },
  {
    id: 3,
    titleUr: "تختی نمبر ۳: حروفِ مقطعات",
    titleEn: "Lesson 3: Disjointed Letters (Muqatta'at)",
    descUr: "سورتوں کے شروع میں آنے والے قرآنی رموز کو مد کے ساتھ پڑھنا۔",
    descEn: "Reciting special opening Quranic letter sequences with measured Madd.",
    letters: [
      { ar: "الٓمّٓ", name: "Alif-Lam-Meem", note: "الف، لام پر مدِ لازم، میم پر غنہ و مد" },
      { ar: "الٓمّٓصٓ", name: "Alif-Lam-Meem-Saad", note: "صاد پر تفخیم اور لمبی مد" },
      { ar: "الٓرٰ", name: "Alif-Lam-Raa", note: "را پر الف مقصورہ" },
      { ar: "الٓمّٓرٰ", name: "Alif-Lam-Meem-Raa", note: "لام اور میم پر مد" },
      { ar: "كٰهٰیٰعٓصٓ", name: "Kaf-Ha-Ya-'Ayn-Sad", note: "پانچ حروف پر مشتمل قرآنی رمز" },
      { ar: "طٰهٰ", name: "Taa-Haa", note: "دو حرکات کی مدِ اصلی" },
      { ar: "طٰسٓمّٓ", name: "Taa-Seen-Meem", note: "سین اور میم کا ادغام" },
      { ar: "يٰسٓ", name: "Yaa-Seen", note: "سین پر مدِ لازم" },
      { ar: "صٓ", name: "Saad", note: "مکمل طول کے ساتھ مد" },
      { ar: "حٰمٓ", name: "Haa-Meem", note: "حا پر مد اصلی، میم پر طول" },
      { ar: "قٓ", name: "Qaaf", note: "قاف پر مکمل مد اور قلقلہ" },
      { ar: "نٓ", name: "Noon", note: "نون پر لمبی مد" }
    ]
  },
  {
    id: 4,
    titleUr: "تختی نمبر ۴: حرکات (زبر، زیر، پیش)",
    titleEn: "Lesson 4: Short Vowels (Harakat)",
    descUr: "زبر، زیر، پیش کو بغیر کھینچے اور بغیر جھٹکا دیے نرمی سے ادا کرنا۔",
    descEn: "Pronouncing short vowels (Fathah, Kasrah, Dammah) crisply without stretching.",
    letters: [
      { ar: "أَ", name: "A", note: "زبر کی آواز اوپر کو اٹھتی ہے" },
      { ar: "إِ", name: "I", note: "زیر کی آواز نیچے گرتی ہے" },
      { ar: "أُ", name: "U", note: "پیش کی ادائیگی میں دونوں ہونٹ گول ہوں" },
      { ar: "بَ", name: "Ba", note: "بغیر لمبا کیے ادا کریں" },
      { ar: "بِ", name: "Bi", note: "معروف آواز کے ساتھ" },
      { ar: "بُ", name: "Bu", note: "ہونٹوں کو آگے لا کر" },
      { ar: "تَ", name: "Ta", note: "نوکِ زبان ثنایا علیا کی جڑ پر" },
      { ar: "تِ", name: "Ti", note: "نرمی سے" },
      { ar: "تُ", name: "Tu", note: "ہونٹوں کی گولائی" },
      { ar: "ثَ", name: "Tha", note: "سیٹی کی آواز نہ آئے" },
      { ar: "ثِ", name: "Thi", note: "نرم آواز" },
      { ar: "ثُ", name: "Thu", note: "نرمی سے گولائی" }
    ]
  },
  {
    id: 5,
    titleUr: "تختی نمبر ۵: تنوین (دو زبر، دو زیر، دو پیش)",
    titleEn: "Lesson 5: Tanween (Double Vowels)",
    descUr: "تنوین حقیقت میں نون ساکن ہے جو لفظ کے آخر میں بولا جاتا ہے۔",
    descEn: "Mastering double vowels which produce a clear Noon Saakin sound.",
    letters: [
      { ar: "أً", name: "An", note: "نون ساکن کی آواز" },
      { ar: "إٍ", name: "In", note: "زیر کی تنوین" },
      { ar: "أٌ", name: "Un", note: "پیش کی تنوین" },
      { ar: "بً", name: "Ban", note: "ہونٹوں سے با اور نون ساکن" },
      { ar: "بٍ", name: "Bin", note: "با زیر نون بن" },
      { ar: "بٌ", name: "Bun", note: "با پیش نون بن" },
      { ar: "تً", name: "Tan", note: "تا کی دو زبر" },
      { ar: "تٍ", name: "Tin", note: "تا کی دو زیر" },
      { ar: "تٌ", name: "Tun", note: "تا کی دو پیش" }
    ]
  },
  {
    id: 6,
    titleUr: "تختی نمبر ۶: حروفِ مدہ و لین",
    titleEn: "Lesson 6: Madd & Leen Letters",
    descUr: "الف مدہ، واو مدہ، یا مدہ اور واو لین و یا لین کی دو حرکات تک کھینچنے کی مشق۔",
    descEn: "Practicing 2-count natural elongation (Alif, Waw, Yaa Maddah and Leen).",
    letters: [
      { ar: "بَا", name: "Baa (Madd)", note: "الف سے پہلے زبر ہو تو الف مدہ (۲ حرکات)" },
      { ar: "بُو", name: "Boo (Madd)", note: "واو ساکن سے پہلے پیش ہو تو واو مدہ" },
      { ar: "بِي", name: "Bee (Madd)", note: "یا ساکن سے پہلے زیر ہو تو یا مدہ" },
      { ar: "بَوْ", name: "Baw (Leen)", note: "واو ساکن سے پہلے زبر ہو تو واو لین (نرم آواز)" },
      { ar: "بَيْ", name: "Bay (Leen)", note: "یا ساکن سے پہلے زبر ہو تو یا لین (نرم آواز)" }
    ]
  },
  {
    id: 7,
    titleUr: "تختی نمبر ۷: سکون و جزم اور قلقلہ",
    titleEn: "Lesson 7: Sukoon, Jazm & Qalqalah",
    descUr: "ساکن حرف کی ادائیگی اور قطب جد (ق، ط، ب، ج، د) میں آواز کی گونج۔",
    descEn: "Reciting resting Sukoon letters and the 5 echoing Qalqalah letters.",
    letters: [
      { ar: "أَبْ", name: "Ab (Qalqalah)", note: "با ساکن پر قلقلہ یعنی آواز کی واضح گونج" },
      { ar: "أَتْ", name: "At", note: "تا ساکن پر ہمس کی ہلکی ہوا" },
      { ar: "أَثْ", name: "Ath", note: "ثا ساکن نرمی سے" },
      { ar: "أَجْ", name: "Aj (Qalqalah)", note: "جیم ساکن پر قلقلہ کی گونج" },
      { ar: "أَحْ", name: "Ah", note: "حا ساکن حلق سے صفائی کے ساتھ" },
      { ar: "أَخْ", name: "Akh", note: "خا ساکن پُر آواز" },
      { ar: "أَدْ", name: "Ad (Qalqalah)", note: "دال ساکن پر قلقلہ کی گونج" },
      { ar: "أَطْ", name: "At (Qalqalah)", note: "طا ساکن پُر اور گونج دار" },
      { ar: "أَقْ", name: "Aq (Qalqalah)", note: "قاف ساکن موٹا اور گونج دار" }
    ]
  },
  {
    id: 8,
    titleUr: "تختی نمبر ۸: تشدید (مشدد حروف)",
    titleEn: "Lesson 8: Shaddah (Doubled Letters)",
    descUr: "مشدد حرف دو حرفوں کے برابر ہوتا ہے؛ پہلا ساکن اور دوسرا متحرک۔",
    descEn: "Doubled consonants with emphasis; Meem and Noon Mushaddad require Ghunnah.",
    letters: [
      { ar: "أَبَّ", name: "Abba", note: "پہلے با پر جماؤ پھر زبر کے ساتھ ادائیگی" },
      { ar: "أَبِّ", name: "Abbi", note: "جماؤ کے ساتھ زیر" },
      { ar: "أَبُّ", name: "Abbu", note: "جماؤ کے ساتھ پیش" },
      { ar: "إِنَّ", name: "Inna (Ghunnah)", note: "نون مشدد پر واجب غنہ (ناک میں آواز)" },
      { ar: "ثُمَّ", name: "Thumma (Ghunnah)", note: "میم مشدد پر واجب غنہ" },
      { ar: "رَبَّنَا", name: "Rabbana", note: "تشدید کی عملی قرآنی مشق" }
    ]
  }
];

export const siteData = {
  ur: {
    dir: "rtl",
    academy: "فاروقی آن لائن قرآن اکیڈمی",
    other: "English",
    otherPath: "/en",
    home: "ہوم",
    about: "تعارف",
    courses: "کورسز و نصاب",
    qaida: "نورانی قاعدہ",
    quranPlayer: "تلاوتِ قرآن",
    teachers: "اساتذہ",
    fees: "فیس کیلکولیٹر",
    trial: "مفت ٹرائل",
    contact: "رابطہ",
    portal: "پورٹل ڈیش بورڈ",
    tagline: "تجوید، محبت اور اعتماد کے ساتھ قرآن سیکھیے",
    intro:
      "فاروقی آن لائن قرآن اکیڈمی لاہور (پاکستان) سے دنیا بھر کے بچوں، خواتین اور بڑوں کے لیے مستند و سند یافتہ اساتذہ کے ساتھ انفرادی 1-to-1 کلاسز فراہم کرتی ہے۔",
    
    // Original 5 Certified Teachers explicitly provided by user
        aboutPoints: [
      ["50+ طلبہ", "مختلف عمروں اور سطحوں کے طلبہ باقاعدگی سے زیرِ تعلیم ہیں۔"],
      ["5 مستند اساتذہ", "مرد و خواتین اساتذہ کے ساتھ انفرادی تدریس۔"],
      ["انفرادی کلاسز", "ہر طالب علم کو الگ توجہ اور ذاتی تعلیمی منصوبہ۔"],
      ["عالمی اوقات", "دنیا کے مختلف ممالک کے مطابق لچکدار اوقات۔"]
    ],
    trialTitle: "مفت ٹرائل کلاس",
    trialIntro: "داخلے سے پہلے ایک مفت ٹرائل کلاس کے ذریعے طالب علم کی سطح اور مناسب وقت طے کیا جاتا ہے۔",
    trialSteps: [
      "طالب علم کی بنیادی معلومات جمع کریں",
      "موجودہ سطح اور مطلوبہ کورس کا جائزہ",
      "موزوں استاد اور وقت کا انتخاب",
      "مفت ٹرائل کلاس کا انعقاد",
      "موزوں کورس کا مشورہ اور باقاعدہ داخلہ"
    ],
    feesTitle: "فیس پلان",
    feesIntro: "فیس طالب علم کے ملک، ہفتہ وار کلاسز اور دورانیے کے مطابق مقرر کی جاتی ہے۔",
    contactTitle: "رابطہ کریں",
    contactIntro: "داخلہ، مفت ٹرائل کلاس، کورس یا فیس کے بارے میں معلومات کے لیے براہِ راست رابطہ کریں۔",
    coursesList: [
      ["نورانی قاعدہ (بنیادی)", "تجویدی حروف اور حرکات کی بنیادی شناخت"],
      ["ناظرہ قرآن مع تجوید", "درست مخارج اور رواں تلاوت"],
      ["حفظ القرآن الکریم", "سبق، سبقی، منزل اور پختہ یادداشت"],
      ["تجوید القرآن (عملی و نظری)", "مخارج، صفات اور تجویدی قواعد کی گہرائی"],
      ["ترجمہ و تفسیر قرآن", "آسان فہم اور عملی رہنمائی"],
      ["اسلامی بنیادی تربیت و مسنون دعائیں", "نماز، عقائد، طہارت اور روزمرہ کی دعائیں"],
      ["منتخب احادیثِ نبویہ", "اخلاق و اعمال کی اصلاح"],
      ["سیرت النبی ﷺ و تاریخِ اسلام", "پیارے نبی ﷺ کی حیات طیبہ کا جامع مطالعہ"],
      ["بنیادی فقہ و احکامِ شریعت", "طہارت، نماز، روزے اور روزمرہ مسائل"],
      ["عربی زبان و تکلم", "روزمرہ بول چال اور قرآنی تعبیرات"],
      ["قرآنی عربی گرامر (نحو و صرف)", "قرآنی تراکیب اور اعراب کی تفہیم"],
      ["تعارف قراءاتِ سبعہ و عشرہ", "متواتر قراءات کی تاریخ اور ائمہ کے اصول"]
    ],
    teachersList: [
      {
        name: "قاری محمد عمر فاروقی",
        qualification: "فاضل قراءات سبعہ وعشرہ، فاضل درس نظامی",
        role: "بانی و پرنسپل، سینئر استادِ قراءات و تجوید",
        experience: "۱۰+ سال تدریسی تجربہ",
        bio: "وفاق المدارس العربیہ سے فاضل درس نظامی (شہادۃ العالمیہ)، اور سند یافتہ فاضل قراءات سبعہ وعشرہ۔ حفظ القرآن، اعلیٰ تجوید اور بین الاقوامی آن لائن تدریس کے ماہر۔",
        specialties: ["قراءات سبعہ وعشرہ", "حفظ القرآن الکریم", "اعلیٰ تجوید و مخارج", "درس نظامی و ترجمہ قرآن"]
      },
      {
        name: "حافظ سمیع اللہ",
        qualification: "فاضل قراءات عشرہ، درس نظامی",
        role: "سینئر استادِ حفظ و تجوید",
        experience: "۸+ سال تدریسی تجربہ",
        bio: "فاضل قراءات عشرہ اور فاضل درس نظامی۔ حفظِ قرآن، منظم سبق، سبقی، منزل اور پختہ دہرائی میں غیر معمولی مہارت کے حامل استاد۔",
        specialties: ["حفظ و پختہ دہرائی", "قراءات عشرہ", "ناظرہ قرآن مع تجوید", "تجویدی قواعد کی عملی مشق"]
      },
      {
        name: "حافظ طلحہ حنیف",
        qualification: "فاضل قراءات عشرہ، درس نظامی",
        role: "استادِ قراءات و ناظرہ قرآن",
        experience: "۷+ سال تدریسی تجربہ",
        bio: "فاضل قراءات عشرہ اور فاضل درس نظامی۔ مخارج الحروف، صوت اور تلاوت کے حسن و لحن کے ماہر، بچوں اور نو آموز طلبہ کے شفیق استاد۔",
        specialties: ["مخارج و صفات الحروف", "لحن و قراءت کی خوبصورتی", "نورانی قاعدہ", "قرآن فہم"]
      },
      {
        name: "استاذہ انیسہ عنایت",
        qualification: "درس نظامی",
        role: "سینئر معلمہ (خواتین و بچیوں کے لیے)",
        experience: "۷+ سال تدریسی تجربہ",
        bio: "وفاق المدارس سے فاضلہ درس نظامی۔ خواتین اور بچیوں کے لیے ناظرہ قرآن، تجوید، ترجمہ و تفسیر، فقہ العبادات اور سیرت کی صابر و شفیق معلمہ۔",
        specialties: ["خواتین و بچیوں کی تدریس", "تجوید و ناظرہ", "ترجمہ و تفسیر القرآن", "فقہ و روزمرہ مسائل"]
      },
      {
        name: "استاذہ خنساء حنیف",
        qualification: "درس نظامی",
        role: "معلمہ نورانی قاعدہ و ناظرہ قرآن",
        experience: "۶+ سال تدریسی تجربہ",
        bio: "فاضلہ درس نظامی۔ کم عمر بچوں اور بچیوں کے لیے نورانی قاعدہ، مسنون دعائیں، نماز اور بنیادی اسلامی آداب سکھانے کی ماہر معلمہ۔",
        specialties: ["بچوں کا نورانی قاعدہ", "نماز و مسنون دعائیں", "تلفظ و اعراب کی درستگی", "اسلامی تربیت"]
      }
    ],

    // 12 Comprehensive Courses with Detailed Syllabi & Outlines
    coursesDetailed: [
      {
        code: "01",
        name: "نورانی قاعدہ (Noorani Qaida)",
        shortDesc: "حروف، حرکات، جوڑ، مخارج اور درست تلفظ کی مضبوط بنیاد۔",
        audience: "کم عمر بچوں اور نو آموز طلبہ کے لیے",
        duration: "۲ تا ۳ ماہ",
        sessions: "۲۴ تا ۳۶ انفرادی کلاسز",
        track: "quran",
        prerequisites: "کسی پیشگی معلومات کی ضرورت نہیں۔ بالکل ابتداء سے شروع۔",
        outcomes: [
          "قرآنی حروف کے درست ۱۷ مخارج کی پہچان اور ادائیگی",
          "حرکات، تنوین، مد اور سکون کے فرق کا عملی فہم",
          "مرکب حروف اور الفاظ کو روانی سے پڑھنے کی صلاحیت",
          "ناظرہ قرآن کریم کا آغاز کرنے کی مکمل تیاری"
        ],
        modules: [
          { title: "مرحلہ ۱: حروفِ مفردات", topics: ["۲۹ حروفِ تہجی کی درست پہچان", "حلق، زبان اور ہونٹوں کے بنیادی مخارج", "موٹے (مستعلیہ) اور باریک حروف کا فرق"] },
          { title: "مرحلہ ۲: حروفِ مرکبات و مقطعات", topics: ["حروف کے ملے جلے سرے اور اشکال", "شروع، درمیان اور آخر میں آنے والی اشکال", "سورتوں کے اوائل میں رموزِ مقطعات کی مشق"] },
          { title: "مرحلہ ۳: حرکات اور تنوین", topics: ["زبر، زیر، پیش کی بغیر جھٹکے ادائیگی", "دو زبر، دو زیر اور دو پیش (تنوین) کا نون ساکن فہم", "حرکات و تنوین کی مشترکہ لفظی مشق"] },
          { title: "مرحلہ ۴: حروفِ مدہ اور لین", topics: ["الف، واو اور یا مدہ کی دو حرکات تک کشش", "واو لین اور یا لین کی نرم اور تیز ادائیگی", "کھڑی حرکات (کھڑا زبر، کھڑی زیر، الٹا پیش)"] },
          { title: "مرحلہ ۵: سکون (جزم) اور قلقلہ", topics: ["جزم والے حروف کی ٹھہر کر ادائیگی", "قطب جد (ق، ط، ب، ج، د) کے قلقلہ کی عملی گونج", "ہمزہ ساکنہ کا ہلکا جھٹکا"] },
          { title: "مرحلہ ۶: تشدید اور غنہ", topics: ["مشدد حرف پر دوہرا دباؤ اور جماؤ", "نون مشدد اور میم مشدد پر واجب غنہ (ناک میں آواز)", "تنوین و تشدید کا باہمی ربط اور جائزہ"] }
        ]
      },
      {
        code: "02",
        name: "ناظرہ قرآنِ مجید مع تجوید (Nazra Quran)",
        shortDesc: "مخارج اور بنیادی تجوید کے ساتھ روانی سے پورے قرآنِ مجید کی تلاوت۔",
        audience: "قاعدہ مکمل کرنے والے یا تلفظ درست کرنے والے طلبہ",
        duration: "۶ تا ۱۲ ماہ",
        sessions: "۷۰ تا ۱۲۰ انفرادی کلاسز",
        track: "quran",
        prerequisites: "نورانی قاعدہ یا بنیادی عربی حروف کا علم۔",
        outcomes: [
          "پورے ۳۰ پاروں کی بغیر ہجے کیے روانی سے درست تلاوت",
          "تلاوت کے دوران قواعدِ تجوید کا قدرتی اور برجستہ اطلاق",
          "وقف اور علاماتِ مصحف پر درست ٹھہراؤ کی عادت",
          "نماز میں لمبی سورتوں کی خوبصورت تلاوت پر قدرت"
        ],
        modules: [
          { title: "مرحلہ ۱: پارہ ۳۰ (عمّ پارہ) کی تلاوت", topics: ["چھوٹی سورتوں کے ساتھ مخارج کی بحالی", "تسمیہ اور تعوذ کے تجویدی احکام", "روزمرہ نماز کی سورتوں کی خصوصی اصلاح"] },
          { title: "مرحلہ ۲: نون ساکن و تنوین کے چار قواعد", topics: ["اظہارِ حلقى (حلق کے ۶ حروف پر بغیر غنہ صاف پڑھنا)", "ادغام مع الغنہ اور ادغام بلا غنہ (یرملون)", "اقلاب (نون کو میم میں بدلنا)", "اخفاء حقیقی (۱۵ حروف پر چھپا کر غنہ کرنا)"] },
          { title: "مرحلہ ۳: میم ساکن اور راء و لام کے احکام", topics: ["میم ساکن کا اخفاء شفوی، ادغام اور اظہار", "تفخیم و ترقیق: راء کب پُر ہوگی اور کب باریک", "اسمِ جلالت (اللہ) کے لام کو پُر اور باریک پڑھنے کے مواقع"] },
          { title: "مرحلہ ۴: رموزِ اوقاف اور علامات", topics: ["م (وقف لازم)، ط (وقف مطلق)، ج (وقف جائز)، ز، ص، قف", "آیت کے درمیان سانس ٹوٹنے پر اعادہ کا طریقہ", "سجدۂ تلاوت کے احکام اور تلاوت کی دعائیں"] },
          { title: "مرحلہ ۵: ۳۰ پاروں کا مکمل دور", topics: ["پارہ ۱ تا ۱۵ کی روانی کی تربیت", "پارہ ۱۶ تا ۳۰ کی تیز اور خوش الحان تلاوت", "تکمیلِ ناظرہ اور خصوصی تعلیمی سرٹیفکیٹ"] }
        ]
      },
      {
        code: "03",
        name: "تجوید و قراءات کورس (Tajweed Mastery)",
        shortDesc: "قواعدِ تجوید، صفاتِ حروف، وقف و ابتداء اور قراءت کی علمی و عملی مہارت۔",
        audience: "تلاوت کو باکمال اور خوبصورت بنانے کے خواہشمند طلبہ و اساتذہ",
        duration: "۴ تا ۶ ماہ",
        sessions: "۴۸ انفرادی سیشنز",
        track: "quran",
        prerequisites: "ناظرہ قرآن کی بنیادی تلاوت پر قدرت۔",
        outcomes: [
          "۱۷ مخارج الحروف کی علمی اور عملی پختگی",
          "صفاتِ لازمہ و عارضہ (ہمس، جہر، استعلاء، استقال وغیرہ) کا ادراک",
          "مدود کے تمام مراتب اور دورانیے کی پیمائش",
          "قراءتِ حفص عن عاصم کی مکمل تجویدی تصدیق"
        ],
        modules: [
          { title: "مرحلہ ۱: علم التجوید کی مبادیات و مخارج", topics: ["تجوید کی تعریف، فرضیت اور لحنِ جلی و خفی کی شناخت", "پانچ بڑے اعضائے نطق اور ۱۷ خصوصی مخارج", "حلق، لسان، شفتین، جوف اور خیشوم کی تفصیلی مشق"] },
          { title: "مرحلہ ۲: صفاتِ حروف (لازمہ و عارضہ)", topics: ["صفاتِ متضادہ: ہمس بمقابلہ جہر، شدت بمقابلہ رخاوت", "استعلاء بمقابلہ استفال، اطباق بمقابلہ انفتاح", "صفاتِ غیر متضادہ: قلقلہ، لین، صفیر، انحراف، تکریر، تفشی، استطالت"] },
          { title: "مرحلہ ۳: احکامِ مدود (Elongation Rules)", topics: ["مدِ اصلی (طبیعی، بدل، عوض، صلہ صغریٰ)", "مدِ فرعی بسببِ ہمزہ: مدِ متصل اور مدِ منفصل", "مدِ فرعی بسببِ سکون: مدِ عارض وقفی، مدِ لین اور مدِ لازم"] },
          { title: "مرحلہ ۴: وقف و ابتداء اور خصوصی کلمات", topics: ["وقفِ تام، کافی، حسن اور قبیح کی معرفت", "رسمِ عثمانی کے مطابق تاء مبسوطہ اور تاء مربوطہ", "ہمزۃ الوصل کی حرکات کا تعین"] }
        ]
      },
      {
        code: "04",
        name: "حفظ القرآن الکریم (Hifz-ul-Quran)",
        shortDesc: "منظم سبق، سبقی، منزل اور مسلسل نگرانی کے ساتھ پختہ حفظ۔",
        audience: "حفظ کے متمنی سنجیدہ بچے، نوجوان اور بڑے",
        duration: "۲ تا ۳ سال (انفرادی رفتار کے مطابق)",
        sessions: "ہفتہ وار ۵ یا ۶ دن مسلسل کلاسز",
        track: "quran",
        prerequisites: "ناظرہ قرآن کریم کی تجوید کے ساتھ روانی۔",
        outcomes: [
          "مکمل ۳۰ پاروں کا پختہ اور یادگار حفظ",
          "متشابہاتِ قرآنیہ کی پہچان اور اغلاط سے حفاظت",
          "روزانہ کی بنیاد پر پچھلے حفظ (منزل) کو سنانے کی صلاحیت",
          "تکمیلِ حفظ پر باقاعدہ سند و اعزازی شیلڈ"
        ],
        modules: [
          { title: "نظام ۱: روزانہ کا نیا سبق (Sabaq)", topics: ["روزانہ آدھے سے ایک صفحہ نیا سبق سنانا", "تجوید کے ساتھ یاد کرنے کا سائنسی طریقہ", "استاد کے سامنے بغیر اٹکے سنانا"] },
          { title: "نظام ۲: سبقی (Sabqi / Recent Juz)", topics: ["حالیہ پارے کے تمام پچھلے اسباق کا روزانہ اعادہ", "نئے پارے میں داخلے سے پہلے پچھلے پارے کا مکمل امتحان", "متشابہ آیات کا جدول بنا کر یاد کرنا"] },
          { title: "نظام ۳: منزل (Manzil / Cumulative Retention)", topics: ["پہلے حفظ شدہ پاروں میں سے روزانہ کم از کم ۱ پارہ سنانا", "حفظ کی پختگی کے لیے مائیکرو ریویژن سائیکل", "ماہانہ مکمل دور اور والدین پورٹل پر تفصیلی جائزہ"] }
        ]
      },
      {
        code: "05",
        name: "ترجمہ و تفسیر القرآن (Tafsir & Translation)",
        shortDesc: "منتخب سورتوں اور اہم قرآنی مباحث کا لفظی ترجمہ اور آسان فہم۔",
        audience: "قرآنی پیغامات اور فہمِ دین کے متلاشی افراد",
        duration: "۶ تا ۱۲ ماہ",
        sessions: "ہفتہ وار ۲ یا ۳ کلاسز",
        track: "quran",
        prerequisites: "قرآن پاک کی ناظرہ پڑھنے کی اہلیت۔",
        outcomes: [
          "عام قرآنی الفاظ اور تراکیب کا براہِ راست فہم",
          "سورتوں کے فضائل، مقاصد اور شانِ نزول کا علم",
          "نماز اور تلاوت کے دوران آیات پر تدبر کی صلاحیت",
          "قرآنی احکامات کا روزمرہ زندگی پر انطباق"
        ],
        modules: [
          { title: "مرحلہ ۱: فہمِ قرآن کے بنیادی اصول", topics: ["علوم القرآن کا تعارف اور وحی کی تاریخ", "مکی اور مدنی سورتوں کی امتیازی خصوصیات", "قرآنی تراکیب اور اعجازِ قرآن"] },
          { title: "مرحلہ ۲: سورۃ الفاتحہ اور آخری پارہ", topics: ["سورۃ الفاتحہ کی کائناتی جامعیت اور ام الکتاب ہونا", "سورۃ الملک، النبأ اور قصار السور کا لفظی ترجمہ", "عقیدہ، آخرت اور انسانی اخلاق کے قرآنی دلائل"] },
          { title: "مرحلہ ۳: منتخب جامع سورتیں", topics: ["سورۃ الکہف: فتنوں سے نجات کے چار رہنما واقعات", "سورۃ یٰس: رسالت اور حیات بعد الموت کی نشانیاں", "سورۃ الرحمٰن اور سورۃ الحجرات: آدابِ معاشرت اور انعامات"] }
        ]
      },
      {
        code: "06",
        name: "فہم الحدیث کورس (Authentic Hadith Studies)",
        shortDesc: "صحیح احادیث نبوی ﷺ کا ترجمہ، مختصر تشریح اور اخلاقی اسباق۔",
        audience: "نوجوانوں، بڑوں اور اسلامیات کے طلبہ کے لیے",
        duration: "۳ تا ۴ ماہ",
        sessions: "۲۴ سیشنز",
        track: "islamic",
        prerequisites: "کوئی پیشگی شرط نہیں۔",
        outcomes: [
          "اربعین نووی (۴۰ منتخب احادیث) کا مکمل مطالعہ",
          "حدیث کی دینی اہمیت اور حجیت کا کامل شعور",
          "سنتِ نبوی ﷺ کے مطابق اخلاقیات اور معمولات کی تشکیل"
        ],
        modules: [
          { title: "مرحلہ ۱: حدیث کی اہمیت اور اربعین نووی", topics: ["حدیث اور سنت کا فرق اور اس کی شرعی حیثیت", "حدیث ۱ تا ۱۰: نیت کی اہمیت، ارکانِ اسلام اور ایمان", "حلال و حرام کی وضاحت اور دین میں خلوص"] },
          { title: "مرحلہ ۲: اسلامی اخلاق اور حقوق العباد", topics: ["حدیث ۱۱ تا ۲۵: حسنِ خلق، سچائی اور پڑوسیوں کے حقوق", "غصے پر قابو، ایذارسانی سے ممانعت اور مسلمان کا احترام", "صدقہ، بھلائی کا حکم اور برائی سے روکنا"] }
        ]
      },
      {
        code: "07",
        name: "سیرت النبی ﷺ کورس (Prophetic Seerah)",
        shortDesc: "حیاتِ طیبہ ﷺ کے ایمان افروز مراحل، اخلاقِ کریمانہ اور اسوۂ حسنہ۔",
        audience: "بچوں، نوجوانوں اور پورے خاندان کے لیے",
        duration: "۳ ماہ",
        sessions: "۲۴ سیشنز",
        track: "islamic",
        prerequisites: "کوئی پیشگی شرط نہیں۔",
        outcomes: [
          "حضور اکرم ﷺ کی حیاتِ مبارکہ کا مستند تاریخی فہم",
          "مشکلات میں صبر، استقامت اور حکمتِ نبوی ﷺ کا ادراک",
          "معاشرتی، خاندانی اور تعلیمی زندگی میں سنت کی پیروی"
        ],
        modules: [
          { title: "مرحلہ ۱: مکی دور کی سیرت", topics: ["نسبِ مبارک، ولادتِ باسعادت اور بچپن", "حلف الفضول، تجارتی اسفار اور حجرِ اسود کا فیصلہ", "نزولِ وحی، دعوتِ توحید اور صحابہ کرام کی قربانیاں", "شعب ابی طالب کی محاصرہ اور واقعہ معراج"] },
          { title: "مرحلہ ۲: مدنی دور اور ریاستِ مدینہ", topics: ["ہجرتِ مدینہ، مواخات اور میثاقِ مدینہ", "غزوات (بدر، احد، خندق) اور صلح حدیبیہ کی حکمت", "فتحِ مکہ، خطبہ حجۃ الوداع اور وصالِ مبارک"] }
        ]
      },
      {
        code: "08",
        name: "اسلامی عقیدہ و ایمانیات (Islamic Aqeedah)",
        shortDesc: "توحید، رسالت، آخرت اور ارکانِ ایمان کے بنیادی و ضروری عقائد۔",
        audience: "بنیادی اسلامی تعلیم حاصل کرنے والے تمام افراد",
        duration: "۲ ماہ",
        sessions: "۱۶ سیشنز",
        track: "islamic",
        prerequisites: "کوئی پیشگی شرط نہیں۔",
        outcomes: [
          "اسلامی عقائد کی قرآنی اور عقلی دلائل کے ساتھ تفہیم",
          "شرک اور بدعت کی قباحتوں سے مکمل آگاہی",
          "ایمانیات کے بارے میں دل کا پختہ اور مطمئن ہونا"
        ],
        modules: [
          { title: "مرحلہ ۱: توحید اور صفاتِ الٰہیہ", topics: ["وجودِ باری تعالیٰ کے دلائل اور توحید فی الذات", "توحید فی الصفات اور توحید فی العبادت", "شرک کی اقسام اور اس سے بچاؤ"] },
          { title: "مرحلہ ۲: رسالت، ملائکہ اور یومِ آخرت", topics: ["انبیاء کرام کے اوصاف اور ختمِ نبوت کی اہمیت", "آسمانی کتب اور فرشتوں پر ایمان", "قبر، حشر، میزان، پل صراط اور جنت و دوزخ کا فہم"] }
        ]
      },
      {
        code: "09",
        name: "فقہ العبادات (Fiqh of Daily Worship)",
        shortDesc: "طہارت، وضو، غسل، نماز، روزہ، زکوٰۃ اور روزمرہ احکام۔",
        audience: "نوجوانوں، خواتین اور عامۃ المسلمین کے لیے",
        duration: "۳ ماہ",
        sessions: "۲۴ سیشنز",
        track: "islamic",
        prerequisites: "کوئی پیشگی شرط نہیں۔",
        outcomes: [
          "طہارت اور پاکی کے مسائل کی مکمل درستگی",
          "پانچ وقت کی نماز کے فرائض، واجبات اور سنن کا علم",
          "روزے اور زکوٰۃ کے روزمرہ حساب و مسائل کا فہم"
        ],
        modules: [
          { title: "مرحلہ ۱: کتاب الطہارۃ", topics: ["پانی کی اقسام، نجاستِ غلیظہ و خفیفہ کی پاکی", "وضو کا مسنون طریقہ، فرائض اور نواقض", "غسل کے فرائض، مسنون طریقہ اور تیمم کے احکام"] },
          { title: "مرحلہ ۲: کتاب الصلاۃ", topics: ["نماز کے شرائط و ارکان اور اوقات", "واجبات، سنن، مستحبات اور مکروہاتِ نماز", "سجدۂ سہو، نمازِ قضا، مسافر اور مریض کی نماز", "نمازِ جنازہ، عیدین اور نمازِ وتر کے احکام"] }
        ]
      },
      {
        code: "10",
        name: "نماز، مسنون دعائیں اور آداب (Salah, Duas & Manners)",
        shortDesc: "مکمل مسنون نماز، ضروری دعائیں، کلمے اور اسلامی آداب۔",
        audience: "کم عمر بچوں اور نئے سیکھنے والوں کے لیے",
        duration: "۲ تا ۳ ماہ",
        sessions: "۲۴ سیشنز",
        track: "islamic",
        prerequisites: "کوئی پیشگی شرط نہیں۔",
        outcomes: [
          "تکبیرِ تحریمہ سے سلام تک نماز کا زبانی اور عملی حفظ",
          "روزمرہ زندگی کی ۲۰ اہم مسنون دعاؤں کا حفظ مع مفہوم",
          "والدین، اساتذہ اور چھوٹوں کے ساتھ شائستہ اسلامی آداب"
        ],
        modules: [
          { title: "مرحلہ ۱: نماز کا مکمل طریقہ", topics: ["قیام، ثناء، تعوذ، تسمیہ اور سورۃ الفاتحہ", "رکوع، تسمیع، تحمید اور سجدے کی تسبیحات", "تشہد (التحیات)، درودِ ابراہیمی اور دعائے ماثورہ", "دعائے قنوت اور سلام کا طریقہ"] },
          { title: "مرحلہ ۲: کلمے اور مسنون دعائیں", topics: ["چھ کلمے مع ترجمہ و فہم", "کھانے، پینے، سونے، جاگنے اور واش روم آنے جانے کی دعائیں", "گھر سے نکلنے، سواری پر بیٹھنے اور مسجد میں داخلے کی دعائیں", "سلام کرنا، مصافحہ اور چھینک کا جواب دینے کے آداب"] }
        ]
      },
      {
        code: "11",
        name: "عربی زبان برائے فہمِ قرآن (Quranic Arabic)",
        shortDesc: "قرآنی الفاظ کا ذخیرہ، بنیادی صرف و نحو اور عام قرآنی تراکیب۔",
        audience: "تلاوت کے دوران آیات کا مفہوم خود سمجھنے کے متمنی طلبہ",
        duration: "۶ ماہ",
        sessions: "۴۸ سیشنز",
        track: "advanced",
        prerequisites: "ناظرہ قرآن کریم روانی سے پڑھنے کی اہلیت۔",
        outcomes: [
          "قرآنِ مجید میں بار بار آنے والے ۷۰٪ الفاظ کا راست فہم",
          "عربی کلمہ، اسم، فعل اور حرف کی باآسانی پہچان",
          "قرآنی جملوں کا تجزیہ اور نماز میں معنی پر غور"
        ],
        modules: [
          { title: "مرحلہ ۱: بنیادی قواعد (علم النحو)", topics: ["کلمہ کی اقسام اور اسم کی علامات", "مذکر و مؤنث، واحد، تثنیہ اور جمع", "مرکب توصیفی اور مرکب اضافی کی مثالیں"] },
          { title: "مرحلہ ۲: افعال و گردانیں (علم الصرف)", topics: ["فعل ماضی کے ۱۴ صیغے اور قرآنی امثلہ", "فعل مضارع کی علامات اور گردان", "فعل امر، نہی اور ثلاثی مجرد کے بنیادی ابواب", "قرآنی دعاؤں کا صرفی و نحوی تجزیہ"] }
        ]
      },
      {
        code: "12",
        name: "قراءاتِ سبعہ و عشرہ کا تعارف (Qira'at Studies)",
        shortDesc: "قراءات کے اسانید، ائمہ سبعہ و عشرہ اور تواترِ قرآن کی علمی تحقیق۔",
        audience: "حفاظ، قراء اور علومِ اسلامیہ کے اعلیٰ سطح کے طلبہ",
        duration: "۴ تا ۶ ماہ",
        sessions: "۳۶ سیشنز",
        track: "advanced",
        prerequisites: "حفظِ قرآن یا تجوید کورس کی تکمیل۔",
        outcomes: [
          "سبعہ و عشرہ قراءات کے متواتر اصولوں کا تفصیلی علم",
          "قراءتِ عاصم (حفص و شعبہ) کے مابین صوتی فرق کا فہم",
          "قرآنِ مجید کے اختلافِ قراءات میں پوشیدہ معنوی بلاغت کی معرفت"
        ],
        modules: [
          { title: "مرحلہ ۱: تاریخِ قراءات و اسانید", topics: ["حدیثِ سبعۃ احرف کی مستند شرح", "تواترِ قراءات اور رسمِ عثمانی کا ربط", "ائمہ عشرہ (نافع، ابن کثیر، ابو عمرو، ابن عامر، عاصم، حمزہ، کسائی وغیرہ) کے حالات"] },
          { title: "مرحلہ ۲: اصول اور فرشی کلمات کا موازنہ", topics: ["روایتِ حفص اور روایتِ ورش کا موازنہ", "امالہ، تسہیل، ادغامِ کبیر اور نقل کی علامات", "قصار السور میں ائمہ کی قراءات کا عملی مشق"] }
        ]
      }
    ]
  },

  en: {
    dir: "ltr",
    academy: "Farooqi Online Quran Academy",
    other: "اردو",
    otherPath: "/ur",
    home: "Home",
    about: "About",
    courses: "Courses & Outlines",
    qaida: "Noorani Qaida",
    quranPlayer: "Quran Recitation",
    teachers: "Our Teachers",
    fees: "Fee Calculator",
    trial: "Free Trial",
    contact: "Contact",
    portal: "Portal Login",
    tagline: "Learn the Quran with Tajweed, care and confidence",
    intro:
      "Farooqi Online Quran Academy (Lahore, Pakistan) provides private one-to-one online Quran education and Islamic studies worldwide with certified scholars and female tutors.",

        aboutPoints: [
      ["50+ Students", "Students of all ages and levels currently enrolled worldwide."],
      ["5 Certified Scholars", "Qualified male and female scholars with Sanad in Qira'at."],
      ["1-to-1 Private Classes", "Focused individual attention and personalized learning plans."],
      ["Flexible Global Schedules", "Convenient timings aligned with UK, USA, Gulf & Pakistan."]
    ],
    trialTitle: "Free Trial Class",
    trialIntro: "Experience our live interactive teaching with a complimentary evaluation session before formal enrollment.",
    trialSteps: [
      "Submit student details and learning background",
      "Level assessment and course recommendation",
      "Schedule matching with preferred teacher",
      "Live 1-to-1 free trial session",
      "Feedback, teacher evaluation and formal admission"
    ],
    feesTitle: "Tuition & Fee Plans",
    feesIntro: "Affordable monthly fee packages customized by country, weekly class frequency and lesson duration.",
    contactTitle: "Contact Us",
    contactIntro: "Get in touch directly via WhatsApp, phone or email for admissions, fee inquiries, or trial scheduling.",
    coursesList: [
      ["Noorani Qaida (Foundations)", "Letter articulation, phonetics and basic reading"],
      ["Nazra Quran with Tajweed", "Fluent recitation with correct Makharīj"],
      ["Hifz-ul-Quran (Memorization)", "Daily lesson, revision (Sabqi & Manzil) and retention"],
      ["Advanced Tajweed Rules", "In-depth study of Sifat, Makharīj and Tuhfat-ul-Atfal"],
      ["Quran Translation & Tafseer", "Word-by-word meaning, context and contemporary lessons"],
      ["Islamic Essentials & Daily Duas", "Salah, purification, beliefs and morning/evening Adhkar"],
      ["Selected Hadith Study", "Character building, ethics and Prophetic wisdom"],
      ["Seerat-un-Nabi & Islamic History", "Comprehensive study of the life of the Prophet ﷺ"],
      ["Basic Fiqh & Daily Rulings", "Purification, prayer, fasting and essential rulings"],
      ["Conversational Spoken Arabic", "Everyday Quranic and standard Arabic dialogues"],
      ["Quranic Arabic Grammar (Nahw & Sarf)", "Grammatical parsing and sentence structures"],
      ["Introduction to 7 & 10 Qira'at", "Canonical recitations and comparative readings"]
    ],
    teachersList: [
      {
        name: "Qari Muhammad Umar Farooqi",
        qualification: "Fazil Qira'at Sab'ah & 'Asharah, Dars-e-Nizami",
        role: "Founder & Principal, Master of Qira'at & Tajweed",
        experience: "10+ Years Teaching Experience",
        bio: "Graduate of Dars-e-Nizami (Shahadat-ul-Alimiyyah) from Wifaq-ul-Madaris Al-Arabiyyah and certified master of 7 and 10 Qira'at. Expert in Hifz, advanced Tajweed articulation, and online education worldwide.",
        specialties: ["10 Qira'at Recitations", "Hifz-ul-Quran", "Advanced Tajweed & Makharij", "Dars-e-Nizami & Tafsir"]
      },
      {
        name: "Hafiz Samiullah",
        qualification: "Fazil Qira'at 'Asharah, Dars-e-Nizami",
        role: "Senior Tutor - Hifz & Tajweed",
        experience: "8+ Years Teaching Experience",
        bio: "Certified scholar in 10 Qira'at and Dars-e-Nizami. Renowned for his structured Sabaq, Sabqi and Manzil memorization methodology and firm student retention.",
        specialties: ["Hifz Memorization & Retention", "Qira'at 'Asharah", "Nazra Quran with Tajweed", "Applied Articulation"]
      },
      {
        name: "Hafiz Talha Haneef",
        qualification: "Fazil Qira'at 'Asharah, Dars-e-Nizami",
        role: "Tutor - Qira'at & Fluent Quran Reading",
        experience: "7+ Years Teaching Experience",
        bio: "Certified scholar in 10 Qira'at and Dars-e-Nizami. Specialist in Makharij, vocal quality, characteristics of letters, and patient guidance for children and beginners.",
        specialties: ["Letter Articulation & Sifaat", "Melodious Recitation", "Noorani Qaida", "Quran Comprehension"]
      },
      {
        name: "Ustadha Aneesa Inayat",
        qualification: "Dars-e-Nizami Graduate",
        role: "Senior Female Tutor (Sisters & Girls)",
        experience: "7+ Years Teaching Experience",
        bio: "Graduate of Dars-e-Nizami. Highly experienced female scholar dedicated exclusively to women and girls in Tajweed, Quran Translation, Daily Fiqh, and Islamic Ethics.",
        specialties: ["Teaching Sisters & Young Girls", "Tajweed & Nazra Quran", "Tafsir & Translation", "Fiqh of Daily Worship"]
      },
      {
        name: "Ustadha Khansa Haneef",
        qualification: "Dars-e-Nizami Graduate",
        role: "Female Tutor - Noorani Qaida & Nazra",
        experience: "6+ Years Teaching Experience",
        bio: "Graduate of Dars-e-Nizami. Specialist in early childhood Noorani Qaida foundation, correct pronunciation, Sunnah Duas, Salah, and Islamic manners with patience and care.",
        specialties: ["Kids' Noorani Qaida", "Salah & Sunnah Duas", "Pronunciation Correction", "Islamic Character Building"]
      }
    ],

    coursesDetailed: [
      {
        code: "01",
        name: "Noorani Qaida",
        shortDesc: "Arabic letters, vowels, joining, sukoon, shaddah and correct pronunciation.",
        audience: "Beginners, children and young learners",
        duration: "2 to 3 months",
        sessions: "24 to 36 private sessions",
        track: "quran",
        prerequisites: "No prior knowledge required; starts from the very basics.",
        outcomes: [
          "Mastering the 17 authentic articulation points (Makharij)",
          "Distinguishing short vowels, double vowels (Tanween) and resting letters",
          "Reading compound Arabic words fluently without spelling out letters",
          "Seamless transition to reading the Holy Quran with correct phonetics"
        ],
        modules: [
          { title: "Module 1: The 29 Arabic Letters", topics: ["Letter shapes and accurate pronunciation", "Heavy (Mufakhkham) vs. Light (Muraqqaq) letters", "Throat, tongue and lip articulation points"] },
          { title: "Module 2: Joint Letter Shapes", topics: ["Beginning, middle and end letter forms", "Compound letters (Murakkabat)", "Opening disjointed letters (Muqatta'at)"] },
          { title: "Module 3: Short & Double Vowels", topics: ["Fathah, Kasrah, and Dammah (Harakat)", "Tanween (Double vowels producing Noon Saakin)", "Crisp pronunciation without unintended stretching"] },
          { title: "Module 4: Madd & Leen Letters", topics: ["Natural 2-count elongation with Alif, Waw, Yaa", "Soft Waw Leen and Yaa Leen articulation", "Standing vowels (Khari Harakat)"] },
          { title: "Module 5: Sukoon & Qalqalah", topics: ["Resting letters with Sukoon (Jazm)", "Echoing Qalqalah on Qaf, Taa, Baa, Jeem, Daal", "Hamzah Saakinah crisp articulation"] },
          { title: "Module 6: Shaddah & Ghunnah", topics: ["Doubled consonants with firm pressure (Tashdeed)", "Obligatory 2-count nasal Ghunnah on Noon/Meem Mushaddad", "Comprehensive review and transition assessment"] }
        ]
      },
      {
        code: "02",
        name: "Fluent Quran Reading with Tajweed",
        shortDesc: "Fluent recitation of the complete Holy Quran with applied Tajweed rules.",
        audience: "Learners who have completed Qaida or wish to refine fluency",
        duration: "6 to 12 months",
        sessions: "70 to 120 private sessions",
        track: "quran",
        prerequisites: "Completion of Noorani Qaida or basic Arabic reading skills.",
        outcomes: [
          "Fluent, error-free recitation across all 30 Ajzaa of the Quran",
          "Spontaneous application of Tajweed rules while reciting",
          "Respecting stopping signs (Waqf) and breath management",
          "Confidence in reciting longer passages during Salah"
        ],
        modules: [
          { title: "Module 1: Juz 30 (Juz 'Amma) Foundation", topics: ["Short Surah recitation and articulation refinement", "Rules of Ta'awwudh and Basmalah", "Salah Surahs memorization and correction"] },
          { title: "Module 2: The 4 Rules of Noon Saakin & Tanween", topics: ["Izhar Halqi (Clear pronunciation without Ghunnah)", "Idgham (Merging with and without Ghunnah)", "Iqlab (Transforming Noon to Meem before Baa)", "Ikhfa Haqiqi (Hiding with nasal Ghunnah on 15 letters)"] },
          { title: "Module 3: Rules of Meem Saakin, Raa & Lam", topics: ["Ikhfa Shafawi, Idgham Shafawi and Izhar Shafawi", "Heavy and light Raa articulation conditions", "Rules of Lam in the Divine Name (Lafz-ul-Jalalah)"] },
          { title: "Module 4: Quranic Stopping Symbols (Waqf)", topics: ["Compulsory, absolute, permissible and prohibited stops", "Safe breath pausing and resumption techniques", "Verses of Sajdah-e-Tilawah"] },
          { title: "Module 5: Complete Quran Cover-to-Cover Recitation", topics: ["Juz 1 to 15 fluent recitation pacing", "Juz 16 to 30 melodious and measured recitation", "Graduation assessment and completion certificate"] }
        ]
      },
      {
        code: "03",
        name: "Tajweed Mastery Course",
        shortDesc: "In-depth articulation, letter characteristics, stopping rules and Qira'at certification.",
        audience: "Learners seeking professional, beautiful recitation standards",
        duration: "4 to 6 months",
        sessions: "48 private sessions",
        track: "quran",
        prerequisites: "Fluent Quran reading ability.",
        outcomes: [
          "Theoretical and practical mastery of all 17 Makharij",
          "Exact application of opposing and non-opposing Sifaat",
          "Precise measurement of Madd counts (2, 4, 5, 6 Harakat)",
          "Formal certification in the narration of Hafs 'an 'Asim"
        ],
        modules: [
          { title: "Module 1: Foundations & The 17 Makharij", topics: ["History and obligation of Tajweed; avoiding major/minor errors", "The 5 major areas and 17 specific articulation points", "Hands-on diagnostic correction with certified Qaris"] },
          { title: "Module 2: Sifaat (Letter Characteristics)", topics: ["Opposing characteristics (Hams vs. Jahr, Shiddah vs. Rakhawah)", "Elevation (Isti'laa) vs. Lowering (Istifal)", "Non-opposing characteristics (Qalqalah, Leen, Safeer, Tafashshi)"] },
          { title: "Module 3: Advanced Madd (Elongation) Rules", topics: ["Natural Madd (Tabee'ee, Badal, 'Iwad, Silah Sughra)", "Madd caused by Hamzah (Muttasil, Munfasil, Silah Kubra)", "Madd caused by Sukoon ('Aarid lil-Sukoon, Leen, Lazim Kalimi & Harfi)"] },
          { title: "Module 4: Waqf, Ibtida & Special Quranic Words", topics: ["Complete, sufficient, good and repulsive stopping rules", "Rules of identical, similar and close letters (Mithlayn, Mutaqaribayn)", "Authentic narration standards and practical evaluation"] }
        ]
      },
      {
        code: "04",
        name: "Quran Memorization (Hifz)",
        shortDesc: "Structured daily new lesson, recent revision and permanent retention plan.",
        audience: "Dedicated children, teenagers and adults",
        duration: "2 to 3 years (Customized pacing)",
        sessions: "5 or 6 sessions weekly",
        track: "quran",
        prerequisites: "Fluent Quran reading with proper Tajweed.",
        outcomes: [
          "Solid memorization of the entire 30 Juz of the Quran",
          "Mastery of Mutashabihat (verses with similar phrasing)",
          "Daily discipline of reciting memorized portions without hesitation",
          "Formal Hifz completion certificate and graduation honor"
        ],
        modules: [
          { title: "Track 1: Daily New Sabaq", topics: ["Daily memorization of 1/2 to 1 page under teacher supervision", "Phonetic connection and retention technique", "Immediate live recitation to the tutor"] },
          { title: "Track 2: Sabqi (Recent Memorized Juz)", topics: ["Daily recitation of all newly memorized pages of current Juz", "Connecting verses and mastering similar wording (Mutashabihat)", "Juz completion evaluation before opening the next Juz"] },
          { title: "Track 3: Permanent Manzil (Cumulative Revision)", topics: ["Daily recitation of 1 full previously memorized Juz", "Systematic rotating revision cycle preventing forgetfulness", "Monthly mock exams recorded on the Parent Portal"] }
        ]
      },
      {
        code: "05",
        name: "Quran Translation & Tafsir",
        shortDesc: "Clear word-by-word translation, core meanings, revelation context and practical lessons.",
        audience: "Youth and adults seeking deep understanding of divine revelation",
        duration: "6 to 12 months",
        sessions: "2 or 3 sessions weekly",
        track: "quran",
        prerequisites: "Ability to read the Quran in Arabic.",
        outcomes: [
          "Direct understanding of frequent Quranic vocabulary",
          "Comprehending the themes, context and divine purpose of Surahs",
          "Spiritual reflection (Tadabbur) during daily recitation and Salah",
          "Practical application of Quranic ethics to modern life"
        ],
        modules: [
          { title: "Module 1: Principles of Quranic Exegesis", topics: ["Introduction to 'Ulum-ul-Quran (Quranic Sciences)", "Makki vs. Madani themes and contexts", "Key rhetorical devices in the divine text"] },
          { title: "Module 2: Surah Al-Fatihah & Juz 'Amma", topics: ["Deep exegesis of Surah Al-Fatihah as the core of the Quran", "Word-by-word translation of Surahs 78 to 114", "Belief in accountability, resurrection and noble character"] },
          { title: "Module 3: Selected Comprehensive Surahs", topics: ["Surah Al-Kahf: Timeless lessons from 4 central trials", "Surah Ya-Sin: Proofs of prophethood and resurrection", "Surahs Ar-Rahman & Al-Hujurat: Universal blessings and societal ethics"] }
        ]
      },
      {
        code: "06",
        name: "Authentic Hadith Studies",
        shortDesc: "Study of selected authentic Hadith with translation, explanation and life lessons.",
        audience: "Teenagers and adults",
        duration: "3 to 4 months",
        sessions: "24 private sessions",
        track: "islamic",
        prerequisites: "None.",
        outcomes: [
          "Complete study of the 40 Hadith of Imam An-Nawawi",
          "Understanding the authority and preservation of the Sunnah",
          "Implementing Prophetic character and manners in everyday life"
        ],
        modules: [
          { title: "Module 1: Nawawi's 40 Hadith Foundation", topics: ["The authority of the Sunnah and Hadith terminology", "Hadith 1–10: Sincerity of intentions, pillars of Islam & Iman", "Halal, Haram, and purity of heart"] },
          { title: "Module 2: Prophetic Character & Rights", topics: ["Hadith 11–25: Truthfulness, controlling anger, rights of neighbors", "Loving for your brother what you love for yourself", "Daily charity and enjoining good"] }
        ]
      },
      {
        code: "07",
        name: "Seerah of the Prophet ﷺ",
        shortDesc: "Chronological study of the Prophetic life, noble character and leadership.",
        audience: "Children, youth and families",
        duration: "3 months",
        sessions: "24 private sessions",
        track: "islamic",
        prerequisites: "None.",
        outcomes: [
          "Comprehensive knowledge of the Prophet's ﷺ life",
          "Deep love, reverence and emulation of his character",
          "Practical leadership, patience and family guidance"
        ],
        modules: [
          { title: "Module 1: The Makkan Period", topics: ["Blessed birth, lineage, early childhood and noble youth", "Hilf al-Fudul and the title of Al-Ameen", "First revelation at Cave Hira and early persecution", "Boycott in the Valley of Abu Talib and Al-Isra wal-Mi'raj"] },
          { title: "Module 2: The Madinan Period & Legacy", topics: ["Hijrah to Madinah, Brotherhood (Muwakhat) and the Constitution", "Key events of Badr, Uhud and the Treaty of Hudaybiyyah", "Conquest of Makkah, the Farewell Sermon, and the Prophet's legacy"] }
        ]
      },
      {
        code: "08",
        name: "Aqeedah & Islamic Beliefs",
        shortDesc: "Tawheed, Prophethood, the Hereafter and foundational Islamic theology.",
        audience: "All learners seeking firm grounding in faith",
        duration: "2 months",
        sessions: "16 private sessions",
        track: "islamic",
        prerequisites: "None.",
        outcomes: [
          "Clear understanding of the 6 pillars of Iman with proofs",
          "Recognizing the categories of Tawheed and avoiding Shirk",
          "Firm intellectual clarity against modern doubts"
        ],
        modules: [
          { title: "Module 1: Tawheed & Divine Attributes", topics: ["Proofs of the Creator's existence and Tawheed in Lordship", "Tawheed in Worship and the nullifiers of faith", "Understanding the Beautiful Names of Allah"] },
          { title: "Module 2: Prophethood & The Unseen World", topics: ["Characteristics of Prophets and finality of Prophethood", "Angels, Divine Books, and Destiny (Qadar)", "The Grave, the Day of Judgment, Paradise and Hellfire"] }
        ]
      },
      {
        code: "09",
        name: "Fiqh of Daily Worship",
        shortDesc: "Essential rulings on purification, daily prayers, fasting and Zakat.",
        audience: "Teenagers, sisters and adults",
        duration: "3 months",
        sessions: "24 private sessions",
        track: "islamic",
        prerequisites: "None.",
        outcomes: [
          "Correct performance of Wudu, Ghusl and ritual purification",
          "Knowing the obligatory, Sunnah and invalidating aspects of Salah",
          "Fasting rules, missed prayers, and Zakat calculations"
        ],
        modules: [
          { title: "Module 1: Purification (Taharah)", topics: ["Types of water and removing impurities", "Obligatory and Sunnah acts of Wudu and nullifiers", "Rules of Ghusl and Tayammum (dry ablution)"] },
          { title: "Module 2: Daily Prayers (Salah)", topics: ["Conditions, pillars, and timings of the five prayers", "Prostration of forgetfulness (Sajdah Sahw)", "Traveler's prayer (Qasr), funeral prayer (Janazah) and Eid prayers", "Fasting essentials and Zakat fundamentals"] }
        ]
      },
      {
        code: "10",
        name: "Salah, Duas & Daily Manners",
        shortDesc: "Complete prayer method, daily Sunnah supplications, Kalimahs and Islamic etiquette.",
        audience: "Children and new learners",
        duration: "2 to 3 months",
        sessions: "24 private sessions",
        track: "islamic",
        prerequisites: "None.",
        outcomes: [
          "Flawless prayer performance from Takbir to Salam with meaning",
          "Memorizing 20+ daily Sunnah Duas with translation",
          "Practicing Islamic manners with parents, teachers, and peers"
        ],
        modules: [
          { title: "Module 1: The Complete Step-by-Step Prayer", topics: ["Physical postures (Qiyam, Ruku, Sujood, Jalsah)", "Memorizing Thana, Tashahhud, Durood and Duas", "Du'a al-Qunoot and prayer after Salam"] },
          { title: "Module 2: The Six Kalimahs & Daily Duas", topics: ["The 6 Kalimahs with clear pronunciation and meaning", "Duas for eating, sleeping, waking, entering/leaving the house", "Etiquette of greeting with Salam, sneezing, and respect"] }
        ]
      },
      {
        code: "11",
        name: "Quranic Arabic & Grammar",
        shortDesc: "High-frequency Quranic vocabulary, basic morphology and foundational Arabic grammar.",
        audience: "Learners seeking direct Arabic comprehension while reciting",
        duration: "6 months",
        sessions: "48 private sessions",
        track: "advanced",
        prerequisites: "Fluent Quran reading ability.",
        outcomes: [
          "Understanding 70%+ of recurring Quranic vocabulary directly",
          "Identifying nouns, verbs, prepositions and case endings",
          "Analyzing Quranic sentence structures without relying on translation"
        ],
        modules: [
          { title: "Module 1: Basic Grammar (Nahw)", topics: ["The 3 parts of speech: Ism, Fi'l, and Harf", "Gender, number (singular, dual, plural), and definiteness", "Descriptive phrases (Murakkab Tauseefi) and possessive phrases (Idhafah)"] },
          { title: "Module 2: Verb Conjugations (Sarf)", topics: ["Past tense (Madi) 14 verb conjugations with Quranic examples", "Present/future tense (Mudari') and command verbs (Amr)", "Frequent Quranic patterns and analytical verse breakdowns"] }
        ]
      },
      {
        code: "12",
        name: "Introduction to 7 & 10 Qira'at",
        shortDesc: "History, transmission chains, the 10 canonical recitations and divine variations.",
        audience: "Huffaz, scholars and advanced Quranic students",
        duration: "4 to 6 months",
        sessions: "36 private sessions",
        track: "advanced",
        prerequisites: "Hifz completion or Tajweed mastery.",
        outcomes: [
          "In-depth scholarly knowledge of the canonical Qira'at",
          "Understanding the differences between Hafs and other narrations",
          "Recognizing the linguistic and rhetorical wisdom in variant readings"
        ],
        modules: [
          { title: "Module 1: History & Transmission", topics: ["The Hadith of the 7 Ahruf and its scholarly explanation", "The preservation of the Uthmanic codex (Rasm 'Uthmani)", "Biographies of the 10 Imams and their 20 transmitters (Ruwat)"] },
          { title: "Module 2: Comparative Practical Readings", topics: ["Comparing the narration of Hafs with Warsh and Shu'bah", "Rules of Imalah, Tashil, Naql and Idgham Kabir", "Practical comparative recitation in short Surahs"] }
        ]
      }
    ]
  }
} as const;
