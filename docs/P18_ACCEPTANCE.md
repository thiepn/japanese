# P18 Acceptance — Advanced Native Interaction, Real-Time Repair & C2-Style Discourse Pressure

## Status

**Implementation complete.**

P18 extends the P17 precision bridge into live interaction. It deliberately distinguishes three evidence classes that must not be collapsed:

1. simulated native-style discourse pressure;
2. AI-interlocutor conversation;
3. actual human-partner interaction logged by the learner.

None of these automatically becomes accredited C2 evidence or durable mastery.

## Implemented

### Hidden live-pressure simulator

- Twelve pressure moves remain hidden until the learner commits a Japanese position.
- Pressure types:
  - interruption;
  - clarification demand;
  - reformulation;
  - implicature challenge;
  - register pivot;
  - conflicting evidence;
  - stance narrowing;
  - time pressure;
  - cross-domain transfer;
  - floor recovery;
  - precision/hedging challenge;
  - synthesis after disagreement.
- Pressure moves span five families: floor control, repair, stance/evidence, audience/register, transfer/synthesis.
- After a pressure response is saved, the repaired response becomes the next committed position, producing a continuous interaction chain rather than isolated prompts.
- Browser speech recognition can capture Japanese responses where supported.
- Typed responses remain explicitly labeled as a speaking proxy.
- Response latency is stored descriptively and is never converted into a fluency score.
- A complete simulated session requires at least four turns across four pressure types.
- Robust pressure coverage requires at least six pressure types across four or more pressure families.

### Advanced AI conversation

The existing C1 AI-coach path is upgraded for P18 while preserving its advisory evidence contract.

New hidden-future scenario chains cover:
- hostile committee interruption and floor recovery;
- specialist roundtable discussion with terminology/evidence/audience shifts;
- cross-domain expert transfer with counterexample repair.

C1 AI-coach events are tagged as P18 advanced-interaction evidence. The AI interlocutor remains explicitly a simulation, not a native speaker.

### Actual human interaction

A separate real-partner log records:
- medium;
- learner-reported partner Japanese profile;
- duration;
- domain/situation;
- interaction summary;
- hardest live moment;
- repair/adaptation used;
- post-session reflection.

No partner name is required. Partner profile is learner-reported and not independently verified.

### Cross-domain specialist transfer

P18 consumes P16 specialist tracks and requires the learner to:
- state a portable principle;
- apply it to an unexpected target domain;
- adapt rather than copy it mechanically;
- state an explicit boundary condition.

This is discourse-transfer evidence, not verification of subject-matter expertise.

### Portfolio

The C1→C2 portfolio advances to **schema v5 / P18** and carries:
- live pressure turns;
- pressure-type coverage;
- complete and robust simulated sessions;
- advanced AI pressure turns;
- actual human-interaction logs and minutes;
- cross-domain transfer attempts.

## Evidence boundary

P18 does **not** claim that:
- simulated native-style pressure is a native-speaker interaction;
- AI dialogue is human/native evidence;
- browser speech recognition provides acoustic pronunciation scoring;
- response latency is a fluency score;
- learner-reported partner profile is independently verified;
- a logged human interaction automatically changes FSRS or mastery;
- cross-domain discourse transfer proves subject-matter expertise;
- complete or robust pressure coverage is accredited CEFR C2 certification.

P11 release qualification remains independent and unchanged.

## Acceptance checks

- Unit coverage verifies all 12 pressure types, the five pressure families, non-repeating pressure draws, complete/robust session rules and event-derived P18 evidence.
- Browser coverage verifies the P18 Immerse workspace, separation of human interaction from simulation, cross-domain prerequisites, P18 portfolio and three new advanced AI scenario chains.
- P14–P17 regressions remain scoped to the capabilities introduced by those phases.
- Portable JSON/Markdown exports include P18 evidence and explicit evidence-boundary flags.
