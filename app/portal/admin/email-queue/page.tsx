import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listEmailQueue } from "@/lib/phase8Server";
import EmailQueueForm from "@/components/portal/EmailQueueForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireRole(["admin"]);
  const rows = await listEmailQueue();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Email Notification Queue</h1>
          <p>Prepare email notifications before connecting an outbound email provider.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <EmailQueueForm />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=>(
              <tr key={r.id}>
                <td><strong>{r.recipient_name || "—"}</strong><small>{r.recipient_email}</small></td>
                <td>{r.subject}</td>
                <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                <td>{r.attempts}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
