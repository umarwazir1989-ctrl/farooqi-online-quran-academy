"use client";
import { useEffect, useState } from "react";
export default function TeacherWeeklyQaidaReport(){
  const [students,setStudents]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch("/api/teacher/qaida/weekly-report",{cache:"no-store"}).then(r=>r.json()).then(r=>setStudents(r.students||[])).finally(()=>setLoading(false));},[]);
  if(loading) return <section className="dashboard-panel">Weekly report loading…</section>;
  return <section className="dashboard-panel" dir="rtl"><h2>گزشتہ 7 دن کی قاعدہ رپورٹ</h2><div className="qaida-weekly-report">
    {students.length===0?<p>کوئی assigned student موجود نہیں۔</p>:students.map((s:any)=><article key={s.studentId}>
      <div><strong>{s.fullName}</strong><span>{s.studentCode}</span></div>
      <div className="qaida-parent-stats"><span>Attempts: {s.total}</span><span>✓ {s.correct}</span><span>↻ {s.repeat}</span><span>⚠ {s.makhraj}</span></div>
      <div><small>کمزور ترجیح</small><strong>{s.weakItem||"—"}</strong></div>
    </article>)}
  </div></section>;
}
