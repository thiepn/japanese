import type { StudyEvent } from "@thiepn/domain";
import {
  listPrivateDocuments,listStudyEvents,saveStudyEvent,
  type PrivateDocumentRecord,type PrivateNativeAudio
} from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { AUTHENTIC_ACCOUNT_ID } from "./authentic";

const DEVICE_ID="p9-native-listening";
const DELAY_MS=20*60*60*1000;

export interface NativeListeningSource {
  document:PrivateDocumentRecord;
  recordings:PrivateNativeAudio[];
}

export interface NativeListeningDepthSummary {
  sourceDocuments:number;
  recordings:number;
  speakers:number;
  registers:string[];
  speechRates:string[];
  multiSourceSessions:number;
  delayedRecalls:number;
  latestSessionAt?:string;
}

export interface ListeningRecallCandidate {
  eventId:string;
  occurredAt:string;
  sourceDocumentIds:string[];
  synthesis:string;
  delayHours:number;
}

export async function listNativeListeningSources():Promise<NativeListeningSource[]>{
  const documents=await listPrivateDocuments(AUTHENTIC_ACCOUNT_ID);
  return documents.map((document)=>{
    const recordings=document.nativeAudioVariants?.length
      ?document.nativeAudioVariants
      :document.nativeAudio?[document.nativeAudio]:[];
    return {document,recordings};
  }).filter((item)=>item.recordings.length>0);
}

export async function getNativeListeningDepthSummary():Promise<NativeListeningDepthSummary>{
  const [sources,events]=await Promise.all([listNativeListeningSources(),listStudyEvents(AUTHENTIC_ACCOUNT_ID)]);
  const recordings=sources.flatMap((source)=>source.recordings);
  const sessions=events.filter((event)=>event.metadata?.p9NativeMultiSourceSynthesis===true);
  const recalls=events.filter((event)=>event.metadata?.p9NativeDelayedRecall===true);
  const speakers=new Set(recordings.map((audio)=>audio.speakerLabel??audio.credit).filter(Boolean));
  const registers=[...new Set(recordings.flatMap((audio)=>audio.register?[audio.register]:[]))].sort();
  const speechRates=[...new Set(recordings.flatMap((audio)=>audio.speechRate?[audio.speechRate]:[]))].sort();
  const latest=[...sessions].sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  return {
    sourceDocuments:sources.length,
    recordings:recordings.length,
    speakers:speakers.size,
    registers,speechRates,
    multiSourceSessions:sessions.length,
    delayedRecalls:recalls.length,
    ...(latest?{latestSessionAt:latest.occurredAt}:{})
  };
}

export async function recordNativeSourceNote(input:{documentId:string;recording:PrivateNativeAudio;note:string}):Promise<void>{
  const note=input.note.trim();if(!note)throw new Error("NATIVE_LISTENING_NOTE_REQUIRED");
  await saveStudyEvent(baseEvent({
    activity:"listening",
    primaryTarget:{kind:"document",id:input.documentId},
    promptFamily:"p9-native-listening-note",
    responseMode:"note",
    result:"skipped",
    contextId:"p9-native-listening",
    metadata:{
      p9NativeListening:true,
      p9NativeSourceNote:true,
      learnerNote:note,
      audioExternalId:input.recording.externalId??null,
      audioSpeechRate:input.recording.speechRate??null,
      audioRegister:input.recording.register??null,
      audioSpeakerLabel:input.recording.speakerLabel??null,
      audioCredit:input.recording.credit,
      modelFeedbackAppliedToMastery:false
    }
  }));
}

