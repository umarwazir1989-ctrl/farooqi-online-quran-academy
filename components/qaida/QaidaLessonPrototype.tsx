"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LessonPart = {
  id: string;
  letter: string;
  withHarakah: string;
  nameUr: string;
  articulationUr: string;
  audio: string;
};

const PARTS: LessonPart[] = [
  {
    id: "daad",
    letter: "ض",
    withHarakah: "ضَ",
    nameUr: "ضاد",
    articulationUr: "زبان کے ایک کنارہ کو اوپر کی داڑھوں کے ساتھ لگا کر ادا کیا جاتا ہے۔",
    audio: "/audio/qaida/phase11a/daad-fatha.mp3",
  },
  {
    id: "raa",
    letter: "ر",
    withHarakah: "رَ",
    nameUr: "راء",
    articulationUr: "زبان کی نوک کو اوپر کے سامنے والے دانتوں کی جڑ کے قریب لگا کر ادا کیا جاتا ہے۔",
    audio: "/audio/qaida/phase11a/raa-fatha.mp3",
  },
  {
    id: "baa",
    letter: "ب",
    withHarakah: "بَ",
    nameUr: "باء",
    articulationUr: "دونوں ہونٹ ملا کر آواز کے ساتھ ادا کیا جاتا ہے۔",
    audio: "/audio/qaida/phase11a/baa-fatha.mp3",
  },
];

const WORD_AUDIO = "/audio/qaida/phase11a/daraba.mp3";

