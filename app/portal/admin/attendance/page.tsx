import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listAttendanceRecords } from "@/lib/learningServer";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  await requireRole(["admin"]);
  const rows = await listAttendanceRecords();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Attendance & Class Records</h1>
          <p>{rows.length} recent records</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Teacher</th>
              <th>Course</th>
              <th>Attendance</th>
              <th>Lesson</th>
              <th>Score</th>
              <th>Homework</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td>{r.class_date}</td>
                <td><strong>{r.student_name}</strong><small>{r.student_code}</small></td>
                <td>{r.teacher_name || "—"}</td>
                <td>{r.course_name_en}</td>
                <td><span className={`status-pill status-${r.attendance_status}`}>{r.attendance_status}</span></td>
                <td>{r.lesson_title || r.new_lesson || "—"}</td>
                <td>{r.performance_score ? `${r.performance_score}/5` : "—"}</td>
                <td>{r.homework || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
