# P2 — Grammar, Sentence Knowledge & Structured A1 Course

Status: core implementation complete

## Canonical grammar

- [x] grammar is represented as canonical content rather than lesson-owned prose
- [x] each grammar concept has a stable ID
- [x] each grammar concept records a concise summary and deeper mental model
- [x] formation patterns are explicit
- [x] usage purposes are explicit
- [x] prerequisite relationships are explicit
- [x] contrast relationships are explicit
- [x] level and register metadata are explicit
- [x] grammar content carries source provenance
- [x] grammar records persist in the local canonical content database
- [x] grammar is searchable by label, formation, function and English explanation

## Sentence knowledge

- [x] sentences are first-class canonical entities
- [x] each sentence has Japanese text, normalized text, reading and translation
- [x] sentence tokens can point back to lexemes or grammar concepts
- [x] sentence-level grammar links are explicit
- [x] level, register and tags are stored
- [x] sentence content carries source provenance
- [x] sentences persist in the local canonical content database
- [x] sentences are searchable by Japanese text, reading and English translation
- [x] sentence/entity links are checked by content validation

## Learner evidence

- [x] grammar comprehension uses a distinct learner dimension
- [x] contextual grammar form selection uses a distinct learner dimension
- [x] sentence comprehension uses a distinct learner dimension
- [x] sentence production uses a distinct learner dimension
- [x] StudyEvents remain the only authoritative learning evidence
- [x] FSRS memory traces use the same entity/dimension/cue-family identities
- [x] course study does not create an independent mastery store
- [x] sentence production does not automatically inherit comprehension mastery
- [x] answer-position ordering is not fixed to the correct choice

## Structured A1 course

- [x] capability goals are represented separately as Can-do descriptors
- [x] eight ordered A1 core units are represented as canonical course entities
- [x] course units link to their supporting grammar, sentences and vocabulary
- [x] course units can depend on earlier units
- [x] prerequisites are soft guidance rather than hard content locks
- [x] Learn shows Ready / Learning / Mastered / Challenging state
- [x] course status is derived from actual learner evidence
- [x] completing a lesson does not mark its content mastered
- [x] each unit runs through the reusable Study Player
- [x] unit sessions combine explanation, retrieval, contextual form work and sentence comprehension
- [x] controlled sentence production is introduced after comprehension
- [x] pending sentence production can re-enter adaptive study later

## Unified Today queue

- [x] existing due reviews still take priority
- [x] review-debt protection remains active
- [x] grammar/course items enter the same queue rather than a separate daily mode
- [x] initial grammar introduction waits until some vocabulary has actually been encountered
- [x] grammar form work waits for grammar-comprehension evidence
- [x] sentence comprehension waits for supporting grammar evidence
- [x] sentence production waits for sentence-comprehension evidence
- [x] the course cannot flood a session with unlimited new items

## Content package v0.3.0

- [x] 36 source-provenanced starter lexemes
- [x] 15 canonical A1 grammar concepts
- [x] 22 linked A1 sentences
- [x] 8 Can-do descriptors
- [x] 8 capability-centered course units
- [x] ある / いる exist as canonical lexemes rather than dangling sentence references
- [x] pronunciation audio remains source-version pinned
- [x] all public entities retain provenance
- [x] validator checks course graph, grammar dependencies and sentence references

## UX and certification

- [x] Foundation and A1 appear as one Learn path
- [x] course cards expose capability goal, status, mastery and evidence
- [x] Challenging units remain manually accessible
- [x] Progress separately reports kana, vocabulary, grammar and sentence mastery
- [x] Library exposes entity type for mixed search results
- [x] course and grammar/sentence flows have browser E2E coverage
- [x] existing desktop/mobile/PWA certification remains in CI

## Deliberate P2 boundary

P2 proves and ships the **course architecture plus an A1 core path**. It does not claim that 15 grammar concepts and 36 words constitute complete CEFR/JF A1 breadth.

That breadth belongs to P2.5. Expanding content must reuse these canonical entities, graph relationships, StudyEvents and learner projections instead of replacing them with lesson-local state.

## P2 milestone

A learner can move from Foundation into structured beginner Japanese, understand a grammar concept, retrieve it in context, encounter it across linked sentences, produce a controlled Japanese sentence, leave the app, and later receive correctly scheduled continuation through the same learner model.
