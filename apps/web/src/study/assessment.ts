import type { LanguageActivity } from "@thiepn/content-schema";
import type { StudyEvent } from "@thiepn/domain";
import type { StudyLesson, StudyPrompt, StudyStep } from "@thiepn/study-player";
import { canDoDescriptor, coreContent } from "../coreContent";
import {
  courseUnitPrompts,
  sentenceComprehensionPrompts,
  sentenceProductionPrompts,
  traceIdFor
} from "./grammarCourse";
import { vocabularyListeningPrompts } from "./vocabulary";
import { productiveSpeakingPrompts,productiveWritingPrompts } from "./productivePractice";

export const UNIT_ASSESSMENT_DELAY_MS=20*60*60*1000;
export const UNIT_ASSESSMENT_PASS_MARK=0.75;

export type UnitAssessmentStatus="not_ready"|"waiting"|"ready"|"in_progress"|"passed"|"needs_review";

export interface UnitAssessmentProgress {
  unitId:string;
  status:UnitAssessmentStatus;
  availableAt?:string;
  score?:number;
  answered:number;
  total:number;
}

export interface MilestoneActivityScore {
  activity:LanguageActivity;
  correct:number;
  answered:number;
  total:number;
  score:number;
}

export interface MilestoneAssessmentProgress {
  complete:boolean;
  answered:number;
  total:number;
  scores:Record<LanguageActivity,MilestoneActivityScore>;
}

export function buildUnitAssessment(unitId:string):StudyStep[]{
  const unit=coreContent.courseUnits.find((item)=>item.id===unitId);
  if(!unit)throw new Error("UNKNOWN_COURSE_UNIT:"+unitId);
  const canDo=canDoDescriptor(unit.canDoId);
  const prompts=unitAssessmentPrompts(unitId);
  const intro:StudyLesson={
    kind:"lesson",
    id:"lesson-assessment-"+unitId,
    title:unit.title+" · delayed check",
    body:"This check is separated from the lesson so recent exposure cannot masquerade as durable knowledge. Its answers are stored as assessment StudyEvents and feed the same learner evidence used elsewhere.",
    contextId:"assessment-"+unitId,
    facts:[
      {label:"Can-do",value:canDo.statement},
      {label:"Questions",value:String(prompts.length)},
      {label:"Pass mark",value:Math.round(UNIT_ASSESSMENT_PASS_MARK*100)+"%"}
    ],
    sourceLabel:"THIEPN Japanese assessment model"
  };
  return [intro,...prompts];
}

export function unitAssessmentPrompts(unitId:string):StudyPrompt[]{
  const unit=coreContent.courseUnits.find((item)=>item.id===unitId);
  if(!unit)throw new Error("UNKNOWN_COURSE_UNIT:"+unitId);
  const canDo=canDoDescriptor(unit.canDoId);
  const pool=courseUnitPrompts(unitId);
  const selected:StudyPrompt[]=[];
  addFrom(selected,pool.filter((prompt)=>prompt.primaryTarget.kind==="lexeme"&&prompt.skill==="meaning_recognition"),2);
  addFrom(selected,pool.filter((prompt)=>prompt.primaryTarget.kind==="grammar"&&prompt.skill==="form_selection"),2);
  addFrom(selected,pool.filter((prompt)=>prompt.primaryTarget.kind==="lexeme"&&prompt.skill==="form_selection"),1);
  addFrom(selected,pool.filter((prompt)=>prompt.primaryTarget.kind==="sentence"&&prompt.skill==="comprehension"),2);
  addFrom(selected,pool.filter((prompt)=>prompt.primaryTarget.kind==="sentence"&&prompt.skill==="production"),1);
  return selected.map((prompt,index)=>assessmentClone(prompt,{
    id:"assessment-"+unitId+"-"+String(index+1).padStart(2,"0"),
    contextId:"assessment-"+unitId,
    languageActivity:canDo.languageActivity,
    metadata:{assessmentScope:"unit",unitId,canDoId:unit.canDoId}
  }));
}

