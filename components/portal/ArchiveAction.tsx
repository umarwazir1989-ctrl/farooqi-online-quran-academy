"use client";
import { useState } from "react";
export default function ArchiveAction({entityType,entityId,restore=false}:{entityType:string;entityId:string;restore?:boolean}){
  const [busy,setBusy]=useState(false);
  async function act(){
    setBusy(true);
    const reason=restore?"":window.prompt("Archive reason (optional):")||"";
    const res=await fetch("/api/admin/archive",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entityType,entityId,reason,restore})});
    const d=await res.json();setBusy(false);
    if(d.ok)window.location.reload();else window.alert(d.error||"Action failed.");
  }
  return <button className="table-action table-action-button" disabled={busy} onClick={act}>{restore?"Restore":"Archive"}</button>;
}
