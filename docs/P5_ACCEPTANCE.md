# P5 — B1 Expansion, Productive Language & Adaptive Immersion

Status: implementation complete

## Structured B1 expansion

- [x] one canonical course graph now continues from Foundation through A1, A2 and B1
- [x] 336 canonical lexemes
- [x] 86 canonical grammar concepts
- [x] 209 linked canonical sentences
- [x] 40 Can-do descriptors and 40 structured course units
- [x] 22 graded immersion texts spanning A1 through B1
- [x] 10 canonical productive-language tasks
- [x] B1 grammar practice remains attached to canonical grammar entities
- [x] B1 sentences reuse canonical lexeme and grammar identities
- [x] B1 units use the same StudyPrompt, StudyEvent, mastery projection, FSRS and delayed-check paths as earlier phases
- [x] core content package advances to v0.7.0 / schema version 8
- [x] productive tasks are persisted and searchable as first-class content entities

## B1 discourse and language range

P5 adds productive and receptive coverage for:

- [x] developed habits and ability changes with 〜ようになる / 〜ようにする
- [x] personal vs externally determined decisions with 〜ことにする / 〜ことになる
- [x] appearance, hearsay and indirect evidence with 〜そうだ / 〜らしい / 〜みたい
- [x] calibrated uncertainty and expectation with 〜かもしれない / 〜はず
- [x] purpose and desired outcome with 〜ために / 〜ように
- [x] contrast and concession with 〜のに / 〜ても
- [x] contextual and logical conditionals with 〜なら / 〜ば / conditional と
- [x] preparation, experimentation and unintended completion with 〜ておく / 〜てみる / 〜てしまう
- [x] connected B1 texts for change, decisions, evidence, purpose, advice and opinion structure
- [x] vocabulary for opinions, evidence, goals, education, society, technology, health, change and problem-solving

## Native vocabulary audio

- [x] 56 additional vocabulary recordings were added only after exact-file verification against the pinned Tofugu/WaniKani repository
- [x] P5 has 203 canonical audio assets in total
- [x] recordings retain explicit CC BY-SA 4.0 attribution, native-speaker metadata and immutable upstream identity
- [x] no sentence or passage recording is fabricated merely to satisfy a native-audio target
- [x] device speech synthesis remains visibly separate from source-provenanced native audio

## Connected writing

- [x] productive writing uses first-class canonical `ProductiveTask` entities
- [x] StudyPlayer supports multi-line connected responses
- [x] tasks expose situation, minimum length, model response, target grammar, target lexemes and a reusable four-area rubric
- [x] structural checks require minimum response length and target-language-feature coverage
- [x] writing evidence uses the normal StudyEvent and learner-projection path
- [x] writing prompts can appear in the normal application/Today flow
- [x] the UI explicitly states that structural checks are not full semantic correction
- [x] model responses are examples, not a claim that one exact response is the only valid Japanese

## Real speaking practice

- [x] StudyPlayer has a dedicated speech prompt mode
- [x] supported browsers use Japanese SpeechRecognition / webkitSpeechRecognition to capture an actual spoken response
- [x] the recognized Japanese transcript is shown before grading
- [x] speaking evidence is recorded through the same StudyEvent and scheduler path
- [x] unsupported or failed speech recognition can be skipped without manufacturing speaking mastery
- [x] speech recognition is treated as evidence of an intelligible recognized response, not an acoustic pronunciation score
- [x] the app does not claim phoneme-level scoring, accent scoring or native-likeness scoring

## Shadowing and pronunciation evidence

- [x] Immerse includes a listen → record → compare shadowing lab
- [x] learners can record themselves with getUserMedia + MediaRecorder
- [x] the learner can immediately replay the browser-memory recording
- [x] the recording blob is not uploaded or persisted by the P5 shadowing workflow
- [x] learner self-review records a 1–4 clarity/rhythm rating as pronunciation evidence
- [x] shadowing evidence is explicitly marked `acousticScore:false`
- [x] reference speech synthesis is identified as a device voice rather than native source audio
- [x] pronunciation self-rating does not overwrite speaking-production mastery

## B1 milestone

