import { requireRole } from "@/lib/portalAuth";
import { getParentNotifications } from "@/lib/operationsServer";
import DashboardShell from "@/components/portal/DashboardShell";

export const dynamic = "force-dynamic";

export default async function ParentNotificationsPage() {
  const profile = await requireRole(["parent"]);
  const { parent, notifications } = await getParentNotifications(profile.id);

  const unread = notifications.filter((n: any) => !n.is_read).length;

  return (
    <DashboardShell
      role="Parent"
      name={parent?.full_name || profile.full_name}
      title="Notifications"
      subtitle="Updates about classes, reports, homework and schedules."
      cards={[
        [String(notifications.length), "Notifications", "Recent academy updates"],
        [String(unread), "Unread", "New updates"],
        ["Classes", "Reschedules", "Schedule decisions"],
        ["Reports", "Progress", "Monthly learning updates"],
      ]}
      links={[
        ["Dashboard", "/portal/parent"],
        ["Progress", "/portal/parent/progress"],
        ["Notifications", "/portal/parent/notifications"],
      ]}
    >
      <section className="dashboard-panel">
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : notifications.map((n: any) => (
            <article key={n.id} className={n.is_read ? "" : "notification-unread"}>
              <div>
                <span className="role-badge">{n.notification_type}</span>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                {n.students ? <small>{n.students.full_name} · {n.students.student_code}</small> : null}
              </div>
              <time>{new Date(n.created_at).toLocaleString()}</time>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
