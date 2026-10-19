import {useEffect,useMemo,useState} from "react";
import type {E06CaseProgress} from "../study/e06IndependentCourse";
import {
  E14_HANDOFF_MODES,eligibleE14Cases,
  type E14HandoffMode,type E14HandoffReview,
} from "../study/e14ListeningHandoff";
import "../study/e14ListeningHandoff.css";

type Props={
  cases:readonly E06CaseProgress[];
  reviews:readonly E14HandoffReview[];
  busy:boolean;
  onStart:(caseId:string,mode:E14HandoffMode)=>void;
};

/**
 * One situation, one continuous listening-to-action handoff. Unlike E13's
 * across-case mixer, E14 places the learner's prior original StudyEvents next
 * to the source's actual conversational intentions and private writing.
 */
export function E14HandoffStudio({cases,reviews,busy,onStart}:Props){
  const eligible=useMemo(()=>eligibleE14Cases(cases),[cases]);
  const [chosen,setChosen]=useState<string|null>(null);
  const [mode,setMode]=useState<E14HandoffMode>("complete-handoff");
  const [reviewOpen,setReviewOpen]=useState(false);
  const ids=eligible.map(c=>c.id).join("|");
  useEffect(()=>{
    const choices=ids.split("|").filter(Boolean);
    setChosen(old=>old&&choices.includes(old)?old:choices[0]??null);
    setReviewOpen(false);
  },[ids]);
  const active=eligible.find(c=>c.id===chosen)??null;
  const report=reviews.find(r=>r.caseId===active?.id)??null;
  const attempted=report?.review.filter(item=>item.attempted).length??0;
  return <section className="e14-studio" aria-labelledby="e14-studio-title">
    <header className="e14-studio__head">
      <p className="j4-kicker">E14 · SOURCE-ANCHORED CONVERSATION HANDOFF</p>
      <h2 id="e14-studio-title">Hear it. Respond. Write the follow-up.</h2>
      <p>Choose one original unlocked situation. Hear the dialogue, respond as its circumstances change, then compose and revise a private message for its intended reader. Previous attempts are shown alongside the original source's intentions, not an invented language score.</p>
    </header>
    {!eligible.length
      ?<p role="status">Finish a source-linked E06 situation before starting its original listening-to-response handoff. No prerequisite or level is invented.</p>
      :<>
        <label className="e14-studio__choose" htmlFor="e14-situation">Original situation
          <select id="e14-situation" disabled={busy} value={active?.id??""}
            onChange={e=>{setChosen(e.currentTarget.value);setReviewOpen(false);}}>
            {eligible.map(c=><option key={c.id} value={c.id}>{c.title} · {c.level}</option>)}
          </select>
        </label>
        {active?<div className="e14-studio__facts">
          <strong>{active.canDo}</strong>
          <span>{active.e11ListeningPractised?"Original listening attempted":"Original listening not yet attempted"} · {active.e11WritingSubmitted?"Private first draft recorded":"Private first draft not recorded"} · {active.e12RevisedWritingSubmitted?"Revision recorded":"Revision not recorded"}</span>
        </div>:null}
        <div className="e14-studio__footer">
          <label htmlFor="e14-mode">Practice handoff
            <select id="e14-mode" value={mode} disabled={busy}
              onChange={e=>setMode(e.currentTarget.value as E14HandoffMode)}>
              {E14_HANDOFF_MODES.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <p>{E14_HANDOFF_MODES.find(option=>option.id===mode)?.detail}</p>
          <button className="e14-studio__start" disabled={busy||!active}
            type="button" onClick={()=>{if(active)onStart(active.id,mode);}}>
            Start listening-to-response handoff
          </button>
        </div>
        <div className="e14-studio__reviews">
          <button className="e14-studio__review-toggle" type="button"
            disabled={!report||busy} aria-expanded={reviewOpen}
            onClick={()=>setReviewOpen(value=>!value)}>
            {reviewOpen?"Hide":"Review"} my recorded attempts · {attempted}/5 source-linked stages
          </button>
          {reviewOpen&&report?<section aria-label="Private Japanese handoff feedback">
            <p className="e14-studio__review-note">
              Device-only learner evidence for this one account and original situation. A matched multiple-choice option is not proof of spoken ability. Writing is not automatically assessed. The original source answers and checklist are suggestions for your own comparison.
            </p>
            <p><strong>What matters:</strong> {report.sourceGoal}. <strong>Watch for:</strong> {report.sourceCaution}</p>
            <ol className="e14-studio__review-list">
              {report.review.map(item=><li key={item.key}>
                <div><strong>{item.title}</strong><span>{item.result==="matched"?"Original response matched":item.result==="needs-context-review"?"Review the original context":item.result==="unscored-writing"?"Private writing recorded · unscored":"Not attempted yet"}</span></div>
                <p>{item.sourceFeedback}</p>
                {item.learnerText!==null?<details>
                  <summary>Read my previous private Japanese text</summary>
                  <pre lang="ja">{item.learnerText}</pre>
                </details>:null}
              </li>)}
            </ol>
            <div className="e14-studio__questions">
              <strong>Review the real reader: {report.audience}</strong>
              {report.reviewQuestions.map(item=><p key={item.heading}><b>{item.heading}.</b> {item.question} <span>{item.repair}</span></p>)}
            </div>
          </section>:null}
        </div>
        <p className="e14-studio__boundary">All interactive questions are existing E11/E12 original prompts with their original IDs and non-authoritative flags. Audio is synthesized by the device, not a verified native recording. StudyEvents remain private per workspace and are not automatically cloud-synced.</p>
      </>}
  </section>;
}
