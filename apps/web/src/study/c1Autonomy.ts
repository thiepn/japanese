import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { coreContent,productiveTask,readingText } from "../coreContent";
import { c1NativeSourceSet } from "./c1NativeDepth";
import { c1SynthesisPack } from "./c1Synthesis";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";
import { scenarioChain } from "../ai/scenarioChains";

const TRANSFER_DELAY_MS=20*60*60*1000;

export type C1AutonomyStageKind=
  |"reading"
  |"native_synthesis"
  |"multi_source_synthesis"
  |"spontaneous_interaction"
  |"production"
  |"delayed_transfer"
  |"reflection";

export interface C1AutonomyStage {
  id:string;
  kind:C1AutonomyStageKind;
  title:string;
  instruction:string;
  textId?:string;
  nativeSetId?:string;
  synthesisPackId?:string;
  scenarioChainId?:string;
  taskId?:string;
}

export interface C1AutonomyMission {
  id:string;
  title:string;
  domain:string;
  description:string;
  estimatedMinutes:number;
  stages:C1AutonomyStage[];
}

export interface C1AutonomyStageProgress extends C1AutonomyStage {
  complete:boolean;
  evidenceCount:number;
  firstEvidenceAt?:string;
  lastEvidenceAt?:string;
  detail?:string;
}

export interface C1AutonomyMissionProgress {
  mission:C1AutonomyMission;
  stages:C1AutonomyStageProgress[];
  completedStages:number;
  totalStages:number;
  activeDays:number;
  startedAt?:string;
  lastEvidenceAt?:string;
  nextStage:C1AutonomyStageProgress|null;
  completionRatio:number;
}

export type C1DomainStatus="not_started"|"exploring"|"developing"|"sustained";

export interface C1DomainProfile {
  missionId:string;
  domain:string;
  title:string;
  status:C1DomainStatus;
  completionRatio:number;
  completedStages:number;
  totalStages:number;
  activeDays:number;
  evidenceCount:number;
  nextStage:C1AutonomyStageProgress|null;
}

