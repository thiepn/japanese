# THIEPN Japanese — Post-P60 R1 Native Course Integration & Source-Level Stabilization

## Exact ancestry and restrictions

- Requested P60 parent branch: `feature/p60-a2-consolidation-independent-review`, head `f67391637d6c79085c53d91e2fccaad327ab0fce`, compared on GitHub before branching: **identical**.
- Distinct directly stacked child: `fix/post-p60-r1-native-course-integration`.
- Real development source is committed only on this branch. No PRs, merges, migrations, builds, CI/GitHub Actions, tests, browsers, qualification, production/deployment, credentials or paid services.
- **NOT_RUN:** TypeScript compilation, static/lint tests, unit/integration/e2e suites, device audio/browser/mobile acceptance, Japanese native-speaker editorial review and auth/FSRS database qualification. Source inspection and GitHub branch comparison do **not** demonstrate runtime correctness.

## Concrete source-level fixes

### 1. Historical P40–P59 exact-source identity and multi-unit navigation

Previously, `p60HistoricalSources` selected only one unit, normally the first `eventMetadata.unitIds` member. A genuine historical prompt shared by two or more Japanese units therefore disappeared when filtering by any later associated unit, even though `promptsForUnit` could legitimately route that source. R1 now:
- stores **all declared original unit IDs** on each read-only historical entry, with deduplication;
- optionally restricts candidate IDs to the actually existing `journeyUnits` (passed by the existing Learn integration), not assumed source names;
- keeps each original exact prompt ID, primary target, StudyEvent and MemoryTrace untouched;
- filters per selected course unit across `item.unitIds`, not just the first;
- opens the original native StudyPlayer source in the actual selected unit when valid, else the entry's original valid unit;
- validates historical navigation against the exact owner-scoped read-only source list and `unitIds`, not arbitrary caller-supplied IDs;
- displays all original associated units in the review interface, making source-to-unit provenance visible.

Only `p60HistoricalSources`, `P60ConsolidationStudio` and the existing `P27LearningJourney` integration are changed. No new navigation store or grade writer is created.

### 2. Historical delayed-return material no longer leaks into generic new practice

`promptsForUnit` previously excluded `p52-return-...` through `p60-return-...` from general `new`/`production` and review catalog source lookup, **but failed to exclude P40–P51 return cues**. R1 uniformly excludes `p40-return-...` through `p60-return-...` from general unit discovery and first-exposure practice. Original explicit `return:` and `return-due:` specialist routes remain in `journeySession`; native Today still includes only genuinely scheduled/due FSRS traces and is not used to invent return cards.

This source adjustment does **not** certify that every historical explicit return route has identical first-unlock rules: some old P40–P52 explicit `return:` routes may still permit manually requested return before an independent 24-hour evidence gate. That further historical-policy harmonization requires separate source changes to avoid silently revoking legitimate older experiences.

### 3. Owner-scoped returning-learner continuity from actual local evidence

P27 originally opened the earliest foundational unit by default, even for an existing learner, with no direct "last real activity" shortcut. R1 adds an explicit **return to last actually practiced original unit** action derived from original owner-scoped graded StudyEvents already used by `deriveJourneyProgress`. The displayed unit and timestamp represent an actual existing event, not a new completion record or inferred language score. If no real event exists, the link is omitted. No unsubmitted private draft is pretended to be recovered.

### 4. Safe local draft navigation across the native learning journey

Original P27 writing resets all ephemeral draft/revision text when changing foundational unit or original source. P58–P60 additionally cleared their own local draft silently when switching mission, exercise kind, or independent comprehension question, and parent navigation was unaware of specialist drafts. R1 changes:
- a single unsubmitted-work confirmation in P27 for sidebar, previous/next, recommendation, due-unit, related-topic, source handoff, adaptive suggestion, native StudyPlayer and targeted mistake/role/correction review;
- all P40–P60 original source-specific writing handoffs call the same discard confirmation before replacing the current writing context;
- P58, P59 and P60 studios report **only an ephemeral boolean dirty flag**, never private prose, to the original owner-local Learn parent;
- studios are keyed by both original account owner and current foundational unit, so switching units remounts obsolete mission selection, device speech and source reveals instead of silently continuing a different unit's scenario;
- internal mission, exercise and individual question switches ask before clearing an unsubmitted draft, with a cancel choice leaving existing text in the current React component;
- after a canceled adaptive suggestion, the current learning stage no longer changes anyway.

**No** `localStorage`, `sessionStorage`, IndexedDB table, recovery writer, new Account state, raw draft persistence, or artificial resume checkpoint has been added. Browser-native confirmation is the currently implemented accessible baseline; native UX acceptance has not been run.

### 5. Concrete Japanese source/evidence editorial repair

In P60 `shop-return-confirmation`, the original comprehension question "同じ色のかばんを交換できますか。" correctly expected "品切れです", supported by the written stock notice, but the provided second **spoken evidence quote** merely said "レシートを確認しました" and did not substantiate that same-color stock was unavailable.

The original Japanese shop-assistant line now explicitly says "同じ色のかばんは品切れです", with corresponding accurate German meaning; the question's spoken evidence quote now points to that exact original new utterance. The correction does not alter the accepted answer, original source IDs or unrelated scenarios. A professional Japanese-language editorial review is **not** claimed.

### 6. Source ID and account boundaries

The actual source declarations for P23/P25/P26 were inspected against source unit references in P58/P59/P60 corpora without executing application code. The authored P58/P59/P60 unit strings examined correspond to existing foundational source-unit IDs. No destructive rewriting of historical P40–P60 IDs, assessment writers, typed Japanese accepted answers, or native FSRS traces was used.

Existing owner-scoped original local-db `StudyEvents` and `MemoryTraces` remain the only relevant learner evidence; review due status is still calculated from recorded FSRS due timestamps, and an incorrect answer does not independently become an FSRS-due event.

## Limitations and next authorization boundaries

- **NOT_RUN:** tests, build, compiler, CI, browser/mobile/keyboard QA, Japanese speech synthesis, source corpus automatic auditing, native-speaker quality review, true account-switching acceptance and owner-private database integration.
- **NOT_DONE:** PRs, merges, deployments, production or migration work, credential access, paid services, fabricated CEFR/JLPT or open-ended free-Japanese grading.
- Browser confirmation is not a durable draft resume system; unsent draft prose is intentionally **not** recovered after reload or account switch.
- The R1 source changes are not evidence of full compilation. A dedicated explicitly authorized stabilization/qualification phase is needed to inspect real module type-checking, routing, device behavior and source evidence end-to-end. Japanese content should receive editorial review by a proficient speaker before release.

## Recommended next milestone

**Post-P60 R2 — Source Editorial Continuity & Cross-Phase Recovery** could further harmonize old P40–P52 explicit return eligibility, improve independent Japanese source/answer editorial consistency and accessible resumption, while preserving source-only development restrictions. Separately, explicit approval is needed before TypeScript/build/CI, QA, PR creation, merge or deployment. Source milestone completion alone is not production release readiness.
