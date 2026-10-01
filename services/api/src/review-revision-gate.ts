import type { StudyEvent } from "@thiepn/domain";

export type ReviewDispositionReason = "advanced" | "stale_revision" | "future_revision" | "not_schedulable";

export interface ReviewDisposition {
  advancesSchedule: boolean;
  reason: ReviewDispositionReason;
  observedRevision: number;
  nextRevision: number;
}

export class ReviewRevisionGate {
  private readonly revisions = new Map<string, number>();

  assess(event: StudyEvent): ReviewDisposition {
    const key = traceKey(event);
    if (!key) return { advancesSchedule: false, reason: "not_schedulable", observedRevision: 0, nextRevision: 0 };

    const observedRevision = this.revisions.get(key) ?? 0;
    const baseRevision = event.baseRevision ?? 0;
    if (baseRevision < observedRevision) {
      return { advancesSchedule: false, reason: "stale_revision", observedRevision, nextRevision: observedRevision };
    }
    if (baseRevision > observedRevision) {
      return { advancesSchedule: false, reason: "future_revision", observedRevision, nextRevision: observedRevision };
    }

    const nextRevision = observedRevision + 1;
    this.revisions.set(key, nextRevision);
    return { advancesSchedule: true, reason: "advanced", observedRevision, nextRevision };
  }

  revisionFor(event: StudyEvent): number {
    const key = traceKey(event);
    return key ? (this.revisions.get(key) ?? 0) : 0;
  }
}

function traceKey(event: StudyEvent): string | null {
  if (event.activity !== "review" || !event.primaryTarget || !event.skillDimension || !event.promptFamily) return null;
  const target = `${event.primaryTarget.kind}:${event.primaryTarget.id}`;
  return `${event.userId}:${target}:${event.skillDimension}:${event.promptFamily}`;
}