const MISSIONS:C1AutonomyMission[]=[
  {
    id:"p14-research-evidence",
    title:"Research evidence under uncertainty",
    domain:"research + evidence",
    description:"Move from two C1 source texts through native listening, cross-source synthesis, spontaneous challenge and delayed causal analysis.",
    estimatedMinutes:105,
    stages:[
      readingStage("re-1","Read the causality argument","p12-text-causality"),
      readingStage("re-2","Read the policy-evidence argument","p12-text-policy-evidence"),
      nativeStage("re-3","Compare policy continuity in native speech","p13-native-policy-continuity"),
      synthesisStage("re-4","Synthesize evidence and causality","p13-synthesis-evidence-causality"),
      interactionStage("re-5","Defend a research conclusion under challenge","c1-research-defense"),
      productionStage("re-6","Write a cautious causal analysis","p12-writing-causal-analysis"),
      delayedStage("re-7","Rebuild the causal analysis after a delay","p12-writing-causal-analysis"),
      reflectionStage("re-8","Domain reflection","Explain what changed in your reasoning after source conflict, challenge and delayed reconstruction.")
    ]
  },
  {
    id:"p14-governance-policy",
    title:"Governance, trust and public policy",
    domain:"governance + public policy",
    description:"Integrate institutional transparency, local constraints, public communication and policy defense across several sessions.",
    estimatedMinutes:110,
    stages:[
      readingStage("go-1","Read the transparency argument","p12-text-transparency"),
      readingStage("go-2","Read the urban-resilience trade-off","p12-text-urban-resilience"),
      nativeStage("go-3","Synthesize public communication across speakers","p13-native-public-communication"),
      synthesisStage("go-4","Build a local-policy synthesis","p13-synthesis-local-policy"),
      interactionStage("go-5","Defend a policy recommendation under pressure","c1-policy-briefing"),
      productionStage("go-6","Write an institutional policy memo","p12-writing-policy-memo"),
      delayedStage("go-7","Rewrite the policy memo after a delay","p12-writing-policy-memo"),
      reflectionStage("go-8","Domain reflection","State which implementation constraint most changed the final recommendation and why.")
    ]
  },
  {
    id:"p14-technology-accountability",
    title:"Technology, judgment and accountability",
    domain:"technology + institutions",
    description:"Connect automation, public accountability, native register awareness and institutional negotiation into one sustained recommendation.",
    estimatedMinutes:105,
    stages:[
      readingStage("te-1","Read automation and professional judgment","p12-text-ai-judgment"),
      readingStage("te-2","Read institutional transparency","p12-text-transparency"),
      nativeStage("te-3","Compare prepared and press registers","p13-native-register-shift"),
      synthesisStage("te-4","Synthesize automation and accountability","p13-synthesis-automation-accountability"),
      interactionStage("te-5","Negotiate institutional constraints","c1-institutional-negotiation"),
      productionStage("te-6","Write an integrated recommendation","p12-writing-integrated-recommendation"),
      delayedStage("te-7","Rebuild the recommendation after a delay","p12-writing-integrated-recommendation"),
      reflectionStage("te-8","Domain reflection","Describe where automation changes responsibility and where it does not.")
    ]
  },
  {
    id:"p14-media-argument",
    title:"Media, rhetoric and public argument",
    domain:"media + public argument",
    description:"Track rhetorical pressure, causal claims and counterargument across reading, native press material, synthesis and interview-style challenge.",
    estimatedMinutes:100,
    stages:[
      readingStage("me-1","Read the editorial disagreement","p12-text-editorial-argument"),
      readingStage("me-2","Read the causality analysis","p12-text-causality"),
      nativeStage("me-3","Handle press-conference listening pressure","p13-native-press-pressure"),
      synthesisStage("me-4","Synthesize public argument without false certainty","p13-synthesis-public-argument"),
      interactionStage("me-5","Respond to a demanding public interview","c1-public-interview"),
      productionStage("me-6","Write a precise editorial response","p12-writing-editorial"),
      delayedStage("me-7","Rewrite the editorial response after a delay","p12-writing-editorial"),
      reflectionStage("me-8","Domain reflection","Identify one rhetorical move that sounded persuasive but required weaker evidential wording.")
    ]
  },
  {
    id:"p14-cross-domain-transfer",
    title:"Cross-domain transfer and framework limits",
    domain:"cross-domain transfer",
    description:"Test whether one analytical framework survives transfer across education, climate, public argument and a hidden-future interaction.",
    estimatedMinutes:115,
    stages:[
      readingStage("tr-1","Read education reform and local autonomy","p12-text-education-autonomy"),
      readingStage("tr-2","Read climate-transition trade-offs","p12-text-climate-transition"),
      nativeStage("tr-3","Compare formal policy priorities over time","p13-native-policy-continuity"),
      synthesisStage("tr-4","Transfer one framework across domains","p13-synthesis-perspective-transfer"),
      interactionStage("tr-5","Defend a framework after the domain changes","c1-cross-domain-transfer"),
      productionStage("tr-6","Write a critical response to an expert claim","p12-writing-critical-response"),
      delayedStage("tr-7","Reconstruct the response on another day","p12-writing-critical-response"),
      reflectionStage("tr-8","Domain reflection","Explain which part of the framework transferred well and which assumption failed.")
    ]
  }
];

export const c1AutonomyMissions=MISSIONS.map(validateMission);

