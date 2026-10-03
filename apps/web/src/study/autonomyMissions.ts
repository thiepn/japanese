import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents } from "@thiepn/local-db";
import { productiveTask,readingText } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID } from "./runtime";

export type AutonomyStageKind="reading"|"listening"|"production"|"delayed_transfer";

export interface AutonomyMissionStage {
  id:string;
  kind:AutonomyStageKind;
  title:string;
  instruction:string;
  textId?:string;
  taskId?:string;
}

export interface AutonomyMission {
  id:string;
  title:string;
  description:string;
  domain:string;
  estimatedMinutes:number;
  stages:AutonomyMissionStage[];
}

export interface AutonomyMissionStageProgress extends AutonomyMissionStage {
  complete:boolean;
  evidenceCount:number;
  firstEvidenceAt?:string;
  lastEvidenceAt?:string;
}

export interface AutonomyMissionProgress {
  mission:AutonomyMission;
  stages:AutonomyMissionStageProgress[];
  completedStages:number;
  totalStages:number;
  nextStage:AutonomyMissionStageProgress|null;
  activeDays:number;
  startedAt?:string;
  lastEvidenceAt?:string;
}

const MISSIONS:AutonomyMission[]=[
  {
    id:"p8-mission-ai-adoption",
    title:"Responsible AI adoption at work",
    description:"Build a recommendation from contrasting sources, defend it orally, then revisit the position after a delay.",
    domain:"technology + workplace",
    estimatedMinutes:55,
    stages:[
      textStage("ai-1","reading","Read the responsibility argument","b2-text-technology-balance"),
      textStage("ai-2","listening","Listen for caveats and responsibility","p7-text-ai-work"),
      textStage("ai-3","reading","Add deadline and implementation constraints","p7-text-workplace-decision"),
      taskStage("ai-4","production","Discuss the technology change","b2-production-conversation-01"),
      taskStage("ai-5","production","Write responsible AI guidance","p7-writing-ai"),
      delayedStage("ai-6","Delayed transfer","Reproduce the guidance on another day","p7-writing-ai")
    ]
  },
  {
    id:"p8-mission-evidence",
    title:"From headline to defensible conclusion",
    description:"Verify claims across media and survey evidence, then produce a cautious spoken and written conclusion.",
    domain:"media + evidence",
    estimatedMinutes:60,
    stages:[
      textStage("ev-1","reading","Read an evidence-first report","b2-text-evidence-report"),
      textStage("ev-2","listening","Listen for source-checking decisions","p7-text-media-reliability"),
      textStage("ev-3","reading","Interpret a limited survey","p7-text-survey-interpretation"),
      textStage("ev-4","reading","Synthesize several viewpoints","p7-text-balanced-recommendation"),
      taskStage("ev-5","production","Assess an online claim aloud","p7-production-media"),
      taskStage("ev-6","production","Write a cautious data report","p7-writing-report"),
      delayedStage("ev-7","Delayed transfer","Rebuild the report after a delay","p7-writing-report")
    ]
  },
  {
    id:"p8-mission-community",
    title:"Design a community support plan",
    description:"Combine public-service constraints, education access and disaster preparation into one practical proposal.",
    domain:"community + public policy",
    estimatedMinutes:55,
    stages:[
      textStage("co-1","reading","Read the public-service constraints","p7-text-public-service"),
      textStage("co-2","listening","Listen for education-access trade-offs","p7-text-education-opportunity"),
      textStage("co-3","reading","Add disaster-preparation requirements","p7-text-disaster-preparation"),
      taskStage("co-4","production","Explain the community plan","p7-production-disaster"),
      taskStage("co-5","production","Write the policy recommendation","p7-writing-policy"),
      delayedStage("co-6","Delayed transfer","Re-state the policy on another day","p7-writing-policy")
    ]
  },
  {
    id:"p8-mission-negotiation",
    title:"Negotiate a workable process change",
    description:"Track constraints across workplace documents, clarify disagreement, reach compromise and defend the final plan.",
    domain:"workplace + negotiation",
    estimatedMinutes:50,
    stages:[
      textStage("ng-1","reading","Read the deadline decision","p7-text-workplace-decision"),
      textStage("ng-2","listening","Listen for compromise moves","p7-text-negotiation"),
      textStage("ng-3","reading","Add training and adoption constraints","p7-text-training-change"),
      taskStage("ng-4","production","Reach a compromise aloud","p7-production-negotiation"),
      taskStage("ng-5","production","Write the balanced recommendation","p7-writing-synthesis"),
      delayedStage("ng-6","Delayed transfer","Rebuild the recommendation later","p7-writing-synthesis")
    ]
  },
  {
    id:"p8-mission-environment",
    title:"Choose between competing local options",
    description:"Compare cost, emissions, housing, transport and uncertainty before presenting a balanced recommendation.",
    domain:"environment + everyday policy",
    estimatedMinutes:50,
    stages:[
      textStage("en-1","reading","Read the energy trade-off","p7-text-energy-choice"),
      textStage("en-2","listening","Listen for housing and transport constraints","p7-text-housing-transport"),
      textStage("en-3","reading","Add uncertainty and risk","b2-text-risk-assessment"),
      taskStage("en-4","production","Compare the two energy options","p7-production-energy"),
      taskStage("en-5","production","Write a balanced recommendation","b2-production-writing-01"),
      delayedStage("en-6","Delayed transfer","Reproduce the recommendation later","b2-production-writing-01")
    ]
  },
  {
    id:"p8-mission-counterargument",
    title:"Defend a claim without overstating it",
    description:"Move from disagreement and research evidence to a qualified response that acknowledges limits and counterarguments.",
    domain:"argument + synthesis",
    estimatedMinutes:60,
    stages:[
      textStage("ar-1","listening","Listen to disagreement and repair","b2-text-counterargument"),
      textStage("ar-2","reading","Read a cautious research claim","b2-text-research-claim"),
      textStage("ar-3","reading","Study a balanced synthesis","b2-text-b2-synthesis"),
      textStage("ar-4","reading","Compare a second synthesis model","p7-text-balanced-recommendation"),
      taskStage("ar-5","production","Answer a counterargument","p7-writing-counterargument"),
      taskStage("ar-6","production","Write the final synthesis","p7-writing-synthesis"),
      delayedStage("ar-7","Delayed transfer","Rebuild the synthesis after a delay","p7-writing-synthesis")
    ]
  }
];

