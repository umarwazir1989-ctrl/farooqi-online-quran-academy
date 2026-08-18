"use client";

import { FormEvent, useState } from "react";

export default function EmailQueueForm() {
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const f = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/email-queue", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        recipientEmail:f.get("recipientEmail"),
        recipientName:f.get("recipientName"),
        subject:f.get("subject"),
        bodyText:f.get("bodyText"),
      }),
    });

    const data = await res.json();
    setStatus(data.ok ? "Email added to queue ✓" : data.error || "Queue failed.");
    setBusy(false);

    if(data.ok) setTimeout(()=>window.location.reload(),500);
  }

  return (
    <form className="admin-ops-form" onSubmit={submit}>
      <h2>Queue Email Notification</h2>

      <div className="form-row">
        <label>
          Recipient name
          <input name="recipientName" />
        </label>

        <label>
          Recipient email
          <input name="recipientEmail" type="email" required />
        </label>
      </div>

      <label>
        Subject
        <input name="subject" required />
      </label>

      <label>
        Message
        <textarea name="bodyText" rows={5} required />
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Adding…" : "Add to Email Queue"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
