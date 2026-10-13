# P41 — Extended Japanese Conversations (CONTENT FIRST)

**Exact source parent:** `feature/p40-multiturn-situational-repair-retention` at `009435718cc7b6727e88f701f57ac75261c96a4d`
**Separate P40-child branch:** `feature/p41-extended-japanese-conversations`

## Implemented learner content

- **20 entirely original everyday A1–A2 conversation scenarios** with coherent Japanese partner utterances, German learner objectives, in-context model responses, distinct acceptable alternatives, one realistic misleading utterance per turn, and an authored explanation of why that utterance misses the stated intention.
- **95 original conversation turns:** fifteen five-turn scenarios and five four-turn scenarios, with an explicit mid-conversation pivot where the original intent is modified. Conversations keep earlier commitments such as day, amount, colour, place, direction, timing, or original order intact where appropriate.
- **20 original independent new-context transfer prompts:** each tests an unseen change of setting, object, time, quantity, or plan. **115 new StudyPlayer cues** in total (95 conversation turns + 20 transfer cues).
- **Scenarios:** late train/bus alternative; book reservation; sold-out cake; appointment time change; wrongly identified umbrella; rain relocation; early-closing museum; sold-out bag/colour choice; busy study room; misunderstood tandem name; ingredient exclusions; closed street detour; study-group venue change; booking-date error; gift-size substitution; earlier class start; wrong-side bus stop; quantity misunderstanding; lunch time conflict; and postcard address correction.
- Each source case is attached to two established course-unit identifiers; P23–P40 IDs and original teaching data have not been rewritten. `dialogue41-corpus-a.ts` through `dialogue41-corpus-d.ts` hold original content; `dialogue41-authoring.ts` adapts to the existing P40 conversation contract; `dialogue41.ts` maps it into canonical source-owned StudyPrompts.

## Learner-facing workflows

- Existing **Learn → Verstehen** now offers a longer P41 scenario from the same unit, prioritizing recent source-grounded independently graded mistakes if present.
- Existing **Learn → Antworten** renders either older three-turn P40 dialogues or new four/five-turn P41 dialogues with the same UI. It displays the current speaker line, current purpose, the main turning point, previous selected dialogue examples and a final continuity reflection.
- The guided teaching example is **ungraded and ephemeral**. Its selected author examples are held only in React state; no learner text, progress, or fake FSRS card is stored.
- Existing **Learn → Schreiben** lets the learner correct the pivot turn, or select a different P41 turn, within the original draft → revision → bounded comparison fields. Model/alternative text is deferred until the existing rewrite step. Unknown Japanese free responses remain **unclassified**, never automatically treated as wrong by matching against a limited answer key.
- An optional writing log reuses the original skipped, scheduler-excluded, owner-scoped StudyEvent and adds the source-owned P41 arc/turn IDs. No raw Japanese text or audio is added to the event payload.
- Existing **StudyPlayer** opens an exact ordered four/five-turn P41 session from `dialogue:<arcId>`. Prompts ask for contextually coherent independent Japanese choices and typed responses. The mid-dialogue correction shows the specific misleading utterance, not the correct answer.
- Existing **Today, Learn, FSRS, StudyEvents** recognize new stable P41 cues through the inherited `allPrompts()`, `p35JourneyExtras`, `promptsForUnit`, `journeySession`, and native graded StudyPlayer.
- Existing **Festigen** shows a separate return-to-context cue per P41 arc. Voluntary `return:<arcId>` can be started without misleadingly asserting due status; `return-due:<arcId>` routes only genuine FSRS-due original `MemoryTrace.card.due` items, else the inherited specialized-session guard rejects an empty queue. First exposure does not invent a future interval; scheduling is exclusively native after an independently recorded graded response.
- Existing last-mistake learner coaching recognizes P41 metadata and links to the original conversation, correction or review stage without leaking model answers.
- Minimal responsive CSS extends the original UI with keyboard-operable, visibly selected controls, scenario history, pivot markers and mobile-friendly writing selections. No new navigation app, persistence layer, dashboard, scheduler, authentication, or assessment service was added.

## Pedagogical integrity and limitations

- All Japanese examples and German teaching explanations are first-party originals. User-provided Marugoto and grammar/kanji source books remain **reference-only** and no publisher prose, exercises, audio, images, dialogue or layout assets are included.
- Fixed fictional interlocutor turns teach connected communication but are **not** live free-form semantic conversation. The interface does not pretend to understand arbitrary Japanese sentences or perform true pronunciation/accent grading.
- The teaching comparison does not mint StudyEvents or FSRS memory. A genuine independent StudyPlayer attempt uses native scoring and history; prior exposure to an example should be distinguished from a truly unseen response.
- Only source-level changes are committed. Compilation, Japanese linguistic review, runtime, browser, mobile, and end-to-end operation are **NOT_TESTED** under the user's explicit implementation-only restriction.

## Execution boundary

**No tests, TypeScript check, builds, CI, browser QA, PR, merge, deployment, database migration, credentials or production access were performed.** Commit SHA and branch are confirmed by GitHub write responses, not product qualification.

## P42 continuation

**Situational Variation & Speaker Transfer.** Create original role/speaker/background variations from the P41 conversation corpus with changed conversational conditions and unseen outcomes, keeping stable-ID independent assessment and native owner-controlled FSRS boundaries. Prioritize learner content over infrastructure.
