"use client";

import { useEffect,useState } from "react";

export default function TeacherQuranReview(){
  const [rows,setRows]=useState<any[]>([]);
  const [message,setMessage]=useState("");

  async function load(){
    const r=await fetch("/api/teacher/quran/attempts",{cache:"no-store"});
    const j=await r.json();
    setRows(j.attempts||[]);
  }

  useEffect(()=>{void load();},[]);

  async function review(id:string,status:string){
    const feedback=window.prompt("طالب علم کے لیے correction/feedback لکھیں:","")||"";
    const r=await fetch(`/api/teacher/quran/attempts/${id}/review`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({status,feedback}),
    });
    const j=await r.json();
    setMessage(j.ok?"✓ Review محفوظ ہو گیا۔":j.error||"Failed.");
    if(j.ok)await load();
  }

  return <div className="quran-review-stack" dir="rtl">
    {message&&<div className="qaida-review-message">{message}</div>}
    {rows.length===0?<section className="dashboard-panel"><p>ابھی کوئی Quran recording review کے لیے موجود نہیں۔</p></section>:rows.map((r:any)=><article key={r.id} className="quran-review-card">
      <header>
        <div><strong>{r.students?.full_name||"Student"}</strong><span>{r.students?.student_code||""}</span></div>
        <div><strong>{r.surah_number}:{r.ayah_number}</strong><span>{r.word_position?`Word ${r.word_position}`:"Full Ayah"}</span></div>
        <span>{r.status}</span>
      </header>
      {r.recordingUrl&&<audio controls preload="none" src={r.recordingUrl}/>}
      {r.teacher_feedback&&<p>{r.teacher_feedback}</p>}
      <div className="quran-review-actions">
        <button className="correct" onClick={()=>review(r.id,"correct")}>✓ Correct</button>
        <button className="repeat" onClick={()=>review(r.id,"repeat")}>↻ Repeat</button>
        <button className="makhraj" onClick={()=>review(r.id,"makhraj_issue")}>⚠ Makhraj</button>
        <button className="tajweed" onClick={()=>review(r.id,"tajweed_issue")}>◉ Tajweed</button>
      </div>
    </article>)}
  </div>;
}
