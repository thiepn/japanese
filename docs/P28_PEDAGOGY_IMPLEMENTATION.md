# P28 — Integrated Sentence Building & Adaptive Conversation

Branch: feature/p28-integrated-sentence-adaptive-conversation
Stack parent: feature/p27-unified-learning-journey at 408622fa3a08785b608d0b6f81f76a027b0f2dc8

## Implemented learner functionality
- Five steps in the **existing** single learning journey: Verstehen → Satzbau → Antworten → Schreiben → Festigen. No new giant practice panel.
- Tile-based interactive sentence construction in all 18 A1/A2 journey units. Reuses the 16 P24 original sentence puzzles and their existing FSRS identities; supplies 20 additional original puzzles for 10 later units, total **36**. Touch/keyboard-friendly click ordering, tile removal, reset, next task, deterministic shuffle and specific positional comparison.
- Each sentence task prioritizes FSRS-due evidence, most recent incorrect response, then unseen; the same local account-owned StudyEvents and memory traces are used. Unaided answers receive canonical StudyPlayer grading and FSRS review, including an incorrect review for a truly different target sequence; hint-using attempts are only logged as ungraded local practice events.
- Eight entirely original branching continuity stories, 32 authored turn nodes and two supported response modes per node (64 unique StudyPrompt identities). They connect previously separate learning situations; a choice changes the next utterance, and completing a path links to the corresponding next course unit.
- Independent typed authored-target responses use the canonical StudyPlayer grading/FSRS path; unrecognized free responses do not receive an automatic incorrect grade. Choice exercises provide limited situation-matching evidence, distinct from production.
- Connected cross-scenario transfer and register exercises from P27 remain in the existing focused StudyPlayer sessions. Additional P28 sentence and continuity prompts are registered in the existing Today **due** catalog (not forced as new prompts) and shared adaptive review selection.
- P27 unified journey still owns the learner UI. All P23–P26 original lessons and their review identities are preserved.
- No imported Marugoto text, lesson plans, illustrations, publisher questions or audio. Original pedagogical material only.

## Feedback and privacy limits
- These are authored response templates and deterministic surface checks, not native language understanding or automatic semantic/fluency grading. Japanese can have alternative valid orders not matched by an authored puzzle.
- Free-writing revisions and assisted attempts save only metadata (no draft text/audio), are scheduler-excluded and never grant FSRS proficiency. Browser ASR remains optional/external-provider dependent.
- No new user progress store, scheduler, database migration, external AI calls or user records.
- Implementation only; builds, browser tests, full test suites and CI remain NOT_TESTED. No main updates, PR, merge or deployment.

## Next P29
Strengthen the unified journey rather than add screens: resolve genuine authoring/source defects identified from focused review, add multi-role pragmatic response variations, and improve sentence construction/remediation density and adaptive cross-unit sequencing while keeping StudyEvents/FSRS canonical.


## Implementation refinements
- The café quantity-confirmation branch connects two coffees to the corresponding two-coffee follow-up, while a one-coffee correction leads to its own confirmation.
- Adaptive unit ordering prioritizes entirely unvisited units once currently due and incorrectly answered material is exhausted, instead of repeatedly targeting optional unvisited repair branches within the first partially practiced lesson.
