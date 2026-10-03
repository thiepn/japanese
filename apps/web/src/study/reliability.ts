import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents } from "@thiepn/local-db";
import { coreContent,productiveTasks } from "../coreContent";
import { buildAutonomyMissionProgress,autonomyMissions,type AutonomyMissionProgress } from "./autonomyMissions";
import { DEVELOPMENT_ACCOUNT_ID } from "./runtime";

const TRANSFER_DELAY_MS=20*60*60*1000;

export interface ReliableTaskEvidence {
  taskId:string;
  title:string;
  mode:"writing"|"speaking";
  attempts:number;
  successfulDays:number;
  firstAt:string;
  lastAt:string;
  spanHours:number;
  reliableAcrossSessions:boolean;
}

export interface ChunkTransferEvidence {
  chunkId:string;
  taskIds:string[];
  days:string[];
  demonstrations:number;
}

export interface FeedbackPattern {
  message:string;
  count:number;
  areas:string[];
}

export interface ProductionReliabilitySummary {
  activeDays:number;
  tasksAttempted:number;
  gradedAttempts:number;
  successfulAttempts:number;
  reliableTasks:number;
  delayedRevisions:number;
  transferredChunks:number;
  recurringPatterns:number;
  taskEvidence:ReliableTaskEvidence[];
  chunkTransfer:ChunkTransferEvidence[];
  feedbackPatterns:FeedbackPattern[];
}

export interface PortfolioArtifact {
  eventId:string;
  occurredAt:string;
  taskId:string;
  title:string;
  mode:"writing"|"speaking";
  result:string;
  response:string;
  advisory:boolean;
  revisionOfEventId?:string;
}

export interface B2PortfolioSummary {
  firstEvidenceAt?:string;
  lastEvidenceAt?:string;
  activeDays:number;
  readingTexts:number;
  listeningTexts:number;
  speakingTasks:number;
  writingTasks:number;
  productiveArtifacts:number;
  coachTurns:number;
  delayedRevisions:number;
  missionProgress:AutonomyMissionProgress[];
  reliability:ProductionReliabilitySummary;
  recentArtifacts:PortfolioArtifact[];
}

