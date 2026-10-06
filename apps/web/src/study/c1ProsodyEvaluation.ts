import type { StudyEvent } from "@thiepn/domain";
import {
  deletePrivateProsodyCapture,listPrivateProsodyCaptures,savePrivateProsodyCapture,
  saveStudyEvent,listStudyEvents,type PrivateProsodyCaptureRecord
} from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { c1NativeSource,type C1NativeSource } from "./c1NativeDepth";
import { getC1PrecisionProgress } from "./c1Precision";
import { getC1AdvancedInteractionProgress } from "./c1AdvancedInteraction";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

export interface C1ProsodyTimingMetrics {
  durationMs:number;
  activeSpeechRatio:number;
  pauseRatio:number;
  longPauseCount:number;
  phraseCount:number;
  dynamicRangeDb:number;
  frameMs:number;
}

export type C1ProsodyTargetId="formal_chunking"|"contrast_repair"|"compressed_answer"|"floor_recovery";

export interface C1ProsodyTarget {
  id:C1ProsodyTargetId;
  title:string;
  situation:string;
  japanesePrompt:string;
  intendedControl:string[];
}

export const c1ProsodyTargets:C1ProsodyTarget[]=[
  {
    id:"formal_chunking",
    title:"Formal chunking without monotone delivery",
    situation:"Deliver a formal institutional statement with deliberate phrase boundaries instead of reading every clause at the same pace.",
    japanesePrompt:"本提案には一定の効果が期待できますが、現時点の資料だけで因果関係を断定することはできません。したがって、実施範囲を限定した上で検証を続け、一定期間後に見直す必要があります。",
    intendedControl:["phrase-boundary timing","controlled pausing","stable formal register"]
  },
  {
    id:"contrast_repair",
    title:"Prosodic contrast during repair",
    situation:"Correct an overgeneralization while making the preserved claim and the revised limitation audibly distinct.",
    japanesePrompt:"結論そのものを撤回するわけではありません。修正すべきなのは適用範囲です。全国一律に有効だとは言えませんが、条件を満たす地域では依然として有力な選択肢です。",
    intendedControl:["contrastive prominence","repair boundary","stance recalibration"]
  },
  {
    id:"compressed_answer",
    title:"Compressed answer under time pressure",
    situation:"Give a short answer whose conclusion, reason and caveat remain rhythmically separable despite time pressure.",
    japanesePrompt:"結論としては実施に賛成です。主な理由は既存データで一定の改善が確認されているからです。ただし対象数が限られるため、全国的な効果までは断定できません。",
    intendedControl:["compact phrasing","minimal hesitation","clear caveat boundary"]
  },
  {
    id:"floor_recovery",
    title:"Recover the floor without sounding aggressive",
    situation:"Re-enter after interruption, acknowledge the other speaker, then return to the unfinished point.",
    japanesePrompt:"ご指摘の点は重要です。ただ、先ほどの説明で一つだけ補足させてください。私が強調したかったのは結果そのものではなく、判断を見直す条件をあらかじめ明示しておく必要があるという点です。",
    intendedControl:["turn-entry timing","polite re-entry","controlled continuation"]
  }
];

export interface C1ProsodyCaptureEvidence {
  id:string;
  localCaptureId:string;
  targetId:C1ProsodyTargetId;
  transcript:string;
  selfReflection:string;
  metrics:C1ProsodyTimingMetrics;
  mimeType:string;
  sizeBytes:number;
  occurredAt:string;
}

export interface C1OverlapListeningTask {
  id:string;
  title:string;
  primarySourceId:string;
  maskerSourceId:string;
  primaryRate:number;
  maskerVolume:number;
  maskerDelayMs:number;
  focus:string;
}

