# J20 — Browser, PWA, mobile emulation and recovery qualification

## Prerequisite

J19 draft PR #45 exact head `4d566593450950155096672b4b24fba992763570` passed all mandatory GitHub CI checks in [run 37992345794](https://github.com/thiepn/japanese/actions/runs/37992345794), including browser E2E and the `b2-release-qualification` artifact. J20 is stacked directly on J19; J17/J18/J19 remain unmerged.

## Automated scope

- `tests/e2e/j20-device-recovery.spec.ts`: Android-sized and compact Chromium emulation, portrait/landscape viewport change, 200% root text reflow, PWA offline reload/resume with StudyEvent persistence, passive Account popover versus explicit OAuth handoff, keyboard skip navigation, semantic active navigation and reduced-motion preference.
- `tests/local-db/j20-recovery.test.ts`: owner-local backup/outbox restoration while disconnected; no imported Core cursor; correctly rehashed foreign Sync envelope rejection without existing-data loss.
- Full existing E2E, typecheck, unit, content, native-provenance and build gates remain mandatory. CI records a separate `artifacts/j20-automated-qualification.json` **after** full Playwright succeeds; the file is uploaded with release artifacts.
- These are Chromium device **simulations**, not recordings of Android, screen reader, physical microphone, headphones, browser installation or real Google callback.

## Operator-only independent acceptance: PENDING

Use the already checked-in `release/j16b-android-session-template.json` and `release/p21-device-acceptance.json` as **blank templates**. The operator must stage an exact candidate SHA and record real Android device model, OS/browser versions, Chrome and installed-PWA launches, standalone behavior, theme, Today/Learn/Immerse/Library/Progress, portrait/landscape, 200% OS text, TalkBack, keyboard, safe-area, speaker and headphones, microphone permission and audio deletion, quota/offline restart and actual Account OAuth Chrome-to-PWA return. Keep evidence separately from the tested commit, exclude tokens, account identifiers and raw recordings. An emulator passing the automated suite does **not** authorize the physical manifests.

## Boundaries

- Japanese first-party OAuth registration is still operator-only and not present in Account production. Do not register an OAuth client from CI; no real Google login is asserted here.
- J19 backup API is an internal local JSON export/restore, **not** an in-app backup UI, Core push/pull, automatic off-device backup or cloud restore. Local private content and audio require deliberate secure handling.
- External language expert reviews, J15D independent visual acceptance and J16 field evidence remain pending. No merge/deploy/stable promotion.
- J21 can begin after J20 exact-head automated CI succeeds; separate human-only gates stay pending until genuinely verified.
