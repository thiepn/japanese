import type { Lexeme } from "@thiepn/content-schema";
import { entityKey, type StudyEvent } from "@thiepn/domain";
import { replayStudyEvents } from "@thiepn/learner-engine";
import {
  listPrivateDocuments,listPrivateSentences,listPrivateVocabulary,listStudyEvents,savePrivateDocument,savePrivateSentence,savePrivateVocabulary,saveStudyEvent,
  type PrivateDocumentRecord,type PrivateDocumentSourceKind,type PrivateNativeAudio,type PrivateSentenceRecord,type PrivateVocabularyRecord
} from "@thiepn/local-db";
import { normalizeJapaneseSearch } from "@thiepn/search";
import { senseResolutionForIds,type MorphologyCandidate,type MorphologyResolution,type SenseResolution } from "@thiepn/japanese-nlp";
import { coreContent,senseForLexeme } from "../coreContent";
import { conjugateLexeme,type ConjugationForm } from "../study/conjugation";

export const AUTHENTIC_ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
const DEVICE_ID="p5-local-browser";
const FORMS:ConjugationForm[]=["polite_nonpast","polite_negative","polite_past","polite_past_negative","plain_negative","plain_past","te_form"];
const FUNCTION_WORDS=new Set(["は","が","を","に","で","と","も","へ","の","から","まで","より","か","ね","よ","ので","けど","が","て","たり","ながら","なら","たら","とき","前","後","そして","でも","しかし","また","です","ます","のに","ても","そう","らしい","みたい","はず","ため","よう","例えば","それでも"]);
const PUNCT=/^[\s。、！？!?「」『』（）()［］\[\]…・,.:;—–-]+$/u;

export type AuthenticTokenKind="known"|"function"|"unknown"|"punctuation";
export interface AuthenticToken {
  surface:string; kind:AuthenticTokenKind; lexemeId?:string; baseForm?:string; reading?:string; meaning?:string;
  resolution?: MorphologyResolution; senseIds?:string[]; senseResolution?:SenseResolution; resolutionConfidence?:number;
}
export interface AuthenticAnalysis {
  tokens:AuthenticToken[]; knownTokens:number; lexicalTokens:number; knownRatio:number; unknownDensity:number;
  unknownTypes:string[]; difficulty:"comfortable"|"stretch"|"hard";
}
export interface PrivateDocumentView {
  document:PrivateDocumentRecord; analysis:AuthenticAnalysis; readingMastery:number; listeningMastery:number;
}
export interface TatoebaImportResult {
  document:PrivateDocumentRecord; audioAccepted:boolean; audioRejectionReason?:string;
}

interface SurfaceCandidate { surface:string; lexeme:Lexeme; reading?:string; resolution:"canonical"|"generated"|"deinflected"; confidence:number; }
let surfaceCandidates:SurfaceCandidate[]|null=null;

export function normalizeImportedText(value:string,sourceKind:PrivateDocumentSourceKind):string{
  let text=value.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
  if(sourceKind==="subtitle")text=extractSubtitleText(text);
  return text.split("\n").map((line)=>line.trim()).filter(Boolean).join("\n").replace(/[ \t]+/g," ").trim();
}

export function extractSubtitleText(value:string):string{
  return value.replace(/^WEBVTT.*$/gim,"")
    .replace(/^\d+\s*$/gm,"")
    .replace(/^\s*\d{1,2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{3}.*$/gm,"")
    .replace(/^\s*\d{2}:\d{2}[.:]\d{3}\s*-->\s*\d{2}:\d{2}[.:]\d{3}.*$/gm,"")
    .replace(/<[^>]+>/g,"")
    .replace(/^[-–—]\s*/gm,"")
    .replace(/\{\\[^}]+\}/g,"");
}

