import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { getC1EnvironmentProgress,type C1RegisteredSource,type C1WritingProjectProgress } from "./c1Environment";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

export type C1CitationStyle="japanese"|"apa"|"compact";
export type C1ExcerptAccess="private_reference"|"redistributable";
export type C1ReviewerRole="teacher"|"tutor"|"language_professional"|"peer_specialist";

export interface C1BibliographyRecord {
  sourceId:string;
  title:string;
  author?:string;
  organization:string;
  publishedDate?:string;
  accessedDate:string;
  containerTitle?:string;
  doi?:string;
  url:string;
  savedAt:string;
}

export interface C1SourceExcerpt {
  id:string;
  sourceId:string;
  locator:string;
  text:string;
  access:C1ExcerptAccess;
  licenseName?:string;
  licenseUrl?:string;
  savedAt:string;
}

export interface C1HumanReviewScores {
  argumentControl:number;
  sourceUse:number;
  languagePrecision:number;
  registerControl:number;
}

export interface C1ProjectHumanReview {
  id:string;
  projectId:string;
  projectTitle:string;
  reviewerName:string;
  reviewerRole:C1ReviewerRole;
  reviewedAt:string;
  scores:C1HumanReviewScores;
  feedback:string;
  blockingIssues:string[];
  draftOccurredAt:string;
  revisionOccurredAt:string;
}

export interface C1SpecialistTrack {
  id:string;
  title:string;
  domain:string;
  goal:string;
  sourceIds:string[];
  termIds:string[];
  projectIds:string[];
  createdAt:string;
}

export interface C1ResearchQualityProgress {
  bibliographyRecords:C1BibliographyRecord[];
  excerpts:C1SourceExcerpt[];
  humanReviews:C1ProjectHumanReview[];
  specialistTracks:C1SpecialistTrack[];
  bibliographySources:number;
  privateExcerpts:number;
  redistributableExcerpts:number;
  reviewedProjects:number;
  specialistDomains:number;
}

export interface C1ReviewPacket {
  schema:"thiepn-japanese-c1-review-p16-v1";
  generatedAt:string;
  project:{
    id:string;
    title:string;
    domain:string;
    deliverable:string;
    thesis:string;
    draft:{occurredAt:string;text:string};
    revision:{occurredAt:string;text:string};
    defenses:Array<{occurredAt:string;pressureType:string;response:string;inputMode:string}>;
  };
  sources:Array<{
    citationKey:string;
    title:string;
    publisher:string;
    genre:string;
    role:string;
    url:string;
    bibliography?:C1BibliographyRecord;
  }>;
  rubric:{
    argumentControl:string;
    sourceUse:string;
    languagePrecision:string;
    registerControl:string;
    scale:string;
  };
  evidenceBoundary:string;
}

export function formatC1Bibliography(record:C1BibliographyRecord,style:C1CitationStyle):string{
  const author=record.author?.trim()||record.organization;
  const year=record.publishedDate?.slice(0,4)||"n.d.";
  const container=record.containerTitle?.trim();
  const persistent=record.doi?.trim()?"https://doi.org/"+normalizeDoi(record.doi):record.url;
  if(style==="apa"){
    return author+" ("+year+"). "+record.title+(container?". "+container:"")+". "+persistent;
  }
  if(style==="compact"){
    return author+" — "+record.title+" — "+year+" — "+persistent;
  }
  return author+"（"+year+"）「"+record.title+"」"+(container?"『"+container+"』":"")+" "+persistent+"（閲覧日："+record.accessedDate+"）";
}

