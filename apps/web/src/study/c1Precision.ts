import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { getC1EnvironmentProgress,type C1RegisteredSource } from "./c1Environment";
import { getC1ResearchQualityProgress,type C1ProjectHumanReview,type C1SpecialistTrack } from "./c1ResearchQuality";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

const RELIABILITY_DELAY_MS=20*60*60*1000;

export type C1PrecisionMode=
  |"compression"
  |"expansion"
  |"register_shift"
  |"stance_calibration"
  |"lexical_precision"
  |"cohesion_restructure"
  |"counterargument_integration"
  |"audience_translation";

export interface C1PrecisionChallenge {
  id:string;
  mode:C1PrecisionMode;
  title:string;
  target:string;
  brief:string;
  requirements:string[];
}

export const c1PrecisionChallenges:C1PrecisionChallenge[]=[
  {
    id:"p17-compression",mode:"compression",title:"Compress without flattening the argument",target:"executive / decision brief",
    brief:"Reduce a developed Japanese argument to roughly half its length while preserving the conclusion, strongest evidence and most important limitation.",
    requirements:["結論を残す","最強の根拠を残す","最大の留保を残す","背景説明を削る"]
  },
  {
    id:"p17-expansion",mode:"expansion",title:"Expand mechanism and assumptions",target:"specialist explanation",
    brief:"Take a concise claim and expand it for an expert reader by making mechanism, assumptions, scope and unresolved uncertainty explicit.",
    requirements:["因果メカニズムを示す","前提を明示する","適用範囲を限定する","未解決点を残す"]
  },
  {
    id:"p17-register",mode:"register_shift",title:"Shift register without changing substance",target:"formal institutional Japanese",
    brief:"Rewrite the same position for a formal institutional audience. Change diction, sentence architecture and responsibility framing without changing the core claim.",
    requirements:["文体を統一する","責任主体を明確にする","断定度を維持する","内容を増減しすぎない"]
  },
  {
    id:"p17-stance",mode:"stance_calibration",title:"Calibrate certainty precisely",target:"evidence-sensitive argument",
    brief:"Rewrite an overconfident or vague claim so the strength of the Japanese matches the actual evidence. Make certainty, probability and limitation linguistically explicit.",
    requirements:["断定を根拠に合わせる","推測と観測を分ける","留保を具体化する","曖昧な逃げ表現を避ける"]
  },
  {
    id:"p17-lexical",mode:"lexical_precision",title:"Replace broad words with exact distinctions",target:"lexical precision",
    brief:"Identify broad or overloaded words and rewrite the passage using distinctions that make actor, process, degree, causality and evaluation more exact.",
    requirements:["広すぎる語を特定する","近義語の差を使う","主体と作用を明確にする","同義反復を減らす"]
  },
  {
    id:"p17-cohesion",mode:"cohesion_restructure",title:"Rebuild information flow",target:"long-form coherence",
    brief:"Keep the same claims but reorganize the passage so topic progression, contrast, concession and conclusion are easier to follow in Japanese.",
    requirements:["段落の役割を明確にする","接続を過剰にしない","既知情報→新情報を意識する","結論までの流れを再設計する"]
  },
  {
    id:"p17-counterargument",mode:"counterargument_integration",title:"Integrate the strongest objection",target:"adversarial argument",
    brief:"Add the strongest reasonable counterargument, concede what is valid, then narrow or rebuild the original position rather than dismissing the objection.",
    requirements:["相手を弱く描かない","有効な点を認める","決定的な争点を一つ示す","結論を必要なら修正する"]
  },
  {
    id:"p17-audience",mode:"audience_translation",title:"Translate expertise across audiences",target:"specialist ↔ informed public",
    brief:"Rewrite specialist Japanese for an informed non-specialist, or reverse the direction. Preserve the important caveat while changing terminology and explanatory density.",
    requirements:["専門語を必要に応じて言い換える","重要な留保を落とさない","読者知識を前提にしすぎない","説明密度を調整する"]
  }
];

export type C1DiscourseStageId="position"|"mechanism"|"challenge"|"audience_shift"|"synthesis";
export interface C1DiscourseStage {
  id:C1DiscourseStageId;
  title:string;
  prompt:string;
  minimumCharacters:number;
}
export const c1DiscourseStages:C1DiscourseStage[]=[
  {id:"position",title:"Position",prompt:"Define the specialist issue precisely, state your current position and delimit what you are not claiming.",minimumCharacters:120},
  {id:"mechanism",title:"Mechanism + evidence",prompt:"Explain the mechanism or causal structure and connect it explicitly to the strongest evidence you have.",minimumCharacters:150},
  {id:"challenge",title:"Expert challenge",prompt:"Answer a technically informed objection that attacks a hidden assumption, evidence gap or competing explanation.",minimumCharacters:150},
  {id:"audience_shift",title:"Audience shift",prompt:"Restate the core reasoning for a different audience without losing the decisive caveat or specialist distinction.",minimumCharacters:120},
  {id:"synthesis",title:"Synthesis",prompt:"Close the discussion by integrating the strongest evidence, objection, uncertainty and next question into one bounded conclusion.",minimumCharacters:160}
];