export function analyzeAuthenticText(text:string):AuthenticAnalysis{
  const candidates=getSurfaceCandidates();
  const tokens:AuthenticToken[]=[];
  let offset=0;
  while(offset<text.length){
    const candidate=candidates.find((item)=>text.startsWith(item.surface,offset));
    if(candidate){
      const sense=senseForLexeme(candidate.lexeme);
      tokens.push({
        surface:candidate.surface,kind:"known",lexemeId:candidate.lexeme.id,baseForm:candidate.lexeme.canonicalForm,
        ...(candidate.reading?{reading:candidate.reading}:{}),meaning:sense.glosses.join(" / "),resolution:candidate.resolution,
        senseIds:candidate.lexeme.senseIds,senseResolution:senseResolutionForIds(candidate.lexeme.senseIds),resolutionConfidence:candidate.confidence
      });
      offset+=candidate.surface.length;continue;
    }
    const nextKnown=findNextKnownOffset(text,offset,candidates);
    const end=nextKnown<0?text.length:nextKnown;
    const chunk=text.slice(offset,end);
    tokens.push(...segmentUnknownChunk(chunk));
    offset=end;
  }
  const lexical=tokens.filter((token)=>token.kind==="known"||token.kind==="unknown");
  const known=lexical.filter((token)=>token.kind==="known").length;
  const ratio=lexical.length?known/lexical.length:1;
  const unknownTypes=[...new Set(lexical.filter((token)=>token.kind==="unknown").map((token)=>normalizeJapaneseSearch(token.surface)).filter(Boolean))];
  return {
    tokens,knownTokens:known,lexicalTokens:lexical.length,knownRatio:ratio,unknownDensity:1-ratio,unknownTypes,
    difficulty:ratio>=0.9?"comfortable":ratio>=0.75?"stretch":"hard"
  };
}

export async function createPrivateDocument(input:{title:string;text:string;sourceKind:PrivateDocumentSourceKind;sourceLabel?:string;sourceUrl?:string;nativeAudio?:PrivateNativeAudio}):Promise<PrivateDocumentRecord>{
  const now=new Date().toISOString();
  const normalized=normalizeImportedText(input.text,input.sourceKind);
  if(!normalized)throw new Error("EMPTY_IMPORT");
  const document:PrivateDocumentRecord={
    id:uuid("private-doc"),accountId:AUTHENTIC_ACCOUNT_ID,title:input.title.trim()||"Imported Japanese",sourceKind:input.sourceKind,
    text:normalized,importedAt:now,updatedAt:now,
    ...(input.sourceLabel?{sourceLabel:input.sourceLabel}:{}),...(input.sourceUrl?{sourceUrl:input.sourceUrl}:{}),...(input.nativeAudio?{nativeAudio:input.nativeAudio}:{})
  };
  await savePrivateDocument(AUTHENTIC_ACCOUNT_ID,document);
  return document;
}

export async function listPrivateDocumentViews():Promise<PrivateDocumentView[]>{
  const [documents,events]=await Promise.all([listPrivateDocuments(AUTHENTIC_ACCOUNT_ID),listStudyEvents(AUTHENTIC_ACCOUNT_ID)]);
  const state=replayStudyEvents(events);
  return documents.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map((document)=>({
    document,analysis:analyzeAuthenticText(document.text),
    readingMastery:state.mastery[entityKey({kind:"document",id:document.id},"comprehension")]?.estimate??0,
    listeningMastery:state.mastery[entityKey({kind:"document",id:document.id},"listening")]?.estimate??0
  }));
}

