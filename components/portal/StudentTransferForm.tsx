"use client";
import { FormEvent, useState } from "react";
export default function StudentTransferForm({teachers,enrollments}:{teachers:any[];enrollments:any[]}) {
  const [busy,setBusy]=useState(false),[status,setStatus]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setStatus("");
    const f=new FormData(e.currentTarget);
    const res=await fetch("/api/admin/transfers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      enrollmentId:f.get("enrollmentId"),toTeacherId:f.get("toTeacherId"),effectiveDate:f.get("effectiveDate"),reason:f.get("reason")
    })});
    const d=await res.json();setStatus(d.ok?"Student transferred ✓":d.error||"Failed.");setBusy(false);
    if(d.ok)setTimeout(()=>window.location.reload(),500);
  }
  return <form className="admin-ops-form" onSubmit={submit}><h2>Transfer Student</h2>
    <label>Current enrollment<select name="enrollmentId" defaultValue="" required><option value="" disabled>Select student</option>
      {enrollments.map((e:any)=><option key={e.id} value={e.id}>{e.students?.full_name} — {e.teachers?.full_name||"No teacher"}</option>)}
    </select></label>
    <label>New teacher<select name="toTeacherId" defaultValue="" required><option value="" disabled>Select teacher</option>{teachers.map((t:any)=><option key={t.id} value={t.id}>{t.full_name}</option>)}</select></label>
    <label>Effective date<input name="effectiveDate" type="date" required/></label>
    <label>Reason<textarea name="reason" rows={3}/></label>
    <button className="btn" disabled={busy}>{busy?"Transferring…":"Transfer Student"}</button><p className="form-status">{status}</p>
  </form>;
}
