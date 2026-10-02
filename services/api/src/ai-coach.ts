import type { CoachRequest,CoachResponse,CoachFeedbackArea } from "@thiepn/coach";
import { parseCoachResponse } from "@thiepn/coach";

export interface JsonCoachModel {
  provider:string;
  model?:string;
  completeJson(input:{system:string;user:string;schema:Record<string,unknown>}):Promise<unknown>;
}

export function createCoachHandler(model:JsonCoachModel){
  return async function handleCoach(request:CoachRequest):Promise<CoachResponse>{
    validateRequest(request);
    const raw=await model.completeJson({
      system:buildSystemPrompt(request),
      user:buildUserPrompt(request),
      schema:coachResponseSchema
    });
    const parsed=parseCoachResponse({
      ...(raw as Record<string,unknown>),
      evidenceContract:{
        advisoryOnly:true,
        changesMastery:false,
        modelJudgmentIsLearnerTruth:false,
        acousticAnalysis:false,
        provider:model.provider,
        ...(model.model?{model:model.model}:{})
      }
    });
    return parsed;
  };
}

export function buildSystemPrompt(request:CoachRequest):string{
  const mode=request.mode==="conversation"?"conversation partner and language coach":"Japanese writing revision coach";
  return [
    "You are a Japanese "+mode+" for an independent B1→B2 learner.",
    "Respond primarily in natural Japanese appropriate to the requested register.",
    "Do not assign CEFR grades, mastery, pass/fail status, pronunciation scores, or confidence beyond the requested feedback confidence field.",
    "Keep four feedback dimensions separate: grammar, vocabulary, coherence, task achievement.",
    "Prefer a small number of high-value corrections over rewriting everything.",
    "When correcting, preserve the learner's intended meaning unless the meaning is unclear.",
    "For conversation mode, continue the conversation naturally instead of turning every turn into a lecture.",
    "For writing revision mode, give a concise revision prompt that asks the learner to rewrite rather than simply replacing the text.",
    "Never claim acoustic or pitch-accent analysis: no audio signal is supplied.",
    "Target level: "+request.targetLevel+". Register: "+(request.register??"neutral")+"."
  ].join("\n");
}

export function buildUserPrompt(request:CoachRequest):string{
  const history=request.history.slice(-10).map((turn)=>turn.role.toUpperCase()+": "+turn.text).join("\n");
  return [
    "Scenario: "+request.scenario,
    "Goals: "+request.goals.join("; "),
    history?"Recent dialogue:\n"+history:"",
    "Learner response:\n"+request.learnerText,
    "Return structured JSON matching the supplied schema."
  ].filter(Boolean).join("\n\n");
}

function validateRequest(request:CoachRequest):void{
  if(!request.sessionId.trim())throw new Error("COACH_SESSION_REQUIRED");
  if(!request.learnerText.trim())throw new Error("COACH_TEXT_REQUIRED");
  if(request.learnerText.length>8000)throw new Error("COACH_TEXT_TOO_LONG");
  if(request.history.length>30)throw new Error("COACH_HISTORY_TOO_LONG");
  if(request.targetLevel!=="B1+"&&request.targetLevel!=="B2")throw new Error("COACH_LEVEL_INVALID");
}

const areaSchema={
  type:"object",
  additionalProperties:false,
  required:["summary","items","confidence"],
  properties:{
    summary:{type:"string"},
    items:{type:"array",maxItems:8,items:{type:"object",additionalProperties:false,required:["message"],properties:{
      message:{type:"string"},original:{type:"string"},suggestion:{type:"string"},explanation:{type:"string"},
      severity:{type:"string",enum:["note","improvement","important"]}
    }}},
    confidence:{type:"number",minimum:0,maximum:1}
  }
};

export const coachResponseSchema:Record<string,unknown>={
  type:"object",
  additionalProperties:false,
  required:["replyJapanese","feedback"],
  properties:{
    replyJapanese:{type:"string"},
    replyEnglishHint:{type:"string"},
    revisionPrompt:{type:"string"},
    feedback:{type:"object",additionalProperties:false,required:["grammar","vocabulary","coherence","taskAchievement"],properties:{
      grammar:areaSchema,vocabulary:areaSchema,coherence:areaSchema,taskAchievement:areaSchema
    }}
  }
};

export function emptyFeedbackArea(message:string):CoachFeedbackArea{
  return {summary:message,items:[],confidence:0};
}
