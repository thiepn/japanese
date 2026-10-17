import {useMemo,useState} from "react";
import type {E19Overview,E19Cohort} from "../study/e19SourceWriting";
import {compareE19Drafts} from "../study/e19SourceWriting";
import "./e19SourceWriting.css";

interface Props{
 overview:E19Overview;busy:boolean;
 onSource:(cohort:E19Cohort,id:string)=>void;
 onWrite:(key:string)=>void;
}
const action={ "study-source":"Study original listening and reading",
 "first-draft":"Write your first original message",
 revise:"Continue independent revision",review:"Revise again"} as const;

/** Source-owned, owner-private writing continuity. Actual responses use the native
 * StudyPlayer, E02/03/04 StudyEvents and E19 optional non-FSRS revision only. */
export function E19SourceWritingStudio({overview,busy,onSource,onWrite}:Props){
 const [selected,setSelected]=useState<string>("");
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
 const cases=useMemo(()=>overview.cases.filter(c=>level==="all"||c.level===level),[overview,level]);
 const current=cases.find(c=>c.key===selected)??cases.find(c=>c.status==="revise")??
  cases.find(c=>c.status==="first-draft")??cases[0]??null;
 const diff=current?.firstDraft!==null&&current?.revisedDraft!==null&&current
  ?compareE19Drafts(current.firstDraft!,current.revisedDraft!):null;
 return <section className="e19-writing" aria-labelledby="e19-writing-title">
  <header className="e19-writing__header">
   <div><p className="j4-kicker">E19 · ORIGINAL A1–A2 WRITING CONTINUITY</p>
    <h2 id="e19-writing-title">Write, compare and revise your own Japanese</h2>
    <p>One original situation, one private first message, then a deliberate independent rewrite grounded in its actual dialogue, notice and audience. Listening and reading comprehension open the writing path. No automated essay grade or CEFR certification.</p>
   </div>
   <strong>{overview.drafted} first drafts · {overview.revised} revisions</strong>
  </header>
  <div className="e19-writing__filters" role="group" aria-label="Filter original writing scenes">
   {(["all","A1","A2"] as const).map(option=><button key={option} type="button"
    aria-pressed={level===option} onClick={()=>{setLevel(option);setSelected("");}}>
    {option==="all"?"All original scenes":option}</button>)}
  </div>
  {!cases.length?<p role="status">No canonically source-linked original writing situations are available for this level. Unmapped material remains an ungraded reading preview in the original course.</p>:<>
   <label className="e19-writing__choose" htmlFor="e19-writing-scene">Original writing situation
    <select id="e19-writing-scene" value={current?.key??""} disabled={busy} onChange={e=>setSelected(e.currentTarget.value)}>
     {cases.map(c=><option key={c.key} value={c.key}>{c.level} · {c.title} · {c.status==="study-source"?"source first":c.status==="first-draft"?"draft ready":c.status==="revise"?"revision ready":"two drafts recorded"}</option>)}
    </select>
   </label>
   {current?<div className="e19-writing__detail">
    <div className="e19-writing__head"><h3>{current.title}</h3><span>{current.level} · {current.cohort.toUpperCase()} · original linked source</span></div>
    <p><strong>Situation:</strong> {current.setting}</p>
    <p><strong>Original writing task:</strong> {current.writingTask}</p>
    <div className="e19-writing__gates">
     <span data-complete={current.sourceListening}>{current.sourceListening?"Recorded":"Needed"} · Original listening</span>
     <span data-complete={current.sourceReading}>{current.sourceReading?"Recorded":"Needed"} · Original reading comprehension</span>
     <span data-complete={current.firstDraft!==null}>{current.firstDraft?"Saved":"Pending"} · First unscored draft</span>
     <span data-complete={current.revisedDraft!==null}>{current.revisedDraft?"Saved":"Pending"} · Second unscored draft</span>
    </div>
    <details className="e19-writing__source">
     <summary>Original context and source explanation</summary>
     <p>{current.goal}</p><p>{current.sourceNotice}</p>
    </details>
    {current.firstDraft?<details className="e19-writing__private" aria-label="Private writing comparison">
     <summary>Compare my saved private drafts</summary>
     <p>These are your actual previously saved local responses for this original situation. They are not a translation, model answer, or automatically evaluated Japanese.</p>
     <div className="e19-writing__comparison">
      <div><strong>First draft · {current.firstAt?new Date(current.firstAt).toLocaleDateString():"saved locally"}</strong><pre lang="ja">{current.firstDraft}</pre></div>
      <div><strong>{current.revisedDraft?"Most recent revision · "+(current.revisionAt?new Date(current.revisionAt).toLocaleDateString():"saved locally"):"Revision not submitted"}</strong>
       {current.revisedDraft?<pre lang="ja">{current.revisedDraft}</pre>:<p>Your first draft is saved. A second message is still needed for comparison.</p>}</div>
     </div>
     {diff?<p className="e19-writing__diff" role="status">{diff.changed
      ?"Textual differences (not correctness): removed/changed “"+(diff.beforeChange||"∅")+"”; added/changed “"+(diff.afterChange||"∅")+"”."
      :"Both saved drafts are identical. Changes in facts, intent and register cannot be inferred."}</p>:null}
    </details>:null}
    <div className="e19-writing__actions">
     <button type="button" disabled={busy} className="e19-writing__main"
      onClick={()=>current.sourceReady?onWrite(current.key):onSource(current.cohort,current.sceneId)}>
      {action[current.status]}
     </button>
     {current.sourceReady?<button type="button" disabled={busy} onClick={()=>onSource(current.cohort,current.sceneId)}>
      Revisit original listening and reading
     </button>:null}
    </div>
    <p className="e19-writing__disclaimer">The first prompt retains its original source ID. The second draft uses one distinct optional, source-linked and scheduler-excluded ID; both remain private StudyEvents. Checklists are questions for your own review, never grades, native speech scores or proficiency awards.</p>
   </div>:null}
  </>}
 </section>;
}
