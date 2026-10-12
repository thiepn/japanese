# P27 — Unified Learning Journey & Conversational Depth

**Stacked from:** P26 commit ab09fa59dbb6bb19a72ff41d8ef97ee1ad674abf
**Branch:** feature/p27-unified-learning-journey

## Product implementation
- Replaces the three simultaneously mounted long P23, P25 and P26 pedagogical panels (plus embedded P24 lab) with one **unified** learner-selected journey: 18 original A1–A2 scenarios and an A1/A2 searchable selector. Existing source files remain intact.
- One consistent four-stage flow per scenario: **Verstehen** (explanation, contrasts and words in sentences), **Antworten** (multi-turn choice/independent Japanese), **Schreiben** (draft and revision), **Festigen** (due/incorrect, transfer, pragmatic politeness).
- Conversation adapters reuse the existing P24 branches and repair turns, P25 multi-turn variants and P26 original free-response patterns.
- Typed responses for P23/P25 have distinct cue identities from choice prompts. P26 typed responses reuse their existing StudyPlayer identity. A verified independent pattern match may produce the normal StudyEvent/FSRS review; revealed model or browser-recognized responses are recorded only as ungraded practice.
- Alternative free responses are **not** automatically marked wrong. An unrecognized response becomes ungraded evidence, with a comparison to the original explanation. The user can revise it and continue.
- 24 newly authored cross-context grammar, politeness and lexical-transfer choices, each with a unique FSRS identity; relevant choices are connected to multiple scenario contexts by metadata.
- One account-scoped evidence-derived recommendation across the 18 scenarios from the same StudyEvents and FSRS traces. No new database, user progress or scheduled review store. Existing Today queue includes P27 due prompts.
- Flexible shared Learn practice actions reuse all P23/P24/P25/P26 StudyPlayer sessions and the new focused cross-context StudyPlayer sessions.
- Guided free writing and optionally dictated text with draft→rewrite→comparison and literal pattern checks. Ungraded StudyEvents store limited metadata only, without answer text or audio.
- Device speech synthesis remains explicitly synthetic. Browser speech recognition is optional and can use external services.

## Boundaries
- Not a CEFR exam, grammar parser, open-ended conversational AI or pronunciation grader.
- Free language remains advisory and unmatched responses ungraded; finite authored model responses cannot cover valid alternative language.
- No Marugoto textbook content, PDF assets or publisher audio copied. References only.
- No merge, deployment, migrations, CI workflows, full test suites, live credentials or production changes.
- Runtime build/typecheck/browser behavior **NOT_TESTED** by instruction.

## P28 implementation opportunity
Improve the core learning journey with true sentence-construction inside the unified studio, better cross-situation conversation continuity, more register variants and mobile study UX without multiplying separate long panels.
