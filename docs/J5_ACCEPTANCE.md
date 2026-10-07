# J5 Acceptance — Study Focus Chamber

## Status

**Implementation complete. Final CI/device-independent browser qualification is required for the latest J5 commit.**

J5 rebuilds the integrated Study Player as the highest-clarity surface in the J-series. The illustrated learner world recedes completely when a study session begins; the interface adapts to the task while preserving the existing StudyStep, grading, evidence and scheduling contracts.

## Focus-chamber architecture

Entering study now removes the J2 learner navigation and presents a dedicated full-screen chamber.

The chamber contains:
- minimal Exit control;
- compact current-mode identity;
- session position;
- thin ink progress;
- optional light/sumi theme toggle;
- one task sheet;
- one restrained vertical mode rail on larger screens;
- a compact mode strip on mobile.

Decorative enso, brush and grid fields remain behind the task surface and never sit directly behind answer text.

## Task visual classification

`apps/web/src/study/j5StudyVisual.ts` maps existing StudySteps onto presentation modes without changing their durable semantics.

Modes:
- Lesson / 学ぶ;
- Kana / かな;
- Kanji / 漢字;
- Vocabulary / 語彙;
- Grammar / 文法;
- Sentence / 文;
- Listening / 聴く;
- Writing / 書く;
- Speaking / 話す;
- Assessment / 試す;
- Review / 復習.

Classification uses existing prompt attributes such as:
- primary target kind;
- prompt type;
- audio/speech-synthesis presence;
- skill;
- activity;
- language activity;
- lesson context/id/title.

No classification output is written into StudyEvents or mastery state.

## Kana / Kanji / vocabulary / grammar / sentence

Prompt typography and accent treatment now change by learning task while retaining the same prompt/answer contract.

Kana and kanji prioritize large Japanese forms.

Vocabulary keeps a large lexical focal point.

Grammar, sentence, assessment and general review reduce display size to protect longer Japanese/contextual prompts.

All modes keep the same accessible input/choice controls and grading behavior.

## Listening

Listening receives a dedicated audio-first chamber:
- large circular 聴 playback control;
- explicit synthesized-device-voice labeling when applicable;
- normal playback;
- slower playback;
- Shadow ×2;
- answer interaction remains locked until the cue is played;
- failure retains the existing skip-without-mastery path.

J5 does not reveal transcripts before grading.

## Writing

Textarea tasks use a manuscript/genkō-inspired writing field:
- visible writing grid;
- Japanese editorial type;
- structural target count;
- existing minimum-character target;
- existing transparent structural check.

The visual redesign does not claim semantic correction beyond the existing rubric.

## Speaking

Speech tasks receive a dedicated circular 話 interaction:
- browser Japanese speech recognition;
- recognized transcript shown explicitly;
- existing transcript structural check;
- skip path retained when recognition is unsupported or fails.

J5 continues to treat recognition as transcript/intelligibility evidence, not an acoustic pronunciation score.

## Lessons

Lesson steps preserve:
- title/body;
- audio;
- facts;
- examples;
- source label;
- Continue behavior.

They now receive task-aware Japanese art direction instead of the same generic white card used by graded prompts.

## Feedback

Correct/incorrect feedback keeps explicit English text and expected answers.

J5 adds a visual seal:
- 正 for successful retrieval;
- 直 for correction.

The seal is reinforcement only; result meaning never depends on the glyph or color.

Audio reveal, explanations, required-term disclosure and structural-rubric boundaries remain unchanged.

## Theme behavior

The isolated Study Player now carries the J-series theme itself.

It:
- reads the same locally persisted `japanese:j-theme`;
- uses washi light mode or sumi/charcoal dark mode;
- updates the document canvas while the study chamber is active;
- persists a theme change made during study;
- returns cleanly to the J2 shell after exit/completion.

## Responsive behavior

Desktop:
- full focus chamber;
- vertical Japanese mode rail;
- centered task sheet;
- large prompt field.

Tablet:
- narrower mode rail;
- unchanged task hierarchy.

Mobile:
- rail becomes a compact horizontal task strip;
- task sheet becomes full-width within safe margins;
- answer choices become one column;
- typed form stacks;
- writing/speaking controls remain thumb-safe;
- Exit retains the existing >=44 px certified target;
- no document-level horizontal overflow.

## Accessibility and reduced motion

J5 preserves:
- semantic buttons/forms;
- accessible audio labels;
- real form controls;
- status text;
- explicit correct/incorrect output;
- visible focus indicators;
- reduced-motion compatibility.

Decorative glyphs are hidden where they duplicate accessible meaning.

## Learning architecture preserved

J5 does not change:
- `StudyStep` / `StudyPrompt` contracts;
- `gradeStudyPrompt()`;
- answer normalization;
- response timing;
- StudyEvent creation;
- FSRS;
- prompt provenance;
- assessment metadata;
- audio provenance;
- productive-task rubric semantics;
- AI evidence boundaries.

The existing `StudyPlayer` remains the integration point. J5 changes its presentation and interaction hierarchy rather than replacing the learning engine.

## Automated qualification

Added:
- `tests/study-player/j5-visual-mode.test.ts`;
- `tests/e2e/j5-study-focus.spec.ts`.

Coverage includes:
- entity/task classification;
- interaction-mode precedence;
- lesson-context classification;
- fresh Today → kana focus chamber;
- absence of primary navigation during study;
- task-mode accessible identity;
- existing choice interaction after lesson progression;
- manuscript writing treatment;
- writing input/submit behavior;
- theme transfer into isolated study;
- in-study theme switching;
- mobile focus-chamber geometry;
- horizontal-overflow protection;
- reduced-motion control availability.

Legacy Study Player, PWA, course, mobile, audio, productive and assessment regressions remain applicable because their labels, classes and behavior contracts are preserved.

## Qualification evidence so far

After the J5 type correction, CI has already shown success for:
- TypeScript typecheck;
- unit tests;
- content validation;
- native-source/provenance validation;
- production build.

Full Playwright qualification for the final J5 state remains the final automated gate.

## J6 handoff

J6 should rebuild **Immerse / 浸 + Reader**.

The next phase should shift from the quiet study chamber into contemporary Japanese editorial/media culture while keeping the Reader itself typographically calm.

J6 should prioritize:
- media/genre-led discovery;
- Japanese magazine/poster/book-cover composition;
- native-source hierarchy;
- Mincho-first Reader;
- excellent ruby/furigana;
- layered translation/grammar support;
- listening/reading state clarity;
- existing authentic-source and advanced-workspace boundaries;
- no decorative interference with long-form reading.
