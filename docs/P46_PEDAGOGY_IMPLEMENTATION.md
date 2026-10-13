# P46 — Progressive Japanese Reading Library

**Exact P45 parent:** `feature/p45-conversation-independence-reduced-guidance` at `12a631be8010fdc6a76050c7f13fab0c7e8bffe0`
**Isolated P45-child development branch:** `feature/p46-progressive-japanese-reading-library`
**Scope:** SOURCE IMPLEMENTATION ONLY, CONTENT FIRST.

## Substantial first-party original Japanese materials

- **30 original, two-paragraph A1–A2 readings**, 12 A1 then 18 A2 texts ordered in five six-text source corpora (`reading46-corpus-a.ts` through `-e.ts`). Passage topics deliberately vary beyond flashcard prompts: personal messages, café menus, diaries, community posters, shopping notes, directions, work shifts, product reviews, guest-house policies, recipes, fiction, schedules, changed library activities, community rules, reports, transport delay emails, lost-property interviews, festival updates, neighbourhood businesses, student interviews, housing advertisements, teacher feedback, parcel changes, local short stories, safety instructions, school improvement initiatives, bicycle rental, photo-based narrative, library volunteering and weekend programmes.
- **120 contextual vocabulary records** with original Japanese written forms, Japanese readings, English? **German** word meanings and source-specific Japanese contextual snippets. Every text has exactly four new source-grounded vocabulary records.
- **90 independently authored, passage-grounded comprehension questions**: one verifiable literal detail, one inferential/contrastive question, one intent or significance question per reading. Each contains a Japanese model response, another defensible model, a plausible specific misunderstanding, reasoned correction and an exact quotation-sized original Japanese **evidence snippet** from its own original text.
- **30 original written-response tasks**, grounded in each reading, with authored examples, an explicit misconception and explanation. No existing publisher exercises were transcribed.
- **30 distinct new-context transfer prompts**, one per reading, changing the original times, place, activity, participants, requirement or cause to demand genuinely independent adaptation rather than answer repetition.
- These produce **270 canonical source-owned StudyPlayer cues**: 90 passage-comprehension, 120 contextual vocabulary recall, 30 written production, 30 changed-context FSRS transfer. Stable source-owned IDs `p46-question-<readingId>-q1|q2|q3`, `p46-word-<readingId>-<index>`, `p46-write-<readingId>`, `p46-return-<readingId>`; `sourceId:"thiepn-original"`, `contentVersion:"p46-1"`, canonical `primaryTarget`, `cueFamily`, `contextId`, contextual source IDs, exact original unit IDs. The Japanese source passage remains available for reading comprehension but NOT for unseen changed-context delayed-return cues.

## Real learner-facing implementation

- `reading46-types.ts` and five authored corpora make the teaching content inspectable, immutable by convention and free of a second persistence store.
- `reading46.ts` exposes progressive reading catalog, unit selectors, original-source cues, and explicit **finite** answer-example comparisons. Unknown Japanese responses are *unassessed*, not automatically wrong. It does not pretend to semantically understand arbitrary new language.
- `P46ReadingLibrary.tsx` is added within the existing **Learn / Verstehen** stage. It contains searchable passage library across all 30 texts, A1/A2 filters, ordered passage selection, Japanese-paragraph reading view, optional source-specific context notes, four contextual vocabulary disclosures, three separate original question types, free Japanese typed answers, bounded post-attempt comparison, exact original Japanese evidence, optional models **only after** the learner responds, and direct native StudyPlayer links. The selection, drafts and revealed answers are ephemeral React state with no saved raw text or StudyEvent.
- **Learn / Schreiben** reuses the existing draft → revision → compare UI, offering P46's passage-linked independent original writing task. Opening an authored text from another unit selects that text's established original course unit instead of registering a cross-unit unowned task. Saved optional revision evidence stays `result:"skipped"`, `schedulerExcluded:true`, no raw learner Japanese/audio, only source-owned reading ID and input length.
- **Existing Today / native StudyPlayer / StudyEvents / FSRS** owns grading and history. `runtime.ts` registers all 270 new original prompts. `journey27.ts` handles `reading:<id>` and `reading-kind:<id>:comprehension|vocabulary|writing|return` specialist lessons, requiring the passage's original unit in the canonical course navigator. It reuses the original StudyPlayer and does not create an assessment engine.
- The new-context `return:<id>` is voluntary practice. The existing `return-due:<id>` and due Today review require the actual existing `MemoryTrace.card.due` issued by FSRS, and never create guessed review dates. **Learn / Festigen** displays the original absent/future/due states for these 30 new independent transfer cues, with grounded reading titles. Guided reading, exposure, and writing comparison cannot create an FSRS success.
- `remediation36.ts` provides source-specific, **answer-free** help for detail extraction, inference, text purpose, vocabulary, independent writing and unseen contextual transfer using the existing mistake and practice routing; no new weakness store, progress tracker or recertification.
- `p27-journey.css` adds responsive two-column/one-column reading layout, readable Japanese paragraph typography, searchable document navigation, keyboard focus, accessible inputs and evidence displays. No new home, route, account, scheduler, paid AI, database, or production change.

## Important provenance and evaluation boundaries

- All Japanese texts and German questions/glosses are original first-party language-learning content. The uploaded Marugoto (A1/A2), grammar and kanji reference PDFs remain **reference-only**. No protected publisher dialogs, pages, artwork, screenshots, layouts or audio content were copied.
- Text evidence is cited **from our own authored passage** in each comprehension correction; this is not an external citation. User-visible examples are not guaranteed to exhaust all correct Japanese alternatives. Original-source examples support guided comparisons but do not confer authoritative mastery.
- Reading a source and independently answering a passage question differ from answering a future **new-context** cue without the passage. Native FSRS remains responsible for retention scheduling; guided exposure is neither graded nor scheduled.
- P23–P45 stable prompts, older study events, memory traces, original user/device authority, account isolation and source rights are preserved on the isolated P45-child branch.

## Explicitly NOT PERFORMED

Tests, TypeScript compilation, builds, CI/GitHub Actions, browser/mobile QA, linguistic or academic approval, audits, PRs, merges, deployment, migration, real production access or credential use were **NOT_RUN / NOT_TESTED / NOT_PERFORMED** by user instruction. Source-code presence and GitHub ancestry do not establish verified runtime behavior or linguistic perfection.

## P47 handoff — Listening Comprehension

Implement at least **40 substantial original A1–A2 listening scripts**, structured by listening purpose and progressive difficulty, optional on-device/browser TTS clearly distinguished from recorded native speaker audio, pre-listening predictions and detailed comprehension questions with source-grounded corrections, independent listener responses, and new-context delayed recall. Reuse original Learn, Today, StudyPlayer, StudyEvents and FSRS. No duplicate audio or learner storage, and no implicit automatic semantic voice grading.
