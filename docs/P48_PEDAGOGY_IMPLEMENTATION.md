# P48 — Connected Japanese Information

**Exact parent:** `feature/p47-progressive-listening-comprehension` at `991ab1d6fa86c24b3d644752b880489acb44bbf3`
**Isolated development branch:** `feature/p48-connected-japanese-information`
**Mode:** original source implementation only; no automated qualification, CI, deployment or production access.

## Pedagogical implementation

- Five independently authored content corpora (`connected48-corpus-a.ts` through `-e.ts`) supply **25 substantial original A1–A2 multi-source situations**: **10 A1 and 15 A2**, spanning study, transport, personal plans, library, retail, public announcements, guest services, and community participation.
- Every case contains **three separately authored Japanese source texts** with distinct speaker/document identity, delivery medium, chronological sequence, German contextual support and source-specific purpose. This yields **75 original Japanese source snippets**. Cases combine messages, reading excerpts, original spoken notices, schedules, emails, recorded-message-style scripts and public announcements; they are not copied publisher material or real institutional records.
- Each case has **three substantial original questions (75 total)**: determine currently applicable fact from conflicting/updated sources; make a grounded inference across sources; determine which source statement/evidence supports the conclusion. Questions have two original Japanese model responses, a scenario-specific misconception, explicit correction, and **one or more source-linked Japanese evidence excerpts** with explanatory roles. The evidence identifiers point back to the exact authored in-case source, not fictitious internet citations.
- **25 coherent original Japanese synthesis-writing missions**, separately written as responses to the case, and **25 genuinely changed-context independent return tasks** that require different times, locations, constraints or authority and provide no old documents.
- Reasoning targets include correcting earlier official schedules, proposal-versus-confirmation, absence of evidence versus certainty, different deadlines for different actions, weather outlook versus a confirmed cancellation, permission versus obligation, rules scoped by day or course, authority/role of each speaker, and valid complementary statements that are not actually contradictory.

## Content and source ownership

`connected48-types.ts` defines `P48Case`, `P48Source`, `P48Question`, evidence source IDs, source scope, and independent written and transfer tasks. The content adapter creates stable first-party source IDs, question IDs and links every Japanese quotation-sized piece of evidence to its own original source document.

`connected48.ts` converts these author-written materials into **125 independent canonical `StudyPrompt` cues**: 75 independent source-grounded comprehension questions, 25 synthesis-writing tasks and 25 new-context FSRS transfer prompts. Stable IDs: `p48-question-<caseId>-q1/q2/q3`, `p48-write-<caseId>`, `p48-return-<caseId>`. Every prompt inherits the original course unit IDs and has source-owned provenance `sourceId:"thiepn-original"`, `contentVersion:"p48-1"`, `primaryTarget`, `cueFamily`, `contextId` and source-specific metadata; no old P23–P47 source or prompt is changed.

The uploaded Marugoto A1/A2, grammar and kanji books remain **reference only**. None of their original textual examples, publisher dialogues, exercises, audio, artwork or page layouts were reproduced.

## Real learner-facing integration

- `P48ConnectedSources.tsx` is mounted in existing **Learn / Verstehen**. This work surface offers all 25 multi-source scenarios, original source chronology, A1/A2 difficulty filters, source search, Japanese source documents, optional German help, optional **device TTS** of originally authored spoken source snippets, optional transcript reveal and a per-case source-comparison explanation.
- Per case, learners answer all three different question types in independently typed Japanese, can select which of the three sources they consider relevant, and receive bounded post-attempt feedback. **Only exact original model/alternative and one authored misconception** are recognized; unrecognized Japanese is labeled **unassessed**, not semantically rejected. Grounded original evidence and both model answers are shown only after the learner submits and separately reveals the solution. Guided source selection, attempts, source reveals and listening are all ephemeral React state without a separate persistence store.
- The existing **Learn / Schreiben** draft → revise → compare stage accepts each P48 case as an original source-grounded writing task. User text is not written to any new store; only existing optional excluded, skipped `StudyEvent` metadata records source ID and safe length-based evidence if the existing mechanism is used. Guided work never mints an FSRS success.
- `runtime.ts` appends all 125 source-authored cues to the established Today catalog and P27 extra prompts. The original `journeySession` in `journey27.ts` supports unit-gated `connected:<caseId>` and `connected-kind:<caseId>:comprehension|writing|return`, routing native StudyPlayer attempts to their existing `StudyEvents` writer and real FSRS scheduler. The specialist session never fabricates course-unit association.
- P48 delayed **`return:<caseId>`** is a voluntary independently answerable different-context prompt. Existing **`return-due:<caseId>`**, Today and Learn / Festigen rely strictly on the actual existing `MemoryTrace.card.due`; no artificial calendar, separate grades, flashcard store or shadow progress.
- `remediation36.ts` teaches misconceptions around source chronology, scope, independently supported inference, truth/uncertainty, correct evidence attribution and independent transfer without displaying answers.
- `p27-journey.css` provides accessible keyboard-friendly 3-column source cards that collapse to one column at narrower breakpoints, fixed-width-overflow protection, readable original Japanese typography, and mobile-friendly evidence and answer controls.

## Limitations and requested exclusions

- This implementation is **source-only**. **No TypeScript compilation, tests, CI, browser QA, mobile QA, builds, academic/linguistic verification, audits, PR, merge, deployment, migration, credentials or production access** were performed. GitHub ancestry and commit confirmation are source-level, not runtime qualification.
- Source texts and Japanese answers are authored original educational material but have **not received independent native-speaker verification**. Finite string-matched StudyPlayer answer patterns cannot grade all naturally valid Japanese. Any unrecognized guided text is explicitly unassessed.
- Device/browser SpeechSynthesis is optional **synthetic speech**, not human voice, hosted audio or an accredited listening examination. The original native StudyPlayer displays the complete source texts and is therefore a **text-supported source-comprehension task**, not proof of unaided listening.
- No universal latest-source rule is asserted: in specific cases old and new statements describe different groups, activities, dimensions or conditions, and only relevant updated facts supersede their predecessors.
- All P23–P47 branches, IDs, legacy learner events, local-first owner authority and production/main history are intentionally preserved.

## P49 content-first handoff

**Everyday Japanese Document Literacy:** author 40 substantial original A1–A2 practical documents (notices, timetables, menus, forms, ads, messages, tickets, instructions), each with genre-specific interpretation, Japanese vocabulary, condition extraction, original Japanese responses and independent new-context recall; reuse the original P23–P48 engines and native rights/evidence boundaries, without infrastructure or qualification-only work.
