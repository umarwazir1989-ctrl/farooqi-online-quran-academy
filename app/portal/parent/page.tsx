import { requireRole } from "@/lib/portalAuth";
import { getParentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
export const dynamic="force-dynamic";
export default async function Page(){
 const p=await requireRole(["parent"]); const {parent,children}=await getParentPortalData(p.id);
 const active=children.flatMap((c:any)=>(c.enrollments||[]).filter((e:any)=>e.status==="active"));
 return <DashboardShell role="Parent" name={parent?.full_name||p.full_name} title="Parent Dashboard" subtitle="Monitor your children's courses, tutors and schedules."
 cards={[[String(children.length),"Children","Linked learner profiles"],[String(active.length),"Active Courses","Current enrollments"],[parent?.country||"—","Country","Family location"],[parent?.phone||"—","Contact","Registered contact"]]}
 links={[["Dashboard","/portal/parent"],["My Children","/portal/parent"],["Classes","/portal/parent"]]}>
 <section className="dashboard-panel"><h2>My Children</h2><div className="portal-data-list">
 {children.length===0?<p>No student profiles are linked yet.</p>:children.map((c:any)=>{const e=(c.enrollments||[]).find((x:any)=>x.status==="active");const s=(e?.class_schedules||[]).find((x:any)=>x.status==="active");
 return <article key={c.id}><div><strong>{c.full_name}</strong><span>{c.student_code}</span></div>
 <div><strong>{e?.courses?.name_en||"No active course"}</strong><span>{e?.teachers?.full_name||"Teacher pending"}</span></div>
 <div><strong>{(s?.days_of_week||[]).join(", ")||"—"}</strong><span>{s?.start_time||"Schedule pending"}</span></div></article>})}</div></section></DashboardShell>;
}
