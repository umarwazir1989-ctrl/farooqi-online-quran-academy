import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { advancedStudentSearch } from "@/lib/phase8Server";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    country?: string;
    course?: string;
    teacher?: string;
  }>;
}) {
  await requireRole(["admin"]);

  const params = await searchParams;
  const rows = await advancedStudentSearch(params);

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Advanced Student Search</h1>
          <p>Search and filter students by identity, status, country, course and teacher.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <form className="advanced-filter-form" method="get">
        <input name="q" defaultValue={params.q || ""} placeholder="Name, code, phone, email..." />

        <select name="status" defaultValue={params.status || ""}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input name="country" defaultValue={params.country || ""} placeholder="Country" />
        <input name="course" defaultValue={params.course || ""} placeholder="Course" />
        <input name="teacher" defaultValue={params.teacher || ""} placeholder="Teacher" />

        <button className="btn">Apply Filters</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Parent</th>
              <th>Contact</th>
              <th>Country</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Status</th>
              <th>Print / Cards</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r: any) => (
              <tr key={`${r.id}-${r.enrollment_id || "none"}`}>
                <td><strong>{r.full_name}</strong><small>{r.student_code}</small></td>
                <td>{r.parent_name || "—"}</td>
                <td><small>{r.email || ""}</small><small>{r.phone || ""}</small></td>
                <td>{r.country || "—"}</td>
                <td>{r.course_name || "—"}</td>
                <td>{r.teacher_name || "—"}</td>
                <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                <td>
                  <div className="table-action-row">
                    <Link className="table-action" href={`/portal/admin/students/${r.id}/print`}>Profile</Link>
                    <a className="table-action" href={`/api/students/${r.id}/id-card`}>ID Card</a>
                    <a className="table-action" href={`/api/students/${r.id}/certificate`}>Certificate</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
