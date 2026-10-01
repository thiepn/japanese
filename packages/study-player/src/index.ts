import type { EntityRef, SkillDimension, StudyEvent, StudyResult } from "@thiepn/domain";

export type StudyPromptType = "choice" | "typed";

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
}

export interface ChoiceStudyPrompt extends StudyPromptBase { promptType: "choice"; choices: string[]; }
export interface TypedStudyPrompt extends StudyPromptBase { promptType: "typed"; placeholder?: string; }
export type StudyPrompt = ChoiceStudyPrompt | TypedStudyPrompt;

export interface StudyLessonExample {
  expression: string;
  note: string;
}

export interface StudyLesson {
  kind: "lesson";
  id: string;
  title: string;
  body: string;
  contextId: string;
  examples?: StudyLessonExample[];
}

export type StudyStep = StudyPrompt | StudyLesson;

export function isStudyLesson(step: StudyStep): step is StudyLesson {
  return "kind" in step && step.kind === "lesson";
}

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
  const normalizedResponse = normalizeResponse(response);
  const correct = prompt.acceptedAnswers.some((answer) => normalizeResponse(answer) === normalizedResponse);
  return { result: correct ? "correct" : "incorrect", normalizedResponse, expectedAnswer: prompt.displayAnswer };
}

export function createStudyEvent(input: StudyEventInput): StudyEvent {
  const grade = gradeStudyPrompt(input.prompt, input.response);
  return {
    id: input.id,
    userId: input.userId,
    deviceId: input.deviceId,
    occurredAt: input.occurredAt,
    activity: "review",
    primaryTarget: input.prompt.primaryTarget,
    skillDimension: input.prompt.skill,
    promptFamily: input.prompt.cueFamily,
    responseMode: input.prompt.promptType,
    result: grade.result,
    responseTimeMs: input.responseTimeMs,
    attempts: 1,
    ...(input.hintsUsed === undefined ? {} : { hintsUsed: input.hintsUsed }),
    ...(input.prompt.contextId === undefined ? {} : { contextId: input.prompt.contextId }),
    ...(input.baseRevision === undefined ? {} : { baseRevision: input.baseRevision }),
    metadata: { promptId: input.prompt.id }
  };
}

export function normalizeResponse(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}
