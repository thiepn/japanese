# J7 Acceptance — Library / 蔵 Knowledge Archive

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J7 commit.**

J7 replaces the old single-input/result-card Library with a search-first Japanese reference archive while preserving the existing local canonical search index and PWA/offline behavior.

## Primary information architecture

Library is now organized as:

1. archive masthead;
2. dominant Japanese search field;
3. semantic entity filters;
4. high-density result catalog;
5. persistent reference sheet;
6. compact local-first provenance footer.

The surface behaves like a reference workspace rather than a generic dashboard.

## Search truth preserved

J7 continues to call the existing `searchLocalJapanese()` function.

No second index, remote search provider or result ranking model is introduced.

Existing search behavior remains authoritative:
- normalized Japanese search;
- katakana→hiragana normalization;
- canonical form matches;
- reading matches;
- English gloss matches;
- alias matches;
- locally bundled canonical content;
- starter lexeme shelf when the query is empty.

Search remains offline/PWA compatible.

## Entity filters

Presentation filters are available for:

- All / 全;
- Words / 語;
- Kanji / 字;
- Grammar / 文;
- Sentences / 例;
- Chunks / 連;
- Texts / 読;
- Tasks / 作.

Filters operate only on the already returned search result set.

They do not alter search scoring, content availability or canonical entity identity.

## Result catalog

Results are intentionally denser than the previous cards.

Each row exposes:
- Japanese entity-family glyph;
- Japanese/English entity label;
- canonical title;
- existing subtitle;
- existing match source;
- explicit selected state.

The selected item opens a richer reference sheet alongside the catalog on larger screens and below it on mobile.

## Keyboard navigation

While the search field is focused:

- Arrow Down advances the selected visible result;
- Arrow Up moves back;
- Enter scrolls the selected reference sheet into view.

Touch selection remains available through the result rows.

This is navigation only and does not change search ranking.

## Reference-sheet differentiation

J7 resolves richer display data directly from the existing canonical `coreContent` package.

### Word / lexeme

May show:
- primary reading;
- gloss;
- part-of-speech metadata;
- inflection class;
- orthographic forms;
- additional readings;
- canonical tags.

### Kanji

May show:
- meanings;
- lexemes in the bundled archive that reference that kanji.

J7 does not invent readings that are absent from the canonical Kanji record.

### Grammar

May show:
- summary;
- CEFR/Japanese level;
- register;
- mental model;
- formation;
- uses.

### Sentence

May show:
- reading;
- translation;
- level;
- register;
- grammar links;
- tags.

### Lexical chunk

May show:
- reading;
- meaning;
- level;
- register;
- variants;
- tags.

### Reading text

May show:
- description;
- level;
- genre/kind;
- estimated time;
- topics/tags;
- connected-sentence and comprehension-check counts.

### Productive task

May show:
- prompt;
- level;
- writing/speaking mode;
- situation;
- required target terms.

All of this is a view over existing content. J7 does not create new dictionary facts.

## Visual direction

Library uses an archive/reference vocabulary rather than a fake bookshelf.

Implemented visual ideas include:
- vertical 蔵 archive spine;
- restrained sayagata field;
- catalog/index lines;
- reference-sheet paper treatment;
- entity-family seals/glyphs;
- Japanese editorial typography;
- archival indexing/provenance details.

There is intentionally no skeuomorphic 3D shelving or bookcase UI.

## Responsive behavior

Desktop:
- result catalog and reference sheet remain side by side;
- reference sheet is sticky for rapid scanning.

Tablet:
- compressed catalog/reference split;
- semantic filters remain visible.

Mobile:
- catalog and reference sheet stack;
- search remains the dominant control;
- filters become a two-column touch grid;
- result metadata simplifies without hiding the canonical title;
- no document-level horizontal scrolling.

## Accessibility

J7 retains:
- the existing `Search Japanese` accessible textbox name;
- real buttons for filters/results;
- explicit selected-state semantics;
- live search/status messaging;
- semantic headings;
- touch-safe mobile filters;
- visible focus behavior inherited from the J-series shell.

Result meaning does not depend on glyph/color alone.

## PWA regression preservation

The PWA regression has been migrated to assert canonical search results inside the J7 result catalog rather than relying on globally unique text nodes.

It continues to verify local searches such as:
- eat → 食べる;
- person → 人;
- food → kanji 食;
- offline train search → 電車.

## Dedicated J7 qualification

`tests/e2e/j7-library.spec.ts` covers:
- J7 archive identity;
- starter shelf;
- eight semantic filters;
- local canonical word search;
- word detail sheet;
- kanji filtering/detail;
- keyboard result navigation;
- mobile search/filter sizing;
- horizontal-overflow regression.

## J8 handoff

J8 should rebuild **Progress / 道** as the longitudinal learner journey.

The next phase should turn mastery/evidence into a visual path rather than another collection of statistics while preserving:
- canonical mastery projections;
- evidence counts;
- milestone truth;
- B2/C1 portfolio evidence;
- numerical accessibility;
- separation of developer/operations controls already established in J2.
