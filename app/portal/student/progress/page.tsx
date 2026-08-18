import { requireRole } from "@/lib/portalAuth";
import { getStudentClassRecordsByUser } from "@/lib/learningServer";
import DashboardShell from "@/components/portal/DashboardShell";

export const dynamic = "force-dynamic";

export default async function StudentProgressPage() {
  const profile = await requireRole(["student"]);
  const { student, records, reports } = await getStudentClassRecordsByUser(profile.id);

  const present = records.filter((r: any) => r.attendance_status === "present").length;
  const absent = records.filter((r: any) => r.attendance_status === "absent").length;
  const scored = records.filter((r: any) => typeof r.performance_score === "number");
  const average = scored.length
    ? (scored.reduce((sum: number, r: any) => sum + r.performance_score, 0) / scored.length).toFixed(1)
    : "—";

  return (
    <DashboardShell
      role="Student"
      name={student?.full_name || profile.full_name}
      title="My Progress"
      subtitle="Attendance, lessons, homework and monthly progress reports."
      cards={[
        [String(records.length), "Recent Classes", "Recorded class reports"],
        [String(present), "Present", "Recent attendance"],
        [String(absent), "Absent", "Recent absences"],
        [String(average), "Performance", "Average score out of 5"],
      ]}
      links={[
        ["Dashboard", "/portal/student"],
        ["My Progress", "/portal/student/progress"],
      ]}
    >
      <section className="dashboard-panel">
        <h2>Recent Classes</h2>
        <div className="progress-timeline">
          {records.length === 0 ? <p>No class reports yet.</p> : records.map((r: any) => (
            <article key={r.id}>
              <div className="progress-date">{r.class_date}</div>
              <div>
                <strong>{r.course_name_en}</strong>
                <p>{r.lesson_title || r.new_lesson || "Class completed"}</p>
                {r.homework ? <small><b>Homework:</b> {r.homework}</small> : null}
              </div>
              <div>
                <span className={`status-pill status-${r.attendance_status}`}>{r.attendance_status}</span>
                <small>{r.performance_score ? `${r.performance_score}/5` : ""}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>Monthly Reports</h2>
        <div className="report-card-grid">
          {reports.length === 0 ? <p>No published monthly report yet.</p> : reports.map((r: any) => (
            <article key={r.id}>
              <strong>{String(r.report_month).slice(0, 7)}</strong>
              <span>{r.attendance_percentage}% attendance</span>
              <p>{r.progress_summary || "Progress report"}</p>
              {r.next_month_goal ? <small>Next goal: {r.next_month_goal}</small> : null}
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
