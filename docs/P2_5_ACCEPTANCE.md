# P2.5 — A1 Breadth, Conjugation & Assessment Completion

Status: implementation complete

## Practical A1 breadth

- [x] the canonical lexicon expands from 36 to 145 beginner words
- [x] the grammar graph expands from 15 to 37 canonical concepts
- [x] the controlled sentence bank expands from 22 to 89 linked A1 sentences
- [x] the capability course expands from 8 to 20 ordered Can-do units
- [x] demonstratives and location expressions are covered
- [x] common question words are covered
- [x] basic numbers, yen, clock time and beginner counters are covered
- [x] family, food, shopping, transport, routines and immediate-needs vocabulary are represented
- [x] noun linking with の and complete noun lists with と are represented
- [x] time に, から / まで and means-of-transport で are represented
- [x] polite requests with Noun + をください and Verb-て + ください are represented
- [x] sentence-final ね and よ have distinct beginner pragmatic concepts
- [x] all new public learning content remains canonical, versioned and source-provenanced

## Conjugation model

- [x] inflection class is first-class lexeme metadata
- [x] ichidan and godan verbs are generated from rules rather than copied surface-form records
- [x] する, 来る and ある have explicit irregular handling
- [x] 行く preserves its て / た exception
- [x] polite nonpast, polite negative, polite past and polite past-negative verb forms are generated
- [x] plain negative, plain past and て-form verb forms are generated
- [x] い-adjective negative and past morphology is generated
- [x] いい correctly uses the よ- stem in conjugated forms
- [x] な-adjective predicate forms are generated
- [x] conjugation practice emits lexeme-level form-selection StudyEvents
- [x] unit sessions bound conjugation load instead of expanding every paradigm into every lesson
- [x] conjugation mastery is reported separately in Progress

## Structured course expansion

- [x] units 09–20 extend the existing course graph rather than creating a second curriculum
- [x] each new unit has one explicit Can-do descriptor
- [x] units link canonical vocabulary, grammar, sentences and relevant inflecting lexemes
- [x] vocabulary exposure, grammar work, conjugation and sentence transfer all use the reusable Study Player
- [x] sentence comprehension waits for supporting grammar and vocabulary evidence
- [x] conjugation form selection waits for word-meaning evidence
- [x] soft prerequisite guidance remains advisory rather than a hard content lock
- [x] the adaptive Today queue reuses the same evidence identities

## Delayed unit assessment

- [x] unit assessment is derived from existing course targets rather than a parallel assessment database
- [x] an assessment waits until essential first-pass unit evidence exists
- [x] the unit check unlocks after a 20-hour delay
- [x] assessment answers are explicit `activity:"assessment"` StudyEvents
- [x] assessment events preserve unit ID, Can-do ID and language-activity metadata
- [x] a finite deterministic mix of vocabulary, grammar, conjugation and sentence tasks is sampled
- [x] the unit check has an explicit 75% pass mark
- [x] Learn exposes waiting, ready, in-progress, passed and needs-review assessment states
- [x] checks can be retried or retaken without creating separate mastery truth

## A1 milestone assessment

- [x] the milestone contains 15 tasks
- [x] reading reports independently
- [x] listening reports independently
- [x] spoken interaction reports independently
- [x] spoken production reports independently
- [x] writing reports independently
- [x] each activity currently contributes three tasks
- [x] listening uses real audio-backed prompts rather than text pretending to be listening
- [x] spoken interaction and spoken production are explicitly labelled say-then-type proxies
- [x] P2.5 does not claim pronunciation or free-speech scoring
- [x] milestone results are stored as normal assessment StudyEvents

## Persistence and validation

- [x] inflection classes persist in the canonical local content database
- [x] per-unit conjugation target IDs persist in the canonical local content database
- [x] older databases migrate with additive columns
- [x] content validation resolves conjugation lexeme references
- [x] content package version is v0.4.0 / schema version 5
- [x] course, assessment and conjugation paths remain account-scoped through the existing learner store

## Test coverage

- [x] conjugation tests cover ichidan, godan, irregular verbs, 行く and adjective exceptions
- [x] assessment tests cover delayed unlocking, assessment metadata and five-area milestone composition
- [x] grammar/course tests certify 145 lexemes, 37 grammar concepts, 89 sentences and 20 units
- [x] StudyEvent tests certify explicit assessment activity and metadata
- [x] browser E2E expects the expanded 20-unit course
- [x] legacy audio assertions distinguish audio-backed core vocabulary from new breadth items without fabricated recordings

## Deliberate P2.5 boundaries

P2.5 completes the app's **practical structured beginner breadth**, not every possible A1 lexical item or every Japanese conjugation. The new breadth vocabulary does not fabricate pronunciation recordings or kanji metadata that has not been sourced.

The two spoken milestone areas currently test controlled language selection and production through a **say-then-type proxy**. They do not assess pronunciation, acoustic quality or spontaneous free conversation. Those capabilities require later speech/audio work.

## P2.5 milestone

A learner can move through one 20-unit Foundation → A1 path, acquire substantially broader beginner vocabulary and grammar, generate core conjugated forms from reusable rules, transfer them into controlled sentences, return after a delay for unit-level Can-do checks, and complete a five-area A1 milestone whose evidence remains part of the same learner model.

The next phase is **P3 — Reader, Connected Listening & A1→A2 Immersion Bridge**.
