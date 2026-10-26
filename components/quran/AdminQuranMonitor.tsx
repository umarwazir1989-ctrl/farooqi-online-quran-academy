"use client";

import { useEffect,useState } from "react";

export default function AdminQuranMonitor(){
  const [summary,setSummary]=useState<any>(null);
  const [events,setEvents]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/admin/quran/monitor",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>{setSummary(j.summary||null);setEvents(j.events||[]);})
      .finally(()=>setLoading(false));
  },[]);

  if(loading)return <section className="dashboard-panel">Quran system monitor loading…</section>;

  return <div className="admin-quran-monitor" dir="rtl">
    <section className="admin-quran-stat-grid">
      <article><span>Total Attempts</span><strong>{summary?.attempts||0}</strong></article>
      <article><span>Pending Review</span><strong>{summary?.pendingAttempts||0}</strong></article>
      <article><span>Assignments</span><strong>{summary?.assignments||0}</strong></article>
      <article><span>Active Assignments</span><strong>{summary?.activeAssignments||0}</strong></article>
      <article><span>Active Revisions</span><strong>{summary?.activeRevisions||0}</strong></article>
    </section>

    <section className="dashboard-panel">
      <h2>Recent Quran System Events</h2>
      <div className="admin-quran-events">
        {events.length===0?<p>No events yet.</p>:events.map((e:any)=><article key={e.id}>
          <strong>{e.event_type}</strong>
          <span>{new Date(e.created_at).toLocaleString()}</span>
          <small>{e.assignment_id?`Assignment ${e.assignment_id}`:""} {e.attempt_id?`Attempt ${e.attempt_id}`:""}</small>
        </article>)}
      </div>
    </section>
  </div>;
}
