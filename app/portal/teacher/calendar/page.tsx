import { requireRole } from "@/lib/portalAuth";
import { getTeacherCalendarData } from "@/lib/operationsServer";
import DashboardShell from "@/components/portal/DashboardShell";
import RescheduleForm from "@/components/portal/RescheduleForm";

export const dynamic = "force-dynamic";

export default async function TeacherCalendarPage() {
  const profile = await requireRole(["teacher"]);
  const { teacher, enrollments, reschedules } = await getTeacherCalendarData(profile.id);

  const activeSchedules = enrollments.flatMap((e: any) =>
    (e.class_schedules || []).filter((s: any) => s.status === "active")
  );

  return (
    <DashboardShell
      role="Teacher"
      name={teacher?.full_name || profile.full_name}
      title="Class Calendar"
      subtitle="View weekly schedules and request reschedules or make-up classes."
      cards={[
        [String(enrollments.length), "Students", "Assigned active learners"],
        [String(activeSchedules.length), "Schedules", "Weekly class schedules"],
        [String(reschedules.filter((r: any) => r.status === "pending").length), "Pending", "Reschedule requests"],
        ["Make-up", "Classes", "Request alternate sessions"],
      ]}
      links={[
        ["Dashboard", "/portal/teacher"],
        ["Record Classes", "/portal/teacher/classes"],
        ["Class Calendar", "/portal/teacher/calendar"],
      ]}
    >
      <section className="dashboard-panel">
        <h2>Weekly Schedule</h2>

        <div className="calendar-grid">
          {enrollments.map((e: any) => (
            <article key={e.id}>
              <strong>{e.students?.full_name}</strong>
              <span>{e.courses?.name_en}</span>
              <p>{(e.class_schedules?.[0]?.days_of_week || []).join(", ") || "Days pending"}</p>
              <small>
                {e.class_schedules?.[0]?.start_time || "Time pending"} ·{" "}
                {e.class_schedules?.[0]?.timezone || e.students?.timezone || ""}
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>Reschedule / Make-up Request</h2>

        <div className="reschedule-grid">
          {enrollments.map((e: any) => (
            <RescheduleForm
              key={e.id}
              enrollmentId={e.id}
              studentName={e.students?.full_name || "Student"}
              timezone={e.class_schedules?.[0]?.timezone || e.students?.timezone}
            />
          ))}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>Recent Requests</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Original</th>
                <th>Requested</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reschedules.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.student_name}</td>
                  <td>{r.original_date}</td>
                  <td>{r.requested_date} {r.requested_time || ""}</td>
                  <td>{r.request_type}</td>
                  <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
