import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { adminSearch } from "@/lib/phase7Server";

export const dynamic="force-dynamic";

export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){
  await requireRole(["admin"]);
  const {q=""}=await searchParams;
  const result=await adminSearch(q);

  return <main className="admin-shell">
    <div className="admin-top"><div><span className="eyebrow">Farooqi Admin</span><h1>Global Search</h1><p>Search students, teachers, parents and trial applications.</p></div><Link className="btn btn-outline" href="/portal/admin">Dashboard</Link></div>

    <form className="admin-search-form" method="get"><input name="q" defaultValue={q} placeholder="Name, email, phone or code"/><button className="btn">Search</button></form>

    {q?<div className="search-result-grid">
      <section className="content-panel"><h2>Students ({result.students.length})</h2>{result.students.map((r:any)=><article className="search-result-item" key={r.id}><strong>{r.full_name}</strong><span>{r.student_code} · {r.email||""} · {r.phone||""}</span><small>{r.status}</small></article>)}</section>
      <section className="content-panel"><h2>Teachers ({result.teachers.length})</h2>{result.teachers.map((r:any)=><article className="search-result-item" key={r.id}><strong>{r.full_name}</strong><span>{r.teacher_code} · {r.email||""} · {r.phone||""}</span><small>{r.status}</small></article>)}</section>
      <section className="content-panel"><h2>Parents ({result.parents.length})</h2>{result.parents.map((r:any)=><article className="search-result-item" key={r.id}><strong>{r.full_name}</strong><span>{r.email||""} · {r.phone||""}</span><small>{r.status}</small></article>)}</section>
      <section className="content-panel"><h2>Trials ({result.trials.length})</h2>{result.trials.map((r:any)=><article className="search-result-item" key={r.id}><strong>{r.student_name}</strong><span>{r.parent_name||""} · {r.email||""} · {r.phone||""}</span><small>{r.status}</small></article>)}</section>
    </div>:null}
  </main>;
}