export default function QaidaLessonPrototype() {
  const [selectedId, setSelectedId] = useState(PARTS[0].id);
  const [step, setStep] = useState<"letters" | "harakah" | "join" | "word">("letters");
  const [message, setMessage] = useState("کسی حرف پر کلک کریں اور اس کی پہچان کریں۔");
  const [completed, setCompleted] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const selected = useMemo(
    () => PARTS.find((part) => part.id === selectedId) || PARTS[0],
    [selectedId]
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fq_phase11a_progress");
      if (saved) setCompleted(JSON.parse(saved));
    } catch {}
  }, []);

  function saveCompleted(next: string[]) {
    setCompleted(next);
    try {
      window.localStorage.setItem("fq_phase11a_progress", JSON.stringify(next));
    } catch {}
  }

  async function playAudio(src: string, label: string) {
    const audio = new Audio(src);
    try {
      await audio.play();
      setMessage(`${label} کی مصدقہ آڈیو چل رہی ہے۔`);
    } catch {
      setMessage(
        "اس Prototype میں آڈیو پلیئر تیار ہے، مگر مصدقہ استاد/قاری کی MP3 فائل ابھی public/audio/qaida/phase11a میں رکھنی ہے۔"
      );
    }
  }

  function markDone(id: string) {
    if (!completed.includes(id)) saveCompleted([...completed, id]);
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("اس browser میں microphone recording دستیاب نہیں۔");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setMessage("آپ کی آواز محفوظ ہو گئی۔ اب خود سن کر مصدقہ آڈیو سے موازنہ کریں۔");
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setMessage("ریکارڈنگ جاری ہے… ضَرَبَ پڑھیں۔");
    } catch {
      setMessage("Microphone permission نہیں ملی۔ Browser سے microphone کی اجازت دیں۔");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  const progress = Math.round((completed.length / 4) * 100);

  return (
    <div className="qaida-prototype" dir="rtl">
      <section className="qaida-hero">
        <div>
          <span className="qaida-kicker">Phase 11A • Digital Quran Teacher</span>
          <h2>حرف سے لفظ تک — استاد کے انداز میں</h2>
          <p>پہلے حرف کی پہچان، پھر حرکت، پھر جوڑ، پھر مکمل لفظ اور آخر میں اپنی آواز کی مشق۔</p>
        </div>
        <div className="qaida-progress-card">
          <strong>{progress}%</strong>
          <span>نمونہ سبق مکمل</span>
          <div className="qaida-progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="qaida-panel">
        <div className="qaida-step-tabs">
          <button className={step === "letters" ? "active" : ""} onClick={() => setStep("letters")}>1. حروف کی پہچان</button>
          <button className={step === "harakah" ? "active" : ""} onClick={() => setStep("harakah")}>2. زبر کے ساتھ</button>
          <button className={step === "join" ? "active" : ""} onClick={() => setStep("join")}>3. حروف کو جوڑیں</button>
          <button className={step === "word" ? "active" : ""} onClick={() => setStep("word")}>4. مکمل لفظ</button>
        </div>

        {step === "letters" && (
          <div className="qaida-stage">
            <h3>ہر حرف پر کلک کریں</h3>
            <div className="qaida-letter-row">
              {PARTS.map((part, index) => (
                <button
                  key={part.id}
                  className={`qaida-letter-box qaida-color-${index + 1} ${selectedId === part.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedId(part.id);
                    setMessage(`${part.nameUr}: ${part.articulationUr}`);
                  }}
                >
                  <span>{part.letter}</span>
                  <small>{part.nameUr}</small>
                </button>
              ))}
            </div>

            <div className="qaida-detail-card">
              <div className="qaida-big-letter">{selected.letter}</div>
              <div>
                <h3>{selected.nameUr}</h3>
                <p>{selected.articulationUr}</p>
                <button className="qaida-audio-btn" onClick={() => playAudio(selected.audio, selected.nameUr)}>🔊 صحیح آواز سنیں</button>
                <button className="qaida-done-btn" onClick={() => markDone("letters")}>✓ حروف پہچان لیے</button>
              </div>
            </div>
          </div>
        )}

        {step === "harakah" && (
          <div className="qaida-stage">
            <h3>اب ہر حرف کو زبر کے ساتھ پڑھیں</h3>
            <div className="qaida-letter-row">
              {PARTS.map((part, index) => (
                <button key={part.id} className={`qaida-letter-box qaida-color-${index + 1}`} onClick={() => playAudio(part.audio, part.withHarakah)}>
                  <span>{part.withHarakah}</span>
                  <small>سننے کے لیے کلک کریں</small>
                </button>
              ))}
            </div>
            <div className="qaida-reading-flow"><b>ضَ</b><span>+</span><b>رَ</b><span>+</span><b>بَ</b></div>
            <button className="qaida-done-btn" onClick={() => markDone("harakah")}>✓ زبر کے ساتھ پڑھ لیا</button>
          </div>
        )}

        {step === "join" && (
          <div className="qaida-stage">
            <h3>حروف الگ پہچانیں، پھر آوازوں کو ملائیں</h3>
            <div className="qaida-join-board">
              <div><span>ضَ</span><small>پہلی آواز</small></div><i>+</i>
              <div><span>رَ</span><small>دوسری آواز</small></div><i>+</i>
              <div><span>بَ</span><small>تیسری آواز</small></div><i>→</i>
              <div className="result"><span>ضَرَبَ</span><small>مکمل لفظ</small></div>
            </div>
            <p className="qaida-teacher-tip">استاد کا طریقہ: ہر آواز الگ واضح کریں، درمیان میں غیر ضروری کھینچاؤ نہ کریں، پھر تینوں آوازوں کو مسلسل ملا کر پڑھیں۔</p>
            <button className="qaida-done-btn" onClick={() => markDone("join")}>✓ جوڑ مکمل</button>
          </div>
        )}

        {step === "word" && (
          <div className="qaida-stage qaida-word-stage">
            <span className="qaida-word-label">آج کا لفظ</span>
            <div className="qaida-full-word">ضَرَبَ</div>
            <div className="qaida-reading-flow"><b>ضَ</b><span>+</span><b>رَ</b><span>+</span><b>بَ</b><span>=</span><strong>ضَرَبَ</strong></div>

            <div className="qaida-practice-actions">
              <button className="qaida-audio-btn" onClick={() => playAudio(WORD_AUDIO, "ضَرَبَ")}>🔊 استاد کی آواز</button>
              {!recording ? (
                <button className="qaida-record-btn" onClick={startRecording}>🎙️ اپنی آواز ریکارڈ کریں</button>
              ) : (
                <button className="qaida-record-btn recording" onClick={stopRecording}>■ ریکارڈنگ بند کریں</button>
              )}
              {recordingUrl && <audio className="qaida-own-audio" controls src={recordingUrl} />}
            </div>

            <button className="qaida-done-btn" onClick={() => markDone("word")}>✓ سبق مکمل</button>
          </div>
        )}

        <div className="qaida-message" aria-live="polite">{message}</div>
      </section>

      <section className="qaida-safety-note">
        <strong>اہم اصول</strong>
        <p>قرآن و تجوید کی صحیح ادائیگی کے لیے generic device TTS کو authoritative audio نہیں بنایا جائے گا۔ Production میں مصدقہ استاد/قاری کی منظور شدہ recordings لگائی جائیں گی۔</p>
      </section>
    </div>
  );
}
