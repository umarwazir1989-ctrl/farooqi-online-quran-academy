import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listAnnouncements } from "@/lib/adminOpsServer";
import AnnouncementForm from "@/components/portal/AnnouncementForm";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  await requireRole(["admin"]);
  const rows = await listAnnouncements();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Announcements</h1>
          <p>Publish bilingual notices for students, parents and teachers.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <AnnouncementForm />

      <section className="content-panel">
        <h2>Active Announcements</h2>
        <div className="announcement-list">
          {rows.map((a: any) => (
            <article key={a.id} className={`priority-${a.priority}`}>
              <div>
                <span className="role-badge">{a.audience}</span>
                <strong>{a.title_en}</strong>
                <p>{a.body_en}</p>
                {a.title_ur ? (
                  <div dir="rtl" className="announcement-urdu">
                    <strong>{a.title_ur}</strong>
                    <p>{a.body_ur}</p>
                  </div>
                ) : null}
              </div>
              <small>{a.priority}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
