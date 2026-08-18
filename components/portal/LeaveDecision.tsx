"use client";

import { useState } from "react";

export default function LeaveDecision({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [busy, setBusy] = useState(false);

  async function decide(decision: "approved" | "rejected") {
    setBusy(true);
    const adminNotes = window.prompt("Admin note (optional):") || "";

    const res = await fetch(`/api/admin/leave/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, adminNotes }),
    });

    const data = await res.json();
    setBusy(false);

    if (data.ok) window.location.reload();
    else window.alert(data.error || "Update failed.");
  }

  if (currentStatus !== "pending") {
    return <span className={`status-pill status-${currentStatus}`}>{currentStatus}</span>;
  }

  return (
    <div className="decision-actions">
      <button disabled={busy} onClick={() => decide("approved")}>Approve</button>
      <button disabled={busy} onClick={() => decide("rejected")}>Reject</button>
    </div>
  );
}
