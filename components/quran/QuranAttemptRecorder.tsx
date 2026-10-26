"use client";

import { useRef,useState } from "react";

export default function QuranAttemptRecorder({
  surahNumber,
  ayahNumber,
  wordPosition,
}:{
  surahNumber:number;
  ayahNumber:number;
  wordPosition?:number|null;
}) {
  const [recording,setRecording]=useState(false);
  const [blob,setBlob]=useState<Blob|null>(null);
  const [url,setUrl]=useState<string|null>(null);
  const [message,setMessage]=useState("اپنی تلاوت record کریں۔");
  const recorder=useRef<MediaRecorder|null>(null);
  const chunks=useRef<Blob[]>([]);

  async function start(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const r=new MediaRecorder(stream);
      chunks.current=[];
      r.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
      r.onstop=()=>{
        const b=new Blob(chunks.current,{type:r.mimeType||"audio/webm"});
        setBlob(b);setUrl(URL.createObjectURL(b));
        stream.getTracks().forEach(t=>t.stop());
        setMessage("ریکارڈنگ تیار ہے۔ سن کر استاد کو بھیجیں۔");
      };
      r.start();recorder.current=r;setRecording(true);setMessage("ریکارڈنگ جاری ہے…");
    }catch{setMessage("Microphone permission درکار ہے۔");}
  }

  function stop(){recorder.current?.stop();setRecording(false);}

  async function submit(){
    if(!blob)return;
    setMessage("Recording upload ہو رہی ہے…");
    const form=new FormData();
    form.append("audio",new File([blob],"quran-attempt.webm",{type:blob.type}));
    form.append("surahNumber",String(surahNumber));
    form.append("ayahNumber",String(ayahNumber));
    if(wordPosition)form.append("wordPosition",String(wordPosition));

    const r=await fetch("/api/student/quran/attempts",{method:"POST",body:form});
    const j=await r.json();
    if(!r.ok||!j.ok){setMessage(j.error||"Upload failed.");return;}
    setMessage("✓ تلاوت استاد کے review کے لیے محفوظ ہو گئی ہے۔");
    setBlob(null);setUrl(null);
  }

  return <div className="quran-attempt-recorder">
    {!recording?<button onClick={start}>🎙️ ریکارڈنگ شروع کریں</button>:<button onClick={stop}>■ بند کریں</button>}
    {url&&<audio controls src={url}/>}
    {blob&&<button className="submit" onClick={submit}>استاد کو بھیجیں</button>}
    <p>{message}</p>
  </div>;
}
