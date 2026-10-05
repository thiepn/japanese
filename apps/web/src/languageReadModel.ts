import {
  createLanguageReadModel,
  type LanguageReadModel
} from "@thiepn/languages/read-model";
import { listStudyEvents } from "@thiepn/local-db";
import {
  getC1PortfolioSummary,
  type C1PortfolioSummary
} from "./study/c1Reliability";
import {
  DEVELOPMENT_ACCOUNT_ID,
  getA1MilestoneAssessmentProgress,
  getB1MilestoneAssessmentProgress,
  getB2MilestoneAssessmentProgress,
  getC1FoundationAssessmentProgress,
  getCourseProgress,
  getGrammarMasterySummary,
  getKanaMasterySummary,
  getLexicalFluencySummary,
  getSentenceMasterySummary,
  getStudySummary,
  getVocabularyMasterySummary,
  type B1MilestoneProgress,
  type B2MilestoneProgress,
  type C1FoundationProgress,
  type CourseUnitProgress,
  type GrammarMasterySummary,
  type KanaMasterySummary,
  type LexicalFluencySummary,
  type SentenceMasterySummary,
  type StudySummary,
  type VocabularyMasterySummary,
  type A1MilestoneProgress
} from "./study/runtime";

export const JAPANESE_READ_MODEL_PRODUCER_REVISION =
  "japanese-p8-read-model-v2";

type MilestoneProgress =
  | A1MilestoneProgress
  | B1MilestoneProgress
  | B2MilestoneProgress
  | C1FoundationProgress;

export interface JapaneseReadModelInputs {
  readonly generatedAt: string;
  readonly summary: StudySummary;
  readonly kana: KanaMasterySummary;
  readonly vocabulary: VocabularyMasterySummary;
  readonly grammar: GrammarMasterySummary;
  readonly sentence: SentenceMasterySummary;
  readonly lexicalFluency: LexicalFluencySummary;
  readonly course: readonly CourseUnitProgress[];
  readonly milestones: {
    readonly a1: A1MilestoneProgress;
    readonly b1: B1MilestoneProgress;
    readonly b2: B2MilestoneProgress;
    readonly c1: C1FoundationProgress;
  };
  readonly c1Portfolio?: C1PortfolioSummary;
  readonly activity: {
    readonly todayEvents: number;
    readonly sevenDayEvents: number;
    readonly streakDays: number;
    readonly lastStudiedAt: string | null;
    readonly stateRevision?: string;
  };
  readonly appRoute?: string;
}

export async function getJapaneseLanguageReadModel(
  now = new Date()
): Promise<LanguageReadModel> {
  const [
    summary,
    kana,
    vocabulary,
    grammar,
    sentence,
    lexicalFluency,
    course,
    a1,
    b1,
    b2,
    c1,
    c1Portfolio,
    events
  ] = await Promise.all([
    getStudySummary(now),
    getKanaMasterySummary(),
    getVocabularyMasterySummary(),
    getGrammarMasterySummary(),
    getSentenceMasterySummary(),
    getLexicalFluencySummary(),
    getCourseProgress(),
    getA1MilestoneAssessmentProgress(),
    getB1MilestoneAssessmentProgress(),
    getB2MilestoneAssessmentProgress(),
    getC1FoundationAssessmentProgress(),
    getC1PortfolioSummary(),
    listStudyEvents(DEVELOPMENT_ACCOUNT_ID)
  ]);

  const activity = summarizeActivity(events, now);
  const appRoute =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin + "/"
      : undefined;

  return createJapaneseLanguageReadModel({
    generatedAt: now.toISOString(),
    summary,
    kana,
    vocabulary,
    grammar,
    sentence,
    lexicalFluency,
    course,
    milestones: { a1, b1, b2, c1 },
    c1Portfolio,
    activity,
    ...(appRoute ? { appRoute } : {})
  });
}

