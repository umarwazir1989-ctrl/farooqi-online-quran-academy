"use client";

import { useRef, useState } from "react";

type Props = {
  lessonSlug: string;
  itemText: string;
  audioKey?: string | null;
};

export default function QaidaAttemptRecorder({
  lessonSlug,
  itemText,
  audioKey,
}: Props) {
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [message, setMessage] = useState("اپنی آواز ریکارڈ کریں اور استاد کو بھیجیں۔");
  const [sending, setSending] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const nextBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setBlob(nextBlob);
        setPreviewUrl(URL.createObjectURL(nextBlob));
        stream.getTracks().forEach((track) => track.stop());
        setMessage("ریکارڈنگ تیار ہے۔ سنیں، پھر استاد کو بھیجیں۔");
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setMessage(`ریکارڈنگ جاری ہے… ${itemText} پڑھیں۔`);
    } catch {
      setMessage("Microphone permission نہیں ملی۔ Browser میں microphone allow کریں۔");
    }
  }

  function stop() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function submit() {
    if (!blob) return;

    setSending(true);
    setMessage("استاد کو recording بھیجی جا رہی ہے…");

    try {
      const form = new FormData();
      const ext = blob.type.includes("ogg") ? "ogg" : "webm";
      form.append("audio", new File([blob], `qaida-attempt.${ext}`, { type: blob.type }));
      form.append("lessonSlug", lessonSlug);
      form.append("itemText", itemText);
      if (audioKey) form.append("audioKey", audioKey);

      const response = await fetch("/api/student/qaida/attempts", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      setMessage("✓ Recording استاد کے review کے لیے محفوظ ہو گئی ہے۔");
      setBlob(null);
      setPreviewUrl(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Recording upload failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="qaida-attempt-recorder">
      <strong>🎙️ استاد کو سنائیں</strong>

      <div className="qaida-recorder-actions">
        {!recording ? (
          <button onClick={start}>ریکارڈنگ شروع کریں</button>
        ) : (
          <button className="danger" onClick={stop}>■ ریکارڈنگ بند کریں</button>
        )}

        {previewUrl && <audio controls src={previewUrl} />}

        {blob && (
          <button className="gold" onClick={submit} disabled={sending}>
            {sending ? "بھیج رہا ہے…" : "استاد کو بھیجیں"}
          </button>
        )}
      </div>

      <p>{message}</p>
    </div>
  );
}
