"use client";

import { FormEvent, useState } from "react";

export default function AnnouncementForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const f = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titleEn: f.get("titleEn"),
        titleUr: f.get("titleUr"),
        bodyEn: f.get("bodyEn"),
        bodyUr: f.get("bodyUr"),
        audience: f.get("audience"),
        priority: f.get("priority"),
        publishUntil: f.get("publishUntil"),
      }),
    });

    const data = await res.json();
    setStatus(data.ok ? "Announcement published ✓" : data.error || "Publish failed.");
    setBusy(false);
    if (data.ok) setTimeout(() => window.location.reload(), 500);
  }

  return (
    <form className="admin-ops-form" onSubmit={submit}>
      <h2>New Announcement</h2>

      <div className="form-row">
        <label>
          English title
          <input name="titleEn" required />
        </label>
        <label dir="rtl">
          اردو عنوان
          <input name="titleUr" dir="rtl" />
        </label>
      </div>

      <div className="form-row">
        <label>
          English message
          <textarea name="bodyEn" rows={4} required />
        </label>
        <label dir="rtl">
          اردو پیغام
          <textarea name="bodyUr" rows={4} dir="rtl" />
        </label>
      </div>

      <div className="form-row">
        <label>
          Audience
          <select name="audience" defaultValue="all">
            <option value="all">Everyone</option>
            <option value="students">Students</option>
            <option value="parents">Parents</option>
            <option value="teachers">Teachers</option>
          </select>
        </label>

        <label>
          Priority
          <select name="priority" defaultValue="normal">
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>

      <label>
        Publish until (optional)
        <input name="publishUntil" type="datetime-local" />
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Publishing…" : "Publish Announcement"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
