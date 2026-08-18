"use client";
import { useState } from "react";

export default function DuplicateScanButton({batchId}:{batchId:string}) {
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");

  async function scan() {
    setBusy(true); setStatus("");
    const res=await fetch(`/api/admin/import/${batchId}/duplicates`,{method:"POST"});
    const data=await res.json();
    setBusy(false);

    if(data.ok) {
      setStatus(`${data.count} possible duplicates found`);
      setTimeout(()=>window.location.reload(),500);
    } else {
      setStatus(data.error||"Scan failed.");
    }
  }

  return <div className="duplicate-scan-box">
    <button className="btn btn-small" onClick={scan} disabled={busy}>
      {busy?"Scanning…":"Scan Duplicates"}
    </button>
    <small>{status}</small>
  </div>;
}
