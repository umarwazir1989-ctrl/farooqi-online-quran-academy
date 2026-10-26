"use client";
import { useEffect, useState } from "react";

export default function ParentQaidaSummary(){
  const [children,setChildren]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch("/api/parent/qaida/summary",{cache:"no-store"}).then(r=>r.json()).then(r=>setChildren(r.children||[])).finally(()=>setLoading(false));},[]);
  if(loading) return <section className="dashboard-panel">Qaida summary loading…</section>;

  return <div className="qaida-parent-summary" dir="rtl">
    {children.length===0?<section className="dashboard-panel"><p>اس Parent account کے ساتھ کوئی active student linked نہیں۔</p></section>:children.map((c:any)=><article key={c.id}>
      <header><div><strong>{c.fullName}</strong><span>{c.studentCode||""}</span></div><b>{c.score}%</b></header>
      <div className="qaida-parent-stats"><span>✓ درست: {c.correct}</span><span>↻ دوبارہ: {c.repeat}</span><span>⚠ مخرج: {c.makhraj}</span><span>📚 ہوم ورک: {c.activeHomework}</span></div>
      <small>آخری مشق: {c.lastPracticeAt?new Date(c.lastPracticeAt).toLocaleString():"ابھی کوئی مشق نہیں"}</small>
    </article>)}
  </div>;
}
