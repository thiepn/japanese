# THIEPN Japanese P54 — Connected A2 Reading & Vocabulary Transfer

**Exact verified parent at start:** `feature/p53-natural-vocabulary-usage` at `91558c23195356c85cf4281a5f1a5fcc008e45ba`. Branch head matched the requested exact SHA before the first write.

**Isolated stacked P53-child branch:** `feature/p54-connected-a2-reading-vocabulary-transfer`.

## P41–P60 content-first phase: source implementation

**35 distinct original connected A2-targeted Japanese reading passages** authored in five independent corpora:

| File | Passage count | Progression |
|---|---:|---|
| `reading54-corpus-a.ts` | 7 | Early: everyday messages, appointments, menus, notices and story chronology |
| `reading54-corpus-b.ts` | 7 | Developing: research, digital error handling, moving, registration and alternative plans |
| `reading54-corpus-c.ts` | 7 | Developing: institutional communications, speaker-specific updates, evidence and uncertainty |
| `reading54-corpus-d.ts` | 7 | Integrating: comparative reports, repair/visit planning and conditional arrangements |
| `reading54-corpus-e.ts` | 7 | Cumulative: four-paragraph multi-actor projects and temporal/source integration |
| **Total** | **35** | **4 explicitly surfaced learner-facing stages** |

Every passage includes:

1. A first-party original Japanese text of three or four coherent **connected paragraphs**, each supported by an original accurate-intention German explanatory gloss; an everyday communicative situation, text genre and practical reading purpose.
2. Original P53 **word ID links** only where existing P53 entries are actually present; the learner-facing library explicitly distinguishes a word **literally attested in the Japanese passage** from merely thematically related vocabulary, so there are no fabricated textual citations. Original P53 reading/meaning, useful collocations and authored word-family contrasts are reused read-only.
3. A grammatical reading focus and a specifically authored misunderstanding or contrast, often a difference between **plans, future possibilities, secondhand information, confirmed approvals and actions that actually happened**.
4. **Three genuinely authored text-evidence comprehension questions per passage**: **105 original questions** across chronology, causal explanation, source detail, inference and speaker attribution. Every question has two separately authored complete Japanese answer models, specific tempting false answer, misconception-specific explanation and original Japanese evidence phrase from the passage.
5. One independently authored **new-situation writing task**, containing an original Japanese model and alternative plus specific rationale and misconception.
6. A separate **changed-person/place/event delayed-return situation** not shown in the learner-facing reading studio before eligibility, also with authored Japanese answer models and explanation.

**Native assessed cue minimum:** 105 comprehension + 35 independent writing + 35 delayed changed-context returns = **175 original stable prompts**, plus extra **attested** source-linked P53 vocabulary prompts derived only where a word is written in the passage. No unsupported fixed count of linked vocabulary prompts is claimed without performing the explicitly excluded validations.

### Native integration, unchanged learner authority

- `reading54-types.ts`: typed first-party original passage/paragraph, source-grounded question and new-situation writing contracts. Stable IDs are independent of UI order.
- `reading54.ts`: original first-party registry; explicit four-stage progression; P53 family/reference lookup without new vocabulary state; source-attested vocabulary prompt generation; independent original question, writing and delayed recall `StudyPrompt` generation; finite original model comparison that never labels an unknown correct paraphrase definitively incorrect. Uses original StudyPlayer `primaryTarget`, cue family, context, Japanese normalization, source metadata, original IDs and `contentVersion:"p54-1"`.
- `P54ReadingStudio.tsx` + `p54-reading.css`: responsive searchable original reading library by genre, mobile and keyboard navigation, 3–4 paragraph Japanese reader, optional initially hidden original German paragraph help, 3 interactive evidence questions, Japanese IME-aware text entry, bounded post-attempt comparison and optionally revealed text evidence, contextual P53 word exploration, source-linked original native practice paths, native Learn draft/revision handoff and hidden changed-context return.
- `runtime.ts`: all original P54 source prompts enter existing Today due and Learning Journey prompt catalog; no parallel queue or scheduler.
- `journey27.ts`: `reading54:<id>` and `reading54-kind:<id>:comprehension|vocabulary|writing|return`, with existing `return:<id>` / `return-due:<id>` routes. Unit-bound specialist routes, existing StudyPlayer session builder, existing FSRS traces. Unseen P54 return prompts stay out of ordinary new/retry/production.
- `P27LearningJourney.tsx`: original owner-scoped Learn mounting, mistake-based recommendation, one native existing writing editor, ungraded `StudyEvents` with source IDs, `schedulerExcluded:true`, no raw learner writing text, and the same unit owner/recovery mechanisms. No duplicate state writer, assessment or data store.
- `remediation36.ts`: P54 question-type remediation via existing native feedback machinery, distinguishing text evidence, source, chronology, inference, P53 word family and free production.

### Authentic delayed/FSRS behavior

Before opening a truly unseen P54 context for the first time, the first source-specific comprehension prompt must have either (1) a genuinely **due** original FSRS MemoryTrace or (2) a real graded StudyEvent at least 24 hours old. This unlock does **not** fabricate a due review. Once a native return trace exists, optional return practice can be invoked; `return-due` is selected strictly against the authentic original FSRS `card.due`. The original Today queue includes only truly due P54 reviews. A mere exposition of German translation, reader answer model or ungraded draft is **not** a graded completion and does not generate a FSRS MemoryTrace.

### Original publishing rights, language level and qualifications

All Japanese paragraphs, German meaning support, comprehension questions, model alternatives and misconception corrections are first-party original material. The uploaded Marugoto A1/A2 books, grammar guide and kanji materials are **reference only**; no PDF extracts, source illustrations, publisher passages or audio are copied. Material is aimed at **progressively connected A2 comprehension**, but some source evidence, passive constructions, conditions and reported-speech distinctions stretch into A2-bridge content. No official JLPT level certification is claimed.

The end-user Studio comparison recognizes only authored model patterns, not all correct natural Japanese paraphrases. Expert Japanese language proofreading and runtime acceptance **have not been performed** and must not be represented as accomplished. Printed German paragraph meaning support can be viewed before the independent native StudyPlayer; as in existing in-app reading study, user choice to view it does not certify an unassisted closed-book performance.

## Restricted operations and status

**NOT_RUN:** automated tests, TypeScript checking, builds, CI/GitHub Actions, browser QA, manual browser/device acceptance, external linguistic certification, release qualification and source-evidence audits.

**NOT_DONE:** PR creation, branch merges, deployment, migrations, production or database operations, credentials, paid services and external communications.

All P23–P53 original source IDs, prior development branches and main remain preserved.

## Next proposed content-first phase

**P55 — Connected A2 Listening & Spoken Response.** Continue stacked on the exact final P54 source commit, using the P47 listening and P54 reading architecture. Author original realistic multi-turn audio-ready scenarios, situations with interruptions or changed plans, message comprehension, speaker/source attribution, independently authored oral/typed responses, misconception-specific recovery and truly delayed contextual recall. Reuse browser-native or existing listening audio paths; do not invent recordings, measured listening performance or a parallel review engine. The P55 title here is a continuation proposal; no authoritative P55 title was found in the accessible default-branch code search.
