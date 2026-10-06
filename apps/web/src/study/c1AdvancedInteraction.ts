import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { getC1ResearchQualityProgress,type C1SpecialistTrack } from "./c1ResearchQuality";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

export type C1InteractionPressureType=
  |"interruption"
  |"clarification"
  |"reformulation"
  |"implicature"
  |"register_pivot"
  |"evidence_conflict"
  |"stance_shift"
  |"time_pressure"
  |"domain_transfer"
  |"floor_recovery"
  |"hedging_demand"
  |"synthesis";

export interface C1InteractionPressureMove{
  id:string;
  type:C1InteractionPressureType;
  title:string;
  partnerMove:string;
  repairGoal:string;
  minimumCharacters:number;
  family:"floor_control"|"repair"|"stance_evidence"|"audience_register"|"transfer_synthesis";
}

export const c1InteractionPressureMoves:C1InteractionPressureMove[]=[
  {
    id:"p18-interrupt-midpoint",type:"interruption",title:"Interrupted before the qualification",family:"floor_control",
    partnerMove:"相手が途中で『つまり、あなたは全面的に賛成なんですね？』と割り込みます。まだ重要な留保を述べていません。主導権を失わずに発言を取り戻してください。",
    repairGoal:"interrupt politely, recover the floor, then restore the missing qualification",minimumCharacters:90
  },
  {
    id:"p18-clarify-reference",type:"clarification",title:"Ambiguous reference challenged",family:"repair",
    partnerMove:"相手が『今の「それ」は具体的に何を指していますか。責任主体も曖昧です』と確認を求めます。曖昧さを解消し、主張を言い直してください。",
    repairGoal:"resolve reference ambiguity and make the actor/responsibility explicit",minimumCharacters:100
  },
  {
    id:"p18-reformulate-plain",type:"reformulation",title:"Reformulate without specialist shorthand",family:"audience_register",
    partnerMove:"相手が『専門用語が多すぎます。意味を薄めずに、専門外の人にも通じる日本語で言い直してください』と求めます。",
    repairGoal:"reformulate in accessible Japanese while preserving the decisive distinction",minimumCharacters:100
  },
  {
    id:"p18-implicature",type:"implicature",title:"Unstated implication exposed",family:"repair",
    partnerMove:"相手が『はっきり言っていませんが、それは現行方針を失敗だと見なしているという意味ですか』と含意を突きます。暗黙の意味を整理してください。",
    repairGoal:"separate intended implication from an overread and state the position explicitly",minimumCharacters:110
  },
  {
    id:"p18-register-pivot",type:"register_pivot",title:"Audience changes mid-answer",family:"audience_register",
    partnerMove:"途中で場面が変わり、同じ内容を委員会の正式記録に残る発言として述べる必要が出ました。口語的な説明から正式な発言へ切り替えてください。",
    repairGoal:"shift register immediately without changing the core position",minimumCharacters:120
  },
  {
    id:"p18-evidence-conflict",type:"evidence_conflict",title:"Conflicting evidence arrives",family:"stance_evidence",
    partnerMove:"相手が、あなたの根拠と矛盾する新しい資料があると言います。資料そのものを否定せず、現時点の結論をどう調整するか説明してください。",
    repairGoal:"absorb counterevidence, recalibrate certainty and identify what would change the conclusion",minimumCharacters:120
  },
  {
    id:"p18-stance-shift",type:"stance_shift",title:"Position must narrow",family:"stance_evidence",
    partnerMove:"相手の指摘で、元の主張の一部が強すぎたと分かりました。面子を守るのではなく、どこを撤回・限定し、何を維持するか明示してください。",
    repairGoal:"narrow the claim transparently while preserving what remains supported",minimumCharacters:110
  },
  {
    id:"p18-time-pressure",type:"time_pressure",title:"Thirty-second answer",family:"floor_control",
    partnerMove:"司会者が『時間がありません。30秒で、結論・理由・最大の留保だけお願いします』と求めます。情報量を圧縮してください。",
    repairGoal:"deliver a compact conclusion-reason-caveat answer without losing control",minimumCharacters:80
  },
  {
    id:"p18-domain-transfer",type:"domain_transfer",title:"Principle moved into another domain",family:"transfer_synthesis",
    partnerMove:"相手が、あなたの原則を別の制度・分野にもそのまま適用できると言います。移せる部分と移せない部分を即座に区別してください。",
    repairGoal:"transfer the core principle while naming at least one domain-specific boundary condition",minimumCharacters:120
  },
  {
    id:"p18-floor-recovery",type:"floor_recovery",title:"Recover after being talked over",family:"floor_control",
    partnerMove:"相手が長く話し続け、あなたの論点を別方向へ進めました。対立的にならずに発言権を取り戻し、未回答の核心へ戻してください。",
    repairGoal:"recover the floor, acknowledge the other turn and return to the unresolved core issue",minimumCharacters:100
  },
  {
    id:"p18-hedging-demand",type:"hedging_demand",title:"Certainty wording challenged",family:"stance_evidence",
    partnerMove:"相手が『可能性がある、という表現ばかりで結局何も言っていないのでは』と批判します。曖昧に逃げず、確実な部分と不確実な部分を分けてください。",
    repairGoal:"use precise epistemic language instead of either overclaiming or empty hedging",minimumCharacters:110
  },
  {
    id:"p18-synthesis",type:"synthesis",title:"Synthesize after disagreement",family:"transfer_synthesis",
    partnerMove:"議論が拡散しました。相手は『結局、どこまで合意し、何が未解決で、次に何を確認すべきですか』とまとめを求めます。",
    repairGoal:"synthesize agreement, disagreement, uncertainty and next action in one controlled answer",minimumCharacters:130
  }
];

