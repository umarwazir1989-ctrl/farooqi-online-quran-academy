"use client";
import { FormEvent, useState } from "react";

export default function StudentEditForm({student}:{student:any}) {
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setStatus("");
    const f=new FormData(e.currentTarget);

    const res=await fetch(`/api/admin/students/${student.id}/update`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        fullName:f.get("fullName"),
        email:f.get("email"),
        country:f.get("country"),
        timezone:f.get("timezone"),
        status:f.get("status"),
        parentName:f.get("parentName"),
        parentEmail:f.get("parentEmail"),
        parentPhone:f.get("parentPhone"),
      })
    });

    const data=await res.json();
    setStatus(data.ok?"Student profile updated ✓":data.error||"Update failed.");
    setBusy(false);
  }

  return <form className="admin-ops-form" onSubmit={submit}>
    <h2>Edit Student Profile</h2>

    <div className="form-row">
      <label>Student name<input name="fullName" defaultValue={student.full_name||""} required/></label>
      <label>Student code<input value={student.student_code||""} disabled/></label>
    </div>

    <div className="form-row">
      <label>Email<input name="email" type="email" defaultValue={student.email||""}/></label>
      <label>Status<select name="status" defaultValue={student.status||"active"}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select></label>
    </div>

    <div className="form-row">
      <label>Country<input name="country" defaultValue={student.country||""}/></label>
      <label>Timezone<input name="timezone" defaultValue={student.timezone||""}/></label>
    </div>

    <h3>Parent</h3>

    <div className="form-row">
      <label>Parent name<input name="parentName" defaultValue={student.parents?.full_name||""}/></label>
      <label>Parent phone<input name="parentPhone" defaultValue={student.parents?.phone||""}/></label>
    </div>

    <label>Parent email<input name="parentEmail" type="email" defaultValue={student.parents?.email||""}/></label>

    <button className="btn" disabled={busy}>{busy?"Saving…":"Save Student"}</button>
    <p className="form-status">{status}</p>
  </form>;
}
