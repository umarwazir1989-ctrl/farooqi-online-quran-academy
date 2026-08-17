import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listSchedules } from "@/lib/academyServer";

export const dynamic = "force-dynamic";

export default async function SchedulesPage() {
  await requireRole(["admin"]);
  const rows = await listSchedules();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Class Schedules</h1>
          <p>{rows?.length || 0} active schedules</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Teacher</th>
              <th>Course</th>
              <th>Days</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r: any) => (
              <tr key={r.id}>
                <td><strong>{r.students?.full_name || "—"}</strong><small>{r.students?.student_code || ""}</small></td>
                <td>{r.teachers?.full_name || "Unassigned"}</td>
                <td>{r.enrollments?.courses?.name_en || "—"}</td>
                <td>{(r.days_of_week || []).join(", ") || "—"}</td>
                <td>{r.start_time || "—"}</td>
                <td>{r.duration_minutes} min</td>
                <td>{r.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
