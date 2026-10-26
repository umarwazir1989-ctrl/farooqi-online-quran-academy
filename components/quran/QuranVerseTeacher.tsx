"use client";

import { useState } from "react";

export default function QuranVerseTeacher() {
  const [key,setKey]=useState("1:1");
  const [verse,setVerse]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  async function loadVerse() {
    setLoading(true);
    setMessage("");
    try {
      const r=await fetch(`/api/quran/verse/${encodeURIComponent(key)}`,{cache:"no-store"});
      const j=await r.json();
      if(!r.ok||!j.ok) throw new Error(j.error||"Failed.");
      setVerse(j.verse);
    } catch(e) {
      setMessage(e instanceof Error?e.message:"Failed.");
    } finally {
      setLoading(false);
    }
  }

  async function play(url?:string|null) {
    if(!url) { setMessage("اس لفظ کی audio URL دستیاب نہیں۔"); return; }
    try { await new Audio(url).play(); }
    catch { setMessage("Audio playback failed."); }
  }

  return <div className="quran-teacher-engine" dir="rtl">
    <section className="dashboard-panel quran-nav-panel">
      <div>
        <label>آیت منتخب کریں</label>
        <input value={key} onChange={e=>setKey(e.target.value)} placeholder="مثلاً 1:1" />
        <button onClick={loadVerse} disabled={loading}>{loading?"Loading…":"آیت کھولیں"}</button>
      </div>
      <small>فارمیٹ: سورت نمبر:آیت نمبر — مثال 2:255</small>
      {message&&<p>{message}</p>}
    </section>

    {verse&&<section className="dashboard-panel quran-live-verse">
      <span>{verse.verse_key}</span>
      <div className="quran-live-text" translate="no">{verse.text_uthmani||verse.text_indopak}</div>
      <div className="quran-live-words">
        {(verse.words||[]).filter((w:any)=>w.char_type_name!=="end").map((w:any,index:number)=><button key={w.id||index} onClick={()=>play(w.audio_url)}>
          <strong translate="no">{w.text_uthmani||w.text_indopak||w.text}</strong>
          <small>{w.position?`لفظ ${w.position}`:`لفظ ${index+1}`}</small>
          <span>🔊</span>
        </button>)}
      </div>
      <div className="quran-teacher-note">
        <strong>تعلیمی طریقہ</strong>
        <p>پہلے پورا لفظ دیکھیں، پھر لفظ کی مصدقہ audio سنیں، خود پڑھیں، اور recording استاد کو review کے لیے بھیجیں۔</p>
      </div>
    </section>}
  </div>;
}
