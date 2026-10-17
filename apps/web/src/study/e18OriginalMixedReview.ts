import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {getE02Overview,e02ReviewPrompts,type E02Overview} from "./a1ExcellenceCourse";
import {getE03Overview,e03ReviewPrompts,type E03Overview} from "./a2ExcellenceCourse";
import {getE04Overview,e04ReviewPrompts,type E04Overview} from "./a2ExcellenceAdvancedCourse";

/** E18 interleaves completed ORIGINAL controlled questions, unlike the E13 optional E11 mixer.
 * Original prompt IDs, Can-do targets, answers, event metadata and FSRS are never copied/rewritten.
 * This is repetition of prior material, NOT new-context proficiency evidence.
 */
export type E18Mode="listen-read"|"respond-recall"|"whole-source";
export type E18Cohort="e02"|"e03"|"e04";
export interface E18Case{
 key:string;cohort:E18Cohort;sceneId:string;title:string;level:"A1"|"A2";
 canDoId:string;unitId:string;correct:number;required:number;
}
export const E18_MODES:readonly {id:E18Mode;label:string;description:string}[]=[
 {id:"listen-read",label:"Listen and read",description:"One original listening and one reading comprehension question from each completed situation."},
 {id:"respond-recall",label:"Respond and recall",description:"A contextual choice and an exact-model typed recall from each situation. This cannot grade free writing."},
 {id:"whole-source",label:"Full mixed review",description:"Listening, reading, appropriate response and typed model recall from every selected source."}
];
export function eligibleE18Cases(e02:E02Overview,e03:E03Overview,e04:E04Overview):E18Case[]{
 const combined:E18Case[]=[
  ...e02.scenes.filter(s=>s.completedControlled===s.requiredControlled&&s.requiredControlled>0&&["waiting","ready","reviewed"].includes(s.state))
   .map(s=>({key:"e02:"+s.id,cohort:"e02" as const,sceneId:s.id,title:s.title,level:"A1" as const,canDoId:s.canDoId,unitId:s.unitId,correct:s.completedControlled,required:s.requiredControlled})),
  ...e03.scenes.filter(s=>s.correct===s.required&&s.required>0&&["waiting","ready","reviewed"].includes(s.state))
   .map(s=>({key:"e03:"+s.id,cohort:"e03" as const,sceneId:s.id,title:s.title,level:"A2" as const,canDoId:s.canDoId,unitId:s.unitId,correct:s.correct,required:s.required})),
  ...e04.scenes.filter(s=>s.guidedCorrect===s.guidedTotal&&s.guidedTotal>0&&["waiting","ready","reviewed"].includes(s.status))
   .map(s=>({key:"e04:"+s.id,cohort:"e04" as const,sceneId:s.id,title:s.title,level:"A2" as const,canDoId:s.canDoId,unitId:s.unitId,correct:s.guidedCorrect,required:s.guidedTotal}))
 ];
 return combined;
}
const sourcePrompts:Record<E18Cohort,readonly StudyPrompt[]>={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
function originalPrompts(source:E18Case,mode:E18Mode):StudyPrompt[]{
 const available=sourcePrompts[source.cohort].filter(p=>
  p.sourceId==="thiepn-original"&&p.primaryTarget.kind==="can_do"&&
  p.primaryTarget.id===source.canDoId&&
  p.eventMetadata?.[source.cohort+"SceneId"]===source.sceneId&&
  p.eventMetadata?.[source.cohort+"UnitId"]===source.unitId&&
  p.eventMetadata?.nonAuthoritative!==true&&p.eventMetadata?.schedulerExcluded!==true&&
  p.activity==="review");
 const pick=(skill:StudyPrompt["skill"],typed=false):StudyPrompt=>{
  const found=available.find(p=>p.skill===skill&&
   (typed?p.promptType==="typed":p.promptType==="choice")&&p.acceptedAnswers.length>0);
  if(!found)throw Error("E18_MISSING_VERIFIED_ORIGINAL_"+skill+":"+source.key);
  return found;
 };
 const listening=mode!=="respond-recall"?[pick("listening")]:[];
 const reading=mode!=="respond-recall"?[pick("comprehension")]:[];
 const response=mode!=="listen-read"?[pick("form_selection")]:[];
 const recall=mode!=="listen-read"?[pick("production",true)]:[];
 return [...listening,...reading,...response,...recall];
}
export function buildE18OriginalMixedReview(
 keys:readonly string[],mode:E18Mode,owner:string,events:readonly StudyEvent[],now=new Date()
):StudyStep[]{
 if(!owner||events.some(e=>e.userId!==owner))throw Error("E18_OWNER_WORKSPACE_MISMATCH");
 if(!E18_MODES.some(item=>item.id===mode))throw Error("E18_UNKNOWN_MODE");
 if(keys.length<2||keys.length>3||new Set(keys).size!==keys.length)
  throw Error("E18_REQUIRES_TWO_OR_THREE_DISTINCT_SOURCES");
 const eligible=eligibleE18Cases(getE02Overview(events,now),getE03Overview(events,now),getE04Overview(events,now));
 const byKey=new Map(eligible.map(c=>[c.key,c]));
 if(keys.some(key=>!byKey.has(key)))throw Error("E18_SOURCE_LESSON_NOT_COMPLETED");
 const result:StudyStep[]=[];
 const seen=new Set<string>();
 for(const key of keys){
  const source=byKey.get(key)!;
  const selected=originalPrompts(source,mode);
  const boundary:StudyLesson={
   kind:"lesson",id:"e18-original-boundary-"+source.key.replace(":","-"),
   title:source.level+" · "+source.title,
   body:"Different original situations are presented together to practise distinguishing meaning and selecting a response without a single-story cue. These are previously encountered, canonical questions, not a new unseen transfer or CEFR evaluation. Listening uses labeled device synthesis where provided.",
   contextId:"e18-original-"+source.key,
   sourceLabel:"THIEPN original · verified "+source.unitId,
   facts:[{label:"Existing Can-do",value:source.canDoId},{label:"Source situation",value:source.title}]
  };
  result.push(boundary);
  for(const prompt of selected){
   if(seen.has(prompt.id))throw Error("E18_DUPLICATE_ORIGINAL_PROMPT:"+prompt.id);
   seen.add(prompt.id);
   result.push(prompt);
  }
 }
 if(seen.size!==keys.length*(mode==="whole-source"?4:2))throw Error("E18_MIX_SIZE_MISMATCH");
 return result;
}
