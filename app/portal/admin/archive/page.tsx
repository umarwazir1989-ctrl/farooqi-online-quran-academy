import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { listArchiveRecords } from "@/lib/phase7Server";
import ArchiveAction from "@/components/portal/ArchiveAction";

export const dynamic="force-dynamic";
export default async function Page(){
  await requireRole(["admin"]);const rows=await listArchiveRecords();
  return <main className="admin-shell"><div className="admin-top"><div><span className="eyebrow">Farooqi Admin</span><h1>Archive & Restore</h1><p>Review archived academy records and restore them when needed.</p></div><Link className="btn btn-outline" href="/portal/admin">Dashboard</Link></div>
  <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Type</th><th>Record ID</th><th>Reason</th><th>Archived</th><th>Status</th><th>Action</th></tr></thead>
  <tbody>{rows.map((r:any)=><tr key={r.id}><td>{r.entity_type}</td><td>{r.entity_id}</td><td>{r.reason||"—"}</td><td>{new Date(r.archived_at).toLocaleString()}</td><td>{r.status}</td><td>{r.status==="archived"?<ArchiveAction entityType={r.entity_type} entityId={r.entity_id} restore/>:"Restored"}</td></tr>)}</tbody></table></div></main>;
}
