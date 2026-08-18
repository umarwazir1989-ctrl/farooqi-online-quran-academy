import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listAuditLogs } from "@/lib/adminOpsServer";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  await requireRole(["admin"]);
  const rows = await listAuditLogs();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Audit Log</h1>
          <p>Administrative and portal activity history.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Role</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.actor_role || "system"}</td>
                <td><strong>{r.action}</strong></td>
                <td>{r.entity_type || "—"}</td>
                <td>{r.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
