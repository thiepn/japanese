import { createEmptyCard, fsrs, Rating, type CardInput, type Grade } from "ts-fsrs";
import type { EntityRef, SkillDimension } from "@thiepn/domain";

export interface FsrsCardSnapshot {
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReviewAt?: string;
}

export interface MemoryTrace {
  id: string;
  userId: string;
  entity: EntityRef;
  skillDimension: SkillDimension;
  cueFamily: string;
  schedulerFamily: "fsrs";
  schedulerVersion: string;
  revision: number;
  card: FsrsCardSnapshot;
}

export interface MemoryTraceIdentity {
  id: string;
  userId: string;
  entity: EntityRef;
  skillDimension: SkillDimension;
  cueFamily: string;
}

export type ReviewGrade = "again" | "hard" | "good" | "easy";
export interface ReviewEvidence { grade: ReviewGrade; reviewedAt: string; }

export interface MemoryScheduler {
  readonly family: "fsrs";
  readonly version: string;
  create(identity: MemoryTraceIdentity, now: string): MemoryTrace;
  review(previous: MemoryTrace, evidence: ReviewEvidence): MemoryTrace;
}

export const FSRS_ADAPTER_VERSION = "ts-fsrs-5.4.2";

export function createFsrsScheduler(requestRetention = 0.9): MemoryScheduler {
  const scheduler = fsrs({ request_retention: requestRetention });
  return {
    family: "fsrs",
    version: FSRS_ADAPTER_VERSION,
    create(identity, now) {
      const card = createEmptyCard(new Date(now));
      return { ...identity, schedulerFamily: "fsrs", schedulerVersion: FSRS_ADAPTER_VERSION, revision: 0, card: snapshot(card) };
    },
    review(previous, evidence) {
      const result = scheduler.next(toCardInput(previous.card), new Date(evidence.reviewedAt), toRating(evidence.grade));
      return { ...previous, schedulerVersion: FSRS_ADAPTER_VERSION, revision: previous.revision + 1, card: snapshot(result.card) };
    }
  };
}

function toRating(grade: ReviewGrade): Grade {
  switch (grade) { case "again": return Rating.Again as Grade; case "hard": return Rating.Hard as Grade; case "good": return Rating.Good as Grade; case "easy": return Rating.Easy as Grade; }
}

function toCardInput(card: FsrsCardSnapshot): CardInput {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as CardInput["state"],
    last_review: card.lastReviewAt ?? null
  };
}

function snapshot(card: { due: Date; stability: number; difficulty: number; elapsed_days: number; scheduled_days: number; learning_steps: number; reps: number; lapses: number; state: number; last_review?: Date }): FsrsCardSnapshot {
  const base = { due: card.due.toISOString(), stability: card.stability, difficulty: card.difficulty, elapsedDays: card.elapsed_days, scheduledDays: card.scheduled_days, learningSteps: card.learning_steps, reps: card.reps, lapses: card.lapses, state: Number(card.state) };
  return card.last_review ? { ...base, lastReviewAt: card.last_review.toISOString() } : base;
}
