"use client";

import { useEffect,useState } from "react";
import Link from "next/link";

export default function QuranAssignmentsList(){
  const [rows,setRows]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");

  async function load(){
    const r=await fetch("/api/student/quran/assignments",{cache:"no-store"});
    const j=await r.json();
    setRows(j.assignments||[]);
    setLoading(false);
  }

  useEffect(()=>{void load();},[]);

  async function submit(id:string){
    const r=await fetch(`/api/student/quran/assignments/${id}/submit`,{method:"POST"});
    const j=await r.json();
    setMessage(j.ok?"✓ Assignment استاد کو review کے لیے جمع ہو گیا۔":j.error||"Failed.");
    if(j.ok)await load();
  }

  if(loading)return <section className="dashboard-panel">Assignments loading…</section>;

  return <section className="dashboard-panel" dir="rtl">
    <h2>میرے قرآن اسائنمنٹس</h2>
    {message&&<div className="quran-inline-message">{message}</div>}
    <div className="quran-assignment-list">
      {rows.length===0?<p>اس وقت کوئی active قرآن assignment نہیں۔</p>:rows.map((a:any)=><article key={a.id}>
        <div>
          <strong>سورت {a.surah_number}</strong>
          <span>آیات {a.ayah_from} تا {a.ayah_to}</span>
        </div>
        <p>{a.instructions||"استاد کی مقررہ آیات کی مشق کریں۔"}</p>
        <small>{a.due_date?`Due: ${a.due_date}`:"No due date"} • {a.status}</small>
        <div className="quran-assignment-actions">
          <Link href={`/portal/student/quran-reading?verse=${a.surah_number}:${a.ayah_from}`}>پڑھنا شروع کریں</Link>
          {["assigned","in_progress"].includes(a.status)&&
            <button onClick={()=>submit(a.id)}>استاد کو جمع کریں</button>}
        </div>
      </article>)}
    </div>
  </section>;
}
