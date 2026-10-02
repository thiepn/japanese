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
    if(item.audio){
      if(item.audio.nativeSpeaker!==true)errors.push(where+" audio must explicitly declare nativeSpeaker:true before it can be labeled native.");
      if(!item.audio.url?.trim())errors.push(where+" audio URL is required.");
      if(!item.audio.credit?.trim())errors.push(where+" audio credit is required.");
      if(!item.audio.licenseName?.trim()||!isAllowedReusableAudioLicense(item.audio.licenseName))errors.push(where+" audio license is missing or not admitted.");
      if(requiresAttribution(item.audio.licenseName)&&!item.audio.attributionUrl?.trim())errors.push(where+" audio attribution URL is required for this license.");
      if(item.audio.segments){
        let previousEnd=-1;
        for(const [segmentIndex,segment] of item.audio.segments.entries()){
          const segmentWhere=where+" audio segment "+(segmentIndex+1);
          if(!segment.id?.trim())errors.push(segmentWhere+" id is required.");
          if(!segment.text?.trim())errors.push(segmentWhere+" text is required.");
          if(!Number.isFinite(segment.startMs)||!Number.isFinite(segment.endMs)||segment.startMs<0||segment.endMs<=segment.startMs)errors.push(segmentWhere+" has invalid timing.");
          if(segment.startMs<previousEnd)errors.push(segmentWhere+" overlaps or is out of order.");
          previousEnd=segment.endMs;
        }
      }
    }else warnings.push(where+" has no reusable native recording; device voice may be used only as a labeled fallback.");
  }
  return {valid:errors.length===0,errors,warnings};
}

export async function importJapaneseSourcePack(pack:JapaneseSourcePack):Promise<PrivateDocumentRecord[]>{
  const validation=validateJapaneseSourcePack(pack);
  if(!validation.valid)throw new Error("SOURCE_PACK_REJECTED: "+validation.errors.join(" "));
  const documents:PrivateDocumentRecord[]=[];
  for(const item of pack.items){
    const nativeAudio=item.audio?{
      url:item.audio.url,credit:item.audio.credit,licenseName:item.audio.licenseName,
      ...(item.audio.attributionUrl?{attributionUrl:item.audio.attributionUrl}:{}),
      ...(item.audio.externalId?{externalId:item.audio.externalId}:{}),
      ...(item.audio.segments?.length?{segments:item.audio.segments.map((segment)=>({...segment}))}:{})
    }:undefined;
    documents.push(await createPrivateDocument({
      title:item.title,text:item.text,sourceKind:"source_pack",
      sourceLabel:pack.manifest.title+" · "+pack.manifest.attribution,
      sourceUrl:item.sourceUrl??pack.manifest.sourceUrl,
      ...(nativeAudio?{nativeAudio}:{})
    }));
  }
  return documents;
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