export const c1OverlapListeningTasks:C1OverlapListeningTask[]=[
  {
    id:"p19-overlap-press-vs-memorial",
    title:"Press conference under competing formal speech",
    primarySourceId:"kantei-abe-20200828-press",
    maskerSourceId:"kantei-abe-20180311-memorial",
    primaryRate:1.05,maskerVolume:.28,maskerDelayMs:500,
    focus:"retain the primary speaker's claim, limitation and next action while a same-speaker formal register competes"
  },
  {
    id:"p19-overlap-policy-vs-press",
    title:"Policy address with fast press interference",
    primarySourceId:"kantei-ishiba-20250124-policy",
    maskerSourceId:"kantei-noda-20110902-inaugural-press",
    primaryRate:1.1,maskerVolume:.34,maskerDelayMs:350,
    focus:"track conditions and institutional responsibility under faster competing speech"
  },
  {
    id:"p19-overlap-public-communication",
    title:"Public briefing with overlapping announcement",
    primarySourceId:"govonline-suga-20201225-press",
    maskerSourceId:"govonline-suga-20190401-reiwa-press",
    primaryRate:1.0,maskerVolume:.4,maskerDelayMs:700,
    focus:"preserve speaker-specific structure and uncertainty while a related public register overlaps"
  },
  {
    id:"p19-overlap-fast-repair",
    title:"Fast source with delayed competing policy speech",
    primarySourceId:"kantei-kan-20110104-new-year-press",
    maskerSourceId:"kantei-ishiba-20241004-policy",
    primaryRate:1.15,maskerVolume:.32,maskerDelayMs:900,
    focus:"recover after missed material without inventing content that was not heard"
  }
];

export interface C1OverlapListeningAttempt {
  id:string;
  taskId:string;
  primarySourceId:string;
  maskerSourceId:string;
  recall:string;
  uncertainSegment:string;
  repairPlan:string;
  occurredAt:string;
}

export type C2ExternalReviewerRole="teacher"|"examiner"|"language_professional"|"native_specialist";
export type C2ExternalReviewModality="live_interview"|"recording_review"|"portfolio_review"|"combined";
export type C2ReviewDimension=
  |"lexicalPrecision"
  |"grammaticalControl"
  |"discourseOrganization"
  |"interactionRepair"
  |"registerFlexibility"
  |"prosodicControl"
  |"listeningUnderPressure";

export type C2ReviewScores=Record<C2ReviewDimension,number|null>;

export const c2ReviewScaleAnchors=[
  {score:0,label:"Breakdown",description:"The observed task could not be completed or control repeatedly broke down."},
  {score:1,label:"Fragile",description:"Some advanced behavior is visible, but frequent repair or support is needed."},
  {score:2,label:"Inconsistent",description:"The task is functional, but precision, flexibility or control is unstable under pressure."},
  {score:3,label:"Strong advanced",description:"Advanced control is generally effective, with noticeable limitations in demanding moments."},
  {score:4,label:"Consistently strong",description:"Control remains precise, flexible and effective across demanding observed evidence."},
  {score:5,label:"Exceptional observed control",description:"The observed evidence shows unusually effortless, precise and adaptable control; this is still not a CEFR certification verdict."}
] as const;

export interface C2ExternalHumanReview {
  id:string;
  reviewerLabel:string;
  reviewerRole:C2ExternalReviewerRole;
  modality:C2ExternalReviewModality;
  evidenceObserved:{
    longFormProduction:boolean;
    liveInteraction:boolean;
    audioProsody:boolean;
    overlapListening:boolean;
  };
  scores:C2ReviewScores;
  strengths:string;
  priorities:string;
  evidenceNotes:string;
  reviewedAt:string;
  scoreCoverage:number;
  broadCoverage:boolean;
}

