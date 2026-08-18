"use client";
import { FormEvent, useState } from "react";

export default function TeacherEditForm({teacher}:{teacher:any}) {
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setStatus("");
    const f=new FormData(e.currentTarget);

    const res=await fetch(`/api/admin/teachers/${teacher.id}/update`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        fullName:f.get("fullName"),
        email:f.get("email"),
        phone:f.get("phone"),
        country:f.get("country"),
        timezone:f.get("timezone"),
        maxStudents:f.get("maxStudents"),
        status:f.get("status"),
      })
    });

    const data=await res.json();
    setStatus(data.ok?"Teacher profile updated ✓":data.error||"Update failed.");
    setBusy(false);
  }

  return <form className="admin-ops-form" onSubmit={submit}>
    <h2>Edit Teacher Profile</h2>

    <div className="form-row">
      <label>Teacher name<input name="fullName" defaultValue={teacher.full_name||""} required/></label>
      <label>Teacher code<input value={teacher.teacher_code||""} disabled/></label>
    </div>

    <div className="form-row">
      <label>Email<input name="email" type="email" defaultValue={teacher.email||""}/></label>
      <label>Phone<input name="phone" defaultValue={teacher.phone||""}/></label>
    </div>

    <div className="form-row">
      <label>Country<input name="country" defaultValue={teacher.country||""}/></label>
      <label>Timezone<input name="timezone" defaultValue={teacher.timezone||""}/></label>
    </div>

    <div className="form-row">
      <label>Max students<input name="maxStudents" type="number" min="1" defaultValue={teacher.max_students||""}/></label>
      <label>Status<select name="status" defaultValue={teacher.status||"active"}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select></label>
    </div>

    <button className="btn" disabled={busy}>{busy?"Saving…":"Save Teacher"}</button>
    <p className="form-status">{status}</p>
  </form>;
}
