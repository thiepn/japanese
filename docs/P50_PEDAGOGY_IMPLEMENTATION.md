# THIEPN Japanese P50 — Integrated Japanese Comprehension

## Lineage and scope

- **Exact P49 parent:** `feature/p49-everyday-document-literacy`, SHA `36617cafd3e1f7318cfcb8dcae59dec00db8ca10`.
- **Isolated P49-child branch:** `feature/p50-integrated-japanese-comprehension`.
- **Delivery mode:** substantial first-party Japanese content and actual learner-facing source implementation. No tests, builds, CI, browser QA, PR, merge, migration, deployment, credentials or production access.

## Original A1–A2 instructional corpus

Four author-written source corpora contain **20 substantial integrated Japanese missions**: **8 A1, 12 A2**, progressing from direct time/quantity changes to distinctions between different time windows, source authority, provisional status, explicit uncertainty, conditions and practical decisions.

Every mission includes:
1. A separately authored original **Japanese written document** with realistic genre, issuer/context, multiple textual details and a complete German source-level interpretation.
2. A separately authored **four-to-five-turn Japanese listening conversation or spoken public notice** with named speakers and accurate German line translations. The listening source introduces genuine new information, correction, qualified confirmation, explicit exception or meaningful uncertainty rather than merely repeating the reading passage.
3. **Three different independently producible comprehension responses**: locate a fact, reconcile spoken versus written changes, and infer a practical outcome. For each, there are two first-party Japanese model responses, one realistic original misconception, a unique corrective explanation, and **source-specific text-evidence excerpts explicitly marked reading or listening**; many questions use both sources together.
4. **Two contextual original vocabulary points** bridging the written/spoken setting.
5. A practical independent Japanese **written reaction** with two example models and misconception feedback.
6. An **unseen cross-context production cue** in a different situation with different facts/conditions and alternative original examples. Transfer never silently reuses the earlier scenario's time, place or answer.

The mission topics: station entrance and actual meeting place; bakery pickup after equipment failure; revised school bus and detour; library room capacity and unconfirmed reservation; changed cinema start without seat cancellation; flower order colour substitution; indoor sport after rain; changing grocery quantities; appointment alternatives not yet booked; late hostel check-in and limited parking; museum tours with separate deadlines; assignment length versus unchanged submission time; volunteer tasks after weather change; parcel delivery and pickup windows; conditional market discounts; trial library hours versus permanent opening; menu ingredient clarifications and unknown allergen information; ferry cancellation versus uncertain replacement; conditional apartment viewing after a closure; accepted language-partner café meeting despite initial hearsay.

All examples are **fictional, entirely original Japanese learning content**; they must not be mistaken for active train services, official rules, valid tickets, allergen assurances or real institution contact information. Existing source PDFs and Marugoto A1/A2 are reference-only; no publisher text, dialog, artwork or audio was copied.

## Canonical source and prompt integration

- `apps/web/src/study/integrated50-types.ts`: clear typed authoring contract with evidence modality, original speaker turns, learner output and transfer.
- `integrated50-corpus-a.ts` to `-d.ts`: 20 original first-party missions.
- `integrated50.ts`: source-owned unit matching, bounded exact authored comparison and **140 canonical `StudyPrompt` cues**:
  - **60** independent text-supported comprehension prompts, stable IDs `p50-question-<missionId>-q1/q2/q3`.
  - **40** contextual word recall cues, `p50-word-<missionId>-1|2`.
  - **20** independent practical writing prompts, `p50-write-<missionId>`.
  - **20** different-context delayed returns, `p50-return-<missionId>`.
- Each prompt uses original `sourceId:"thiepn-original"`, `contentVersion:"p50-1"`, `primaryTarget`, `cueFamily`, source-scoped `contextId`, learner unit scope and original `eventMetadata`. No new scheduler, writer, owner model, progress store, mastery engine or proprietary media asset is introduced.

## Real integrated learner UI

`apps/web/src/design/P50IntegratedStudio.tsx` is mounted in the existing **Learn / Verstehen** course stage:
- Progressive, searchable A1/A2 mission catalog, written Japanese documents, and a clearly separated listening stage.
- Listening transcripts **hidden initially**, so learners can listen before revealing the text. Optional browser/device Japanese `speechSynthesis` with read/replay all, per-sentence playback, adjustable rates, pause, resume, stop, and manual shadowing prompt **without microphone capture or recording**.
- Synthetic voice is **clearly and repeatedly described as device TTS, never a recorded human speaker**. Missing/unusable TTS has a truthful transcript fallback.
- Original audio-source text reveal and optional separate German line help. Learners freely type Japanese answers. Exact first-party model variants and one explicit misconception provide **bounded, non-semantic feedback**; all other possible valid Japanese remains **unassessed**, never incorrectly declared wrong by the guided interface.
- Original evidentiary citations identifying written versus spoken material and both authored models appear only after learners have submitted, then actively requested source evidence.
- Original writing task opens the native **Learn / Schreiben** draft, revision and source-aware comparison rather than another persistence/editor implementation.
- Optional actual independent StudyPlayer cues for comprehension, contextual words and writing. The **native StudyPlayer is TEXT SUPPORTED** and explicitly displays Japanese reading and listening transcript; it must not claim to certify audio-only comprehension.
- Different-context voluntary return uses `integrated-kind:<id>:return`. Source-owned `return:<id>` and `return-due:<id>` actions use actual original FSRS-owned `MemoryTrace.card.due` where present. Source reveals, listen button and guided draft do not mint graded results or fabricate due dates.
- `runtime.ts` reuses original Today catalog, `journey27.ts` original unit-scoped StudyPlayer and FSRS scheduling, `remediation36.ts` original contextual repair hints, and `P27LearningJourney.tsx` original course and owner account source paths.
- `p27-journey.css` supplies responsive mobile/keyboard/source-visibility controls without changing main or production.

## Integrity and requested exclusions

- All past P23–P49 canonical source IDs, owner data, original local-first account boundaries and historical GitHub branch/main/production work are preserved.
- No new data store, duplicate FSRS engine, artificial progress, raw audio storage, microphone relay, uploaded speech or paid APIs.
- Marugoto and other user-uploaded study books remain reference-only.
- This is **NOT_TESTED / NOT_RUN** source work. No TypeScript check, test suite, CI, build, audit, browser/device QA, native-speaker linguistic verification, PR, merge, deployment, migration or production access was performed. A committed SHA confirms source only, **not** a running or verified release.

## P51 content-first handoff

Implement at least **50 substantial original contextual A2 grammar meaning contrasts**, beyond isolated sentence substitution. Teach distinctions through realistic authentic Japanese situations, original multiple-context examples, corrective explanation and evidence-based recall, varying speaker roles and information states. Reuse P23–P50 learners, existing original prompts, Today, Learn, FSRS and writing authority. Avoid grammar claims not supported by the app's published materials, fabricated mastery, duplicate stores and source-rights changes.