export function getUnitAssessmentProgress(unitId:string,events:readonly StudyEvent[],now=new Date()):UnitAssessmentProgress{
  const assessment=unitAssessmentPrompts(unitId);
  const latest=latestAssessmentEvents(events,"assessment-"+unitId);
  const answered=assessment.filter((prompt)=>latest.has(prompt.id)).length;
  const correct=assessment.filter((prompt)=>latest.get(prompt.id)?.result==="correct").length;
  if(answered>0){
    const score=answered?correct/answered:0;
    if(answered<assessment.length)return {unitId,status:"in_progress",score,answered,total:assessment.length};
    return {unitId,status:score>=UNIT_ASSESSMENT_PASS_MARK?"passed":"needs_review",score,answered,total:assessment.length};
  }

  const prerequisites=unitLearningPrerequisites(unitId);
  const firstByPrompt=firstEventsByPrompt(events);
  if(!prerequisites.length||!prerequisites.every((prompt)=>firstByPrompt.has(prompt.id))){
    return {unitId,status:"not_ready",answered:0,total:assessment.length};
  }
  const completionAt=Math.max(...prerequisites.map((prompt)=>new Date(firstByPrompt.get(prompt.id)!.occurredAt).getTime()));
  const availableAt=new Date(completionAt+UNIT_ASSESSMENT_DELAY_MS);
  if(availableAt.getTime()>now.getTime())return {unitId,status:"waiting",availableAt:availableAt.toISOString(),answered:0,total:assessment.length};
  return {unitId,status:"ready",availableAt:availableAt.toISOString(),answered:0,total:assessment.length};
}

export function buildA1MilestoneAssessment():StudyStep[]{
  const prompts=a1MilestoneAssessmentPrompts();
  const intro:StudyLesson={
    kind:"lesson",
    id:"lesson-assessment-a1-milestone",
    title:"A1 milestone assessment",
    body:"This milestone reports five activity areas separately. Spoken interaction and spoken production currently use controlled text-backed response tasks: say the response aloud first, then enter it. They measure language selection and production, not pronunciation quality.",
    contextId:"assessment-a1-milestone",
    facts:[
      {label:"Reading",value:"3 tasks"},
      {label:"Listening",value:"3 audio tasks"},
      {label:"Spoken interaction",value:"3 controlled response tasks"},
      {label:"Spoken production",value:"3 controlled production tasks"},
      {label:"Writing",value:"3 written production tasks"}
    ],
    sourceLabel:"THIEPN Japanese A1 milestone"
  };
  return [intro,...prompts];
}

export function a1MilestoneAssessmentPrompts():StudyPrompt[]{
  const reading=pickSentencePrompts(sentenceComprehensionPrompts,["question","shopping","transport"],3)
    .map((prompt,index)=>milestoneClone(prompt,"reading",index));
  const listening=spreadPick(vocabularyListeningPrompts,3)
    .map((prompt,index)=>milestoneClone(prompt,"listening",index));
  const interaction=pickSentencePrompts(sentenceProductionPrompts,["request","shopping","question"],3)
    .map((prompt,index)=>milestoneClone(prompt,"spoken_interaction",index,true));
  const production=pickSentencePrompts(sentenceProductionPrompts,["routine","family","description"],3)
    .map((prompt,index)=>milestoneClone(prompt,"spoken_production",index,true));
  const writing=pickSentencePrompts(sentenceProductionPrompts,["possession","time","food"],3)
    .map((prompt,index)=>milestoneClone(prompt,"writing",index));
  return [...reading,...listening,...interaction,...production,...writing];
}

export function getA1MilestoneProgress(events:readonly StudyEvent[]):MilestoneAssessmentProgress{
  const prompts=a1MilestoneAssessmentPrompts();
  const latest=latestAssessmentEvents(events,"assessment-a1-milestone");
  const activities:LanguageActivity[]=["reading","listening","spoken_interaction","spoken_production","writing"];
  const scores=Object.fromEntries(activities.map((activity)=>{
    const activityPrompts=prompts.filter((prompt)=>prompt.languageActivity===activity);
    const answered=activityPrompts.filter((prompt)=>latest.has(prompt.id)).length;
    const correct=activityPrompts.filter((prompt)=>latest.get(prompt.id)?.result==="correct").length;
    const item:MilestoneActivityScore={activity,correct,answered,total:activityPrompts.length,score:answered?correct/answered:0};
    return [activity,item];
  })) as Record<LanguageActivity,MilestoneActivityScore>;
  const answered=prompts.filter((prompt)=>latest.has(prompt.id)).length;
  return {complete:answered===prompts.length,answered,total:prompts.length,scores};
}

