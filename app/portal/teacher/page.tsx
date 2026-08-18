import { requireRole } from "@/lib/portalAuth";
import { getTeacherPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
export const dynamic="force-dynamic";
export default async function Page(){
 const p=await requireRole(["teacher"]); const {teacher,enrollments}=await getTeacherPortalData(p.id);
 const schedules=enrollments.flatMap((e:any)=>(e.class_schedules||[]).filter((s:any)=>s.status==="active"));
 const students=new Set(enrollments.map((e:any)=>e.students?.id).filter(Boolean));
 return <DashboardShell role="Teacher" name={teacher?.full_name||p.full_name} title="Teacher Dashboard" subtitle="Assigned learners and weekly classes."
 cards={[[String(schedules.length),"Active Schedules","Weekly class schedules"],[String(students.size),"My Students","Assigned active learners"],[String(enrollments.length),"Enrollments","Active courses"],[teacher?.teacher_code||"—","Teacher Code","Academy reference"]]}
 links={[["Dashboard","/portal/teacher"],["My Classes","/portal/teacher"],["My Students","/portal/teacher"]]}>
 <section className="dashboard-panel"><h2>My Classes</h2><div className="portal-data-list">
 {enrollments.length===0?<p>No active students are assigned yet.</p>:enrollments.map((e:any)=><article key={e.id}>
 <div><strong>{e.students?.full_name||"Student"}</strong><span>{e.students?.student_code||""}</span></div>
 <div><strong>{e.courses?.name_en||"Course"}</strong><span>{(e.class_schedules?.[0]?.days_of_week||[]).join(", ")||"Schedule pending"}</span></div>
 <div><strong>{e.class_schedules?.[0]?.start_time||"—"}</strong><span>{e.class_schedules?.[0]?.timezone||e.students?.timezone||""}</span></div>
 </article>)}</div></section></DashboardShell>;
}
