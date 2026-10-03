import type { PrivateDocumentRecord,PrivateNativeAudio } from "@thiepn/local-db";
import { createPrivateDocument,isAllowedReusableAudioLicense } from "./authentic";

export interface SourcePackManifest {
  id:string;
  title:string;
  version:string;
  language:"ja";
  sourceUrl:string;
  licenseName:string;
  attribution:string;
  redistributable:boolean;
}

export interface SourcePackItem {
  id:string;
  title:string;
  text:string;
  sourceUrl?:string;
  audio?:PrivateNativeAudio&{nativeSpeaker:boolean};
  audioVariants?:Array<PrivateNativeAudio&{nativeSpeaker:boolean}>;
}

export interface JapaneseSourcePack {
  manifest:SourcePackManifest;
  items:SourcePackItem[];
}

export interface SourcePackValidation {
  valid:boolean;
  errors:string[];
  warnings:string[];
}

export function parseJapaneseSourcePack(value:string|unknown):JapaneseSourcePack{
  const raw=typeof value==="string"?JSON.parse(value) as unknown:value;
  if(!raw||typeof raw!=="object")throw new Error("SOURCE_PACK_INVALID");
  const pack=raw as Partial<JapaneseSourcePack>;
  if(!pack.manifest||!Array.isArray(pack.items))throw new Error("SOURCE_PACK_STRUCTURE_INVALID");
  return pack as JapaneseSourcePack;
}

export function validateJapaneseSourcePack(pack:JapaneseSourcePack):SourcePackValidation{
  const errors:string[]=[];const warnings:string[]=[];
  const m=pack.manifest;
  if(!m.id?.trim())errors.push("Manifest id is required.");
  if(!m.title?.trim())errors.push("Manifest title is required.");
  if(!m.version?.trim())errors.push("Manifest version is required.");
  if(m.language!=="ja")errors.push("Source pack language must be ja.");
  if(!m.sourceUrl?.trim())errors.push("Source URL is required.");
  if(!m.licenseName?.trim())errors.push("Pack license is required.");
  if(m.redistributable!==true)errors.push("Only explicitly redistributable packs can be imported through the public source-pack route.");
  if(!isAllowedReusablePackLicense(m.licenseName))errors.push("Pack license is not admitted for redistributable source packs.");
  if(requiresAttribution(m.licenseName)&&!m.attribution?.trim())errors.push("Attribution text is required by this source-pack license.");
  if(!pack.items.length)errors.push("Source pack contains no items.");
  const ids=new Set<string>();
  for(const [index,item] of pack.items.entries()){
    const where="Item "+(index+1);
    if(!item.id?.trim())errors.push(where+" id is required.");
    else if(ids.has(item.id))errors.push("Duplicate item id: "+item.id);
    else ids.add(item.id);
    if(!item.title?.trim())errors.push(where+" title is required.");
    if(!item.text?.trim())errors.push(where+" Japanese text is required.");
    const recordings=[...(item.audio?[item.audio]:[]),...(item.audioVariants??[])];
    if(recordings.length){
      const variantKeys=new Set<string>();
      for(const [audioIndex,audio] of recordings.entries()){
        const audioWhere=where+" audio "+(audioIndex+1);
        validateAudio(audio,audioWhere,errors);
        const key=(audio.externalId??audio.url)+"|"+(audio.speechRate??"unspecified")+"|"+(audio.register??"unspecified");
        if(variantKeys.has(key))errors.push(audioWhere+" duplicates another audio variant identity.");
        variantKeys.add(key);
      }
      if(recordings.length>1&&!recordings.some((audio)=>audio.speechRate==="natural"))warnings.push(where+" has multiple audio variants but none explicitly marked speechRate:natural.");
    }else warnings.push(where+" has no reusable native recording; device voice may be used only as a labeled fallback.");
  }
  return {valid:errors.length===0,errors,warnings};
}

export async function importJapaneseSourcePack(pack:JapaneseSourcePack):Promise<PrivateDocumentRecord[]>{
  const validation=validateJapaneseSourcePack(pack);
  if(!validation.valid)throw new Error("SOURCE_PACK_REJECTED: "+validation.errors.join(" "));
  const documents:PrivateDocumentRecord[]=[];
  for(const item of pack.items){
    const rawRecordings=[...(item.audio?[item.audio]:[]),...(item.audioVariants??[])];
    const recordings=rawRecordings.map((audio)=>({
      url:audio.url,credit:audio.credit,licenseName:audio.licenseName,
      ...(audio.attributionUrl?{attributionUrl:audio.attributionUrl}:{}),
      ...(audio.externalId?{externalId:audio.externalId}:{}),
      ...(audio.segments?.length?{segments:audio.segments.map((segment)=>({...segment}))}:{}),
      ...(audio.speechRate?{speechRate:audio.speechRate}:{}),
      ...(audio.register?{register:audio.register}:{}),
      ...(audio.speakerLabel?{speakerLabel:audio.speakerLabel}:{})
    }));
    documents.push(await createPrivateDocument({
      title:item.title,text:item.text,sourceKind:"source_pack",
      sourceLabel:pack.manifest.title+" · "+pack.manifest.attribution,
      sourceUrl:item.sourceUrl??pack.manifest.sourceUrl,
      ...(recordings[0]?{nativeAudio:recordings[0]}:{}),
      ...(recordings.length?{nativeAudioVariants:recordings}:{})
    }));
  }
  return documents;
}

function validateAudio(audio:PrivateNativeAudio&{nativeSpeaker:boolean},where:string,errors:string[]):void{
  if(audio.nativeSpeaker!==true)errors.push(where+" must explicitly declare nativeSpeaker:true before it can be labeled native.");
  if(!audio.url?.trim())errors.push(where+" URL is required.");
  if(!audio.credit?.trim())errors.push(where+" credit is required.");
  if(!audio.licenseName?.trim()||!isAllowedReusableAudioLicense(audio.licenseName))errors.push(where+" license is missing or not admitted.");
  if(requiresAttribution(audio.licenseName)&&!audio.attributionUrl?.trim())errors.push(where+" attribution URL is required for this license.");
  if(audio.speechRate&&!["slow","natural","fast"].includes(audio.speechRate))errors.push(where+" has invalid speechRate.");
  if(audio.register&&!["casual","neutral","polite","formal"].includes(audio.register))errors.push(where+" has invalid register.");
  if(audio.segments){
    let previousEnd=-1;
    for(const [segmentIndex,segment] of audio.segments.entries()){
      const segmentWhere=where+" segment "+(segmentIndex+1);
      if(!segment.id?.trim())errors.push(segmentWhere+" id is required.");
      if(!segment.text?.trim())errors.push(segmentWhere+" text is required.");
      if(!Number.isFinite(segment.startMs)||!Number.isFinite(segment.endMs)||segment.startMs<0||segment.endMs<=segment.startMs)errors.push(segmentWhere+" has invalid timing.");
      if(segment.startMs<previousEnd)errors.push(segmentWhere+" overlaps or is out of order.");
      previousEnd=segment.endMs;
    }
  }
}

export function isAllowedReusablePackLicense(value:string):boolean{
  const normalized=value.toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
  if(!normalized)return false;
  if(/\bnc\b/.test(normalized)||normalized.includes("noncommercial")||/\bnd\b/.test(normalized)||normalized.includes("no derivatives"))return false;
  return normalized.includes("cc0")||normalized.includes("public domain")||normalized.includes("cc by")||normalized.includes("creative commons attribution");
}

function requiresAttribution(value:string):boolean{
  const normalized=value.toLowerCase();
  return !(normalized.includes("cc0")||normalized.includes("public domain"));
}
