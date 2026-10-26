"use client";

import { useEffect,useState } from "react";

export default function ParentWeeklyQuranDigest(){
  const [rows,setRows]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/parent/quran/weekly-digest",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>setRows(j.digests||[]))
      .finally(()=>setLoading(false));
  },[]);

  if(loading)return <section className="dashboard-panel">Weekly Quran digest loading…</section>;

  return <div className="parent-weekly-quran-digest" dir="rtl">
    {rows.length===0?<section className="dashboard-panel"><p>کوئی linked active student موجود نہیں۔</p></section>:rows.map((r:any)=><article key={r.student_id}>
      <header>
        <div>
          <strong>{r.fullName}</strong>
          <span>{r.studentCode||""}</span>
        </div>
        <b>{r.average_score}%</b>
      </header>
      <small>{r.week_start} — {r.week_end}</small>
      <p>{r.summary_text}</p>
      <div className="parent-weekly-digest-stats">
        <span>Reviewed {r.reviewed_attempts}</span>
        <span>✓ Correct {r.correct_count}</span>
        <span>↻ Repeat {r.repeat_count}</span>
        <span>⚠ Makhraj {r.makhraj_count}</span>
        <span>◉ Tajweed {r.tajweed_count}</span>
        <span>📘 Active Tasks {r.active_assignments}</span>
        <span>🏁 Completed {r.completed_assignments}</span>
      </div>
    </article>)}
  </div>;
}
