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
    title:mode==="writing"?"B1→B2 writing + collocation practice":"B1→B2 speaking + collocation practice",
    body:mode==="writing"
      ?"Write connected Japanese, then receive a structural target check. The check verifies task length and requested language features; it does not pretend to be a full semantic correction."
      :"Speak Japanese into the browser microphone. Speech recognition supplies a transcript for a structural target check. Recognition success is evidence of intelligibility, not a phonetic pronunciation score.",
    contextId:"productive-"+mode,
    facts:[
      {label:"Level",value:"B1→B2"},
      {label:"Tasks",value:String(tasks.length)},
      {label:"Evidence",value:mode==="writing"?"writing quality + production":"spoken production"}
    ],
    sourceLabel:"THIEPN Japanese B1→B2 productive practice"
  };
  return [intro,...tasks.map((task)=>makePrompt(task))];
}

export function productivePromptForTask(taskId:string):StudyPrompt{
  const task=productiveTasks.find((item)=>item.id===taskId);
  if(!task)throw new Error("UNKNOWN_PRODUCTIVE_TASK:"+taskId);
  return makePrompt(task);
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
