import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import CalendarEventForm from "@/components/portal/CalendarEventForm";
import CalendarEventActions from "@/components/portal/CalendarEventActions";

export const dynamic="force-dynamic";

export default async function Page(){
  await requireRole(["admin"]);
  const sb=getSupabaseAdmin();
  const {data,error}=await sb.from("academic_calendar").select("*").order("start_date",{ascending:false});
  if(error)throw error;

  return <main className="admin-shell">
    <div className="admin-top">
      <div><span className="eyebrow">Farooqi Admin</span><h1>Manage Academic Calendar</h1>
      <p>Create, cancel and restore holidays and academy events.</p></div>
      <Link className="btn btn-outline" href="/portal/admin">Dashboard</Link>
    </div>
    <CalendarEventForm/>
    <div className="admin-table-wrap"><table className="admin-table">
      <thead><tr><th>Title</th><th>Type</th><th>Dates</th><th>Audience</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{(data||[]).map((e:any)=><tr key={e.id}>
        <td><strong>{e.title_en}</strong><small dir="rtl">{e.title_ur||""}</small></td>
        <td>{e.event_type}</td><td>{e.start_date} → {e.end_date}</td><td>{e.applies_to}</td>
        <td><span className={`status-pill status-${e.status}`}>{e.status}</span></td>
        <td><CalendarEventActions id={e.id} status={e.status}/></td>
      </tr>)}</tbody>
    </table></div>
  </main>;
}
