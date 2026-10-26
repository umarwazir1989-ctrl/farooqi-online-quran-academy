"use client";

import { useEffect, useState } from "react";

export default function AdminReleaseStatus(){
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    try{
      const r=await fetch("/api/admin/quran/release-status",{cache:"no-store"});
      setData(await r.json());
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{void load();},[]);

  if(loading)return <section className="dashboard-panel">Release status loading…</section>;

  return <section className="dashboard-panel release-status" dir="rtl">
    <div className="release-status-head">
      <div>
        <h2>Final Release Status</h2>
        <p>{data?.releaseReady ? "Core launch checks are ready." : "Launch blockers still exist."}</p>
      </div>
      <div className={data?.releaseReady ? "release-ready" : "release-not-ready"}>
        {data?.releaseReady ? "READY" : "NOT READY"}
      </div>
    </div>

    <div className="release-status-grid">
      <article>
        <strong>Diagnostics</strong>
        <span>{data?.diagnostics?.passed ?? 0}/{data?.diagnostics?.total ?? 0}</span>
      </article>
      <article>
        <strong>Database</strong>
        <span>{data?.health?.databaseOk ? "PASS" : "FAIL"}</span>
      </article>
      <article>
        <strong>Quran Foundation</strong>
        <span>{data?.health?.quranFoundationConfigured ? "PASS" : "FAIL"}</span>
      </article>
      <article>
        <strong>Latest Audit</strong>
        <span>{data?.latestAudit?.result?.toUpperCase?.() || "NONE"}</span>
      </article>
    </div>

    {data?.blockers?.length > 0 && <div className="release-blockers">
      <h3>Blockers</h3>
      {data.blockers.map((x:string)=><p key={x}>✕ {x}</p>)}
    </div>}

    {data?.warnings?.length > 0 && <div className="release-warnings">
      <h3>Warnings</h3>
      {data.warnings.map((x:string)=><p key={x}>! {x}</p>)}
    </div>}
  </section>;
}