export const autonomyMissions=MISSIONS.map(validateMission);

export async function getAutonomyMissionProgress():Promise<AutonomyMissionProgress[]>{
  return buildAutonomyMissionProgress(autonomyMissions,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildAutonomyMissionProgress(missions:readonly AutonomyMission[],events:readonly StudyEvent[]):AutonomyMissionProgress[]{
  return missions.map((mission)=>{
    const stages=mission.stages.map((stage)=>stageProgress(stage,events));
    const relevant=events.filter((event)=>stages.some((stage)=>matchesStage(stage,event)));
    const days=new Set(relevant.map((event)=>event.occurredAt.slice(0,10)));
    const ordered=[...relevant].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    return {
      mission,
      stages,
      completedStages:stages.filter((stage)=>stage.complete).length,
      totalStages:stages.length,
      nextStage:stages.find((stage)=>!stage.complete)??null,
      activeDays:days.size,
      ...(ordered[0]?{startedAt:ordered[0].occurredAt}:{}),
      ...(ordered.at(-1)?{lastEvidenceAt:ordered.at(-1)!.occurredAt}:{})
    };
  });
}

function textStage(id:string,kind:"reading"|"listening",title:string,textId:string):AutonomyMissionStage{
  const text=readingText(textId);
  return {id,kind,title,instruction:(kind==="reading"?"Complete a reading check for ":"Complete a listening check for ")+text.title+".",textId};
}
function taskStage(id:string,kind:"production",title:string,taskId:string):AutonomyMissionStage{
  const task=productiveTask(taskId);
  return {id,kind,title,instruction:(task.mode==="writing"?"Write":"Speak")+" a response for "+task.title+".",taskId};
}
function delayedStage(id:string,title:string,taskId:string):AutonomyMissionStage{
  productiveTask(taskId);
  return {id,kind:"delayed_transfer",title,instruction:"Complete the same production target on at least two different days separated by 20+ hours.",taskId};
}

function stageProgress(stage:AutonomyMissionStage,events:readonly StudyEvent[]):AutonomyMissionStageProgress{
  const relevant=events.filter((event)=>matchesStage(stage,event)).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
  let complete=relevant.length>0;
  if(stage.kind==="delayed_transfer"){
    const graded=relevant.filter((event)=>event.result==="correct"||event.result==="incorrect");
    complete=hasSeparatedEvidence(graded,20*60*60*1000);
  }
  return {
    ...stage,complete,evidenceCount:relevant.length,
    ...(relevant[0]?{firstEvidenceAt:relevant[0].occurredAt}:{}),
    ...(relevant.at(-1)?{lastEvidenceAt:relevant.at(-1)!.occurredAt}:{})
  };
}

function matchesStage(stage:AutonomyMissionStage,event:StudyEvent):boolean{
  if(stage.textId){
    if(event.primaryTarget?.kind!=="text"||event.primaryTarget.id!==stage.textId)return false;
    if(stage.kind==="reading")return event.activity==="reading"&&isGraded(event);
    if(stage.kind==="listening")return event.activity==="listening"&&isGraded(event);
  }
  if(stage.taskId){
    if(event.primaryTarget?.kind!=="production_task"||event.primaryTarget.id!==stage.taskId)return false;
    if(stage.kind==="production")return (event.activity==="writing"||event.activity==="speaking")&&isGraded(event);
    if(stage.kind==="delayed_transfer")return (event.activity==="writing"||event.activity==="speaking")&&isGraded(event);
  }
  return false;
}
function isGraded(event:StudyEvent):boolean{return event.result==="correct"||event.result==="incorrect"||event.result==="partial"||event.result==="revealed";}

function hasSeparatedEvidence(events:readonly StudyEvent[],minimumMs:number):boolean{
  if(events.length<2)return false;
  const times=events.map((event)=>Date.parse(event.occurredAt)).filter(Number.isFinite).sort((a,b)=>a-b);
  return times.length>=2&&times[times.length-1]!-times[0]!>=minimumMs;
}

function validateMission(mission:AutonomyMission):AutonomyMission{
  const ids=new Set<string>();
  for(const stage of mission.stages){
    if(ids.has(stage.id))throw new Error("DUPLICATE_AUTONOMY_STAGE:"+mission.id+":"+stage.id);
    ids.add(stage.id);
    if(stage.textId)readingText(stage.textId);
    if(stage.taskId)productiveTask(stage.taskId);
  }
  return mission;
}