export async function getC1AutonomyMissionProgress():Promise<C1AutonomyMissionProgress[]>{
  return buildC1AutonomyMissionProgress(c1AutonomyMissions,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildC1AutonomyMissionProgress(missions:readonly C1AutonomyMission[],events:readonly StudyEvent[]):C1AutonomyMissionProgress[]{
  return missions.map((mission)=>{
    const stages=mission.stages.map((stage)=>stageProgress(mission,stage,events));
    const relevant=events.filter((event)=>stages.some((stage)=>matchesStage(mission,stage,event)));
    const ordered=[...relevant].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    const activeDays=new Set(relevant.map((event)=>event.occurredAt.slice(0,10))).size;
    const completedStages=stages.filter((stage)=>stage.complete).length;
    return {
      mission,stages,completedStages,totalStages:stages.length,activeDays,
      completionRatio:stages.length?completedStages/stages.length:0,
      nextStage:stages.find((stage)=>!stage.complete)??null,
      ...(ordered[0]?{startedAt:ordered[0].occurredAt}:{}),
      ...(ordered.at(-1)?{lastEvidenceAt:ordered.at(-1)!.occurredAt}:{})
    };
  });
}

export async function getC1DomainProfiles():Promise<C1DomainProfile[]>{
  const [events,progress]=await Promise.all([listStudyEvents(DEVELOPMENT_ACCOUNT_ID),getC1AutonomyMissionProgress()]);
  return buildC1DomainProfiles(progress,events);
}

export function buildC1DomainProfiles(progress:readonly C1AutonomyMissionProgress[],events:readonly StudyEvent[]):C1DomainProfile[]{
  return progress.map((entry)=>{
    const relevant=events.filter((event)=>entry.stages.some((stage)=>matchesStage(entry.mission,stage,event)));
    const status:C1DomainStatus=entry.completedStages===entry.totalStages&&entry.activeDays>=2?"sustained":
      entry.completedStages>=4&&entry.activeDays>=2?"developing":
      entry.completedStages>0?"exploring":"not_started";
    return {
      missionId:entry.mission.id,domain:entry.mission.domain,title:entry.mission.title,status,
      completionRatio:entry.completionRatio,completedStages:entry.completedStages,totalStages:entry.totalStages,
      activeDays:entry.activeDays,evidenceCount:relevant.length,nextStage:entry.nextStage
    };
  });
}

export async function recordC1MissionReflection(input:{missionId:string;reflection:string}):Promise<void>{
  const mission=c1AutonomyMissions.find((item)=>item.id===input.missionId);
  if(!mission)throw new Error("UNKNOWN_P14_C1_MISSION:"+input.missionId);
  const reflection=input.reflection.trim();
  if(reflection.length<80)throw new Error("P14_REFLECTION_TOO_SHORT");
  await saveStudyEvent({
    id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,occurredAt:new Date().toISOString(),
    activity:"writing",promptFamily:"p14-c1-autonomy-reflection",responseMode:"textarea",result:"skipped",
    contextId:mission.id,contentVersion:coreContent.version,learnerModelVersion:"p14",
    metadata:{
      p14C1Autonomy:true,missionId:mission.id,domain:mission.domain,learnerReflection:reflection,
      semanticGrading:false,modelFeedbackAppliedToMastery:false,accreditedCefrVerdict:false
    }
  });
}

function readingStage(id:string,title:string,textId:string):C1AutonomyStage{
  readingText(textId);return {id,kind:"reading",title,instruction:"Complete a reading check for "+readingText(textId).title+".",textId};
}
function nativeStage(id:string,title:string,nativeSetId:string):C1AutonomyStage{
  c1NativeSourceSet(nativeSetId);return {id,kind:"native_synthesis",title,instruction:"Complete the native-source set and save a cross-source synthesis.",nativeSetId};
}
function synthesisStage(id:string,title:string,synthesisPackId:string):C1AutonomyStage{
  c1SynthesisPack(synthesisPackId);return {id,kind:"multi_source_synthesis",title,instruction:"Complete the multi-source synthesis pack.",synthesisPackId};
}
function interactionStage(id:string,title:string,scenarioChainId:string):C1AutonomyStage{
  const chain=scenarioChain(scenarioChainId);if(chain.level!=="C1")throw new Error("P14_INTERACTION_NOT_C1:"+scenarioChainId);
  return {id,kind:"spontaneous_interaction",title,instruction:"Complete all hidden stages of "+chain.title+".",scenarioChainId};
}
function productionStage(id:string,title:string,taskId:string):C1AutonomyStage{
  const task=productiveTask(taskId);if(task.level!=="C1")throw new Error("P14_PRODUCTION_NOT_C1:"+taskId);
  return {id,kind:"production",title,instruction:(task.mode==="writing"?"Write ":"Speak ")+task.title+".",taskId};
}
function delayedStage(id:string,title:string,taskId:string):C1AutonomyStage{
  const task=productiveTask(taskId);if(task.level!=="C1")throw new Error("P14_DELAYED_TASK_NOT_C1:"+taskId);
  return {id,kind:"delayed_transfer",title,instruction:"Repeat "+task.title+" successfully on another day at least 20 hours after the first successful attempt.",taskId};
}
function reflectionStage(id:string,title:string,instruction:string):C1AutonomyStage{
  return {id,kind:"reflection",title,instruction};
}

function stageProgress(mission:C1AutonomyMission,stage:C1AutonomyStage,events:readonly StudyEvent[]):C1AutonomyStageProgress{
  const relevant=events.filter((event)=>matchesStage(mission,stage,event)).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
  let complete=false;let detail:string|undefined;
  if(stage.kind==="spontaneous_interaction"){
    const stages=new Set(relevant.map((event)=>typeof event.metadata?.scenarioStageId==="string"?event.metadata.scenarioStageId:"").filter(Boolean));
    const required=scenarioChain(stage.scenarioChainId!).stages.length;
    complete=stages.size>=required;detail=stages.size+"/"+required+" hidden interaction stages";
  }else if(stage.kind==="delayed_transfer"){
    const successful=relevant.filter((event)=>event.result==="correct");
    complete=hasSeparatedEvidence(successful,TRANSFER_DELAY_MS);
    const days=new Set(successful.map((event)=>event.occurredAt.slice(0,10))).size;
    detail=days+" successful day"+(days===1?"":"s");
  }else if(stage.kind==="reflection"){
    complete=relevant.length>0;detail=relevant.length?String((relevant.at(-1)!.metadata?.learnerReflection as string|undefined)?.length??0)+" characters":"reflection required";
  }else if(stage.kind==="multi_source_synthesis"){
    complete=relevant.some((event)=>event.result==="correct");detail=relevant.length+" structural attempt"+(relevant.length===1?"":"s");
  }else{
    complete=relevant.length>0;
  }
  return {
    ...stage,complete,evidenceCount:relevant.length,
    ...(detail?{detail}:{}),
    ...(relevant[0]?{firstEvidenceAt:relevant[0].occurredAt}:{}),
    ...(relevant.at(-1)?{lastEvidenceAt:relevant.at(-1)!.occurredAt}:{})
  };
}

function matchesStage(mission:C1AutonomyMission,stage:C1AutonomyStage,event:StudyEvent):boolean{
  switch(stage.kind){
    case "reading":
      return event.primaryTarget?.kind==="text"&&event.primaryTarget.id===stage.textId&&event.activity==="reading"&&isGraded(event);
    case "native_synthesis":
      return event.metadata?.p13C1NativeSynthesis===true&&event.metadata?.nativeSetId===stage.nativeSetId;
    case "multi_source_synthesis":
      return event.metadata?.p13MultiSourceSynthesis===true&&event.metadata?.synthesisPackId===stage.synthesisPackId;
    case "spontaneous_interaction":
      return event.metadata?.p13C1SpontaneousInteraction===true&&event.metadata?.scenarioChainId===stage.scenarioChainId;
    case "production":
    case "delayed_transfer":
      return event.primaryTarget?.kind==="production_task"&&event.primaryTarget.id===stage.taskId&&
        (event.activity==="writing"||event.activity==="speaking")&&isGraded(event);
    case "reflection":
      return event.promptFamily==="p14-c1-autonomy-reflection"&&event.metadata?.missionId===mission.id;
  }
}

function hasSeparatedEvidence(events:readonly StudyEvent[],minimumMs:number):boolean{
  if(events.length<2)return false;
  const times=events.map((event)=>Date.parse(event.occurredAt)).filter(Number.isFinite).sort((a,b)=>a-b);
  return times.length>=2&&times[times.length-1]!-times[0]!>=minimumMs&&
    new Set(events.map((event)=>event.occurredAt.slice(0,10))).size>=2;
}
function isGraded(event:StudyEvent):boolean{
  return event.result==="correct"||event.result==="partial"||event.result==="incorrect"||event.result==="revealed";
}
function validateMission(mission:C1AutonomyMission):C1AutonomyMission{
  const ids=new Set<string>();
  for(const stage of mission.stages){
    if(ids.has(stage.id))throw new Error("DUPLICATE_P14_STAGE:"+mission.id+":"+stage.id);
    ids.add(stage.id);
  }
  if(mission.stages.filter((stage)=>stage.kind==="delayed_transfer").length!==1)throw new Error("P14_MISSION_REQUIRES_ONE_DELAYED_TRANSFER:"+mission.id);
  if(mission.stages.at(-1)?.kind!=="reflection")throw new Error("P14_MISSION_REFLECTION_MUST_BE_LAST:"+mission.id);
  return mission;
}
