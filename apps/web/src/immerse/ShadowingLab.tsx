import { useEffect,useMemo,useRef,useState } from "react";
import { coreContent } from "../coreContent";
import { recordShadowingResult } from "./authentic";

export function ShadowingLab(){
  const sentences=useMemo(()=>coreContent.sentences.filter((item)=>item.level==="B1").slice(0,12),[]);
  const [index,setIndex]=useState(0);
  const [recording,setRecording]=useState(false);
  const [audioUrl,setAudioUrl]=useState<string|null>(null);
  const [message,setMessage]=useState("");
  const recorder=useRef<MediaRecorder|null>(null);
  const chunks=useRef<Blob[]>([]);
  const sentence=sentences[index]??null;

  useEffect(()=>()=>{if(audioUrl)URL.revokeObjectURL(audioUrl);recorder.current?.stream.getTracks().forEach((track)=>track.stop());},[audioUrl]);

  function playReference(){
    if(!sentence||typeof speechSynthesis==="undefined"){setMessage("Japanese device speech synthesis is unavailable in this browser.");return;}
    speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(sentence.text);utterance.lang="ja-JP";utterance.rate=.9;
    const voice=speechSynthesis.getVoices().find((item)=>item.lang.toLowerCase().startsWith("ja"));if(voice)utterance.voice=voice;
    speechSynthesis.speak(utterance);
  }

  async function startRecording(){
    if(!sentence||!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){setMessage("Microphone recording is unavailable in this browser.");return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const next=new MediaRecorder(stream);chunks.current=[];
      next.ondataavailable=(event)=>{if(event.data.size)chunks.current.push(event.data);};
      next.onstop=()=>{const blob=new Blob(chunks.current,{type:next.mimeType||"audio/webm"});if(audioUrl)URL.revokeObjectURL(audioUrl);setAudioUrl(URL.createObjectURL(blob));stream.getTracks().forEach((track)=>track.stop());setRecording(false);};
      recorder.current=next;next.start();setRecording(true);setMessage("");
    }catch{setMessage("Microphone permission was not granted.");}
  }
  function stopRecording(){if(recorder.current?.state==="recording")recorder.current.stop();}
  async function rate(rating:1|2|3|4){
    if(!sentence||!audioUrl)return;
    await recordShadowingResult(sentence.id,rating);
    setMessage("Self-review recorded as speaking/pronunciation evidence. No acoustic pronunciation score was inferred.");
  }
  function next(){if(audioUrl)URL.revokeObjectURL(audioUrl);setAudioUrl(null);setMessage("");setIndex((value)=>(value+1)%Math.max(1,sentences.length));}

  if(!sentence)return null;
  return <section className="shadowing-lab">
    <div className="section-heading"><div><span className="course-kicker">SHADOWING</span><h2>Listen → record → compare</h2></div><span className="course-count">{index+1} / {sentences.length}</span></div>
    <p className="course-note">Reference playback currently uses the device Japanese voice unless source-provenanced sentence audio exists later. Your recording stays in browser memory for comparison and is not uploaded.</p>
    <article className="shadow-card"><strong lang="ja">{sentence.text}</strong><span>{sentence.translation}</span>
      <div className="shadow-actions"><button className="unit-action" type="button" onClick={playReference}>Play reference</button>{recording?<button className="primary" type="button" onClick={stopRecording}>Stop recording</button>:<button className="primary" type="button" onClick={()=>void startRecording()}>Record myself</button>}</div>
      {audioUrl?<><audio controls src={audioUrl}/><div className="shadow-rating"><span>After comparing, rate clarity + rhythm:</span>{([1,2,3,4] as const).map((rating)=><button type="button" key={rating} onClick={()=>void rate(rating)}>{rating}</button>)}</div><button className="quiet-button" type="button" onClick={next}>Next sentence</button></>:null}
      {message?<p className="import-message" role="status">{message}</p>:null}
    </article>
  </section>;
}
