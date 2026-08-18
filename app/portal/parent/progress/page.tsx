import { requireRole } from "@/lib/portalAuth";
import { getParentProgressByUser } from "@/lib/learningServer";
import DashboardShell from "@/components/portal/DashboardShell";

export const dynamic = "force-dynamic";

export default async function ParentProgressPage() {
  const profile = await requireRole(["parent"]);
  const { parent, children } = await getParentProgressByUser(profile.id);

  return (
    <DashboardShell
      role="Parent"
      name={parent?.full_name || profile.full_name}
      title="Children Progress"
      subtitle="View class attendance, homework and published monthly reports."
      cards={[
        [String(children.length), "Children", "Linked student profiles"],
        ["Live", "Class Reports", "Teacher-updated progress"],
        ["Monthly", "Reports", "Published learning summary"],
        ["Parent", "View", "Attendance and homework"],
      ]}
      links={[
        ["Dashboard", "/portal/parent"],
        ["Progress", "/portal/parent/progress"],
      ]}
    >
      {children.length === 0 ? (
        <section className="dashboard-panel"><p>No linked student profiles.</p></section>
      ) : children.map((child: any) => (
        <section className="dashboard-panel" key={child.id}>
          <h2>{child.full_name} <small>{child.student_code}</small></h2>

          <div className="progress-timeline">
            {child.records.length === 0 ? <p>No class reports yet.</p> : child.records.map((r: any) => (
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

          <div className="report-card-grid">
            {child.reports.map((r: any) => (
              <article key={r.id}>
                <strong>{String(r.report_month).slice(0, 7)}</strong>
                <span>{r.attendance_percentage}% attendance</span>
                <p>{r.progress_summary || "Monthly progress report"}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </DashboardShell>
  );
}