export function buildC1ReviewPacket(input:{
  project:C1WritingProjectProgress;
  sources:readonly C1RegisteredSource[];
  bibliography:readonly C1BibliographyRecord[];
  generatedAt?:string;
}):C1ReviewPacket{
  const {project}=input;
  if(!project.complete||!project.sourceMap||!project.draft||!project.revision){
    throw new Error("P16_REVIEW_PACKET_REQUIRES_COMPLETED_PROJECT");
  }
  const sourceRows=project.sourceMap.sourceIds.map((sourceId)=>{
    const source=input.sources.find((item)=>item.id===sourceId);
    if(!source)throw new Error("P16_REVIEW_PACKET_SOURCE_MISSING:"+sourceId);
    const bibliography=input.bibliography.find((item)=>item.sourceId===sourceId);
    return {
      citationKey:project.sourceMap!.citationKeys[sourceId]!,
      title:source.title,publisher:source.publisher,genre:source.genre,role:source.sourceRole,url:source.url,
      ...(bibliography?{bibliography}:{})
    };
  });
  return {
    schema:"thiepn-japanese-c1-review-p16-v1",
    generatedAt:input.generatedAt??new Date().toISOString(),
    project:{
      id:project.project.id,title:project.project.title,domain:project.project.domain,deliverable:project.project.deliverable,
      thesis:project.sourceMap.thesis,
      draft:{occurredAt:project.draft.occurredAt,text:project.draft.text},
      revision:{occurredAt:project.revision.occurredAt,text:project.revision.text},
      defenses:project.defenses.map((item)=>({occurredAt:item.occurredAt,pressureType:item.pressureType,response:item.response,inputMode:item.inputMode}))
    },
    sources:sourceRows,
    rubric:{
      argumentControl:"Does the argument remain precise, bounded and responsive to counterevidence?",
      sourceUse:"Are claims supported by sources whose role, limitations and conflicts are handled appropriately?",
      languagePrecision:"Is the Japanese lexically and grammatically precise enough for sustained advanced work?",
      registerControl:"Does register and rhetorical organization fit the intended audience and genre?",
      scale:"0 = not demonstrated, 1 = fragile, 2 = developing, 3 = strong, 4 = consistently strong"
    },
    evidenceBoundary:"Human review is external qualitative evidence. It does not automatically update FSRS mastery, award CEFR certification or convert reviewer judgment into learner truth."
  };
}

export async function saveC1BibliographyRecord(input:{
  sourceId:string;author?:string;publishedDate?:string;accessedDate:string;containerTitle?:string;doi?:string;
}):Promise<C1BibliographyRecord>{
  const environment=await getC1EnvironmentProgress();
  const source=environment.sources.find((item)=>item.id===input.sourceId);
  if(!source)throw new Error("UNKNOWN_P16_SOURCE:"+input.sourceId);
  const accessedDate=requireDate(input.accessedDate,"P16_BIBLIOGRAPHY_ACCESS_DATE_REQUIRED");
  const publishedDate=input.publishedDate?.trim();
  if(publishedDate&&Number.isNaN(Date.parse(publishedDate)))throw new Error("P16_BIBLIOGRAPHY_PUBLISHED_DATE_INVALID");
  const doi=input.doi?.trim();
  if(doi&&!normalizeDoi(doi).includes("/"))throw new Error("P16_BIBLIOGRAPHY_DOI_INVALID");
  const record:C1BibliographyRecord={
    sourceId:source.id,title:source.title,organization:source.publisher,accessedDate,url:source.url,savedAt:new Date().toISOString(),
    ...(input.author?.trim()?{author:input.author.trim()}:{}),
    ...(publishedDate?{publishedDate}:{}),
    ...(input.containerTitle?.trim()?{containerTitle:input.containerTitle.trim()}:{}),
    ...(doi?{doi:normalizeDoi(doi)}:{})
  };
  await saveStudyEvent(baseEvent({
    activity:"reading",primaryTarget:{kind:"document",id:source.id},promptFamily:"p16-c1-bibliography",responseMode:"metadata",
    result:"skipped",contextId:source.id,sourceId:source.id,
    metadata:{p16C1ResearchQuality:true,p16Bibliography:true,bibliography:record,semanticGrading:false,masteryUpdate:false}
  }));
  return record;
}