export interface C1AdvancedInteractionTurn{
  id:string;
  sessionId:string;
  moveId:string;
  pressureType:C1InteractionPressureType;
  family:C1InteractionPressureMove["family"];
  specialistTrackId?:string;
  committedStatement:string;
  pressureResponse:string;
  inputMode:"text"|"speech";
  responseSeconds:number;
  occurredAt:string;
}

export type C1HumanInteractionMedium="in_person"|"voice_call"|"video_call"|"text_chat";
export type C1PartnerProfile="native_japanese"|"near_native"|"advanced_japanese"|"unknown";

export interface C1HumanInteractionRecord{
  id:string;
  medium:C1HumanInteractionMedium;
  partnerProfile:C1PartnerProfile;
  durationMinutes:number;
  domain:string;
  interactionSummary:string;
  difficultMoment:string;
  repairUsed:string;
  reflection:string;
  occurredAt:string;
}

export interface C1CrossDomainTransfer{
  id:string;
  sourceTrackId:string;
  targetDomain:string;
  transferablePrinciple:string;
  transferResponse:string;
  boundaryCondition:string;
  occurredAt:string;
}

export interface C1AdvancedInteractionSessionProgress{
  sessionId:string;
  turns:number;
  pressureTypes:number;
  families:number;
  speechTurns:number;
  averageResponseSeconds:number;
  firstAt:string;
  lastAt:string;
  complete:boolean;
  robustPressureCoverage:boolean;
}

export interface C1AdvancedInteractionProgress{
  activeDays:number;
  turns:C1AdvancedInteractionTurn[];
  sessions:C1AdvancedInteractionSessionProgress[];
  completeSessions:number;
  robustSessions:number;
  pressureTypes:number;
  aiPressureTurns:number;
  humanInteractions:C1HumanInteractionRecord[];
  humanInteractionMinutes:number;
  transfers:C1CrossDomainTransfer[];
}

export function pressureMoveById(id:string):C1InteractionPressureMove{
  const move=c1InteractionPressureMoves.find((item)=>item.id===id);
  if(!move)throw new Error("UNKNOWN_P18_PRESSURE_MOVE:"+id);
  return move;
}

export function drawC1InteractionPressure(usedIds:readonly string[]=[],random=Math.random):C1InteractionPressureMove{
  const available=c1InteractionPressureMoves.filter((item)=>!usedIds.includes(item.id));
  const pool=available.length?available:c1InteractionPressureMoves;
  return pool[Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,random()))*pool.length))]!;
}