export interface C2OrientedReviewPacket {
  schema:"thiepn-japanese-c2-oriented-review-packet";
  schemaVersion:1;
  generatedAt:string;
  orientation:"C2-oriented external qualitative review";
  evidenceBoundary:{
    accreditedCertification:false;
    reviewerIdentityVerified:false;
    scoresChangeMastery:false;
    timingIsFluencyScore:false;
    signalMetricsArePitchAccentScores:false;
    simulatedPressureIsNativeInteraction:false;
  };
  evidenceSummary:{
    precisionTransformations:number;
    sustainedSpecialistTracks:number;
    p18PressureTurns:number;
    p18RobustSessions:number;
    p18HumanInteractions:number;
    prosodyCaptures:number;
    overlapAttempts:number;
  };
  evidence:{
    precision:Array<{id:string;mode:string;originalText:string;revisedText:string;rationale:string;occurredAt:string}>;
    specialistDiscourse:Array<{id:string;trackId:string;stageId:string;response:string;inputMode:string;occurredAt:string}>;
    livePressure:Array<{id:string;pressureType:string;committedStatement:string;pressureResponse:string;inputMode:string;responseSeconds:number;occurredAt:string}>;
    humanInteraction:Array<{id:string;medium:string;partnerProfile:string;durationMinutes:number;domain:string;interactionSummary:string;difficultMoment:string;repairUsed:string;reflection:string;occurredAt:string}>;
    prosody:Array<{id:string;localCaptureId:string;targetId:string;transcript:string;selfReflection:string;metrics:C1ProsodyTimingMetrics;occurredAt:string;rawAudioLocalOnly:true}>;
    overlapListening:Array<{id:string;taskId:string;recall:string;uncertainSegment:string;repairPlan:string;occurredAt:string}>;
  };
  reviewerInstructions:string[];
  scaleAnchors:typeof c2ReviewScaleAnchors;
  rubric:Array<{dimension:C2ReviewDimension;prompt:string;scale:"0-5 or not observed"}>;
}

export interface C1ProsodyEvaluationProgress {
  activeDays:number;
  prosodyCaptures:C1ProsodyCaptureEvidence[];
  overlapAttempts:C1OverlapListeningAttempt[];
  externalReviews:C2ExternalHumanReview[];
  prosodyTargets:number;
  overlapTasks:number;
  reviewedSessions:number;
  broadlyCoveredReviews:number;
  localCaptureCount:number;
}

export function analyzeAmplitudeEnvelope(samples:Float32Array,sampleRate:number,frameMs=20):C1ProsodyTimingMetrics{
  if(!Number.isFinite(sampleRate)||sampleRate<=0)throw new Error("P19_SAMPLE_RATE_INVALID");
  if(!samples.length)return {durationMs:0,activeSpeechRatio:0,pauseRatio:0,longPauseCount:0,phraseCount:0,dynamicRangeDb:0,frameMs};
  const frameSize=Math.max(1,Math.round(sampleRate*frameMs/1000));
  const rms:number[]=[];
  for(let start=0;start<samples.length;start+=frameSize){
    const end=Math.min(samples.length,start+frameSize);
    let sum=0;
    for(let index=start;index<end;index++){const value=samples[index]??0;sum+=value*value;}
    rms.push(Math.sqrt(sum/Math.max(1,end-start)));
  }
  const sorted=[...rms].sort((a,b)=>a-b);
  const q=(ratio:number)=>sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*ratio))]??0;
  const noiseFloor=q(.2),upper=q(.95);
  const threshold=Math.max(.006,noiseFloor*2.6,upper*.07);
  const active=rms.map((value)=>value>threshold);
  const activeCount=active.filter(Boolean).length;
  const first=active.findIndex(Boolean);
  let last=-1;
  for(let index=active.length-1;index>=0;index--){if(active[index]){last=index;break;}}
  let inactiveWithin=0,longPauseCount=0,phraseCount=activeCount?1:0;
  if(first>=0&&last>=first){
    let run=0;
    for(let index=first;index<=last;index++){
      if(active[index]){
        if(run*frameMs>=300){longPauseCount++;phraseCount++;}
        run=0;
      }else{run++;inactiveWithin++;}
    }
  }
  const activeValues=rms.filter((_,index)=>active[index]).sort((a,b)=>a-b);
  const aq=(ratio:number)=>activeValues[Math.min(activeValues.length-1,Math.floor((activeValues.length-1)*ratio))]??0;
  const low=aq(.1),high=aq(.9);
  const dynamicRangeDb=low>0&&high>low?Math.min(60,Math.max(0,20*Math.log10(high/low))):0;
  const spanFrames=first>=0&&last>=first?last-first+1:0;
  return {
    durationMs:Math.round(samples.length/sampleRate*1000),
    activeSpeechRatio:round3(activeCount/active.length),
    pauseRatio:round3(spanFrames?inactiveWithin/spanFrames:0),
    longPauseCount,phraseCount,
    dynamicRangeDb:Math.round(dynamicRangeDb*10)/10,
    frameMs
  };
}