export async function saveUnknownAsPrivateVocabulary(input:{surface:string;meaning:string;reading?:string;documentId:string}):Promise<PrivateVocabularyRecord>{
  const canonical=input.surface.trim();const meaning=input.meaning.trim();if(!canonical||!meaning)throw new Error("PRIVATE_WORD_REQUIRES_FORM_AND_MEANING");
  const existing=(await listPrivateVocabulary(AUTHENTIC_ACCOUNT_ID)).find((item)=>normalizeJapaneseSearch(item.canonicalForm)===normalizeJapaneseSearch(canonical));
  const now=new Date().toISOString();
  const record:PrivateVocabularyRecord=existing?{
    ...existing,meaning,updatedAt:now,...(input.reading?.trim()?{reading:input.reading.trim()}:{}),
    sourceDocumentIds:[...new Set([...existing.sourceDocumentIds,input.documentId])]
  }:{
    id:"private-lex-"+stableHash(normalizeJapaneseSearch(canonical)),accountId:AUTHENTIC_ACCOUNT_ID,canonicalForm:canonical,
    ...(input.reading?.trim()?{reading:input.reading.trim()}:{}),meaning,sourceDocumentIds:[input.documentId],createdAt:now,updatedAt:now
  };
  await savePrivateVocabulary(AUTHENTIC_ACCOUNT_ID,record);
  await saveStudyEvent(eventBase({activity:"mining",primaryTarget:{kind:"lexeme",id:record.id},contextId:input.documentId,metadata:{surface:"authentic-reader",privateVocabulary:true,documentId:input.documentId}}));
  return record;
}

export async function mineKnownLexeme(documentId:string,lexemeId:string):Promise<void>{
  await saveStudyEvent(eventBase({activity:"mining",primaryTarget:{kind:"lexeme",id:lexemeId},contextId:documentId,metadata:{surface:"authentic-reader",documentId}}));
}

export function splitJapaneseSentences(text:string):string[]{
  return text.split(/(?<=[。！？!?])/u).map((item)=>item.trim()).filter((item)=>item.length>=3);
}

export async function minePrivateSentence(input:{documentId:string;text:string;translation:string}):Promise<PrivateSentenceRecord>{
  const text=input.text.trim();const translation=input.translation.trim();
  if(!text||!translation)throw new Error("PRIVATE_SENTENCE_REQUIRES_TEXT_AND_TRANSLATION");
  const normalized=normalizeJapaneseSearch(text);
  const existing=(await listPrivateSentences(AUTHENTIC_ACCOUNT_ID)).find((item)=>normalizeJapaneseSearch(item.text)===normalized);
  const now=new Date().toISOString();
  const record:PrivateSentenceRecord=existing?{
    ...existing,translation,updatedAt:now,sourceDocumentIds:[...new Set([...existing.sourceDocumentIds,input.documentId])]
  }:{
    id:"private-sentence-"+stableHash(normalized),accountId:AUTHENTIC_ACCOUNT_ID,text,translation,
    sourceDocumentIds:[input.documentId],createdAt:now,updatedAt:now
  };
  await savePrivateSentence(AUTHENTIC_ACCOUNT_ID,record);
  await saveStudyEvent(eventBase({activity:"mining",primaryTarget:{kind:"sentence",id:record.id},contextId:input.documentId,metadata:{surface:"authentic-reader",privateSentence:true,documentId:input.documentId}}));
  return record;
}

export async function recordShadowingResult(sentenceId:string,rating:1|2|3|4):Promise<void>{
  const result=rating>=3?"correct":rating===2?"partial":"incorrect";
  await saveStudyEvent(eventBase({
    activity:"speaking",primaryTarget:{kind:"sentence",id:sentenceId},skillDimension:"pronunciation",result,
    contextId:"shadowing-"+sentenceId,promptFamily:"listen-record-self-rate",responseMode:"recorded-self-review",
    confidence:rating/4,metadata:{surface:"shadowing-lab",selfRating:rating,acousticScore:false}
  }));
}

export async function recordPrivateReading(documentId:string):Promise<void>{
  await saveStudyEvent(eventBase({activity:"reading",primaryTarget:{kind:"document",id:documentId},contextId:documentId,metadata:{surface:"authentic-reader",exposure:true}}));
}
export async function recordPrivateListening(documentId:string,mode:"recorded"|"speech_synthesis"):Promise<void>{
  await saveStudyEvent(eventBase({activity:"listening",primaryTarget:{kind:"document",id:documentId},contextId:documentId,metadata:{surface:"authentic-listening",exposure:true,mode}}));
}
export async function recordPrivateComprehension(documentId:string,result:"correct"|"incorrect"):Promise<void>{
  await saveStudyEvent(eventBase({activity:"reading",primaryTarget:{kind:"document",id:documentId},skillDimension:"comprehension",result,contextId:documentId,promptFamily:"authentic-self-check",responseMode:"self_report",metadata:{surface:"authentic-reader"}}));
}

