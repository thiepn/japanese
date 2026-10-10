# J34 — Physical Android, first-party Account and independent human field sessions

## Scope and immutable boundary
J34 stacks on J33 exact qualified head aea8b490dd5e2b332b4c946f7bb52d3049325912 (CI 38075972171). The 51-entry archive #11679506429 passed independent SHA256 cb57706f5c93d032b548f332f4481774da4703322ad6ec961bdd3ba0b569e62d and ZIP CRC. All nine human evidence domains remain OPEN. This is nondeploying source work: no actual physical or human observations, signoffs, acceptance flags, commits to ancestors, changes to goldens, production activity or credentials.

## New real-world observation workflow
CI produces artifacts/j34-field-kit.json and artifacts/j34-field-kit.html after J33. The latter is a standalone, mobile-friendly, read-only-initial-state but interactively fillable offline operator checklist. It performs **no network requests or persistent browser storage** and only exports JSON on explicit user action. A tester enters the observed deployed candidate SHA (from release-meta.json), non-identifying alias, individual NOT_TESTED / OBSERVED_PASS / OBSERVED_FAIL states, sanitized reproduction notes and original evidence references.

If the observed deployed SHA is wrong or missing, exported observations are all NOT_TESTED. Even when it matches, all entries are expressly unverified self-reports: independentlyWitnessed=false, mergeAuthorized=false, deploymentAuthorized=false, releaseAuthorized=false, humanAcceptanceGranted=false. The export is NOT a P11/P21 release-manifest admission and does not trigger external actions.

Main's continuously deployed public candidate is **not necessarily the J34 draft exact head**. Exact-head physical acceptance needs a distinct, **separately owner-authorized**, disposable staging candidate with original asset/build identity. Never merge, deploy or test production merely to fill this template.

## Owner hardware acceptance (actual human participation required)
1. Authorize a disposable staging URL and verify its unchanged exact SHA and build source. Record Android handset model, Android version and Chrome version outside the tool without attaching identifying credentials.
2. Install the PWA from Chrome, close/relaunch from the Android icon in true standalone mode and complete every original P21 check: all five destinations, Study, speaker/headphones, offline airplane-mode reload, background/resume, rotation, 200% text, microphone recording, local P19 audio deletion and system safe areas.
3. Enable **real TalkBack** and witness the focus order, control names, activation and keyboard/assistive interactions. Browser emulation and synthetic tests do not count.
4. With separately authorized disposable THIEPN Account identities, perform first-party Google sign-in through account.thiepn.dev/japanese/entry. Witness real consent, PKCE callback, trusted identity verification, installed-PWA return, cold restart, logout and workspace isolation. Do not export codes, tokens, account IDs, private email or raw recordings.
5. STOP and record a blocking defect if SHA changes, the PWA is not standalone, sessions mix, saved answers vanish, TalkBack traps focus or audio/microphone behavior breaks. Fix source on a new exact head and repeat required device tests; never reuse approvals across SHAs.

## Independent human handoff
- Japanese curriculum reviewer: compare source-provenanced kana/kanji, readings, grammar, JLPT claims, captions, registered audio licenses and pronunciation, documenting actual item identifiers and reproducible corrections.
- P11 reviewer: submit at least six **real learner-produced artifacts** spanning writing and spoken interaction/production; use an external qualified teacher, tutor or language professional. Their authenticated review and packet SHA must be admitted separately; this kit never grants it.
- Visual reviewer: recover **42 actual original case mappings and 126 original PNGs** from independent custody, match reference/candidate/diff and review real legibility, dark mode, contrast, screen reader and zoom. Current 42/126 generated slots are NOT source originals.
- Authorized operations: independently witness exact staging identity and a real rollback of original known-good bytes. Never infer success from static metadata alone.

## Exact-head report defect fixed
The archived J33 P11/P21 reports used synthetic GitHub merge SHA c88863a8..., while source reports J20–J33 used true PR head aea8b490.... The P11 CLI previously derived commit from GITHUB_SHA; P21 supported --commit but CI omitted it. J34 explicitly passes the exact PR head to both scripts and validates P11 --commit as a 40-character lowercase hex digest. This corrects **provenance attribution only**. P11 and P21 remain HOLD without real independent human and hardware evidence.

## Required tests and release boundary
Adversarial unit tests reject forged authority, wrong SHA, fake closures, missing original coverage, and cross-build reported passes. Playwright tests exercise the field kit, real local download, 320px/200% zoom, Android emulation, dark mode, keyboard and reduced motion. CI still requires all existing full tests/build/content/provenance gates. Nothing in this phase creates a production action, modifies a human manifest or grants an acceptance result.
