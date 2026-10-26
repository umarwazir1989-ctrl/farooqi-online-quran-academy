"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentRevisionAndStreak() {
  const [due,setDue]=useState<any[]>([]);
  const [metrics,setMetrics]=useState<any>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/student/qaida/revision",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>{setDue(j.due||[]);setMetrics(j.metrics||null);})
      .finally(()=>setLoading(false));
  },[]);

  if(loading) return <section className="dashboard-panel">Revision loading…</section>;

  return <div className="qaida-revision-layout" dir="rtl">
    <section className="qaida-streak-card">
      <div><span>🔥 موجودہ سلسلہ</span><strong>{metrics?.current_streak || 0} دن</strong></div>
      <div><span>🏆 بہترین سلسلہ</span><strong>{metrics?.longest_streak || 0} دن</strong></div>
      <div><span>⭐ پوائنٹس</span><strong>{metrics?.reward_points || 0}</strong></div>
      <div><span>📚 مشق کے دن</span><strong>{metrics?.total_practice_days || 0}</strong></div>
    </section>

    <section className="dashboard-panel">
      <h2>Spaced Revision — آج کا اعادہ</h2>
      <div className="qaida-revision-list">
        {due.length===0?<p>آج کوئی scheduled revision باقی نہیں۔</p>:due.map((r:any)=><article key={r.id}>
          <div><strong>{r.item_text}</strong><span>{r.lesson_slug}</span></div>
          <small>Interval: {r.interval_days} day(s)</small>
          <Link href={`/portal/student/qaida/${r.lesson_slug}`}>مشق کھولیں</Link>
        </article>)}
      </div>
    </section>
  </div>;
}
