# P15 — Authentic C1 Environment, Source Evaluation, Multi-Day Writing & Live Defense

Status: implementation complete.

## Purpose

P12 established advanced C1 language resources, P13 added native-source depth and multi-source synthesis, and P14 connected those capabilities across days and domains.

P15 moves the learner beyond a course-authored C1 simulation into an **actual Japanese working environment**.

The central design change is:

> advanced Japanese should increasingly be used to investigate, evaluate, argue from, defend and revise work built from real Japanese sources rather than only complete internally authored exercises.

P15 therefore adds a source-driven research and production workspace while preserving the existing learner-state and evidence boundaries.

## Real Japanese source environment

P15 provides curated entry points to 12 Japanese-language source portals spanning:

- government white papers;
- official statistics;
- research press releases;
- Japanese academic articles;
- policy research;
- legislative research briefs;
- statutory law;
- institutional speeches and press communication;
- digital-government policy;
- population research and projections.

The configured portals include:

- Ministry of the Environment white papers;
- MEXT white papers;
- METI white papers and reports;
- e-Stat;
- RIKEN research releases;
- J-STAGE;
- RIETI;
- National Diet Library Issue Briefs;
- e-Gov laws;
- Bank of Japan speeches / press material;
- Digital Agency policy pages;
- IPSS population materials.

P15 stores portal metadata and links only.

It does **not** copy arbitrary third-party articles, laws, papers or reports into the canonical Japanese corpus.

## Exact-source registration

Opening a portal is not counted as study evidence.

The learner must register the exact source actually used:

- source title;
- exact HTTPS URL;
- selected source portal;
- working domain.

The URL is host-validated against the selected portal.

For example, selecting the Environment Ministry portal accepts an HTTPS URL on `env.go.jp` or its subdomains and rejects lookalike hosts.

A registered source retains:

- publisher/institution;
- genre;
- source role;
- domain;
- URL;
- registration timestamp.

## Source roles

P15 distinguishes source role from topic.

Current roles are:

- `primary_data`;
- `primary_law`;
- `institutional_position`;
- `research`;
- `analysis`.

This helps the learner avoid treating every Japanese page as interchangeable evidence.

An institutional white paper can be useful while still being an institutional source.

A press release can accurately summarize research while still not being the research paper itself.

A statute can establish statutory wording while not automatically establishing judicial interpretation or enforcement practice.

## Source evaluation

A source cannot enter a P15 long-form project merely because it was registered.

The learner must record:

1. **central claim** — what the source actually says or reports;
2. **evidence basis** — what supports that claim;
3. **limitation** — what the source does not establish;
4. **purpose / rhetorical role** — who is communicating to whom and for what purpose;
5. **confidence** — low, medium or high confidence in using the source for the intended role.

Minimum response lengths prevent one-word placeholder completion.

Source evaluation is saved as an ungraded StudyEvent.

It is learner critical-reading evidence, **not independent verification of the source**.

## Specialist vocabulary from real sources

P15 adds source-grounded specialist term mining.

A term records:

- Japanese form;
- optional reading;
- learner working definition;
- source context;
- source identity;
- domain.

The term is saved into the existing private-vocabulary system.

Therefore specialist vocabulary immediately participates in the existing review path rather than creating:

- another SRS;
- another vocabulary database;
- an automatic public lexicon mutation.

If the same private vocabulary item already exists, its existing identity is preserved and the new source reference is merged.

## Five multi-day C1 writing projects

P15 adds five research-driven writing projects:

1. **Evidence review: what can actually be concluded?**
2. **Policy memo: recommendation under real constraints**
3. **Science explainer: result, mechanism and uncertainty**
4. **Institutional analysis: compare what different actors say**
5. **Cross-domain dossier: transfer a framework without forcing it**

These are not single-session composition prompts.

Each project imposes:

