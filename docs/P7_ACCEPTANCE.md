# P7 — B2 Breadth, Native Media & Advanced Lexical/Collocational Fluency

Status: implementation complete; live provider/native-media breadth remains deployment/source dependent

## B2 breadth package

P7 expands the focused P6 B2 bridge into a materially broader B2 practice layer without introducing C1 labels.

- [x] content package advances to v0.9.0 / schema 10
- [x] 634 canonical lexemes, up from 416
- [x] 634 canonical senses
- [x] 102 grammar concepts, including the existing 16 B2 discourse/qualification concepts
- [x] 327 linked canonical sentences, up from 267
- [x] 58 Can-do descriptors and 58 structured course units
- [x] 42 graded texts spanning Foundation/A1 through B2, including 20 B2 texts
- [x] 32 productive tasks, including 22 B2 tasks
- [x] eight additional B2 capability units (51–58)
- [x] breadth domains include work/organization, public services, society, housing/transport, environment, research/data, media/information reliability, technology and negotiation

The expanded vocabulary remains a curated pedagogical core, not a claim that 634 lexemes equal all vocabulary required for CEFR B2.

## First-class lexical chunks and collocations

P7 no longer treats single-word knowledge as sufficient evidence of lexical fluency.

- [x] 120 canonical B2 lexical chunks/collocations
- [x] stable `lexical_chunk` learner identity
- [x] chunk-to-meaning recognition evidence
- [x] meaning-to-chunk active-use evidence
- [x] independent FSRS/memory traces for chunks
- [x] first-exposure chunk lessons
- [x] register metadata on each chunk
- [x] canonical lexeme/grammar/example-sentence links
- [x] productive tasks may target chunk IDs directly
- [x] Library search indexes lexical chunks
- [x] authentic-reader detection surfaces matching canonical chunks in context

Examples include 影響を与える, 役割を果たす, 課題に取り組む, 合意に達する, 根拠を示す, 情報源を確認する and データを分析する.

## Genre breadth and extensive input

P7 adds twelve connected B2 texts across:

- [x] workplace decision-making
- [x] media/source reliability
- [x] disaster preparation
- [x] energy/environment trade-offs
- [x] workplace training and automation
- [x] housing and transport
- [x] survey interpretation
- [x] public services
- [x] responsible AI use
- [x] negotiation
- [x] education/opportunity
- [x] evidence-based synthesis

Each new text has five connected canonical sentences and three text-level comprehension questions.

P7 also adds four readiness-driven extensive tracks. A track combines several B2 texts and recommends a next item from lexical readiness plus existing reading/listening evidence. Tracks are advisory: no text is hard-locked.

## Connected listening and native-media replay

- [x] graded reading texts can carry sentence-level listening-segment metadata
- [x] canonical P7 texts expose sentence replay and slow ×2 replay
- [x] audio provider supports bounded `startMs` / `endMs` playback
- [x] replay loops emit separate listening StudyEvents with sentence targets
- [x] source-pack recordings can carry ordered native-audio segment timing
- [x] source-pack validation rejects invalid/overlapping timings
- [x] imported native media exposes segment-by-segment replay controls
- [x] recording credit, license and native-speaker admission remain mandatory
- [x] device speech synthesis remains a visibly synthetic fallback

P7 does not manufacture native recordings for original THIEPN passages. Native connected audio is used only when a licensed, source-provenanced recording is actually attached.

## Dictionary-grade morphology provider

P7 turns the P6 provider boundary into an executable integration path.

- [x] HTTP `JapaneseMorphologyProvider` client
- [x] strict response parser requiring `dictionaryGrade:true`
- [x] provider ID/range/candidate validation
- [x] server-side morphology Fetch handler
- [x] Sudachi-compatible tokenizer adapter boundary
- [x] browser configuration through `VITE_JAPANESE_MORPHOLOGY_ENDPOINT`
- [x] provider-backed segmentation/lemmas outrank bounded browser guesses
- [x] results map back to canonical lexeme/sense identities when possible
- [x] provider failure visibly falls back to bounded local analysis
- [x] token lookup displays resolver source, confidence and explicit ambiguity

A deployment still has to connect the server adapter to an actual Sudachi runtime or another documented dictionary-grade Japanese tokenizer. P7 never relabels the bounded local resolver as dictionary-grade.

## Productive breadth and revision memory

P7 adds twelve B2 speaking/writing scenarios around work, media claims, community planning, energy choices, survey interpretation, negotiation, public policy, AI, community support, counterargument and synthesis.

- [x] productive tasks can require collocations as structural targets
- [x] lexical chunk identities are carried in productive StudyEvent metadata
- [x] AI coach continues to separate grammar, vocabulary, coherence and task achievement
- [x] prior advisory coach feedback is reconstructed from stored StudyEvents
- [x] recent learner revisions are visible
- [x] repeated feedback messages are summarized as reusable correction themes
- [x] feedback-area counts expose where correction repeatedly occurs
- [x] revision history remains advisory and cannot modify mastery or FSRS state

## Authentic-input lexical intelligence

- [x] canonical P7 collocations are detected in learner-owned/imported Japanese
- [x] provider-backed tokens expose confidence and sense-resolution state
- [x] ambiguous senses remain labeled ambiguous rather than guessed
- [x] local and provider resolution are visibly distinguished
- [x] private vocabulary and sentence mining continue to use account-scoped learner identities

## Assessment boundary

The existing 15-item B2 milestone remains deliberately unchanged in size. P7 broadens the learning corpus substantially, but the milestone is still an internal five-activity diagnostic rather than an accredited CEFR exam.

P7 does not infer a new overall B2 pass/fail judgment from the expanded content.

## Validation and regression coverage

- [x] schema/provenance validation covers lexical chunks
- [x] chunk lexeme/grammar/example-sentence references are checked
- [x] productive chunk targets are checked
- [x] listening segment references/timing are checked
- [x] vocabulary/course/reader/productive browser expectations updated to P7 counts
- [x] dedicated lexical-fluency tests
- [x] source-pack timing tests
- [x] dictionary-grade provider parsing/client tests
- [x] existing P6 AI evidence restrictions remain intact

## Deliberate P7 boundaries

P7 materially broadens B2 but does not claim comprehensive CEFR B2 lexical coverage.

Native-media tooling supports licensed source-provenanced recordings and timed segments, but the app does not bundle unlicensed media or relabel device TTS as native.

The dictionary-grade morphology path is deployable, but a real runtime/provider must be connected behind the endpoint.

AI feedback history remains advisory. Repeated model feedback can help select what to revise, but model judgments never become authoritative learner truth.

No acoustic pronunciation model is added in P7.

## P7 milestone

A learner can now move through a substantially wider B2 lexicon and genre set, learn common collocations as first-class retrievable units, practice longer topic tracks, replay difficult listening by sentence, import and segment licensed native recordings, analyze authentic input through a real morphology-provider boundary, and reuse prior AI correction patterns without compromising the evidence model.

The next phase should consolidate B2 autonomy through longer multi-document tasks, sustained interaction, stronger production reliability and real-world task chains before any C1-oriented curriculum is introduced.
