import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listTeachers } from "@/lib/academyServer";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  await requireRole(["admin"]);
  const rows = await listTeachers();

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Teachers</h1>
          <p>{rows?.length || 0} teacher records</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Languages</th>
              <th>Specialties</th>
              <th>Timezone</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r: any) => (
              <tr key={r.id}>
                <td>{r.teacher_code || "—"}</td>
                <td><strong>{r.full_name}</strong><small>{r.qualification || ""}</small></td>
                <td>{r.gender || "—"}</td>
                <td>{(r.languages || []).join(", ") || "—"}</td>
                <td>{(r.specialties || []).join(", ") || "—"}</td>
                <td>{r.timezone || "—"}</td>
                <td>{r.max_students}</td>
                <td><span className="status-pill status-approved">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="content-panel notice-panel">
        <h2>Teacher records</h2>
        <p>
          In Phase 3B, teacher records are read from the database. Add your 5 existing teachers in Supabase Table Editor or use the optional seed template included in this update.
        </p>
      </div>
    </main>
  );
}
