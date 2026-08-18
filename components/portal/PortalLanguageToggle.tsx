"use client";

import { useState } from "react";

export default function PortalLanguageToggle({
  current,
  label,
}: {
  current: "en" | "ur";
  label: string;
}) {
  const [busy, setBusy] = useState(false);

  async function change() {
    setBusy(true);

    await fetch("/api/portal/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: current === "ur" ? "en" : "ur" }),
    });

    window.location.reload();
  }

  return (
    <button className="portal-language-toggle" onClick={change} disabled={busy}>
      {busy ? "…" : label}
    </button>
  );
}
