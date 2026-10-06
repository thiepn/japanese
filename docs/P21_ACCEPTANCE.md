# P21 Acceptance — Final Product Consolidation, Real-Device Acceptance & Defect-Only Hardening

## Status

**Implementation complete. Stable-release certification is intentionally gated.**

P21 freezes capability growth at the P20 learning architecture. It does not add another proficiency layer, scheduler, mastery store or major learner-facing subsystem.

The checked-in release state remains **HOLD** until two independent evidence gaps are resolved:

- a real physical-device PWA acceptance pass, bound to the exact release commit, is recorded in `release/p21-device-acceptance.json`;
- the independent P11 external productive-language validation is admitted and qualifies.

Automated browser/device profiles are never allowed to satisfy the physical-device gate.

## Product consolidation

P21 treats P0–P20 as one product rather than a sequence of independent prototypes.

The release surface remains:

- Today
- Learn
- Immerse
- Library
- Progress

P21 adds no sixth primary navigation surface.

The P20 readiness model remains the final advanced-learning qualification layer. P21 only hardens the product that exposes it.

## Accessibility and interaction hardening

Implemented:

- keyboard skip navigation to the main content;
- `aria-current="page"` on the active primary-navigation item;
- visible `:focus-visible` outlines for interactive controls;
- reduced-motion handling for the new skip-link transition;
- 16 px mobile form controls to avoid browser zoom-related interaction disruption;
- long URL/code wrapping so provenance and release evidence cannot force horizontal overflow.

These are defect-hardening changes, not a redesign of the established visual language.

## Automated consolidation evidence

CI still requires:

- TypeScript typecheck;
- unit/integration tests;
- canonical content validation;
- native/provenance audit;
- production build;
- full Playwright suite;
- desktop Chromium profile;
- Pixel 7 Chromium profile;
- compact 360 × 740 touch profile;
- PWA/offline drill;
- P21 keyboard/accessibility smoke;
- private P19 raw-audio boundary test.

After those steps pass, CI writes `artifacts/p21-regression-evidence.json`.

## P21 release-candidate gate

`scripts/p21-release-certify.mjs` combines three independent evidence classes:

1. automated regression evidence;
2. real physical-device acceptance;
3. the existing P11 external release-evidence decision.

The report exposes:

- `technicalReleaseReady`;
- `evidenceReleaseReady`;
- `stableReleaseReady`;
- an explicit release decision;
- every individual check;
- physical-device summary;
- blocking device defects;
- the preserved P11 decision.

Possible hold states are explicit rather than collapsed into one score.

The script is non-strict in normal CI because missing real-world/manual evidence should produce a truthful HOLD report rather than make every code commit fail. `pnpm certify:p21:strict` is the final activation gate and exits non-zero until the stable-release gate is genuinely open.

## Physical-device acceptance

The checked-in manifest `release/p21-device-acceptance.json` is deliberately `pending`.

At least one actual supported Android handset must complete all required checks in standalone PWA mode:

- install/launch;
- five core product surfaces;
- study controls;
- speaker audio;
- headphone audio;
- offline reload;
- background/resume;
- rotation;
- increased text size;
- microphone recording;
- local P19 audio deletion;
- safe-area/bottom-navigation behavior.

See `docs/P21_DEVICE_ACCEPTANCE.md` for the evidence format and procedure.

Open critical, high or medium physical-device defects block the technical release gate unless they are fixed or explicitly moved out of the open state. A defect may also be marked `releaseBlocking:true` regardless of severity.

## Independent P11 boundary

P21 does not rewrite or waive P11.

The current checked-in P11 external-validation manifest still contains no admitted external reviews, so the independent release-evidence gate remains unresolved.

P21 development and automated hardening can complete under the same roadmap override used by P12–P20, but **stable release cannot be marked ready by P21 while the P11 gate remains unqualified**.

## Evidence boundary

P21 does not claim that:

- Playwright mobile emulation is a physical-device test;
- passing automation proves microphone, headphones, safe-area or OS interruption behavior on real hardware;
- a manual device check can be inferred from browser telemetry;
- product release qualification is learner CEFR certification;
- the P20 internal advanced-pathway qualification is an official C2 result;
- P21 can waive external productive-language validation;
- a release HOLD is a learner-performance failure.

## Acceptance checks

- release-script unit tests cover pending device evidence, complete device evidence, device defect blocking and the combined stable-release gate;
- browser tests cover all five primary surfaces, horizontal-overflow protection, semantic active-navigation state and keyboard skip navigation across configured Playwright projects;
- earlier P14–P20 capability tests remain unchanged except where the global phase label moved to P21;
- CI produces P21 release evidence after the complete automated suite.

The next code phase should not add language-learning capability. Once the manual device gate and P11 external-validation gate are satisfied, the appropriate next step is **P22 — Stable Release Activation, Production Monitoring & Maintenance**.
