# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing, speaking, authentic-input mining and AI coaching all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P6 — B1→B2 Independent Communication, AI Conversation & Advanced Feedback is implemented.**

The app now provides one connected Foundation → A1 → A2 → B1 → B2-bridge → immersion system:

- reusable Study Player for lessons, reviews, listening, grammar, conjugation, sentences, connected writing, microphone speaking and assessments;
- complete hiragana/katakana Foundation with multi-skill evidence;
- **416 canonical lexemes** with meanings, readings, source provenance and native audio where verified;
- **102 grammar concepts**, including B2 qualification, evidence, concession, formal framing, linked change and risk language;
- **267 linked sentences** and **50 capability-centered course units** in one course graph;
- delayed unit checks plus separate A1, B1 and B2 five-area milestones;
- **30 canonical graded texts** spanning A1 through B2, including coherent multi-speaker B2 dialogue;
- **20 canonical productive tasks**: 10 B1 and 10 B2;
- connected writing and browser-microphone speaking through the same learner-evidence path;
- multi-turn AI conversation and writing revision with feedback split into grammar, vocabulary, coherence and task achievement;
- an explicit AI evidence contract that prevents model judgments from silently changing durable mastery;
- listening-first connected playback that can hide the transcript until one full playback finishes;
- listen → record → compare shadowing with local-only recording playback and self-rated pronunciation evidence;
- cross-surface adaptive remediation derived from course, production and immersion evidence;
- **203 canonical native vocabulary audio assets** with explicit license, attribution and native-speaker metadata;
- bounded B1/B2 deinflection with explicit confidence and canonical sense-ambiguity metadata;
- a provider contract for dictionary-grade morphology without falsely labeling the built-in heuristic as dictionary-grade;
- private paste / TXT / Markdown / SRT / VTT ingestion plus licensed JSON source-pack import;
- source-pack admission that keeps text/audio licensing separate and refuses NC/ND or unverifiable native-audio claims;
- contextual vocabulary and full-sentence mining back into the normal Today/FSRS path;
- persistent account-scoped learner data without copying learner-owned material into the public content package.

Current core content package: **v0.8.0 / schema 9** with 416 lexemes, 102 grammar concepts, 267 sentences, 50 Can-do descriptors, 50 structured units, 30 graded texts, 203 canonical audio assets and 20 productive tasks.

P6 deliberately keeps several evidence boundaries strict. AI feedback is advisory rather than learner truth; browser speech recognition is not acoustic pronunciation scoring; device speech synthesis is not native audio; the internal B2 milestone is not an accredited CEFR examination; and the built-in morphology layer remains bounded until a real dictionary-grade provider is connected.

Live AI coaching requires a server-side provider behind `VITE_JAPANESE_COACH_ENDPOINT` (default `/api/japanese/coach`). No API secret is placed in the browser.

The next development phase is **P7 — B2 Breadth, Native Media & Advanced Lexical/Collocational Fluency**.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P4_ACCEPTANCE.md`, `docs/P5_ACCEPTANCE.md`, `docs/P6_ACCEPTANCE.md`, `docs/SOURCE_PACK_FORMAT.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
