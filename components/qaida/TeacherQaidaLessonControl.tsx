"use client";

import { useEffect, useState } from "react";

const LESSONS = [
  "letters-01","letters-02","letters-03","letters-04","joined-forms",
  "harakat","sukoon","tanween","shaddah","madd","qalqalah","ghunnah",
  "ikhfa-izhar","idgham-iqlab","laam-ra","waqf","practice",
];

export default function TeacherQaidaLessonControl() {
  const [students, setStudents] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const r = await fetch("/api/teacher/qaida/lesson-control", { cache: "no-store" });
    const j = await r.json();
    setStudents(j.students || []);
  }

  useEffect(() => { void load(); }, []);

  async function setState(studentId: string, lessonSlug: string, status: string, approved: boolean) {
    const r = await fetch("/api/teacher/qaida/lesson-control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, lessonSlug, status, approved }),
    });
    const j = await r.json();
    setMessage(j.ok ? "✓ سبق کی حالت محفوظ ہو گئی۔" : j.error || "Failed.");
    if (j.ok) await load();
  }

  return <div className="qaida-control-stack" dir="rtl">
    {message && <div className="qaida-review-message">{message}</div>}
    {students.length === 0 ? <section className="dashboard-panel"><p>کوئی assigned student موجود نہیں۔</p></section> : students.map((student:any) => (
      <article key={student.id} className="qaida-control-card">
        <header><div><strong>{student.full_name}</strong><span>{student.student_code || ""}</span></div></header>
        <div className="qaida-control-grid">
          {LESSONS.map((lesson) => {
            const p = (student.progress || []).find((x:any) => x.lesson_slug === lesson);
            return <div key={lesson} className="qaida-control-row">
              <div><strong>{lesson}</strong><span>{p?.status || "locked"} • {p?.completion_percent || 0}%</span></div>
              <div className="qaida-control-actions">
                <button onClick={() => setState(student.id, lesson, "available", false)}>Unlock</button>
                <button onClick={() => setState(student.id, lesson, "locked", false)}>Lock</button>
                <button className="approve" onClick={() => setState(student.id, lesson, "completed", true)}>Approve</button>
              </div>
            </div>;
          })}
        </div>
      </article>
    ))}
  </div>;
}
