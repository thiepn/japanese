import type { AudioAssetRecord, GrammarConcept, Lexeme, ReadingQuestion, ReadingText, Sentence } from "@thiepn/content-schema";
import { entityKey, type StudyEvent, type StudyResult } from "@thiepn/domain";
import { replayStudyEvents } from "@thiepn/learner-engine";
import { listStudyEvents, saveStudyEvent } from "@thiepn/local-db";
import { audioAsset, coreContent, grammarConcept, readingText, senseForLexeme, sentenceRecord } from "../coreContent";
import { getJapaneseDeviceId } from "../deviceIdentity";
import { conjugateLexeme, type ConjugationForm } from "../study/conjugation";
import { DEVELOPMENT_ACCOUNT_ID } from "../study/runtime";

const DEVICE_ID=getJapaneseDeviceId();
const FORMS:ConjugationForm[]=["polite_nonpast","polite_negative","polite_past","polite_past_negative","plain_negative","plain_past","te_form"];

export interface ReaderToken {
  surface:string;
  lexemeId?:string;
  reading?:string;
  meaning?:string;
}
export interface ReaderSentence {
  sentence:Sentence;
  tokens:ReaderToken[];
  grammar:GrammarConcept[];
}
export interface ReaderTextView {
  text:ReadingText;
  sentences:ReaderSentence[];
  joinedJapanese:string;
  audio?:AudioAssetRecord;
}
export interface ImmersionTextProgress {
  id:string;
  title:string;
  description:string;
  level:string;
  kind:ReadingText["kind"];
  estimatedMinutes:number;
  readiness:number;
  knownWords:number;
  totalWords:number;
  readingMastery:number;
  listeningMastery:number;
  readingEvidence:number;
  listeningEvidence:number;
}
export interface ImmersionProgress {
  texts:ImmersionTextProgress[];
  minedWords:number;
  lookups:number;
  readingChecks:number;
  listeningChecks:number;
}
export interface ReaderCheckResult {
  question:ReadingQuestion;
  result:StudyResult;
}

export function buildReaderText(textId:string):ReaderTextView{
  const text=readingText(textId);
  const sentences=text.sentenceIds.map((id)=>{
    const sentence=sentenceRecord(id);
    return {
      sentence,
      tokens:segmentSentence(sentence),
      grammar:sentence.grammarIds.map(grammarConcept)
    };
  });
  return {text,sentences,joinedJapanese:sentences.map((item)=>item.sentence.text).join(" "),...(text.audioAssetId?{audio:audioAsset(text.audioAssetId)}:{})};
}

export async function getImmersionProgress():Promise<ImmersionProgress>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const texts=coreContent.readingTexts.map((text)=>{
    const targets=[...new Set(text.targetLexemeIds)];
    const knownWords=targets.filter((id)=>(state.mastery[entityKey({kind:"lexeme",id},"meaning_recognition")]?.estimate??0)>=0.45).length;
    const reading=state.mastery[entityKey({kind:"text",id:text.id},"comprehension")];
    const listening=state.mastery[entityKey({kind:"text",id:text.id},"listening")];
    return {
      id:text.id,title:text.title,description:text.description,level:text.level,kind:text.kind,estimatedMinutes:text.estimatedMinutes,
      readiness:targets.length?knownWords/targets.length:1,knownWords,totalWords:targets.length,
      readingMastery:reading?.estimate??0,listeningMastery:listening?.estimate??0,
      readingEvidence:reading?.evidenceCount??0,listeningEvidence:listening?.evidenceCount??0
    };
  });
  return {
    texts,
    minedWords:new Set(events.filter((event)=>event.activity==="mining"&&event.primaryTarget?.kind==="lexeme").map((event)=>event.primaryTarget!.id)).size,
    lookups:events.filter((event)=>event.activity==="lookup"&&event.metadata?.surface==="reader").length,
    readingChecks:events.filter((event)=>event.activity==="reading"&&event.primaryTarget?.kind==="text"&&Boolean(event.result)).length,
    listeningChecks:events.filter((event)=>event.activity==="listening"&&event.primaryTarget?.kind==="text"&&Boolean(event.result)).length
  };
}

export async function recordReaderLookup(textId:string,sentenceId:string,lexemeId:string):Promise<void>{
  await saveStudyEvent(eventBase({
    activity:"lookup",primaryTarget:{kind:"lexeme",id:lexemeId},
    contextId:textId,metadata:{surface:"reader",textId,sentenceId}
  }));
}

