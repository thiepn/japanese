import { getMemoryTrace, listMemoryTraces, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt } from "@thiepn/study-player";
import { foundationPrompts } from "./foundationPrompts";

export const DEVELOPMENT_ACCOUNT_ID = "00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID = "p1-local-browser";
const scheduler = createFsrsScheduler();

export async function buildFoundationQueue(now = new Date()): Promise<StudyPrompt[]> {
  const traces = await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId = new Map(traces.map((trace) => [trace.id, trace]));
  const due: StudyPrompt[] = [];
  const newItems: StudyPrompt[] = [];
  for (const prompt of foundationPrompts) {
    const trace = byId.get(traceIdFor(prompt));
    if (!trace) { newItems.push(prompt); continue; }
    if (new Date(trace.card.due).getTime() <= now.getTime()) due.push(prompt);
  }
  return [...due, ...newItems].slice(0, 8);
}

export async function getFoundationStudySummary(now = new Date()): Promise<{ due: number; newItems: number; learned: number }> {
  const traces = await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId = new Map(traces.map((trace) => [trace.id, trace]));
  let due = 0;
  let learned = 0;
  for (const prompt of foundationPrompts) {
    const trace = byId.get(traceIdFor(prompt));
    if (!trace) continue;
    learned += 1;
    if (new Date(trace.card.due).getTime() <= now.getTime()) due += 1;
  }
  return { due, newItems: foundationPrompts.length - learned, learned };
}

export async function recordStudyAnswer(input: { prompt: StudyPrompt; response: string; result: "correct" | "incorrect"; responseTimeMs: number; }): Promise<void> {
  const traceId = traceIdFor(input.prompt);
  const existing = await getMemoryTrace(DEVELOPMENT_ACCOUNT_ID, traceId);
  const now = new Date().toISOString();
  const base = existing ?? scheduler.create({
    id: traceId, userId: DEVELOPMENT_ACCOUNT_ID, entity: input.prompt.primaryTarget,
    skillDimension: input.prompt.skill, cueFamily: input.prompt.cueFamily
  }, now);
  const event = createStudyEvent({
    id: crypto.randomUUID(), userId: DEVELOPMENT_ACCOUNT_ID, deviceId: DEVELOPMENT_DEVICE_ID, prompt: input.prompt,
    response: input.response, occurredAt: now, responseTimeMs: input.responseTimeMs, baseRevision: base.revision
  });
  await saveStudyEvent(event);
  const reviewed = scheduler.review(base, { grade: gradeFor(input.result), reviewedAt: now });
  await saveMemoryTrace(DEVELOPMENT_ACCOUNT_ID, reviewed);
}

function gradeFor(result: "correct" | "incorrect"): ReviewGrade { return result === "correct" ? "good" : "again"; }
export function traceIdFor(prompt: StudyPrompt): string { return `${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}:${prompt.skill}:${prompt.cueFamily}`; }
