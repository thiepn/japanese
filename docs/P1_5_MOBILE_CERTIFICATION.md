# P1.5 Mobile / PWA Certification

P1.5 has two certification layers.

## Automated browser certification

CI must pass the same production build on:

- desktop Chromium;
- a Pixel 7 mobile Chromium device profile;
- a compact 360 × 740 touch viewport;
- two consecutive repetitions per CI run.

The mobile suite checks:

- no horizontal overflow on Today or Study Player;
- bottom navigation remains anchored to the viewport;
- primary mobile navigation targets are at least 44 CSS px high;
- Study Player Exit remains at least 44 CSS px high;
- answer targets remain at least 48 CSS px high;
- the same local-first PWA flow survives offline reload.

## Physical-device release check

Automation cannot certify hardware audio, OS-level PWA installation, safe-area behavior on a physical handset, or interruptions caused by the real operating system. Before calling the P1 release candidate fully device-certified, perform this short manual pass on at least one supported Android phone:

1. Install the production PWA from Chromium.
2. Launch it in standalone mode and confirm Today, Learn, Library and Progress fit without horizontal scrolling.
3. Start a Study Player session and confirm the bottom browser chrome does not cover answer controls.
4. Reach a listening item; confirm Play, Replay, Slower and Shadow ×2 work through the phone speaker and headphones.
5. Cache an audio item, enable airplane mode, reload the PWA and confirm that cached audio still plays.
6. Background the app during study, return, and confirm the current page remains usable.
7. Rotate portrait → landscape → portrait and confirm no controls become unreachable.
8. Increase browser/OS text size and confirm core study actions remain visible and tappable.

Record the phone model, OS version, browser version, install mode, and any defect before closing the gate.


## P21 final-release note

This P1.5 checklist remains the historical Foundation/mobile baseline. The final product now includes substantially more surfaces, microphone workflows and local private-audio behavior.

For final stable-release acceptance, use `docs/P21_DEVICE_ACCEPTANCE.md` and `release/p21-device-acceptance.json`. P21 does not infer that the old P1.5 hardware pass covers the later advanced product.
