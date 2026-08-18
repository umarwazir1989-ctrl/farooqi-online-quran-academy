import { requireRole } from "@/lib/portalAuth";
import { listAnnouncements } from "@/lib/adminOpsServer";
import DashboardShell from "@/components/portal/DashboardShell";

export const dynamic = "force-dynamic";

export default async function StudentAnnouncementsPage() {
  const profile = await requireRole(["student"]);
  const rows = await listAnnouncements("students");

  return (
    <DashboardShell
      role="Student"
      name={profile.full_name}
      title="Announcements"
      subtitle="Academy notices and important updates."
      cards={[
        [String(rows.length), "Active Notices", "Current academy announcements"],
        ["Urdu", "Bilingual", "Urdu and English notices"],
        ["Live", "Updates", "Published by academy admin"],
        ["Portal", "Notices", "Student-specific communication"],
      ]}
      links={[
        ["Dashboard", "/portal/student"],
        ["My Progress", "/portal/student/progress"],
        ["Announcements", "/portal/student/announcements"],
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
