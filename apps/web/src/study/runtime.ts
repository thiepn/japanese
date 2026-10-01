import { getMemoryTrace, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt } from "@thiepn/study-player";

export const DEVELOPMENT_ACCOUNT_ID = "00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID = "p1-local-browser";
const scheduler = createFsrsScheduler();

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
function traceIdFor(prompt: StudyPrompt): string { return `${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}:${prompt.skill}:${prompt.cueFamily}`; }
