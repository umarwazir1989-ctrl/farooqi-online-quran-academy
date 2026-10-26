"use client";
import { useEffect, useMemo, useState } from "react";

export default function TeacherQaidaIntelligence() {
  const [rows,setRows]=useState<any[]>([]);
  const [message,setMessage]=useState("");

  useEffect(()=>{fetch("/api/teacher/qaida/attempts",{cache:"no-store"}).then(r=>r.json()).then(r=>setRows(r.attempts||[]));},[]);

  const students=useMemo(()=>{
    const map=new Map<string,any[]>();
    for(const r of rows) map.set(r.student_id,[...(map.get(r.student_id)||[]),r]);
    return Array.from(map.entries()).map(([studentId,attempts])=>({
      studentId,
      name: attempts[0]?.students?.full_name||"Student",
      code: attempts[0]?.students?.student_code||"",
      attempts,
      correct: attempts.filter(a=>a.status==="correct").length,
      repeat: attempts.filter(a=>a.status==="repeat").length,
      makhraj: attempts.filter(a=>a.status==="makhraj_issue").length,
    }));
  },[rows]);

  async function assign(studentId:string, lessonSlug:string, itemText:string){
    const instructions=window.prompt("ہوم ورک کی ہدایات لکھیں:",`اس سبق کی کم از کم 3 مرتبہ مشق کریں: ${itemText}`)||"";
    if(!instructions) return;
    const r=await fetch("/api/teacher/qaida/homework",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId,lessonSlug,itemText,instructions})});
    const j=await r.json();
    setMessage(j.ok?"✓ Homework assign ہو گیا۔":j.error||"Failed.");
  }

  return <div className="qaida-intelligence-teacher" dir="rtl">
    {message&&<div className="qaida-review-message">{message}</div>}
    {students.length===0?<section className="dashboard-panel"><p>ابھی reviewed attempts موجود نہیں۔</p></section>:students.map((s:any)=>{
      const weak=s.attempts.find((a:any)=>a.status==="makhraj_issue"||a.status==="repeat");
      return <article key={s.studentId} className="qaida-student-intel-card">
        <header><div><strong>{s.name}</strong><span>{s.code}</span></div><div className="qaida-mini-stats"><b>✓ {s.correct}</b><b>↻ {s.repeat}</b><b>⚠ {s.makhraj}</b></div></header>
        {weak?<div className="qaida-weak-focus"><span>اگلی ترجیح</span><strong>{weak.item_text}</strong><small>{weak.lesson_slug}</small><button onClick={()=>assign(s.studentId,weak.lesson_slug,weak.item_text)}>ہوم ورک بنائیں</button></div>:<p>حالیہ attempts میں repeat/makhraj issue موجود نہیں۔</p>}
      </article>;
    })}
  </div>;
}
