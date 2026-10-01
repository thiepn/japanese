import { getMemoryTrace, listMemoryTraces, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt } from "@thiepn/study-player";
import { FOUNDATION_TOTAL_ITEMS, foundationPrompts } from "./foundationPrompts";

export const DEVELOPMENT_ACCOUNT_ID = "00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID = "p1-local-browser";
const scheduler = createFsrsScheduler();
const NEW_ITEMS_PER_SESSION = 5;
const MAX_QUEUE_SIZE = 12;

export async function buildFoundationQueue(now = new Date()): Promise<StudyPrompt[]> {
  const traces = await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId = new Map(traces.map((trace) => [trace.id, trace]));
  const due: StudyPrompt[] = [];
  const unseen: StudyPrompt[] = [];
  for (const prompt of foundationPrompts) {
    const trace = byId.get(traceIdFor(prompt));
    if (!trace) { unseen.push(prompt); continue; }
    if (new Date(trace.card.due).getTime() <= now.getTime()) due.push(prompt);
  }
  return [...due.slice(0,MAX_QUEUE_SIZE), ...unseen.slice(0,Math.max(0,Math.min(NEW_ITEMS_PER_SESSION,MAX_QUEUE_SIZE-due.length)))];
}

export async function getFoundationStudySummary(now = new Date()): Promise<{ due: number; newItems: number; learned: number; total: number }> {
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
  return { due, newItems: Math.min(NEW_ITEMS_PER_SESSION, FOUNDATION_TOTAL_ITEMS-learned), learned, total: FOUNDATION_TOTAL_ITEMS };
}

export async function recordStudyAnswer(input:{prompt:StudyPrompt;response:string;result:"correct"|"incorrect";responseTimeMs:number}):Promise<void>{
  const traceId=traceIdFor(input.prompt);
  const existing=await getMemoryTrace(DEVELOPMENT_ACCOUNT_ID,traceId);
  const now=new Date().toISOString();
  const base=existing ?? scheduler.create({id:traceId,userId:DEVELOPMENT_ACCOUNT_ID,entity:input.prompt.primaryTarget,skillDimension:input.prompt.skill,cueFamily:input.prompt.cueFamily},now);
  const event=createStudyEvent({id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,prompt:input.prompt,response:input.response,occurredAt:now,responseTimeMs:input.responseTimeMs,baseRevision:base.revision});
  await saveStudyEvent(event);
  await saveMemoryTrace(DEVELOPMENT_ACCOUNT_ID,scheduler.review(base,{grade:gradeFor(input.result),reviewedAt:now}));
}

function gradeFor(result:"correct"|"incorrect"):ReviewGrade{return result==="correct"?"good":"again";}
export function traceIdFor(prompt:StudyPrompt):string{return `${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}:${prompt.skill}:${prompt.cueFamily}`;}
