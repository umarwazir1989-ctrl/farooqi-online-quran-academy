import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { listMonthlyReports } from "@/lib/learningServer";
import MonthlyReportForm from "@/components/portal/MonthlyReportForm";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await requireRole(["admin"]);

  const sb = getSupabaseAdmin();
  const [{ data: students, error }, reports] = await Promise.all([
    sb.from("students").select("id,full_name,student_code,status").eq("status","active").order("full_name"),
    listMonthlyReports(),
  ]);

  if (error) throw error;

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Monthly Progress Reports</h1>
          <p>Generate attendance and learning summaries for students.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="monthly-report-grid">
        {(students || []).map((s: any) => (
          <MonthlyReportForm key={s.id} studentId={s.id} studentName={`${s.full_name} · ${s.student_code}`} />
        ))}
      </div>

      <section className="content-panel">
        <h2>Generated Reports</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Student</th>
                <th>Classes</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r: any) => (
                <tr key={r.id}>
                  <td>{String(r.report_month).slice(0,7)}</td>
                  <td>{r.students?.full_name || "—"}</td>
                  <td>{r.total_classes}</td>
                  <td>{r.attendance_percentage}%</td>
                  <td>{r.average_performance ? `${r.average_performance}/5` : "—"}</td>
                  <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
