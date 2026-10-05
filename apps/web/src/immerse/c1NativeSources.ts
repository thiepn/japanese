import nativeRegistry from "../../../../release/p11-native-sources.json";
import { saveStudyEvent,listStudyEvents } from "@thiepn/local-db";
import type { StudyEvent } from "@thiepn/domain";
import { AUTHENTIC_ACCOUNT_ID } from "./authentic";
import { coreContent } from "../coreContent";

export interface C1NativeSource {
  id:string;title:string;speakerLabel:string;sourcePageUrl:string;mediaUrl:string;durationSeconds:number;
  credit:string;licenseName:string;attributionUrl:string;register:"polite"|"formal";speechRate:"natural"|"fast";
}
export interface C1SynthesisMission {
  id:string;title:string;focus:string;sourceIds:string[];prompt:string;requiredMoves:string[];
}
export interface C1SynthesisSummary {sessions:number;sourcesUsed:number;latestAt?:string;}

const registry=nativeRegistry as unknown as {sources:C1NativeSource[]};
export const c1NativeSources=[...registry.sources];

export const c1SynthesisMissions:C1SynthesisMission[]=[
  {id:"policy-shift",title:"Policy priorities across administrations",focus:"stance + implication",sourceIds:["kantei-ishiba-20241004-policy","kantei-ishiba-20250124-policy"],prompt:"Compare the priorities and framing across the two policy addresses. Separate directly observable emphasis from your interpretation, then state one qualified implication.",requiredMoves:["evidence vs inference","qualification","implication"]},
  {id:"prepared-vs-live",title:"Prepared address vs live press conference",focus:"register + spontaneity",sourceIds:["kantei-abe-20180311-memorial","kantei-abe-20200828-press"],prompt:"Compare how register, pacing and argument structure differ between the prepared formal address and press-conference material. Explain what the genre difference can and cannot establish.",requiredMoves:["register control","comparison","caveat"]},
  {id:"crisis-communication",title:"Crisis communication across speakers",focus:"synthesis + accountability",sourceIds:["govonline-suga-20201225-press","kantei-noda-20110902-inaugural-press","kantei-kan-20110104-new-year-press"],prompt:"Synthesize how the speakers frame responsibility, uncertainty and next actions. Identify one common pattern, one contrast and one point that remains uncertain.",requiredMoves:["multi-source synthesis","accountability","uncertainty"]},
  {id:"press-conference-depth",title:"Press-conference comparison under stretch conditions",focus:"fast-source listening",sourceIds:["govonline-suga-20190401-reiwa-press","kantei-abe-20200828-press","kantei-noda-20110902-inaugural-press"],prompt:"Listen across the three stretch-condition press sources. Build a concise synthesis of stance, evidence and response strategy without relying on transcript-first reading.",requiredMoves:["note compression","counterposition","qualified synthesis"]}
];

export async function recordC1SourceNote(input:{missionId:string;sourceId:string;note:string}):Promise<void>{
  const note=input.note.trim(); if(!note)throw new Error("C1_SOURCE_NOTE_REQUIRED");
  await saveStudyEvent(event({
    activity:"listening",primaryTarget:{kind:"document",id:input.sourceId},promptFamily:"p13-c1-native-source-note",responseMode:"note",result:"skipped",
    metadata:{p13C1NativeDepth:true,missionId:input.missionId,sourceId:input.sourceId,learnerNote:note,semanticGrading:false,modelFeedbackAppliedToMastery:false}
  }));
}
export async function recordC1MultiSourceSynthesis(input:{missionId:string;sourceIds:string[];synthesis:string}):Promise<void>{
  const ids=[...new Set(input.sourceIds)]; if(ids.length<2)throw new Error("C1_SYNTHESIS_REQUIRES_TWO_SOURCES");
  const synthesis=input.synthesis.trim(); if(!synthesis)throw new Error("C1_SYNTHESIS_REQUIRED");
  await saveStudyEvent(event({
    activity:"listening",primaryTarget:{kind:"document",id:ids[0]!},secondaryTargets:ids.slice(1).map(id=>({kind:"document" as const,id})),
    promptFamily:"p13-c1-multi-source-synthesis",responseMode:"textarea",result:"skipped",
    metadata:{p13C1NativeDepth:true,p13C1MultiSourceSynthesis:true,missionId:input.missionId,sourceDocumentIds:ids,learnerSynthesis:synthesis,semanticGrading:false,modelFeedbackAppliedToMastery:false}
  }));
}
export async function getC1SynthesisSummary():Promise<C1SynthesisSummary>{
  const events=await listStudyEvents(AUTHENTIC_ACCOUNT_ID);
  const sessions=events.filter(e=>e.metadata?.p13C1MultiSourceSynthesis===true);
  const sources=new Set(sessions.flatMap(e=>Array.isArray(e.metadata?.sourceDocumentIds)?e.metadata!.sourceDocumentIds.filter((x):x is string=>typeof x==="string"):[]));
  const latest=[...sessions].sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  return {sessions:sessions.length,sourcesUsed:sources.size,...(latest?{latestAt:latest.occurredAt}:{})};
}
function event(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {id:crypto.randomUUID(),userId:AUTHENTIC_ACCOUNT_ID,deviceId:"p13-c1-native",occurredAt:new Date().toISOString(),contentVersion:coreContent.version,learnerModelVersion:"p13",...input};
}