export async function recordMinedWord(textId:string,sentenceId:string,lexemeId:string):Promise<void>{
  await saveStudyEvent(eventBase({
    activity:"mining",primaryTarget:{kind:"lexeme",id:lexemeId},
    contextId:textId,metadata:{surface:"reader",textId,sentenceId,mined:true}
  }));
}

export async function recordReadingExposure(textId:string):Promise<void>{
  await saveStudyEvent(eventBase({
    activity:"reading",primaryTarget:{kind:"text",id:textId},contextId:textId,
    metadata:{surface:"reader",textId,exposure:true}
  }));
}

export async function recordListeningExposure(textId:string,rate:number,mode:"recorded"|"speech_synthesis"="speech_synthesis"):Promise<void>{
  await saveStudyEvent(eventBase({
    activity:"listening",primaryTarget:{kind:"text",id:textId},contextId:textId,
    metadata:{surface:"connected-listening",textId,exposure:true,mode,rate}
  }));
}

export async function recordListeningSegmentReplay(textId:string,sentenceId:string,rate:number,repeats:number,mode:"recorded"|"speech_synthesis"):Promise<void>{
  await saveStudyEvent(eventBase({
    activity:"listening",primaryTarget:{kind:"text",id:textId},secondaryTargets:[{kind:"sentence",id:sentenceId}],contextId:textId,
    metadata:{surface:"connected-listening-segment",textId,sentenceId,replay:true,mode,rate,repeats}
  }));
}

export async function recordTextCheck(textId:string,mode:"reading"|"listening",questionId:string,result:StudyResult,response:string,responseTimeMs:number):Promise<void>{
  await saveStudyEvent(eventBase({
    activity:mode,primaryTarget:{kind:"text",id:textId},skillDimension:mode==="reading"?"comprehension":"listening",
    result,responseTimeMs,contextId:textId,promptFamily:mode==="reading"?"graded-reader-comprehension":"connected-listening-comprehension",
    responseMode:"choice",metadata:{surface:mode==="reading"?"reader-check":"connected-listening-check",textId,questionId,response}
  }));
}

export function gradeReadingQuestion(question:ReadingQuestion,response:string):ReaderCheckResult{
  return {question,result:response===question.answer?"correct":"incorrect"};
}

export function segmentSentence(sentence:Sentence):ReaderToken[]{
  const lexemeIds=[...new Set(sentence.entityRefs.filter((ref)=>ref.kind==="lexeme").map((ref)=>ref.id))];
  const candidates:{surface:string;lexeme:Lexeme;reading?:string}[]=[];
  for(const id of lexemeIds){
    const lexeme=coreContent.lexemes.find((item)=>item.id===id);
    if(!lexeme)continue;
    const baseReading=lexeme.readings[0]?.text;
    const surfaces=new Map<string,string|undefined>();
    surfaces.set(lexeme.canonicalForm,baseReading);
    for(const item of lexeme.forms)surfaces.set(item.text,baseReading);
    for(const form of FORMS){
      const generated=conjugateLexeme(lexeme,form);
      if(!generated)continue;
      let generatedReading=baseReading;
      if(baseReading&&lexeme.inflectionClass){
        generatedReading=conjugateLexeme({...lexeme,canonicalForm:baseReading},form)??baseReading;
      }
      surfaces.set(generated,generatedReading);
    }
    for(const [surface,reading] of surfaces){
      if(surface&&sentence.text.includes(surface))candidates.push({surface,lexeme,...(reading?{reading}:{})});
    }
  }
  candidates.sort((a,b)=>b.surface.length-a.surface.length||a.surface.localeCompare(b.surface,"ja"));
  const result:ReaderToken[]=[];
  let index=0;
  while(index<sentence.text.length){
    const match=candidates.find((candidate)=>sentence.text.startsWith(candidate.surface,index));
    if(match){
      const sense=senseForLexeme(match.lexeme);
      result.push({surface:match.surface,lexemeId:match.lexeme.id,...(match.reading?{reading:match.reading}:{}),meaning:sense.glosses.join(" / ")});
      index+=match.surface.length;
      continue;
    }
    let end=index+1;
    while(end<sentence.text.length&&!candidates.some((candidate)=>sentence.text.startsWith(candidate.surface,end)))end++;
    result.push({surface:sentence.text.slice(index,end)});
    index=end;
  }
  return result;
}

function eventBase(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:typeof crypto!=="undefined"&&"randomUUID" in crypto?crypto.randomUUID():`p3-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVICE_ID,occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,learnerModelVersion:"p1.3",...input
  };
}
