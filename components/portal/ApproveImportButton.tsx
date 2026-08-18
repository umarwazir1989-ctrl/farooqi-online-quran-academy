"use client";

import { useState } from "react";

export default function ApproveImportButton({
  batchId,
  disabled,
}: {
  batchId: string;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function approve() {
    const confirmed = window.confirm(
      "Import all VALID rows into live Student/Parent/Enrollment records?"
    );

    if (!confirmed) return;

    setBusy(true);

    const res = await fetch(`/api/admin/import/${batchId}/approve`, {
      method: "POST",
    });

    const data = await res.json();
    setBusy(false);

    if (data.ok) {
      window.alert(`${data.imported} rows imported successfully.`);
      window.location.reload();
    } else {
      window.alert(data.error || "Import failed.");
    }
  }

  return (
    <button
      className="btn btn-small"
      type="button"
      onClick={approve}
      disabled={disabled || busy}
    >
      {busy ? "Importing…" : "Approve Live Import"}
    </button>
  );
}
