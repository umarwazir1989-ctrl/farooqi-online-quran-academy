import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listBatchDuplicateReviews } from "@/lib/phase10Server";
import DuplicateScanButton from "@/components/portal/DuplicateScanButton";

export const dynamic="force-dynamic";

export default async function Page({params}:{params:Promise<{batchId:string}>}) {
  await requireRole(["admin"]);
  const {batchId}=await params;
  const rows=await listBatchDuplicateReviews(batchId);

  return <main className="admin-shell">
    <div className="admin-top">
      <div>
        <span className="eyebrow">Farooqi Admin</span>
        <h1>Duplicate Review</h1>
        <p>Review possible matches before importing live records.</p>
      </div>
      <Link className="btn btn-outline" href={`/portal/admin/import?batch=${batchId}`}>Back to Batch</Link>
    </div>

    <DuplicateScanButton batchId={batchId}/>

    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Import Row</th>
            <th>Incoming Student</th>
            <th>Existing Student</th>
            <th>Existing Parent</th>
            <th>Match Reason</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r:any)=>(
            <tr key={r.id}>
              <td>{r.student_import_rows?.row_number}</td>
              <td>
                <strong>{r.student_import_rows?.student_name||"—"}</strong>
                <small>{r.student_import_rows?.email||""}</small>
                <small>{r.student_import_rows?.phone||""}</small>
              </td>
              <td>
                <strong>{r.students?.full_name||"—"}</strong>
                <small>{r.students?.student_code||""}</small>
              </td>
              <td>
                <strong>{r.parents?.full_name||"—"}</strong>
                <small>{r.parents?.phone||""}</small>
              </td>
              <td>{r.match_reason}</td>
              <td><span className={`status-pill status-${r.decision}`}>{r.decision}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>;
}
