export type EntityKind = "lexeme" | "sense" | "kanji" | "grammar" | "sentence" | "text" | "document" | "kana" | "can_do";
export interface EntityRef { kind: EntityKind; id: string; }

export type SkillDimension =
  | "meaning_recognition" | "reading" | "audio_recognition" | "active_use"
  | "comprehension" | "form_selection" | "listening" | "production"
  | "recognition" | "fluency" | "word_recognition" | "handwriting";

export type ActivityType = "lesson" | "review" | "reading" | "listening" | "speaking" | "writing" | "assessment" | "lookup" | "mining";
export type StudyResult = "correct" | "partial" | "incorrect" | "revealed" | "skipped";

export interface StudyEvent {
  id: string;
  userId: string;
  deviceId: string;
  occurredAt: string;
  receivedAt?: string;
  activity: ActivityType;
  primaryTarget?: EntityRef;
  secondaryTargets?: EntityRef[];
  skillDimension?: SkillDimension;
  promptFamily?: string;
  responseMode?: string;
  result?: StudyResult;
  responseTimeMs?: number;
  hintsUsed?: number;
  attempts?: number;
  confidence?: number;
  contextId?: string;
  sourceId?: string;
  schedulerVersion?: string;
  contentVersion?: string;
  learnerModelVersion?: string;
  baseRevision?: number;
  metadata?: Record<string, unknown>;
}

export interface SkillMasteryProjection {
  userId: string;
  entity: EntityRef;
  dimension: SkillDimension;
  estimate: number;
  confidence: number;
  evidenceCount: number;
  lastEvidenceAt?: string;
  modelVersion: string;
}

export function entityKey(entity: EntityRef, dimension?: SkillDimension): string {
  return dimension ? `${entity.kind}:${entity.id}:${dimension}` : `${entity.kind}:${entity.id}`;
}
