import { requireRole } from "@/lib/portalAuth";
import { getStudentPrintProfile } from "@/lib/phase8Server";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const { student, recentClasses, reports } = await getStudentPrintProfile(id);

  return (
    <main className="student-print-page">
      <div className="print-toolbar">
        <button onClick={undefined} className="print-note">
          Use browser: Ctrl+P / Print
        </button>
      </div>

      <section className="student-print-sheet">
        <header>
          <div>
            <span>Farooqi Online Quran Academy</span>
            <h1>Student Academic Profile</h1>
          </div>
          <strong>{student.student_code}</strong>
        </header>

        <div className="student-print-grid">
          <div><span>Name</span><strong>{student.full_name}</strong></div>
          <div><span>Status</span><strong>{student.status}</strong></div>
          <div><span>Parent</span><strong>{student.parent_name || "—"}</strong></div>
          <div><span>Phone</span><strong>{student.phone || student.parent_phone || "—"}</strong></div>
          <div><span>Email</span><strong>{student.email || student.parent_email || "—"}</strong></div>
          <div><span>Country</span><strong>{student.country || "—"}</strong></div>
          <div><span>Course</span><strong>{student.course_name || "—"}</strong></div>
          <div><span>Teacher</span><strong>{student.teacher_name || "—"}</strong></div>
        </div>

        <section>
          <h2>Recent Classes</h2>
          <table>
            <thead><tr><th>Date</th><th>Lesson</th><th>Attendance</th><th>Score</th></tr></thead>
            <tbody>
              {recentClasses.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.class_date}</td>
                  <td>{r.lesson_title || r.new_lesson || "—"}</td>
                  <td>{r.attendance_status}</td>
                  <td>{r.performance_score ? `${r.performance_score}/5` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Monthly Reports</h2>
          <table>
            <thead><tr><th>Month</th><th>Attendance</th><th>Performance</th><th>Summary</th></tr></thead>
            <tbody>
              {reports.map((r: any) => (
                <tr key={r.id}>
                  <td>{String(r.report_month).slice(0,7)}</td>
                  <td>{r.attendance_percentage}%</td>
                  <td>{r.average_performance ? `${r.average_performance}/5` : "—"}</td>
                  <td>{r.progress_summary || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
