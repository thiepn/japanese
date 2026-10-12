# P30 — Learning Quality & Adaptive Progression

**Stack:** feature/p29-adaptive-learning-depth-conversation-refinement at exact commit bb60413372f6fe88cb11ea276361184babe822a7
**Branch:** feature/p30-learning-quality-adaptive-progression

## Learner-visible source changes

1. **Contextual transformation exercises.** Original, hand-authored, context-scoped Japanese sentence transformation for all 18 A1/A2 units (e.g. で vs に, wishing vs asking permission, polite requests vs casual speech, retrospective ました). Each includes an initial sentence, communicative task, authored acceptable response(s), and specific why-it-matters feedback. Integrated into the *existing* sentence builder and StudyPlayer/Today registry. Only unaided authored-target matches produce FSRS evidence.
2. **Safe feedback and replay.** The existing tile builder now remembers that a particular answer has been shown *within the current unit session*; an immediate retry of the same question is ungraded, even after reset or switching questions. Free Japanese rearrangements not among author-qualified alternatives stay ungraded rather than being declared incorrect. The first divergent tile position and grammatical/communicative explanation are shown as an advisory comparison.
3. **Focused evidence-based study.** Four actionable themes (sentence formation, grammar/register, dialogue responses, and contextual lexicon). Each counts FSRS-due cues, last graded incorrect attempts, and unattempted cues from the canonical **owner-scoped** StudyEvents and MemoryTraces. Signals are not percentages or CEFR/mastery claims. Learners can open dedicated grammar/production StudyPlayer sessions, integrated sentence builder, or existing cross-topic transfer without a duplicate practice engine.
4. **Deeper conversation choice after free composition.** Main A1–A2 journey and extended continuity player let learners direct an unrecognized free reply toward one of the partner's authored appropriate conversational intents, without pretending the free answer was assessed or granting mastery. Later interaction follows that branch. Revisions preserve original drafts locally in component state for comparison; only minimal ungraded metadata is persisted.
5. **Assisted-choice grading correction.** A subsequent answer choice after a model/example has been revealed does not create a fresh FSRS retrieval record, even if an answer matches. Independent first choices remain limited *selection/comprehension* evidence, not proof of free speaking.
6. **Vocabulary prompt answer leakage fix.** Existing active-recall cross-unit vocabulary now asks for Japanese from a German context without embedding the full Japanese sentence or answer in the question. Original response identities are kept; Japanese context appears as an explanation after attempting an answer.

All work reuses the single five-step Learn journey, P23–P29 original content, StudyPlayer, FSRS, Today, canonical StudyEvents and local owner data model. No auth, DB schema, migrations, source licensing or native learner record authority is changed. The Marugoto PDFs served as teaching references only; no copied textbook material is embedded.

## Limits / next decisions

- Rule-based Japanese feedback cannot establish grammatical or semantic correctness, pragmatic appropriateness for all speakers, or pronunciation quality. Author-qualified alternatives remain finite.
- Immediate same-session answer replay is guarded, but long-term exposure history is not stored as a new learner state: the scheduler itself remains the source of truth. No parallel progress store was added.
- Learned, new, due and retry counts describe evidence/queues, not general Japanese ability.
- Native browser audio and speech recognition remain browser-/provider-dependent; P30 does not introduce a new speech scorer.

## Status and preservation

All changes are source commits on the separate stacked P30 branch. Build, TypeScript typecheck, full tests, Chromium acceptance, GitHub Actions and CI are **NOT_TESTED/NOT_RUN by instruction**. No PR, merge, deployment, production data, secrets, migration, credential or user account manipulation.

## P31 — suggested product development

Consolidate the journey's interaction quality: richer original branching intent and turn taking; principled authored alternate Japanese sentences with pedagogically meaningful particle/function contrasts; active recall after meaningful delays instead of repeated templates; tighter mobile/accessibility lesson transitions; and remediation that stays source-owned, evidence-based and FSRS-compatible. Source implementation first; keep the previous drafts and main untouched.
