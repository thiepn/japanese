export type CoachMode="conversation"|"writing_revision";
export type CoachLevel="B1+"|"B2"|"C1";
export type CoachInteractionStyle="guided"|"spontaneous";

export interface CoachHistoryTurn {
  role:"learner"|"coach";
  text:string;
}

export interface CoachFeedbackItem {
  message:string;
  original?:string;
  suggestion?:string;
  explanation?:string;
  severity?:"note"|"improvement"|"important";
}

export interface CoachFeedbackArea {
  summary:string;
  items:CoachFeedbackItem[];
  confidence:number;
}

export interface CoachFeedback {
  grammar:CoachFeedbackArea;
  vocabulary:CoachFeedbackArea;
  coherence:CoachFeedbackArea;
  taskAchievement:CoachFeedbackArea;
}

export interface CoachEvidenceContract {
  advisoryOnly:true;
  changesMastery:false;
  modelJudgmentIsLearnerTruth:false;
  acousticAnalysis:false;
  provider:string;
  model?:string;
}

export interface CoachRequest {
  sessionId:string;
  mode:CoachMode;
  targetLevel:CoachLevel;
  learnerText:string;
  history:CoachHistoryTurn[];
  scenario:string;
  goals:string[];
  register?:"casual"|"neutral"|"polite"|"formal";
  interactionStyle?:CoachInteractionStyle;
}

export interface CoachQualityReport {
  score:number;
  anchoredCorrections:number;
  correctionItems:number;
  goalMentions:number;
  warningCodes:string[];
}
export interface CoachResponse {
  replyJapanese:string;
  replyEnglishHint?:string;
  feedback:CoachFeedback;
  revisionPrompt?:string;
  evidenceContract:CoachEvidenceContract;
  quality?:CoachQualityReport;
}

export interface CoachTransport {
  evaluate(request:CoachRequest):Promise<CoachResponse>;
}

export function createHttpCoachTransport(endpoint:string,fetchImpl:typeof fetch=fetch):CoachTransport{
  return {
    async evaluate(request){
      const response=await fetchImpl(endpoint,{
        method:"POST",
        headers:{"content-type":"application/json"},
        credentials:"include",
        body:JSON.stringify(request)
      });
      if(!response.ok)throw new Error("COACH_HTTP_"+response.status);
      return parseCoachResponse(await response.json());
    }
  };
}

export function parseCoachResponse(value:unknown):CoachResponse{
  if(!value||typeof value!=="object")throw new Error("COACH_RESPONSE_INVALID");
  const input=value as Record<string,unknown>;
  const replyJapanese=requiredString(input.replyJapanese,"replyJapanese");
  const rawFeedback=input.feedback;
  if(!rawFeedback||typeof rawFeedback!=="object")throw new Error("COACH_FEEDBACK_INVALID");
  const feedbackRecord=rawFeedback as Record<string,unknown>;
  const feedback:CoachFeedback={
    grammar:parseArea(feedbackRecord.grammar,"grammar"),
    vocabulary:parseArea(feedbackRecord.vocabulary,"vocabulary"),
    coherence:parseArea(feedbackRecord.coherence,"coherence"),
    taskAchievement:parseArea(feedbackRecord.taskAchievement,"taskAchievement")
  };
  const rawContract=input.evidenceContract;
  if(!rawContract||typeof rawContract!=="object")throw new Error("COACH_EVIDENCE_CONTRACT_MISSING");
  const contract=rawContract as Record<string,unknown>;
  if(contract.advisoryOnly!==true||contract.changesMastery!==false||contract.modelJudgmentIsLearnerTruth!==false||contract.acousticAnalysis!==false){
    throw new Error("COACH_EVIDENCE_CONTRACT_UNSAFE");
  }
  return {
    replyJapanese,
    ...(typeof input.replyEnglishHint==="string"&&input.replyEnglishHint.trim()?{replyEnglishHint:input.replyEnglishHint}:{}),
    feedback,
    ...(typeof input.revisionPrompt==="string"&&input.revisionPrompt.trim()?{revisionPrompt:input.revisionPrompt}:{}),
    evidenceContract:{
      advisoryOnly:true,changesMastery:false,modelJudgmentIsLearnerTruth:false,acousticAnalysis:false,
      provider:requiredString(contract.provider,"provider"),
      ...(typeof contract.model==="string"&&contract.model.trim()?{model:contract.model}:{})
    },
    ...(input.quality&&typeof input.quality==="object"?{quality:parseQuality(input.quality)}:{})
  };
}

