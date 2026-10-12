# P39 — Real-Life Communication & Adaptive Writing Practice

**Source parent:** `feature/p38-coherent-production-teaching-refinement` at exact commit `26ca9811c12969bb4fd63f6dbdcfc90f094e1288`
**Isolated branch:** `feature/p39-real-life-communication-adaptive-writing`

## Learner-facing changes

1. **20 newly authored real-life communication situations** in `apps/web/src/study/life39.ts`. Each case links two existing A1–A2 units and specifies a concrete German-language speaking intent, an appropriate Japanese answer, a legitimate alternative phrasing, two misleading responses and a separate explanation of the misconception for each distractor. Cases cover permission versus wishing/requesting, travel destinations and means, lost property, invitations, appointment changes, price questions, ownership, ongoing activities, time reference and service-register choices.
2. **40 new source-owned assessment cues**, split into independent three-choice context recognition and independent typed repair of a flawed sentence. Each has a distinct stable ID and cue family, with authored targets, explanations and explicit per-unit metadata. There is no new grading engine, completion counter or scheduler.
3. **Canonical app integration:** register these cues with the existing `allPrompts()` used by Today and with `buildP27JourneySession` for unit-specific new, retry, truly FSRS-due, grammar, transfer and production sessions. The original StudyPlayer and StudyEvents persist authoritative evidence.
4. **Contextual instruction during Verstehen:** the existing `P27LearningJourney` shows an original real-life communication choice, its situational intent and **distractor-specific** response explanation. This inline explanation is deliberately ungraded and never creates FSRS memory.
5. **Adaptive case selection:** when there is a recent independently graded P39 error among the already available owner-scoped unit mistakes, recommend that context before the first default example. The recommendation does not change scheduling, hide other cases or claim that a learner has mastered a topic.
6. **Practical writing integration:** choose a unit-appropriate problematic original sentence and rewrite it through the *existing* first-draft → revision → comparison fields. Switching task clears the ephemeral draft to prevent cross-task leakage. Shortcut and mobile behavior continue unchanged.
7. **Bounded coaching:** exact authored model and alternative wording are recognized; exact authored distractors receive the corresponding misconception-specific explanation. All other learner text is explicitly marked *not automatically assessed* rather than falsely declared incorrect. For the P39 task, obsolete unit-specific character and grammar guidance is not misapplied.
8. **Source-bound ungraded event metadata:** optional writing-revision events retain their original owner-scoped `p27` non-FSRS authority, do not persist raw learner Japanese, and now include the new authored P39 case ID and context link where relevant.
9. **Minimal accessible mobile presentation:** source-specific explanation and button groups reuse the established journey styling with 44 px tap targets, `aria-pressed` selection state and narrower mobile layouts.

## Source boundaries

- Preserves existing A1–A2 teaching, IDs, P23–P38, canonical StudyPlayer, StudyEvents, FSRS traces, Today, Learn, independent collections, accounts and local-first progress without new persistence or database changes.
- All new example situations, expressions, explanations, and distractors are original. Marugoto and the other provided textbooks are background teaching references only. No publisher passages, example sets, images or audio are copied.
- Grammar/meaning feedback applies only to the explicitly authored example in its specified context. It does not prove general Japanese naturalness, correctness of arbitrary writing, fluency or CEFR proficiency.
- No third-party audio, AI evaluation, telemetry, or account-linked free-writing corpus has been introduced.

## Execution

**Implementation only, source commits.** No unit suite, TypeScript, production build, browser test, mobile device acceptance, CI, QA audit, migration, PR, merge, stable release or deployment has been requested or run. Compilation and runtime behavior are **NOT_TESTED**.

## P40 proposed continuation

**Multi-Turn Situational Repair & Independent Retention**: add original two-/three-step real-life exchanges that require learners to maintain the same meaning and register across turns, richer in-context self-revision with evidence-safe correction prompts and practice shortcuts, then measured independent return through the existing Today/FSRS queues. Maintain the same source-only execution boundary until separately instructed otherwise.
