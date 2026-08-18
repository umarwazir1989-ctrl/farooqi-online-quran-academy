import { requireRole } from "@/lib/portalAuth";
import { getStudentPortalData } from "@/lib/portalData";
import DashboardShell from "@/components/portal/DashboardShell";
export const dynamic="force-dynamic";
export default async function Page(){
 const p=await requireRole(["student"]); const {student,enrollments}=await getStudentPortalData(p.id);
 const schedules=enrollments.flatMap((e:any)=>(e.class_schedules||[]).filter((s:any)=>s.status==="active")); const first:any=enrollments[0];
 return <DashboardShell role="Student" name={student?.full_name||p.full_name} title="Student Dashboard" subtitle="Your Quran course, tutor and weekly schedule."
 cards={[[student?.student_code||"—","Student Code","Academy reference"],[first?.courses?.name_en||"—","Current Course","Active learning program"],[first?.teachers?.full_name||"—","Teacher","Assigned tutor"],[String(schedules.length),"Schedules","Active weekly schedule"]]}
 links={[["Dashboard","/portal/student"],["My Classes","/portal/student"],["My Course","/portal/student"]]}>
 <section className="dashboard-panel"><h2>My Weekly Classes</h2><div className="portal-data-list">
 {schedules.length===0?<p>Your class schedule has not been added yet.</p>:schedules.map((s:any)=><article key={s.id}>
 <div><strong>{(s.days_of_week||[]).join(", ")}</strong><span>Class days</span></div>
 <div><strong>{s.start_time||"—"}</strong><span>{s.timezone}</span></div>
 <div><strong>{s.duration_minutes} min</strong><span>Lesson duration</span></div>
 </article>)}</div></section></DashboardShell>;
}
