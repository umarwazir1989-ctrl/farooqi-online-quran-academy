import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listRescheduleRequests } from "@/lib/operationsServer";
import RescheduleDecision from "@/components/portal/RescheduleDecision";

export const dynamic = "force-dynamic";

export default async function AdminReschedulesPage() {
  await requireRole(["admin"]);
  const rows = await listRescheduleRequests();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Reschedule & Make-up Requests</h1>
          <p>{rows.filter((r: any) => r.status === "pending").length} pending requests</p>
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
              <th>Original</th>
              <th>Requested</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td><strong>{r.student_name}</strong><small>{r.student_code}</small></td>
                <td>{r.teacher_name || "—"}</td>
                <td>{r.course_name_en}</td>
                <td>{r.original_date}</td>
                <td>{r.requested_date} {r.requested_time || ""}</td>
                <td>{r.request_type}</td>
                <td>{r.reason || "—"}</td>
                <td><RescheduleDecision id={r.id} currentStatus={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
