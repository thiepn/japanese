# Japanese Phase 1 — E01–E17 integration inventory

**Scope:** original learner-facing source in the consolidated draft PR #90. This is a source and workflow inventory, **not** a language-proficiency score, official Marugoto course completion, or physical release signoff. All entries reuse the pre-existing native Study Player, canonical source mapping, event ownership and learner projections. New optional free production does not claim verified semantic/speech mastery.

| Layer | Existing native source | Actual learner capability | Evidence limits |
| --- | --- | --- | --- |
| E01 | `apps/web/src/study/a1Excellence.ts` | Source-linked first A1 conversation, guided/typed response and delayed transfer | Drafts remain unscored; only real associated Can-do is eligible |
| E02 | `a1ExcellenceScenes.ts`, `a1ExcellenceCourse.ts` | 13 original A1 situations, encounter/listen/read/respond/revisit | Unmapped source situations remain preview-only, not invented graded Can-dos |
| E03 | `a2ExcellenceScenes.ts`, `a2ExcellenceCourse.ts` | 10 original A2.1 conversational situations, notices, source links and delayed prompts | Synthetic device voice never counted as native-speaker recording |
| E04 | `a2ExcellenceAdvancedScenes.ts`, `a2ExcellenceAdvancedCourse.ts` | 8 original A2.2 practical problem-solving situations | Missing canonical association fails closed rather than fabricating levels |
| E05 | `e05AdaptiveRecall.ts` | Targeted misconception repair from original incorrect answers | Repair is scheduler-excluded; no direct FSRS/mastery promotion |
| E06 | `e06IndependentCases.ts`, `e06IndependentCourse.ts` | Seven cumulative cases with source-qualified listening/reading, writing, spoken preparation and delayed transfer | Optional writing/speaking is non-authoritative |
| E07 | `e07LearningRoute.ts`, `e07DraftBuffer.ts` | One recommended daily pathway and opt-in device-local draft recovery | Derived recommendations, not a second scheduler or synced draft store |
| E08 | `e08ContextExtensions.ts`, `e06IndependentCourse.ts` | Seven changed-context dialogues, independent revisions and transfer | Canonical E06 unit/Can-do identity inherited |
| E09 | `e09CommunicationDepth.ts`, `e06IndependentCourse.ts` | Seven third-context interactions, source contrasts and transfer | No invented canonical mapping, proficiency grade or native recording |
| E10 | `e10DailyStages.ts`, `e06IndependentCourse.ts` | Eight short stage boundaries, optional speech and staged delayed return | Original prompts and StudyEvents remain authoritative |
| E11 | `e11PracticalTransfer.ts`, `e11ResponseMissions.ts`, `e06IndependentCourse.ts` | Seven original practical dialogue/notice transfers and 14 bounded role-response decisions | Choosing prepared lines is not independent speaking mastery |
| E12 | `e06IndependentCourse.ts`, `StudyPlayer.tsx`, `e07DraftBuffer.ts` | Separate first/revised private messages, original writing self-review and interruption-safe continuation | Revised drafts are learner-owned and unscored |
| E13 | `e13PracticalMixer.ts`, `design/E13PracticalLab.tsx` | Cross-case situation mixer over existing E11/E12 prompts | No duplicate prompts, graders, review store or proficiency claim |
| E14 | `e14ListeningHandoff.ts`, `design/E14HandoffStudio.tsx` | One continuous original listen → reply → follow-up and revision session | Source-checked original IDs, scheduler-excluded optional prompts |
| E15 | `e15ContextRecovery.ts`, `design/E15RecoveryQueue.tsx` | Revisit recommendations and focused source correction | Advisory 20h/72h intervals are not FSRS or guaranteed delayed mastery |
| E16 | `e16DialogueRehearsal.ts`, `design/E16ConversationStudio.tsx` | Five-turn original listening/shadowing, reveal and E14 handoff | Unsent scratch is ephemeral, device TTS labeled synthetic |
| E17 | `e17OriginalListeningNotebook.ts`, `design/E16ConversationStudio.tsx` | Explicitly saved owner-private turn notes, source listening self-check, existing backup/recovery | Existing `private_documents`; no new StudyEvent, sync, or grading |

## Repository qualification

The draft's branch-specific `.github/workflows/e12-exact-head-qualification.yml` executes full Vitest, TypeScript, content/license validation, P10 native queue preview, P11 native provenance audit, monorepo build and complete Playwright on desktop Chromium, Pixel 7 Chromium and compact 360px Chromium. Unlike focused earlier checks, the workflow fails closed if any executable gate fails or is skipped. Browser profiles are emulations, **not** real Android hardware.

## Outstanding owner/external dependencies

- Unmerged F1–F5 furigana drafts remain independent; do not silently integrate their editorially ambiguous readings.
- Strict P11 real external Japanese productive-language/source review has no admitted valid submission.
- P21 installed physical Android PWA and real microphone/headphone/interruption acceptance remains pending.
- Canonical Account identity exists, but Japanese production Sync v1 upload/pull and cloud-saves remain disabled until a qualified shared Core transport exists.
- P22 capability freeze is not bypassed by this development draft; owner must explicitly approve a capability-expansion release before any merge/stable activation.

## Full-suite regression discovered on 17 October 2026

A full 3-profile Chromium run on 1add5bcc3a9f303b9eab517a6264e08529e2f439 found six failures (442 passed, 47 skipped): late lazy-route CSS overwrote J12 sticky Library search and J13 panoramic snapping/reference-sheet height, and the P21 mobile touch-target test asserted on advanced tabs before async navigation and before explicitly opening the collapsed studio sections. This branch's corrective changes assign greater specificity to the intended responsive layout rules and exercise advanced tabs through actual studio disclosures. The repair requires a fresh exact-head run; do not infer PASS from this note.

## Further browser repair from exact-head second run

Run 39025397262 at f1507cff5c7807bf14d44d93f261efb0ca007e3a verified the earlier desktop J13 and mobile P21 failures fixed. Browser suite: 445 passed, 47 skipped, 3 failed. Two genuine J12 mobile filter-strip cascade failures (later route CSS restored `display:grid`) are addressed with mobile-specific selector precedence; a third Android Reader geometry failure was 397.08px paper against the 396px viewport-minus-gutter bound and is addressed with a scoped mobile paper max-width and auto margins. The qualification workflow now runs four known-regression specs **before** the full suite; a focused failure keeps the full browser step NOT_TESTED rather than burning a full run. Continue to require full exact-head evidence.

## Mobile cumulative learning navigation — UX2

The consolidated main-targeted draft exposes the original E06–E12 seven cumulative cases in the mobile Learn route, including verifiable prerequisite source listening and reading/form, native next-short-stage and full-session entry, the original 20-hour delayed retrieval state, and saved but unscored independent E11/E12 drafts. No new Can-do IDs, StudyEvents, mastery, schedulers, ownership partitions or cloud sync are created.

E13–E17 original practice studios (mixer, continuous handoff, recovery suggestions, source dialogue shadowing and explicit owner-private notebook) are directly reachable from the same mobile section. The existing catalogue is expanded and the selected original studio heading receives keyboard focus; this is navigation, not copied practice logic. CSS-only desktop continues to use the original advanced catalogue. Source-unlinked cases remain reading-only. This UX2 addition requires full exact-head browser qualification before it can be marked accepted.
