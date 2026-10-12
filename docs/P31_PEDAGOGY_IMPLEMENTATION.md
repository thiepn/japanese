# P31 — Contextual Fluency & Learning Journey Refinement

**Stacked base:** feature/p30-learning-quality-adaptive-progression at `32c1a9e78e5834854e5cda2045dbbab851c16189`  
**Isolated branch:** `feature/p31-contextual-fluency-journey-refinement`

## Actual learner-facing changes

1. **Seven independently authored cross-situation branching conversations:** 28 additional interconnected A1–A2 dialogue nodes with partner prompts, two fitting alternatives, mismatched distractors, and contextual follow-up. Retains all P28/P29 continuity stories and their unique StudyPlayer target/cue identities.
2. **Conversation choice inside the existing flow:** the legacy lookup selected only the first follow-up for a source unit, hiding other P29 paths. New `continuityScenariosForUnit` enumerates every relevant follow-up and adds an accessible scenario picker to the existing P28 continuity component. Source-owned scenarios remain on the same Learn page.
3. **Eighteen independently authored form/meaning/register comparisons:** one per unit, with situation, distinct target and alternative, pedagogy-specific explanation, plus focused StudyPlayer practice and Today-due registration. Covers に/で, を/に, past-tense forms, invitation versus past narration, permission versus desire, これ/この, service politeness and informal talk. The lesson overview exposes comparison and explanations; the StudyPlayer prompt evaluates the specified, finite context only.
4. **Eighteen independently authored tile-sentence variations:** one per unit, each with a baseline and explicitly approved alternative order. All use normal StudyPrompt identities and the pre-existing integrated P28/P29 tile builder; no second sentence engine. This raises the integrated authored sentence selection from 54 to **72** tasks.
5. **Evidence-based delayed return guidance:** `planP31Recall` reads *only* canonical FSRS due dates and graded StudyEvents. Learners see due-now cards, future-due count, earliest future scheduled local time, and recently graded review counts. This does not create an extra reminder, schedule, memory rating or progress store, and does not treat unseen cards as overdue.
6. **Review truth fix:** the StudyPlayer-focused `review` mode no longer silently falls back to new or maintenance prompts when there are no due/last-incorrect records. Dedicated first-exposure and production modes remain accessible elsewhere. Due-now CTA is disabled when no cards are due.
7. **Responsive and accessible journey navigation:** direct previous/next unit controls, position in the 18-unit sequence, numbered stage position, previous/next stage controls, mobile arrangements and accessible labels. No additional standalone pedagogy panel.
8. **Exposure safeguards:** independent typed/conversation response events are not recorded as fresh mastery if answer choices or reference text were already revealed for that turn during the active unit. An ephemeral per-unit reference also prevents immediate replay from granting further unaided FSRS evidence after revealing a model. No new persistent exposure-tracking database is introduced.

## Privacy, ownership and limitations

- Reuses P23–P30 source-owned original teaching content, Learn, Today, canonical StudyEvents, StudyPlayer and FSRS MemoryTraces. No duplicate scheduler or master progress system.
- Marugoto PDFs informed general teaching design only. No excerpts, cloned lessons, figures, publisher audio, or other copyrighted contents were copied.
- Free Japanese expressions outside authored accepted forms are not automatically marked incorrect. Surface-heuristic hints and finite dialogue models do not establish complete grammar, semantic, pragmatic or pronunciation correctness.
- The new selected order alternatives are explicitly authored; they do not prove that other Japanese orders are invalid.
- The due-time display is a snapshot taken when local progress is loaded or refreshed. It is not a notification or future automation and makes no promises about delivery.
- No new learner data, production migration, credentials, auth changes or privacy override.

## Qualification boundary

**Implementation/source changes committed.** Typecheck, compile/build, full test suites, browser/device acceptance and CI are **NOT_TESTED / NOT_RUN** at the user's explicit implementation-first instruction. No PR, merge, deployment, database migration or production data actions. Source compilation or runtime operation must not be claimed as verified.

## P32 — proposed implementation follow-up

Deeper authored role and repair patterns within the same journey, more contextual explanations of scope-sensitive grammar, and improved independent production and recall transition UX. Preserve the established native progress authority, FSRS due schedule and original content-rights constraints. Source implementation first; avoid creating redundant screens or qualification-only phases.
