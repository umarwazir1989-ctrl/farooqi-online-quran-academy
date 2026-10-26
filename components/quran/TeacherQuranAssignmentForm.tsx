"use client";

import { useEffect, useState } from "react";

export default function TeacherQuranAssignmentForm() {
  const [students,setStudents]=useState<any[]>([]);
  const [studentId,setStudentId]=useState("");
  const [surah,setSurah]=useState(1);
  const [from,setFrom]=useState(1);
  const [to,setTo]=useState(1);
  const [due,setDue]=useState("");
  const [instructions,setInstructions]=useState("");
  const [message,setMessage]=useState("");

  useEffect(()=>{
    fetch("/api/teacher/quran/students",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>{
        setStudents(j.students||[]);
        if(j.students?.[0]?.id)setStudentId(j.students[0].id);
      });
  },[]);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    const r=await fetch("/api/teacher/quran/assignments",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        studentId,
        surahNumber:surah,
        ayahFrom:from,
        ayahTo:to,
        dueDate:due||null,
        instructions,
      }),
    });
    const j=await r.json();
    setMessage(j.ok?"✓ قرآن assignment محفوظ ہو گیا۔":j.error||"Failed.");
  }

  return <form className="quran-assignment-form" onSubmit={submit} dir="rtl">
    <h2>نیا قرآن Assignment</h2>

    <label>
      طالب علم
      <select value={studentId} onChange={e=>setStudentId(e.target.value)} required>
        {students.map((s:any)=><option key={s.id} value={s.id}>
          {s.full_name} {s.student_code ? `(${s.student_code})` : ""}
        </option>)}
      </select>
    </label>

    <div className="quran-assignment-grid">
      <label>سورت نمبر<input type="number" min="1" max="114" value={surah} onChange={e=>setSurah(Number(e.target.value))}/></label>
      <label>آیت از<input type="number" min="1" value={from} onChange={e=>setFrom(Number(e.target.value))}/></label>
      <label>آیت تا<input type="number" min="1" value={to} onChange={e=>setTo(Number(e.target.value))}/></label>
      <label>تاریخِ تکمیل<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label>
    </div>

    <label>
      ہدایات
      <textarea rows={4} value={instructions} onChange={e=>setInstructions(e.target.value)}
        placeholder="مثلاً آیات 1 تا 5 لفظ بہ لفظ سن کر تین مرتبہ پڑھیں، پھر recording بھیجیں۔"/>
    </label>

    <button type="submit">Assignment محفوظ کریں</button>
    {message&&<p>{message}</p>}
  </form>;
}
