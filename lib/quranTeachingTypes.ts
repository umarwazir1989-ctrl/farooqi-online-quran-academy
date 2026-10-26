export type QuranWord = {
  id?: number;
  position?: number;
  text?: string;
  text_uthmani?: string;
  text_indopak?: string;
  audio_url?: string | null;
  audioUrl?: string | null;
  location?: string;
  char_type_name?: string;
  translation?: { text?: string };
  transliteration?: { text?: string };
};

export type QuranVerse = {
  id?: number;
  verse_key: string;
  text_uthmani?: string;
  text_indopak?: string;
  words?: QuranWord[];
};

export type QuranChapter = {
  id: number;
  name_simple?: string;
  name_arabic?: string;
  verses_count?: number;
};
