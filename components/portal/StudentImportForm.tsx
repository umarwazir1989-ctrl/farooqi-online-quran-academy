"use client";

import { FormEvent, useState } from "react";

export default function StudentImportForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/import/students", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data.ok) {
      setStatus(
        `Uploaded ✓ Total ${data.batch.total_rows}, valid ${data.batch.valid_rows}, invalid ${data.batch.invalid_rows}`
      );
      setTimeout(() => window.location.reload(), 700);
    } else {
      setStatus(data.error || "Import failed.");
    }

    setBusy(false);
  }

  return (
    <form className="admin-ops-form" onSubmit={submit}>
      <h2>Upload Student List</h2>

      <p>
        Supported: CSV or XLSX. Recommended columns:
        Student Name, Parent Name, Email, Phone, Country, Timezone, Course, Notes.
      </p>

      <label>
        Student file
        <input name="file" type="file" accept=".csv,.xlsx" required />
      </label>

      <button className="btn" disabled={busy}>
        {busy ? "Uploading…" : "Upload & Validate"}
      </button>

      <p className="form-status">{status}</p>
    </form>
  );
}
