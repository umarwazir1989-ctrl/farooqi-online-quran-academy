"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Course = { id: string; name_en: string; name_ur: string };
type Teacher = { id: string; full_name: string; gender?: string | null };

export default function ConvertTrialForm({
  trialId,
  courses,
  teachers,
  preferredDays,
  preferredTime,
  timezone,
}: {
  trialId: string;
  courses: Course[];
  teachers: Teacher[];
  preferredDays: string[];
  preferredTime?: string | null;
  timezone?: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const form = new FormData(e.currentTarget);
    const days = form.getAll("days").map(String);

    const response = await fetch(`/api/admin/trials/${trialId}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: form.get("courseId"),
        teacherId: form.get("teacherId"),
        days,
        startTime: form.get("startTime"),
        durationMinutes: form.get("durationMinutes"),
        timezone: form.get("timezone"),
        adminNotes: form.get("adminNotes"),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      setStatus(data.error || "Could not enroll student.");
      setBusy(false);
      return;
    }

    setStatus(`Student enrolled: ${data.studentCode}`);
    router.push("/portal/admin/students");
    router.refresh();
  }

  const allDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  return (
    <form className="convert-trial-form" onSubmit={submit}>
      <h2>Convert to Student</h2>

      <label>
        Course *
        <select name="courseId" required defaultValue="">
          <option value="" disabled>Select course</option>
          {courses.map((c) => (
            <option value={c.id} key={c.id}>{c.name_en}</option>
          ))}
        </select>
      </label>

      <label>
        Teacher
        <select name="teacherId" defaultValue="">
          <option value="">Assign later</option>
          {teachers.map((t) => (
            <option value={t.id} key={t.id}>
              {t.full_name}{t.gender ? ` · ${t.gender}` : ""}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="days-fieldset">
        <legend>Weekly class days</legend>
        <div className="days-grid">
          {allDays.map((day) => (
            <label className="check-option" key={day}>
              <input
                type="checkbox"
                name="days"
                value={day}
                defaultChecked={preferredDays.includes(day)}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <label>
          Start time
          <input name="startTime" type="time" />
          {preferredTime ? <small>Requested: {preferredTime}</small> : null}
        </label>

        <label>
          Duration
          <select name="durationMinutes" defaultValue="30">
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </label>
      </div>

      <label>
        Timezone
        <input
          name="timezone"
          defaultValue={timezone || "Asia/Karachi"}
          required
        />
      </label>

      <label>
        Admin notes
        <textarea name="adminNotes" rows={4} />
      </label>

      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Enrolling…" : "Approve & Enroll Student"}
      </button>

      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}
