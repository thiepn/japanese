import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents } from "@thiepn/local-db";
import { coreContent,productiveTasks } from "../coreContent";
import { scenarioChain } from "../ai/scenarioChains";
import { c1SynthesisPack,c1SynthesisPacks } from "./c1Synthesis";
import {
  buildC1AutonomyMissionProgress,buildC1DomainProfiles,c1AutonomyMissions,
  type C1AutonomyMissionProgress,type C1DomainProfile
} from "./c1Autonomy";
import { DEVELOPMENT_ACCOUNT_ID } from "./runtime";

const TRANSFER_DELAY_MS=20*60*60*1000;

export type C1ReliabilityKind="canonical_task"|"multi_source_synthesis";

export interface C1ReliableArtifactEvidence {
  id:string;
  kind:C1ReliabilityKind;
  title:string;
  mode:"writing"|"speaking";
  attempts:number;
  successfulAttempts:number;
  successfulDays:number;
  firstAt:string;
  lastAt:string;
  spanHours:number;
  reliableAcrossSessions:boolean;
}

export interface C1InteractionReliability {
  chainId:string;
  title:string;
  turns:number;
  stagesCovered:number;
  totalStages:number;
  activeDays:number;
  firstAt:string;
  lastAt:string;
  spanHours:number;
  reliableAcrossSessions:boolean;
}

export interface C1ProductionReliabilitySummary {
  activeDays:number;
  gradedAttempts:number;
  successfulAttempts:number;
  reliableArtifacts:number;
  interactionTurns:number;
  reliableInteractions:number;
  delayedRevisions:number;
  artifactEvidence:C1ReliableArtifactEvidence[];
  interactionEvidence:C1InteractionReliability[];
}

export interface C1PortfolioArtifact {
  eventId:string;
  occurredAt:string;
  title:string;
  kind:"production"|"synthesis"|"coach";
  mode:"writing"|"speaking";
  response:string;
  result:string;
  advisory:boolean;
}

export interface C1PortfolioSummary {
  firstEvidenceAt?:string;
  lastEvidenceAt?:string;
  activeDays:number;
  readingTexts:number;
  listeningTexts:number;
  speakingTasks:number;
  writingTasks:number;
  synthesisPacks:number;
  nativeSourceSyntheses:number;
  spontaneousCoachTurns:number;
  autonomyMissionsCompleted:number;
  autonomyMissions:C1AutonomyMissionProgress[];
  domains:C1DomainProfile[];
  reliability:C1ProductionReliabilitySummary;
  recentArtifacts:C1PortfolioArtifact[];
}

