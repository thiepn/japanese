import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {basicHiragana,foundationApplicationPrompts,foundationLessons,kanaRecognitionPrompts} from "./foundationPrompts";

const GROUPS=[
  {id:"vowels",title:"Five vowel sounds",context:"hiragana-vowels"},
  {id:"k",title:"K sounds",context:"hiragana-k"},
  {id:"s",title:"S sounds",context:"hiragana-s"},
  {id:"t",title:"T sounds",context:"hiragana-t"},
  {id:"n",title:"N sounds",context:"hiragana-n"},
  {id:"h",title:"H sounds",context:"hiragana-h"},
  {id:"m",title:"M sounds",context:"hiragana-m"},
  {id:"y",title:"Y sounds",context:"hiragana-y"},
  {id:"r",title:"R sounds",context:"hiragana-r"},
  {id:"w",title:"W sounds and ん",context:"hiragana-w"}
] as const;
export type BeginnerStageId=typeof GROUPS[number]["id"];
export type BeginnerStage={id:BeginnerStageId;title:string;correct:number;total:number;completed:boolean;unlocked:boolean};
export type BeginnerOverview={stages:BeginnerStage[];completed:number;total:number;nextId:BeginnerStageId|null;started:boolean;complete:boolean};
export type BeginnerContinuation=
  |{kind:"kana";id:BeginnerStageId}
  |{kind:"first-conversation"}
  |{kind:"a1-scene";id:string}
  |{kind:"daily"};
export function chooseBeginnerContinuation(
  beginner:BeginnerOverview,
  introduction:{unitId:string;status:string},
  nextSceneId:string|null
):BeginnerContinuation{
  if(beginner.nextId)return {kind:"kana",id:beginner.nextId};
  if(introduction.unitId&&(introduction.status==="not_started"||introduction.status==="learning"))
    return {kind:"first-conversation"};
  if(nextSceneId)return {kind:"a1-scene",id:nextSceneId};
  return {kind:"daily"};
}

function recognitionFor(id:BeginnerStageId):StudyPrompt[]{
  return basicHiragana.filter(seed=>seed.group===id).map(seed=>{
    const prompt=kanaRecognitionPrompts.find(item=>item.primaryTarget.id==="hiragana-"+seed.kana);
    if(!prompt)throw new Error("MISSING_CANONICAL_KANA:"+seed.kana);
    return prompt;
  });
}
function selectedPractice(id:BeginnerStageId):StudyPrompt[]{
  const seeds=basicHiragana.filter(seed=>seed.group===id);
  return foundationApplicationPrompts.filter(prompt=>prompt.skill==="form_selection"
    &&seeds.some(seed=>prompt.primaryTarget.id==="hiragana-"+seed.kana)).slice(0,2);
}
function correctlyAnswered(events:readonly StudyEvent[]):Set<string>{
  return new Set(events.filter(event=>event.result==="correct"&&event.primaryTarget?.kind==="kana"
    &&event.metadata?.nonAuthoritative!==true&&typeof event.metadata?.promptId==="string")
    .map(event=>String(event.metadata?.promptId)+"|"+event.primaryTarget!.id));
}
export function projectBeginnerOverview(events:readonly StudyEvent[]):BeginnerOverview{
  const correct=correctlyAnswered(events);
  let priorCompleted=true;
  const stages:BeginnerStage[]=GROUPS.map(group=>{
    const prompts=[...recognitionFor(group.id),...selectedPractice(group.id)];
    const count=prompts.filter(prompt=>correct.has(prompt.id+"|"+prompt.primaryTarget.id)).length;
    const completed=count===prompts.length;
    const stage={id:group.id,title:group.title,correct:count,total:prompts.length,completed,unlocked:priorCompleted};
    priorCompleted=priorCompleted&&completed;
    return stage;
  });
  const nextId=stages.find(stage=>!stage.completed)?.id??null;
  return {stages,completed:stages.filter(s=>s.completed).length,total:stages.length,nextId,
    started:events.some(event=>event.primaryTarget?.kind==="kana"
      &&(event.result==="correct"||event.result==="incorrect")
      &&event.metadata?.nonAuthoritative!==true
      &&[...GROUPS].some(group=>[...recognitionFor(group.id),...selectedPractice(group.id)]
        .some(prompt=>prompt.id===event.metadata?.promptId&&prompt.primaryTarget.id===event.primaryTarget?.id))),
    complete:nextId===null};
}
const VOWEL_TIPS:Readonly<Record<string,string>>={
  "あ":"a · as in father","い":"i · like ee in see",
  "う":"u · a short unrounded oo-like sound","え":"e · as in get","お":"o · a pure oh sound"
};
export function buildBeginnerStage(id:BeginnerStageId,events:readonly StudyEvent[]):StudyStep[]{
  const group=GROUPS.find(item=>item.id===id);
  if(!group)throw new Error("UNKNOWN_BEGINNER_STAGE");
  if(!projectBeginnerOverview(events).stages.find(stage=>stage.id===id)?.unlocked)throw new Error("BEGINNER_STAGE_LOCKED");
  const seeds=basicHiragana.filter(seed=>seed.group===id);
  const explanation=foundationLessons[group.context]?.body;
  const teach:StudyLesson={
    kind:"lesson",id:"a0-hiragana-"+id+"-teach",contextId:"a0-hiragana-"+id,
    title:"Hiragana · "+group.title,
    body:(explanation??"Each hiragana character represents a Japanese sound.")+
      " Play each sound and repeat it aloud. Then identify each character in practice.",
    examples:seeds.map(seed=>({expression:seed.kana,note:VOWEL_TIPS[seed.kana]??seed.reading})),
    sourceLabel:"THIEPN original kana foundations"
  };
  const correct=correctlyAnswered(events);
  const recognize=recognitionFor(id);
  const forms=selectedPractice(id);
  // Previously correct canonical answers stay recorded. Re-teach, then retry only unmet cues.
  const pending=[...recognize,...forms].filter(prompt=>
    !correct.has(prompt.id+"|"+prompt.primaryTarget.id));
  return [teach,...pending];

}
