import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {foundationPrompts,foundationApplicationPrompts} from "./foundationPrompts";

export type KanaReviewScript="hiragana"|"katakana"|"mixed";
export type KanaReviewSkill="all"|"recognition"|"reading"|"form_selection";
export type KanaReviewCounts={due:number;new:number;weakDue:number};
export type KanaReviewOverview=Record<KanaReviewScript,Record<KanaReviewSkill,KanaReviewCounts>>;
export type KanaReviewReadiness=(prompt:StudyPrompt,known:ReadonlySet<string>)=>boolean;

const SCRIPTS:readonly KanaReviewScript[]=["hiragana","katakana","mixed"];
const SKILLS:readonly Exclude<KanaReviewSkill,"all">[]=["recognition","reading","form_selection"];
const MAX_SESSION=16;
const DUE_ONLY_THRESHOLD=11;
const MAX_NEW=5;

export const kanaReviewPrompts:readonly StudyPrompt[]=[...foundationPrompts,...foundationApplicationPrompts]
  .filter(prompt=>prompt.primaryTarget.kind==="kana"&&SKILLS.some(skill=>prompt.skill===skill));

export function kanaReviewTraceId(prompt:StudyPrompt):string{
  return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;
}
function inScope(prompt:StudyPrompt,script:KanaReviewScript,skill:KanaReviewSkill):boolean{
  return (script==="mixed"||prompt.primaryTarget.id.startsWith(script+"-"))&&
    (skill==="all"||prompt.skill===skill);
}
function scriptOf(prompt:StudyPrompt):Exclude<KanaReviewScript,"mixed">{
  return prompt.primaryTarget.id.startsWith("katakana-")?"katakana":"hiragana";
}
function latestFailures(events:readonly StudyEvent[]):Map<string,boolean>{
  const latest=new Map<string,{at:string;failed:boolean}>();
  for(const event of events){
    if(event.primaryTarget?.kind!=="kana"||
      !["correct","incorrect","partial","revealed"].includes(event.result??"")||
      event.metadata?.schedulerExcluded===true||event.metadata?.nonAuthoritative===true)continue;
    const id=["kana",event.primaryTarget.id,event.skillDimension,event.promptFamily].join(":");
    const prior=latest.get(id);
    if(!prior||prior.at<=event.occurredAt){
      latest.set(id,{at:event.occurredAt,failed:event.result!=="correct"});
    }
  }
  return new Map([...latest].map(([id,entry])=>[id,entry.failed]));
}
function recognitionSucceeded(events:readonly StudyEvent[]):Set<string>{
  return new Set(events.filter(event=>event.primaryTarget?.kind==="kana"&&
    event.skillDimension==="recognition"&&event.result==="correct"&&
    event.metadata?.nonAuthoritative!==true)
    .map(event=>event.primaryTarget.id));
}
function weakness(prompt:StudyPrompt,trace:MemoryTrace|undefined,failed:ReadonlyMap<string,boolean>):number{
  return (failed.get(kanaReviewTraceId(prompt))?40:0)+
    Math.min(trace?.card.lapses??0,10)*8+
    Math.max(0,trace?.card.difficulty??0);
}
function isWeak(prompt:StudyPrompt,trace:MemoryTrace|undefined,failed:ReadonlyMap<string,boolean>):boolean{
  return failed.get(kanaReviewTraceId(prompt))===true||(trace?.card.lapses??0)>0;
}
function alternateScripts(prompts:readonly StudyPrompt[]):StudyPrompt[]{
  const groups={
    hiragana:prompts.filter(prompt=>scriptOf(prompt)==="hiragana"),
    katakana:prompts.filter(prompt=>scriptOf(prompt)==="katakana")
  };
  const result:StudyPrompt[]=[];
  // Once one script is exhausted, include every remaining card of the other.
  for(let n=0;result.length<prompts.length;n++){
    const next=n%2===0?groups.hiragana:groups.katakana;
    const other=n%2===0?groups.katakana:groups.hiragana;
    result.push(next.shift()??other.shift()!);
  }
  return result;
}
function orderNew(prompts:readonly StudyPrompt[],script:KanaReviewScript,skill:KanaReviewSkill):StudyPrompt[]{
  if(skill!=="all")return script==="mixed"?alternateScripts(prompts):[...prompts];
  const buckets=new Map<string,StudyPrompt[]>();
  for(const prompt of prompts){
    const key=scriptOf(prompt)+":"+prompt.skill;
    const items=buckets.get(key)??[];
    items.push(prompt);
    buckets.set(key,items);
  }
  const scripts=script==="mixed"?["hiragana","katakana"] as const:[script] as const;
  const result:StudyPrompt[]=[];
  while(result.length<prompts.length){
    let advanced=false;
    // Interleave scripts first; rotate eligible skills rather than delaying
    // typed recall until every kana recognition card has been introduced.
    for(const currentSkill of SKILLS){
      for(const currentScript of scripts){
        const item=buckets.get(currentScript+":"+currentSkill)?.shift();
        if(item){result.push(item);advanced=true;}
      }
    }
    if(!advanced)break;
  }
  return result;
}
function isSpecialIntroduction(prompt:StudyPrompt):boolean{
  return prompt.skill==="reading"&&(
    prompt.primaryTarget.id==="hiragana-small-tsu"||
    prompt.primaryTarget.id==="katakana-small-tsu"||
    prompt.primaryTarget.id==="katakana-long-vowel-mark");
}
export function selectKanaReview(
  script:KanaReviewScript,
  skill:KanaReviewSkill,
  traces:readonly MemoryTrace[],
  events:readonly StudyEvent[],
  now:Date,
  ready:KanaReviewReadiness,
):{counts:KanaReviewCounts;prompts:StudyPrompt[]}{
  const indexed=new Map(traces.map(trace=>[trace.id,trace]));
  const known=new Set(indexed.keys());
  const failed=latestFailures(events);
  const recognized=recognitionSucceeded(events);
  const due:StudyPrompt[]=[];
  const fresh:StudyPrompt[]=[];
  for(const prompt of kanaReviewPrompts){
    if(!inScope(prompt,script,skill))continue;
    const trace=indexed.get(kanaReviewTraceId(prompt));
    if(trace){
      const dueAt=Date.parse(trace.card.due);
      if(Number.isFinite(dueAt)&&dueAt<=now.getTime())due.push(prompt);
    }else if(prompt.skill==="recognition"||isSpecialIntroduction(prompt)||
      (recognized.has(prompt.primaryTarget.id)&&ready(prompt,known))){
      fresh.push(prompt);
    }
  }
  due.sort((left,right)=>{
    const lhs=indexed.get(kanaReviewTraceId(left))!;
    const rhs=indexed.get(kanaReviewTraceId(right))!;
    return weakness(right,rhs,failed)-weakness(left,lhs,failed)||
      Date.parse(lhs.card.due)-Date.parse(rhs.card.due)||
      left.id.localeCompare(right.id);
  });
  const weak=due.filter(prompt=>isWeak(prompt,indexed.get(kanaReviewTraceId(prompt)),failed));
  const ordinary=due.filter(prompt=>!isWeak(prompt,indexed.get(kanaReviewTraceId(prompt)),failed));
  const orderedDue=script==="mixed"?[...alternateScripts(weak),...alternateScripts(ordinary)]:due;
  const queued=orderedDue.slice(0,MAX_SESSION);
  if(due.length<DUE_ONLY_THRESHOLD){
    queued.push(...orderNew(fresh,script,skill).slice(0,Math.min(MAX_NEW,MAX_SESSION-queued.length)));
  }
  return {counts:{due:due.length,new:fresh.length,weakDue:weak.length},prompts:queued};
}
export function createEmptyKanaReviewOverview():KanaReviewOverview{
  const section=()=>({all:{due:0,new:0,weakDue:0},recognition:{due:0,new:0,weakDue:0},
    reading:{due:0,new:0,weakDue:0},form_selection:{due:0,new:0,weakDue:0}});
  return {hiragana:section(),katakana:section(),mixed:section()};
}
export function projectKanaReviewOverview(
  traces:readonly MemoryTrace[],
  events:readonly StudyEvent[],
  now:Date,
  ready:KanaReviewReadiness,
):KanaReviewOverview{
  const result=createEmptyKanaReviewOverview();
  for(const script of SCRIPTS)for(const skill of ["all",...SKILLS] as KanaReviewSkill[]){
    result[script][skill]=selectKanaReview(script,skill,traces,events,now,ready).counts;
  }
  return result;
}
