import type { AudioAssetRecord, LanguageActivity } from "@thiepn/content-schema";
import type { ActivityType, EntityRef, SkillDimension, StudyEvent, StudyResult } from "@thiepn/domain";

export type StudyPromptType = "choice" | "typed" | "textarea" | "speech";
export type AnswerNormalization = "default" | "romaji" | "japanese";

interface StudyPromptBase {
  id: string;
  primaryTarget: EntityRef;
  skill: SkillDimension;
  cueFamily: string;
  promptType: StudyPromptType;
  instruction: string;
  prompt: string;
  promptLanguage?: "ja" | "en";
  acceptedAnswers: string[];
  displayAnswer: string;
  explanation?: string;
  contextId?: string;
  answerNormalization?: AnswerNormalization;
  sourceId?: string;
  contentVersion?: string;
  audio?: AudioAssetRecord;
  activity?: ActivityType;
  languageActivity?: LanguageActivity;
  eventMetadata?: Record<string,unknown>;
  requiredTerms?: string[];
  minimumCharacters?: number;
}

export interface ChoiceStudyPrompt extends StudyPromptBase { promptType: "choice"; choices: string[]; }
export interface TypedStudyPrompt extends StudyPromptBase { promptType: "typed"; placeholder?: string; }
export interface TextareaStudyPrompt extends StudyPromptBase { promptType: "textarea"; placeholder?: string; }
export interface SpeechStudyPrompt extends StudyPromptBase { promptType: "speech"; placeholder?: string; }
export type StudyPrompt = ChoiceStudyPrompt | TypedStudyPrompt | TextareaStudyPrompt | SpeechStudyPrompt;

export interface StudyLessonExample { expression: string; note: string; }
export interface StudyLessonFact { label: string; value: string; language?: "ja" | "en"; }
export interface StudyLesson {
  kind: "lesson";
  id: string;
  title: string;
  body: string;
  contextId: string;
  facts?: StudyLessonFact[];
  examples?: StudyLessonExample[];
  sourceLabel?: string;
  audio?: AudioAssetRecord;
}
export type StudyStep = StudyPrompt | StudyLesson;
export function isStudyLesson(step: StudyStep): step is StudyLesson { return "kind" in step && step.kind === "lesson"; }

export interface GradeResult {
  result: Extract<StudyResult, "correct" | "incorrect">;
  normalizedResponse: string;
  expectedAnswer: string;
}

export interface StudyEventInput {
  id: string;
  userId: string;
  deviceId: string;
  prompt: StudyPrompt;
  response: string;
  occurredAt: string;
  responseTimeMs: number;
  hintsUsed?: number;
  baseRevision?: number;
}

export function gradeStudyPrompt(prompt: StudyPrompt, response: string): GradeResult {
  const mode = prompt.answerNormalization ?? "default";
  const normalizedResponse = normalizeResponse(response, mode);
  const rubricMode=(prompt.promptType==="textarea"||prompt.promptType==="speech")&&Boolean(prompt.requiredTerms?.length||prompt.minimumCharacters);
  const normalizedTerms=(prompt.requiredTerms??[]).map((term)=>normalizeResponse(term,mode));
  const termHits=normalizedTerms.filter((term)=>normalizedResponse.includes(term)).length;
  const termRatio=normalizedTerms.length?termHits/normalizedTerms.length:1;
  const substantiveLength=normalizedResponse.replace(/[\s。、！？!?「」『』（）［］…・,.:;—–-]/gu,"").length;
  const lengthOk=substantiveLength>=(prompt.minimumCharacters??1);
  const correct=rubricMode
    ? lengthOk&&termRatio>=0.6
    : prompt.acceptedAnswers.some((answer) => normalizeResponse(answer, mode) === normalizedResponse);
  return { result: correct ? "correct" : "incorrect", normalizedResponse, expectedAnswer: prompt.displayAnswer };
}

export function createStudyEvent(input: StudyEventInput): StudyEvent {
  const grade = gradeStudyPrompt(input.prompt, input.response);
  const metadata:Record<string,unknown>={promptId:input.prompt.id,...(input.prompt.eventMetadata ?? {})};
  if(input.prompt.languageActivity)metadata.languageActivity=input.prompt.languageActivity;
  if(input.prompt.audio){
    metadata.audioAssetId=input.prompt.audio.id;
    metadata.audioSourceIds=input.prompt.audio.sourceIds;
    metadata.audioLanguage=input.prompt.audio.language;
  }
  return {
    id: input.id, userId: input.userId, deviceId: input.deviceId, occurredAt: input.occurredAt,
    activity: input.prompt.activity ?? (input.prompt.audio ? "listening" : "review"),
    primaryTarget: input.prompt.primaryTarget, skillDimension: input.prompt.skill,
    promptFamily: input.prompt.cueFamily, responseMode: input.prompt.promptType, result: grade.result,
    responseTimeMs: input.responseTimeMs, attempts: 1,
    ...(input.hintsUsed === undefined ? {} : { hintsUsed: input.hintsUsed }),
    ...(input.prompt.contextId === undefined ? {} : { contextId: input.prompt.contextId }),
    ...(input.prompt.sourceId === undefined ? {} : { sourceId: input.prompt.sourceId }),
    ...(input.prompt.contentVersion === undefined ? {} : { contentVersion: input.prompt.contentVersion }),
    ...(input.baseRevision === undefined ? {} : { baseRevision: input.baseRevision }),
    metadata
  };
}

const ROMAJI_EQUIVALENTS: Readonly<Record<string,string>> = {
  si:"shi", ti:"chi", tu:"tsu", hu:"fu", zi:"ji", di:"ji", du:"zu",
  sya:"sha", syu:"shu", syo:"sho",
  tya:"cha", tyu:"chu", tyo:"cho", cya:"cha", cyu:"chu", cyo:"cho",
  zya:"ja", zyu:"ju", zyo:"jo", jya:"ja", jyu:"ju", jyo:"jo",
  dya:"ja", dyu:"ju", dyo:"jo"
};

export function normalizeResponse(value: string, mode: AnswerNormalization = "default"): string {
  const base = value.normalize("NFKC").trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[‐‑‒–—−]/g,"-").replace(/\s+/g," ");
  if (mode === "japanese") return base.replace(/[\s・･]/g,"");
  if (mode === "romaji") {
    const compact = base.replace(/[\s._-]/g,"");
    return ROMAJI_EQUIVALENTS[compact] ?? compact;
  }
  return base;
}
