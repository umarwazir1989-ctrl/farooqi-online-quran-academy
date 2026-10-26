"use client";
import { useEffect, useState } from "react";

export default function StudentQaidaIntelligence() {
  const [skills,setSkills]=useState<any[]>([]);
  const [homework,setHomework]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      fetch("/api/student/qaida/intelligence",{cache:"no-store"}).then(r=>r.json()),
      fetch("/api/student/qaida/homework",{cache:"no-store"}).then(r=>r.json())
    ]).then(([a,h])=>{
      setSkills(a.skills||[]);
      setHomework(h.homework||[]);
    }).finally(()=>setLoading(false));
  },[]);

  if(loading) return <section className="dashboard-panel">Qaida progress loading…</section>;

  return <div className="qaida-intelligence-grid" dir="rtl">
    <section className="dashboard-panel">
      <h2>میری کمزوریاں اور مضبوطیاں</h2>
      <div className="qaida-skill-list">
        {skills.length===0?<p>ابھی teacher-reviewed attempts موجود نہیں۔</p>:skills.map((s:any)=><article key={s.key}>
          <div><strong>{s.label}</strong><span>{s.level}</span></div>
          <div className="qaida-skill-bar"><i style={{width:`${s.score}%`}}/></div>
          <b>{s.score}%</b>
          <small>درست {s.correct} • دوبارہ {s.repeat} • مخرج {s.makhraj}</small>
        </article>)}
      </div>
    </section>

    <section className="dashboard-panel">
      <h2>استاد کا ہوم ورک</h2>
      <div className="qaida-homework-list">
        {homework.length===0?<p>ابھی کوئی Qaida homework مقرر نہیں۔</p>:homework.map((h:any)=><article key={h.id}>
          <strong>{h.lesson_slug}</strong>
          {h.item_text?<span>{h.item_text}</span>:null}
          <p>{h.instructions||"مقررہ سبق کی مشق کریں۔"}</p>
          <small>{h.due_date?`Due: ${h.due_date}`:"No due date"} • {h.status}</small>
        </article>)}
      </div>
    </section>
  </div>;
}
