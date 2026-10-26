"use client";

import { useEffect, useState } from "react";

export default function AdminLaunchAudit(){
  const [audits,setAudits]=useState<any[]>([]);
  const [health,setHealth]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");

  async function load(){
    setLoading(true);
    const r=await fetch("/api/admin/quran/launch-audit",{cache:"no-store"});
    const j=await r.json();
    setAudits(j.audits||[]);
    setHealth(j.health||null);
    setLoading(false);
  }

  useEffect(()=>{void load();},[]);

  async function record(result:"pass"|"warn"|"fail"){
    const r=await fetch("/api/admin/quran/launch-audit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        auditType:"release",
        result,
        details:{
          databaseOk:Boolean(health?.databaseOk),
          quranFoundationConfigured:Boolean(health?.quranFoundationConfigured),
          cronSecretConfigured:Boolean(health?.cronSecretConfigured),
          pendingAttempts:Number(health?.counts?.pendingAttempts||0),
        }
      })
    });

    const j=await r.json();
    setMessage(j.ok?"✓ Launch audit saved.":j.error||"Failed.");
    if(j.ok)await load();
  }

  if(loading)return <section className="dashboard-panel">Launch audit loading…</section>;

  return <section className="dashboard-panel admin-launch-audit" dir="rtl">
    <div className="admin-launch-audit-head">
      <div>
        <h2>Launch Audit</h2>
        <p>Final release decision record</p>
      </div>
      <div className="admin-launch-audit-actions">
        <button onClick={()=>record("pass")}>PASS</button>
        <button onClick={()=>record("warn")}>WARN</button>
        <button onClick={()=>record("fail")}>FAIL</button>
      </div>
    </div>

    {message&&<p className="quran-inline-message">{message}</p>}

    <div className="admin-launch-audit-list">
      {audits.length===0?<p>No launch audits recorded yet.</p>:audits.map((a:any)=><article key={a.id}>
        <strong>{a.audit_type}</strong>
        <span className={`launch-result launch-${a.result}`}>{a.result}</span>
        <time>{new Date(a.created_at).toLocaleString()}</time>
      </article>)}
    </div>
  </section>;
}
