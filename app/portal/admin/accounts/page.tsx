import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listPortalAccounts } from "@/lib/portalData";
import InviteAccountForm from "@/components/portal/InviteAccountForm";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  await requireRole(["admin"]);
  const rows = await listPortalAccounts();
  return <main className="admin-shell">
    <div className="admin-top">
      <div><span className="eyebrow">Farooqi Admin</span><h1>Portal Accounts</h1>
      <p>Create portal access for students, parents and teachers.</p></div>
      <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
    </div>
    <div className="admin-table-wrap">
      <table className="admin-table account-table">
        <thead><tr><th>Role</th><th>Name</th><th>Reference</th><th>Status</th><th>Email / Invitation</th></tr></thead>
        <tbody>{rows.map((r:any)=><tr key={`${r.role}-${r.record_id}`}>
          <td><span className="role-badge">{r.role}</span></td>
          <td><strong>{r.full_name||"Unnamed"}</strong></td>
          <td>{r.reference_code||"—"}</td><td>{r.status}</td>
          <td><InviteAccountForm role={r.role} recordId={r.record_id} fullName={r.full_name}
          initialEmail={r.email} linked={Boolean(r.user_id)} /></td>
        </tr>)}</tbody>
      </table>
    </div>
  </main>;
}
