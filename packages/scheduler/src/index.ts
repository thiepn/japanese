import type { EntityRef, SkillDimension } from "@thiepn/domain";

export interface MemoryTrace {
  id: string;
  userId: string;
  entity: EntityRef;
  skillDimension: SkillDimension;
  cueFamily: string;
  schedulerFamily: "fsrs";
  schedulerVersion: string;
  difficulty: number;
  stability: number;
  retrievability?: number;
  lastReviewAt?: string;
  nextReviewAt?: string;
  revision: number;
}
export type ReviewGrade = "again" | "hard" | "good" | "easy";
export interface ReviewEvidence { grade: ReviewGrade; reviewedAt: string; }
export interface MemoryScheduler {
  readonly family: "fsrs";
  readonly version: string;
  review(previous: MemoryTrace | null, evidence: ReviewEvidence): MemoryTrace;
}

// Production FSRS implementation is intentionally behind this adapter and will be wired in P1.
