import { entityKey, type SkillMasteryProjection, type StudyEvent } from "@thiepn/domain";

export interface LearnerState { mastery: Record<string, SkillMasteryProjection>; eventCount: number; }
export const LEARNER_MODEL_VERSION = "p0.1";
export const initialLearnerState: LearnerState = { mastery: {}, eventCount: 0 };

export function reduceStudyEvent(state: LearnerState, event: StudyEvent): LearnerState {
  if (!event.primaryTarget || !event.skillDimension) return { ...state, eventCount: state.eventCount + 1 };
  const key = entityKey(event.primaryTarget, event.skillDimension);
  const existing = state.mastery[key];
  const delta = evidenceDelta(event);
  const projection: SkillMasteryProjection = {
    userId: event.userId,
    entity: event.primaryTarget,
    dimension: event.skillDimension,
    estimate: clamp((existing?.estimate ?? 0.25) + delta),
    confidence: clamp((existing?.confidence ?? 0.1) + Math.abs(delta) * 0.6 + 0.03),
    evidenceCount: (existing?.evidenceCount ?? 0) + 1,
    lastEvidenceAt: event.occurredAt,
    modelVersion: LEARNER_MODEL_VERSION
  };
  return { mastery: { ...state.mastery, [key]: projection }, eventCount: state.eventCount + 1 };
}

function evidenceDelta(event: StudyEvent): number {
  if (event.activity === "lookup") return -0.02;
  if ((event.hintsUsed ?? 0) > 0 && event.result === "correct") return 0.03;
  switch (event.result) {
    case "correct": return 0.14;
    case "partial": return 0.05;
    case "incorrect": return -0.12;
    case "revealed": return -0.16;
    default: return 0;
  }
}
function clamp(value: number): number { return Math.max(0, Math.min(1, value)); }
