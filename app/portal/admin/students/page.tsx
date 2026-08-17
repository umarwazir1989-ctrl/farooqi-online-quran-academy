import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listStudents } from "@/lib/academyServer";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  await requireRole(["admin"]);
  const rows = await listStudents();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Students</h1>
          <p>{rows?.length || 0} records</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Code</th>
              <th>Student</th>
              <th>Country</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Weekly Days</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r: any) => (
              <tr key={`${r.student_id}-${r.course_name || "none"}`}>
                <td><strong>{r.student_code}</strong></td>
                <td>{r.student_name}</td>
                <td>{r.country || "—"}</td>
                <td>{r.course_name || "Not enrolled"}</td>
                <td>{r.teacher_name || "Unassigned"}</td>
                <td>{(r.days_of_week || []).join(", ") || "—"}</td>
                <td>{r.start_time ? `${r.start_time} · ${r.timezone}` : "—"}</td>
                <td><span className="status-pill status-enrolled">{r.student_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