export async function saveC1ProsodyCapture(input:{
  targetId:C1ProsodyTargetId;audioBlob:Blob;metrics:C1ProsodyTimingMetrics;transcript:string;selfReflection:string;
}):Promise<C1ProsodyCaptureEvidence>{
  const target=c1ProsodyTargets.find((item)=>item.id===input.targetId);
  if(!target)throw new Error("P19_PROSODY_TARGET_INVALID");
  const transcript=input.transcript.trim(),selfReflection=input.selfReflection.trim();
  if(input.audioBlob.size<=0||input.audioBlob.size>20_000_000)throw new Error("P19_AUDIO_SIZE_INVALID");
  if(input.metrics.durationMs<1500||input.metrics.durationMs>180_000)throw new Error("P19_AUDIO_DURATION_INVALID");
  if(transcript.length<40)throw new Error("P19_PROSODY_TRANSCRIPT_TOO_SHORT");
  if(selfReflection.length<80)throw new Error("P19_PROSODY_REFLECTION_TOO_SHORT");
  const now=new Date().toISOString();
  const localCaptureId="p19-audio-"+crypto.randomUUID();
  const local:PrivateProsodyCaptureRecord={
    id:localCaptureId,accountId:DEVELOPMENT_ACCOUNT_ID,createdAt:now,updatedAt:now,
    mimeType:input.audioBlob.type||"audio/webm",audioBlob:input.audioBlob,sizeBytes:input.audioBlob.size,
    durationMs:input.metrics.durationMs,activeSpeechRatio:input.metrics.activeSpeechRatio,pauseRatio:input.metrics.pauseRatio,
    longPauseCount:input.metrics.longPauseCount,phraseCount:input.metrics.phraseCount,dynamicRangeDb:input.metrics.dynamicRangeDb,
    targetLabel:target.title
  };
  await savePrivateProsodyCapture(DEVELOPMENT_ACCOUNT_ID,local);
  const evidence:C1ProsodyCaptureEvidence={
    id:"p19-prosody-"+crypto.randomUUID(),localCaptureId,targetId:target.id,transcript,selfReflection,metrics:input.metrics,
    mimeType:local.mimeType,sizeBytes:local.sizeBytes,occurredAt:now
  };
  try{
    await saveStudyEvent(baseEvent({
      activity:"speaking",promptFamily:"p19-c1-prosody-capture",responseMode:"local-audio-capture",result:"skipped",
      contextId:target.id,
      metadata:{
        p19ProsodyEvaluation:true,p19ProsodyCapture:true,prosodyCapture:evidence,
        audioStoredLocalOnly:true,actualAudioSignalAnalyzed:true,
        timingEnvelopeOnly:true,pitchAccentScore:false,intonationCorrectnessScore:false,
        semanticGrading:false,masteryUpdate:false,accreditedCefrVerdict:false
      }
    }));
  }catch(error){
    await deletePrivateProsodyCapture(DEVELOPMENT_ACCOUNT_ID,localCaptureId).catch(()=>undefined);
    throw error;
  }
  return evidence;
}