export function buildB1MilestoneAssessment():StudyStep[]{
  const prompts=b1MilestoneAssessmentPrompts();
  const intro:StudyLesson={
    kind:"lesson",
    id:"lesson-assessment-b1-milestone",
    title:"B1 milestone assessment",
    body:"This milestone reports five language activities separately. Speaking items use browser Japanese speech recognition when available; writing items use connected responses. Structural target checks are deliberately narrower than full human correction or acoustic pronunciation scoring.",
    contextId:"assessment-b1-milestone",
    facts:[
      {label:"Reading",value:"3 connected comprehension tasks"},
      {label:"Listening",value:"3 native-word listening tasks"},
      {label:"Spoken interaction",value:"3 microphone responses"},
      {label:"Spoken production",value:"3 microphone responses"},
      {label:"Writing",value:"3 connected writing tasks"}
    ],
    sourceLabel:"THIEPN Japanese B1 milestone"
  };
  return [intro,...prompts];
}

export function b1MilestoneAssessmentPrompts():StudyPrompt[]{
  const b1Reading=sentenceComprehensionPrompts.filter((prompt)=>{
    const sentence=coreContent.sentences.find((item)=>item.id===prompt.primaryTarget.id);
    return sentence?.level==="B1";
  });
  const b1Listening=vocabularyListeningPrompts.filter((prompt)=>{
    const lexeme=coreContent.lexemes.find((item)=>item.id===prompt.primaryTarget.id);
    return lexeme?.tags?.includes("b1");
  });
  const interaction=spreadPick(productiveSpeakingPrompts.filter((prompt)=>prompt.languageActivity==="spoken_interaction"),3);
  const production=spreadPick(productiveSpeakingPrompts.filter((prompt)=>prompt.languageActivity!=="spoken_interaction"),3);
  const writing=spreadPick(productiveWritingPrompts,3);
  return [
    ...spreadPick(b1Reading,3).map((prompt,index)=>b1MilestoneClone(prompt,"reading",index)),
    ...spreadPick(b1Listening,3).map((prompt,index)=>b1MilestoneClone(prompt,"listening",index)),
    ...interaction.map((prompt,index)=>b1MilestoneClone(prompt,"spoken_interaction",index)),
    ...production.map((prompt,index)=>b1MilestoneClone(prompt,"spoken_production",index)),
    ...writing.map((prompt,index)=>b1MilestoneClone(prompt,"writing",index))
  ];
}

export function getB1MilestoneProgress(events:readonly StudyEvent[]):MilestoneAssessmentProgress{
  const prompts=b1MilestoneAssessmentPrompts();
  const latest=latestAssessmentEvents(events,"assessment-b1-milestone");
  const activities:LanguageActivity[]=["reading","listening","spoken_interaction","spoken_production","writing"];
  const scores=Object.fromEntries(activities.map((activity)=>{
    const activityPrompts=prompts.filter((prompt)=>prompt.languageActivity===activity);
    const answered=activityPrompts.filter((prompt)=>latest.has(prompt.id)).length;
    const correct=activityPrompts.filter((prompt)=>latest.get(prompt.id)?.result==="correct").length;
    const item:MilestoneActivityScore={activity,correct,answered,total:activityPrompts.length,score:answered?correct/answered:0};
    return [activity,item];
  })) as Record<LanguageActivity,MilestoneActivityScore>;
  const answered=prompts.filter((prompt)=>latest.has(prompt.id)).length;
  return {complete:answered===prompts.length,answered,total:prompts.length,scores};
}

