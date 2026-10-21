import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {basicHiragana,basicKatakana,foundationApplicationPrompts,foundationLessons,kanaRecognitionPrompts} from "./foundationPrompts";

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

type Script="hiragana"|"katakana";
function seedsFor(script:Script,id:BeginnerStageId){
  return (script==="hiragana"?basicHiragana:basicKatakana).filter(seed=>seed.group===id);
}
function recognitionFor(script:Script,id:BeginnerStageId):StudyPrompt[]{
  return seedsFor(script,id).map(seed=>{
    const prompt=kanaRecognitionPrompts.find(item=>item.primaryTarget.id===script+"-"+seed.kana);
    if(!prompt)throw new Error("MISSING_CANONICAL_KANA:"+seed.kana);
    return prompt;
  });
}
function selectedPractice(script:Script,id:BeginnerStageId):StudyPrompt[]{
  const seeds=seedsFor(script,id);
  return foundationApplicationPrompts.filter(prompt=>prompt.skill==="form_selection"
    &&seeds.some(seed=>prompt.primaryTarget.id===script+"-"+seed.kana)).slice(0,2);
}
function stagePrompts(script:Script,id:BeginnerStageId):StudyPrompt[]{
  return [...recognitionFor(script,id),...selectedPractice(script,id)];
}
// A0 uses the original authored answers and grading authority, but must not
// reveal every correct answer as the first choice. Keep the original prompt IDs,
// cue families and source records; only its beginner-stage presentation changes.
function positionStageAnswer(prompt:StudyPrompt,index:number,previousErrors:number):StudyPrompt{
  if(prompt.promptType!=="choice"||prompt.choices.length<2)return prompt;
  const correct=prompt.acceptedAnswers[0];
  if(!correct||!prompt.choices.includes(correct))
    throw new Error("A0_CANONICAL_KANA_ANSWER_MISSING:"+prompt.id);
  const choices=prompt.choices.filter(choice=>choice!==correct);
  choices.splice((index+1+previousErrors)%prompt.choices.length,0,correct);
  return {...prompt,choices};
}
const CANONICAL_IDENTITIES:Record<Script,ReadonlySet<string>>={
  hiragana:new Set(GROUPS.flatMap(group=>stagePrompts("hiragana",group.id)
    .map(prompt=>prompt.id+"|"+prompt.primaryTarget.id))),
  katakana:new Set(GROUPS.flatMap(group=>stagePrompts("katakana",group.id)
    .map(prompt=>prompt.id+"|"+prompt.primaryTarget.id)))
};
function previousStageErrors(script:Script,events:readonly StudyEvent[]):Map<string,number>{
  const failures=new Map<string,number>();
  for(const event of events){
    if(event.result!=="incorrect"||event.primaryTarget?.kind!=="kana"
      ||event.metadata?.nonAuthoritative===true||typeof event.metadata?.promptId!=="string")continue;
    const identity=event.metadata.promptId+"|"+event.primaryTarget.id;
    if(!CANONICAL_IDENTITIES[script].has(identity))continue;
    failures.set(identity,(failures.get(identity)??0)+1);
  }
  return failures;
}
function correctlyAnswered(events:readonly StudyEvent[]):Set<string>{
  return new Set(events.filter(event=>event.result==="correct"&&event.primaryTarget?.kind==="kana"
    &&event.metadata?.nonAuthoritative!==true&&typeof event.metadata?.promptId==="string")
    .map(event=>String(event.metadata?.promptId)+"|"+event.primaryTarget!.id));
}
function projectScriptOverview(script:Script,events:readonly StudyEvent[]):BeginnerOverview{
  const correct=correctlyAnswered(events);
  let priorCompleted=true;
  const stages:BeginnerStage[]=GROUPS.map(group=>{
    const prompts=stagePrompts(script,group.id);
    if(prompts.length===0)throw new Error("EMPTY_CANONICAL_KANA_GROUP:"+script+"-"+group.id);
    const count=prompts.filter(prompt=>correct.has(prompt.id+"|"+prompt.primaryTarget.id)).length;
    const completed=count===prompts.length;
    const stage={id:group.id,
      title:script==="katakana"&&group.id==="w"?"W sounds and ン":group.title,
      correct:count,total:prompts.length,completed,unlocked:priorCompleted};
    priorCompleted=priorCompleted&&completed;
    return stage;
  });
  const nextId=stages.find(stage=>!stage.completed)?.id??null;
  return {stages,completed:stages.filter(stage=>stage.completed).length,total:stages.length,nextId,
    started:events.some(event=>event.primaryTarget?.kind==="kana"
      &&(event.result==="correct"||event.result==="incorrect")
      &&event.metadata?.nonAuthoritative!==true
      &&CANONICAL_IDENTITIES[script].has(String(event.metadata?.promptId)+"|"+event.primaryTarget.id)),
    complete:nextId===null};
}
export function projectBeginnerOverview(events:readonly StudyEvent[]):BeginnerOverview{
  return projectScriptOverview("hiragana",events);
}
export function projectKatakanaOverview(events:readonly StudyEvent[]):BeginnerOverview{
  return projectScriptOverview("katakana",events);
}
const VOWEL_TIPS:Readonly<Record<string,string>>={
  "あ":"a · as in father","い":"i · like ee in see",
  "う":"u · a short unrounded oo-like sound","え":"e · as in get","お":"o · a pure oh sound"
};
function buildScriptStage(script:Script,id:BeginnerStageId,events:readonly StudyEvent[]):StudyStep[]{
  const group=GROUPS.find(item=>item.id===id);
  if(!group)throw new Error("UNKNOWN_BEGINNER_STAGE");
  const overview=projectScriptOverview(script,events);
  if(!overview.stages.find(stage=>stage.id===id)?.unlocked)throw new Error("BEGINNER_STAGE_LOCKED");
  const seeds=seedsFor(script,id);
  const context=script+"-"+id;
  const explanation=foundationLessons[context]?.body;
  const teach:StudyLesson={
    kind:"lesson",id:"a0-"+script+"-"+id+"-teach",contextId:"a0-"+script+"-"+id,
    title:(script==="hiragana"?"Hiragana":"Katakana")+" · "+overview.stages.find(stage=>stage.id===id)!.title,
    body:(explanation??"Each kana character represents a Japanese sound.")+
      " Play each sound and repeat it aloud. Then identify each character in practice.",
    examples:seeds.map(seed=>({expression:seed.kana,note:script==="hiragana"?VOWEL_TIPS[seed.kana]??seed.reading:seed.reading})),
    sourceLabel:"THIEPN original kana foundations"
  };
  const correct=correctlyAnswered(events);
  const errors=previousStageErrors(script,events);
  const pending=stagePrompts(script,id).map((prompt,index)=>
    positionStageAnswer(prompt,index,errors.get(prompt.id+"|"+prompt.primaryTarget.id)??0)
  ).filter(prompt=>!correct.has(prompt.id+"|"+prompt.primaryTarget.id));
  return [teach,...pending];
}
export function buildBeginnerStage(id:BeginnerStageId,events:readonly StudyEvent[]):StudyStep[]{
  return buildScriptStage("hiragana",id,events);
}
export function buildKatakanaStage(id:BeginnerStageId,events:readonly StudyEvent[]):StudyStep[]{
  return buildScriptStage("katakana",id,events);
}
