import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import rawInventory from "../../../../release/p9-native-inventory.json";
import { coreContent } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

type NativeRate="slow"|"natural"|"fast";
type NativeRegister="casual"|"neutral"|"polite"|"formal";

interface InventoryVerification {
  phase:string;
  reviewedBy:string;
  reviewedAt:string;
  durationSeconds:number;
  checklist:Record<string,boolean>;
}
interface InventoryRecording {
  id:string;
  url:string;
  credit:string;
  licenseName:string;
  attributionUrl:string;
  nativeSpeaker:true;
  speechRate:NativeRate;
  register:NativeRegister;
  speakerLabel:string;
  verification:InventoryVerification;
}
interface InventoryDocument {
  id:string;
  title:string;
  sourceUrl:string;
  recordings:InventoryRecording[];
}
interface Inventory {
  schema:string;
  schemaVersion:number;
  updatedAt:string;
  documents:InventoryDocument[];
}

export interface C1NativeSource {
  id:string;
  title:string;
  sourceUrl:string;
  recording:InventoryRecording;
  verified:boolean;
}

export interface C1NativeSourceSet {
  id:string;
  title:string;
  description:string;
  focus:string;
  sourceIds:string[];
  synthesisPrompt:string;
  targetMoves:string[];
}

export interface C1NativeDepthProgress {
  sourceCount:number;
  recordingCount:number;
  speakers:number;
  registers:NativeRegister[];
  speechRates:NativeRate[];
  verifiedSources:number;
  exposedSources:number;
  synthesisAttempts:number;
  completedSets:number;
}

const inventory=rawInventory as unknown as Inventory;

export const c1NativeSources:C1NativeSource[]=inventory.documents.flatMap((document)=>
  document.recordings.map((recording)=>({
    id:document.id,
    title:document.title,
    sourceUrl:document.sourceUrl,
    recording,
    verified:isVerifiedRecording(recording)
  }))
);

export const c1NativeSourceSets:C1NativeSourceSet[]=[
  {
    id:"p13-native-policy-continuity",
    title:"Policy continuity across two formal addresses",
    description:"Compare two policy addresses from the same speaker to track stable priorities, reframing and changes in emphasis without relying on transcript-first support.",
    focus:"formal policy discourse · longitudinal comparison",
    sourceIds:["kantei-ishiba-20241004-policy","kantei-ishiba-20250124-policy"],
    synthesisPrompt:"Compare the two addresses. Identify one continuing priority, one change in emphasis, and one point where your interpretation remains uncertain. Base the synthesis on what you actually heard rather than assumed policy knowledge.",
    targetMoves:["共通点を整理する","重点の変化を示す","留保を明示する"]
  },
  {
    id:"p13-native-press-pressure",
    title:"Press-conference stance under pressure",
    description:"Contrast fast or relatively demanding press-conference speech across different speakers and identify how answers frame responsibility, limits and next actions.",
    focus:"spontaneous public response · fast/polite listening",
    sourceIds:["kantei-noda-20110902-inaugural-press","kantei-abe-20200828-press","govonline-suga-20190401-reiwa-press"],
    synthesisPrompt:"Across the three press-conference sources, compare how speakers frame responsibility or uncertainty. Note one shared discourse pattern, one speaker-specific difference, and one segment you could not confidently resolve.",
    targetMoves:["説明責任を捉える","相違点を比較する","不確かな点を残す"]
  },
  {
    id:"p13-native-register-shift",
    title:"Same speaker, different public register",
    description:"Compare a prepared formal memorial address with a press-conference source from the same speaker to notice register, pacing and rhetorical-control differences.",
    focus:"register shift · prepared vs press discourse",
    sourceIds:["kantei-abe-20180311-memorial","kantei-abe-20200828-press"],
    synthesisPrompt:"Compare the two sources from the same speaker. Describe how register, pacing and rhetorical organization differ, and explain how those differences affect what is easy or difficult to understand.",
    targetMoves:["レジスターを比較する","修辞の違いを示す","聞き取り負荷を説明する"]
  },
  {
    id:"p13-native-public-communication",
    title:"Public communication across speakers",
    description:"Build listening endurance across multiple speakers, dates and formats while tracking claims, conditions and uncertainty.",
    focus:"multi-speaker synthesis · public communication",
    sourceIds:["kantei-kan-20110104-new-year-press","kantei-noda-20110902-inaugural-press","govonline-suga-20201225-press"],
    synthesisPrompt:"Synthesize the three sources around public communication. Identify recurring ways of structuring claims and conditions, then state one contrast that may reflect genre, speaker or context rather than language ability alone.",
    targetMoves:["構成を比較する","条件を追跡する","原因を断定しすぎない"]
  }
];

export function c1NativeSource(id:string):C1NativeSource{
  const item=c1NativeSources.find((source)=>source.id===id);
  if(!item)throw new Error("UNKNOWN_P13_NATIVE_SOURCE:"+id);
  return item;
}