- [x] B1 has a separate five-area milestone
- [x] 3 reading tasks
- [x] 3 listening tasks
- [x] 3 microphone-based spoken-interaction tasks
- [x] 3 microphone-based spoken-production tasks
- [x] 3 connected-writing tasks
- [x] each activity area is reported separately
- [x] speaking uses speech-recognition transcripts rather than the old A1 say-then-type proxy
- [x] writing uses connected responses rather than single-sentence exact matching
- [x] the milestone does not collapse five language activities into one overall pass/fail claim

## Adaptive immersion

- [x] Immerse derives a current reading-vs-listening focus from learner evidence
- [x] graded material ranking combines lexical readiness, current mastery gap and level
- [x] private authentic-input ranking targets a useful lexical stretch range
- [x] the app can recommend one graded next step and one learner-owned authentic next step
- [x] recommendations are projections from current evidence, not stored progress truth
- [x] recommendations remain advisory and do not lock the learner out of other material

## Morphology and authentic-input improvements

- [x] canonical and generated surface matching remains the first resolution layer
- [x] P5 adds common B1 potential/passive, causative, volitional and conditional surface generation
- [x] common 〜てしまう / 〜ておく / 〜てみる surface forms can resolve back to canonical identities
- [x] `lemmatizeJapaneseSurface` exposes canonical lexeme + dictionary-form resolution when the bounded model can resolve a surface
- [x] browser Japanese word segmentation remains a fallback for unresolved material
- [x] token metadata distinguishes canonical, generated and deinflected resolution
- [x] lexical-difficulty guidance still does not claim complete morphology, sense disambiguation or compound parsing

## Sentence mining and de-duplication

- [x] imported learner-owned documents can be split into candidate Japanese sentences
- [x] a sentence is saved only after the learner provides the meaning they want to review
- [x] private sentence identity is stable by normalized Japanese text
- [x] duplicate sentence text merges source-document references rather than creating duplicate cards
- [x] private sentence comprehension and production prompts enter the same learner model and Today/FSRS path
- [x] private sentence records remain account-scoped and separate from the public canonical seed
- [x] private sentences can be independently deleted

## Persistence, search, validation and tests

- [x] IndexedDB schema adds account-scoped private-sentence persistence
- [x] canonical SQLite content storage adds first-class productive-task persistence
- [x] Library search indexes productive-task titles, situations, prompts, tags and target expressions
- [x] validator checks productive-task provenance, target grammar, target lexemes, modes, length contracts and required terms
- [x] persistence tests cover private-sentence account isolation, save and delete
- [x] morphology tests cover B1 deinflection and sentence splitting
- [x] productive tests cover connected-writing and speech prompt contracts
- [x] assessment tests certify the 15-item five-area B1 milestone
- [x] browser tests cover the 40-unit Foundation→B1 course and B1 immersion entry points

## Deliberate P5 boundaries

P5's speech-recognition path determines whether the browser recognized a Japanese transcript and whether that transcript contains requested structural targets. It is not a phonetic evaluator. It does not independently score mora timing, pitch accent, segmental accuracy, prosody or native-likeness.

P5's writing checks verify response length and requested language-feature coverage. They do not claim to understand every proposition, correct every grammatical error, judge discourse quality like a teacher, or provide an authoritative CEFR rating.

The shadowing lab records audio only for immediate local playback and learner self-comparison. The self-rating is useful learner evidence but is not an acoustic model score.

The P5 lemmatizer is deliberately bounded to canonical content and common generated/deinflected patterns. It improves imported-text resolution but is not a complete Japanese morphological analyzer or sense tagger.

Native connected audio is used only when a source-provenanced recording really exists. P5 does not relabel browser TTS as native audio and does not fabricate passage recordings.

## P5 milestone

A learner can now move through one Foundation→B1 course, read connected B1 material, write multi-sentence Japanese, answer speaking prompts through the microphone, perform listen-record-compare shadowing, receive evidence-driven immersion recommendations, and mine both vocabulary and full sentences from learner-owned material without creating a parallel learning system.

The next phase is **P6 — B1→B2 Independent Communication, AI Conversation & Advanced Feedback**.
