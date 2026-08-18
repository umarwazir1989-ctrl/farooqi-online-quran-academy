import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listAllLeaveRequests } from "@/lib/adminOpsServer";
import LeaveDecision from "@/components/portal/LeaveDecision";

export const dynamic = "force-dynamic";

export default async function AdminLeavePage() {
  await requireRole(["admin"]);
  const rows = await listAllLeaveRequests();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Teacher Leave Requests</h1>
          <p>{rows.filter((r: any) => r.status === "pending").length} pending</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td><strong>{r.teacher_name}</strong><small>{r.teacher_code}</small></td>
                <td>{r.leave_type}</td>
                <td>{r.start_date}</td>
                <td>{r.end_date}</td>
                <td>{r.reason || "—"}</td>
                <td><LeaveDecision id={r.id} currentStatus={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
