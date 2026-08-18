import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getActionCenter } from "@/lib/phase9Server";

export const dynamic = "force-dynamic";

export default async function ActionCenterPage() {
  await requireRole(["admin"]);
  const data = await getActionCenter();

  const actions = [
    ["New Trial Applications", data.new_trials, "/portal/admin/trials"],
    ["Pending Reschedules", data.pending_reschedules, "/portal/admin/reschedules"],
    ["Teacher Leave Requests", data.pending_leave_requests, "/portal/admin/leave"],
    ["Import Batches to Review", data.import_batches_to_review, "/portal/admin/import"],
    ["Pending Emails", data.pending_emails, "/portal/admin/email-queue"],
    ["Unread Parent Notifications", data.unread_parent_notifications, "/portal/admin/analytics"],
  ];

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Action Center</h1>
          <p>Items that currently need administrative attention.</p>
        </div>

        <Link className="btn btn-outline" href="/portal/admin">
          Dashboard
        </Link>
      </div>

      <div className="action-center-grid">
        {actions.map(([label, count, href]: any) => (
          <Link href={href} className="action-center-card" key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
            <small>{Number(count) > 0 ? "Needs attention" : "Nothing pending"}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}
