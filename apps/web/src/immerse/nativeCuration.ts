import {
  listPrivateDocuments,listPrivateMediaReviews,savePrivateMediaReview,
  type PrivateDocumentRecord,type PrivateMediaReviewChecklist,type PrivateMediaReviewRecord,type PrivateMediaReviewStatus,type PrivateNativeAudio
} from "@thiepn/local-db";
import { AUTHENTIC_ACCOUNT_ID } from "./authentic";

export interface NativeCurationCandidate {
  document:PrivateDocumentRecord;
  recording:PrivateNativeAudio;
  recordingKey:string;
  review?:PrivateMediaReviewRecord;
  eligibleForPromotion:boolean;
  blockers:string[];
}

export interface NativeCurationSummary {
  documents:number;
  recordings:number;
  reviewed:number;
  verified:number;
  rejected:number;
  promotableDocuments:number;
  promotableRecordings:number;
  speakers:number;
  registers:string[];
  speechRates:string[];
}

export interface P10NativeCandidateManifest {
  schema:"thiepn-japanese-p10-native-candidates";
  schemaVersion:1;
  generatedAt:string;
  documents:Array<{
    id:string;
    title:string;
    text:string;
    sourceUrl:string;
    sourceLabel?:string;
    recordings:Array<{
      id:string;
      url:string;
      credit:string;
      licenseName:string;
      attributionUrl?:string;
      nativeSpeaker:true;
      speechRate:"slow"|"natural"|"fast";
      register:"casual"|"neutral"|"polite"|"formal";
      speakerLabel:string;
      verification:{
        reviewerLabel:string;
        reviewedAt:string;
        checklist:PrivateMediaReviewChecklist;
        notes?:string;
      };
    }>;
  }>;
}

export async function listNativeCurationCandidates():Promise<NativeCurationCandidate[]>{
  const [documents,reviews]=await Promise.all([
    listPrivateDocuments(AUTHENTIC_ACCOUNT_ID),
    listPrivateMediaReviews(AUTHENTIC_ACCOUNT_ID)
  ]);
  const reviewByKey=new Map(reviews.map((review)=>[review.documentId+"|"+review.recordingKey,review] as const));
  const candidates:NativeCurationCandidate[]=[];
  for(const document of documents){
    const recordings=document.nativeAudioVariants?.length?document.nativeAudioVariants:document.nativeAudio?[document.nativeAudio]:[];
    for(const recording of recordings){
      const recordingKey=recording.externalId?.trim()||recording.url.trim();
      const review=reviewByKey.get(document.id+"|"+recordingKey);
      const blockers=curationBlockers(document,recording,review);
      candidates.push({
        document,recording,recordingKey,...(review?{review}:{}),
        eligibleForPromotion:blockers.length===0,blockers
      });
    }
  }
  return candidates.sort((a,b)=>a.document.title.localeCompare(b.document.title)||a.recordingKey.localeCompare(b.recordingKey));
}

export async function saveNativeMediaReview(input:{
  documentId:string;
  recordingKey:string;
  reviewerLabel:string;
  status:PrivateMediaReviewStatus;
  checklist:PrivateMediaReviewChecklist;
  notes:string;
}):Promise<PrivateMediaReviewRecord>{
  const reviewerLabel=input.reviewerLabel.trim();
  if(!reviewerLabel)throw new Error("MEDIA_REVIEWER_REQUIRED");
  if(input.status==="verified"&&!allChecklistTrue(input.checklist))throw new Error("MEDIA_VERIFICATION_CHECKLIST_INCOMPLETE");
  const reviewedAt=new Date().toISOString();
  const record:PrivateMediaReviewRecord={
    id:reviewId(input.documentId,input.recordingKey),
    accountId:AUTHENTIC_ACCOUNT_ID,
    documentId:input.documentId,
    recordingKey:input.recordingKey,
    status:input.status,
    reviewerLabel,
    reviewedAt,
    checklist:{...input.checklist},
    ...(input.notes.trim()?{notes:input.notes.trim()}:{})
  };
  await savePrivateMediaReview(AUTHENTIC_ACCOUNT_ID,record);
  return record;
}

