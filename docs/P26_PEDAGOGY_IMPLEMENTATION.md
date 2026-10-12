# P26 — Independent Communication & Grammar Precision

**Implementation branch:** feature/p26-independent-communication-precision
**Parent:** feature/p25-contextual-fluency-guided-revision at 42d97dbb863cea3dbd99dce1f69510ec81fd9a45

## Product delivered
- Four new original, situational A1/A2 missions: first commute to a university, borrowing a library book and arranging study, ordering and correcting quantities in a café, and changing weekend plans.
- Twenty multi-turn conversational exchanges. Learners TYPE Japanese responses, not just choose answers. Optional device TTS for the partner and optional browser speech-to-text input. The conversation proceeds through five turns; nonmatching free replies can be revised or saved as ungraded attempts.
- Grammar explanation panels, form/meaning contrasts, and register/politeness observations tied to each mission.
- Eight explicit contrasts with three multiple-choice contexts each (24 questions).
- Sixteen original words in use; each tested both as contextual meaning and active Japanese recall (32 prompts). These are P26 can-do training targets and do not claim to be newly created canonical lexemes.
- An independently writable and editable Japanese message per mission with a draft/rewrite/compare loop, reference examples and disclosed *literal* pattern observations. Free responses are not treated as grammatical correctness/fluency ratings.
- Standard StudyPlayer flows for full training, grammar-only precision, connected-vocabulary transfer and targeted repairs.
- New P26 prompts are included in Today queue's **due** registry only after a learner has studied them, and new explanatory lessons are in the shared first-exposure lesson registry.
- FSRS card identity, owner-scoped local StudyEvents and the existing review engine are reused. No schema, auth, sync, or migration modifications.

## Truth and privacy
- Authored-target response matches are graded; novel learner-created sentences are **not** automatically marked incorrect merely because they differ from our examples.
- Ungraded practice events record only metadata such as scenario, turn, length and revision flag; no submitted Japanese text or audio is included in these events.
- Browser speech recognition availability depends on the browser and may invoke external recognition services. Device TTS is explicitly synthetic.
- Literal particle/feature hints are advisory, not a Japanese parser or language quality certification.
- Textbook PDFs were pedagogical references only, not bundled or copied.
- **No merge, deployment, production change or CI requested/executed.** Source is implemented but browser execution, build and typecheck remain NOT_TESTED.

## P27 direction
Consolidate the multiplying A1/A2 feature panels into a single learner-directed journey, deepen authentic register contrast, introduce branching written response repairs and more flexible original dialogues. Stay implementation-first; consolidate nonessential validation only when requested.
