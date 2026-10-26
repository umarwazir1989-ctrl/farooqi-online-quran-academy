"use client";

import { useEffect,useState } from "react";

export default function TeacherQuranAnalytics(){
  const [rows,setRows]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/teacher/quran/analytics",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>setRows(j.students||[]))
      .finally(()=>setLoading(false));
  },[]);

  if(loading)return <section className="dashboard-panel">Quran analytics loading…</section>;

  return <div className="teacher-quran-analytics" dir="rtl">
    {rows.length===0?<section className="dashboard-panel"><p>کوئی assigned student موجود نہیں۔</p></section>:rows.map((r:any)=><article key={r.id}>
      <header>
        <div><strong>{r.full_name}</strong><span>{r.student_code||""}</span></div>
        <b>{r.score}%</b>
      </header>
      <div className="teacher-quran-metrics">
        <span>Mastery: {r.mastery}</span>
        <span>Reviewed: {r.reviewed}</span>
        <span>⚠ Makhraj: {r.makhraj}</span>
        <span>◉ Tajweed: {r.tajweed}</span>
        <span>📘 Assignments: {r.pendingAssignments}</span>
      </div>
      <small>Last practice: {r.lastPracticeAt?new Date(r.lastPracticeAt).toLocaleString():"No practice yet"}</small>
    </article>)}
  </div>;
}
