import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";

export default async function BackupPage() {
  await requireRole(["admin"]);

  const exports = [
    ["Students", "students"],
    ["Teachers", "teachers"],
    ["Parents", "parents"],
    ["Enrollments", "enrollments"],
    ["Schedules", "schedules"],
    ["Attendance / Class Records", "attendance"],
    ["Monthly Reports", "reports"],
    ["Trial Applications", "trials"],
  ];

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Backup & Export</h1>
          <p>Download important academy data as UTF-8 CSV files.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="backup-grid">
        {exports.map(([label, type]) => (
          <article key={type}>
            <strong>{label}</strong>
            <p>Download current records for archive or offline backup.</p>
            <a className="btn" href={`/api/admin/export/${type}`}>
              Download CSV
            </a>
          </article>
        ))}
      </div>

      <section className="content-panel notice-panel">
        <h2>Backup note</h2>
        <p>
          CSV exports are useful operational backups. Supabase database backups
          should also remain enabled according to your Supabase project plan.
        </p>
      </section>
    </main>
  );
}
