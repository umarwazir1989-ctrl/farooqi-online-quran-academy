import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { listSubstitutions } from "@/lib/phase7Server";
import SubstitutionForm from "@/components/portal/SubstitutionForm";

export const dynamic="force-dynamic";

export default async function Page(){
  await requireRole(["admin"]);
  const sb=getSupabaseAdmin();
  const [{data:teachers,error:tErr},{data:enrollments,error:eErr},rows]=await Promise.all([
    sb.from("teachers").select("id,full_name").eq("status","active").order("full_name"),
    sb.from("enrollments").select("id,student_id,teacher_id,students(full_name),teachers(full_name)").eq("status","active"),
    listSubstitutions()
  ]);
  if(tErr)throw tErr;if(eErr)throw eErr;

  return <main className="admin-shell">
    <div className="admin-top"><div><span className="eyebrow">Farooqi Admin</span><h1>Teacher Substitutions</h1>
    <p>Temporarily assign another teacher during leave or emergency.</p></div><Link className="btn btn-outline" href="/portal/admin">Dashboard</Link></div>
    <SubstitutionForm teachers={teachers||[]} enrollments={enrollments||[]}/>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Student</th><th>Original Teacher</th><th>Substitute</th><th>Dates</th><th>Status</th></tr></thead>
    <tbody>{rows.map((r:any)=><tr key={r.id}><td>{r.student_name||"All assigned"}</td><td>{r.original_teacher_name}</td><td>{r.substitute_teacher_name}</td><td>{r.start_date} → {r.end_date}</td><td>{r.status}</td></tr>)}</tbody></table></div>
  </main>;
}