export function c1NativeSourceSet(id:string):C1NativeSourceSet{
  const set=c1NativeSourceSets.find((item)=>item.id===id);
  if(!set)throw new Error("UNKNOWN_P13_NATIVE_SET:"+id);
  return set;
}

export async function recordC1NativeExposure(sourceId:string):Promise<void>{
  const source=c1NativeSource(sourceId);
  if(!source.verified)throw new Error("P13_NATIVE_SOURCE_NOT_VERIFIED:"+sourceId);
  await saveStudyEvent(baseEvent({
    activity:"listening",
    primaryTarget:{kind:"document",id:source.id},
    promptFamily:"p13-c1-native-source-exposure",
    responseMode:"native-audio",
    result:"skipped",
    contextId:"p13-c1-native-depth",
    metadata:{
      p13C1NativeDepth:true,
      sourceId:source.id,
      sourceUrl:source.sourceUrl,
      recordingId:source.recording.id,
      speechRate:source.recording.speechRate,
      register:source.recording.register,
      speakerLabel:source.recording.speakerLabel,
      licenseName:source.recording.licenseName,
      repositoryVerified:true,
      semanticGrading:false,
      modelFeedbackAppliedToMastery:false
    }
  }));
}

export async function recordC1NativeSynthesis(input:{setId:string;notes:Record<string,string>;synthesis:string}):Promise<void>{
  const set=c1NativeSourceSet(input.setId);
  const synthesis=input.synthesis.trim();
  if(!synthesis)throw new Error("P13_NATIVE_SYNTHESIS_REQUIRED");
  const sources=set.sourceIds.map(c1NativeSource);
  if(sources.length<2)throw new Error("P13_NATIVE_SYNTHESIS_REQUIRES_TWO_SOURCES");
  if(sources.some((source)=>!source.verified))throw new Error("P13_NATIVE_SET_CONTAINS_UNVERIFIED_SOURCE");
  const notes=Object.fromEntries(sources.map((source)=>[source.id,String(input.notes[source.id]??"").trim()]));
  const noteCount=Object.values(notes).filter(Boolean).length;
  if(noteCount<2)throw new Error("P13_NATIVE_SYNTHESIS_REQUIRES_TWO_SOURCE_NOTES");
  await saveStudyEvent(baseEvent({
    activity:"listening",
    primaryTarget:{kind:"document",id:sources[0]!.id},
    secondaryTargets:sources.slice(1).map((source)=>({kind:"document" as const,id:source.id})),
    promptFamily:"p13-c1-native-multi-source-synthesis",
    responseMode:"textarea",
    result:"skipped",
    contextId:"p13-c1-native-depth",
    metadata:{
      p13C1NativeDepth:true,
      p13C1NativeSynthesis:true,
      nativeSetId:set.id,
      sourceDocumentIds:sources.map((source)=>source.id),
      sourceNotes:notes,
      learnerSynthesis:synthesis,
      targetMoves:set.targetMoves,
      repositoryVerified:true,
      semanticGrading:false,
      modelFeedbackAppliedToMastery:false
    }
  }));
}

export async function getC1NativeDepthProgress():Promise<C1NativeDepthProgress>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const exposures=events.filter((event)=>event.metadata?.p13C1NativeDepth===true&&event.promptFamily==="p13-c1-native-source-exposure");
  const syntheses=events.filter((event)=>event.metadata?.p13C1NativeSynthesis===true);
  const exposedSources=new Set(exposures.map((event)=>event.primaryTarget?.id).filter((id):id is string=>Boolean(id)));
  const completedSets=new Set(syntheses.map((event)=>typeof event.metadata?.nativeSetId==="string"?event.metadata.nativeSetId:null).filter((id):id is string=>Boolean(id)));
  return {
    sourceCount:c1NativeSources.length,
    recordingCount:c1NativeSources.length,
    speakers:new Set(c1NativeSources.map((source)=>source.recording.speakerLabel)).size,
    registers:[...new Set(c1NativeSources.map((source)=>source.recording.register))].sort(),
    speechRates:[...new Set(c1NativeSources.map((source)=>source.recording.speechRate))].sort(),
    verifiedSources:c1NativeSources.filter((source)=>source.verified).length,
    exposedSources:exposedSources.size,
    synthesisAttempts:syntheses.length,
    completedSets:completedSets.size
  };
}

function isVerifiedRecording(recording:InventoryRecording):boolean{
  const required=[
    "sourceIdentityVerified","recordingIdentityVerified","licenseVerified","nativeSpeakerVerified",
    "contentMatchVerified","connectedSpeechVerified","registerReviewed","speechRateReviewed"
  ];
  return recording.nativeSpeaker===true&&required.every((key)=>recording.verification?.checklist?.[key]===true);
}

function baseEvent(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),
    userId:DEVELOPMENT_ACCOUNT_ID,
    deviceId:DEVELOPMENT_DEVICE_ID,
    occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,
    learnerModelVersion:"p13",
    ...input
  };
}