export async function getProductionReliabilitySummary():Promise<ProductionReliabilitySummary>{
  return buildProductionReliabilitySummary(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildProductionReliabilitySummary(events:readonly StudyEvent[]):ProductionReliabilitySummary{
  const taskById=new Map(productiveTasks.filter((task)=>task.level==="B2").map((task)=>[task.id,task] as const));
  const graded=events.filter((event)=>event.primaryTarget?.kind==="production_task"&&taskById.has(event.primaryTarget.id)&&
    (event.activity==="writing"||event.activity==="speaking")&&isGraded(event));
  const activeDays=new Set(graded.map((event)=>dayKey(event.occurredAt)));
  const byTask=new Map<string,StudyEvent[]>();
  for(const event of graded){
    const id=event.primaryTarget!.id;
    const list=byTask.get(id)??[];list.push(event);byTask.set(id,list);
  }
  const taskEvidence:ReliableTaskEvidence[]=[];
  for(const [taskId,taskEvents] of byTask){
    const task=taskById.get(taskId)!;
    const ordered=[...taskEvents].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    const successful=ordered.filter((event)=>event.result==="correct");
    const successfulDays=new Set(successful.map((event)=>dayKey(event.occurredAt)));
    const firstAt=ordered[0]!.occurredAt,lastAt=ordered.at(-1)!.occurredAt;
    const spanHours=Math.max(0,(Date.parse(lastAt)-Date.parse(firstAt))/3_600_000);
    taskEvidence.push({
      taskId,title:task.title,mode:task.mode,attempts:ordered.length,successfulDays:successfulDays.size,firstAt,lastAt,spanHours,
      reliableAcrossSessions:successfulDays.size>=2&&Date.parse(lastAt)-Date.parse(firstAt)>=TRANSFER_DELAY_MS
    });
  }
  taskEvidence.sort((a,b)=>Number(b.reliableAcrossSessions)-Number(a.reliableAcrossSessions)||b.lastAt.localeCompare(a.lastAt));

  const chunkMap=new Map<string,{tasks:Set<string>;days:Set<string>;count:number}>();
  for(const event of graded.filter((item)=>item.result==="correct")){
    const chunkIds=Array.isArray(event.metadata?.targetChunkIds)?event.metadata!.targetChunkIds.filter((id):id is string=>typeof id==="string"):[];
    for(const chunkId of chunkIds){
      const current=chunkMap.get(chunkId)??{tasks:new Set<string>(),days:new Set<string>(),count:0};
      current.tasks.add(event.primaryTarget!.id);current.days.add(dayKey(event.occurredAt));current.count+=1;chunkMap.set(chunkId,current);
    }
  }
  const chunkTransfer=[...chunkMap.entries()].filter(([,value])=>value.tasks.size>=2&&value.days.size>=2).map(([chunkId,value])=>({
    chunkId,taskIds:[...value.tasks],days:[...value.days].sort(),demonstrations:value.count
  })).sort((a,b)=>b.demonstrations-a.demonstrations||a.chunkId.localeCompare(b.chunkId));

  const coachEvents=events.filter((event)=>String(event.promptFamily??"").startsWith("ai-coach-"));
  const delayedRevisions=coachEvents.filter((event)=>typeof event.metadata?.revisionOfEventId==="string").length;
  const feedbackMap=new Map<string,{count:number;areas:Set<string>}>();
  for(const event of coachEvents){
    const feedback=event.metadata?.feedback;
    if(!feedback||typeof feedback!=="object")continue;
    for(const [area,raw] of Object.entries(feedback as Record<string,unknown>)){
      if(!raw||typeof raw!=="object")continue;
      const items=Array.isArray((raw as Record<string,unknown>).items)?(raw as Record<string,unknown>).items as unknown[]:[];
      for(const item of items){
        if(!item||typeof item!=="object")continue;
        const message=String((item as Record<string,unknown>).message??"").trim();
        if(!message)continue;
        const current=feedbackMap.get(message)??{count:0,areas:new Set<string>()};
        current.count+=1;current.areas.add(area);feedbackMap.set(message,current);
      }
    }
  }
  const feedbackPatterns=[...feedbackMap.entries()].filter(([,value])=>value.count>=2).map(([message,value])=>({
    message,count:value.count,areas:[...value.areas].sort()
  })).sort((a,b)=>b.count-a.count||a.message.localeCompare(b.message));

  return {
    activeDays:activeDays.size,
    tasksAttempted:byTask.size,
    gradedAttempts:graded.length,
    successfulAttempts:graded.filter((event)=>event.result==="correct").length,
    reliableTasks:taskEvidence.filter((item)=>item.reliableAcrossSessions).length,
    delayedRevisions,
    transferredChunks:chunkTransfer.length,
    recurringPatterns:feedbackPatterns.length,
    taskEvidence,
    chunkTransfer,
    feedbackPatterns
  };
}

export async function getB2PortfolioSummary():Promise<B2PortfolioSummary>{
  return buildB2PortfolioSummary(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildB2PortfolioSummary(events:readonly StudyEvent[]):B2PortfolioSummary{
  const b2TaskById=new Map(productiveTasks.filter((task)=>task.level==="B2").map((task)=>[task.id,task] as const));
  const b2TextIds=new Set(coreContent.readingTexts.filter((text)=>text.level==="B2").map((text)=>text.id));
  const reading=new Set(events.filter((event)=>event.primaryTarget?.kind==="text"&&b2TextIds.has(event.primaryTarget.id)&&event.activity==="reading"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const listening=new Set(events.filter((event)=>event.primaryTarget?.kind==="text"&&b2TextIds.has(event.primaryTarget.id)&&event.activity==="listening"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const speaking=new Set(events.filter((event)=>event.primaryTarget?.kind==="production_task"&&b2TaskById.has(event.primaryTarget.id)&&event.activity==="speaking"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const writing=new Set(events.filter((event)=>event.primaryTarget?.kind==="production_task"&&b2TaskById.has(event.primaryTarget.id)&&event.activity==="writing"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const reliability=buildProductionReliabilitySummary(events);
  const missionProgress=buildAutonomyMissionProgress(autonomyMissions,events);

  const artifacts:PortfolioArtifact[]=[];
  for(const event of events){
    if(event.primaryTarget?.kind!=="production_task"||!b2TaskById.has(event.primaryTarget.id))continue;
    const task=b2TaskById.get(event.primaryTarget.id)!;
    const response=typeof event.metadata?.learnerResponse==="string"?event.metadata.learnerResponse:
      typeof event.metadata?.learnerText==="string"?event.metadata.learnerText:"";
    if(!response.trim())continue;
    artifacts.push({
      eventId:event.id,occurredAt:event.occurredAt,taskId:task.id,title:task.title,mode:task.mode,
      result:event.result??"skipped",response,advisory:String(event.promptFamily??"").startsWith("ai-coach-"),
      ...(typeof event.metadata?.revisionOfEventId==="string"?{revisionOfEventId:event.metadata.revisionOfEventId}:{})
    });
  }
  artifacts.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));

  const b2Evidence=events.filter((event)=>{
    if(event.primaryTarget?.kind==="production_task")return b2TaskById.has(event.primaryTarget.id);
    if(event.primaryTarget?.kind==="text")return b2TextIds.has(event.primaryTarget.id);
    if(event.primaryTarget?.kind==="lexical_chunk")return true;
    return false;
  }).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
  const activeDays=new Set(b2Evidence.map((event)=>dayKey(event.occurredAt)));

  return {
    ...(b2Evidence[0]?{firstEvidenceAt:b2Evidence[0].occurredAt}:{}),
    ...(b2Evidence.at(-1)?{lastEvidenceAt:b2Evidence.at(-1)!.occurredAt}:{}),
    activeDays:activeDays.size,
    readingTexts:reading.size,listeningTexts:listening.size,speakingTasks:speaking.size,writingTasks:writing.size,
    productiveArtifacts:artifacts.length,
    coachTurns:events.filter((event)=>String(event.promptFamily??"").startsWith("ai-coach-")).length,
    delayedRevisions:reliability.delayedRevisions,
    missionProgress,reliability,recentArtifacts:artifacts.slice(0,12)
  };
}

function isGraded(event:StudyEvent):boolean{
  return event.result==="correct"||event.result==="incorrect"||event.result==="partial"||event.result==="revealed";
}
function dayKey(value:string):string{return value.slice(0,10);}
