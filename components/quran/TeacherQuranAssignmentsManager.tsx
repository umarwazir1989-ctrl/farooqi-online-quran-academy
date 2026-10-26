"use client";

import { useEffect,useState } from "react";
import TeacherQuranAssignmentForm from "@/components/quran/TeacherQuranAssignmentForm";

export default function TeacherQuranAssignmentsManager(){
  const [rows,setRows]=useState<any[]>([]);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(true);

  async function load(){
    const r=await fetch("/api/teacher/quran/assignments",{cache:"no-store"});
    const j=await r.json();
    setRows(j.assignments||[]);
    setLoading(false);
  }

  useEffect(()=>{void load();},[]);

  async function complete(id:string){
    const note=window.prompt("Completion note / teacher feedback:","")||"";
    const r=await fetch(`/api/teacher/quran/assignments/${id}/complete`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({note}),
    });
    const j=await r.json();
    setMessage(j.ok?`✓ Assignment completed — score ${j.assignment?.completion_score ?? 0}%`:j.error||"Failed.");
    if(j.ok)await load();
  }

  return <div className="teacher-quran-assignment-manager" dir="rtl">
    <TeacherQuranAssignmentForm/>
    {message&&<div className="quran-inline-message">{message}</div>}

    <section className="dashboard-panel">
      <h2>Assigned Quran Work</h2>
      {loading?<p>Loading…</p>:<div className="teacher-quran-assignment-list">
        {rows.length===0?<p>No Quran assignments yet.</p>:rows.map((a:any)=><article key={a.id}>
          <div>
            <strong>{a.students?.full_name||"Student"}</strong>
            <span>{a.students?.student_code||""}</span>
          </div>
          <div>
            <strong>سورت {a.surah_number}</strong>
            <span>آیات {a.ayah_from} تا {a.ayah_to}</span>
          </div>
          <span className={`status-pill status-${a.status}`}>{a.status}</span>
          <small>{a.due_date?`Due ${a.due_date}`:"No due date"}</small>
          {a.status==="submitted"
            ? <button onClick={()=>complete(a.id)}>Review & Complete</button>
            : a.status==="completed"
              ? <b>{a.completion_score ?? 0}%</b>
              : null}
        </article>)}
      </div>}
    </section>
  </div>;
}
