# P4 — A2 Expansion, Native Audio & Authentic-Input Pipeline

Status: implementation complete

## Structured A2 expansion

- [x] one canonical course graph now continues from A1 into A2
- [x] 274 canonical lexemes
- [x] 66 canonical grammar concepts
- [x] 161 linked canonical sentences
- [x] 32 Can-do descriptors and 32 structured course units
- [x] 16 graded immersion texts
- [x] A2 grammar practice lives on canonical grammar entities rather than a second hard-coded system
- [x] A2 sentences reuse canonical lexeme and grammar identities
- [x] A2 units use the same lessons, StudyPrompts, StudyEvents, mastery projections, FSRS traces and delayed unit-check machinery as earlier phases
- [x] core content package advances to v0.6.0 / schema version 7

## Native audio

- [x] native-audio metadata records license, attribution URL, native-speaker status and external identity
- [x] 108 additional A2 vocabulary recordings were added only after exact-file verification against the pinned Tofugu/WaniKani repository
- [x] existing Tofugu/WaniKani recordings were normalized to explicit CC BY-SA 4.0 metadata
- [x] canonical validation resolves every lexeme audio reference
- [x] canonical validation checks Tofugu/WaniKani license, attribution and native-speaker metadata
- [x] graded readers prefer a recorded audio asset when one is explicitly attached
- [x] device speech synthesis remains a clearly labeled fallback rather than being presented as native audio
- [x] private Tatoeba sentence imports can attach a source recording only when the individual recording declares an admitted reusable license
- [x] missing-license, NC and ND Tatoeba recordings are rejected from the reusable-audio path

## Authentic-input ingestion

- [x] pasted Japanese can be imported
- [x] local TXT and Markdown text files can be imported
- [x] local SRT/VTT subtitle files can be imported
- [x] subtitle numbering, timing metadata and basic markup are removed before analysis
- [x] private imports remain in the account-scoped learner database
- [x] private imports are not inserted into the public canonical Japanese content package
- [x] imported documents have a first-class learner-evidence target distinct from canonical graded texts
- [x] private documents can be deleted locally

## Morphology and difficulty bridge

- [x] authentic text first attempts longest-match resolution against canonical lexeme forms
- [x] shared conjugation generation resolves existing core inflections
- [x] additional A2 surface patterns support common forms used by P4 content
- [x] unresolved spans use the browser Japanese word segmenter when available
- [x] function words and punctuation are separated from lexical unknown-density estimates
- [x] analysis reports known lexical-token ratio
- [x] analysis reports unique unresolved forms
- [x] analysis labels a text comfortable / stretch / hard from lexical coverage
- [x] the UI explicitly treats this as an estimate rather than a CEFR score
- [x] the implementation does not claim perfect general-purpose Japanese morphological parsing

## Mining and unified learner state

- [x] known canonical words can be mined from imported text
- [x] unresolved forms can be saved only after the learner supplies a private meaning
- [x] an optional reading can be attached to a private mined word
- [x] private vocabulary is deduplicated by normalized written form
- [x] one private vocabulary identity can retain multiple source-document references
- [x] private mined vocabulary produces normal StudyEvents
- [x] private mined vocabulary generates meaning, optional reading and active-use StudyPrompts
- [x] private vocabulary enters the normal Today queue
- [x] private vocabulary participates in normal learner projections and FSRS scheduling
- [x] no separate reader SRS or authoritative known-word database was introduced

## Authentic reading and listening

- [x] imported text is shown with known/unresolved lexical highlighting
- [x] canonical words expose their existing reading and meaning
- [x] unresolved words can be defined and mined without mutating public content
- [x] reusable native recording playback is preferred when an imported source supplies one
- [x] slower native playback is supported
- [x] Japanese device speech synthesis remains available as fallback
- [x] native-audio credit and license are shown in the imported-text reader
- [x] reading and listening exposures emit the same StudyEvent model as the rest of the app
- [x] learner self-check evidence can be recorded for private reading comprehension

## Persistence, validation and tests

- [x] IndexedDB migration adds account-scoped private-document and private-vocabulary stores
- [x] local persistence tests cover private data isolation, save and delete
- [x] authentic-input tests cover Japanese segmentation, A2 inflection matching, subtitle cleanup and audio-license admission
- [x] vocabulary/audio/course/reader tests were advanced to P4 totals
- [x] browser certification covers the expanded A1→A2 course and authentic-input entry point
- [x] content validation covers native-audio and reading-text audio references

## Deliberate P4 boundaries

P4 provides a practical authentic-input bridge, not a linguistically complete Japanese NLP stack. Analysis currently combines the app's canonical lexicon, generated inflections, a bounded set of A2 surface rules and the browser's Japanese word segmentation. It can estimate lexical coverage and support mining, but it does not promise dictionary-grade lemmatization, sense disambiguation or complete compound analysis.

The public core does not bundle arbitrary sentence/passage recordings merely to satisfy a native-audio target. Curated text playback uses recorded audio only when a source-provenanced asset has actually been attached. Otherwise the UI says that device speech synthesis is a fallback. Tatoeba audio is admitted per recording only when the recording supplies a reusable license; text and audio licensing are kept separate.

Common Voice was evaluated but is not mirrored into this repository. Its dataset distribution remains external rather than being copied into the app.

Unknown forms from private imports do not automatically become public Japanese knowledge. The learner must provide a private meaning before such an item can enter personal review. This avoids fabricating dictionary data while keeping learner-owned material usable.

## P4 milestone

A learner can continue a single structured course through A2, hear substantially broader native vocabulary audio, move into longer graded material, import learner-owned Japanese text or subtitles, estimate lexical difficulty, inspect known and unresolved forms, mine useful vocabulary into the same Today/FSRS system, and use a license-aware route for real sentence audio without creating a parallel learning platform.

The next phase is **P5 — B1 Expansion, Productive Language & Adaptive Immersion**.
