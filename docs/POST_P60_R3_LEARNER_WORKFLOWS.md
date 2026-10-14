# THIEPN Japanese Post-P60 R3 — Original Course Workflow Consolidation

## Exact stacked parent, restrictions and scope

- Requested R2 parent `fix/post-p60-r2-source-editorial-recovery` at exact `1b2c95edfcdc0faad398ee3519dd51b0e6c32387`, verified `identical` by GitHub comparison **before** creating the child.
- Separate direct stacked child: `feat/post-p60-r3-final-learner-workflows`.
- All source changes are on this child branch, with no PRs, merges, migrations, tests/builds, CI, browser QA, production, deployments, credentials or paid services.
- **NOT_RUN:** TypeScript compiler, typecheck, all automated/browser/mobile acceptance, device SpeechSynthesis, native-user writing acceptance, account-switching integration acceptance, external Japanese editorial review. No runtime/quality certification is claimed.

## 1. Actual P40–P59 graded source continuation, not a new roadmap

The new `study/continuityR3.ts` operates exclusively on original `P60HistoricalReviewSource` records, already derived from the original owner-scoped StudyEvents and FSRS MemoryTraces. It performs no writes. For the current real foundation unit, it returns a **four-part practical original-source sequence**:

1. **Source comprehension**: original multi-paragraph reading/listening source evidence from the independently authored P46/P47/P49/P54/P55/P58/P59 corpora;
2. **Conversation**: original P40/P41/P42/P43/P44/P45/P56 speaker and response sources;
3. **Practical writing/repair**: P48/P50/P51/P52/P53/P57 source-grounded production support. Independently authored free sentences are still only self-compared and remain ungraded;
4. **Actually scheduled FSRS review**: only an original prompt whose existing FSRS trace is **genuinely due**, opening the *original* unit-scoped `review` session, not a hand-picked prompt incorrectly labeled "due".

Within each learning category, existing authentic current statuses prioritize **due**, **last incorrect** (explicitly not necessarily due), **unseen**, then **previously practiced**. This is a *view of original practice evidence*, not an inferred mastery score, new skill threshold, duplicate planner, account store, persisted UI checkpoint or alternate scheduler. When an original source is not available for the selected foundational unit, its action is disabled and explains the absence. The existing native `source60:<originalPromptId>` remains exact and unit-scoped.

`P60ConsolidationStudio` displays those four direct original StudyPlayer actions while leaving six older expanded learning-track catalogs available **on demand** instead of making learners scroll past a second mandatory wall of redundant cards. All original source discovery search/filter and R2 historical return eligibility remain intact.

## 2. Real multi-step A2 practical workspace continuity

P60 now has a single accessible four-step navigation surface for original reading, optional device-TTS-aided speaker comprehension, independent ungraded writing/revision and evidence-based reflection:
- Keyboard Left/Right on the four section navigation buttons selects the corresponding section and preserves button focus.
- Previous/next buttons expose the current section count and move focus to the next/previous section heading. Each active Japanese exercise section's heading can receive programmatic keyboard focus, without taking focus from the actual source controls on ordinary typing.
- The three previously redundant end-of-section "next" buttons were removed; one shared navigation control remains available.
- Switching steps **within** the selected lesson keeps the learner's unfinished Japanese text in React component memory. No raw Japanese answer is written to a new store.
- Switching **between lessons** asks whether to discard nonempty unsent writing. After consent only the old lesson's **view position** (section, selected question mode, question index and long-source reveal flag) is retained in a component-only Map for the life of that mounted page; private Japanese prose and grading state are never retained or treated as resumable. Returning to the lesson restores only that view position; source and model contents remain gated by their original controls.
- Clicking the already selected lesson no longer silently resets the draft, and R3 preserves R1/R2 owner- and foundational-unit remount boundaries.
- Later-stage A2 authored sources keep the P60 original scaffold-fading behavior; optional synthetic TTS is not measured pronunciation or real recorded listening.
- Responsive four-step cards, 44px minimum action targets, focus-visible styles, narrow-screen one-column layouts and reduced-motion behavior apply to the new workflow. Physical mobile/keyboard acceptance is **NOT_RUN**.

## 3. Compact original Learn return journey

`P27LearningJourney` previously repeated an "immediate recommended unit" block and a separate "last genuine unit" block above the full sidebar. The R3 top-level continuation now collects the existing:
- real source-unit with owner-scoped **FSRS due trace** (when one exists) — launches original due-only `review`;
- most recently **actually graded** source unit and last practiced timestamp — not artificial completion;
- existing recommended original foundational unit — without fabricating that an unattempted lesson was passed.

The user's current original unit step is remembered in a **per-mounted-page, per-account view-only Map**, cleared on Account changes. A second click on the current unit does not reset the current step. The older original sidebar, study histories and all actual StudyPlayer/P27 practice paths remain unchanged. The current unsent-draft confirmation is respected before changing units or opening other original source-practice routes.

## 4. Original Today queue and Account continuity

The native `runtime.ts` `buildTodayQueue` now captures the current canonical development Account ID *once* before asynchronous reading, fetches authentic local MemoryTraces and StudyEvents from that owner, filters both by their own `userId`, and rejects a result if the active Account switches during the operation. This stops returning an asynchronously stale mixed-owner due queue. The same owner-snapshot guard applies to the original Study Summary and observed same-day independently graded event count. `schedulerExcluded` ungraded draft-only events never count as completed independently assessed Today answers.

The existing FSRS scheduler and canonical `isDue` / `dueAt` logic are preserved without any new due thresholds or invented review cards. Today continues to include **both genuinely due and explicitly new exercises** as before, but labels and due-only review actions reflect only authentic existing FSRS timestamps. The existing original private-vocabulary and private-sentence generators still have their own original authenticated account authority; this phase does not refactor or claim acceptance of that older integration.

## 5. Concrete source contract consistency

`missions58-types.ts` used a narrow question-kind union `cross-source | chronology | evidence | intention`, while real first-party P58 corpus missions also authored genuine `status` and `reason` questions. The union is now reconciled with the existing source data **without changing a single source ID, Japanese sentence, original StudyPrompt, FSRS trace key or historical graded response**.

## Guarantees, limitations and next phase

- Historical P40–P60 source IDs, R1 return rules, R2 exact historical eligibility, original Account permissions, local-first StudyEvents and FSRS scheduling remain authoritative.
- No new grading, artificial CEFR/JLPT proficiency, free-Japanese automatic grades, shadow learner database, recorded speech, proprietary Marugoto copying, remote account writes or persistent raw draft stores.
- The view-level page-lifetime position helpers cannot restore work after a page reload/browser closure. This limitation is intentional because private text persistence was not authorized.
- Source inspection and GitHub history prove committed changes, **not** browser interaction, device support, typecheck passing or lesson-quality certification.

**Separately authorized release-readiness work:** TypeScript compilation and source-contract integration fixes, formal independent Japanese editorial review (including German gloss/evidence auditing), real owner-switch/private-data and FSRS acceptance, mobile/keyboard/screen-reader/manual QA, device synthetic audio behavior, PR review, merge and gated deployment.

**Possible next source-only milestone:** Post-P60 R4 — Final Original Lesson Content & Navigation Refinement. If the next user goal is deployment, request explicit qualification/release authorization before using build/CI/browsers, PRs or production.