function b1MilestoneClone(prompt:StudyPrompt,activity:LanguageActivity,index:number):StudyPrompt{
  return assessmentClone(prompt,{
    id:"assessment-b1-"+activity+"-"+String(index+1).padStart(2,"0"),
    contextId:"assessment-b1-milestone",
    languageActivity:activity,
    metadata:{assessmentScope:"milestone",milestoneId:"b1",languageActivity:activity,evaluation:prompt.promptType==="speech"?"speech-recognition-structural":prompt.promptType==="textarea"?"connected-writing-structural":"standard"}
  });
}

export function unitLearningPrerequisites(unitId:string):StudyPrompt[]{
  const pool=courseUnitPrompts(unitId).filter((prompt)=>prompt.skill!=="production");
  const seen=new Set<string>();
  return pool.filter((prompt)=>{
    const key=prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill;
    if(seen.has(key))return false;
    seen.add(key);
    return true;
  });
}

function assessmentClone(prompt:StudyPrompt,input:{id:string;contextId:string;languageActivity:LanguageActivity;metadata:Record<string,unknown>;spokenProxy?:boolean}):StudyPrompt{
  const instruction=input.spokenProxy
    ?"Say the response aloud first, then "+(prompt.promptType==="typed"?"type it.":"choose it.")
    :prompt.instruction;
  return {
    ...prompt,
    id:input.id,
    instruction,
    contextId:input.contextId,
    activity:"assessment",
    languageActivity:input.languageActivity,
    eventMetadata:input.metadata
  };
}

function milestoneClone(prompt:StudyPrompt,activity:LanguageActivity,index:number,spokenProxy=false):StudyPrompt{
  return assessmentClone(prompt,{
    id:"assessment-a1-"+activity+"-"+String(index+1).padStart(2,"0"),
    contextId:"assessment-a1-milestone",
    languageActivity:activity,
    spokenProxy,
    metadata:{assessmentScope:"milestone",milestoneId:"a1",languageActivity:activity,proxyMode:spokenProxy?"say-then-type":undefined}
  });
}

function addFrom(target:StudyPrompt[],pool:readonly StudyPrompt[],limit:number):void{
  for(const item of spreadPick(pool,limit)){
    if(!target.some((existing)=>traceIdFor(existing)===traceIdFor(item)))target.push(item);
  }
}

function spreadPick<T>(items:readonly T[],count:number):T[]{
  if(items.length<=count)return [...items];
  if(count<=1)return [items[Math.floor(items.length/2)]!];
  const selected:T[]=[];
  for(let i=0;i<count;i++){
    const index=Math.round(i*(items.length-1)/(count-1));
    const item=items[index];
    if(item!==undefined&&!selected.includes(item))selected.push(item);
  }
  return selected;
}

function pickSentencePrompts(prompts:readonly StudyPrompt[],tags:string[],count:number):StudyPrompt[]{
  const tagged=prompts.filter((prompt)=>{
    if(prompt.primaryTarget.kind!=="sentence")return false;
    const sentence=coreContent.sentences.find((item)=>item.id===prompt.primaryTarget.id);
    return Boolean(sentence?.tags?.some((tag)=>tags.includes(tag)));
  });
  return spreadPick(tagged.length>=count?tagged:prompts,count);
}

function firstEventsByPrompt(events:readonly StudyEvent[]):Map<string,StudyEvent>{
  const result=new Map<string,StudyEvent>();
  for(const event of [...events].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const promptId=typeof event.metadata?.promptId==="string"?event.metadata.promptId:null;
    if(promptId&&!result.has(promptId))result.set(promptId,event);
  }
  return result;
}

function latestAssessmentEvents(events:readonly StudyEvent[],contextId:string):Map<string,StudyEvent>{
  const result=new Map<string,StudyEvent>();
  for(const event of events){
    if(event.activity!=="assessment"||event.contextId!==contextId)continue;
    const promptId=typeof event.metadata?.promptId==="string"?event.metadata.promptId:null;
    if(!promptId)continue;
    const prior=result.get(promptId);
    if(!prior||prior.occurredAt<=event.occurredAt)result.set(promptId,event);
  }
  return result;
}
