# P34 — Natural Response Expansion & Learning Flow Continuity

**Stacked base:** feature/p33-conversational-fluency-adaptive-consolidation at exact commit dc406401463a42a983ac4d9af71a1e2534245a9f
**Branch:** feature/p34-natural-response-learning-continuity

## Source implementation

1. **32 meaning-appropriate Japanese response alternatives** across the eight inherited P33 role scenarios (guest and host, two turns per perspective). Each alternative includes an independently authored contrast note explaining politeness, particle selection, explicit detail or phrasing. The original StudyPrompt identity, cueFamily and target remain unchanged, while acceptedAnswers and post-response alternatives expand. Other correct free answers can exist and are not automatically rejected as invalid.
2. **Two-stage repair conversations** for all eight P33 role situations. After asking someone to repeat, slow down or explain, learners can compose another Japanese reply to a new partner question. Both repair steps are locally logged in canonical StudyEvents with schedulerExcluded:true; no raw response/audio retained and no automatic mastery granted.
3. **Per-situation grammar/function/register feedback** after role responses, explaining relevant particle roles, service politeness, the difference between an invitation and a request for permission, tense, and appropriate communication goals. Text marker observations are surface heuristics with transparent disclaimers, not grammatical or semantic diagnosis.
4. **Twelve original tile-based Japanese sentence constructions**, each containing two authored natural orders. The unified tile exercise collection increases from 96 to **108**. The new stable IDs are registered with the inherited tile builder, StudyPlayer, Today and FSRS. Earlier source material and learner memory traces retain their IDs.
5. **Better role transition feedback**: an ephemeral 0–2 role-completion indicator for the current scenario, explicit notice that completion is not persistent mastery, and return navigation to existing FSRS-due sessions. There is no second local progress database.
6. **Keyboard/mobile improvements**: Ctrl/⌘+Enter to submit Japanese role and clarification replies, larger mobile-friendly controls, accessible labels and focus styles. Existing synthetic Japanese listening and typed practice are preserved.
7. **Concrete correctness fix**: showing a German partner meaning or grammar scaffold records in-memory exposure for that role turn. The learner cannot switch away and back to have that helped turn counted as fresh independent FSRS recall within the same unit session.
8. **Original teaching material only**: no Marugoto textbook passages, lesson text, example dialogs, exercises, illustrations or publisher audio copied. PDFs remain teaching-method references only.

## Inherited architecture, boundaries and limitations

- All P23–P33 authored lessons, original prompt identities, Learn routes and Today review selection stay in place.
- Canonical owner-scoped StudyEvents and FSRS MemoryTraces remain the only persisted learning and review authority. All new free response/repair metadata is scheduler-excluded and omits user text/audio.
- Model-listed target matches can provide exercise-level FSRS evidence only when typed independently without assistance. The response is not a comprehensive Japanese grammar, semantics, pragmatic accuracy or pronunciation evaluation.
- Role completion and hint exposure are in-memory controls and are not persistent learner ratings. A page reload resets those controls; real review scheduling remains FSRS-owned.
- Browser synthetic voices are dependent on browser/OS support. Audio playback is not pronunciation assessment.
- Source-only commits: **TypeScript typecheck, builds, tests, Chromium/browser acceptance and CI NOT_RUN/NOT_TESTED**, as requested. The branch has not been certified runtime-ready.
- No PR, merge, deployment, schema migration, production records, credentials, main-branch edits or cross-app writes.

## P35 proposal — Conversational Integrity & Adaptive Recall

Build richer authored follow-up and role-play responses within the same unified five-stage journey, strengthen independent-production evidence guards, connect grammar remediation to specific studied cues and FSRS-scheduled reviews, and refine mobile/keyboard learning continuity. Preserve original source-rights and local learner authority. Prioritize implementation over qualification-only stages.
