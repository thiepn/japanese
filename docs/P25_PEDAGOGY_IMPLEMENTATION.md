# P25 — Contextual Fluency & Guided Revision (source implementation)

Stacked on P24 commit: 8d81bee78a51216bf52fa5dcee0fb39579cb547b.
Branch: feature/p25-contextual-fluency-guided-revision.

## Substantial source changes
- Six entirely original A1/A2 situational lessons: directions, transport, library borrowing, shopping and comparison, appointment coordination, and lost-property inquiries.
- 24 contextual vocabulary entries with Japanese script, kana readings, German meanings and sentence contexts.
- 36 structured exercises: recognition, contrastive grammar, vocabulary/form transfer and active typed recall.
- 18 conversation turns, each with two context-appropriate authored responses plus an unsuitable distractor, explicit explanation/retry and a 12-turn safety cap.
- Six original paired writing and speaking tasks; draft, reflection, revision and before/after change observations.
- Account-scoped practice-only StudyEvents for free responses; no raw text/audio in persisted metadata and no automatic mastery or phonetic assessment.
- Browser speech recognition is explicitly optional, and may be backed by an external browser provider. No claim of local recognition.
- Recommendation logic derived from existing FSRS traces and immutable StudyEvents. Date-scoped due prompts, most recent incorrect attempts, then unseen content. No additional state store or scheduler.
- P25 prompts are registered with the regular Today due queue after initial study. Practice sessions use the existing StudyPlayer and recordStudyAnswer. Scenario teaching cards are registered as first-exposure lessons.

## Pedagogical boundaries
- Source inspiration only from general communicative/contrastive teaching techniques. No Marugoto exercise, page, image or audio was imported.
- The 36 closed prompts and 18 dialogue-choice targets grade deterministic forms; they are not authoritative proficiency scores.
- Free writing and speaking compare literal characters and selected strings; this does not establish semantic, stylistic or pronunciation correctness.
- Explicit, optional practice targets distinguish FSRS due from recent error and unseen status.
- No new authentication, database, syncing, remote API, billing, migration, main-branch or deployment changes.

## P26 suggested implementation
Expand cross-scenario spontaneous responses with longer multi-turn original conversations, targeted grammar feedback across clauses, and comprehensive learner-authored revisions; keep all graded evidence anchored to the existing learner model. Add pragmatic variation (politeness/register, nuance) and context transfer to unfamiliar examples, without expanding gate paperwork.
