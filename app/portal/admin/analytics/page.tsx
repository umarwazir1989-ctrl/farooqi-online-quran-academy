import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getAdminAnalytics } from "@/lib/operationsServer";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireRole(["admin"]);
  const { overview, teacherLoad, studentProgress } = await getAdminAnalytics();

  const attendanceBase =
    Number(overview.classes_this_month || 0) -
    0;

  const attendanceRate = attendanceBase
    ? Math.round((Number(overview.present_this_month || 0) / attendanceBase) * 100)
    : 0;

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Academy Analytics</h1>
          <p>Live operational overview from Supabase.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="analytics-card-grid">
        <article><strong>{overview.active_students}</strong><span>Active Students</span></article>
        <article><strong>{overview.active_teachers}</strong><span>Active Teachers</span></article>
        <article><strong>{overview.classes_this_month}</strong><span>Classes This Month</span></article>
        <article><strong>{attendanceRate}%</strong><span>Present Rate</span></article>
        <article><strong>{overview.pending_reschedules}</strong><span>Pending Reschedules</span></article>
        <article><strong>{overview.reports_published_this_month}</strong><span>Reports Published</span></article>
      </div>

      <section className="content-panel">
        <h2>Teacher Load</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Code</th>
                <th>Active Students</th>
                <th>Capacity</th>
                <th>Load</th>
              </tr>
            </thead>
            <tbody>
              {teacherLoad.map((t: any) => {
                const active = (t.enrollments || []).filter((e: any) => e.status === "active").length;
                const pct = t.max_students ? Math.round((active / t.max_students) * 100) : 0;
                return (
                  <tr key={t.id}>
                    <td><strong>{t.full_name}</strong></td>
                    <td>{t.teacher_code || "—"}</td>
                    <td>{active}</td>
                    <td>{t.max_students}</td>
                    <td>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-panel">
        <h2>Student Progress Snapshot</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Classes</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Average</th>
                <th>Last Class</th>
              </tr>
            </thead>
            <tbody>
              {studentProgress.map((s: any) => (
                <tr key={s.student_id}>
                  <td><strong>{s.student_name}</strong><small>{s.student_code}</small></td>
                  <td>{s.total_recorded_classes}</td>
                  <td>{s.present_classes}</td>
                  <td>{s.absent_classes}</td>
                  <td>{s.average_performance ? `${s.average_performance}/5` : "—"}</td>
                  <td>{s.last_class_date || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
