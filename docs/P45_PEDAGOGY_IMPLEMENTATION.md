# P45 — Conversation Independence & Reduced Guidance

**Parent branch:** `feature/p44-natural-pragmatics-social-intent`
**Exact parent commit:** `d456840f1b4d0560579102bc550cb083bb8f8247`
**Isolated stacked P44-child:** `feature/p45-conversation-independence-reduced-guidance`

## Original learner material

- **30 genuinely authored original four-turn A1–A2 conversation challenges**: 120 original Japanese partner utterances with communicative purposes, German explanations, original example answers and meaningful alternatives, plausible contextual misconceptions, explanations of exactly why the misconception misses its goal, and conversation-continuity guidance.
- **30 independent new-context transfer exercises**, one per conversation, changing the object, destination, time, quantity, identity, or social context. These are separate authored questions, not verbatim copies of the preceding dialogue.
- **150 stable-ID native `StudyPrompt` cues**: 120 independent typed conversation turns + 30 transfer prompts. Every cue has first-party provenance `sourceId:"thiepn-original"`, version `p45-1`, source-owned target, independently addressable cue family, two explicitly authored acceptable strings, a specific misconception explanation and canonical unit IDs.
- Five authored 6-case corpora: original campus directions, library deadlines, product orders, rain-driven meeting plans, property identification, classroom change, purchasing within a budget, payments and ingredients, group-project adjustments, pharmacy directions, appointment clashes, volunteering, tickets, language exchange, hotel bookings, sports/quiet study policies, dinner guest accommodation, museum alternative formats, callback arrangements, delayed friends, cashier corrections, presentation time limits, bus fare problems, updated meeting links, gift choices, and post-office ID requirements.
- Each case has a coherent four-part dialogue involving at least one material update. Learners must preserve earlier unaffected commitments while adapting the relevant fact and arriving at a grounded, useful outcome.
- Existing P40–P44 source IDs remain untouched. Each new case retains a pedagogical `parentCase` referent, rather than rewriting or overwriting earlier practice keys.

## Learning functionality

**Existing Learn / Verstehen**
- Introduces the independent four-turn scenario, objective, and optional entry into a guided or standalone independent task.
- Prioritizes an actual earlier independently recorded mistake from the same source case when a mistake exists; otherwise starts with a relevant case in the current original unit.

**Existing Learn / Antworten**
- `P45IndependentConversation.tsx` adds a four-step Japanese conversation with *typed free production, not multiple-choice prompts*.
- Three support modes: **abnehmende Hilfen** (full communication objective initially, then fewer, none by the third and fourth turns), **wenig Hilfe** (partial cues only early), and **ohne Hilfe** (no turn-level hints).
- The latest partner utterance is always shown, and the learner's own previous Japanese responses are retained only in ephemeral React state to support local conversational continuity. It deliberately does not substitute authored model answers into the historical transcript.
- Feedback recognizes only exact normalized author-written model/alternative responses and one specifically authored misleading response per turn. Unrecognized Japanese is labelled `unassessed`, not false or incorrect. The learner can revise, reveal model responses **after** submitting a draft, carry on, restart, or open the original native StudyPlayer. This is not a semantic Japanese-language evaluator and is never an independently graded FSRS event.

**Existing Learn / Schreiben**
- P45 case and individual turn can be chosen in the pre-existing writing stage. The original draft → revise → compare flow is reused, with the authored model hidden until the revision stage and bounded comparisons only after writing.
- The existing optional `skipped` / `schedulerExcluded:true` owner- and device-scoped StudyEvent is unchanged except source-owned P45 case and turn IDs and `scaffoldedWriting:true` metadata. No raw learner Japanese or audio enters new storage, and this activity cannot mint a FSRS success.

**Existing StudyPlayer / Today / Festigen**
- `allPrompts()` and `p35JourneyExtras` include 150 source-owned P45 cards. The exact unit-gated specialist route `independent:<challengeId>` opens all four turn prompts in order through the inherited `journeySession`; answer selection and recording use original `StudyPlayer`, native owner/device `StudyEvents`, and real `MemoryTrace` scheduling. The P45 StudyPlayer prompt is progressively shorter, with no multiple-choice answers, and authentic partner dialogue context is retained.
- The separate `return:<challengeId>` route is voluntary independent production; `return-due:<challengeId>` works only if the actual existing FSRS memory trace has a due date at or before the current time. No guessed due dates or synthetic retention scores. `Today` may surface genuinely due P45 cues through the original queue, not through a shadow planner.
- The established review list displays actual `no trace`, `scheduled`, or `due` status and offers clearly differentiated voluntary versus due practice. `remediation36.ts` provides original source-specific answer-free hints about changed plans and independently coherent endings.

## Boundaries

- **No tests, TypeScript, builds, CI, browser/mobile QA, release audit, PR, merge, deployment, migration, credential access, or production changes.** All runtime and linguistic results are `NOT_TESTED`; GitHub source commit is not a certified release.
- All instructional Japanese and German content is original, first-party authored material. The user's uploaded Marugoto, kanji and grammar books were **not copied**, and remain reference-only. No protected publisher exercises, dialogues, art, recordings or textual excerpts are introduced.
- Reuse existing source registration, unit IDs, learner progress, permissions, local-first authoritative writing, StudyPlayer, Today, StudyEvents and FSRS without a second grade/status engine. Prior P23–P44 source and stable IDs remain unchanged.
- Guided practice is different from genuinely unseen assessment. Familiarity with an author model, including the occasional optional revealed model, is not treated as an independently acquired skill.
- Exact limited answer sets are not complete coverage of all acceptable natural Japanese; unknown user formulations remain unclassified rather than falsely reported as incorrect.

## P46 next

**Progressive Japanese Reading Library** — at least 30 genuinely original A1–A2 texts across distinct genres and difficulty, including cultural/context notes, meaningful reading and inference questions, author-grounded vocabulary and independent reading comprehension/production in native StudyPlayer and FSRS. Reuse source rights, existing unit and progress architecture; avoid new infrastructure or qualification-only phases.