export async function getC1ProductionReliabilitySummary():Promise<C1ProductionReliabilitySummary>{
  return buildC1ProductionReliabilitySummary(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildC1ProductionReliabilitySummary(events:readonly StudyEvent[]):C1ProductionReliabilitySummary{
  const c1TaskById=new Map(productiveTasks.filter((task)=>task.level==="C1").map((task)=>[task.id,task] as const));
  const canonical=events.filter((event)=>event.primaryTarget?.kind==="production_task"&&c1TaskById.has(event.primaryTarget.id)&&
    (event.activity==="writing"||event.activity==="speaking")&&isGraded(event));
  const synthesis=events.filter((event)=>event.metadata?.p13MultiSourceSynthesis===true&&
    typeof event.metadata?.synthesisPackId==="string"&&isGraded(event));
  const allGraded=[...canonical,...synthesis];
  const grouped=new Map<string,{kind:C1ReliabilityKind;mode:"writing"|"speaking";title:string;events:StudyEvent[]}>();

  for(const event of canonical){
    const task=c1TaskById.get(event.primaryTarget!.id)!;
    const key="task:"+task.id;
    const current=grouped.get(key)??{kind:"canonical_task" as const,mode:task.mode,title:task.title,events:[]};
    current.events.push(event);grouped.set(key,current);
  }
  for(const event of synthesis){
    const packId=String(event.metadata!.synthesisPackId);
    const pack=c1SynthesisPack(packId);
    const key="synthesis:"+pack.id;
    const current=grouped.get(key)??{kind:"multi_source_synthesis" as const,mode:pack.mode,title:pack.title,events:[]};
    current.events.push(event);grouped.set(key,current);
  }

  const artifactEvidence:C1ReliableArtifactEvidence[]=[...grouped.entries()].map(([key,value])=>{
    const ordered=[...value.events].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    const successful=ordered.filter((event)=>event.result==="correct");
    const successfulDays=new Set(successful.map((event)=>dayKey(event.occurredAt))).size;
    const firstAt=ordered[0]!.occurredAt,lastAt=ordered.at(-1)!.occurredAt;
    const spanHours=Math.max(0,(Date.parse(lastAt)-Date.parse(firstAt))/3_600_000);
    return {
      id:key,kind:value.kind,title:value.title,mode:value.mode,attempts:ordered.length,successfulAttempts:successful.length,
      successfulDays,firstAt,lastAt,spanHours,
      reliableAcrossSessions:successfulDays>=2&&Date.parse(lastAt)-Date.parse(firstAt)>=TRANSFER_DELAY_MS
    };
  }).sort((a,b)=>Number(b.reliableAcrossSessions)-Number(a.reliableAcrossSessions)||b.lastAt.localeCompare(a.lastAt));

  const c1Coach=events.filter((event)=>event.metadata?.p13C1SpontaneousInteraction===true&&typeof event.metadata?.scenarioChainId==="string");
  const coachByChain=new Map<string,StudyEvent[]>();
  for(const event of c1Coach){
    const id=String(event.metadata!.scenarioChainId);
    const list=coachByChain.get(id)??[];list.push(event);coachByChain.set(id,list);
  }
  const interactionEvidence:C1InteractionReliability[]=[...coachByChain.entries()].map(([chainId,chainEvents])=>{
    const chain=scenarioChain(chainId);
    const ordered=[...chainEvents].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    const stageIds=new Set(ordered.map((event)=>typeof event.metadata?.scenarioStageId==="string"?event.metadata.scenarioStageId:"").filter(Boolean));
    const activeDays=new Set(ordered.map((event)=>dayKey(event.occurredAt))).size;
    const firstAt=ordered[0]!.occurredAt,lastAt=ordered.at(-1)!.occurredAt;
    const spanHours=Math.max(0,(Date.parse(lastAt)-Date.parse(firstAt))/3_600_000);
    return {
      chainId,title:chain.title,turns:ordered.length,stagesCovered:stageIds.size,totalStages:chain.stages.length,activeDays,
      firstAt,lastAt,spanHours,reliableAcrossSessions:activeDays>=2&&spanHours>=20&&stageIds.size>=Math.min(4,chain.stages.length)
    };
  }).sort((a,b)=>Number(b.reliableAcrossSessions)-Number(a.reliableAcrossSessions)||b.lastAt.localeCompare(a.lastAt));

  const c1CoachEvents=events.filter((event)=>String(event.promptFamily??"").startsWith("ai-coach-")&&event.metadata?.targetLevel==="C1");
  const delayedRevisions=c1CoachEvents.filter((event)=>typeof event.metadata?.revisionOfEventId==="string").length;
  return {
    activeDays:new Set([...allGraded,...c1Coach].map((event)=>dayKey(event.occurredAt))).size,
    gradedAttempts:allGraded.length,
    successfulAttempts:allGraded.filter((event)=>event.result==="correct").length,
    reliableArtifacts:artifactEvidence.filter((item)=>item.reliableAcrossSessions).length,
    interactionTurns:c1Coach.length,
    reliableInteractions:interactionEvidence.filter((item)=>item.reliableAcrossSessions).length,
    delayedRevisions,artifactEvidence,interactionEvidence
  };
}

export async function getC1PortfolioSummary():Promise<C1PortfolioSummary>{
  return buildC1PortfolioSummary(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildC1PortfolioSummary(events:readonly StudyEvent[]):C1PortfolioSummary{
  const c1TextIds=new Set(coreContent.readingTexts.filter((text)=>text.level==="C1").map((text)=>text.id));
  const c1TaskById=new Map(productiveTasks.filter((task)=>task.level==="C1").map((task)=>[task.id,task] as const));
  const reading=new Set(events.filter((event)=>event.primaryTarget?.kind==="text"&&c1TextIds.has(event.primaryTarget.id)&&event.activity==="reading"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const listening=new Set(events.filter((event)=>event.primaryTarget?.kind==="text"&&c1TextIds.has(event.primaryTarget.id)&&event.activity==="listening"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const speaking=new Set(events.filter((event)=>event.primaryTarget?.kind==="production_task"&&c1TaskById.has(event.primaryTarget.id)&&event.activity==="speaking"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const writing=new Set(events.filter((event)=>event.primaryTarget?.kind==="production_task"&&c1TaskById.has(event.primaryTarget.id)&&event.activity==="writing"&&isGraded(event)).map((event)=>event.primaryTarget!.id));
  const syntheses=events.filter((event)=>event.metadata?.p13MultiSourceSynthesis===true&&typeof event.metadata?.synthesisPackId==="string");
  const nativeSyntheses=events.filter((event)=>event.metadata?.p13C1NativeSynthesis===true);
  const coach=events.filter((event)=>event.metadata?.p13C1SpontaneousInteraction===true);
  const reliability=buildC1ProductionReliabilitySummary(events);
  const missions=buildC1AutonomyMissionProgress(c1AutonomyMissions,events);
  const domains=buildC1DomainProfiles(missions,events);

  const artifacts:C1PortfolioArtifact[]=[];
  for(const event of events){
    if(event.primaryTarget?.kind==="production_task"&&c1TaskById.has(event.primaryTarget.id)){
      const task=c1TaskById.get(event.primaryTarget.id)!;
      const response=responseText(event);if(!response)continue;
      artifacts.push({eventId:event.id,occurredAt:event.occurredAt,title:task.title,kind:"production",mode:task.mode,response,result:event.result??"skipped",advisory:false});
      continue;
    }
    if(event.metadata?.p13MultiSourceSynthesis===true&&typeof event.metadata?.synthesisPackId==="string"){
      const pack=c1SynthesisPacks.find((item)=>item.id===event.metadata!.synthesisPackId);
      const response=responseText(event);if(!pack||!response)continue;
      artifacts.push({eventId:event.id,occurredAt:event.occurredAt,title:pack.title,kind:"synthesis",mode:pack.mode,response,result:event.result??"skipped",advisory:false});
      continue;
    }
    if(event.metadata?.p13C1SpontaneousInteraction===true){
      const response=responseText(event);if(!response)continue;
      const chainId=typeof event.metadata?.scenarioChainId==="string"?event.metadata.scenarioChainId:"";
      const chain=chainId?scenarioChain(chainId):null;
      artifacts.push({eventId:event.id,occurredAt:event.occurredAt,title:chain?.title??"C1 spontaneous interaction",kind:"coach",mode:"speaking",response,result:event.result??"skipped",advisory:true});
    }
  }
  artifacts.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));

  const evidence=events.filter((event)=>{
    if(event.primaryTarget?.kind==="text"&&c1TextIds.has(event.primaryTarget.id))return true;
    if(event.primaryTarget?.kind==="production_task"&&c1TaskById.has(event.primaryTarget.id))return true;
    return event.metadata?.p13MultiSourceSynthesis===true||event.metadata?.p13C1NativeSynthesis===true||
      event.metadata?.p13C1SpontaneousInteraction===true||event.metadata?.p14C1Autonomy===true;
  }).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
  return {
    ...(evidence[0]?{firstEvidenceAt:evidence[0].occurredAt}:{}),
    ...(evidence.at(-1)?{lastEvidenceAt:evidence.at(-1)!.occurredAt}:{}),
    activeDays:new Set(evidence.map((event)=>dayKey(event.occurredAt))).size,
    readingTexts:reading.size,listeningTexts:listening.size,speakingTasks:speaking.size,writingTasks:writing.size,
    synthesisPacks:new Set(syntheses.map((event)=>String(event.metadata!.synthesisPackId))).size,
    nativeSourceSyntheses:nativeSyntheses.length,spontaneousCoachTurns:coach.length,
    autonomyMissionsCompleted:missions.filter((entry)=>entry.completedStages===entry.totalStages).length,
    autonomyMissions:missions,domains,reliability,recentArtifacts:artifacts.slice(0,16)
  };
}

function responseText(event:StudyEvent):string{
  const values=[event.metadata?.learnerResponse,event.metadata?.learnerText,event.metadata?.learnerSynthesis,event.metadata?.learnerReflection];
  return (values.find((value)=>typeof value==="string"&&value.trim()) as string|undefined) ?? "";
}
function isGraded(event:StudyEvent):boolean{
  return event.result==="correct"||event.result==="partial"||event.result==="incorrect"||event.result==="revealed";
}
function dayKey(value:string):string{return value.slice(0,10);}
