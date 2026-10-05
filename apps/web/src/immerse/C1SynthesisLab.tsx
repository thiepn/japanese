import { useEffect,useMemo,useState } from "react";
import { c1NativeSources,c1SynthesisMissions,getC1SynthesisSummary,recordC1MultiSourceSynthesis,recordC1SourceNote,type C1SynthesisSummary } from "./c1NativeSources";

export function C1SynthesisLab(){
  const [missionId,setMissionId]=useState(c1SynthesisMissions[0]!.id);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [synthesis,setSynthesis]=useState("");
  const [summary,setSummary]=useState<C1SynthesisSummary>({sessions:0,sourcesUsed:0});
  const [message,setMessage]=useState("");
  const [played,setPlayed]=useState<Set<string>>(new Set());
  const mission=useMemo(()=>c1SynthesisMissions.find(x=>x.id===missionId)!,[missionId]);
  const sources=mission.sourceIds.map(id=>c1NativeSources.find(s=>s.id===id)).filter((x):x is typeof c1NativeSources[number]=>Boolean(x));
  useEffect(()=>{void getC1SynthesisSummary().then(setSummary);},[]);
  async function save(){
    try{
      for(const source of sources){
        const note=(notes[source.id]??"").trim();
        if(note)await recordC1SourceNote({missionId:mission.id,sourceId:source.id,note});
      }
      await recordC1MultiSourceSynthesis({missionId:mission.id,sourceIds:sources.map(s=>s.id),synthesis});
      setSynthesis("");setNotes({});setSummary(await getC1SynthesisSummary());setMessage("C1 multi-source synthesis saved as advisory evidence.");
    }catch(e){setMessage(e instanceof Error?e.message:"Could not save synthesis.");}
  }
  return <section className="native-listening-lab">
    <div className="section-heading"><div><span className="course-kicker">P13 C1 NATIVE-SOURCE DEPTH</span><h2>Listen across real sources, then synthesize</h2></div><span className="course-count">{summary.sessions} syntheses · {summary.sourcesUsed} sources used</span></div>
    <p>These missions reuse the repository's provenance-audited native-source registry. Source identity, licensing and native-speaker status come from P11.2 evidence; P13 adds advanced listening and synthesis work without relabeling the sources or inventing transcripts.</p>
    <label className="native-recording-select"><span>Mission</span><select value={missionId} onChange={e=>{setMissionId(e.target.value);setNotes({});setSynthesis("");setPlayed(new Set());setMessage("");}}>{c1SynthesisMissions.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select></label>
    <p><strong>{mission.focus}</strong> · {mission.prompt}</p>
    <div className="native-source-picker">{sources.map(source=><article key={source.id} className="selected">
      <span><strong>{source.title}</strong><small>{source.speakerLabel} · {source.register} · {source.speechRate} · {Math.round(source.durationSeconds/60)} min</small></span>
      <p className="course-note">{source.credit} · {source.licenseName}</p>
      <audio controls preload="none" src={source.mediaUrl} onPlay={()=>setPlayed(current=>new Set([...current,source.id]))}/>
      <a className="unit-action" href={source.sourcePageUrl} target="_blank" rel="noreferrer">Open source page</a>
      <textarea rows={4} value={notes[source.id]??""} onChange={e=>setNotes(v=>({...v,[source.id]:e.target.value}))} placeholder="要点・根拠・条件・立場・不確かな点…"/>
    </article>)}</div>
    <div className="mission-stage-list">{mission.requiredMoves.map(move=><span key={move}>○ {move}</span>)}</div>
    <label className="native-synthesis"><span>Multi-source synthesis</span><textarea rows={7} value={synthesis} onChange={e=>setSynthesis(e.target.value)} placeholder="複数の情報源を統合して、観察事実・解釈・対立点・留保・結論を区別してまとめる…"/></label>
    <button className="primary" type="button" disabled={!synthesis.trim()||played.size<sources.length} onClick={()=>void save()}>Save C1 synthesis</button>
    {played.size<sources.length?<p className="course-note">Play every selected native source before saving the synthesis.</p>:null}
    {message?<p role="status" className="import-message">{message}</p>:null}
    <p className="course-note">Saved syntheses document advanced listening and source integration. They remain ungraded learner artifacts until reviewed; they do not create semantic mastery by themselves.</p>
  </section>;
}
