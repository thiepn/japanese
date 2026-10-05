# P13 — C1 Native-Source Depth, Multi-Source Synthesis & Spontaneous Interaction

Status: implementation complete.

## Purpose

P13 deepens the P12 C1 foundation in three directions that cannot be achieved by adding more isolated grammar:

1. source-provenanced native listening across real speakers, registers and source conditions;
2. multi-source synthesis that forces comparison, qualification and integration;
3. spontaneous spoken interaction in which later challenges remain hidden until the current turn is completed.

P13 continues the explicit roadmap override introduced for P12. It does not alter or fabricate the independently held P11 external-review evidence.

## Native-source depth

P13 reuses the eight provenance-audited native connected-speech sources already admitted by P11.2.

No new recording is silently declared native.

The P13 source layer imports the existing registry as the source of truth for:

- source identity;
- media URL;
- duration;
- speaker label;
- credit;
- license;
- attribution;
- register;
- relative natural/stretch speech-rate condition.

The current source set provides:

- eight connected recordings;
- five represented native speakers;
- formal and polite registers;
- natural and relative fast/stretch conditions;
- long-form press-conference and prepared-address material.

P13 does not reinterpret the relative speech-rate label as an acoustic words-per-minute measurement.

## Multi-source synthesis missions

P13 adds four advanced source missions:

1. **Policy priorities across administrations**
   - two policy addresses;
   - stance and implication;
   - evidence versus interpretation.

2. **Prepared address vs live press conference**
   - formal prepared speech versus press-conference material;
   - register, pacing and genre effects;
   - explicit limits on what genre comparison proves.

3. **Crisis communication across speakers**
   - three speakers;
   - responsibility, uncertainty and next actions;
   - common patterns, contrasts and unresolved points.

4. **Press-conference comparison under stretch conditions**
   - three relative stretch-condition sources;
   - compressed note taking;
   - stance/evidence integration without transcript-first dependence.

Every mission requires at least two independently identified sources.

Learner notes and final synthesis are stored as normal StudyEvents with:

- semantic grading disabled;
- model feedback excluded from mastery;
- exact source IDs retained;
- C1/P13 metadata retained.

An unreviewed synthesis is evidence that the task was attempted, not proof of semantic comprehension mastery.

## C1 native synthesis workspace

The Immerse surface now contains a dedicated P13 workspace.

The learner can:

- select a mission;
- open every provenance-audited recording;
- see speaker, register, source condition, credit and license;
- take per-source notes;
- see the discourse moves required by the mission;
- write one cross-source synthesis;
- save the work as advisory listening evidence.

The app deliberately does not copy or fabricate source transcripts where the audited registry does not provide one.

## Spontaneous interaction

P13 adds four multi-stage C1 interaction scenarios:

- research panel;
- public hearing;
- executive briefing;
- difficult media interview.

Each scenario contains four stages.

Stages are revealed one at a time so the learner cannot script the whole exchange before beginning.

The sequence includes:

- opening position;
- unexpected challenge or objection;
- changed constraint, counterevidence or misreading;
- repair/reframing;
- qualified close or decision record.

Turn targets range from roughly 25–60 seconds.

## Spontaneous speaking evidence

The browser can use Japanese speech recognition when supported.

The learner can also enter/edit the transcript after speaking when recognition is unavailable.

Every saved turn records:

- scenario and stage identity;
- response time;
- learner transcript;
- whether preparation notes were used;
- whether self-repair/rephrasing occurred;
- target discourse moves;
- target response duration.

The evidence boundary is explicit:

- recognition transcript is not acoustic pronunciation scoring;
- self-repair is learner-reported interaction evidence;
- response timing is descriptive;
- no unreviewed turn creates semantic or CEFR mastery;
- provider/AI feedback remains separate from durable learner truth.

## Interaction domains

The scenario set targets different C1 pressures.

### Research

- cautious inference;
- correlation vs causality;
- counterevidence;
- qualified conclusion.

### Public policy

- accessible formal register;
- distributional objection;
- concession;
- implementation and consensus.

### Workplace/executive

- concise briefing;
- interruption;
- new budget/staff constraints;
- accountability and reevaluation trigger.

### Media

- false binary repair;
- evidence compression;
- uncertainty under pressure;
- explicit threshold for changing position.

## P12/P13 architecture continuity

P13 does not create another learner model.

It continues to use:

- StudyEvents;
- the same development/account identity;
- existing local IndexedDB persistence;
- the same provenance boundaries;
- the same canonical C1 content graph;
- the existing Immerse surface.

P13 native-source work is intentionally adjacent to the existing P9 listening-depth lab rather than replacing it:

- P9 remains the B2/release evidence layer;
- P13 uses the already-audited sources for harder C1 learning tasks.

## Release-evidence boundary

P11 remains independent.

P13 may proceed while P11 still reports `HOLD_B2_RELEASE_CANDIDATE`, but P13 must not:

- fabricate an external reviewer;
- convert P13 speaking into external validation;
- convert source work into release qualification;
- rewrite P11 manifests to make the gate appear green.

## Acceptance

P13 is complete when:

- all eight audited native sources are available to the C1 layer;
- at least four multi-source missions exist;
- every mission uses at least two audited sources;
- source provenance/license/register/rate metadata remains visible;
- multi-source synthesis persists as non-mastery evidence;
- at least four multi-stage spontaneous scenarios exist;
- each scenario contains hidden follow-up progression;
- response timing, preparation status and self-repair can be recorded;
- speech-recognition output remains explicitly non-acoustic;
- unit, content-validation, build and browser E2E suites remain green.

## Later direction

Later C1 phases should deepen:

- broader genres beyond official/political speech;
- more speakers and less predictable conversational registers;
- longer multi-document reading/listening synthesis;
- source evaluation and citation discipline;
- spontaneous turn-taking with live AI/provider opposition;
- advanced writing revision over several sessions;
- domain-specific C1 tracks.

Those later phases should add real breadth, not simply increase counts of isolated grammar patterns.