export interface C1PrecisionArtifact {
  id:string;
  challengeId:string;
  mode:C1PrecisionMode;
  originalText:string;
  revisedText:string;
  rationale:string;
  specialistTrackId?:string;
  occurredAt:string;
}

export interface C1SpecialistDiscourseTurn {
  id:string;
  trackId:string;
  stageId:C1DiscourseStageId;
  response:string;
  inputMode:"text"|"speech";
  occurredAt:string;
}

export interface C1SpecialistDiscourseProgress {
  trackId:string;
  title:string;
  domain:string;
  turns:number;
  stagesCovered:number;
  repeatedStages:number;
  activeDays:number;
  spanHours:number;
  speechTurns:number;
  cycleComplete:boolean;
  sustainedAcrossSessions:boolean;
  stageCounts:Record<C1DiscourseStageId,number>;
}

export interface C1SourceRefresh {
  id:string;
  baseSourceId:string;
  updateSourceId:string;
  changedClaim:string;
  continuity:string;
  impact:string;
  uncertainty:string;
  occurredAt:string;
}

export type C1ReviewRepairStrategy="accept"|"modify"|"reject";
export interface C1ReviewRepair {
  id:string;
  reviewId:string;
  projectId:string;
  strategy:C1ReviewRepairStrategy;
  revisedPassage:string;
  rationale:string;
  occurredAt:string;
}

export interface C1PrecisionProgress {
  activeDays:number;
  precisionArtifacts:C1PrecisionArtifact[];
  precisionModes:number;
  specialistTurns:C1SpecialistDiscourseTurn[];
  specialistTracks:C1SpecialistDiscourseProgress[];
  completedDiscourseCycles:number;
  sustainedSpecialistTracks:number;
  sourceRefreshes:C1SourceRefresh[];
  reviewRepairs:C1ReviewRepair[];
}

export function challengeById(id:string):C1PrecisionChallenge{
  const challenge=c1PrecisionChallenges.find((item)=>item.id===id);
  if(!challenge)throw new Error("UNKNOWN_P17_PRECISION_CHALLENGE:"+id);
  return challenge;
}

export function discourseStageById(id:string):C1DiscourseStage{
  const stage=c1DiscourseStages.find((item)=>item.id===id);
  if(!stage)throw new Error("UNKNOWN_P17_DISCOURSE_STAGE:"+id);
  return stage;
}

export function validateC1PrecisionTransformation(challenge:C1PrecisionChallenge,original:string,revised:string,rationale:string):void{
  const before=original.trim(),after=revised.trim(),why=rationale.trim();
  if(before.length<180)throw new Error("P17_PRECISION_ORIGINAL_TOO_SHORT");
  if(after.length<100)throw new Error("P17_PRECISION_REVISION_TOO_SHORT");
  if(after===before)throw new Error("P17_PRECISION_REVISION_MUST_CHANGE");
  if(why.length<80)throw new Error("P17_PRECISION_RATIONALE_TOO_SHORT");
  const ratio=after.length/before.length;
  if(challenge.mode==="compression"&&(ratio>.75||ratio<.3))throw new Error("P17_COMPRESSION_RATIO_OUT_OF_RANGE");
  if(challenge.mode==="expansion"&&ratio<1.2)throw new Error("P17_EXPANSION_NOT_SUBSTANTIAL");
}

export async function saveC1PrecisionArtifact(input:{
  challengeId:string;originalText:string;revisedText:string;rationale:string;specialistTrackId?:string;
}):Promise<C1PrecisionArtifact>{
  const challenge=challengeById(input.challengeId);
  validateC1PrecisionTransformation(challenge,input.originalText,input.revisedText,input.rationale);
  const quality=await getC1ResearchQualityProgress();
  const specialistTrackId=input.specialistTrackId?.trim();
  if(specialistTrackId&&!quality.specialistTracks.some((item)=>item.id===specialistTrackId))throw new Error("P17_UNKNOWN_SPECIALIST_TRACK");
  const artifact:C1PrecisionArtifact={
    id:"p17-precision-"+crypto.randomUUID(),challengeId:challenge.id,mode:challenge.mode,
    originalText:input.originalText.trim(),revisedText:input.revisedText.trim(),rationale:input.rationale.trim(),
    ...(specialistTrackId?{specialistTrackId}:{}),occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"writing",promptFamily:"p17-c1-precision-transform",responseMode:"revision",result:"skipped",contextId:challenge.id,
    metadata:{
      p17C1Precision:true,p17PrecisionArtifact:true,precisionArtifact:artifact,
      structuralTransformation:true,semanticGrading:false,masteryUpdate:false,accreditedCefrVerdict:false
    }
  }));
  return artifact;
}

