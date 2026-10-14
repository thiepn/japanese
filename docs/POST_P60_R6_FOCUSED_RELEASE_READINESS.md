# THIEPN Japanese Post-P60 R6 — Focused Technical & Editorial Release Readiness

## Strict ancestry and operations

The exact R5 parent `fix/post-p60-r5-source-consistency-native-handoffs` at `6f19cd52122ed47901c94e988db4fd8c61c7f0f7` was verified with GitHub compare status `identical` before branch creation. R6 source changes are committed only to `fix/post-p60-r6-focused-technical-editorial-readiness`; no earlier branch, `main`, production, PR or deployment was modified. No credentials, migrations, CI, GitHub Actions or paid services.

## Concrete implementation defects repaired

1. **P60 choice contract:** Original P60 revision StudyPlayer prompts declared `promptType:"choice"` yet had no `choices` at all. `consolidation60.ts` now includes `[q.model,q.flawed,q.alternative]`, consistent with existing two accepted authored correct options, prompt IDs and original `can_do` targets. No grading engine or FSRS trace IDs were changed.
2. **Historical course owner discovery:** `p60HistoricalSources` previously trusted its callers to prefilter both StudyEvents and FSRS MemoryTraces. It now accepts the established Account ID, filters source data by owner **inside the function**, and rejects ambiguous ownerless input instead of inferring due review from mixed users. The original Learn caller passes its Account owner explicitly, including with empty new-account history. Existing source IDs and existing due timestamps remain canonical.
3. **Today/summary cross-account private sources:** `buildTodayQueue` had captured the original `DEVELOPMENT_ACCOUNT_ID` for events/FSRS but called private vocabulary and sentence generators that separately read `AUTHENTIC_ACCOUNT_ID`; those globals need not be identical during account switches. Both private builders now accept an explicit ID (retaining the original default for their other existing callers), fetch that owner's records and filter returned `accountId`. Today, study summary and vocabulary/sentence mastery summaries supply the exact captured owner, with account-staleness rejection and owner-filtered StudyEvents in the two mastery summaries. This is the original persistence authority, not an additional account or private prompt store.
4. **R4/R5 stale Japanese second draft:** Changing an original first draft cleared feedback but left an older independent second draft available for re-submission without fresh work. The R4 studio now resets the dependent second draft as well as its later replies/transfers. Japanese IME and stage controls remain original.
5. **P60 clinic dialogue/source chronology:** The original clinic source had a patient who could miss the 10:00 examination yet was moved earlier to 09:30 without explained availability; the receptionist only offered a potential time but exercises called it confirmed, and the later message described the same slot as full. `consolidation60-corpus-b.ts` now has the patient affirm they can make the earlier time; the receptionist confirms the revised 09:30 booking; the original comprehension question explicitly refers to this *first confirmed* time; the subsequent message explicitly cancels that booking because of a double booking and offers 13:00 subject to proper physician coordination. Japanese/German explanations are aligned to the exact chronology. The unchanged original lesson/source/study prompt IDs and accepted 09:30 finite correct answer remain supported; no medical diagnosis or test outcome is invented.

## Executed focused verification

### PASS: Connector-backed structural/source checks (not TypeScript/build/runtime)

- **First focused source-contract check:** 16 PASS / 0 FAIL. Checked presence of complete P60 revision choices and stable prompt IDs; Today private generator same-owner calls; actual private-record owner filtering; vocabulary/sentence mastery summary owner scoping; historical discovery owner scope; original FSRS due-only `Date.parse(card.due)<=now` path; P40–P52 R2 original return eligibility; R4 source revision and staged transfer reveal; native Learn stage handoff and scheduler-excluded writing; IME compose guard across writing stages; all 20 original R4 cases mapping to exactly 20 R5 repair IDs.
- **Second focused source-contract check after code corrections:** 10 PASS / 0 FAIL. Re-verified clinical source chronology and original accepted answer, P60 choice option contract, owner-scoped historical discovery, original Today/summary explicit owner passing, private record filters, stale draft invalidation, delayed R4 transfer gate, authenticated Learn caller and unique 20 R5 repair IDs.
- **Additional inspected original source identities:** P40–P52 original return arrays and their phase-specific metadata keys `arcId`, `sceneId`, `caseId`, `challengeId`, `readingId`, `documentId`, `missionId`, `contrastId`, `transformationId` were fetched for source inspection; the R2 implementation matches those named phase identity keys. This is not proof that every runtime-authored prompt or historical StudyEvent has been exercised.
- **GitHub compare:** exact parent identity confirmed before branching; final ancestry/head verification performed separately.

### BLOCKED: local TypeScript and executable integration checks

The local shell provides Node 22.16.0 and TypeScript 5.8.3, but it has **no working local checkout** of `thiepn/japanese`; direct read-only GitHub checkout cannot resolve `github.com` in the local execution container. The GitHub connector permits reading and committing individual files, **but does not mount the full repository and workspace packages into the local shell**. Consequently no meaningful repository `tsc --noEmit` could be executed. Do **not** claim TypeScript compilation passes. The 26 source checks above inspect patterns/invariants in actual connected source code but do not transpile JSX or resolve TypeScript imports and workspace contracts.

### NOT_RUN / NOT_VERIFIED

- Automated unit/regression tests and actual StudyPlayer/FSRS runtime assertions.
- Real Account A/B privacy switching, malformed/foreign StudyEvents and MemoryTraces, cancellation race testing.
- P23–P60 full course/editorial inventory, all learner acceptance, all native Japanese source/meaning accuracy.
- Actual mobile browsers, iOS/Android Japanese IME behavior, screen-reader/focus acceptance, synthetic device-TTS listening behavior.
- App-level build, CI, GitHub Actions, PR review, merge, deployment, production inspection, migrations and external paid services.

## Release blockers and recommendation

**Status: NOT RELEASE READY.** The repaired source is substantially better but not independently compilable in the available local workspace. Before authorizing merge or production deployment, provide a permitted full local repository checkout and workspace dependencies; run focused `tsc --noEmit` and small existing native StudyPlayer/owner-scoping/FSRS regression tests, repair any concrete type/runtime failures, obtain human native-Japanese/German editorial review on cumulative A2 cases, and manually accept private owner switch, unsent Japanese drafts, return eligibility, mobile keyboard/IME accessibility and TTS behavior.

A *separate draft PR solely for qualified review* may be authorized once a real compilation environment is available, but an unreviewed direct merge or deployment is not recommended. This phase did not create any PR, merge, build, migration or deployment.
