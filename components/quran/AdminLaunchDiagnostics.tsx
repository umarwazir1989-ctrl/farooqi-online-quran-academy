"use client";

import { useEffect, useState } from "react";

export default function AdminLaunchDiagnostics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/launch-diagnostics", { cache: "no-store" });
      const j = await r.json();
      setData(j);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return <section className="dashboard-panel">Launch diagnostics loading…</section>;
  }

  return (
    <section className="dashboard-panel launch-diagnostics" dir="rtl">
      <div className="launch-diagnostics-head">
        <div>
          <h2>Launch Diagnostics</h2>
          <p>
            {data?.summary
              ? `${data.summary.passed}/${data.summary.total} checks passed`
              : "Diagnostics unavailable"}
          </p>
        </div>
        <button onClick={load}>دوبارہ چیک کریں</button>
      </div>

      <div className="launch-diagnostics-grid">
        {(data?.checks || []).map((check: any) => (
          <article key={check.name} className={check.ok ? "diag-pass" : "diag-fail"}>
            <strong>{check.ok ? "✓" : "✕"} {check.name}</strong>
            <span>{check.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