export async function saveC1SpecialistDiscourseTurn(input:{
  trackId:string;stageId:C1DiscourseStageId;response:string;inputMode:"text"|"speech";
}):Promise<C1SpecialistDiscourseTurn>{
  const quality=await getC1ResearchQualityProgress();
  const track=quality.specialistTracks.find((item)=>item.id===input.trackId);
  if(!track)throw new Error("P17_SPECIALIST_TRACK_REQUIRED");
  const stage=discourseStageById(input.stageId);
  const response=input.response.trim();
  if(response.length<stage.minimumCharacters)throw new Error("P17_SPECIALIST_RESPONSE_TOO_SHORT");
  const turn:C1SpecialistDiscourseTurn={
    id:"p17-discourse-"+crypto.randomUUID(),trackId:track.id,stageId:stage.id,response,inputMode:input.inputMode,occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"speaking",promptFamily:"p17-c1-specialist-discourse",
    responseMode:input.inputMode==="speech"?"speech-recognition-transcript":"typed-speaking-proxy",
    result:"skipped",contextId:track.id,
    metadata:{
      p17C1Precision:true,p17SpecialistDiscourse:true,specialistDiscourseTurn:turn,
      semanticGrading:false,acousticScore:false,masteryUpdate:false
    }
  }));
  return turn;
}

export async function saveC1SourceRefresh(input:{
  baseSourceId:string;updateSourceId:string;changedClaim:string;continuity:string;impact:string;uncertainty:string;
}):Promise<C1SourceRefresh>{
  const environment=await getC1EnvironmentProgress();
  const base=environment.sources.find((item)=>item.id===input.baseSourceId);
  const update=environment.sources.find((item)=>item.id===input.updateSourceId);
  if(!base||!update)throw new Error("P17_REFRESH_SOURCE_NOT_FOUND");
  if(base.id===update.id)throw new Error("P17_REFRESH_REQUIRES_TWO_SOURCES");
  const changedClaim=input.changedClaim.trim(),continuity=input.continuity.trim(),impact=input.impact.trim(),uncertainty=input.uncertainty.trim();
  if(changedClaim.length<60||continuity.length<50||impact.length<60||uncertainty.length<50)throw new Error("P17_REFRESH_ANALYSIS_TOO_SHORT");
  const refresh:C1SourceRefresh={
    id:"p17-refresh-"+crypto.randomUUID(),baseSourceId:base.id,updateSourceId:update.id,
    changedClaim,continuity,impact,uncertainty,occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"reading",primaryTarget:{kind:"document",id:update.id},promptFamily:"p17-c1-source-refresh",responseMode:"source-comparison",
    result:"skipped",contextId:base.id,sourceId:update.id,
    metadata:{
      p17C1Precision:true,p17SourceRefresh:true,sourceRefresh:refresh,
      baseSourceUrl:base.url,updateSourceUrl:update.url,independentFactVerification:false,semanticGrading:false,masteryUpdate:false
    }
  }));
  return refresh;
}

export async function saveC1ReviewRepair(input:{
  reviewId:string;strategy:C1ReviewRepairStrategy;revisedPassage:string;rationale:string;
}):Promise<C1ReviewRepair>{
  const quality=await getC1ResearchQualityProgress();
  const review=quality.humanReviews.find((item)=>item.id===input.reviewId);
  if(!review)throw new Error("P17_HUMAN_REVIEW_REQUIRED");
  const revisedPassage=input.revisedPassage.trim(),rationale=input.rationale.trim();
  if(revisedPassage.length<160)throw new Error("P17_REPAIR_PASSAGE_TOO_SHORT");
  if(rationale.length<100)throw new Error("P17_REPAIR_RATIONALE_TOO_SHORT");
  const repair:C1ReviewRepair={
    id:"p17-repair-"+crypto.randomUUID(),reviewId:review.id,projectId:review.projectId,strategy:input.strategy,
    revisedPassage,rationale,occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"writing",primaryTarget:{kind:"production_task",id:review.projectId},promptFamily:"p17-c1-human-review-repair",
    responseMode:"review-revision",result:"skipped",contextId:review.id,
    metadata:{
      p17C1Precision:true,p17ReviewRepair:true,reviewRepair:repair,
      reviewOfHumanEvidence:true,humanReviewAppliedToMastery:false,semanticGrading:false,accreditedCefrVerdict:false
    }
  }));
  return repair;
}

