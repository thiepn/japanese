# J6 Acceptance — Immerse / 浸 + Reader

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J6 commit.**

J6 rebuilds Immerse as a contemporary Japanese editorial reading room and rebuilds the connected Reader as a quiet Mincho-first reading surface. The existing immersion evidence model, authentic-source tooling, listening behavior and StudyEvent boundaries remain unchanged.

## Immerse information architecture

The old phase-heavy stacked dashboard is replaced by:

1. editorial Immerse masthead;
2. compact immersion activity ledger;
3. adaptive next-text feature;
4. genre/media reading shelf;
5. B2→C1 thematic series;
6. long-form missions;
7. progressive-disclosure advanced studios.

This makes connected Japanese the primary experience while retaining every advanced source/research tool.

## Editorial identity

Immerse now uses a deliberately more contemporary visual language than Today/Learn:

- Japanese magazine masthead composition;
- vertical 浸 identity;
- ichimatsu editorial pattern;
- vermilion/indigo print accents;
- issue/volume framing;
- offset cover layouts;
- story/dialogue/functional cover families;
- compact Japanese/English metadata;
- strong typographic crop and hierarchy.

No third-party visual artwork is introduced. J6 remains procedural/CSS-based and therefore adds no new external-art provenance burden.

## Reading shelf

All existing graded texts remain available.

The shelf presents them as editorial covers rather than generic cards.

Filters:
- All;
- Story;
- Dialogue;
- Functional.

Filtering is presentation-only. It does not change readiness, availability or evidence.

Each cover still exposes:
- level;
- text kind;
- estimated reading time;
- lexical readiness;
- known/linked word counts;
- reading mastery;
- listening mastery;
- the existing Open text action.

Readiness remains guidance and never becomes a lock.

## Adaptive feature

The existing adaptive immersion recommendation now receives an editorial “next read” treatment.

The recommendation continues to use the existing adaptive system and may surface:
- canonical graded text;
- private authentic input.

No J6 recommendation score is introduced.

## Series and missions

Existing extensive B2→C1 tracks are presented as “Series / 連載”.

Existing autonomy missions are presented as “Missions / 実践”.

Both retain:
- current progress calculations;
- StudyEvent-derived completion;
- delayed-transfer requirements;
- existing next-step actions.

## Advanced studios

The following systems remain available but no longer dominate the default reading shelf:

- P15 real-source environment;
- P16 research quality;
- P17 precision bridge;
- P18 advanced interaction;
- P19 prosody/external review;
- P14 C1 autonomy;
- P13 native-source depth;
- native listening;
- native curation;
- shadowing;
- Your Japanese / authentic private input.

They are grouped as expandable “Advanced Studios / 研究室”.

The P14 → P13 native-set handoff explicitly opens the native-source studio before scrolling to the target set.

This is presentation/progressive disclosure only; the underlying components are unchanged.

## Reader redesign

The canonical connected Reader is now a quiet two-zone reading environment.

Desktop/tablet:
- sticky support/control rail;
- wide Mincho-first paper;
- restrained Japanese editorial metadata;
- sentence-level numbering;
- large Japanese reading type;
- ruby/furigana optimized for long-form reading;
- support functions visually subordinate to the text.

Mobile:
- controls stack above the text;
- paper becomes full-width inside safe margins;
- support actions wrap naturally;
- no horizontal-document dependency.

## Layered support

The Reader retains and visually separates:

- reading hints / furigana;
- listening-first;
- full-text playback;
- slower playback;
- sentence replay;
- Slow ×2 segment replay;
- sentence-level translation;
- grammar links;
- word lookup;
- mining for review.

Support is revealed on demand rather than permanently competing with the Japanese text.

## Listening-first

Listening-first keeps its existing evidence behavior.

When enabled before playback:
- the Japanese transcript is visually hidden;
- a listening-first gate explains the task;
- playback controls remain available;
- the transcript returns after a complete playback.

No transcript is exposed early through the J6 interface.

## Reader word interaction

Linked lexical items remain interactive.

Word lookup still records normal lookup evidence and exposes:
- surface;
- reading;
- meaning;
- Mine for review.

Mining remains connected to the existing reader StudyEvent path.

## Reading/listening checks

Checks remain the existing finite comprehension questions.

J6 changes only their presentation:
- dedicated paper/check surface;
- numbered options;
- explicit correct/correction text;
- Japanese seal reinforcement;
- existing explanation;
- return/next action.

The check result, response timing and StudyEvent semantics are unchanged.

## Evidence and source boundaries preserved

J6 does not change:
- `recordReadingExposure()`;
- `recordListeningExposure()`;
- `recordListeningSegmentReplay()`;
- `recordReaderLookup()`;
- `recordMinedWord()`;
- `recordTextCheck()`;
- reading/listening mastery projection;
- adaptive recommendation calculation;
- authentic/private-document boundaries;
- reusable-source licensing policy;
- external-review semantics;
- CEFR or C2 authority boundaries.

## Regression migration

Legacy tests that expected all advanced labs to be permanently expanded now explicitly open the relevant J6 studio.

Updated coverage includes:
- canonical Immerse flow;
- P13 native-source depth;
- P14 autonomy;
- P15 real-source environment;
- P16 research quality;
- P17 precision;
- P18 advanced interaction;
- P19 prosody/external review;
- shadowing;
- authentic/private Japanese input.

## Dedicated J6 qualification

`tests/e2e/j6-immerse-reader.spec.ts` covers:
- J6 editorial Immerse identity;
- 50 canonical graded-text covers;
- media filtering;
- document overflow;
- Reader entry;
- quiet Reader paper;
- furigana controls;
- translation reveal;
- word lookup;
- lookup close behavior;
- listening-first transcript pressure;
- advanced-studio disclosure;
- Your Japanese studio;
- mobile Reader width/overflow.

## J7 handoff

J7 should rebuild **Library / 蔵** as the Japanese knowledge archive.

The next phase should prioritize:
- search as the dominant interaction;
- dictionary/reference density;
- kanji, lexeme, grammar and sentence result distinction;
- strong Japanese typography;
- fast filtering and keyboard/touch navigation;
- archive/book-spine visual metaphors only in decorative zones;
- no fake 3D bookshelf;
- current local search truth and result semantics preserved.
