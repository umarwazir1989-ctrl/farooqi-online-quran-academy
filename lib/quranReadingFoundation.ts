export type QuranLearningSegment = {
  text: string;
  labelUr: string;
};

export type QuranLearningWord = {
  text: string;
  segments: QuranLearningSegment[];
  teacherNoteUr: string;
  audioKey?: string;
};

export type QuranLearningUnit = {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  titleUr: string;
  status: "foundation";
  words: QuranLearningWord[];
};

/**
 * FOUNDATION DATA ONLY.
 * This is intentionally a tiny demonstration dataset.
 * Production Quran text/audio/tajweed metadata must come from a verified,
 * versioned Quran data source and be reviewed before release.
 */
export const QURAN_FOUNDATION_UNITS: QuranLearningUnit[] = [
  {
    id: "demo-001",
    surahNumber: 1,
    ayahNumber: 1,
    titleUr: "قرآن Reading Engine — نمونہ ساخت",
    status: "foundation",
    words: [
      {
        text: "بِسْمِ",
        segments: [
          { text: "بِ", labelUr: "باء زیر" },
          { text: "سْ", labelUr: "سین ساکن" },
          { text: "مِ", labelUr: "میم زیر" },
        ],
        teacherNoteUr: "حروف اور حرکات الگ پہچانیں، پھر بغیر غیر ضروری وقفے کے جوڑ کر پڑھیں۔",
      },
    ],
  },
];
