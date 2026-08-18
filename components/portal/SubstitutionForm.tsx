"use client";
import { FormEvent, useState } from "react";
export default function SubstitutionForm({teachers,enrollments}:{teachers:any[];enrollments:any[]}) {
  const [busy,setBusy]=useState(false),[status,setStatus]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setStatus("");
    const f=new FormData(e.currentTarget);
    const enrollmentId=String(f.get("enrollmentId")||"");
    const selected=enrollments.find((x:any)=>x.id===enrollmentId);
    const res=await fetch("/api/admin/substitutions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      originalTeacherId:selected?.teacher_id||"",substituteTeacherId:f.get("substituteTeacherId"),
      studentId:selected?.student_id||"",enrollmentId,startDate:f.get("startDate"),endDate:f.get("endDate"),reason:f.get("reason")
    })});
    const d=await res.json();setStatus(d.ok?"Substitution saved ✓":d.error||"Failed.");setBusy(false);
    if(d.ok)setTimeout(()=>window.location.reload(),500);
  }
  return <form className="admin-ops-form" onSubmit={submit}><h2>Assign Substitute Teacher</h2>
    <label>Student enrollment<select name="enrollmentId" required defaultValue=""><option value="" disabled>Select enrollment</option>
      {enrollments.map((e:any)=><option value={e.id} key={e.id}>{e.students?.full_name} — {e.teachers?.full_name}</option>)}
    </select></label>
    <label>Substitute teacher<select name="substituteTeacherId" required defaultValue=""><option value="" disabled>Select teacher</option>
      {teachers.map((t:any)=><option value={t.id} key={t.id}>{t.full_name}</option>)}
    </select></label>
    <div className="form-row"><label>Start<input name="startDate" type="date" required/></label><label>End<input name="endDate" type="date" required/></label></div>
    <label>Reason<textarea name="reason" rows={3}/></label>
    <button className="btn" disabled={busy}>{busy?"Saving…":"Assign Substitute"}</button><p className="form-status">{status}</p>
  </form>;
}
