# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing, speaking, authentic-input mining and AI coaching all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P11.3 — External Review Handoff, Reviewer Workspace & Final Gate Operations is implemented.**

P11 adds the final B2 product/system qualification layer:

- recomputes the full P9 release gate as a hard dependency;
- admits versioned external teacher/tutor/language-professional validation of representative writing and speaking evidence;
- records an explicit offline-only / connected / undecided provider release profile;
- requires passing benchmark history for every connected provider;
- composes release, external-validation, provider and regression evidence into one machine-readable decision;
- generates `OPEN_C1_ROADMAP` only when every gate is green;
- provides a manual strict release-candidate workflow plus non-strict CI evidence generation.

The P9 native-media gap is closed and the provider baseline is explicit. P11.3 now turns the final external-review dependency into a practical offline handoff: the app selects a representative six-artifact writing/speaking packet, exports the immutable JSON evidence plus a self-contained reviewer workspace, and repository intake verifies the returned packet fingerprint. The repository remains intentionally **blocked** at `HOLD_B2_RELEASE_CANDIDATE` until a real external reviewer completes that process.

See `docs/P11_3_ACCEPTANCE.md`, `docs/P11_2_ACCEPTANCE.md`, `docs/P11_1_ACCEPTANCE.md` and `docs/P11_ACCEPTANCE.md`.

The next phase, **P12 — C1 Foundation & Advanced Independent Japanese**, is blocked until a strict P11 run returns `OPEN_C1_ROADMAP`.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P4_ACCEPTANCE.md`, `docs/P5_ACCEPTANCE.md`, `docs/P6_ACCEPTANCE.md`, `docs/P7_ACCEPTANCE.md`, `docs/P8_ACCEPTANCE.md`, `docs/P9_ACCEPTANCE.md`, `docs/P9_RELEASE_QUALIFICATION.md`, `docs/P10_ACCEPTANCE.md`, `docs/P11_ACCEPTANCE.md`, `docs/P11_1_ACCEPTANCE.md`, `docs/P11_2_ACCEPTANCE.md`, `docs/P11_3_ACCEPTANCE.md`, `docs/SOURCE_PACK_FORMAT.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