export async function listLocalP19ProsodyCaptures():Promise<PrivateProsodyCaptureRecord[]>{
  return (await listPrivateProsodyCaptures(DEVELOPMENT_ACCOUNT_ID)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}

export async function deleteLocalP19ProsodyCapture(id:string):Promise<void>{
  await deletePrivateProsodyCapture(DEVELOPMENT_ACCOUNT_ID,id);
}

export function overlapTask(id:string):C1OverlapListeningTask{
  const task=c1OverlapListeningTasks.find((item)=>item.id===id);
  if(!task)throw new Error("UNKNOWN_P19_OVERLAP_TASK:"+id);
  const primary=c1NativeSource(task.primarySourceId),masker=c1NativeSource(task.maskerSourceId);
  if(!primary.verified||!masker.verified)throw new Error("P19_OVERLAP_SOURCE_NOT_VERIFIED");
  return task;
}

export function overlapSources(task:C1OverlapListeningTask):{primary:C1NativeSource;masker:C1NativeSource}{
  return {primary:c1NativeSource(task.primarySourceId),masker:c1NativeSource(task.maskerSourceId)};
}

export async function saveC1OverlapListeningAttempt(input:{
  taskId:string;recall:string;uncertainSegment:string;repairPlan:string;
}):Promise<C1OverlapListeningAttempt>{
  const task=overlapTask(input.taskId);
  const recall=input.recall.trim(),uncertainSegment=input.uncertainSegment.trim(),repairPlan=input.repairPlan.trim();
  if(recall.length<100)throw new Error("P19_OVERLAP_RECALL_TOO_SHORT");
  if(uncertainSegment.length<50)throw new Error("P19_OVERLAP_UNCERTAINTY_TOO_SHORT");
  if(repairPlan.length<50)throw new Error("P19_OVERLAP_REPAIR_TOO_SHORT");
  const attempt:C1OverlapListeningAttempt={
    id:"p19-overlap-"+crypto.randomUUID(),taskId:task.id,primarySourceId:task.primarySourceId,maskerSourceId:task.maskerSourceId,
    recall,uncertainSegment,repairPlan,occurredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"listening",primaryTarget:{kind:"document",id:task.primarySourceId},
    secondaryTargets:[{kind:"document",id:task.maskerSourceId}],
    promptFamily:"p19-c1-overlap-listening",responseMode:"artificial-overlap-mix",result:"skipped",contextId:task.id,
    metadata:{
      p19ProsodyEvaluation:true,p19OverlapListening:true,overlapAttempt:attempt,
      artificialOverlapMix:true,bothSourcesRepositoryVerified:true,
      playbackRate:task.primaryRate,maskerVolume:task.maskerVolume,maskerDelayMs:task.maskerDelayMs,
      semanticGrading:false,comprehensionMastery:false,masteryUpdate:false
    }
  }));
  return attempt;
}

export function reviewScoreCoverage(scores:C2ReviewScores):number{
  return Object.values(scores).filter((value)=>typeof value==="number").length;
}

export function isBroadC2ReviewCoverage(review:Pick<C2ExternalHumanReview,"scores"|"evidenceObserved">):boolean{
  const coverage=reviewScoreCoverage(review.scores);
  return coverage>=6&&review.evidenceObserved.longFormProduction&&review.evidenceObserved.liveInteraction
    &&review.evidenceObserved.audioProsody&&review.evidenceObserved.overlapListening;
}

