# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing, speaking, authentic-input mining and AI coaching all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P10 — B2 Release Operations, Native Corpus Curation & Human Evaluation is implemented.**

P10 adds the operational layer needed to move from feature-complete B2 software toward a genuinely release-qualified system:

- optional human review of B2 writing/speaking artifacts using task fulfillment, meaning/accuracy, coherence and register scores;
- review packets that can be shared with a teacher/tutor;
- human-verified native-media curation with explicit source/license/native-speaker/transcript/register/rate checks;
- candidate export plus repository preview/apply promotion commands;
- CI validation of the native candidate queue;
- a release-operations dashboard showing static P9 gates and local verified-media readiness;
- B2 portfolio schema v2 with human-review summaries.

Human review remains descriptive evidence and does not change mastery automatically. Local media verification does not count toward P9 until promoted into the checked-in release inventory and recertified by CI.

The P9 software implementation is complete. Its release gate is still intentionally blocked whenever the repository lacks enough independently verified reusable native connected audio. P10 provides the workflow to close that gap without weakening the criteria.

See `docs/P10_ACCEPTANCE.md`, `docs/P9_RELEASE_QUALIFICATION.md` and `docs/SOURCE_PACK_FORMAT.md`.

The next phase is **P11 — B2 Release Candidate Qualification, External Validation & C1 Gate Decision**. It remains B2-focused until the P9 release gate is fully green.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P4_ACCEPTANCE.md`, `docs/P5_ACCEPTANCE.md`, `docs/P6_ACCEPTANCE.md`, `docs/P7_ACCEPTANCE.md`, `docs/P8_ACCEPTANCE.md`, `docs/P9_ACCEPTANCE.md`, `docs/P9_RELEASE_QUALIFICATION.md`, `docs/P10_ACCEPTANCE.md`, `docs/SOURCE_PACK_FORMAT.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
