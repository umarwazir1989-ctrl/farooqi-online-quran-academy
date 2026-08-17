import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listTrialApplications } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminTrialsPage() {
  await requireRole(["admin"]);

  let rows: any[] = [];
  let error = "";

  try {
    rows = await listTrialApplications(150);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load applications";
  }

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Trial Applications</h1>
          <p>{rows.length} applications</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      {error ? <div className="admin-error">{error}</div> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Country</th>
              <th>Course</th>
              <th>WhatsApp</th>
              <th>Preferred Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td><strong>{r.student_name}</strong><small>{r.parent_name || ""}</small></td>
                <td>{r.country}{r.city ? ` · ${r.city}` : ""}</td>
                <td>{r.course}</td>
                <td><a href={`https://wa.me/${String(r.whatsapp).replace(/\D/g, "")}`} target="_blank">{r.whatsapp}</a></td>
                <td>{r.preferred_time || "—"}</td>
                <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                <td><Link className="table-action" href={`/portal/admin/trials/${r.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