export function evaluateCoachResponseQuality(request:CoachRequest,response:CoachResponse):CoachQualityReport{
  const areas=Object.values(response.feedback);
  const items=areas.flatMap((area)=>area.items);
  const learner=normalizeLoose(request.learnerText);
  let anchored=0;
  const warnings:string[]=[];
  for(const item of items){
    if(!item.original?.trim())continue;
    if(learner.includes(normalizeLoose(item.original)))anchored+=1;
    else warnings.push("UNANCHORED_CORRECTION");
  }
  const searchable=normalizeLoose([
    response.replyJapanese,response.replyEnglishHint??"",response.revisionPrompt??"",
    ...areas.map((area)=>area.summary),
    ...items.flatMap((item)=>[item.message,item.suggestion??"",item.explanation??""])
  ].join(" "));
  const goalMentions=request.goals.filter((goal)=>searchable.includes(normalizeLoose(goal))).length;
  if(request.mode==="writing_revision"&&!response.revisionPrompt)warnings.push("MISSING_REVISION_PROMPT");
  if(items.length>16)warnings.push("FEEDBACK_TOO_DENSE");
  if(authorityLanguageDetected(searchable))warnings.push("AUTHORITY_LANGUAGE");
  const anchoredRatio=items.filter((item)=>item.original?.trim()).length?anchored/items.filter((item)=>item.original?.trim()).length:1;
  const goalRatio=request.goals.length?goalMentions/request.goals.length:1;
  const penalty=Math.min(.45,new Set(warnings).size*.1);
  const score=Math.max(0,Math.min(1,.55*anchoredRatio+.25*goalRatio+.2-penalty));
  return {score,anchoredCorrections:anchored,correctionItems:items.length,goalMentions,warningCodes:[...new Set(warnings)]};
}

function parseQuality(value:unknown):CoachQualityReport{
  const input=value as Record<string,unknown>;
  return {
    score:clampNumber(input.score),
    anchoredCorrections:nonNegativeInt(input.anchoredCorrections),
    correctionItems:nonNegativeInt(input.correctionItems),
    goalMentions:nonNegativeInt(input.goalMentions),
    warningCodes:Array.isArray(input.warningCodes)?input.warningCodes.filter((item):item is string=>typeof item==="string").slice(0,12):[]
  };
}

function normalizeLoose(value:string):string{
  return value.normalize("NFKC").toLowerCase().replace(/[\s。、！？!?「」『』（）()[\],.:;'"’‘“”—–-]+/gu,"");
}
function authorityLanguageDetected(value:string):boolean{
  return /(cefr.*(?:pass|passed|master|b2|c1)|(?:pass|passed).*cefr|you(?:have|'ve)?mastered|(?:b2|c1)(?:level)?(?:achieved|certified)|合格しました|(?:b2|c1)に合格|習得済み)/i.test(value);
}
function nonNegativeInt(value:unknown):number{
  return typeof value==="number"&&Number.isFinite(value)?Math.max(0,Math.floor(value)):0;
}

function parseArea(value:unknown,label:string):CoachFeedbackArea{
  if(!value||typeof value!=="object")throw new Error("COACH_FEEDBACK_AREA_INVALID_"+label);
  const input=value as Record<string,unknown>;
  const rawItems=Array.isArray(input.items)?input.items:[];
  return {
    summary:requiredString(input.summary,label+".summary"),
    items:rawItems.slice(0,8).map((item,index)=>parseItem(item,label+"."+index)),
    confidence:clampNumber(input.confidence)
  };
}

function parseItem(value:unknown,label:string):CoachFeedbackItem{
  if(!value||typeof value!=="object")throw new Error("COACH_FEEDBACK_ITEM_INVALID_"+label);
  const item=value as Record<string,unknown>;
  return {
    message:requiredString(item.message,label+".message"),
    ...(typeof item.original==="string"?{original:item.original}:{}),
    ...(typeof item.suggestion==="string"?{suggestion:item.suggestion}:{}),
    ...(typeof item.explanation==="string"?{explanation:item.explanation}:{}),
    ...(item.severity==="note"||item.severity==="improvement"||item.severity==="important"?{severity:item.severity}:{})
  };
}

function requiredString(value:unknown,label:string):string{
  if(typeof value!=="string"||!value.trim())throw new Error("COACH_FIELD_REQUIRED_"+label);
  return value.trim();
}
function clampNumber(value:unknown):number{
  const numeric=typeof value==="number"&&Number.isFinite(value)?value:0.5;
  return Math.max(0,Math.min(1,numeric));
}
