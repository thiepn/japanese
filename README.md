# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing, speaking, authentic-input mining and AI coaching all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P21 — Final Product Consolidation, Real-Device Acceptance & Defect-Only Hardening is implemented.**

P21 freezes learning-capability growth at the P20 architecture and treats the complete Foundation→C2-oriented path as one release candidate:

- no new primary surface, mastery model, scheduler or proficiency layer;
- keyboard skip navigation, semantic active-navigation state, visible focus indicators and mobile form-size hardening;
- full-product Playwright consolidation across desktop Chromium, Pixel 7 and compact 360×740 touch profiles;
- explicit horizontal-overflow and navigation-semantic regression coverage across Today, Learn, Immerse, Library and Progress;
- the existing PWA/offline, native/provenance, private-audio and release-evidence suites remain part of the same CI gate;
- a new `scripts/p21-release-certify.mjs` combines automated regression evidence, physical-device acceptance and the independent P11 release-evidence decision;
- a checked-in physical-device manifest remains intentionally `pending` until a real standalone Android PWA pass is recorded;
- automated mobile emulation cannot satisfy the physical-device gate;
- open critical/high/medium device defects block technical release readiness;
- `pnpm certify:p21` produces a truthful HOLD/READY report without failing normal CI when manual evidence is absent;
- `pnpm certify:p21:strict` is the final stable-release activation gate;
- P21 preserves the unresolved P11 external-validation boundary rather than silently waiving it.

The current repository can therefore be **automatically hardened and regression-clean while still correctly reporting that stable release is not yet fully certified**. Stable release requires both a real physical-device acceptance pass and the separate P11 external productive-language validation.

See `docs/P21_ACCEPTANCE.md`, `docs/P21_DEVICE_ACCEPTANCE.md`, `docs/P20_ACCEPTANCE.md` and `docs/ROADMAP.md`.

No further language-learning capability phase should be added by default. Once the real-device and P11 gates are genuinely satisfied, the appropriate next phase is **P22 — Stable Release Activation, Production Monitoring & Maintenance**.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P4_ACCEPTANCE.md`, `docs/P5_ACCEPTANCE.md`, `docs/P6_ACCEPTANCE.md`, `docs/P7_ACCEPTANCE.md`, `docs/P8_ACCEPTANCE.md`, `docs/P9_ACCEPTANCE.md`, `docs/P9_RELEASE_QUALIFICATION.md`, `docs/P10_ACCEPTANCE.md`, `docs/P11_ACCEPTANCE.md`, `docs/P11_1_ACCEPTANCE.md`, `docs/P11_2_ACCEPTANCE.md`, `docs/P11_3_ACCEPTANCE.md`, `docs/P12_ACCEPTANCE.md`, `docs/P13_ACCEPTANCE.md`, `docs/P14_ACCEPTANCE.md`, `docs/P15_ACCEPTANCE.md`, `docs/P16_ACCEPTANCE.md`, `docs/P17_ACCEPTANCE.md`, `docs/P18_ACCEPTANCE.md`, `docs/P19_ACCEPTANCE.md`, `docs/P20_ACCEPTANCE.md`, `docs/P21_ACCEPTANCE.md`, `docs/P21_DEVICE_ACCEPTANCE.md`, `docs/SOURCE_PACK_FORMAT.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
