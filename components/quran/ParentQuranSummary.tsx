"use client";

import { useEffect,useState } from "react";

export default function ParentQuranSummary(){
  const [children,setChildren]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/parent/quran/summary",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>setChildren(j.children||[]))
      .finally(()=>setLoading(false));
  },[]);

  if(loading)return <section className="dashboard-panel">Quran summary loading…</section>;

  return <div className="parent-quran-summary" dir="rtl">
    {children.length===0?<section className="dashboard-panel"><p>کوئی linked active student موجود نہیں۔</p></section>:children.map((c:any)=><article key={c.id}>
      <header><div><strong>{c.fullName}</strong><span>{c.studentCode||""}</span></div><b>{c.score}%</b></header>
      <div className="parent-quran-stats">
        <span>✓ درست {c.correct}</span>
        <span>⚠ مخرج {c.makhraj}</span>
        <span>◉ تجوید {c.tajweed}</span>
        <span>📖 اسائنمنٹ {c.activeAssignments}</span>
      </div>
      <small>آخری مشق: {c.lastPracticeAt?new Date(c.lastPracticeAt).toLocaleString():"ابھی نہیں"}</small>
    </article>)}
  </div>;
}
