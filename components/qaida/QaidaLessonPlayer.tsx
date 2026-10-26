"use client";

import { useState } from "react";
import type { QaidaLesson } from "@/lib/qaidaCurriculum";
import { qaidaAudioUrl } from "@/lib/qaidaAudio";
import QaidaAttemptRecorder from "@/components/qaida/QaidaAttemptRecorder";

export default function QaidaLessonPlayer({
  lesson,
}: {
  lesson: QaidaLesson;
}) {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState(
    "کارڈ منتخب کریں، آواز سنیں، خود پڑھیں اور استاد کو recording بھیجیں۔"
  );

  const item = lesson.items[active];

  async function play() {
    const url = qaidaAudioUrl(item.audioKey);

    if (!url) {
      setMessage("اس مشق کی audio mapping ابھی teacher verification کی منتظر ہے۔");
      return;
    }

    try {
      const audio = new Audio(url);
      await audio.play();
      setMessage("آڈیو سنیں، پھر بغیر غیر ضروری کھینچاؤ کے خود دہرائیں۔");
    } catch {
      setMessage("Mapped audio file نہیں ملی۔ Phase 11C audio package دوبارہ check کریں۔");
    }
  }

  return (
    <div className="qaida-lesson-player" dir="rtl">
      <section className="qaida-lesson-head">
        <span>سبق {lesson.number}</span>
        <h2>{lesson.titleUr}</h2>
        <p>{lesson.descriptionUr}</p>
      </section>

      <div className="qaida-card-grid">
        {lesson.items.map((entry, index) => (
          <button
            key={`${entry.text}-${index}`}
            className={`qaida-study-card ${index === active ? "active" : ""}`}
            onClick={() => {
              setActive(index);
              setMessage(entry.hintUr);
            }}
          >
            <strong>{entry.text}</strong>
            <small>{entry.hintUr}</small>
          </button>
        ))}
      </div>

      <section className="qaida-focus-card">
        <div className="qaida-focus-text">{item.text}</div>
        <p>{item.hintUr}</p>

        <div className="qaida-focus-actions">
          <button onClick={play}>🔊 نمونہ آواز سنیں</button>
          <button
            onClick={() =>
              setMessage("اب خود پڑھیں، پھر نیچے اپنی آواز record کرکے استاد کو بھیجیں۔")
            }
          >
            📖 خود پڑھیں
          </button>
        </div>

        <div className="qaida-focus-message">{message}</div>

        <QaidaAttemptRecorder
          lessonSlug={lesson.slug}
          itemText={item.text}
          audioKey={item.audioKey}
        />
      </section>
    </div>
  );
}
