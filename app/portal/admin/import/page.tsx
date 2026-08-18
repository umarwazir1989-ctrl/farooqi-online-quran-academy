import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listImportBatches, getImportRows } from "@/lib/phase8Server";
import StudentImportForm from "@/components/portal/StudentImportForm";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  await requireRole(["admin"]);

  const { batch } = await searchParams;
  const batches = await listImportBatches();
  const rows = batch ? await getImportRows(batch) : [];

  return (
    <main className="admin-shell">
      <div className="admin-top">
        <div>
          <span className="eyebrow">Farooqi Admin</span>
          <h1>Bulk Student Import</h1>
          <p>Upload and validate student records before adding them to the live academic database.</p>
        </div>
        <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
      </div>

      <StudentImportForm />

      <section className="content-panel">
        <h2>Import Batches</h2>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Total</th>
                <th>Valid</th>
                <th>Invalid</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b: any) => (
                <tr key={b.id}>
                  <td>{b.file_name}</td>
                  <td>{b.total_rows}</td>
                  <td>{b.valid_rows}</td>
                  <td>{b.invalid_rows}</td>
                  <td>{b.status}</td>
                  <td>
                    <Link className="table-action" href={`/portal/admin/import?batch=${b.id}`}>
                      View rows
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {batch ? (
        <section className="content-panel">
          <h2>Batch Review</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Student</th>
                  <th>Parent</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Course</th>
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.row_number}</td>
                    <td>{r.student_name || "—"}</td>
                    <td>{r.parent_name || "—"}</td>
                    <td>{r.email || "—"}</td>
                    <td>{r.phone || "—"}</td>
                    <td>{r.country || "—"}</td>
                    <td>{r.course || "—"}</td>
                    <td>
                      <span className={`status-pill status-${r.validation_status}`}>
                        {r.validation_status}
                      </span>
                      <small>{r.validation_message || ""}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}