export async function saveC1SourceExcerpt(input:{
  sourceId:string;locator:string;text:string;access:C1ExcerptAccess;licenseName?:string;licenseUrl?:string;
}):Promise<C1SourceExcerpt>{
  const environment=await getC1EnvironmentProgress();
  const source=environment.sources.find((item)=>item.id===input.sourceId);
  if(!source)throw new Error("UNKNOWN_P16_SOURCE:"+input.sourceId);
  const locator=input.locator.trim(),text=input.text.trim();
  if(locator.length<2)throw new Error("P16_EXCERPT_LOCATOR_REQUIRED");
  if(text.length<40)throw new Error("P16_EXCERPT_TOO_SHORT");
  if(text.length>6000)throw new Error("P16_EXCERPT_TOO_LONG");
  const licenseName=input.licenseName?.trim(),licenseUrl=input.licenseUrl?.trim();
  if(input.access==="redistributable"){
    if(!licenseName)throw new Error("P16_REDISTRIBUTABLE_EXCERPT_LICENSE_REQUIRED");
    if(licenseUrl&&!isHttpsUrl(licenseUrl))throw new Error("P16_REDISTRIBUTABLE_EXCERPT_LICENSE_URL_INVALID");
  }
  const excerpt:C1SourceExcerpt={
    id:"p16-excerpt-"+crypto.randomUUID(),sourceId:source.id,locator,text,access,savedAt:new Date().toISOString(),
    ...(licenseName?{licenseName}:{}),...(licenseUrl?{licenseUrl}:{})
  };
  await saveStudyEvent(baseEvent({
    activity:"reading",primaryTarget:{kind:"document",id:source.id},promptFamily:"p16-c1-source-excerpt",responseMode:"learner-supplied-source",
    result:"skipped",contextId:source.id,sourceId:source.id,
    metadata:{
      p16C1ResearchQuality:true,p16SourceExcerpt:true,excerpt,
      privateOnly:input.access==="private_reference",redistributable:input.access==="redistributable",
      automaticallyFetched:false,semanticGrading:false,masteryUpdate:false
    }
  }));
  return excerpt;
}

export async function saveC1ProjectHumanReview(input:{
  projectId:string;reviewerName:string;reviewerRole:C1ReviewerRole;scores:C1HumanReviewScores;feedback:string;blockingIssues?:string[];
}):Promise<C1ProjectHumanReview>{
  const environment=await getC1EnvironmentProgress();
  const project=environment.projects.find((item)=>item.project.id===input.projectId);
  if(!project?.complete||!project.draft||!project.revision)throw new Error("P16_HUMAN_REVIEW_REQUIRES_COMPLETED_PROJECT");
  const reviewerName=input.reviewerName.trim(),feedback=input.feedback.trim();
  if(reviewerName.length<2)throw new Error("P16_REVIEWER_NAME_REQUIRED");
  if(feedback.length<80)throw new Error("P16_HUMAN_REVIEW_FEEDBACK_TOO_SHORT");
  validateScores(input.scores);
  const review:C1ProjectHumanReview={
    id:"p16-review-"+crypto.randomUUID(),projectId:project.project.id,projectTitle:project.project.title,
    reviewerName,reviewerRole:input.reviewerRole,reviewedAt:new Date().toISOString(),scores:{...input.scores},feedback,
    blockingIssues:(input.blockingIssues??[]).map((item)=>item.trim()).filter(Boolean).slice(0,12),
    draftOccurredAt:project.draft.occurredAt,revisionOccurredAt:project.revision.occurredAt
  };
  await saveStudyEvent(baseEvent({
    activity:"writing",primaryTarget:{kind:"production_task",id:project.project.id},promptFamily:"p16-c1-human-review",responseMode:"human-review",
    result:"skipped",contextId:project.project.id,
    metadata:{
      p16C1ResearchQuality:true,p16HumanReview:true,humanReview:review,
      externalHumanEvidence:true,masteryUpdate:false,accreditedCefrVerdict:false,semanticGrading:false
    }
  }));
  return review;
}

