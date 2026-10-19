import {useEffect,useMemo,useState} from "react";
import type {E02Overview,E03Overview,E04Overview} from "../study/runtime";
import {E18_MODES,eligibleE18Cases,type E18Cohort,type E18Mode} from "../study/e18OriginalMixedReview";
import "./ux3MixedRecall.css";

interface Props{
 e02:E02Overview;e03:E03Overview;e04:E04Overview;busy:boolean;
 onStart:(keys:readonly string[],mode:E18Mode)=>void;
 onSource:(cohort:E18Cohort,sceneId:string)=>void;
}
/** Learner-facing retrieval across ALREADY completed original situations.
 * Unlike E13's optional practical mixer, original guided prompts retain their regular grading/FSRS.
 */
export function UX3MixedRecall({e02,e03,e04,busy,onStart,onSource}:Props){
 const eligible=useMemo(()=>eligibleE18Cases(e02,e03,e04),[e02,e03,e04]);
 const [selected,setSelected]=useState<string[]>([]);
 const [mode,setMode]=useState<E18Mode>("listen-read");
 const eligibleIds=eligible.map(s=>s.key).join("|");
 useEffect(()=>{
  const allowed=new Set(eligibleIds.split("|").filter(Boolean));
  setSelected(previous=>{
   const kept=previous.filter(key=>allowed.has(key)).slice(0,3);
   if(kept.length<2)for(const candidate of eligible){
    if(kept.length>=2)break;
    if(!kept.includes(candidate.key))kept.push(candidate.key);
   }
   return kept.length===previous.length&&kept.every((id,i)=>id===previous[i])?previous:kept;
  });
 },[eligibleIds]);
 const current=eligible.filter(s=>selected.includes(s.key));
 const nextOriginal=(
  e02.scenes.filter(s=>s.state==="learning"||s.state==="not_started").map(s=>({cohort:"e02" as const,id:s.id,title:s.title}))[0]??
  e03.scenes.filter(s=>s.state==="learning"||s.state==="not_started").map(s=>({cohort:"e03" as const,id:s.id,title:s.title}))[0]??
  e04.scenes.filter(s=>s.status==="learning"||s.status==="not_started").map(s=>({cohort:"e04" as const,id:s.id,title:s.title}))[0]
 );
 function toggle(key:string){
  setSelected(current=>current.includes(key)?current.filter(x=>x!==key):
   current.length<3?[...current,key]:current);
 }
 return <section className="ux3-mixed" aria-labelledby="ux3-mixed-title">
  <header className="ux3-mixed__header">
   <div><p className="j4-kicker">ORIGINAL A1–A2 · CROSS-SITUATION RETRIEVAL</p>
    <h2 id="ux3-mixed-title">Recall across real situations</h2>
    <p>Interleave original listening, reading and bounded Japanese responses from two or three completed lessons. Unlike a repeat of one dialogue, the next question can change its situation. This repeats existing source questions, not a new unseen transfer.</p>
   </div>
   <strong>{eligible.length} completed sources eligible</strong>
  </header>
  {eligible.length<2?<div className="ux3-mixed__locked" role="status">
    <p>Complete all controlled questions in at least two original source-linked A1/A2 situations to unlock mixed review. Optional drafts and unlinked reading previews do not count.</p>
    {nextOriginal?<button type="button" disabled={busy} onClick={()=>onSource(nextOriginal.cohort,nextOriginal.id)}>
     Continue original lesson · {nextOriginal.title}
    </button>:<p>All available graded source lessons are finished or none is canonically linked. Return to the native course to review them.</p>}
   </div>:<>
   <fieldset className="ux3-mixed__choices">
    <legend>Choose 2–3 completed situations ({selected.length} selected)</legend>
    {eligible.map(c=><button key={c.key} type="button" className="ux3-mixed__case"
      aria-pressed={selected.includes(c.key)} disabled={busy||(!selected.includes(c.key)&&selected.length>=3)}
      onClick={()=>toggle(c.key)}>
      <strong>{c.title}</strong><span>{c.level} · {c.cohort.toUpperCase()} · {c.correct}/{c.required} original controlled answers correct</span>
    </button>)}
   </fieldset>
   <label className="ux3-mixed__mode" htmlFor="ux3-mixed-mode">Choose your retrieval focus
    <select id="ux3-mixed-mode" value={mode} disabled={busy}
      onChange={e=>setMode(e.currentTarget.value as E18Mode)}>
     {E18_MODES.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
    </select>
   </label>
   <p className="ux3-mixed__explanation">{E18_MODES.find(x=>x.id===mode)?.description}</p>
   <button className="ux3-mixed__start" disabled={busy||current.length<2||current.length>3}
      onClick={()=>onStart(current.map(c=>c.key),mode)}>
    Start {current.length}-situation original review
   </button>
   <p className="ux3-mixed__boundary">Uses exactly the existing source-qualified StudyPrompts and their canonical IDs. Answers are recorded under your existing StudyEvents and regular FSRS reviews. This cannot grant new Can-dos, independent writing grades, native-audio evidence or CEFR proficiency.</p>
  </>}
 </section>;
}