export async function getC1PrecisionProgress():Promise<C1PrecisionProgress>{
  const [events,quality]=await Promise.all([listStudyEvents(DEVELOPMENT_ACCOUNT_ID),getC1ResearchQualityProgress()]);
  return buildC1PrecisionProgress(events,quality.specialistTracks);
}

export function buildC1PrecisionProgress(events:readonly StudyEvent[],tracks:readonly C1SpecialistTrack[]=[]):C1PrecisionProgress{
  const precisionArtifacts=recordsFromEvents<C1PrecisionArtifact>(events,"p17PrecisionArtifact","precisionArtifact","id");
  const specialistTurns=recordsFromEvents<C1SpecialistDiscourseTurn>(events,"p17SpecialistDiscourse","specialistDiscourseTurn","id");
  const sourceRefreshes=recordsFromEvents<C1SourceRefresh>(events,"p17SourceRefresh","sourceRefresh","id");
  const reviewRepairs=recordsFromEvents<C1ReviewRepair>(events,"p17ReviewRepair","reviewRepair","id");
  const p17Events=events.filter((event)=>event.metadata?.p17C1Precision===true);
  const specialistTracks=tracks.map((track)=>buildDiscourseProgress(track,specialistTurns));
  return {
    activeDays:new Set(p17Events.map((event)=>event.occurredAt.slice(0,10))).size,
    precisionArtifacts,
    precisionModes:new Set(precisionArtifacts.map((item)=>item.mode)).size,
    specialistTurns,
    specialistTracks,
    completedDiscourseCycles:specialistTracks.filter((item)=>item.cycleComplete).length,
    sustainedSpecialistTracks:specialistTracks.filter((item)=>item.sustainedAcrossSessions).length,
    sourceRefreshes,
    reviewRepairs
  };
}

export function buildDiscourseProgress(track:C1SpecialistTrack,turns:readonly C1SpecialistDiscourseTurn[]):C1SpecialistDiscourseProgress{
  const relevant=turns.filter((item)=>item.trackId===track.id).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
  const stageCounts=Object.fromEntries(c1DiscourseStages.map((stage)=>[stage.id,relevant.filter((item)=>item.stageId===stage.id).length])) as Record<C1DiscourseStageId,number>;
  const stagesCovered=c1DiscourseStages.filter((stage)=>stageCounts[stage.id]>0).length;
  const repeatedStages=c1DiscourseStages.filter((stage)=>hasDelayedRepeat(relevant.filter((item)=>item.stageId===stage.id))).length;
  const times=relevant.map((item)=>Date.parse(item.occurredAt)).filter(Number.isFinite);
  const spanHours=times.length>1?(Math.max(...times)-Math.min(...times))/3_600_000:0;
  return {
    trackId:track.id,title:track.title,domain:track.domain,turns:relevant.length,stagesCovered,repeatedStages,
    activeDays:new Set(relevant.map((item)=>item.occurredAt.slice(0,10))).size,spanHours,
    speechTurns:relevant.filter((item)=>item.inputMode==="speech").length,
    cycleComplete:stagesCovered===c1DiscourseStages.length,
    sustainedAcrossSessions:repeatedStages===c1DiscourseStages.length,
    stageCounts
  };
}

export function sourceLabel(source:C1RegisteredSource):string{
  return source.publisher+" · "+source.title;
}

export function reviewLabel(review:C1ProjectHumanReview):string{
  return review.projectTitle+" · "+review.reviewerRole.replaceAll("_"," ")+" · "+new Date(review.reviewedAt).toLocaleDateString();
}

function hasDelayedRepeat(turns:readonly C1SpecialistDiscourseTurn[]):boolean{
  if(turns.length<2)return false;
  for(let i=0;i<turns.length;i++){
    for(let j=i+1;j<turns.length;j++){
      if(Date.parse(turns[j]!.occurredAt)-Date.parse(turns[i]!.occurredAt)>=RELIABILITY_DELAY_MS)return true;
    }
  }
  return false;
}

function recordsFromEvents<T extends object>(events:readonly StudyEvent[],flag:string,key:string,idKey:keyof T):T[]{
  const map=new Map<string,T>();
  for(const event of events.filter((item)=>item.metadata?.[flag]===true).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const raw=event.metadata?.[key];
    if(!raw||typeof raw!=="object")continue;
    const item=raw as T;
    const id=(item as Record<PropertyKey,unknown>)[idKey];
    if(typeof id==="string"&&id)map.set(id,item);
  }
  return [...map.values()];
}

function baseEvent(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,learnerModelVersion:"p17",...input
  };
}