export async function saveC1AdvancedInteractionTurn(input:{
  sessionId:string;moveId:string;specialistTrackId?:string;committedStatement:string;pressureResponse:string;
  inputMode:"text"|"speech";responseSeconds:number;
}):Promise<C1AdvancedInteractionTurn>{
  const move=pressureMoveById(input.moveId);
  const sessionId=input.sessionId.trim(),committedStatement=input.committedStatement.trim(),pressureResponse=input.pressureResponse.trim();
  if(!sessionId)throw new Error("P18_SESSION_REQUIRED");
  if(committedStatement.length<100)throw new Error("P18_COMMITTED_STATEMENT_TOO_SHORT");
  if(pressureResponse.length<move.minimumCharacters)throw new Error("P18_PRESSURE_RESPONSE_TOO_SHORT");
  if(!Number.isFinite(input.responseSeconds)||input.responseSeconds<0||input.responseSeconds>3600)throw new Error("P18_RESPONSE_TIME_INVALID");
  const quality=await getC1ResearchQualityProgress();
  const specialistTrackId=input.specialistTrackId?.trim();
  if(specialistTrackId&&!quality.specialistTracks.some((item)=>item.id===specialistTrackId))throw new Error("P18_UNKNOWN_SPECIALIST_TRACK");
  const turn:C1AdvancedInteractionTurn={
    id:"p18-turn-"+crypto.randomUUID(),sessionId,moveId:move.id,pressureType:move.type,family:move.family,
    ...(specialistTrackId?{specialistTrackId}:{}),committedStatement,pressureResponse,inputMode,
    responseSeconds:Math.round(input.responseSeconds*10)/10,occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"speaking",promptFamily:"p18-c1-advanced-interaction",
    responseMode:input.inputMode==="speech"?"speech-recognition-transcript":"typed-speaking-proxy",
    result:"skipped",contextId:sessionId,
    metadata:{
      p18AdvancedInteraction:true,p18InteractionTurn:true,interactionTurn:turn,
      simulatedPressure:true,nativeSpeakerInteraction:false,semanticGrading:false,acousticScore:false,
      responseTimingIsFluencyScore:false,masteryUpdate:false,accreditedCefrVerdict:false
    }
  }));
  return turn;
}

export async function saveC1HumanInteraction(input:{
  medium:C1HumanInteractionMedium;partnerProfile:C1PartnerProfile;durationMinutes:number;domain:string;
  interactionSummary:string;difficultMoment:string;repairUsed:string;reflection:string;
}):Promise<C1HumanInteractionRecord>{
  const domain=input.domain.trim(),interactionSummary=input.interactionSummary.trim(),difficultMoment=input.difficultMoment.trim();
  const repairUsed=input.repairUsed.trim(),reflection=input.reflection.trim();
  if(!Number.isInteger(input.durationMinutes)||input.durationMinutes<3||input.durationMinutes>480)throw new Error("P18_HUMAN_DURATION_INVALID");
  if(domain.length<3)throw new Error("P18_HUMAN_DOMAIN_REQUIRED");
  if(interactionSummary.length<80||difficultMoment.length<60||repairUsed.length<50||reflection.length<80)throw new Error("P18_HUMAN_REFLECTION_TOO_SHORT");
  const record:C1HumanInteractionRecord={
    id:"p18-human-"+crypto.randomUUID(),medium:input.medium,partnerProfile:input.partnerProfile,durationMinutes:input.durationMinutes,
    domain,interactionSummary,difficultMoment,repairUsed,reflection,occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"speaking",promptFamily:"p18-real-human-interaction",responseMode:"learner-log",result:"skipped",
    contextId:record.id,
    metadata:{
      p18AdvancedInteraction:true,p18HumanInteraction:true,humanInteraction:record,
      externalHumanInteraction:true,partnerProfileSelfReported:true,transcriptVerified:false,
      semanticGrading:false,acousticScore:false,masteryUpdate:false,accreditedCefrVerdict:false
    }
  }));
  return record;
}

