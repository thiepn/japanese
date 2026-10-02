import { useEffect,useState } from "react";
import { getAdaptiveRemediationPlan,type AdaptiveRemediationPlan } from "./remediation";

export function AdaptiveRemediation({onStartUnit,onStartProduction}:{onStartUnit:(id:string)=>void;onStartProduction:(mode:"writing"|"speaking")=>void}){
  const [plan,setPlan]=useState<AdaptiveRemediationPlan|null>(null);
  useEffect(()=>{void getAdaptiveRemediationPlan().then(setPlan).catch(()=>setPlan(null));},[]);
  if(!plan)return null;
  return <section className="remediation-card">
    <div className="section-heading"><div><span className="course-kicker">ADAPTIVE REMEDIATION</span><h2>Next weak links</h2></div><span className="course-count">derived from evidence</span></div>
    <p>Recommendations combine course mastery, productive-task target evidence and current immersion readiness. They remain advisory and never lock another path.</p>
    <div className="remediation-grid">
      {plan.course?<article><span>Course</span><h3>{plan.course.title}</h3><p>{plan.course.reason}</p><small>{Math.round(plan.course.mastery*100)}% durable mastery</small><button className="unit-action" type="button" onClick={()=>onStartUnit(plan.course!.unitId)}>Review unit</button></article>:null}
      {plan.production?<article><span>Production</span><h3>{plan.production.title}</h3><p>{plan.production.reason}</p><small>{Math.round(plan.production.targetMastery*100)}% target evidence</small><button className="unit-action" type="button" onClick={()=>onStartProduction(plan.production!.mode)}>Practice {plan.production.mode}</button></article>:null}
      {plan.immersion?<article><span>Immersion · {plan.immersion.focus}</span><h3>{plan.immersion.title}</h3><p>{plan.immersion.reason}</p><small>{Math.round(plan.immersion.readiness*100)}% lexical readiness · open in Immerse</small></article>:null}
    </div>
  </section>;
}
