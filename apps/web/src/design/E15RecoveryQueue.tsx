import {useEffect,useMemo,useState} from "react";
import type {E14HandoffReview} from "../study/e14ListeningHandoff";
import {planE15Revisits,type E15Focus} from "../study/e15ContextRecovery";
import "../study/e15ContextRecovery.css";

interface Props {
  reviews:readonly E14HandoffReview[];
  busy:boolean;
  onStart:(caseId:string,focus:E15Focus)=>void;
}

/**
 * Reuses private E14 source-checked event projections. No new storage,
 * CEFR result, independent speaker scoring or FSRS due state.
 */
export function E15RecoveryQueue({reviews,busy,onStart}:Props){
  const [now,setNow]=useState(()=>new Date());
  const [expanded,setExpanded]=useState(false);
  useEffect(()=>{
    const timer=window.setInterval(()=>setNow(new Date()),60_000);
    return()=>window.clearInterval(timer);
  },[]);
  const suggestions=useMemo(()=>planE15Revisits(reviews,now),[reviews,now]);
  const ready=suggestions.filter(item=>item.ready);
  const later=suggestions.filter(item=>!item.ready);
  const displayed=expanded?suggestions:[...ready.slice(0,4),...later.slice(0,2)];
  return <section className="e15-recovery" aria-labelledby="e15-recovery-title">
    <header className="e15-recovery__header">
      <div>
        
        <h2 id="e15-recovery-title">Return to what you heard and meant</h2>
        
      </div>
      <strong>{ready.length} optional revisits available</strong>
    </header>
    {!suggestions.length
      ?<p className="e15-recovery__empty" role="status">No source-qualified original practical situation is unlocked yet. Complete an original linked E06 listening and reading prerequisite first.</p>
      :<>
        <p className="e15-recovery__legend">These are <strong>practice suggestions, not FSRS due cards</strong>: 20 hours after a mismatched original choice, 72 hours after a matched choice or private draft. Unattempted exercises are available immediately. Your previous learning records remain unchanged.</p>
        <ol className="e15-recovery__list">
          {displayed.map(item=>{
            const original=reviews.find(r=>r.caseId===item.caseId);
            const feedback=original?.review.find(row=>row.key===(item.focus==="listen"?"listening":item.focus));
            return <li key={item.caseId+":"+item.focus}>
              <div className="e15-recovery__item-heading">
                <span className="e15-recovery__state">{item.ready?"Available":"Suggested later"}</span>
                <strong>{item.title}</strong>
              </div>
              <p className="e15-recovery__goal">{item.sourceGoal}</p>
              <p>{item.explanation}</p>
              {feedback?<details className="e15-recovery__context">
                <summary>Original situation and corrective context</summary>
                <p>{feedback.sourceFeedback}</p>
              </details>:null}
              <div className="e15-recovery__action">
                <small>{item.lastAttemptAt===null?"No previous original attempt":item.nextSuggestedAt
                  ?"Suggested "+new Date(item.nextSuggestedAt).toLocaleString()
                  :"Previous timestamp unavailable"}</small>
                <button type="button" disabled={busy||!item.ready}
                  onClick={()=>onStart(item.caseId,item.focus)}>
                  {item.ready?"Practise this original cue":"Wait for suggested revisit"}
                </button>
              </div>
            </li>;
          })}
        </ol>
        {suggestions.length>displayed.length||expanded
          ?<button className="e15-recovery__show-all" type="button"
            aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)}>
            {expanded?"Show fewer suggestions":"Show all "+suggestions.length+" original cue suggestions"}
          </button>:null}
        <p className="e15-recovery__footnote">Only the existing E11/E12 native prompts are replayed. Choices remain bounded context practice; writing remains private and unscored. This does not produce new Can-do mastery, speech assessment, FSRS intervals, cloud saves or accredited level evidence.</p>
      </>}
  </section>;
}
