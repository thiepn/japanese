# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing, speaking, authentic-input mining and AI coaching all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P22 — Stable Release Activation, Production Monitoring & Maintenance is implemented.**

P22 keeps the P20 learner-capability architecture frozen and adds the operational release layer required after P21:

- an explicit inactive/candidate/active/maintenance production record instead of inferring deployment from CI;
- deploy-time `/release-meta.json` containing the exact stable commit and build timestamp;
- a manual fail-closed stable activation workflow that reruns the complete regression suite and then requires strict P11 + strict P21 qualification for the same commit;
- immutable semantic release tags and refusal to overwrite an existing stable tag;
- a packaged static release artifact containing the exact embedded release identity;
- a Progress deployment-identity panel that shows which build is actually running without treating missing metadata as stable;
- production smoke checks for the app root, manifest, service worker, release metadata, homepage latency and exact commit equality;
- a scheduled six-hour production monitor that stays dormant rather than fabricating evidence while production is inactive;
- a P22 release-state machine separating P21 readiness, source activation, production deployment, runtime health and maintenance state;
- a defect-only maintenance ledger with an explicit P20 capability freeze and narrowly allowed security/privacy/accessibility/dependency/content/reliability/operations change classes;
- normal CI validation of the production manifest, maintenance ledger and P22 status artifacts.

The operational boundary remains strict: green CI does not mean production is active, a GitHub release does not prove deployment, synthetic monitoring is not physical-device evidence, and P22 cannot waive unresolved P11/P21 gates.

The checked-in production state is still intentionally **inactive** because the real P21 physical-device pass and independent P11 external productive-language validation have not yet been admitted. The P22 machinery is ready, but stable activation must remain blocked until those real-world gates are genuinely satisfied.

See `docs/P22_ACCEPTANCE.md`, `docs/P22_MAINTENANCE.md`, `docs/P21_ACCEPTANCE.md`, `docs/P21_DEVICE_ACCEPTANCE.md` and `docs/ROADMAP.md`.

No new language-learning phase should follow P22 by default. After activation, work should stay in the P22 maintenance loop unless real production evidence demonstrates a specific architectural need.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P4_ACCEPTANCE.md`, `docs/P5_ACCEPTANCE.md`, `docs/P6_ACCEPTANCE.md`, `docs/P7_ACCEPTANCE.md`, `docs/P8_ACCEPTANCE.md`, `docs/P9_ACCEPTANCE.md`, `docs/P9_RELEASE_QUALIFICATION.md`, `docs/P10_ACCEPTANCE.md`, `docs/P11_ACCEPTANCE.md`, `docs/P11_1_ACCEPTANCE.md`, `docs/P11_2_ACCEPTANCE.md`, `docs/P11_3_ACCEPTANCE.md`, `docs/P12_ACCEPTANCE.md`, `docs/P13_ACCEPTANCE.md`, `docs/P14_ACCEPTANCE.md`, `docs/P15_ACCEPTANCE.md`, `docs/P16_ACCEPTANCE.md`, `docs/P17_ACCEPTANCE.md`, `docs/P18_ACCEPTANCE.md`, `docs/P19_ACCEPTANCE.md`, `docs/P20_ACCEPTANCE.md`, `docs/P21_ACCEPTANCE.md`, `docs/P21_DEVICE_ACCEPTANCE.md`, `docs/P22_ACCEPTANCE.md`, `docs/P22_MAINTENANCE.md`, `docs/SOURCE_PACK_FORMAT.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
