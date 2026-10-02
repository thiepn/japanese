# P3 — Reader, Connected Listening & A1→A2 Immersion Bridge

Status: implementation complete

## Canonical immersion content

- [x] graded texts are first-class canonical content entities
- [x] text entities reuse existing canonical sentence IDs rather than duplicating learner truth
- [x] each text links target lexemes and grammar concepts
- [x] each text carries level, type, tags, estimated time, audio mode and provenance
- [x] the initial bridge ships 8 texts spanning A1, A1+ and A2-entry support levels
- [x] each text has text-level comprehension questions
- [x] content package advances to v0.5.0 / schema version 6
- [x] graded texts persist in the local canonical content database
- [x] graded texts are indexed by the existing Japanese search system
- [x] validator checks text → sentence, lexeme and grammar references

## Reader

- [x] Immerse is a real product surface rather than a placeholder
- [x] connected text is assembled from the canonical sentence graph
- [x] sentence translations are hidden by default and revealed per sentence
- [x] reading hints can be toggled
- [x] linked words are tappable in context
- [x] word lookups show surface form, reading and canonical meaning
- [x] sentence grammar support points back to canonical grammar concepts
- [x] the reader matches canonical forms plus generated core inflections
- [x] generated surface readings follow the same inflection model where possible
- [x] the reader does not claim to be a general Japanese morphological analyzer

## Unified learner state

- [x] known-word readiness is derived from existing lexeme meaning evidence
- [x] no reader-specific known-word database exists
- [x] text reading mastery uses the same StudyEvent / learner projection model
- [x] text listening mastery uses the same StudyEvent / learner projection model
- [x] ordinary reader lookups are recorded without pretending lookup exposure is mastery
- [x] mined words emit normal mining StudyEvents
- [x] mined words return to the unified Today queue
- [x] a mined item remains prioritized until later graded meaning-retrieval evidence exists
- [x] Progress reports immersion readiness, reading mastery, listening mastery, lookups and mining

## Connected listening

- [x] a full connected text can be played as one Japanese utterance
- [x] normal and slower playback are available
- [x] a Japanese device speech-synthesis voice is preferred when the platform provides one
- [x] listening exposure is represented separately from graded listening evidence
- [x] listening checks record text-level listening StudyEvents
- [x] reading checks and listening checks remain separate evidence dimensions
- [x] connected-listening support does not fabricate source-provenanced native recordings

## UX and bridge design

- [x] each text shows current known-word readiness before opening
- [x] readiness is advisory and never hard-locks a stretch text
- [x] A1, A1+ and A2-entry texts can coexist in one library
- [x] reader support is progressive rather than permanently displaying translation
- [x] word lookup is available without leaving the text
- [x] mining is one action from the lookup panel
- [x] reading and listening checks are available from the same text
- [x] desktop and mobile layouts remain responsive
- [x] reader controls preserve the existing app navigation model

## Test coverage

- [x] unit tests certify the 8-text canonical bridge
- [x] unit tests verify reader composition from sentence IDs
- [x] unit tests verify generated conjugated forms are recognized as linked lexemes
- [x] content validation covers reading-text graph references
- [x] E2E certification covers opening a text, support reveal, lookup/mining access and reading checks
- [x] existing P0–P2.5 typecheck, unit, validation, build and browser certification remain in CI

## Deliberate P3 boundaries

P3 establishes the **immersion bridge**, not a full arbitrary-Japanese parser or an authentic-media ingestion platform.

The graph-aware reader recognizes the app's canonical word forms and core generated inflections. It does not claim full morphological analysis for unrestricted Japanese text.

Connected listening currently uses the device/browser Japanese speech-synthesis voice when one is available. This provides connected phrase and passage listening without inventing licensed recordings, but it is not equivalent to curated native-speaker sentence audio. Source-provenanced native connected audio can be added later without changing text or learner-state identity.

P3 also does not yet import arbitrary private books, subtitles or web pages. Those require a later ingestion and morphology pipeline.

## P3 milestone

A learner can leave isolated course sentences, open a connected graded text, estimate lexical readiness from existing mastery, read with optional word/grammar support, mine a difficult word back into the normal review queue, listen to the entire passage, and produce separate reading and listening evidence without creating a second progress system.

The next phase is **P4 — A2 Expansion, Native Audio & Authentic-Input Pipeline**.
