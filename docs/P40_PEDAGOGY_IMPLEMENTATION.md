# P40 — Multi-Turn Situational Repair & Independent Retention

**Source parent:** `feature/p39-real-life-communication-adaptive-writing` at exact `ba01cfebe06d550aec34b7dd443a71b88244acdf`
**New isolated stacked branch:** `feature/p40-multiturn-situational-repair-retention`
**Mode:** original learner-facing implementation, source commits only.

## Actual implementation

1. **12 original A1–A2 three-turn conversation arcs** in `apps/web/src/study/dialogue40.ts`, covering library borrowing, station-to-campus travel, café order clarification, appointment rescheduling, lost property, shopping, meeting a teacher, museum invitations, library directions, routines and the past tense, organizing a study group and changing plans due to rain. Every arc links existing P23–P26 unit IDs, contains a setting, three distinct Japanese partner turns and three distinct communicative responses, and demands continuity of topic, goal, register and timing.
2. **36 independent, stable-ID turn cues**: first turns require contextual form selection; second turns require typed correction of a specific misleading utterance; third turns require original typed responses consistent with the established dialogue. Each cue has explicit answer alternatives, a trap and a reason the trap fails in the stated context.
3. **12 further independent cross-context return cues** that use a changed object, time, or place so the learner must transfer a previously introduced conversational function. They are registered separately for legitimate FSRS scheduling after the *actual graded attempt*, not an invented phase-defined interval.
4. **Full canonical integration** via `study/runtime.ts`: all 48 new original cues enter `allPrompts()` (Today/due) and the existing `buildP27JourneySession` extra cue catalog (Learn, progress, last mistakes, source-linked review). No extra progress table or scheduler was created.
5. **Ordered study route** in `study/journey27.ts`: `dialogue:<arcId>` launches only that authorized arc's three ordered prompts in the original StudyPlayer. Requested unit ownership is checked against the authored arc. No generic fallback substitutes unrelated prompts.
6. **Precise owner-scoped return routes**: `return:<arcId>` permits clearly labeled voluntary early independent work; `return-due:<arcId>` returns only a legitimately due cue according to its existing FSRS memory trace and due timestamp. Unsatisfied or invalid routes produce an empty specialist session and the established runtime error, not a false completed lesson.
7. **Embedded interactive instruction in original Learn and conversation page**: users can open, switch, and step through authored three-turn exchanges; see the ongoing partner utterance and purpose; select an example and receive that distractor's particular explanation; and then launch genuine independent StudyPlayer work. Guided choices are always ungraded and do not mint FSRS evidence. The fixed source dialogues do not claim branching based on unverifiable free speech.
8. **Targeted writing revision** within the pre-existing draft → revise → compare fields: choose the selected conversation's second turn, see its problematic sentence and the ongoing conversation context, write an improved response, and inspect bounded feedback after drafting. Authoritative independent typed corrections remain separate StudyPlayer cues. The optional revision event remains `result:"skipped"`, `schedulerExcluded:true`, owner-scoped, raw-text-free and now carries the original P40 arc/turn identifiers.
9. **Contextual last-error coaching**: P40 conversation cues classify as dialogue rather than unrelated lexicon/grammar; answer-free mistake hints open the relevant existing conversation, writing or practice stage without showing the model before practice.
10. **Integrated delayed-return UI** on original Festigen: each related return cue truthfully distinguishes no FSRS schedule, planned later and genuinely due now, with separate disabled-until-due and explicitly voluntary practice actions. No fake timer, progress mastery, additional persistence or automatic recall events.
11. **Responsive accessibility** in the original CSS: keyboard-operable `button` controls, `aria-pressed` selected states, live feedback and minimum 44 px touch areas at narrow viewports.

## Important boundaries

- The 36 conversational prompts and 12 transfer prompts are separately graded via the original StudyPlayer; the *guided three-step activity is instructional*, and the follow-up interlocutor turns are authored and fixed. It does **not** make a linguistic claim about arbitrary learner responses.
- Finite authored model variants only are automatically recognized. Other valid Japanese expressions may exist; a finite answer key does not provide a universal semantic or fluency assessment.
- FSRS-authoritative due dates come only from existing `MemoryTrace.card.due`; a recent wrong answer is not silently treated as a due date. Voluntary early retrieval may legitimately change the existing FSRS schedule.
- Original first-party Japanese/German examples and feedback. Uploaded Marugoto volumes, kanji, grammar and romanization sources are pedagogical references only; no copyrighted publisher text, layout, illustrations, recordings, exercise sets or dialogue passages have been copied.
- Preserve P23–P39 source, stable cue IDs, old event/traces, account ownership, local-first stores and independent app boundaries. No new account, schema, migration, authentication path, data upload, AI semantic judge or raw free-response log.

## Execution status

Implemented and committed source only. As specifically requested: **no tests, TypeScript check, production builds, CI, browser/device QA, PR, merge, deploy, migration, production access or credential access**. Build/runtime correctness remains **NOT_TESTED**; these source commits alone are not a release assertion.

## P41 suggested learner-facing continuation

**Conversational Repair Depth & Authentic Context Variation.** Extend conversations to 3–5 steps with meaningful context shifts, add original listen-and-respond materials where rights permit, improve exact-mistake-to-next-conversation navigation and increase unseen transfer tasks using the original StudyPlayer, local-first events and FSRS. Maintain independent-versus-guided evidence distinctions.
