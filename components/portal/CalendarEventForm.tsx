"use client";
import { FormEvent, useState } from "react";

export default function CalendarEventForm() {
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setStatus("");
    const f=new FormData(e.currentTarget);

    const res=await fetch("/api/admin/calendar",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        titleEn:f.get("titleEn"), titleUr:f.get("titleUr"),
        eventType:f.get("eventType"), startDate:f.get("startDate"), endDate:f.get("endDate"),
        descriptionEn:f.get("descriptionEn"), descriptionUr:f.get("descriptionUr"),
        appliesTo:f.get("appliesTo"),
      })
    });
    const data=await res.json();
    setStatus(data.ok?"Calendar event saved ✓":data.error||"Save failed.");
    setBusy(false);
    if(data.ok)setTimeout(()=>window.location.reload(),500);
  }

  return <form className="admin-ops-form" onSubmit={submit}>
    <h2>Add Calendar Event</h2>
    <div className="form-row">
      <label>English title<input name="titleEn" required/></label>
      <label dir="rtl">اردو عنوان<input name="titleUr" dir="rtl"/></label>
    </div>
    <div className="form-row">
      <label>Type<select name="eventType" defaultValue="holiday">
        <option value="holiday">Holiday</option><option value="exam">Exam</option>
        <option value="event">Event</option><option value="training">Training</option>
        <option value="closure">Closure</option><option value="other">Other</option>
      </select></label>
      <label>Applies to<select name="appliesTo" defaultValue="all">
        <option value="all">Everyone</option><option value="students">Students</option>
        <option value="teachers">Teachers</option><option value="staff">Staff</option>
      </select></label>
    </div>
    <div className="form-row">
      <label>Start date<input name="startDate" type="date" required/></label>
      <label>End date<input name="endDate" type="date" required/></label>
    </div>
    <div className="form-row">
      <label>Description<textarea name="descriptionEn" rows={3}/></label>
      <label dir="rtl">تفصیل<textarea name="descriptionUr" rows={3} dir="rtl"/></label>
    </div>
    <button className="btn" disabled={busy}>{busy?"Saving…":"Save Event"}</button>
    <p className="form-status">{status}</p>
  </form>;
}
