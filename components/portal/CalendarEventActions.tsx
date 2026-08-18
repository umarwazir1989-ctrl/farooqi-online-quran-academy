"use client";
export default function CalendarEventActions({id,status}:{id:string;status:string}) {
  async function setStatus(next:string) {
    const res=await fetch(`/api/admin/calendar/${id}`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({status:next})
    });
    const data=await res.json();
    if(data.ok) window.location.reload();
    else window.alert(data.error||"Update failed.");
  }
  return <div className="decision-actions">
    {status==="active"
      ? <button onClick={()=>setStatus("cancelled")}>Cancel</button>
      : <button onClick={()=>setStatus("active")}>Restore</button>}
  </div>;
}
