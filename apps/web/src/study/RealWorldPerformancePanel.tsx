import { useEffect,useState } from "react";
import { getRealWorldPerformanceSummary,type RealWorldPerformanceSummary } from "./realWorldPerformance";

export function RealWorldPerformancePanel({onStartChain,onStartQualification}:{onStartChain:(chainId:string)=>void;onStartQualification:()=>void}){
  const [summary,setSummary]=useState<RealWorldPerformanceSummary|null>(null);
  useEffect(()=>{void getRealWorldPerformanceSummary().then(setSummary).catch(()=>setSummary(null));},[]);
  if(!summary)return null;

  return <section className="real-world-performance">
    <div className="section-heading">
      <div><span className="course-kicker">P9 REAL-WORLD PERFORMANCE</span><h2>Functional chains under time pressure</h2></div>
      <span className="course-count">{summary.attemptedPrompts}/{summary.totalPrompts} attempted</span>
    </div>
    <p>Appointments, workplace incidents, service failures, travel disruption and community coordination are tested through unseen response, paraphrase, repair and timed follow-up. These are internal performance prompts, not an accredited CEFR examination.</p>
    <div className="performance-summary">
      <div><strong>{summary.unseenPrompts}</strong><span>unseen prompts left</span></div>
      <div><strong>{summary.correctFirstAttempts}</strong><span>correct first attempts</span></div>
      <div><strong>{summary.withinTimeFirstAttempts}</strong><span>first attempts within target</span></div>
    </div>
    <div className="performance-chain-grid">{summary.chains.map((entry)=><article key={entry.chain.id}>
      <div className="performance-chain-head"><span>{entry.chain.domain}</span><strong>{entry.attemptedStages}/4</strong></div>
      <h3>{entry.chain.title}</h3><p>{entry.chain.description}</p>
      <div className="performance-dimensions">{entry.stages.map((stage)=><span className={stage.correctAttempts>0?"correct":stage.attempts>0?"attempted":""} key={stage.id}>{stage.correctAttempts>0?"✓":stage.attempts>0?"•":"○"} {stage.dimension.replace("_"," ")}</span>)}</div>
      <small>{entry.correctStages} structurally successful · {entry.withinTimeStages} within time target</small>
      <button className="unit-action" type="button" onClick={()=>onStartChain(entry.chain.id)}>{entry.nextStage?"Next: "+entry.nextStage.title:"Repeat weakest stage"}</button>
    </article>)}</div>
    <button className="primary performance-qualification-action" type="button" onClick={onStartQualification}>Start mixed P9 performance set</button>
    <p className="course-note">First-attempt status is preserved in StudyEvent metadata. Qualification-only prompts are deliberately excluded from FSRS so testing does not create artificial review obligations.</p>
  </section>;
}
