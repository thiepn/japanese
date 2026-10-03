import { useEffect,useMemo,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import type { AudioAssetRecord } from "@thiepn/content-schema";
import type { PrivateNativeAudio } from "@thiepn/local-db";
import {
  getListeningRecallCandidates,getNativeListeningDepthSummary,listNativeListeningSources,
  recordListeningDelayedRecall,recordMultiSourceListeningSynthesis,recordNativeSourceNote,
  type ListeningRecallCandidate,type NativeListeningDepthSummary,type NativeListeningSource
} from "./nativeListening";

export function NativeListeningLab(){
  const [sources,setSources]=useState<NativeListeningSource[]>([]);
  const [summary,setSummary]=useState<NativeListeningDepthSummary|null>(null);
  const [selected,setSelected]=useState<string[]>([]);
  const [variantIndex,setVariantIndex]=useState<Record<string,number>>({});
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [played,setPlayed]=useState<Set<string>>(new Set());
  const [synthesis,setSynthesis]=useState("");
  const [recalls,setRecalls]=useState<ListeningRecallCandidate[]>([]);
  const [recallText,setRecallText]=useState("");
  const [audioState,setAudioState]=useState<string|null>(null);
  const [message,setMessage]=useState("");
  const audio=useRef(getDefaultAudioProvider());

  async function refresh(){
    const [nextSources,nextSummary,nextRecalls]=await Promise.all([
      listNativeListeningSources(),getNativeListeningDepthSummary(),getListeningRecallCandidates()
    ]);
    setSources(nextSources);setSummary(nextSummary);setRecalls(nextRecalls);
    setSelected((current)=>{
      const valid=current.filter((id)=>nextSources.some((source)=>source.document.id===id));
      if(valid.length>=2)return valid.slice(0,3);
      return nextSources.slice(0,Math.min(2,nextSources.length)).map((source)=>source.document.id);
    });
  }
  useEffect(()=>{void refresh().catch(()=>{setSources([]);setSummary(null);setRecalls([]);});return()=>audio.current.stop();},[]);

  const chosen=useMemo(()=>selected.map((id)=>sources.find((source)=>source.document.id===id)).filter((item):item is NativeListeningSource=>Boolean(item)),[selected,sources]);
  const recall=recalls[0]??null;

  function toggleSource(id:string){
    setMessage("");
    setSelected((current)=>{
      if(current.includes(id))return current.filter((item)=>item!==id);
      if(current.length>=3)return current;
      return [...current,id];
    });
  }

  function activeRecording(source:NativeListeningSource):PrivateNativeAudio{
    const index=Math.min(variantIndex[source.document.id]??0,source.recordings.length-1);
    return source.recordings[index]!;
  }

  async function play(source:NativeListeningSource){
    const recording=activeRecording(source);
    const asset:AudioAssetRecord={
      id:"p9-native-"+source.document.id+"-"+(recording.externalId??variantIndex[source.document.id]??0),
      kind:"sentence",text:source.document.text,language:"ja",format:recording.url.toLowerCase().includes(".ogg")?"ogg":"mp3",
      url:recording.url,credit:recording.credit,sourceIds:["private-native-media"],nativeSpeaker:true,
      ...(recording.licenseName?{licenseName:recording.licenseName}:{}),
      ...(recording.attributionUrl?{attributionUrl:recording.attributionUrl}:{}),
      ...(recording.externalId?{externalId:recording.externalId}:{}),
      ...(recording.speakerLabel?{speaker:recording.speakerLabel}:{})
    };
    setAudioState(source.document.id);setMessage("");
    try{
      await audio.current.play(asset);
      setPlayed((current)=>new Set([...current,source.document.id]));
    }catch{
      setMessage("That native recording could not be played. The source remains listed, but no synthetic replacement is labeled native.");
    }finally{setAudioState(null);}
  }

  async function saveSynthesis(){
    if(chosen.length<2||!synthesis.trim())return;
    setMessage("");
    try{
      for(const source of chosen){
        const note=String(notes[source.document.id]??"").trim();
        if(note)await recordNativeSourceNote({documentId:source.document.id,recording:activeRecording(source),note});
      }
      await recordMultiSourceListeningSynthesis({sourceDocumentIds:chosen.map((source)=>source.document.id),notes,synthesis});
      setMessage("Multi-source synthesis saved as advisory listening evidence. It does not create semantic mastery.");
      setSynthesis("");setNotes({});setPlayed(new Set());await refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save listening synthesis.");}
  }

  async function saveRecall(){
    if(!recall||!recallText.trim())return;
    setMessage("");
    try{
      await recordListeningDelayedRecall({candidate:recall,recall:recallText});
      setRecallText("");setMessage("Delayed recall saved. The original synthesis stayed hidden during recall.");await refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save delayed recall.");}
  }

  return <section className="native-listening-lab">
    <div className="section-heading">
      <div><span className="course-kicker">P9 NATIVE LISTENING DEPTH</span><h2>Listen → note → synthesize → recall later</h2></div>
      <span className="course-count">{summary?.sourceDocuments??0} native-source documents</span>
    </div>
    <p>Only source-provenanced reusable native recordings enter this lab. Device speech synthesis is not accepted as native qualification evidence. Select two or three documents, listen without a transcript-first workflow, take source notes and synthesize across them.</p>

    {summary?<div className="native-depth-stats">
      <div><strong>{summary.recordings}</strong><span>licensed recordings</span></div>
      <div><strong>{summary.speakers}</strong><span>speaker labels/credits</span></div>
      <div><strong>{summary.registers.length}</strong><span>registers represented</span></div>
      <div><strong>{summary.speechRates.length}</strong><span>source-rate labels</span></div>
      <div><strong>{summary.multiSourceSessions}</strong><span>multi-source syntheses</span></div>
      <div><strong>{summary.delayedRecalls}</strong><span>delayed recalls</span></div>
    </div>:null}

    {sources.length<2?<div className="native-depth-empty">
      <strong>Two independently licensed native-source documents are required.</strong>
      <p>Import reusable source packs or licensed Tatoeba material in Your Japanese. P9 does not fabricate a native inventory when the deployment does not contain one.</p>
    </div>:<>
      <div className="native-source-picker">{sources.map((source)=>{
        const checked=selected.includes(source.document.id);
        return <label className={checked?"selected":""} key={source.document.id}>
          <input type="checkbox" checked={checked} onChange={()=>toggleSource(source.document.id)}/>
          <span><strong>{source.document.title}</strong><small>{source.recordings.length} recording{source.recordings.length===1?"":"s"} · {source.document.sourceLabel??source.document.sourceKind}</small></span>
        </label>;
      })}</div>

      {chosen.length>=2?<div className="native-listening-workspace">{chosen.map((source)=>{
        const recording=activeRecording(source);
        return <article key={source.document.id}>
          <div className="native-source-head"><div><span>Source {chosen.indexOf(source)+1}</span><h3>{source.document.title}</h3></div><span>{played.has(source.document.id)?"played":"not played"}</span></div>
          {source.recordings.length>1?<label className="native-recording-select"><span>Recording</span><select value={variantIndex[source.document.id]??0} onChange={(event)=>setVariantIndex((current)=>({...current,[source.document.id]:Number(event.target.value)}))}>{source.recordings.map((item,index)=><option key={item.externalId??item.url} value={index}>{item.speechRate??"rate n/a"} · {item.register??"register n/a"} · {item.speakerLabel??item.credit}</option>)}</select></label>:null}
          <div className="native-recording-meta"><span>{recording.speechRate??"rate n/a"}</span><span>{recording.register??"register n/a"}</span><span>{recording.speakerLabel??recording.credit}</span></div>
          <button className="unit-action" disabled={audioState!==null} type="button" onClick={()=>void play(source)}>{audioState===source.document.id?"Playing…":played.has(source.document.id)?"Replay native source":"Play native source"}</button>
          <label><span>Source notes</span><textarea rows={4} value={notes[source.document.id]??""} onChange={(event)=>setNotes((current)=>({...current,[source.document.id]:event.target.value}))} placeholder="日本語または短いメモで、要点・数字・条件・対立点を記録…"/></label>
        </article>;
      })}</div>:null}

      <label className="native-synthesis"><span>Cross-source synthesis</span><textarea rows={6} value={synthesis} onChange={(event)=>setSynthesis(event.target.value)} placeholder="複数の音声を比較して、共通点・相違点・結論・不確かな点を日本語でまとめる…"/></label>
      <button className="primary" type="button" disabled={chosen.length<2||played.size<chosen.length||!synthesis.trim()} onClick={()=>void saveSynthesis()}>Save multi-source synthesis</button>
      {chosen.length>=2&&played.size<chosen.length?<p className="course-note">Play every selected native source before saving the synthesis.</p>:null}
    </>}

    {recall?<section className="native-delayed-recall">
      <div><span className="course-kicker">DELAYED LISTENING RECALL</span><strong>{Math.round(recall.delayHours)}h since synthesis</strong></div>
      <p>Without reopening the original notes or synthesis, write what you remember from the sources: central claims, conditions, contrasts and uncertainty.</p>
      <textarea rows={5} value={recallText} onChange={(event)=>setRecallText(event.target.value)} placeholder="覚えている内容を日本語で再構成…"/>
      <button className="unit-action" disabled={!recallText.trim()} type="button" onClick={()=>void saveRecall()}>Save delayed recall</button>
    </section>:null}

    {message?<p className="import-message" role="status">{message}</p>:null}
    <p className="course-note">Notes, synthesis and delayed recall are stored as learner artifacts with semantic grading disabled. They can document listening endurance and transfer without pretending that an unreviewed summary proves comprehension mastery.</p>
  </section>;
}
