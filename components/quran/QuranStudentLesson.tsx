"use client";

import { useEffect,useMemo,useState } from "react";
import QuranAttemptRecorder from "@/components/quran/QuranAttemptRecorder";

function safeTajweedHtml(input?:string|null){
  if(!input)return "";
  // Quran Foundation's tajweed payload uses <tajweed class=...> and <span class=end>.
  // Strip script/style/event handlers before rendering.
  return input
    .replace(/<script[\s\S]*?<\/script>/gi,"")
    .replace(/<style[\s\S]*?<\/style>/gi,"")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi,"")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi,"");
}

export default function QuranStudentLesson() {
  const [chapters,setChapters]=useState<any[]>([]);
  const [surah,setSurah]=useState(1);
  const [ayah,setAyah]=useState(1);
  const [verse,setVerse]=useState<any>(null);
  const [selected,setSelected]=useState<any>(null);
  const [tajweed,setTajweed]=useState(true);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    fetch("/api/quran/chapters",{cache:"no-store"})
      .then(r=>r.json())
      .then(j=>setChapters(j.chapters||[]));
  },[]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const v=params.get("verse");
    const m=v?.match(/^(\d+):(\d+)$/);
    if(m){setSurah(Number(m[1]));setAyah(Number(m[2]));}
  },[]);

  const chapter=useMemo(()=>chapters.find((c:any)=>Number(c.id)===surah),[chapters,surah]);
  const maxAyah=Number(chapter?.verses_count||999);

  async function load(targetSurah=surah,targetAyah=ayah){
    setMessage("");
    const key=`${targetSurah}:${targetAyah}`;
    const r=await fetch(`/api/quran/verse/${encodeURIComponent(key)}`,{cache:"no-store"});
    const j=await r.json();
    if(!r.ok||!j.ok){setMessage(j.error||"Failed.");return;}
    setVerse(j.verse);
    setSelected(null);
    history.replaceState(null,"",`?verse=${key}`);
  }

  async function play(word:any){
    setSelected(word);
    if(word.audio_url){
      try{await new Audio(word.audio_url).play();}
      catch{setMessage("Audio playback failed.");}
    }
  }

  function previous(){
    if(ayah>1){const next=ayah-1;setAyah(next);void load(surah,next);}
  }

  function next(){
    if(ayah<maxAyah){const nextAyah=ayah+1;setAyah(nextAyah);void load(surah,nextAyah);}
  }

  return <div className="quran-student-lesson" dir="rtl">
    <section className="dashboard-panel quran-full-navigator">
      <div className="quran-nav-fields">
        <label>سورت
          <select value={surah} onChange={e=>{setSurah(Number(e.target.value));setAyah(1);}}>
            {chapters.map((c:any)=><option key={c.id} value={c.id}>{c.id}. {c.name_arabic||c.name_simple}</option>)}
          </select>
        </label>
        <label>آیت
          <input type="number" min="1" max={maxAyah} value={ayah} onChange={e=>setAyah(Number(e.target.value))}/>
        </label>
        <button onClick={()=>load()}>آیت کھولیں</button>
      </div>
      <div className="quran-nav-controls">
        <button onClick={previous} disabled={ayah<=1}>← پچھلی</button>
        <button onClick={next} disabled={ayah>=maxAyah}>اگلی →</button>
        <label className="quran-tajweed-toggle">
          <input type="checkbox" checked={tajweed} onChange={e=>setTajweed(e.target.checked)}/>
          تجویدی رنگ
        </label>
      </div>
      {message&&<p>{message}</p>}
    </section>

    {verse&&<section className="quran-learning-surface">
      {tajweed&&verse.text_uthmani_tajweed
        ? <div className="quran-learning-ayah tajweed-text" translate="no"
            dangerouslySetInnerHTML={{__html:safeTajweedHtml(verse.text_uthmani_tajweed)}}/>
        : <div className="quran-learning-ayah" translate="no">{verse.text_uthmani||verse.text_indopak}</div>
      }

      <div className="quran-learning-word-grid">
        {(verse.words||[]).filter((w:any)=>w.char_type_name!=="end").map((w:any,i:number)=><button
          key={w.id||i}
          className={selected?.id===w.id?"active":""}
          onClick={()=>play(w)}
        >
          {tajweed&&w.text_uthmani_tajweed
            ? <strong translate="no" dangerouslySetInnerHTML={{__html:safeTajweedHtml(w.text_uthmani_tajweed)}}/>
            : <strong translate="no">{w.text_uthmani||w.text_indopak||w.text}</strong>
          }
          <span>🔊 سنیں</span>
        </button>)}
      </div>

      {selected&&<section className="quran-selected-word">
        <span>منتخب لفظ</span>
        <strong translate="no">{selected.text_uthmani||selected.text_indopak||selected.text}</strong>
        <p>لفظ سنیں، پھر خود پڑھیں اور استاد کو recording بھیجیں۔ تجویدی رنگ provider metadata سے دکھائے جاتے ہیں، جبکہ حتمی تصحیح استاد کرے گا۔</p>
        <QuranAttemptRecorder surahNumber={surah} ayahNumber={ayah} wordPosition={selected.position||null}/>
      </section>}

      <section className="quran-full-ayah-record">
        <h3>مکمل آیت استاد کو سنائیں</h3>
        <QuranAttemptRecorder surahNumber={surah} ayahNumber={ayah}/>
      </section>
    </section>}
  </div>;
}
