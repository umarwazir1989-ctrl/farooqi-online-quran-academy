import { requireRole } from "@/lib/portalAuth";
import { listAnnouncements } from "@/lib/adminOpsServer";
import DashboardShell from "@/components/portal/DashboardShell";

export const dynamic = "force-dynamic";

export default async function ParentAnnouncementsPage() {
  const profile = await requireRole(["parent"]);
  const rows = await listAnnouncements("parents");

  return (
    <DashboardShell
      role="Parent"
      name={profile.full_name}
      title="Announcements"
      subtitle="Academy notices for parents and families."
      cards={[
        [String(rows.length), "Active Notices", "Current announcements"],
        ["Family", "Updates", "Parent-specific communication"],
        ["Urdu", "Bilingual", "Urdu and English content"],
        ["Live", "Portal", "Published academy notices"],
      ]}
      links={[
        ["Dashboard", "/portal/parent"],
        ["Progress", "/portal/parent/progress"],
        ["Notifications", "/portal/parent/notifications"],
        ["Announcements", "/portal/parent/announcements"],
      ]}
    >
      <section className="dashboard-panel">
        <div className="announcement-list">
          {rows.map((a: any) => (
            <article key={a.id} className={`priority-${a.priority}`}>
              <div>
                <strong>{a.title_en}</strong>
                <p>{a.body_en}</p>
                {a.title_ur ? (
                  <div dir="rtl" className="announcement-urdu">
                    <strong>{a.title_ur}</strong>
                    <p>{a.body_ur}</p>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
