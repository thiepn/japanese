import type { ProductiveTask } from "@thiepn/content-schema";
import type { StudyLesson, StudyPrompt, StudyStep } from "@thiepn/study-player";
import { coreContent, productiveTasks } from "../coreContent";

export const productiveWritingPrompts:StudyPrompt[]=productiveTasks.filter((task)=>task.mode==="writing").map(makePrompt);
export const productiveSpeakingPrompts:StudyPrompt[]=productiveTasks.filter((task)=>task.mode==="speaking").map(makePrompt);
export const productivePrompts:StudyPrompt[]=[...productiveWritingPrompts,...productiveSpeakingPrompts];

export function productivePracticeSession(mode:"writing"|"speaking"):StudyStep[]{
  const tasks=productiveTasks.filter((task)=>task.mode===mode);
  const intro:StudyLesson={
    kind:"lesson",id:"productive-"+mode+"-intro",
    title:mode==="writing"?"B1→C1 writing + discourse practice":"B1→C1 speaking + discourse practice",
    body:mode==="writing"
      ?"Write connected Japanese, then receive a structural target check. The check verifies task length and requested language features; it does not pretend to be a full semantic correction."
      :"Speak Japanese into the browser microphone. Speech recognition supplies a transcript for a structural target check. Recognition success is evidence of intelligibility, not a phonetic pronunciation score.",
    contextId:"productive-"+mode,
    facts:[
      {label:"Level",value:"B1→C1"},
      {label:"Tasks",value:String(tasks.length)},
      {label:"Evidence",value:mode==="writing"?"writing quality + production":"spoken production"}
    ],
    sourceLabel:"THIEPN Japanese B1→C1 productive practice"
  };
  return [intro,...tasks.map((task)=>makePrompt(task))];
}

export function productivePromptForTask(taskId:string):StudyPrompt{
  const task=productiveTasks.find((item)=>item.id===taskId);
  if(!task)throw new Error("UNKNOWN_PRODUCTIVE_TASK:"+taskId);
  return makePrompt(task);
}

export function productiveTaskSession(taskId:string):StudyStep[]{
  const task=productiveTasks.find((item)=>item.id===taskId);
  if(!task)throw new Error("UNKNOWN_PRODUCTIVE_TASK:"+taskId);
  const intro:StudyLesson={
    kind:"lesson",
    id:"productive-single-"+task.id,
    title:task.title,
    body:"This "+task.level+" task belongs to the independent production path. Produce the response independently; the built-in check verifies transparent structural targets and response length, not full semantic quality or accredited CEFR performance.",
    contextId:"productive-"+task.id,
    facts:[
      {label:"Mode",value:task.mode},
      {label:"Level",value:task.level},
      {label:"Targets",value:task.requiredTerms.join(" · "),language:"ja"}
    ],
    sourceLabel:"THIEPN Japanese "+task.level+" productive task"
  };
  return [intro,makePrompt(task)];
}

function makePrompt(task:ProductiveTask):StudyPrompt{
  return {
    id:"productive-"+task.id,
    primaryTarget:{kind:"production_task",id:task.id},
    skill:task.mode==="writing"?"writing_quality":"production",
    cueFamily:task.mode==="writing"?"connected-writing":"spoken-response",
    promptType:task.mode==="writing"?"textarea":"speech",
    instruction:task.mode==="writing"?"Write a connected response.":"Respond aloud in Japanese.",
    prompt:task.prompt,
    promptLanguage:"en",
    placeholder:task.mode==="writing"?"日本語で書いてください…":"Speak in Japanese…",
    acceptedAnswers:[task.modelResponse],
    displayAnswer:task.modelResponse,
    explanation:"Situation: "+task.situation+" Model response: "+task.modelResponse,
    contextId:"productive-"+task.id,
    answerNormalization:"japanese",
    sourceId:task.sourceIds[0]??"thiepn-original",
    contentVersion:coreContent.version,
    requiredTerms:task.requiredTerms,
    minimumCharacters:task.minimumCharacters,
    activity:task.mode==="writing"?"writing":"speaking",
    languageActivity:task.milestoneArea??(task.mode==="writing"?"writing":"spoken_production"),
    eventMetadata:{
      productiveTaskId:task.id,
      targetGrammarIds:task.targetGrammarIds,
      targetLexemeIds:task.targetLexemeIds,
      targetChunkIds:task.targetChunkIds??[],
      evaluation:"structural-target-coverage",
      ...(task.milestoneArea?{milestoneArea:task.milestoneArea}:{})
    }
  };
}
