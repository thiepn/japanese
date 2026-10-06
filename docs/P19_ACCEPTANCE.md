# P19 Acceptance — Prosodic Control, Listening Under Overlap & External C2-Oriented Human Evaluation

## Status

**Implementation complete.**

P19 adds evidence the previous phases deliberately did not fake: real local microphone audio, timing/amplitude analysis of that actual signal, demanding overlap listening built from verified native recordings, and an external C2-oriented human-review protocol.

It still does **not** claim a general acoustic pronunciation score or accredited CEFR C2 result.

## Implemented

### Real local audio and prosodic-control practice

- Four advanced speaking targets:
  - formal phrase chunking;
  - contrastive repair;
  - compressed time-pressure answer;
  - polite floor recovery.
- Browser microphone capture uses the actual recorded audio signal.
- Raw audio is stored in a new **private IndexedDB store** and is not written into the normal sync outbox.
- The synced StudyEvent stores only bounded evidence metadata and learner reflection.
- Real signal analysis measures:
  - duration;
  - active-speech ratio;
  - within-utterance pause ratio;
  - 300 ms+ pause count;
  - timing phrase count;
  - amplitude dynamic range.
- The analyzer does **not** claim:
  - pitch-accent correctness;
  - intonation correctness;
  - phoneme accuracy;
  - pronunciation mastery.
- Local audio can be replayed and explicitly deleted without deleting the already-recorded evidence metadata.

### Listening under overlap

- Four overlap challenges combine pairs of repository-verified P13 native recordings.
- Primary playback can run up to 1.15× source rate.
- A separately verified native recording is introduced as a lower-volume competing stream after a defined delay.
- The learner must record:
  - primary-message reconstruction;
  - unresolved uncertainty;
  - recovery strategy.
- The mix is explicitly identified as **artificial overlap of verified native sources**. It is not represented as a naturally occurring two-speaker conversation.
- Listening artifacts remain structural/advisory evidence and do not become automatic comprehension mastery.

### External C2-oriented human evaluation

- Reviewer packet export summarizes relevant P17–P19 evidence and provides a seven-dimension rubric:
  - lexical precision;
  - grammatical control;
  - discourse organization;
  - interaction repair;
  - register flexibility;
  - prosodic control;
  - listening under pressure.
- Each dimension is 0–5 or **not observed**.
- At least four dimensions must be directly scored.
- Broad evidence coverage requires:
  - 6+ scored dimensions;
  - long-form production observed;
  - live interaction observed;
  - actual audio/prosody observed;
  - overlap/listening-under-pressure evidence observed.
- Reviewer comments require observed strengths, priority improvements and concrete evidence notes.
- Reviewer identity/credentials are learner-entered and are **not independently verified by the app**.
- Human review never silently updates FSRS or mastery and is not an accredited CEFR C2 result.

### Portfolio

The portable C1→C2 portfolio advances to **schema v6 / P19** and includes:
- prosody timing evidence;
- local-audio availability count without embedding raw audio;
- overlap-listening attempts;
- external C2-oriented human-review records;
- broad-review coverage count;
- explicit evidence-boundary flags.

## Evidence boundary

P19 does **not** claim that:
- amplitude/timing features are pitch-accent or intonation scores;
- microphone recording alone proves pronunciation quality;
- artificial overlap equals natural multi-speaker conversation;
- overlap reconstruction proves comprehension mastery without human semantic review;
- local raw audio syncs to the account;
- reviewer identity or qualifications are verified;
- a C2-oriented reviewer rubric is an accredited CEFR C2 certificate;
- reviewer scores change durable learner mastery automatically.

P11 remains an independent release-evidence track.

## Acceptance checks

- Unit tests cover real timing-envelope analysis, verified native overlap sources, broad-vs-partial external-review coverage and event-derived P19 progress.
- Browser tests cover all three P19 workspaces and the P19 portfolio surface without requiring microphone permission in CI.
- Earlier P14–P18 browser regressions remain scoped to the features introduced by those phases.
- CI continues to require typecheck, unit tests, content validation, native/provenance audits, production build and multi-device Playwright.
