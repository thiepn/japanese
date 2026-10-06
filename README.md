# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing, speaking, authentic-input mining and AI coaching all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P19 — Prosodic Control, Listening Under Overlap & External C2-Oriented Human Evaluation is implemented.**

P19 keeps the P15–P18 authentic-source, research-quality, precision and interaction stack, then adds evidence that earlier phases intentionally did not fake:

- real browser microphone capture stored in a new private local IndexedDB store rather than the normal sync outbox;
- signal-derived timing evidence from the actual recording: duration, speech activity, within-utterance pause ratio, 300 ms+ pause count, timing phrase count and amplitude dynamic range;
- four prosodic-control targets covering formal chunking, contrastive repair, compressed time-pressure answers and polite floor recovery;
- raw audio remains local-only and can be replayed or deleted without promoting the blob into synced learner state;
- four overlap-listening challenges combine pairs of repository-verified P13 native recordings, including faster primary playback, controlled competing-audio level and delayed masker entry;
- overlap work requires primary-message reconstruction, explicit unresolved uncertainty and a recovery strategy rather than a hidden comprehension score;
- artificial overlap is labeled as an in-browser mix of verified native sources, not a naturally occurring multi-speaker conversation;
- a seven-dimension external C2-oriented reviewer rubric covers lexical precision, grammatical control, discourse organization, interaction repair, register flexibility, prosodic control and listening under pressure;
- dimensions can remain **not observed** rather than forcing invented scores;
- broad review coverage requires 6+ scored dimensions plus direct observation of long-form production, live interaction, actual audio/prosody and listening under pressure;
- reviewer identity and credentials remain learner-entered and unverified; reviewer scores never update FSRS or mastery automatically;
- the portable C1→C2 portfolio advances to schema v6 and carries P19 timing, overlap and external-review evidence without embedding raw local audio.

The evidence boundary remains strict: timing/amplitude analysis is not pitch-accent or intonation scoring, microphone capture alone does not prove pronunciation quality, overlap reconstruction is not automatic comprehension mastery, artificial overlap is not natural conversation, reviewer identity is not verified, and a C2-oriented review is not accredited CEFR C2 certification.

P11 remains an independent release-evidence track and can still report `HOLD_B2_RELEASE_CANDIDATE` until its separate external-review evidence requirement is actually satisfied.

See `docs/P19_ACCEPTANCE.md`, `docs/P18_ACCEPTANCE.md` and `docs/ROADMAP.md`.

The next useful phase should focus on **P20 — Longitudinal C2 Readiness Consolidation, External Calibration & Final Advanced-Learner Qualification**: repeat external review across time, compare independent reviewers, require durable performance across writing/listening/live interaction/audio evidence, surface unresolved weak dimensions, and qualify the product's advanced-learning pathway without turning internal evidence into an accredited language certificate.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P4_ACCEPTANCE.md`, `docs/P5_ACCEPTANCE.md`, `docs/P6_ACCEPTANCE.md`, `docs/P7_ACCEPTANCE.md`, `docs/P8_ACCEPTANCE.md`, `docs/P9_ACCEPTANCE.md`, `docs/P9_RELEASE_QUALIFICATION.md`, `docs/P10_ACCEPTANCE.md`, `docs/P11_ACCEPTANCE.md`, `docs/P11_1_ACCEPTANCE.md`, `docs/P11_2_ACCEPTANCE.md`, `docs/P11_3_ACCEPTANCE.md`, `docs/P12_ACCEPTANCE.md`, `docs/P13_ACCEPTANCE.md`, `docs/P14_ACCEPTANCE.md`, `docs/P15_ACCEPTANCE.md`, `docs/P16_ACCEPTANCE.md`, `docs/P17_ACCEPTANCE.md`, `docs/P18_ACCEPTANCE.md`, `docs/P19_ACCEPTANCE.md`, `docs/SOURCE_PACK_FORMAT.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
