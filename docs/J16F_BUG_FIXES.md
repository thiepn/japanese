# J16F - Account, persistence and PWA defect repair

Baseline: `75fd28dd8e99f5778691c6e351ba0e24e088ba6d`.

This change repairs existing behavior without changing the Japanese design or adding learner capabilities.

## Verified defects and repairs

- Concurrent focus/pageshow/visibility refreshes could independently verify and attach the same account. Verification now joins an existing request; guest claims serialize in the page and use Web Locks between supporting tabs/PWAs.
- A verification completing after sign-out could restore the old account. An authentication revision invalidates earlier requests, including external SIGNED_OUT events.
- Study writes reread the mutable workspace ID after awaiting IndexedDB. Each answer now captures its original owner, and overlapping reviews of one skill serialize their scheduler revisions.
- Evidence/outbox could commit before scheduler persistence failed. All three writes now share a transaction, including rollback when structured cloning fails.
- Guest attachment deleted the entire source database after taking a snapshot. Cleanup now removes only unchanged copied records, preserving a save arriving after the snapshot.
- Temporary Account/network failures switched an attached user back to guest. An already attached local workspace now remains accessible during temporary verification/connection failures; explicit sign-out still switches to guest.
- Workspace changes left an old Study session or private Immerse/Diagnostics state mounted. Study closes on a workspace switch and private surfaces remount for the new owner. A late completion cannot increment another workspace's Today counter.
- Speech recognition was never aborted when leaving or advancing Study. Cleanup aborts it and disconnects result/error/end callbacks. Old audio completions cannot unlock a later listening prompt.
- A second submit could race React's saving state, and Exit could close while persistence was pending. A synchronous save guard prevents repeat submissions and defers Exit until completion.
- OAuth setup exceptions could retain login/connection intent. Failed setup clears both markers; callback return targets and credential-bearing targets are rejected.
- The service worker cached login request URLs, including authorization codes. Auth routes and query-bearing requests are excluded, the cache generation is bumped, and safe cache writes use waitUntil. Cache failures and registration rejection do not break online study.

## Regression coverage

`tests/platform/j16f-workspace-races.test.ts` exercises account refresh/sign-out, setup exceptions, return-target validation, workspace ownership, sequential scheduler revisions, atomic rollback, concurrent guest claims and late guest saves.

`tests/platform/j16f-pwa-runtime.test.ts` executes the actual service worker with requests to verify login exclusion and cache-write lifetime.

`tests/e2e/j16f-speech-cleanup.spec.ts` exercises the Learn -> Speaking -> Exit journey and verifies microphone abort and callback disconnection in all three browser profiles.

The existing unit, content, build/budget and browser suites remain required. Local browser verification uses Chromium 134 because the configured Chromium 153 download was unavailable in the workspace; CI must independently exercise its configured browser on the exact PR head. Physical Android, actual Google login and the existing independent release signoffs remain separate evidence; this patch does not mark them passed or promote the candidate to stable.

## J16G follow-up: preserve late destination writes

A regression reproduced an account write arriving after the initial emptiness check but before attachment: the old claim returned `migrated` and replaced the account's colliding event. The guest snapshot now uses one readonly transaction across all copied stores, and the final destination emptiness check and copy share one readwrite transaction, including sync metadata. If the destination became populated, attachment returns `target-populated` and leaves both workspaces intact. The regression checks preservation of the destination's correct answer and the guest's separate incorrect answer.
