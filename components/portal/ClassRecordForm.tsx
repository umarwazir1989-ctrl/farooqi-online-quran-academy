"use client";

import { FormEvent, useState } from "react";

export default function ClassRecordForm({
  enrollmentId,
  studentName,
  defaultDuration = 30,
}: {
  enrollmentId: string;
  studentName: string;
  defaultDuration?: number;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const f = new FormData(e.currentTarget);

    const res = await fetch("/api/teacher/class-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollmentId,
        classDate: f.get("classDate"),
        attendanceStatus: f.get("attendanceStatus"),
        lessonType: f.get("lessonType"),
        lessonTitle: f.get("lessonTitle"),
        lessonFrom: f.get("lessonFrom"),
        lessonTo: f.get("lessonTo"),
        newLesson: f.get("newLesson"),
        sabqiRevision: f.get("sabqiRevision"),
        manzilRevision: f.get("manzilRevision"),
        tajweedFocus: f.get("tajweedFocus"),
        mistakesNotes: f.get("mistakesNotes"),
        homework: f.get("homework"),
        teacherNotes: f.get("teacherNotes"),
        performanceScore: f.get("performanceScore"),
        durationMinutes: f.get("durationMinutes"),
      }),
    });

    const data = await res.json();
    setStatus(data.ok ? "Class record saved successfully ✓" : data.error || "Save failed.");
    setBusy(false);
  }

  return (
    <form className="class-record-form" onSubmit={submit}>
      <div className="class-record-heading">
        <div>
          <span className="eyebrow">Class Completion</span>
          <h2>{studentName}</h2>
        </div>
      </div>

      <div className="form-row">
        <label>
          Class date
          <input name="classDate" type="date" defaultValue={today} required />
        </label>

        <label>
          Attendance
          <select name="attendanceStatus" defaultValue="present">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="leave">Leave</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Lesson type
          <select name="lessonType" defaultValue="quran_reading">
            <option value="qaida">Noorani Qaida</option>
            <option value="quran_reading">Quran Reading</option>
            <option value="hifz">Hifz</option>
            <option value="tajweed">Tajweed</option>
            <option value="translation_tafsir">Translation & Tafsir</option>
            <option value="islamic_studies">Islamic Studies</option>
            <option value="arabic">Arabic</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Duration
          <select name="durationMinutes" defaultValue={String(defaultDuration)}>
            <option value="20">20 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>
        </label>
      </div>

      <label>
        Lesson / Surah / Topic
        <input name="lessonTitle" placeholder="e.g. Surah Al-Baqarah / Qaida Lesson 7" />
      </label>

      <div className="form-row">
        <label>
          From
          <input name="lessonFrom" placeholder="Page / Ayah / lesson start" />
        </label>
        <label>
          To
          <input name="lessonTo" placeholder="Page / Ayah / lesson end" />
        </label>
      </div>

      <label>
        New lesson / سبق
        <textarea name="newLesson" rows={2} />
      </label>

      <div className="form-row">
        <label>
          Sabqi / سبقی
          <textarea name="sabqiRevision" rows={2} />
        </label>
        <label>
          Manzil / منزل
          <textarea name="manzilRevision" rows={2} />
        </label>
      </div>

      <label>
        Tajweed focus
        <input name="tajweedFocus" placeholder="Makharij, madd, ghunnah, qalqalah..." />
      </label>

      <label>
        Mistakes / correction notes
        <textarea name="mistakesNotes" rows={3} />
      </label>

      <label>
        Homework
        <textarea name="homework" rows={3} />
      </label>

      <label>
        Teacher notes
        <textarea name="teacherNotes" rows={3} />
      </label>

      <label>
        Performance
        <select name="performanceScore" defaultValue="">
          <option value="">Not rated</option>
          <option value="5">5 — Excellent</option>
          <option value="4">4 — Very Good</option>
          <option value="3">3 — Good</option>
          <option value="2">2 — Needs Improvement</option>
          <option value="1">1 — Weak</option>
        </select>
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Saving…" : "Save Class Report"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
