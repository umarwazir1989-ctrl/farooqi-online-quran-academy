"use client";

import { useEffect, useState } from "react";

type Attempt = {
  id: string;
  lesson_slug: string;
  item_text: string;
  status: string;
  teacher_feedback?: string | null;
  recordingUrl?: string | null;
  created_at: string;
  students?: {
    full_name?: string | null;
    student_code?: string | null;
  } | null;
};

export default function TeacherQaidaReview() {
  const [rows, setRows] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/teacher/qaida/attempts", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Failed.");
      setRows(result.attempts || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function review(
    id: string,
    status: "correct" | "repeat" | "makhraj_issue"
  ) {
    const feedback =
      window.prompt(
        status === "correct"
          ? "اختیاری feedback:"
          : "طالب علم کے لیے مختصر correction لکھیں:"
      ) || "";

    const response = await fetch(`/api/teacher/qaida/attempts/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, feedback }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      setMessage(result.error || "Review failed.");
      return;
    }

    setMessage("Review محفوظ ہو گیا۔");
    await load();
  }

  if (loading) {
    return <section className="dashboard-panel">Qaida recordings loading…</section>;
  }

  return (
    <div className="qaida-review-stack">
      {message && <div className="qaida-review-message">{message}</div>}

      {rows.length === 0 ? (
        <section className="dashboard-panel">
          <p>ابھی کوئی student Qaida recording review کے لیے موجود نہیں۔</p>
        </section>
      ) : (
        rows.map((row) => (
          <article className="qaida-review-card" key={row.id}>
            <div className="qaida-review-meta">
              <div>
                <strong>{row.students?.full_name || "Student"}</strong>
                <span>{row.students?.student_code || ""}</span>
              </div>
              <div>
                <strong>{row.item_text}</strong>
                <span>{row.lesson_slug}</span>
              </div>
              <span className={`qaida-status qaida-status-${row.status}`}>
                {row.status}
              </span>
            </div>

            {row.recordingUrl && (
              <audio controls preload="none" src={row.recordingUrl} />
            )}

            {row.teacher_feedback && (
              <p className="qaida-existing-feedback">
                سابق feedback: {row.teacher_feedback}
              </p>
            )}

            <div className="qaida-review-actions">
              <button className="correct" onClick={() => review(row.id, "correct")}>
                ✓ Correct
              </button>
              <button className="repeat" onClick={() => review(row.id, "repeat")}>
                ↻ Repeat
              </button>
              <button
                className="makhraj"
                onClick={() => review(row.id, "makhraj_issue")}
              >
                ⚠ Makhraj Issue
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