export async function saveC1CrossDomainTransfer(input:{
  sourceTrackId:string;targetDomain:string;transferablePrinciple:string;transferResponse:string;boundaryCondition:string;
}):Promise<C1CrossDomainTransfer>{
  const quality=await getC1ResearchQualityProgress();
  const track=quality.specialistTracks.find((item)=>item.id===input.sourceTrackId);
  if(!track)throw new Error("P18_SPECIALIST_TRACK_REQUIRED");
  const targetDomain=input.targetDomain.trim(),transferablePrinciple=input.transferablePrinciple.trim();
  const transferResponse=input.transferResponse.trim(),boundaryCondition=input.boundaryCondition.trim();
  if(targetDomain.length<3)throw new Error("P18_TARGET_DOMAIN_REQUIRED");
  if(transferablePrinciple.length<70||transferResponse.length<150||boundaryCondition.length<80)throw new Error("P18_TRANSFER_TOO_SHORT");
  const transfer:C1CrossDomainTransfer={
    id:"p18-transfer-"+crypto.randomUUID(),sourceTrackId:track.id,targetDomain,transferablePrinciple,transferResponse,boundaryCondition,
    occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"speaking",promptFamily:"p18-c1-cross-domain-transfer",responseMode:"advanced-transfer",result:"skipped",
    contextId:track.id,
    metadata:{
      p18AdvancedInteraction:true,p18CrossDomainTransfer:true,crossDomainTransfer:transfer,
      sourceDomain:track.domain,targetDomain,structuralTransferEvidence:true,
      subjectExpertiseVerified:false,semanticGrading:false,masteryUpdate:false,accreditedCefrVerdict:false
    }
  }));
  return transfer;
}

export async function getC1AdvancedInteractionProgress():Promise<C1AdvancedInteractionProgress>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  return buildC1AdvancedInteractionProgress(events);
}

export function buildC1AdvancedInteractionProgress(events:readonly StudyEvent[]):C1AdvancedInteractionProgress{
  const turns=recordsFromEvents<C1AdvancedInteractionTurn>(events,"p18InteractionTurn","interactionTurn","id");
  const humanInteractions=recordsFromEvents<C1HumanInteractionRecord>(events,"p18HumanInteraction","humanInteraction","id");
  const transfers=recordsFromEvents<C1CrossDomainTransfer>(events,"p18CrossDomainTransfer","crossDomainTransfer","id");
  const sessionIds=[...new Set(turns.map((item)=>item.sessionId))];
  const sessions=sessionIds.map((sessionId)=>buildInteractionSessionProgress(sessionId,turns));
  const p18Events=events.filter((item)=>item.metadata?.p18AdvancedInteraction===true);
  return {
    activeDays:new Set(p18Events.map((item)=>item.occurredAt.slice(0,10))).size,
    turns,sessions,
    completeSessions:sessions.filter((item)=>item.complete).length,
    robustSessions:sessions.filter((item)=>item.robustPressureCoverage).length,
    pressureTypes:new Set(turns.map((item)=>item.pressureType)).size,
    aiPressureTurns:events.filter((item)=>item.metadata?.p18AdvancedCoach===true).length,
    humanInteractions,
    humanInteractionMinutes:humanInteractions.reduce((sum,item)=>sum+item.durationMinutes,0),
    transfers
  };
}

export function buildInteractionSessionProgress(sessionId:string,turns:readonly C1AdvancedInteractionTurn[]):C1AdvancedInteractionSessionProgress{
  const relevant=turns.filter((item)=>item.sessionId===sessionId).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
  const pressureTypes=new Set(relevant.map((item)=>item.pressureType)).size;
  const families=new Set(relevant.map((item)=>item.family)).size;
  const averageResponseSeconds=relevant.length?relevant.reduce((sum,item)=>sum+item.responseSeconds,0)/relevant.length:0;
  return {
    sessionId,turns:relevant.length,pressureTypes,families,
    speechTurns:relevant.filter((item)=>item.inputMode==="speech").length,
    averageResponseSeconds:Math.round(averageResponseSeconds*10)/10,
    firstAt:relevant[0]?.occurredAt??"",lastAt:relevant.at(-1)?.occurredAt??"",
    complete:relevant.length>=4&&pressureTypes>=4,
    robustPressureCoverage:relevant.length>=6&&pressureTypes>=6&&families>=4
  };
}

export function specialistTrackLabel(track:C1SpecialistTrack):string{
  return track.domain+" · "+track.title;
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
    contentVersion:coreContent.version,learnerModelVersion:"p18",...input
  };
}
