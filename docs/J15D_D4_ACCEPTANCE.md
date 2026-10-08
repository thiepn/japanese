# J15D-D4 — Visual Regression & Real-Device Qualification

## Fixed baseline and candidate

The verified live J15C candidate at d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a is the immutable visual reference. The Git SHA from PR #31 is the candidate. A mutable main branch is not an acceptable reference during screenshot comparison.

## Automated matrix

The dedicated J15D D4 workflow builds both commits with the same Node/pnpm/Chromium environment and VITE_PUBLIC_BASE=/japanese/. It captures the five learner surfaces (Today, Learn, Immerse, Library, Progress) in both light and dark themes for desktop 1440×900, tablet 834×1112, and Android emulation 390×844. It also captures Study, Reader and technical diagnostics in representative viewports. Screenshots use empty guest sessions, a fixed autumn season, reduced-motion settings and disabled animations/caret, to minimize nondeterminism. The script records a baseline screenshot, candidate screenshot and pixel diff, and fails when significant differences exceed the threshold. Differences beneath threshold still need human review for meaningful design changes.

The comparison produces artifacts/j15d-d4-visual-comparison.json and artifacts/j15d-d4-screenshots, uploaded by .github/workflows/j15d-d4-visual.yml even when comparison fails. The Playwright functional suite additionally checks 320px overflow, tablet/desktop layouts and keyboard navigation. Browser emulation is never physical-device evidence.

## Physical Android PWA

release/j15d-d4-device-acceptance.json intentionally starts with status pending, no devices, and no tested commit. Only real hardware validation of a **deployed exact commit** may authorize a pass. Record model, Android OS version, Chrome/WebView version, installed standalone mode, tested 40-character release SHA, verification timestamp, and non-sensitive evidence for each requiredChecks entry (use {"status":"pass","verifiedAt":"ISO date","evidence":"reviewer note or ticket"}). Test cold launch; all five destinations; Study/Reader/Library; light and dark; offline reload; background/resume; rotation; safe areas; 200% text; keyboard and TalkBack; speaker/headphones; actual microphone and local recording deletion. Never attach personal audio.

Any unresolved blocking device defect prevents acceptance. The existing J14 physical device file remains pending independently.

## Qualification

pnpm test:e2e runs the complete Chromium matrix, including D4 functional tests. pnpm qualify:j15d:d4 writes artifacts/j15d-d4-qualification.json with a pending state when visual/device evidence is missing. Pass --visual artifacts/j15d-d4-visual-comparison.json to include a completed comparison. pnpm qualify:j15d:d4:strict must fail until both visual comparison and exact-commit physical tests pass. Automated CI should never mark the installed Android PWA as tested.

Passing automated D4 permits human review, not J15D merge, stable promotion or D5 release certification.