export async function saveC1SpecialistTrack(input:{
  title:string;domain:string;goal:string;sourceIds:string[];termIds:string[];projectIds:string[];
}):Promise<C1SpecialistTrack>{
  const environment=await getC1EnvironmentProgress();
  const title=input.title.trim(),domain=input.domain.trim(),goal=input.goal.trim();
  if(title.length<4)throw new Error("P16_TRACK_TITLE_TOO_SHORT");
  if(domain.length<2)throw new Error("P16_TRACK_DOMAIN_REQUIRED");
  if(goal.length<40)throw new Error("P16_TRACK_GOAL_TOO_SHORT");
  const sourceIds=[...new Set(input.sourceIds)].filter((id)=>environment.sources.some((item)=>item.id===id));
  const termIds=[...new Set(input.termIds)].filter((id)=>environment.specialistTermItems.some((item)=>item.id===id));
  const projectIds=[...new Set(input.projectIds)].filter((id)=>environment.projects.some((item)=>item.project.id===id));
  if(sourceIds.length+termIds.length+projectIds.length<3)throw new Error("P16_TRACK_NEEDS_THREE_EVIDENCE_LINKS");
  const track:C1SpecialistTrack={
    id:"p16-track-"+crypto.randomUUID(),title,domain,goal,sourceIds,termIds,projectIds,createdAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"reading",promptFamily:"p16-c1-specialist-track",responseMode:"track-plan",result:"skipped",contextId:track.id,
    metadata:{p16C1ResearchQuality:true,p16SpecialistTrack:true,specialistTrack:track,masteryUpdate:false,semanticGrading:false}
  }));
  return track;
}

export async function getC1ResearchQualityProgress():Promise<C1ResearchQualityProgress>{
  return buildC1ResearchQualityProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildC1ResearchQualityProgress(events:readonly StudyEvent[]):C1ResearchQualityProgress{
  const bibliographyRecords=latestBy<C1BibliographyRecord>(events,"p16Bibliography","bibliography","sourceId");
  const excerpts=allRecords<C1SourceExcerpt>(events,"p16SourceExcerpt","excerpt","id");
  const humanReviews=latestBy<C1ProjectHumanReview>(events,"p16HumanReview","humanReview","projectId");
  const specialistTracks=latestBy<C1SpecialistTrack>(events,"p16SpecialistTrack","specialistTrack","id");
  return {
    bibliographyRecords,excerpts,humanReviews,specialistTracks,
    bibliographySources:new Set(bibliographyRecords.map((item)=>item.sourceId)).size,
    privateExcerpts:excerpts.filter((item)=>item.access==="private_reference").length,
    redistributableExcerpts:excerpts.filter((item)=>item.access==="redistributable").length,
    reviewedProjects:new Set(humanReviews.map((item)=>item.projectId)).size,
    specialistDomains:new Set(specialistTracks.map((item)=>item.domain.toLowerCase())).size
  };
}

function latestBy<T extends object>(events:readonly StudyEvent[],flag:string,key:string,idKey:keyof T):T[]{
  const map=new Map<string,T>();
  for(const event of events.filter((item)=>item.metadata?.[flag]===true).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const raw=event.metadata?.[key];
    if(!raw||typeof raw!=="object")continue;
    const item=raw as T;
    const id=(item as Record<PropertyKey,unknown>)[idKey];
    if(typeof id==="string"&&id)map.set(id,item);
  }
  return [...map.values()].sort((a,b)=>recordTimestamp(b).localeCompare(recordTimestamp(a)));
}

function allRecords<T extends object>(events:readonly StudyEvent[],flag:string,key:string,idKey:keyof T):T[]{
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

function recordTimestamp(value:object):string{
  const record=value as Record<string,unknown>;
  const timestamp=record.savedAt??record.reviewedAt??record.createdAt;
  return typeof timestamp==="string"?timestamp:"";
}

function normalizeDoi(value:string):string{
  return value.trim().replace(/^https?:\/\/doi\.org\//i,"").replace(/^doi:\s*/i,"");
}

function requireDate(value:string,error:string):string{
  const trimmed=value.trim();
  if(!trimmed||Number.isNaN(Date.parse(trimmed)))throw new Error(error);
  return trimmed.slice(0,10);
}

function isHttpsUrl(value:string):boolean{
  try{return new URL(value).protocol==="https:";}catch{return false;}
}

function validateScores(scores:C1HumanReviewScores):void{
  for(const value of Object.values(scores)){
    if(!Number.isInteger(value)||value<0||value>4)throw new Error("P16_HUMAN_REVIEW_SCORE_OUT_OF_RANGE");
  }
}

function baseEvent(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,learnerModelVersion:"p16",...input
  };
}
