# P23 — Original Contextual Pedagogy (implementation)

## Scope
An original A1–A2 context studio connected to the existing **Learn** surface, StudyPlayer, immutable StudyEvents, local Account-scoped state, and shared FSRS scheduler. Not a Marugoto import. No PDF, original textbook exercise, screenshot or publisher audio is bundled.

## Delivered
- Eight original learning situations with communicative outcomes, intuitive German mental models, contrast explanations, error warnings, connected word examples, and short dialogues.
- 32 graded choice/typed recall tasks authored for these scenarios.
- A learn → recognize → discriminate → produce → transfer flow using the existing StudyPlayer and its deterministic grade contract.
- Derived weak-area recommendations from the same Account-scoped StudyEvents and memory traces as the rest of the app; no parallel mastery tables.
- Due prompt registration with the standard Today queue. Once a prompt has been attempted, its normal FSRS due date can put it in Today's review.
- Scenario-specific repair sessions prioritizing due and recently incorrect prompts.
- Optional related conversation links to the already existing A1 roleplay surfaces, where relevant.
- Original conversation examples with visibly identified device speech synthesis.
- Readable responsive desktop/mobile UI with keyboard-accessible controls.

## Truth boundaries
- Free-transfer tasks are practice suggestions, **not** automatically evaluated.
- Deterministic responses assess specific sentence forms, not full conversational proficiency.
- Can-do IDs are internal targets, not an external CEFR or JLPT certificate.
- Existing local data and migration contracts unchanged.
- Branch is stacked on draft PR #76; main and candidate deployment are untouched.
- No external API keys, production data, licensed textbook contents or deployment changes.

## Follow-on P24
Extend the same original contextual model beyond A2, add more open-production guided tasks with transparent human/AI-advisory feedback and coherent writing/speaking reflection, and deepen internal remediation without cloning a second progress engine.
