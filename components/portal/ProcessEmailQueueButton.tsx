"use client";

import { useState } from "react";

export default function ProcessEmailQueueButton() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function processQueue() {
    setBusy(true);
    setStatus("");

    const res = await fetch("/api/admin/email-queue/process", {
      method: "POST",
    });

    const data = await res.json();

    if (data.ok) {
      setStatus(`Sent: ${data.sent} · Failed: ${data.failed}`);
      setTimeout(() => window.location.reload(), 800);
    } else {
      setStatus(data.error || "Processing failed.");
    }

    setBusy(false);
  }

  return (
    <div className="queue-process-box">
      <button className="btn" onClick={processQueue} disabled={busy}>
        {busy ? "Sending…" : "Process Pending Emails"}
      </button>
      <small>{status}</small>
    </div>
  );
}