export async function recordMultiSourceListeningSynthesis(input:{sourceDocumentIds:string[];notes:Record<string,string>;synthesis:string}):Promise<string>{
  const ids=[...new Set(input.sourceDocumentIds.filter(Boolean))];
  if(ids.length<2)throw new Error("MULTI_SOURCE_LISTENING_REQUIRES_TWO_SOURCES");
  const synthesis=input.synthesis.trim();if(!synthesis)throw new Error("MULTI_SOURCE_SYNTHESIS_REQUIRED");
  const id=crypto.randomUUID();
  await saveStudyEvent(baseEvent({
    id,
    activity:"listening",
    primaryTarget:{kind:"document",id:ids[0]!},
    secondaryTargets:ids.slice(1).map((documentId)=>({kind:"document" as const,id:documentId})),
    promptFamily:"p9-native-multi-source-synthesis",
    responseMode:"textarea",
    result:"skipped",
    contextId:"p9-native-listening",
    metadata:{
      p9NativeListening:true,
      p9NativeMultiSourceSynthesis:true,
      sourceDocumentIds:ids,
      sourceNotes:Object.fromEntries(ids.map((documentId)=>[documentId,String(input.notes[documentId]??"").trim()])),
      learnerSynthesis:synthesis,
      semanticGrading:false,
      modelFeedbackAppliedToMastery:false
    }
  }));
  return id;
}

export async function getListeningRecallCandidates(now=new Date()):Promise<ListeningRecallCandidate[]>{
  const events=await listStudyEvents(AUTHENTIC_ACCOUNT_ID);
  const revised=new Set(events.filter((event)=>event.metadata?.p9NativeDelayedRecall===true&&typeof event.metadata?.recallOfEventId==="string")
    .map((event)=>String(event.metadata!.recallOfEventId)));
  return events.filter((event)=>event.metadata?.p9NativeMultiSourceSynthesis===true&&!revised.has(event.id))
    .map((event)=>{
      const age=(now.getTime()-Date.parse(event.occurredAt))/3_600_000;
      const ids=Array.isArray(event.metadata?.sourceDocumentIds)?event.metadata!.sourceDocumentIds.filter((id):id is string=>typeof id==="string"):[];
      return {
        eventId:event.id,occurredAt:event.occurredAt,sourceDocumentIds:ids,
        synthesis:typeof event.metadata?.learnerSynthesis==="string"?event.metadata.learnerSynthesis:"",
        delayHours:age
      };
    })
    .filter((item)=>Number.isFinite(item.delayHours)&&item.delayHours>=20)
    .sort((a,b)=>b.delayHours-a.delayHours);
}

export async function recordListeningDelayedRecall(input:{candidate:ListeningRecallCandidate;recall:string}):Promise<void>{
  const recall=input.recall.trim();if(!recall)throw new Error("LISTENING_DELAYED_RECALL_REQUIRED");
  const ids=input.candidate.sourceDocumentIds;
  if(ids.length<2)throw new Error("LISTENING_DELAYED_RECALL_SOURCES_REQUIRED");
  await saveStudyEvent(baseEvent({
    activity:"listening",
    primaryTarget:{kind:"document",id:ids[0]!},
    secondaryTargets:ids.slice(1).map((documentId)=>({kind:"document" as const,id:documentId})),
    promptFamily:"p9-native-delayed-recall",
    responseMode:"textarea",
    result:"skipped",
    contextId:"p9-native-listening",
    metadata:{
      p9NativeListening:true,
      p9NativeDelayedRecall:true,
      recallOfEventId:input.candidate.eventId,
      recallDelayHours:Math.round(input.candidate.delayHours),
      sourceDocumentIds:ids,
      learnerRecall:recall,
      originalSynthesisHiddenDuringRecall:true,
      semanticGrading:false,
      modelFeedbackAppliedToMastery:false
    }
  }));
}

function baseEvent(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),
    userId:AUTHENTIC_ACCOUNT_ID,
    deviceId:DEVICE_ID,
    occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,
    learnerModelVersion:"p9",
    ...input
  };
}

export function listeningRecallDelaySatisfied(first:string,second:string):boolean{
  return Date.parse(second)-Date.parse(first)>=DELAY_MS;
}
