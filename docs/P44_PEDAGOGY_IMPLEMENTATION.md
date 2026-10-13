# P44 — Natural Pragmatics & Social Intent

**Source parent:** `feature/p43-conversational-decisions-consequences` at **`897dde9dd9b585a57d1b1ddf542caa72b9762c20`**.
**Stacked P43-child branch:** `feature/p44-natural-pragmatics-social-intent`.
**Mode:** original learner-content/source implementation ONLY.

## Original content

**50 genuinely authored, A1–A2 social-language teaching cases** in five separate first-party source files. The cases cover:
- **10 social distance, politeness and requests**: permission, asking teachers, borrowed notes, neighbours, restaurant service, assistance, travellers and lending
- **10 invitations and refusals**: friend invitations, workplace invitations, conditional commitments, weather changes, gentle refusals, declining food and offering alternative dates
- **10 apologies and conversational repairs**: wrong drinks, physical collisions, damaging borrowed property, missed appointments, arriving late, name/date/quantity corrections, requests for repetition and resolving partial understanding
- **10 hesitation and disagreement**: deliberation before buying, uncertain attendance, ordering delays, eliciting another opinion, noncommittal invitations, contesting plans, preferences and concrete facts without personal attack
- **10 empathy and socially appropriate responses**: a sick friend/colleague, disappointment, thanking helpers, congratulations in informal and formal registers, accepting an offer's refusal, offering assistance and clarifying instructions

Every case has its own Japanese partner utterance, distinct German communication objective, social relationship and register, context-specific original Japanese model and alternative, plausible misleading variant, misconception-specific why, cultural/pragmatic nuance, **new second-turn partner response**, second-turn reply task with two authored acceptable responses and targeted correction, and a **genuinely distinct new-context production question** with response keys and correction. These are not synonym-swapped flashcards.

**200 new stable-ID canonical StudyPlayer cues**: 50 context-sensitive recognition contrasts, 50 initial independent productions, 50 independent second-turn responses, 50 unseen context transfers. `p44-contrast-*`, `p44-production-*`, `p44-reply-*`, `p44-return-*`. Every cue is original with `sourceId:"thiepn-original"`, stable owner-scoped `primaryTarget`, existing unit IDs, cue family, context ID, focus, register, full unit-level provenance and context explanation.

## Implemented learner functionality

- `apps/web/src/study/pragmatics44-types.ts`, five `pragmatics44-corpus-*.ts` files and `pragmatics44.ts` contain the source-owned case catalog, unit filters, honest finite-answer comparison and StudyPlayer prompt mapping. No extra scheduler, store, account authority or generic semantic analysis service.
- In existing **Learn / Verstehen**, case suggestions are selected by matching real recently graded mistakes where present, else the relevant first case. A short introduction explains why partner identity and social context matter. Independent-practice links open the original StudyPlayer.
- In existing **Learn / Antworten**, `P44PragmaticsStudy.tsx` offers two-turn Japanese partner context and choice comparison, then the specifically authored follow-up, with misconception coaching and nuance, visibly selected answers, reset and owner-scoped StudyPlayer links. Incorrect authored answers must be revised before guided completion. Selected choices exist only in ephemeral React state, not in StudyEvents, FSRS, or owner progress. Unseen Japanese answers are not claimed semantically understood.
- In existing **Learn / Schreiben**, the learner selects a P44 case and either writes an original initial reply or the continuation. Both reuse existing typed draft → revision → revealed-example comparison. Bounded feedback distinguishes known model/alternate, an explicitly authored misconception and unknown free Japanese (not globally wrong). The optional original `skipped`, `schedulerExcluded:true` StudyEvent records source-owned case/step IDs and response length only; no learner raw Japanese or audio is sent to a new store.
- In existing **StudyPlayer / Today**, `allPrompts()`, `p35JourneyExtras`, `journeySession()` and the existing reviewed MemoryTrace/StudyEvent paths include P44. Exact unit-scoped specialist routes are `pragmatic:<id>` (contrast, production, second-turn reply), `pragmatic-step:<id>:contrast|production|reply|return`, and the pre-existing `return:<id>` versus `return-due:<id>`. Only the latter filters on genuine recorded FSRS card due dates; no previous graded mistake or guided preview generates an artificial due interval.
- In existing **Learn / Festigen**, P44 new-context return cues receive the same true `no trace / future / due` status and voluntary/due actions as P40–P43. `remediation36.ts` adds source-specific answer-free hints for choice contrast, production, second-turn response and later transfer, reusing existing navigation.
- Original `p27-journey.css` gains limited responsive styles, visible selection, keyboard focus and touch-sized actions. There is no second course navigator, progress counter, grading engine, FSRS schedule, data migration, or new API.

## Educational integrity and limitations

- All content is original Japanese written for the app with original German explanations. Uploaded Marugoto and Japanese source material is **reference-only**, not excerpted, copied, translated wholesale or represented as first-party publisher materials.
- Japanese politeness is context-dependent. A comparison labelled 'misleading' may be grammatically well formed and even appropriate in another relationship or circumstance. Finite answer keys cannot reject every otherwise meaningful learner sentence fairly; any response outside the authored examples remains **unknown** in the guided comparison.
- A guided activity is not independent retention evidence. Native StudyPlayer owns independent grading; genuine FSRS `card.due` and owner/device study events are the only authoritative scheduling and review state. Exposure to a revealed example should not be represented as unseen performance.
- P23–P43 source, earlier stable IDs, all existing learner histories, source permissions and local-first account authority were preserved.

## Explicit qualification and release exclusions

Tests: **NOT_RUN**. TypeScript checker: **NOT_RUN**. Build: **NOT_RUN**. CI: **NOT_RUN**. Browser/mobile QA: **NOT_TESTED**. Independent linguistic review: **NOT_TESTED**. PR / merge / deployment / migration / production / credentials: **NOT_PERFORMED**. Branch and commit are source evidence, not a verified executable release.

## P45 handoff

**Conversation Independence & Reduced Guidance.** Implement at least 30 substantial original A1–A2 increasingly unguided conversation challenges combining situations from P40–P44, meaningful contextual ambiguity, self-selected plausible replies, progressive scaffold removal, misconception coaching and independently graded delayed transfer through the original StudyPlayer, Today, Learn, StudyEvents and FSRS. No duplicative dialogue interpreter, learner score authority, or shadow scheduler.
