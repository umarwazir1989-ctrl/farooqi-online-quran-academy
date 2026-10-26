"use client";

import { useEffect,useState } from "react";
import Link from "next/link";

export default function QuranProgressDashboard(){
  const [summary,setSummary]=useState<any>(null);
  const [weak,setWeak]=useState<any[]>([]);
  const [revision,setRevision]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      fetch("/api/student/quran/progress",{cache:"no-store"}).then(r=>r.json()),
      fetch("/api/student/quran/revision",{cache:"no-store"}).then(r=>r.json()),
    ]).then(([p,r])=>{
      setSummary(p.summary||null);
      setWeak(p.weak||[]);
      setRevision(r.revision||[]);
    }).finally(()=>setLoading(false));
  },[]);

  if(loading)return <section className="dashboard-panel">Quran progress loading…</section>;

  return <div className="quran-progress-dashboard" dir="rtl">
    <section className="quran-progress-stats">
      <article><span>Overall</span><strong>{summary?.score||0}%</strong></article>
      <article><span>✓ درست</span><strong>{summary?.correct||0}</strong></article>
      <article><span>⚠ مخرج</span><strong>{summary?.makhraj||0}</strong></article>
      <article><span>◉ تجوید</span><strong>{summary?.tajweed||0}</strong></article>
    </section>

    <section className="dashboard-panel">
      <h2>کمزور آیات / الفاظ</h2>
      <div className="quran-weak-list">
        {weak.length===0?<p>ابھی teacher-reviewed کمزوریاں موجود نہیں۔</p>:weak.map((w:any)=><article key={w.id}>
          <strong>{w.surah_number}:{w.ayah_number}</strong>
          <span>{w.word_position?`لفظ ${w.word_position}`:"مکمل آیت"}</span>
          <b>{w.status}</b>
          <Link href={`/portal/student/quran-reading?verse=${w.surah_number}:${w.ayah_number}`}>مشق کریں</Link>
        </article>)}
      </div>
    </section>

    <section className="dashboard-panel">
      <h2>Quran Revision Queue</h2>
      <div className="quran-revision-list">
        {revision.length===0?<p>اس وقت کوئی revision باقی نہیں۔</p>:revision.map((r:any)=><article key={r.id}>
          <strong>{r.surah_number}:{r.ayah_number}</strong>
          <span>{r.word_position?`لفظ ${r.word_position}`:"مکمل آیت"}</span>
          <small>Priority {r.priority}</small>
          <Link href={`/portal/student/quran-reading?verse=${r.surah_number}:${r.ayah_number}`}>کھولیں</Link>
        </article>)}
      </div>
    </section>
  </div>;
}
