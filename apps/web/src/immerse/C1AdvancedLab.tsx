import { useEffect,useMemo,useState } from "react";
import {
  c1NativeSource,c1NativeSourceSet,c1NativeSourceSets,getC1NativeDepthProgress,
  recordC1NativeExposure,recordC1NativeSynthesis,
  type C1NativeDepthProgress
} from "../study/c1NativeDepth";
import { c1SynthesisPacks,getC1SynthesisProgress,type C1SynthesisPackProgress } from "../study/c1Synthesis";
import { readingText } from "../coreContent";

export function C1AdvancedLab({onOpenText,onStartSynthesis,preferredSetId}:{onOpenText:(id:string)=>void;onStartSynthesis:(packId:string)=>void;preferredSetId?:string|null}){
  const [setId,setSetId]=useState(c1NativeSourceSets[0]!.id);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [synthesis,setSynthesis]=useState("");
  const [played,setPlayed]=useState<Set<string>>(new Set());
  const [nativeProgress,setNativeProgress]=useState<C1NativeDepthProgress|null>(null);
  const [synthesisProgress,setSynthesisProgress]=useState<C1SynthesisPackProgress[]>([]);
  const [message,setMessage]=useState("");

  async function refresh(){
    const [native,nextSynthesis]=await Promise.all([getC1NativeDepthProgress(),getC1SynthesisProgress()]);
    setNativeProgress(native);setSynthesisProgress(nextSynthesis);
  }
  useEffect(()=>{void refresh().catch(()=>{setNativeProgress(null);setSynthesisProgress([]);});},[]);
  useEffect(()=>{
    if(preferredSetId&&c1NativeSourceSets.some((item)=>item.id===preferredSetId))chooseSet(preferredSetId);
  },[preferredSetId]);

  const sourceSet=c1NativeSourceSet(setId);
  const sources=useMemo(()=>sourceSet.sourceIds.map(c1NativeSource),[sourceSet]);

  function chooseSet(next:string){
    setSetId(next);setNotes({});setSynthesis("");setPlayed(new Set());setMessage("");
  }

  async function markPlayed(sourceId:string){
    if(played.has(sourceId))return;
    setPlayed((current)=>new Set([...current,sourceId]));
    try{await recordC1NativeExposure(sourceId);void refresh();}catch(error){setMessage(error instanceof Error?error.message:"Could not record native-source exposure.");}
  }

  async function saveNativeSynthesis(){
    setMessage("");
    try{
      await recordC1NativeSynthesis({setId:sourceSet.id,notes,synthesis});
      setMessage("C1 native-source synthesis saved as ungraded listening evidence.");
      setNotes({});setSynthesis("");setPlayed(new Set());await refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save C1 native-source synthesis.");}
  }

  return <section className="p13-advanced-lab" id="p13-c1-source-depth">
    <div className="section-heading">
      <div><span className="course-kicker">C1 NATIVE SOURCE DEPTH</span><h2>Native sources → multi-source synthesis</h2></div>
      <span className="course-count">verified inventory · no transcript-first shortcut</span>
    </div>
    <p className="course-note">This workspace uses the repository's already-audited native inventory for advanced listening depth. Source identity, licensing, native-speaker status, connected speech, register and source-rate labels come from the repository provenance audit. Listening notes and syntheses remain learner artifacts, not semantic mastery or CEFR certification.</p>

    {nativeProgress?<div className="native-depth-stats">
      <div><strong>{nativeProgress.verifiedSources}/{nativeProgress.sourceCount}</strong><span>verified sources</span></div>
      <div><strong>{nativeProgress.speakers}</strong><span>speakers</span></div>
      <div><strong>{nativeProgress.registers.length}</strong><span>registers</span></div>
      <div><strong>{nativeProgress.speechRates.length}</strong><span>rate conditions</span></div>
      <div><strong>{nativeProgress.exposedSources}</strong><span>sources listened</span></div>
      <div><strong>{nativeProgress.completedSets}</strong><span>source sets synthesized</span></div>
    </div>:null}

    <div className="coach-chain">
      <label><span>C1 native-source set</span><select value={setId} onChange={(event)=>chooseSet(event.target.value)}>
        {c1NativeSourceSets.map((set)=><option key={set.id} value={set.id}>{set.title}</option>)}
      </select></label>
      <h3>{sourceSet.title}</h3>
      <p>{sourceSet.description}</p>
      <small>{sourceSet.focus}</small>
    </div>

    <div className="native-listening-workspace">{sources.map((source,index)=><article key={source.id}>
      <div className="native-source-head"><div><span>Source {index+1}</span><h3>{source.title}</h3></div><span>{source.verified?"repository verified":"not verified"}</span></div>
      <div className="native-recording-meta">
        <span>{source.recording.speechRate}</span><span>{source.recording.register}</span><span>{source.recording.speakerLabel}</span>
      </div>
      <audio controls preload="none" src={source.recording.url} onEnded={()=>void markPlayed(source.id)}/>
      <div className="native-source-links"><a href={source.sourceUrl} target="_blank" rel="noreferrer">Source page</a><a href={source.recording.attributionUrl} target="_blank" rel="noreferrer">Media + attribution</a></div>
      <small>{source.recording.credit} · {source.recording.licenseName}</small>
      <label><span>Listening notes</span><textarea rows={4} value={notes[source.id]??""} onChange={(event)=>setNotes((current)=>({...current,[source.id]:event.target.value}))} placeholder="主張・条件・対立点・聞き取れなかった点をメモ…"/></label>
    </article>)}</div>

    <section className="native-synthesis">
      <span className="course-kicker">NATIVE MULTI-SOURCE SYNTHESIS</span>
      <p>{sourceSet.synthesisPrompt}</p>
      <div className="coach-goals">{sourceSet.targetMoves.map((move)=><span key={move}>{move}</span>)}</div>
      <textarea rows={7} value={synthesis} onChange={(event)=>setSynthesis(event.target.value)} placeholder="複数の音声を統合し、共通点・相違点・留保を日本語でまとめる…"/>
      <button className="primary" type="button" disabled={played.size<sources.length||Object.values(notes).filter((note)=>note.trim()).length<2||!synthesis.trim()} onClick={()=>void saveNativeSynthesis()}>Save native-source synthesis</button>
      {played.size<sources.length?<p className="course-note">Finish playback of every source in this set before saving. The exposure log records actual source exposure rather than a source-selection click.</p>:null}
      {message?<p className="import-message" role="status">{message}</p>:null}
    </section>

    <section className="p13-synthesis-packs">
      <div className="section-heading"><div><span className="course-kicker">MULTI-SOURCE REASONING</span><h2>Synthesize before you generalize</h2></div><span className="course-count">{c1SynthesisPacks.length} C1 packs</span></div>
      <p className="course-note">These packs reuse the canonical C1 texts but force cross-source reasoning. The Study Player checks only transparent length and requested target language; semantic quality remains ungraded unless reviewed separately.</p>
      <div className="mission-grid">{c1SynthesisPacks.map((pack)=>{
        const progress=synthesisProgress.find((item)=>item.pack.id===pack.id);
        return <article className="p13-synthesis-card" key={pack.id}>
          <div className="mission-card-head"><span>{pack.domain} · {pack.mode}</span><strong>{progress?.attempts??0} attempt{(progress?.attempts??0)===1?"":"s"}</strong></div>
          <h3>{pack.title}</h3><p>{pack.description}</p>
          <div className="mission-stage-list">{pack.sourceTextIds.map((id)=><button className="quiet-button" key={id} type="button" onClick={()=>onOpenText(id)}>{readingText(id).title}</button>)}</div>
          <small>{pack.requiredMoves.join(" · ")}</small>
          <button className="unit-action" type="button" onClick={()=>onStartSynthesis(pack.id)}>Start {pack.mode} synthesis</button>
        </article>;
      })}</div>
    </section>
  </section>;
}
