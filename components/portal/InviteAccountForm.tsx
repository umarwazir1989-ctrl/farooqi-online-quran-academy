"use client";
import { FormEvent, useState } from "react";

export default function InviteAccountForm({role,recordId,fullName,initialEmail,linked}:{
  role:"student"|"parent"|"teacher";recordId:string;fullName:string|null;initialEmail:string|null;linked:boolean;
}) {
  const [status,setStatus] = useState("");
  const [busy,setBusy] = useState(false);

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setStatus("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/accounts/invite",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({role,recordId,email:String(f.get("email")||""),fullName})
    });
    const data = await res.json();
    setStatus(data.ok ? "Invite sent ✓" : data.error || "Could not send invite.");
    setBusy(false);
    if (data.ok) setTimeout(()=>window.location.reload(),700);
  }

  if (linked) return <span className="account-linked">Portal linked ✓</span>;

  return <form className="invite-inline-form" onSubmit={submit}>
    <input name="email" type="email" defaultValue={initialEmail||""} placeholder="Email address" required />
    <button type="submit" disabled={busy}>{busy ? "Sending…" : "Send Invite"}</button>
    <small>{status}</small>
  </form>;
}