export async function importTatoebaSentence(sentenceId:string):Promise<TatoebaImportResult>{
  const id=sentenceId.trim().replace(/^#/,"");if(!/^\d+$/.test(id))throw new Error("TATOEBA_ID_REQUIRED");
  const response=await fetch(`https://api.tatoeba.org/v1/sentences/${id}?include=audios`);
  if(!response.ok)throw new Error("TATOEBA_FETCH_FAILED");
  const raw=await response.json() as Record<string,unknown>;
  const data=(raw.data&&typeof raw.data==="object"?raw.data:raw) as Record<string,unknown>;
  const lang=String(data.lang??data.language??"");
  if(lang&&lang!=="jpn"&&lang!=="ja")throw new Error("TATOEBA_SENTENCE_NOT_JAPANESE");
  const text=String(data.text??"").trim();if(!text)throw new Error("TATOEBA_TEXT_MISSING");
  const audios=Array.isArray(data.audios)?data.audios as Record<string,unknown>[]:[];
  let audio:PrivateNativeAudio|undefined;let rejection:string|undefined;
  for(const candidate of audios){
    const licenseName=String(candidate.license??candidate.license_name??"").trim();
    if(!licenseName){rejection="Audio has no reusable license declaration.";continue;}
    if(!isAllowedReusableAudioLicense(licenseName)){rejection=`Audio license ${licenseName} is not admitted by the public-app policy.`;continue;}
    const audioId=String(candidate.id??candidate.audio_id??"").trim();if(!audioId)continue;
    const author=String(candidate.author??candidate.username??candidate.user??"Tatoeba contributor");
    const attribution=String(candidate.attribution_url??candidate.attributionUrl??candidate.author_url??`https://tatoeba.org/en/audio/index/${audioId}`);
    audio={url:`https://tatoeba.org/audio/download/${audioId}`,credit:`Tatoeba recording by ${author}`,licenseName,attributionUrl:attribution,externalId:audioId};
    break;
  }
  const document=await createPrivateDocument({
    title:`Tatoeba #${id}`,text,sourceKind:"tatoeba",sourceLabel:"Tatoeba",
    sourceUrl:`https://tatoeba.org/en/sentences/show/${id}`,...(audio?{nativeAudio:audio}:{})
  });
  return {document,audioAccepted:Boolean(audio),...(audio?{}:{audioRejectionReason:rejection??"No audio was attached to this sentence."})};
}

export function isAllowedReusableAudioLicense(value:string):boolean{
  const normalized=value.toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
  if(!normalized)return false;
  if(normalized.includes(" noncommercial")||/\bnc\b/.test(normalized)||normalized.includes("no derivatives")||/\bnd\b/.test(normalized))return false;
  return normalized.includes("cc0")||normalized.includes("public domain")||normalized.includes("cc by")||normalized.includes("creative commons attribution");
}

function getSurfaceCandidates():SurfaceCandidate[]{
  if(surfaceCandidates)return surfaceCandidates;
  const result:SurfaceCandidate[]=[];
  for(const lexeme of coreContent.lexemes){
    const baseReading=lexeme.readings[0]?.text;
    const map=new Map<string,{reading?:string;resolution:"canonical"|"generated"|"deinflected";confidence:number}>();
    map.set(lexeme.canonicalForm,{...(baseReading?{reading:baseReading}:{}),resolution:"canonical",confidence:.99});
    for(const form of lexeme.forms)map.set(form.text,{...(baseReading?{reading:baseReading}:{}),resolution:"canonical",confidence:.98});
    for(const form of FORMS){
      const surface=conjugateLexeme(lexeme,form);if(!surface)continue;
      let reading=baseReading;
      if(baseReading&&lexeme.inflectionClass)reading=conjugateLexeme({...lexeme,canonicalForm:baseReading},form)??baseReading;
      map.set(surface,{...(reading?{reading}:{}),resolution:"generated",confidence:.91});
    }
    addA2SurfaceForms(lexeme,map,baseReading);
    addB1SurfaceForms(lexeme,map,baseReading);
    addB2SurfaceForms(lexeme,map,baseReading);
    for(const [surface,info] of map){
      if(surface.length<2&&/^[ぁ-ゖァ-ヶー]$/u.test(surface))continue;
      result.push({surface,lexeme,...(info.reading?{reading:info.reading}:{}),resolution:info.resolution,confidence:info.confidence});
    }
  }
  result.sort((a,b)=>b.surface.length-a.surface.length||a.surface.localeCompare(b.surface,"ja"));
  surfaceCandidates=result;return result;
}

function addA2SurfaceForms(lexeme:Lexeme,map:Map<string,{reading?:string;resolution:"canonical"|"generated"|"deinflected";confidence:number}>,reading?:string):void{
  const base=lexeme.canonicalForm;
  if(lexeme.inflectionClass==="ichidan"&&base.endsWith("る")){
    const stem=base.slice(0,-1);for(const ending of ["ています","ている","たい","たくない","やすい","にくい","すぎる","なければ","なくても"])map.set(stem+ending,{...(reading?{reading}:{}),resolution:"generated",confidence:.88});
  }
  if(lexeme.inflectionClass==="godan"){
    const last=base.slice(-1);const stem=base.slice(0,-1);
    const i:Record<string,string>={"う":"い","く":"き","ぐ":"ぎ","す":"し","つ":"ち","ぬ":"に","ぶ":"び","む":"み","る":"り"};
    const a:Record<string,string>={"う":"わ","く":"か","ぐ":"が","す":"さ","つ":"た","ぬ":"な","ぶ":"ば","む":"ま","る":"ら"};
    const im=i[last],am=a[last];
    if(im)for(const ending of ["たい","ながら","やすい","にくい","すぎる"])map.set(stem+im+ending,{...(reading?{reading}:{}),resolution:"generated",confidence:.88});
    if(am)for(const ending of ["なければ","なくても"])map.set(stem+am+ending,{...(reading?{reading}:{}),resolution:"generated",confidence:.88});
  }
  if(lexeme.inflectionClass==="i-adjective"){
    const stem=base.endsWith("い")?base.slice(0,-1):base;map.set(stem+"すぎる",{...(reading?{reading}:{}),resolution:"generated",confidence:.88});map.set(stem+"くなる",{...(reading?{reading}:{}),resolution:"generated",confidence:.88});
  }
  if(lexeme.inflectionClass==="na-adjective")map.set(base+"になる",{...(reading?{reading}:{}),resolution:"generated",confidence:.88});
}

function addB1SurfaceForms(lexeme:Lexeme,map:Map<string,{reading?:string;resolution:"canonical"|"generated"|"deinflected";confidence:number}>,reading?:string):void{
  const base=lexeme.canonicalForm;const add=(surface:string)=>map.set(surface,{...(reading?{reading}:{}),resolution:"deinflected",confidence:.78});
  if(lexeme.inflectionClass==="ichidan"&&base.endsWith("る")){
    const stem=base.slice(0,-1);
    for(const ending of ["られる","られます","させる","させます","よう","れば","たら","ても","そう","てしまう","ておく","てみる"])add(stem+ending);
  }else if(lexeme.inflectionClass==="godan"){
    const last=base.slice(-1),stem=base.slice(0,-1);
    const a:Record<string,string>={"う":"わ","く":"か","ぐ":"が","す":"さ","つ":"た","ぬ":"な","ぶ":"ば","む":"ま","る":"ら"};
    const e:Record<string,string>={"う":"え","く":"け","ぐ":"げ","す":"せ","つ":"て","ぬ":"ね","ぶ":"べ","む":"め","る":"れ"};
    const o:Record<string,string>={"う":"お","く":"こ","ぐ":"ご","す":"そ","つ":"と","ぬ":"の","ぶ":"ぼ","む":"も","る":"ろ"};
    if(a[last]){add(stem+a[last]+"れる");add(stem+a[last]+"れます");add(stem+a[last]+"せる");add(stem+a[last]+"せます");}
    if(e[last]){add(stem+e[last]+"る");add(stem+e[last]+"ます");add(stem+e[last]+"ば");}
    if(o[last])add(stem+o[last]+"う");
  }else if(lexeme.inflectionClass==="irregular-suru"&&base.endsWith("する")){
    const stem=base.slice(0,-2);for(const ending of ["できる","される","させる","しよう","すれば","したら","しても","してしまう","しておく","してみる"])add(stem+ending);
  }else if(lexeme.inflectionClass==="irregular-kuru"&&base.endsWith("来る")){
    for(const surface of ["来られる","来させる","来よう","来れば","来たら","来ても"])add(surface);
  }
}

function addB2SurfaceForms(lexeme:Lexeme,map:Map<string,{reading?:string;resolution:"canonical"|"generated"|"deinflected";confidence:number}>,reading?:string):void{
  const base=lexeme.canonicalForm;
  const add=(surface:string,confidence=.74)=>map.set(surface,{...(reading?{reading}:{}),resolution:"deinflected",confidence});
  if(lexeme.inflectionClass==="ichidan"&&base.endsWith("る")){
    const stem=base.slice(0,-1);
    for(const ending of ["させられる","られれば","られたら","ないで","ずに"])add(stem+ending);
    for(const ending of ["ことになる","ことにする","ようになる","ようにする"])add(base+ending);
  }else if(lexeme.inflectionClass==="godan"){
    const last=base.slice(-1),stem=base.slice(0,-1);
    const a:Record<string,string>={"う":"わ","く":"か","ぐ":"が","す":"さ","つ":"た","ぬ":"な","ぶ":"ば","む":"ま","る":"ら"};
    const i:Record<string,string>={"う":"い","く":"き","ぐ":"ぎ","す":"し","つ":"ち","ぬ":"に","ぶ":"び","む":"み","る":"り"};
    const e:Record<string,string>={"う":"え","く":"け","ぐ":"げ","す":"せ","つ":"て","ぬ":"ね","ぶ":"べ","む":"め","る":"れ"};
    if(a[last]){add(stem+a[last]+"せられる");add(stem+a[last]+"れれば");add(stem+a[last]+"ないで");add(stem+a[last]+"ずに");}
    if(e[last])add(stem+e[last]+"れば");
    add(base+"ことになる");add(base+"ことにする");add(base+"ようになる");add(base+"ようにする");
    if(i[last]){add(stem+i[last]+"つつ");add(stem+i[last]+"がち");}
  }else if(lexeme.inflectionClass==="irregular-suru"&&base.endsWith("する")){
    const stem=base.slice(0,-2);
    for(const ending of ["させられる","されれば","せずに","することになる","することにする","するようになる","するようにする"])add(stem+ending);
  }else if(lexeme.inflectionClass==="i-adjective"&&base.endsWith("い")){
    const stem=base.slice(0,-1);
    for(const ending of ["ければ","くても","くない","くなかった","さ"])add(stem+ending,.82);
  }else if(lexeme.inflectionClass==="na-adjective"){
    for(const ending of ["なら","ではない","だった","であれば","にもかかわらず"])add(base+ending,.8);
  }
}

export interface LocalSurfaceResolution extends MorphologyCandidate {
  lexemeId:string;
  baseForm:string;
}

export function resolveJapaneseSurface(surface:string):LocalSurfaceResolution|null{
  const normalized=normalizeJapaneseSearch(surface);
  const matches=getSurfaceCandidates().filter((candidate)=>normalizeJapaneseSearch(candidate.surface)===normalized);
  if(!matches.length)return null;
  matches.sort((a,b)=>b.confidence-a.confidence||a.lexeme.id.localeCompare(b.lexeme.id));
  const candidate=matches[0]!;
  return {
    surface:candidate.surface,lemma:candidate.lexeme.canonicalForm,baseForm:candidate.lexeme.canonicalForm,
    lexemeId:candidate.lexeme.id,senseIds:candidate.lexeme.senseIds,resolution:candidate.resolution,
    confidence:candidate.confidence,senseResolution:senseResolutionForIds(candidate.lexeme.senseIds)
  };
}

export function lemmatizeJapaneseSurface(surface:string):{lexemeId:string;baseForm:string;resolution:"canonical"|"generated"|"deinflected";senseIds:string[];senseResolution:SenseResolution;confidence:number}|null{
  const resolved=resolveJapaneseSurface(surface);
  if(!resolved||resolved.resolution==="provider")return null;
  return {lexemeId:resolved.lexemeId,baseForm:resolved.baseForm,resolution:resolved.resolution,senseIds:resolved.senseIds,senseResolution:resolved.senseResolution,confidence:resolved.confidence};
}

function findNextKnownOffset(text:string,start:number,candidates:SurfaceCandidate[]):number{
  for(let index=start+1;index<text.length;index++)if(candidates.some((item)=>text.startsWith(item.surface,index)))return index;
  return -1;
}

function segmentUnknownChunk(chunk:string):AuthenticToken[]{
  if(!chunk)return [];
  const Segmenter=(Intl as unknown as {Segmenter?:new(locale:string,options:{granularity:"word"})=>{segment(input:string):Iterable<{segment:string;isWordLike?:boolean}>}}).Segmenter;
  if(!Segmenter)return fallbackSegments(chunk);
  const segmenter=new Segmenter("ja",{granularity:"word"});
  const result:AuthenticToken[]=[];
  for(const item of segmenter.segment(chunk)){
    const surface=item.segment;if(!surface)continue;
    if(PUNCT.test(surface)){result.push({surface,kind:"punctuation"});continue;}
    if(FUNCTION_WORDS.has(surface)||item.isWordLike===false){result.push({surface,kind:"function"});continue;}
    const lemma=lemmatizeJapaneseSurface(surface);
    if(lemma){
      const lexeme=coreContent.lexemes.find((entry)=>entry.id===lemma.lexemeId);
      if(lexeme){const sense=senseForLexeme(lexeme);result.push({surface,kind:"known",lexemeId:lexeme.id,baseForm:lexeme.canonicalForm,...(lexeme.readings[0]?.text?{reading:lexeme.readings[0].text}:{}),meaning:sense.glosses.join(" / "),resolution:lemma.resolution,senseIds:lemma.senseIds,senseResolution:lemma.senseResolution,resolutionConfidence:lemma.confidence});continue;}
    }
    result.push({surface,kind:"unknown"});
  }
  return result;
}
function fallbackSegments(chunk:string):AuthenticToken[]{
  return Array.from(chunk).map((surface)=>PUNCT.test(surface)?{surface,kind:"punctuation" as const}:FUNCTION_WORDS.has(surface)?{surface,kind:"function" as const}:{surface,kind:"unknown" as const});
}
function stableHash(value:string):string{let h=2166136261;for(const ch of value){h^=ch.codePointAt(0)??0;h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
function uuid(prefix:string):string{return typeof crypto!=="undefined"&&"randomUUID" in crypto?`${prefix}-${crypto.randomUUID()}`:`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;}
function eventBase(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {id:uuid("p5"),userId:AUTHENTIC_ACCOUNT_ID,deviceId:DEVICE_ID,occurredAt:new Date().toISOString(),contentVersion:coreContent.version,learnerModelVersion:"p1.3",...input};
}