- minimum evaluated-source count;
- source-genre diversity;
- publisher/institution diversity;
- a working thesis;
- explicit source traceability;
- a substantial first draft;
- multiple unpredictable defense turns;
- at least 20 hours before revision;
- a materially changed delayed revision;
- final reflection.

## Source-map contract

Before the first draft, the learner freezes a source map.

The source map requires evaluated sources and assigns stable keys:

- `[S1]`
- `[S2]`
- `[S3]`
- etc.

The draft and delayed revision must reference every mapped source at least once.

The markers are a traceability mechanism, not a claim of APA, MLA, Chicago or another formal academic citation style.

After the first draft, the source map is locked so source identity cannot silently drift underneath existing citation keys.

## Source diversity

Different projects require different levels of source diversity.

At minimum, every project requires:

- 3 or more evaluated sources;
- 2 or more source genres;
- 2 or more publishers/institutions.

The stricter projects require up to:

- 4 sources;
- 4 genres;
- 3 publishers/institutions.

This prevents a nominal “multi-source” project from using several pages that all serve the same evidential function.

## First draft

The writing projects require substantial Japanese output rather than short structural prompts.

Current minimums range from approximately:

- 750–1,050 characters for the first draft;
- 900–1,200 characters for the delayed revision.

The learner must include every source-map citation key.

The system does not claim that length or citation-marker presence establishes semantic quality.

## Unpredictable live defense

After the first draft, the learner must defend the argument before revision.

P15 includes 16 hidden pressure types:

- causal overclaim;
- source credibility;
- conflicting evidence;
- counterexample;
- definition shift;
- stakeholder objection;
- legal constraint;
- implementation constraint;
- numerical inconsistency;
- uncertainty;
- audience shift;
- register shift;
- ethical trade-off;
- time pressure;
- scope narrowing;
- direct rebuttal.

The specific challenge is not shown until the learner chooses **Draw hidden pressure**.

This prevents the learner from prewriting a response to a known objection.

## Source-aware pressure

Some pressure types explicitly attach to one of the project's source-map items.

Examples include:

- source credibility;
- conflicting evidence;
- legal constraint;
- numerical inconsistency;
- scope narrowing.

The learner must select the source being challenged and respond to that source context.

## Defense diversity

A project currently requires at least two defense responses.

The two required responses must use different pressure types.

Repeating the same objection twice does not satisfy the defense stage.

Only defense evidence recorded after the latest first draft counts toward that draft's progression.

## Speaking boundary

The defense workspace supports:

- Japanese browser speech recognition when available;
- typed response fallback.

Speech recognition saves transcript evidence.

It does not create:

- acoustic pronunciation scoring;
- prosody scoring;
- native-likeness scoring.

Typed response is explicitly a typed speaking-task proxy.

Neither route receives a hidden semantic mastery score.

## Delayed revision

Once the required distinct defense turns exist, the project still cannot be revised immediately.

The revision unlocks at least **20 hours after the latest first draft**.

This separates:

- same-session editing;
from
- delayed reconstruction after the original argument has cooled.

The delayed revision must:

- meet its project minimum length;
- preserve all required source traceability markers;
- differ from the original draft.

The system records the revision delay.

## Temporal integrity

P15 protects project chronology.

When a new first draft becomes the active draft:

- older defense turns do not satisfy it;
- older revisions do not satisfy it;
- older reflections do not satisfy it.

A reflection only belongs to a revision that precedes it.

This prevents stale evidence from making a newly restarted project appear complete.

## Reflection

The final stage asks the learner to identify:

- which source changed the argument;
- which pressure challenge changed the argument;
- how delayed rereading changed the argument;
- what uncertainty remains.

The reflection requires at least 120 characters.

It remains ungraded metacognitive evidence.

## Product surfaces

### Immerse

P15 is placed near the top of Immerse as the advanced working environment.

It has three tabs:

- **Source desk**
- **Writing studio**
- **Live defense**

### Source desk

The Source desk provides:

- 12 curated Japanese source portals;
- external portal links;
- exact-source registration;
- source-role metadata;
- claim/evidence/limitation/purpose evaluation;
- specialist vocabulary mining.

### Writing studio

The Writing studio provides:

- five multi-day projects;
- evaluated-source selection;
- source/genre/publisher coverage;
- frozen source map;
- citation-key insertion;
- long first-draft editor;
- defense stage;
- revision unlock timing;
- delayed-revision editor;
- final reflection.

### Live defense

The Live defense workspace provides:

- hidden randomized challenge;
- 16 pressure types;
- source-aware challenges;
- microphone transcription when available;
- typed fallback;
- distinct-pressure tracking.

### Progress

The C1 portfolio now includes a P15 authentic-environment section covering:

- sources;
- evaluated sources;
- genres;
- publishers;
- specialist terms;
- environment active days;
- projects;
- defense turns;
- pressure-type diversity.

## C1 portfolio schema v2

The C1 portfolio export is upgraded to:

`thiepn-japanese-c1-portfolio`

Schema version:

`2`

Phase:

`P15`

The export now includes the P15 environment alongside P14/P13 longitudinal evidence.

Its evidence-boundary metadata explicitly states that:

- learner source evaluation is not independent source verification;
- typed defense is not acoustic evidence;
- speech-recognition transcripts are not acoustic scores;
- AI feedback does not alter mastery;
- internal reliability is not external certification.

## Architecture

P15 deliberately avoids another learning silo.

It reuses:

- StudyEvents;
- existing local account scope;
- existing private vocabulary;
- existing Progress/portfolio surface;
- existing P12–P14 C1 learner path.

P15 introduces no:

- second scheduler;
- second mastery database;
- automatic third-party content ingestion;
- fabricated source text;
- hidden model score;
- CEFR certification authority.

## Copyright and source boundary

P15 treats public web material as external source material.

The app stores:

- source identity;
- URL;
- publisher;
- learner-authored evaluation;
- learner-authored vocabulary notes;
- learner-authored drafts;
- learner-authored defense transcripts.

It does not automatically copy the external document body into the canonical public seed.

A learner can still use the existing private authentic-input import path for material they are permitted to import.

## P11 boundary

P15 does not change the independent P11 release-candidate evidence state.

Specifically, P15 source work must not be counted as:

- external teacher review;
- accredited CEFR evidence;
- P11 productive-language validation;
- independent fact verification.

The ongoing C1 roadmap override remains separate from the held release-evidence gate.

## Acceptance criteria

P15 is complete when:

- at least 12 real Japanese source portals are available;
- portal URLs are HTTPS and host validated;
- exact learner-used sources can be registered;
- source role and genre are preserved;
- source evaluation requires claim, evidence, limitation and purpose;
- evaluated sources are required before project use;
- specialist vocabulary enters the existing private review path;
- five multi-day projects exist;
- projects require source, genre and publisher diversity;
- source-map citation keys are stable;
- first drafts require all mapped source keys;
- at least 16 unpredictable pressure challenges exist;
- project defense requires different pressure types;
- stale pre-draft defenses cannot satisfy a later draft;
- delayed revision requires at least 20 hours;
- revisions preserve source traceability and differ from the first draft;
- reflection is required before completion;
- Progress and C1 export expose P15 evidence;
- evidence boundaries remain explicit;
- unit tests, typecheck, content validation, build and browser E2E are green.

## Later direction

P15 establishes the actual C1 working environment.

Later phases should improve quality rather than add another progress abstraction. High-value directions include:

- real source-reading ingestion through the existing private-document path where licensing allows;
- structured bibliography metadata and optional formal citation styles;
- human review of selected long-form C1 projects;
- richer specialist tracks based on the learner's actual interests;
- more natural live voice interaction when a suitable speech stack exists;
- longitudinal source-refresh tasks using newly published Japanese material;
- C1/C2 bridge work focused on stylistic precision, specialist discourse and sustained argument rather than more beginner-style lessons.