export function buildNativeCurationSummary(candidates:readonly NativeCurationCandidate[]):NativeCurationSummary{
  const promotable=candidates.filter((candidate)=>candidate.eligibleForPromotion);
  const speakers=new Set(promotable.map((candidate)=>candidate.recording.speakerLabel??candidate.recording.credit).filter(Boolean));
  return {
    documents:new Set(candidates.map((candidate)=>candidate.document.id)).size,
    recordings:candidates.length,
    reviewed:candidates.filter((candidate)=>Boolean(candidate.review)).length,
    verified:candidates.filter((candidate)=>candidate.review?.status==="verified").length,
    rejected:candidates.filter((candidate)=>candidate.review?.status==="rejected").length,
    promotableDocuments:new Set(promotable.map((candidate)=>candidate.document.id)).size,
    promotableRecordings:promotable.length,
    speakers:speakers.size,
    registers:[...new Set(promotable.flatMap((candidate)=>candidate.recording.register?[candidate.recording.register]:[]))].sort(),
    speechRates:[...new Set(promotable.flatMap((candidate)=>candidate.recording.speechRate?[candidate.recording.speechRate]:[]))].sort()
  };
}

export function buildP10NativeCandidateManifest(candidates:readonly NativeCurationCandidate[],now=new Date()):P10NativeCandidateManifest{
  const promotable=candidates.filter((candidate)=>candidate.eligibleForPromotion);
  const byDocument=new Map<string,NativeCurationCandidate[]>();
  for(const candidate of promotable){
    const list=byDocument.get(candidate.document.id)??[];list.push(candidate);byDocument.set(candidate.document.id,list);
  }
  return {
    schema:"thiepn-japanese-p10-native-candidates",schemaVersion:1,generatedAt:now.toISOString(),
    documents:[...byDocument.values()].map((items)=>{
      const document=items[0]!.document;
      if(!document.sourceUrl)throw new Error("PROMOTABLE_DOCUMENT_SOURCE_URL_REQUIRED:"+document.id);
      return {
        id:document.id,title:document.title,text:document.text,sourceUrl:document.sourceUrl,
        ...(document.sourceLabel?{sourceLabel:document.sourceLabel}:{}),
        recordings:items.map((candidate)=>{
          const recording=candidate.recording,review=candidate.review!;
          if(!recording.speechRate||!recording.register)throw new Error("PROMOTABLE_AUDIO_METADATA_INCOMPLETE:"+candidate.recordingKey);
          const speakerLabel=(recording.speakerLabel??recording.credit).trim();
          return {
            id:candidate.recordingKey,url:recording.url,credit:recording.credit,licenseName:recording.licenseName,
            ...(recording.attributionUrl?{attributionUrl:recording.attributionUrl}:{}),
            nativeSpeaker:true as const,speechRate:recording.speechRate,register:recording.register,speakerLabel,
            verification:{
              reviewerLabel:review.reviewerLabel,reviewedAt:review.reviewedAt,checklist:{...review.checklist},
              ...(review.notes?{notes:review.notes}:{})
            }
          };
        })
      };
    })
  };
}

export function serializeP10NativeCandidateManifest(manifest:P10NativeCandidateManifest):string{
  return JSON.stringify(manifest,null,2);
}

export function curationBlockers(document:PrivateDocumentRecord,recording:PrivateNativeAudio,review?:PrivateMediaReviewRecord):string[]{
  const blockers:string[]=[];
  if(!document.sourceUrl?.trim())blockers.push("document source URL missing");
  if(!recording.url?.trim())blockers.push("recording URL missing");
  if(!recording.credit?.trim())blockers.push("credit missing");
  if(!recording.licenseName?.trim())blockers.push("license missing");
  if(!recording.speechRate)blockers.push("source speech-rate label missing");
  if(!recording.register)blockers.push("register label missing");
  if(!(recording.speakerLabel??recording.credit).trim())blockers.push("speaker label/credit missing");
  if(!review)blockers.push("human verification missing");
  else{
    if(review.status!=="verified")blockers.push("review status is "+review.status);
    for(const [key,value] of Object.entries(review.checklist))if(!value)blockers.push("verification incomplete: "+key);
  }
  return blockers;
}

function allChecklistTrue(checklist:PrivateMediaReviewChecklist):boolean{
  return Object.values(checklist).every(Boolean);
}
function reviewId(documentId:string,recordingKey:string):string{
  return "media-review:"+documentId+":"+hashKey(recordingKey);
}
function hashKey(value:string):string{
  let hash=2166136261;
  for(let i=0;i<value.length;i+=1){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return (hash>>>0).toString(16).padStart(8,"0");
}