export async function saveC2ExternalHumanReview(input:{
  reviewerLabel:string;reviewerRole:C2ExternalReviewerRole;modality:C2ExternalReviewModality;
  evidenceObserved:C2ExternalHumanReview["evidenceObserved"];scores:C2ReviewScores;
  strengths:string;priorities:string;evidenceNotes:string;
}):Promise<C2ExternalHumanReview>{
  const reviewerLabel=input.reviewerLabel.trim(),strengths=input.strengths.trim(),priorities=input.priorities.trim(),evidenceNotes=input.evidenceNotes.trim();
  if(reviewerLabel.length<2)throw new Error("P19_REVIEWER_REQUIRED");
  for(const value of Object.values(input.scores)){
    if(value!==null&&(!Number.isInteger(value)||value<0||value>5))throw new Error("P19_REVIEW_SCORE_INVALID");
  }
  const scoreCoverage=reviewScoreCoverage(input.scores);
  if(scoreCoverage<4)throw new Error("P19_REVIEW_COVERAGE_TOO_LOW");
  if(strengths.length<100||priorities.length<100||evidenceNotes.length<120)throw new Error("P19_REVIEW_COMMENT_TOO_SHORT");
  const partial={scores:input.scores,evidenceObserved:input.evidenceObserved};
  const review:C2ExternalHumanReview={
    id:"p19-external-review-"+crypto.randomUUID(),reviewerLabel,reviewerRole:input.reviewerRole,modality:input.modality,
    evidenceObserved:input.evidenceObserved,scores:input.scores,strengths,priorities,evidenceNotes,
    reviewedAt:new Date().toISOString(),scoreCoverage,broadCoverage:isBroadC2ReviewCoverage(partial)
  };
  await saveStudyEvent(baseEvent({
    activity:"speaking",promptFamily:"p19-c2-oriented-external-human-review",responseMode:"external-human-rubric",result:"skipped",
    contextId:review.id,
    metadata:{
      p19ProsodyEvaluation:true,p19ExternalC2Review:true,externalC2Review:review,
      externalHumanEvidence:true,reviewerIdentityVerified:false,c2OrientedNotCertified:true,
      humanReviewChangesMastery:false,masteryUpdate:false,accreditedCefrVerdict:false
    }
  }));
  return review;
}

export async function buildC2OrientedReviewPacket(now=new Date()):Promise<C2OrientedReviewPacket>{
  const [precision,interaction,p19]=await Promise.all([getC1PrecisionProgress(),getC1AdvancedInteractionProgress(),getC1ProsodyEvaluationProgress()]);
  return {
    schema:"thiepn-japanese-c2-oriented-review-packet",schemaVersion:1,generatedAt:now.toISOString(),
    orientation:"C2-oriented external qualitative review",
    evidenceBoundary:{
      accreditedCertification:false,reviewerIdentityVerified:false,scoresChangeMastery:false,
      timingIsFluencyScore:false,signalMetricsArePitchAccentScores:false,simulatedPressureIsNativeInteraction:false
    },
    evidenceSummary:{
      precisionTransformations:precision.precisionArtifacts.length,
      sustainedSpecialistTracks:precision.sustainedSpecialistTracks,
      p18PressureTurns:interaction.turns.length,
      p18RobustSessions:interaction.robustSessions,
      p18HumanInteractions:interaction.humanInteractions.length,
      prosodyCaptures:p19.prosodyCaptures.length,
      overlapAttempts:p19.overlapAttempts.length
    },
    evidence:{
      precision:precision.precisionArtifacts.slice(-6).map((item)=>({
        id:item.id,mode:item.mode,originalText:item.originalText,revisedText:item.revisedText,rationale:item.rationale,occurredAt:item.occurredAt
      })),
      specialistDiscourse:precision.specialistTurns.slice(-10).map((item)=>({
        id:item.id,trackId:item.trackId,stageId:item.stageId,response:item.response,inputMode:item.inputMode,occurredAt:item.occurredAt
      })),
      livePressure:interaction.turns.slice(-10).map((item)=>({
        id:item.id,pressureType:item.pressureType,committedStatement:item.committedStatement,pressureResponse:item.pressureResponse,
        inputMode:item.inputMode,responseSeconds:item.responseSeconds,occurredAt:item.occurredAt
      })),
      humanInteraction:interaction.humanInteractions.slice(-6).map((item)=>({
        id:item.id,medium:item.medium,partnerProfile:item.partnerProfile,durationMinutes:item.durationMinutes,domain:item.domain,
        interactionSummary:item.interactionSummary,difficultMoment:item.difficultMoment,repairUsed:item.repairUsed,reflection:item.reflection,occurredAt:item.occurredAt
      })),
      prosody:p19.prosodyCaptures.slice(-8).map((item)=>({
        id:item.id,localCaptureId:item.localCaptureId,targetId:item.targetId,transcript:item.transcript,selfReflection:item.selfReflection,
        metrics:item.metrics,occurredAt:item.occurredAt,rawAudioLocalOnly:true as const
      })),
      overlapListening:p19.overlapAttempts.slice(-8).map((item)=>({
        id:item.id,taskId:item.taskId,recall:item.recall,uncertainSegment:item.uncertainSegment,repairPlan:item.repairPlan,occurredAt:item.occurredAt
      }))
    },
    reviewerInstructions:[
      "Score only dimensions you directly observed; use not observed rather than inference.",
      "Treat raw P19 audio as separate local evidence. The packet carries timing metadata and transcript/reflection, not the recording blob.",
      "Anchor strengths and priorities in specific learner evidence rather than a global CEFR label.",
      "Do not interpret this packet as an accredited C2 examination or as permission to update learner mastery."
    ],
    scaleAnchors:c2ReviewScaleAnchors,
    rubric:[
      {dimension:"lexicalPrecision",prompt:"How precisely does the learner choose and distinguish advanced lexical items without unnecessary vagueness?",scale:"0-5 or not observed"},
      {dimension:"grammaticalControl",prompt:"How consistently does complex grammar remain controlled under sustained production and pressure?",scale:"0-5 or not observed"},
      {dimension:"discourseOrganization",prompt:"How effectively are long turns structured, compressed, expanded and synthesized for the task?",scale:"0-5 or not observed"},
      {dimension:"interactionRepair",prompt:"How naturally does the learner clarify, reformulate, recover the floor and respond to misunderstanding or challenge?",scale:"0-5 or not observed"},
      {dimension:"registerFlexibility",prompt:"How well does the learner shift audience, formality and stance without distorting the underlying claim?",scale:"0-5 or not observed"},
      {dimension:"prosodicControl",prompt:"When actual audio/live speech is observed, how effectively do timing, phrasing, pausing and prominence support intelligibility and discourse control?",scale:"0-5 or not observed"},
      {dimension:"listeningUnderPressure",prompt:"When demanding listening is directly observed, how well does the learner recover from overlap, speed, uncertainty and missed material without inventing content?",scale:"0-5 or not observed"}
    ]
  };
}

