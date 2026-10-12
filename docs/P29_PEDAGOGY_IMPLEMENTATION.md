# P29 — Adaptive Learning Depth & Conversation Refinement

Stacked on P28 commit 4460161f883cecfee1ecaee632fdc350a12f8cfc.
Branch: feature/p29-adaptive-learning-depth-conversation-refinement

## Implemented functionality
- **Existing unified Learn journey only.** No separate pedagogy page, new mastery store, replacement scheduler, or schema/migration.
- **54 interactive sentence-building tasks**: preserved 16 P24 and 20 P28 exercises and added 18 independent Japanese sentence exercises (one new per existing unit), with original Japanese cues, grammar notes, tile controls, undo, reset, and task navigation.
- **Meaningful word order:** selected P24/P28 prompts now accept explicitly authored valid reorders without creating new FSRS identities or losing original review history. Each variant has a nuance explanation. Other orders not recognized as correct remain **ungraded**, rather than becoming synthetic errors; no semantic/grammatical parser is claimed.
- **36 contextual lexical-sense and active-recall prompts** from 12 linked pairs of existing units. Each pair joins two related words in a new, independently authored Japanese sentence and German contextual translation, with recognition and active production cues. Linked study prompts enter the existing StudyPlayer, focused transfer and Today-due catalog.
- **Six additional original branching continuity scenarios** (24 turn nodes; 48 typed/choice StudyPlayer prompt identities), extending the inherited P28 eight scenarios. Learner choices influence what the conversation partner asks next and provide contextual paths to another A1/A2 unit.
- **Dialogue revision** in both P27 main conversation and P28 continuity component: preserve the first draft, edit a later version, show original example, explicit surface-level grammatical cues and register contrasts. Never store either raw user version or audio in metadata.
- **18 unit-matched informal/polite example pairs**, accompanied by pragmatic framing; form-aware but non-diagnostic revision observations compare apparent particles and endings without claiming grading.
- **Owner-scoped adaptive next actions** in the existing Learn > Festigen step: use the native StudyEvents and FSRS MemoryTraces to direct users to due/retry reviews, unaided sentence construction, related-unit vocabulary transfer and multi-turn practice. No self-reported mastery becomes an assessed mastery score.

## Preservation and honesty
- Existing P23–P28 lessons, source-owned progression, FSRS trace/cue identities and local-only learner events are retained.
- Assisted sentence construction and all free-response revisions are stored only as scheduler-excluded StudyEvents containing minimal metadata, no response text/audio.
- Independently typed recognized target answers may produce graded FSRS events. Unknown free answers are never auto-marked incorrect merely because they differ from the authored patterns. The choice modality is explicitly not independent speaking mastery.
- Device TTS and optional browser recognition are not proof of native audio or pronunciation quality.
- No copyrighted Marugoto passages, artwork, exercises, PDFs, audio or parallel copies used. All P29 authored content is original.

## Implementation status
- Remote source branch created and committed.
- CI, tests, typecheck, build, Chromium acceptance NOT_TESTED/NOT_RUN by explicit implementation-only request. The source is not certified runtime-ready. No pull request, merge, deployment, production migration, secrets, production account or personal records were used.

## Suggested P30
Consolidate pedagogy quality with focused corrections to proven source defects, smarter context-sensitive suggestion selection, native-learner UX, and expanded free response modes that preserve authored targets and the canonical StudyEvents/FSRS model. Avoid additional dashboards or tests absent explicit authorization.
