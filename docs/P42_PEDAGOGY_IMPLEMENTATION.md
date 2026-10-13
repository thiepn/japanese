# P42 — Situational Variation & Speaker Transfer

**Exact P41 parent:** `feature/p41-extended-japanese-conversations` at `b99396494468bc548aed7dcd07f2bc550f82549a`
**Isolated P41-child branch:** `feature/p42-situational-variation-speaker-transfer`
**Execution:** source implementation only.

## Original learner content

- **30 substantial, original four-turn A1/A2 Japanese dialogue variants** (120 authored Japanese-speaking turns), each with an authored partner line, German communicative instruction, intended Japanese expression, distinct accepted alternate wording, plausible misconception, and explanation particular to that misconception.
- **30 additional new-context independent production prompts** (total **150** stable-ID StudyPlayer cues), changing the interlocutor, time, place, choice, amount, deadline, or register rather than reusing the same answer.
- **10 public-service variations:** last bus and transfer; library borrowing deadline; iced/hot café mistake; professor appointment; identifying a lost scarf; postponed museum tour; clothing size instead of price; room-use duration; postal arrival deadline; and station-exit detour.
- **10 social/academic variations:** friend's study meeting; professor's assignment deadline; misheard nickname; rain-driven private movie visit; birthday gift preference; borrowed notebook return; friend's delayed train; dinner ingredient preference; borrowed textbook return; and sold-out cinema showing.
- **10 role-reversals/mixed contexts:** giving directions instead of asking; acting as café service staff; library-staff room advice; informing a classmate of a changed start time; correcting a telephone booking; older neighbour's keys; choosing a gift with a parent; helping a stranger in a grocery store; professional meeting via messages; and welcoming a new exchange student.
- Each variant explicitly identifies a **P41 base arc** via `baseArcId`, existing source-owned unit IDs, speaker relationship, chosen level of politeness, changed premise, and intended outcome. Scenarios contain a real information pivot at turn 2 or 3; correct responses maintain unaffected commitments.

## Architecture and learner workflows

- Original authored content lives in `dialogue42-corpus-a.ts`, `-b.ts`, `-c.ts` using one typed, data-only adapter `dialogue42-authoring.ts`. There is **no new engine, separate grading authority, learner store, or scheduler**.
- `dialogue42.ts` supplies stable source-owned cue IDs, authored exact-answer alternatives, misconception-specific explanations and source context in standard `StudyPrompt` objects. First turns use choice recognition; later turns require independent typed Japanese. Pivots explicitly demand correction of the altered situation.
- Both `allPrompts()` (Today) and the existing `buildP27JourneySession()` extras catalog include all 150 cues. `journeySession()` supports `dialogue:<id>` for exact four-step sequences, plus `return:<id>` voluntary independent practice and `return-due:<id>` only when its actual existing FSRS trace is due.
- No synthetic return dates or automatically awarded FSRS success. The original `StudyPlayer`, `StudyEvents`, `MemoryTrace`, and owner-scoped local-first progress remain authoritative.
- Existing **Learn / Verstehen** introduces speaker-transfer variants, including the P41 source situation's title, new speaker and social relationship, politeness choice, changed fact and why the communicative goal changes.
- Existing **Learn / Antworten** supports all prior P40/P41 and new P42 source arcs without creating a second dialogue player. P42 adds the current interlocutor, relationship, register and variation. Users can navigate back to the matching P41 source conversation with no disclosure of the new answer.
- The guided example comparison remains ephemeral and ungraded. Choice notes are bounded to authored examples; the app does not claim to understand arbitrary free-form Japanese.
- Existing **Learn / Schreiben** chooses the new variant's important turning point (or another dialogue turn) for the canonical draft → revise → compare flow. Any optional owner-scoped event is `skipped`, `schedulerExcluded:true`, stores only length and authored source IDs, and excludes raw Japanese and audio.
- Existing **Learn / Festigen** displays truthful absent, future or due FSRS status for each new independent return cue, plus actions clearly separated into due and voluntary early practice. The user's actual previously graded errors remain available to prioritize relevant dialogue scenes.
- Source-specific **remediation** gives register- and relationship-sensitive, answer-free hints for last independently graded P42 mistakes. Existing classifications (dialogue, production, transfer) remain in force.
- Responsive styling extends the existing CSS without new pages, dashboards, persistent role profiles or navigation systems.

## Pedagogical integrity and restrictions

- Content is original first-party Japanese with original German learning instructions. Uploaded Marugoto volumes and other learning PDFs remain reference-only: no proprietary texts, dialogue excerpts, exercise copies, audio, images or layout assets are reproduced.
- Written answer checking is intentionally limited to explicitly authored Japanese forms. Valid novel Japanese answers can fall outside that bounded key; guided feedback is not an overall language grade.
- P23–P41 source, stable IDs, prior StudyEvents, MemoryTraces, local-first accounts and native progress authority are preserved.
- A displayed guided dialogue and a separately authored independent transfer question are **not identical evidence**. Actual FSRS scheduling occurs only through native graded independent StudyPlayer events, never via guided choices or the writing-comparison UI.

## Verification / release

`NOT_RUN`: tests, TypeScript checker, build, CI, browser/mobile QA, academic validation, and linguistic acceptance. No PR, merge, deployment, migration, production access, or credentials. All claimed implementation is source-code writing, not a verified release.

## P43 next objective

**Conversational Decisions & Consequences.** Develop at least 25 original role-sensitive branching conversation scenarios with genuinely different consequences, explicit learner choices and context-correct continuation. Build with native StudyPlayer and Learn, without an ungrounded semantic judge, new scheduler, or duplicate learner state.
