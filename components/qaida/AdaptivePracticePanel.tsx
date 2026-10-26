"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdaptivePracticePanel() {
  const [queue,setQueue]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");

  async function load(){
    setLoading(true);
    try{
      const r=await fetch("/api/student/qaida/adaptive",{cache:"no-store"});
      const j=await r.json();
      if(!r.ok||!j.ok) throw new Error(j.error||"Failed.");
      setQueue(j.queue||[]);
    }catch(e){setMessage(e instanceof Error?e.message:"Failed.");}
    finally{setLoading(false);}
  }
  useEffect(()=>{void load();},[]);

  async function mark(id:string,action:"start"|"done"){
    const r=await fetch("/api/student/qaida/adaptive",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({queueId:id,action})});
    const j=await r.json();
    if(!r.ok||!j.ok){setMessage(j.error||"Failed.");return;}
    setMessage(action==="done"?"✓ مشق مکمل درج ہو گئی۔":"مشق شروع کر دی گئی۔");
    await load();
  }

  if(loading) return <section className="dashboard-panel">Adaptive practice loading…</section>;

  return <section className="dashboard-panel qaida-adaptive-panel" dir="rtl">
    <div className="qaida-adaptive-head"><div><span>Adaptive Practice</span><h2>آج کی ذاتی مشق</h2><p>استاد کی سابقہ تصحیح کے مطابق کمزور الفاظ اور قواعد پہلے دکھائے جاتے ہیں۔</p></div><strong>{queue.length}</strong></div>
    {message&&<div className="qaida-review-message">{message}</div>}
    <div className="qaida-adaptive-list">
      {queue.length===0?<p>اس وقت کوئی اضافی adaptive practice باقی نہیں۔</p>:queue.map((item:any,index:number)=><article key={item.id}>
        <div className="qaida-adaptive-rank">{index+1}</div>
        <div><strong>{item.item_text}</strong><span>{item.lesson_slug}</span><small>Priority {item.priority} • {item.reason}</small></div>
        <div className="qaida-adaptive-actions">
          <Link href={`/portal/student/qaida/${item.lesson_slug}`}>سبق کھولیں</Link>
          <button onClick={()=>mark(item.id,"start")}>شروع</button>
          <button className="done" onClick={()=>mark(item.id,"done")}>مکمل</button>
        </div>
      </article>)}
    </div>
  </section>;
}
