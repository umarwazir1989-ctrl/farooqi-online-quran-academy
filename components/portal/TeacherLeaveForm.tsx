"use client";

import { FormEvent, useState } from "react";

export default function TeacherLeaveForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const f = new FormData(e.currentTarget);

    const res = await fetch("/api/teacher/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leaveType: f.get("leaveType"),
        startDate: f.get("startDate"),
        endDate: f.get("endDate"),
        reason: f.get("reason"),
      }),
    });

    const data = await res.json();
    setStatus(data.ok ? "Leave request submitted ✓" : data.error || "Request failed.");
    setBusy(false);
    if (data.ok) setTimeout(() => window.location.reload(), 500);
  }

  return (
    <form className="admin-ops-form" onSubmit={submit}>
      <h2>Request Leave</h2>

      <label>
        Leave type
        <select name="leaveType" defaultValue="personal">
          <option value="personal">Personal</option>
          <option value="sick">Sick</option>
          <option value="emergency">Emergency</option>
          <option value="vacation">Vacation</option>
          <option value="other">Other</option>
        </select>
      </label>

      <div className="form-row">
        <label>
          Start date
          <input name="startDate" type="date" required />
        </label>
        <label>
          End date
          <input name="endDate" type="date" required />
        </label>
      </div>

      <label>
        Reason
        <textarea name="reason" rows={4} />
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Submitting…" : "Submit Leave Request"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
