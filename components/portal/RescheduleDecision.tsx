"use client";

import { useState } from "react";

export default function RescheduleDecision({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function decide(decision: "approved" | "rejected") {
    setBusy(true);
    setStatus("");

    const adminNotes = window.prompt("Admin note (optional):") || "";

    const res = await fetch(`/api/admin/reschedule/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, adminNotes }),
    });

    const data = await res.json();
    setStatus(data.ok ? `${decision} ✓` : data.error || "Update failed.");
    setBusy(false);

    if (data.ok) setTimeout(() => window.location.reload(), 500);
  }

  if (currentStatus !== "pending") {
    return <span className={`status-pill status-${currentStatus}`}>{currentStatus}</span>;
  }

  return (
    <div className="decision-actions">
      <button disabled={busy} onClick={() => decide("approved")}>Approve</button>
      <button disabled={busy} onClick={() => decide("rejected")}>Reject</button>
      <small>{status}</small>
    </div>
  );
}
