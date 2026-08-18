"use client";

import { FormEvent, useState } from "react";

export default function RescheduleForm({
  enrollmentId,
  studentName,
  timezone,
}: {
  enrollmentId: string;
  studentName: string;
  timezone?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const f = new FormData(e.currentTarget);

    const res = await fetch("/api/teacher/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollmentId,
        originalDate: f.get("originalDate"),
        requestedDate: f.get("requestedDate"),
        requestedTime: f.get("requestedTime"),
        timezone: f.get("timezone"),
        reason: f.get("reason"),
        requestType: f.get("requestType"),
      }),
    });

    const data = await res.json();
    setStatus(data.ok ? "Request submitted ✓" : data.error || "Request failed.");
    setBusy(false);
  }

  return (
    <form className="reschedule-form" onSubmit={submit}>
      <h3>{studentName}</h3>

      <div className="form-row">
        <label>
          Request type
          <select name="requestType" defaultValue="reschedule">
            <option value="reschedule">Reschedule</option>
            <option value="makeup">Make-up class</option>
          </select>
        </label>

        <label>
          Original date
          <input name="originalDate" type="date" required />
        </label>
      </div>

      <div className="form-row">
        <label>
          New date
          <input name="requestedDate" type="date" required />
        </label>

        <label>
          New time
          <input name="requestedTime" type="time" />
        </label>
      </div>

      <label>
        Timezone
        <input name="timezone" defaultValue={timezone || "Asia/Karachi"} required />
      </label>

      <label>
        Reason
        <textarea name="reason" rows={3} />
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Submitting…" : "Submit Request"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
