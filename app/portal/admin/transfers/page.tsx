import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { listTransfers } from "@/lib/phase7Server";
import StudentTransferForm from "@/components/portal/StudentTransferForm";

export const dynamic="force-dynamic";

export default async function Page(){
  await requireRole(["admin"]);const sb=getSupabaseAdmin();
  const [{data:teachers,error:tErr},{data:enrollments,error:eErr},rows]=await Promise.all([
    sb.from("teachers").select("id,full_name").eq("status","active").order("full_name"),
    sb.from("enrollments").select("id,teacher_id,student_id,students(full_name),teachers(full_name)").eq("status","active"),
    listTransfers()
  ]);
  if(tErr)throw tErr;if(eErr)throw eErr;
  return <main className="admin-shell"><div className="admin-top"><div><span className="eyebrow">Farooqi Admin</span><h1>Student Transfers</h1><p>Move an active student from one teacher to another.</p></div><Link className="btn btn-outline" href="/portal/admin">Dashboard</Link></div>
    <StudentTransferForm teachers={teachers||[]} enrollments={enrollments||[]}/>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Student</th><th>From</th><th>To</th><th>Effective</th><th>Reason</th></tr></thead>
    <tbody>{rows.map((r:any)=><tr key={r.id}><td><strong>{r.student_name}</strong><small>{r.student_code}</small></td><td>{r.from_teacher_name||"—"}</td><td>{r.to_teacher_name}</td><td>{r.effective_date}</td><td>{r.reason||"—"}</td></tr>)}</tbody></table></div>
  </main>;
}