export function createJapaneseLanguageReadModel(
  input: JapaneseReadModelInputs
): LanguageReadModel {
  const totalItems =
    input.summary.due +
    input.summary.newKana +
    input.summary.newVocabulary +
    input.summary.listening +
    input.summary.application +
    input.summary.course;

  const masteredUnits = input.course.filter(
    (unit) => unit.status === "mastered"
  ).length;

  const milestone = milestoneProjection(input.milestones);
  const nextAction = japaneseNextAction(input.summary);

  return createLanguageReadModel({
    generatedAt: input.generatedAt,
    appId: "japanese",
    languageId: "japanese",
    producerRevision: JAPANESE_READ_MODEL_PRODUCER_REVISION,
    presentation: {
      displayName: "Japanese",
      nativeName: "日本語",
      ...(input.appRoute ? { appRoute: input.appRoute } : {})
    },
    enrollment: {
      status: "active",
      ...(milestone.frontierBand
        ? { targetBand: milestone.frontierBand }
        : {})
    },
    workload: {
      dueItems: input.summary.due,
      newItems: input.summary.newKana + input.summary.newVocabulary,
      practiceItems: input.summary.listening + input.summary.application,
      courseItems: input.summary.course,
      totalItems
    },
    activity: input.activity,
    progress: {
      metrics: [
        {
          id: "kana-introduced",
          label: "Kana introduced",
          current: input.summary.learnedKana,
          total: input.summary.totalKana,
          unit: "items"
        },
        {
          id: "vocabulary-introduced",
          label: "Vocabulary introduced",
          current: input.summary.learnedVocabulary,
          total: input.summary.totalVocabulary,
          unit: "items"
        },
        {
          id: "course-units-mastered",
          label: "Course units mastered",
          current: masteredUnits,
          total: input.course.length,
          unit: "units"
        },
        ...(input.c1Portfolio
          ? [
              {
                id: "c1-autonomy-missions-completed",
                label: "C1 autonomy missions completed",
                current: input.c1Portfolio.autonomyMissionsCompleted,
                total: input.c1Portfolio.autonomyMissions.length,
                unit: "missions"
              },
              {
                id: "c1-reliable-artifacts",
                label: "C1 reliable production artifacts",
                current: input.c1Portfolio.reliability.reliableArtifacts,
                total: input.c1Portfolio.reliability.artifactEvidence.length,
                unit: "artifacts"
              },
              {
                id: "c1-active-days",
                label: "C1 active evidence days",
                current: input.c1Portfolio.activeDays,
                unit: "days"
              }
            ]
          : [])
      ]
    },
    proficiency: {
      framework: "THIEPN Japanese internal communicative milestones",
      claim: "internal",
      ...(milestone.currentBand
        ? { currentBand: milestone.currentBand }
        : {}),
      ...(milestone.frontierBand
        ? { frontierBand: milestone.frontierBand }
        : {}),
      maintenanceNeeded: false,
      dimensions: [
        ...milestone.dimensions,
        {
          id: "kana",
          label: "Kana",
          score: input.kana.overall,
          confidence: input.kana.confidence,
          evidenceCount: input.kana.evidenceCount
        },
        {
          id: "vocabulary",
          label: "Vocabulary",
          score: input.vocabulary.overall,
          confidence: input.vocabulary.confidence,
          evidenceCount: input.vocabulary.evidenceCount
        },
        {
          id: "grammar",
          label: "Grammar",
          score: input.grammar.overall,
          confidence: input.grammar.confidence,
          evidenceCount: input.grammar.evidenceCount
        },
        {
          id: "sentence",
          label: "Sentence use",
          score: input.sentence.overall,
          confidence: input.sentence.confidence,
          evidenceCount: input.sentence.evidenceCount
        },
        {
          id: "lexical-fluency",
          label: "Lexical fluency",
          score: input.lexicalFluency.overall,
          confidence: input.lexicalFluency.confidence,
          evidenceCount: input.lexicalFluency.evidenceCount
        }
      ]
    },
    nextAction,
    source: {
      ...(input.activity.stateRevision
        ? { stateRevision: input.activity.stateRevision }
        : {}),
      contentVersion: "0.10.0"
    }
  });
}

