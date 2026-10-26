"use client";

import { useEffect, useState } from "react";

export default function AdminQuranHealth() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/quran/health", { cache:"no-store" });
      const j = await r.json();
      setData(j);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  if (loading) return <section className="dashboard-panel">System health loading…</section>;

  const h = data?.health;

  return <section className="dashboard-panel admin-quran-health" dir="rtl">
    <div className="admin-quran-health-head">
      <div>
        <h2>Quran System Health</h2>
        <p>Release candidate operational checks</p>
      </div>
      <button onClick={load}>Refresh</button>
    </div>

    <div className="admin-quran-health-grid">
      <article className={h?.databaseOk ? "health-pass" : "health-fail"}>
        <strong>{h?.databaseOk ? "✓" : "✕"} Database</strong>
        <span>{h?.latencyMs ?? "-"} ms</span>
      </article>
      <article className={h?.quranFoundationConfigured ? "health-pass" : "health-fail"}>
        <strong>{h?.quranFoundationConfigured ? "✓" : "✕"} Quran Foundation</strong>
        <span>{h?.quranFoundationConfigured ? "Configured" : "Missing env"}</span>
      </article>
      <article className={h?.cronSecretConfigured ? "health-pass" : "health-warn"}>
        <strong>{h?.cronSecretConfigured ? "✓" : "!"} CRON_SECRET</strong>
        <span>{h?.cronSecretConfigured ? "Configured" : "Not configured"}</span>
      </article>
      <article className={h?.brevoConfigured ? "health-pass" : "health-warn"}>
        <strong>{h?.brevoConfigured ? "✓" : "!"} Brevo</strong>
        <span>{h?.brevoConfigured ? "Configured" : "Optional / not configured"}</span>
      </article>
    </div>

    <div className="admin-quran-counts">
      <span>Assignments <b>{h?.counts?.assignments || 0}</b></span>
      <span>Attempts <b>{h?.counts?.attempts || 0}</b></span>
      <span>Pending Review <b>{h?.counts?.pendingAttempts || 0}</b></span>
      <span>Revisions <b>{h?.counts?.activeRevisions || 0}</b></span>
      <span>Digests <b>{h?.counts?.digests || 0}</b></span>
      <span>Events <b>{h?.counts?.events || 0}</b></span>
    </div>
  </section>;
}