export async function getC1ProsodyEvaluationProgress():Promise<C1ProsodyEvaluationProgress>{
  const [events,localCaptures]=await Promise.all([listStudyEvents(DEVELOPMENT_ACCOUNT_ID),listPrivateProsodyCaptures(DEVELOPMENT_ACCOUNT_ID)]);
  return buildC1ProsodyEvaluationProgress(events,localCaptures.length);
}

export function buildC1ProsodyEvaluationProgress(events:readonly StudyEvent[],localCaptureCount=0):C1ProsodyEvaluationProgress{
  const prosodyCaptures=recordsFromEvents<C1ProsodyCaptureEvidence>(events,"p19ProsodyCapture","prosodyCapture","id");
  const overlapAttempts=recordsFromEvents<C1OverlapListeningAttempt>(events,"p19OverlapListening","overlapAttempt","id");
  const externalReviews=recordsFromEvents<C2ExternalHumanReview>(events,"p19ExternalC2Review","externalC2Review","id");
  const p19Events=events.filter((item)=>item.metadata?.p19ProsodyEvaluation===true);
  return {
    activeDays:new Set(p19Events.map((item)=>item.occurredAt.slice(0,10))).size,
    prosodyCaptures,overlapAttempts,externalReviews,
    prosodyTargets:new Set(prosodyCaptures.map((item)=>item.targetId)).size,
    overlapTasks:new Set(overlapAttempts.map((item)=>item.taskId)).size,
    reviewedSessions:externalReviews.length,
    broadlyCoveredReviews:externalReviews.filter((item)=>item.broadCoverage).length,
    localCaptureCount
  };
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

function round3(value:number):number{return Math.round(value*1000)/1000;}

function baseEvent(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,learnerModelVersion:"p19",...input
  };
}
