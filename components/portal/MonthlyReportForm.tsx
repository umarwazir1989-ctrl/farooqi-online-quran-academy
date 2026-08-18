"use client";

import { FormEvent, useState } from "react";

export default function MonthlyReportForm({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const f = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/monthly-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        month: f.get("month"),
        progressSummary: f.get("progressSummary"),
        strengths: f.get("strengths"),
        improvementAreas: f.get("improvementAreas"),
        nextMonthGoal: f.get("nextMonthGoal"),
        teacherComment: f.get("teacherComment"),
        publish: f.get("publish") === "on",
      }),
    });

    const data = await res.json();
    setStatus(data.ok ? "Monthly report generated ✓" : data.error || "Could not generate report.");
    setBusy(false);
  }

  return (
    <form className="monthly-report-form" onSubmit={submit}>
      <h3>{studentName}</h3>

      <label>
        Report month
        <input name="month" type="month" defaultValue={defaultMonth} required />
      </label>

      <label>
        Progress summary
        <textarea name="progressSummary" rows={3} />
      </label>

      <label>
        Strengths
        <textarea name="strengths" rows={2} />
      </label>

      <label>
        Areas to improve
        <textarea name="improvementAreas" rows={2} />
      </label>

      <label>
        Next month goal
        <textarea name="nextMonthGoal" rows={2} />
      </label>

      <label>
        Teacher/Admin comment
        <textarea name="teacherComment" rows={2} />
      </label>

      <label className="publish-check">
        <input type="checkbox" name="publish" />
        <span>Publish to Student & Parent Portal</span>
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Generating…" : "Generate Report"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