function milestoneProjection(milestones: JapaneseReadModelInputs["milestones"]) {
  const rows: readonly [string, MilestoneProgress][] = [
    ["A1", milestones.a1],
    ["B1", milestones.b1],
    ["B2", milestones.b2],
    ["C1 foundation", milestones.c1]
  ];

  let currentBand: string | undefined;
  for (const [band, progress] of rows) {
    if (progress.complete) currentBand = band;
  }

  const frontier =
    rows.find(([, progress]) => !progress.complete) ??
    rows[rows.length - 1];

  const frontierBand = frontier?.[0];
  const frontierProgress = frontier?.[1];

  const dimensions = frontierProgress
    ? Object.values(frontierProgress.scores).map((score) => ({
        id: score.activity,
        label: activityLabel(score.activity),
        score: score.score,
        evidenceCount: score.answered,
        ...(frontierBand ? { band: frontierBand } : {})
      }))
    : [];

  return {
    ...(currentBand ? { currentBand } : {}),
    ...(frontierBand ? { frontierBand } : {}),
    dimensions
  };
}

function japaneseNextAction(summary: StudySummary) {
  const due = summary.due;
  const newItems = summary.newKana + summary.newVocabulary;
  const practice = summary.listening + summary.application;

  if (due > 0) {
    return {
      id: "today-due",
      label: "Continue Japanese",
      kind: "review" as const,
      priority: Math.min(100, 82 + Math.min(18, due)),
      reason:
        due +
        " due item" +
        (due === 1 ? " is" : "s are") +
        " already in the authoritative Today queue.",
      route: "/"
    };
  }

  if (summary.course > 0) {
    return {
      id: "today-course",
      label: "Continue Japanese",
      kind: "course" as const,
      priority: 72,
      reason: "The authoritative Today queue has course work ready.",
      route: "/"
    };
  }

  if (newItems > 0) {
    return {
      id: "today-new",
      label: "Continue Japanese",
      kind: "learn" as const,
      priority: 64,
      reason:
        newItems +
        " new foundation item" +
        (newItems === 1 ? " is" : "s are") +
        " available in the Today queue.",
      route: "/"
    };
  }

  if (practice > 0) {
    return {
      id: "today-practice",
      label: "Continue Japanese",
      kind: "practice" as const,
      priority: 56,
      reason: "Listening or application practice is ready.",
      route: "/"
    };
  }

  return {
    id: "today-clear",
    label: "Review Japanese",
    kind: "maintain" as const,
    priority: 20,
    reason: "The current Today queue is caught up.",
    route: "/"
  };
}

function summarizeActivity(
  events: readonly { readonly id: string; readonly occurredAt: string }[],
  now: Date
): JapaneseReadModelInputs["activity"] {
  const valid = events
    .map((event) => ({
      id: event.id,
      occurredAt: event.occurredAt,
      time: new Date(event.occurredAt).getTime()
    }))
    .filter((event) => Number.isFinite(event.time))
    .sort((a, b) => a.time - b.time);

  const today = utcDayKey(now);
  const sevenDayStart = startOfUtcDay(now).getTime() - 6 * 86_400_000;
  const todayEvents = valid.filter(
    (event) => utcDayKey(new Date(event.time)) === today
  ).length;
  const sevenDayEvents = valid.filter(
    (event) => event.time >= sevenDayStart && event.time <= now.getTime()
  ).length;

  const studyDays = new Set(
    valid.map((event) => utcDayKey(new Date(event.time)))
  );

  let cursor = startOfUtcDay(now);
  if (!studyDays.has(utcDayKey(cursor))) {
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  let streakDays = 0;
  while (studyDays.has(utcDayKey(cursor))) {
    streakDays++;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }

  const last = valid.at(-1);
  return {
    todayEvents,
    sevenDayEvents,
    streakDays,
    lastStudiedAt: last?.occurredAt ?? null,
    ...(last
      ? { stateRevision: last.occurredAt + ":" + last.id }
      : {})
  };
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

function utcDayKey(date: Date): string {
  return startOfUtcDay(date).toISOString().slice(0, 10);
}

function activityLabel(activity: string): string {
  return (
    {
      reading: "Reading",
      listening: "Listening",
      spoken_interaction: "Spoken interaction",
      spoken_production: "Spoken production",
      writing: "Writing"
    } as Readonly<Record<string, string>>
  )[activity] ?? activity.replaceAll("_", " ");
}
