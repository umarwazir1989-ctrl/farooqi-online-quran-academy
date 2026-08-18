"use client";
import { useState } from "react";
export default function NotificationReadButton({id,read}:{id:string;read:boolean}){
  const [busy,setBusy]=useState(false);
  if(read)return <span className="notification-read-label">Read</span>;
  async function mark(){
    setBusy(true);
    const res=await fetch(`/api/parent/notifications/${id}/read`,{method:"POST"});
    const d=await res.json();setBusy(false);
    if(d.ok)window.location.reload();else window.alert(d.error||"Failed.");
  }
  return <button className="table-action table-action-button" disabled={busy} onClick={mark}>{busy?"…":"Mark read"}</button>;
}
