import { entityKey } from "@thiepn/domain";
import { replayStudyEvents } from "@thiepn/learner-engine";
import { listStudyEvents } from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { getAdaptiveImmersionRecommendation } from "../immerse/adaptive";
import { getCourseProgress,DEVELOPMENT_ACCOUNT_ID } from "./runtime";

export interface AdaptiveRemediationPlan {
  course:{unitId:string;title:string;mastery:number;reason:string}|null;
  production:{taskId:string;title:string;mode:"writing"|"speaking";targetMastery:number;reason:string}|null;
  immersion:{id:string;title:string;focus:"reading"|"listening";readiness:number;reason:string}|null;
}

export async function getAdaptiveRemediationPlan():Promise<AdaptiveRemediationPlan>{
  const [course,events,immersion]=await Promise.all([
    getCourseProgress(),listStudyEvents(DEVELOPMENT_ACCOUNT_ID),getAdaptiveImmersionRecommendation()
  ]);
  const state=replayStudyEvents(events);
  const candidateUnits=course.filter((unit)=>unit.status==="learning"||unit.status==="challenging"||unit.status==="ready");
  const courseTarget=[...candidateUnits].sort((a,b)=>{
    const aPriority=a.id.startsWith("b2-")?-.08:0;const bPriority=b.id.startsWith("b2-")?-.08:0;
    return (a.mastery+aPriority)-(b.mastery+bPriority)||a.id.localeCompare(b.id);
  })[0]??null;

  const productionCandidates=coreContent.productiveTasks.filter((task)=>task.level==="B1"||task.level==="B2").map((task)=>{
    const grammarScores=task.targetGrammarIds.map((id)=>{
      const comprehension=state.mastery[entityKey({kind:"grammar",id},"comprehension")]?.estimate??0;
      const form=state.mastery[entityKey({kind:"grammar",id},"form_selection")]?.estimate??0;
      return Math.max(comprehension,form);
    });
    const targetMastery=grammarScores.length?grammarScores.reduce((sum,value)=>sum+value,0)/grammarScores.length:0;
    const taskEvidence=state.mastery[entityKey({kind:"production_task",id:task.id},task.mode==="writing"?"writing_quality":"production")]?.estimate??0;
    return {task,targetMastery:Math.max(targetMastery,taskEvidence*.7),taskEvidence};
  }).sort((a,b)=>a.targetMastery-b.targetMastery||a.task.id.localeCompare(b.task.id))[0]??null;

  return {
    course:courseTarget?{
      unitId:courseTarget.id,title:courseTarget.title,mastery:courseTarget.mastery,
      reason:courseTarget.mastery<.45?"This unit has the largest current durable-mastery gap.":"This is the weakest active course capability that can use another retrieval pass."
    }:null,
    production:productionCandidates?{
      taskId:productionCandidates.task.id,title:productionCandidates.task.title,mode:productionCandidates.task.mode,
      targetMastery:productionCandidates.targetMastery,
      reason:productionCandidates.task.level==="B2"
        ?"This B2 task targets grammar with comparatively weak production evidence."
        :"This task reinforces a production gap before moving further into B2."
    }:null,
    immersion:immersion.canonical?{
      id:immersion.canonical.id,title:immersion.canonical.title,focus:immersion.focus,
      readiness:immersion.canonical.readiness,reason:immersion.canonical.reason
    }:null
  };
}
