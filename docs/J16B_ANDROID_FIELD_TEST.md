# J16B — Physical Android PWA Field Test

**Scope:** actual installed Android PWA acceptance, not Playwright mobile simulation. No assertion is accepted without an exact live candidate identity, a real test action and a non-sensitive observation.

## Before testing

1. Open `https://thiepn.dev/japanese/release-meta.json` in Chrome and record the 40-character `commit` and `channel: candidate`. The observed SHA must match the candidate under review. If it does not, stop.
2. Confirm the latest [J16A live candidate verification](https://github.com/thiepn/japanese/actions/workflows/j16a-live-candidate.yml) is green for that same SHA.
3. Record the device model, Android version, browser/WebView version, local date and time, and tester initials or reviewer ID. Avoid publishing identifying account credentials or recordings.
4. Install the app from Chrome's **Install app** command (when available), then open the launcher icon in standalone mode. A browser tab is not enough.
5. If the installed PWA shows a different build SHA from the browser, stop and record a blocking mismatch; stale service worker/caches can obscure which release is actually being tested.

## Required field-test matrix

Complete the following in order. Evidence should be a concise review note, sanitized screenshot, or a trackable issue ID; never upload passwords, login tokens, account identifiers, personally sensitive data or microphone audio.

| Existing D4 requiredChecks key | Actual hardware action | Expected observation |
| --- | --- | --- |
| `realAndroidDevice` | Test on a physical Android handset | Hardware model and OS version recorded |
| `exactCandidateCommit` | Compare in-app/URL deployment metadata with target | Exact 40-hex SHA matches test target |
| `standaloneInstall` | Install PWA and launch from Android launcher | Standalone presentation, not just a browser tab |
| `coldLaunch` | Force-close PWA, relaunch it | App starts without blank or stale screen |
| `darkLightAndPersistence` | Toggle theme, navigate, relaunch | Preferences survive; text and controls readable |
| `todayLearnImmerseLibraryProgress` | Traverse all five destinations | Every destination opens and remains usable |
| `studyFullScreenAndTouch` | Start, interact with and exit Study | No unreachable buttons or clipped choices |
| `readerNavigationAndSupport` | Open a text, use reader controls, return | Japanese content and aids work without overflow |
| `librarySearchAndFilters` | Search Japanese and use filter controls | Keyboard and results remain usable |
| `offlineReload` | Load online, enable airplane mode, relaunch | Warm-cached app loads; offline limits shown appropriately |
| `backgroundResume` | Background app, return and resume | View and learner state remain coherent |
| `rotationPortraitLandscape` | Rotate both directions | No clipped or trapped interface |
| `safeAreaBottomNav` | Test with system navigation and keyboard | Controls clear gesture/home bar and keyboard |
| `textScale200Percent` | Enable 200% accessibility font scaling | Text readable; navigation and controls reachable |
| `keyboardFocus` | Use a paired keyboard where possible | Focus and activation visible, no keyboard trap |
| `screenReaderTalkBack` | Enable Android TalkBack and traverse screens | Names, focus sequence and actions are understandable |
| `speakerHeadphoneAudio` | Play speech/audio via both outputs | Both routes play properly; volume manageable |
| `microphonePermissionAndCapture` | Grant mic permission and record a test sample | Recording/playback works locally; no upload assumed |
| `localAudioDelete` | Delete recorded sample and try to retrieve it | Sample is no longer available within the app |
| `noHorizontalOverflow320` | Use narrow/reflow conditions and maximum text | No document-level horizontal pan or inaccessible actions |
| `noBlockingVisualDefects` | Review all tested screens and known incidents | No unresolved high-severity release defect |

**Account journey, separate from synthetic route checks:** also perform a real login and return through the Account entry/callback if authorized, including a cold restart and logout. This is not proven by HTTP 200 and is not yet wired as a mandatory D4 manifest key. If it fails, record a release-blocking defect; do not invent successful SSO.

## Recording and qualification

Use the pending session skeleton in `release/j16b-android-session-template.json` for the test run. Enter the exact candidate SHA and individual dated observations **only after** each hardware action. A blocked or not-tested check remains pending, never pass. Attach issues with reproducible steps, severity and affected build. For a final D5 release decision, transfer verified checks to the independently maintained `release/j15d-d4-device-acceptance.json` **on the separate review-evidence branch**, not to the immutable application candidate SHA. See `docs/J15D_D5_RELEASE.md`.

A release must not be promoted on the strength of a completed checklist alone: J15D 42-case human diff review, P11/P21 external evidence and product/accessibility/operations signoffs are separate.

## Abort and retest conditions

Stop and invalidate the session if the deployment SHA changes during testing, the wrong channel is served, the installation uses an unsupported wrapper, any critical data/privacy defect occurs, or a blocking crash prevents reaching a check. When code changes to fix a defect, test the **new** SHA and rerun relevant automated, visual and physical acceptance; do not copy pass states from the older commit.
