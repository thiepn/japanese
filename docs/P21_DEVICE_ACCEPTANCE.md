# P21 Physical-Device Acceptance

This procedure records evidence that automation cannot provide. Do not mark checks as passed from Playwright, screenshots, emulator runs or assumptions.

## Required device

Use at least one real supported Android phone with a Chromium-based browser. Test the production build installed as a standalone PWA.

Record in `release/p21-device-acceptance.json`:

- a stable device ID;
- device model;
- OS version;
- browser version;
- `installMode: "standalone-pwa"`;
- ISO-8601 test timestamp;
- every required check as an explicit boolean.

## Required checks

`installStandalone` — install and relaunch the production PWA in standalone mode.

`coreSurfaces` — Today, Learn, Immerse, Library and Progress all open and remain usable without horizontal scrolling.

`studyControls` — start a Study Player session and confirm Exit, Continue and answer controls remain reachable and thumb-safe.

`speakerAudio` — verify connected/native/synthetic playback that is expected for the selected item through the phone speaker.

`headphoneAudio` — repeat audio playback through connected headphones.

`offlineReload` — cache a supported item, enable airplane mode, reload the PWA and confirm the expected cached/offline flow remains usable.

`backgroundResume` — background the installed PWA during study, return and confirm the current workflow remains usable.

`rotation` — rotate portrait → landscape → portrait and confirm no core action becomes unreachable.

`largeText` — increase browser/OS text size and confirm primary study/navigation actions remain readable and tappable.

`microphoneRecording` — complete one real microphone workflow, including permission handling and local playback where applicable.

`localAudioDelete` — save a P19 local audio capture, delete it and confirm the raw recording disappears from device-local storage while the bounded evidence record remains.

`safeAreaNavigation` — confirm bottom navigation and primary actions remain above real device safe areas/system chrome.

## Defects

Record any defect in the manifest:

```json
{
  "id": "device-001",
  "severity": "medium",
  "status": "open",
  "summary": "Landscape mode hides the final answer control.",
  "releaseBlocking": true
}
```

Allowed severities: `critical`, `high`, `medium`, `low`.

Allowed statuses: `open`, `fixed`, `accepted`.

Open critical/high/medium defects block the P21 technical release gate automatically. `releaseBlocking:true` blocks regardless of severity.

## Closing the gate

After a complete pass:

1. populate at least one device record with all required checks set to `true`;
2. set the manifest top-level `status` to `"passed"`;
3. ensure no release-blocking defect remains open;
4. run `pnpm certify:p21 --regression <regression-json> --p11 <p11-report-json>`;
5. run `pnpm certify:p21:strict ...` only when both the physical-device gate and the independent P11 external-validation gate are genuinely satisfied.

P21 never treats different reviewer labels, emulated devices or automated browser profiles as substitutes for the required real-world evidence.
