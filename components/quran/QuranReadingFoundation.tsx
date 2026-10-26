"use client";

import { useState } from "react";
import { QURAN_FOUNDATION_UNITS } from "@/lib/quranReadingFoundation";

export default function QuranReadingFoundation() {
  const unit = QURAN_FOUNDATION_UNITS[0];
  const [active,setActive]=useState(0);
  const word=unit.words[active];

  return <div className="quran-foundation" dir="rtl">
    <section className="quran-foundation-warning">
      <strong>Quran Reading Engine — Foundation</strong>
      <p>یہ ابھی مکمل قرآن module نہیں ہے۔ Production میں مصدقہ قرآن متن، word mapping، تجویدی metadata اور verified audio source استعمال کیا جائے گا۔</p>
    </section>

    <section className="quran-word-card">
      <span>Surah {unit.surahNumber} • Ayah {unit.ayahNumber}</span>
      <div className="quran-main-word">{word.text}</div>
      <div className="quran-segment-row">
        {word.segments.map((s,i)=><button key={i}><strong>{s.text}</strong><small>{s.labelUr}</small></button>)}
      </div>
      <p>{word.teacherNoteUr}</p>
    </section>

    <section className="quran-engine-roadmap">
      <h2>اگلے Quran Engine اجزاء</h2>
      <div>
        <article><strong>1</strong><span>Verified Mushaf text</span></article>
        <article><strong>2</strong><span>Word-by-word audio</span></article>
        <article><strong>3</strong><span>Letter/segment recognition</span></article>
        <article><strong>4</strong><span>Tajweed metadata</span></article>
        <article><strong>5</strong><span>Student recording</span></article>
        <article><strong>6</strong><span>Teacher review</span></article>
      </div>
    </section>
  </div>;
}
