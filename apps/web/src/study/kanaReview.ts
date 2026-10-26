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
const SKILLS:readonly KanaReviewSkill[]=["all","recognition","reading","form_selection"];
const MAX_SESSION=16;
const DUE_ONLY_THRESHOLD=11;
const MAX_NEW=5;

// Preserve the canonical prompt and FSRS identity for every exercise.
export const kanaReviewPrompts:readonly StudyPrompt[]=[...foundationPrompts,...foundationApplicationPrompts]
  .filter(prompt=>prompt.primaryTarget.kind==="kana"&&
    (prompt.skill==="recognition"||prompt.skill==="reading"||prompt.skill==="form_selection"));

export function kanaReviewTraceId(prompt:StudyPrompt):string{
  return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;
}
function inScope(prompt:StudyPrompt,script:KanaReviewScript,skill:KanaReviewSkill):boolean{
  const id=prompt.primaryTarget.id;
  return (script==="mixed"||id.startsWith(script+"-"))&&
    (skill==="all"||prompt.skill===skill);
}
function latestFailures(events:readonly StudyEvent[]):Map<string,boolean>{
  const latest=new Map<string,{at:string;failed:boolean}>();
  for(const event of events){
    if(event.primaryTarget?.kind!=="kana"||!["correct","incorrect","partial","revealed"].includes(event.result??""))continue;
    const id=event.primaryTarget.id;
    const prior=latest.get(id);
    if(!prior||prior.at<=event.occurredAt){
      latest.set(id,{at:event.occurredAt,failed:event.result!=="correct"});
    }
  }
  return new Map([...latest].map(([id,entry])=>[id,entry.failed]));
}
function weakness(prompt:StudyPrompt,trace:MemoryTrace|undefined,failed:ReadonlyMap<string,boolean>):number{
  const lapses=trace?.card.lapses??0;
  const difficulty=trace?.card.difficulty??0;
  return (failed.get(prompt.primaryTarget.id)?40:0)+
    Math.min(lapses,10)*8+Math.max(0,difficulty);
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
  const due:StudyPrompt[]=[];
  const fresh:StudyPrompt[]=[];
  for(const prompt of kanaReviewPrompts){
    if(!inScope(prompt,script,skill))continue;
    const trace=indexed.get(kanaReviewTraceId(prompt));
    if(trace){
      const dueAt=Date.parse(trace.card.due);
      if(Number.isFinite(dueAt)&&dueAt<=now.getTime())due.push(prompt);
    }else if(prompt.skill==="recognition"||ready(prompt,known)){
      fresh.push(prompt);
    }
  }
  due.sort((left,right)=>{
    const a=indexed.get(kanaReviewTraceId(left))!;
    const b=indexed.get(kanaReviewTraceId(right))!;
    return weakness(right,b,failed)-weakness(left,a,failed)||
      Date.parse(a.card.due)-Date.parse(b.card.due)||
      left.id.localeCompare(right.id);
  });
  fresh.sort((left,right)=>
    (failed.get(right.primaryTarget.id)?1:0)-(failed.get(left.primaryTarget.id)?1:0)||
    (left.skill==="recognition"?0:1)-(right.skill==="recognition"?0:1)||
    kanaReviewPrompts.indexOf(left)-kanaReviewPrompts.indexOf(right));
  const weakDue=due.filter(prompt=>{
    const trace=indexed.get(kanaReviewTraceId(prompt));
    return failed.get(prompt.primaryTarget.id)===true||(trace?.card.lapses??0)>0;
  }).length;
  const queued=due.slice(0,MAX_SESSION);
  if(due.length<DUE_ONLY_THRESHOLD){
    queued.push(...fresh.slice(0,Math.min(MAX_NEW,MAX_SESSION-queued.length)));
  }
  return {counts:{due:due.length,new:fresh.length,weakDue},prompts:queued};
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
  for(const script of SCRIPTS)for(const skill of SKILLS){
    result[script][skill]=selectKanaReview(script,skill,traces,events,now,ready).counts;
  }
  return result;
}
