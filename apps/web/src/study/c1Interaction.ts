import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import type { StudyEvent } from "@thiepn/domain";
import { coreContent } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

export interface C1InteractionStage {
  id:string;
  title:string;
  prompt:string;
  pressure:string;
  targetSeconds:number;
  moves:string[];
}
export interface C1InteractionScenario {
  id:string;
  title:string;
  domain:string;
  description:string;
  stages:C1InteractionStage[];
}
export interface C1InteractionSummary {
  turns:number;
  scenarios:number;
  spontaneousTurns:number;
  repairedTurns:number;
  latestAt?:string;
}

export const c1InteractionScenarios:C1InteractionScenario[]=[
  {
    id:"research-panel",title:"Defend a finding under challenge",domain:"research",
    description:"Move from a concise claim to clarification, counterevidence, repair and a qualified final position.",
    stages:[
      {id:"opening",title:"Opening position",prompt:"You have 30 seconds to explain what a new study suggests without overstating what it proves.",pressure:"No preparation notes. State result, evidence and one limit.",targetSeconds:30,moves:["evidence ≠ inference","qualification"]},
      {id:"challenge",title:"Unexpected challenge",prompt:"Another researcher says your conclusion confuses correlation and causality. Respond directly.",pressure:"Acknowledge the strongest point before defending your interpretation.",targetSeconds:45,moves:["causal restraint","counterargument"]},
      {id:"new-evidence",title:"New evidence arrives",prompt:"A second dataset partly contradicts the first. Reframe your position so both findings can coexist.",pressure:"Do not simply abandon the original claim; narrow it.",targetSeconds:60,moves:["synthesis","reframing"]},
      {id:"close",title:"Qualified close",prompt:"Give a final recommendation for what should be concluded now and what must be tested next.",pressure:"Separate current implication from future verification.",targetSeconds:45,moves:["implication","accountability"]}
    ]
  },
  {
    id:"public-hearing",title:"Handle a contested public proposal",domain:"public policy",
    description:"Respond to stakeholders without losing precision, register or implementation realism.",
    stages:[
      {id:"opening",title:"State the proposal",prompt:"Present a policy change to a skeptical public audience in formal but accessible Japanese.",pressure:"Give one rationale and one explicit constraint.",targetSeconds:45,moves:["register control","constraint framing"]},
      {id:"objection",title:"Cost objection",prompt:"A participant says the proposal is unfair because costs fall unevenly. Respond.",pressure:"Acknowledge distributional burden and offer a concrete adjustment.",targetSeconds:60,moves:["concession","feasibility"]},
      {id:"misread",title:"Repair a misreading",prompt:"Someone says you are ignoring efficiency. Correct that interpretation without becoming defensive.",pressure:"Narrow the disagreement and preserve common ground.",targetSeconds:45,moves:["repair","counterargument"]},
      {id:"close",title:"Build consensus",prompt:"Summarize a revised compromise and define how its success should be reviewed.",pressure:"Include responsibility, timeline and review criterion.",targetSeconds:60,moves:["consensus","accountability"]}
    ]
  },
  {
    id:"executive-briefing",title:"Brief an executive under interruption",domain:"workplace",
    description:"Maintain structure while priorities change and questions interrupt the planned explanation.",
    stages:[
      {id:"opening",title:"30-second brief",prompt:"Explain the key operational risk and your recommended response.",pressure:"Lead with the decision-relevant point.",targetSeconds:30,moves:["synthesis","register control"]},
      {id:"interrupt",title:"Priority shift",prompt:"The executive interrupts: 'What if speed matters more than transparency this quarter?' Respond immediately.",pressure:"Compare priorities rather than rejecting the premise.",targetSeconds:45,moves:["trade-off","qualification"]},
      {id:"constraint",title:"New constraint",prompt:"You learn that budget and staffing are both lower than expected. Revise the recommendation.",pressure:"Preserve the core goal while changing implementation.",targetSeconds:60,moves:["constraint framing","feasibility"]},
      {id:"close",title:"Decision record",prompt:"Close with the decision, caveat and trigger for reevaluation.",pressure:"Make accountability explicit.",targetSeconds:45,moves:["caveat","accountability"]}
    ]
  },
  {
    id:"media-interview",title:"Answer a difficult media interview",domain:"media",
    description:"Stay accurate and measured when questions invite overstatement or false binaries.",
    stages:[
      {id:"opening",title:"Initial answer",prompt:"A reporter asks whether a controversial measure has 'worked.' Give a precise answer.",pressure:"Avoid yes/no oversimplification.",targetSeconds:35,moves:["qualification","evidence ≠ inference"]},
      {id:"binary",title:"False binary",prompt:"The reporter presses: 'So are you saying the policy failed?' Repair the framing.",pressure:"Reject the binary without evading the question.",targetSeconds:40,moves:["reframing","counterargument"]},
      {id:"headline",title:"Headline pressure",prompt:"You are asked for one sentence that summarizes the evidence fairly.",pressure:"Compress without removing uncertainty.",targetSeconds:25,moves:["synthesis","register control"]},
      {id:"followup",title:"Final follow-up",prompt:"State what new evidence would justify changing your current position.",pressure:"Name a concrete evidential threshold.",targetSeconds:45,moves:["causal restraint","accountability"]}
    ]
  }
];

export async function recordC1SpontaneousTurn(input:{scenarioId:string;stageId:string;response:string;responseTimeMs:number;usedPreparation:boolean;selfRepair:boolean}):Promise<void>{
  const response=input.response.trim();if(!response)throw new Error("C1_SPONTANEOUS_RESPONSE_REQUIRED");
  const scenario=c1InteractionScenarios.find(x=>x.id===input.scenarioId);if(!scenario)throw new Error("UNKNOWN_C1_INTERACTION_SCENARIO");
  const stage=scenario.stages.find(x=>x.id===input.stageId);if(!stage)throw new Error("UNKNOWN_C1_INTERACTION_STAGE");
  await saveStudyEvent({
    id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,occurredAt:new Date().toISOString(),
    activity:"speaking",primaryTarget:{kind:"production_task",id:"p13-"+scenario.id+"-"+stage.id},
    promptFamily:"p13-c1-spontaneous-interaction",responseMode:"speech-transcript",result:"skipped",
    responseTimeMs:Math.max(0,Math.round(input.responseTimeMs)),contextId:"p13-c1-spontaneous",contentVersion:coreContent.version,learnerModelVersion:"p13",
    metadata:{
      p13C1Spontaneous:true,scenarioId:scenario.id,stageId:stage.id,targetSeconds:stage.targetSeconds,
      learnerTranscript:response,usedPreparation:input.usedPreparation,selfRepair:input.selfRepair,
      targetMoves:stage.moves,semanticGrading:false,acousticPronunciationScoring:false,modelFeedbackAppliedToMastery:false
    }
  });
}

export async function getC1InteractionSummary():Promise<C1InteractionSummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const turns=events.filter(e=>e.metadata?.p13C1Spontaneous===true);
  const scenarios=new Set(turns.map(e=>typeof e.metadata?.scenarioId==="string"?e.metadata.scenarioId:"").filter(Boolean));
  const spontaneous=turns.filter(e=>e.metadata?.usedPreparation===false).length;
  const repaired=turns.filter(e=>e.metadata?.selfRepair===true).length;
  const latest=[...turns].sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  return {turns:turns.length,scenarios:scenarios.size,spontaneousTurns:spontaneous,repairedTurns:repaired,...(latest?{latestAt:latest.occurredAt}:{})};
}
