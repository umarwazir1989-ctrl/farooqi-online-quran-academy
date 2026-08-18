import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listAcademicCalendar } from "@/lib/adminOpsServer";

export const dynamic = "force-dynamic";

export default async function AcademicCalendarPage() {
  await requireRole(["admin"]);
  const rows = await listAcademicCalendar();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Academic Calendar</h1>
          <p>Holidays, events, training days and academy closures.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <section className="content-panel">
        <div className="calendar-event-list">
          {rows.length === 0 ? (
            <p>No calendar events yet. Add events in Supabase Table Editor for now.</p>
          ) : rows.map((e: any) => (
            <article key={e.id}>
              <div>
                <span className="role-badge">{e.event_type}</span>
                <strong>{e.title_en}</strong>
                {e.title_ur ? <strong dir="rtl">{e.title_ur}</strong> : null}
                <p>{e.description_en || ""}</p>
              </div>
              <div>
                <b>{e.start_date}</b>
                <span>to</span>
                <b>{e.end_date}</b>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
