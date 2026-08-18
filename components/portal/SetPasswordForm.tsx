"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function SetPasswordForm() {
  const [ready,setReady]=useState(false), [status,setStatus]=useState(""), [busy,setBusy]=useState(false);
  const supabase = useMemo(()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),[]);

  useEffect(()=>{ supabase.auth.getSession().then(({data})=>{
    setReady(Boolean(data.session));
    if(!data.session) setStatus("Invitation session unavailable. The link may have expired.");
  }); },[supabase]);

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setStatus("");
    const f=new FormData(e.currentTarget), p=String(f.get("password")||""), c=String(f.get("confirm")||"");
    if(p.length<8){setStatus("Password must be at least 8 characters.");setBusy(false);return;}
    if(p!==c){setStatus("Passwords do not match.");setBusy(false);return;}
    const {error}=await supabase.auth.updateUser({password:p});
    if(error){setStatus(error.message);setBusy(false);return;}
    await supabase.auth.signOut();
    setStatus("Password saved. You can now sign in to the Academy Portal.");
    setBusy(false);
  }

  return <div className="set-password-wrap">
    <span className="eyebrow">Farooqi Quran Portal</span>
    <h1>Set your portal password</h1>
    <p>Create a password for your Student, Parent or Teacher account.</p>
    <form className="portal-login-form" onSubmit={submit}>
      <label>New password<input type="password" name="password" minLength={8} required disabled={!ready}/></label>
      <label>Confirm password<input type="password" name="confirm" minLength={8} required disabled={!ready}/></label>
      <button className="btn" disabled={!ready||busy}>{busy?"Saving…":"Save Password"}</button>
    </form>
    <p className="portal-login-status">{status}</p>
    <Link className="text-link" href="/portal/login">Go to Portal Login →</Link>
  </div>;
}
