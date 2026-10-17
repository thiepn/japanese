import type {E06CaseProgress,E06Overview} from "../study/e06IndependentCourse";
import type {E05Evidence} from "../study/runtime";

/** Presentation-only route selection. The original source and Study Player own all evidence. */
export type UX2StudioTarget="e13-lab-title"|"e14-studio-title"|"e15-recovery-title"|"e16-studio-title";
export type UX2CaseEntry="preview"|"source"|"short"|"full";
export function ux2CaseEntry(c:Pick<E06CaseProgress,"canDoId"|"prerequisiteReady"|"nextDailyStage">):UX2CaseEntry{
 if(!c.canDoId)return "preview";
 if(!c.prerequisiteReady)return "source";
 return c.nextDailyStage?"short":"full";
}
export function ux2CanReview(c:Pick<E06CaseProgress,"canDoId"|"prerequisiteReady"|"status">):boolean{
 return Boolean(c.canDoId&&c.prerequisiteReady&&(c.status==="ready"||c.status==="reviewed"));
}
type Props={
 e06:E06Overview;e05:E05Evidence;busy:boolean;
 onSource:(c:E06CaseProgress)=>void;onShort:(id:string)=>void;onFull:(id:string)=>void;
 onPreview:(id:string)=>void;onReview:(id:string)=>void;onPractical:(id:string)=>void;
 onRepair:()=>void;onOpenStudio:(target:UX2StudioTarget)=>void;
};
const studios:{id:UX2StudioTarget;title:string;description:string}[]=[
 {id:"e13-lab-title",title:"Situation mixer",description:"Mix two or three unlocked original situations"},
 {id:"e14-studio-title",title:"Listening and reply handoff",description:"Listen, respond, write and revise a private follow-up"},
 {id:"e15-recovery-title",title:"Context recovery",description:"Revisit existing errors and optional practice suggestions"},
 {id:"e16-studio-title",title:"Conversation and private notebook",description:"Hear original dialogue turns and save private notes"}
];
export function UX2TransferPath({e06,e05,busy,onSource,onShort,onFull,onPreview,onReview,onPractical,onRepair,onOpenStudio}:Props){
 const begun=e06.cases.filter(c=>c.canDoId&&(c.status==="learning"||c.status==="waiting"||c.status==="ready"||c.status==="reviewed")).length;
 return <section className="ux2-transfer" aria-labelledby="ux2-transfer-title">
  <div className="ux1-chapter">
   <p className="ux1-eyebrow">E06–E17 · ORIGINAL CUMULATIVE PRACTICE</p>
   <h2 id="ux2-transfer-title">Use Japanese across situations <span lang="ja">場面をつなぐ</span></h2>
   <p>{e06.prerequisiteReady} / {e06.linked} source-linked cases unlocked · {begun} with assessed attempts</p>
   {e06.unlinked>0?<small>{e06.unlinked} original case(s) remain ungraded reading previews</small>:null}
   <progress value={e06.prerequisiteReady} max={Math.max(1,e06.linked)} aria-label="Cumulative situations with completed source prerequisites"/>
  </div>
  <ol className="ux2-transfer__cases" aria-label="Original cumulative communication cases">
   {e06.cases.map(c=>{
    const entry=ux2CaseEntry(c);
    const stage=c.dailyStages.find(s=>s.id===c.nextDailyStage);
    return <li key={c.id} className="ux2-transfer-case">
     <div className="ux2-transfer-case__head"><h3>{c.title}</h3><small>{c.level} · {c.anchorCohort.toUpperCase()}</small></div>
     <p>{c.objective}</p>
     <p className="ux2-transfer-case__state">{entry==="preview"?"Original reading only · no verified Can-do":
      entry==="source"?"Original listening and reading/form prerequisites needed":
      "Controlled practice "+c.correct+" / "+c.required+" correct"}</p>
     {c.canDoId?<ul className="ux2-transfer-case__evidence">
      <li>{c.sourceListening?"Source listening recorded":"Source listening not yet recorded"}</li>
      <li>{c.sourceReading?"Source reading/form recorded":"Source reading/form not yet recorded"}</li>
      <li>{c.firstDraftSubmitted?"Independent first draft recorded":"Independent draft not submitted"} · {c.revisedDraftSubmitted?"revision recorded":"revision not submitted"}</li>
      <li>{c.e11WritingSubmitted?"Practical message saved":"Practical message not submitted"} · {c.e12RevisedWritingSubmitted?"message revision saved":"message revision not submitted"}</li>
     </ul>:<small>Ungraded original preview · never fabricates source linkage.</small>}
     {stage&&entry==="short"?<p className="ux2-transfer-case__next">Next short stage: {stage.title}</p>:null}
     {c.status==="waiting"&&c.availableAt?<p className="ux2-transfer-case__next">Delayed review available after {new Date(c.availableAt).toLocaleString()}</p>:null}
     <div className="ux1-node__actions">
      <button type="button" disabled={busy} onClick={()=>{
       if(entry==="preview")onPreview(c.id);
       else if(entry==="source")onSource(c);
       else if(entry==="short")onShort(c.id);
       else onFull(c.id);
      }}>{entry==="preview"?"Read original case":entry==="source"?"Study prerequisite source":
        entry==="short"?"Continue short lesson":"Review full original case"}</button>
      {c.canDoId&&c.prerequisiteReady?<button type="button" disabled={busy} onClick={()=>onPractical(c.id)}>Practical response and writing</button>:null}
      {ux2CanReview(c)?<button type="button" disabled={busy} onClick={()=>onReview(c.id)}>Changed-context delayed review</button>:null}
     </div>
    </li>;
   })}
  </ol>
  <section className="ux2-transfer__tools" aria-labelledby="ux2-transfer-tools-title">
   <h2 id="ux2-transfer-tools-title">Original conversation studios</h2>
   <p>Open the existing E13–E17 tools. Original prompts, private notes and learner history remain under their existing ownership.</p>
   {e05.repair.pending>0?<button type="button" disabled={busy} onClick={onRepair}>Repair {e05.repair.pending} misunderstood source cue{e05.repair.pending===1?"":"s"}</button>:null}
   <ul>{studios.map(studio=><li key={studio.id}>
    <div><strong>{studio.title}</strong><small>{studio.description}</small></div>
    <button type="button" disabled={busy} onClick={()=>onOpenStudio(studio.id)}>Open studio</button>
   </li>)}</ul>
   <p className="ux1-path-note">Original Can-do, StudyEvents and FSRS remain authoritative. Device voice, free writing and private notes do not certify proficiency.</p>
  </section>
 </section>;
}
