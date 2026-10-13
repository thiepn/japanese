# THIEPN Japanese P60 — A2 Course Consolidation & Independent Review

## Source-only development boundary and exact ancestry

- Parent: `feature/p59-independent-a2-performance-missions`, verified by an **identical** GitHub commit comparison against `0c10672c29309134b3f5b064204944e094c31e41` before the child branch was created.
- Development child: `feature/p60-a2-consolidation-independent-review` (no PR, merge or production modification).
- The code is **committed**, but its runtime, TypeScript compilation, browser/device TTS and Japanese proofreading are **NOT_RUN**. Do not report verified performance, learner scores or a released application.

## 20 new original cumulative A2 lessons

Five new lessons in each of `consolidation60-corpus-a.ts`, `-b.ts`, `-c.ts` and `-d.ts` consolidate the existing original Japanese A2 progression. The scenarios cover realistic library rules and lending deadlines, last transport services, unclear bookings, professional and personal communication, requests and updated plans, speaker-dependent interpretation, local volunteering, academic source and quotation accuracy, workplace shifts, safe access, honest learner reflection, separate authorizations, changing room capacity and practical correction.

Each newly authored scene contains all of the following separate original instructional content:
1. Three connected Japanese practical documents or information paragraphs, with their own attributions and precise German glosses.
2. Two practical Japanese messages with author roles and independent German support.
3. Three original Japanese speaker-attributed dialogue turns, available through optional **device/browser SpeechSynthesis** or a readable transcript. Synthetic TTS may use the same voice for multiple speakers. These are not recordings or verified listening assessment.
4. Two source- and speaker-evidence questions, with two independently authored natural model answers each, a plausible misconception and a source-grounded explanation.
5. One independent practical Japanese strategy decision, with two plausible well-supported options and one authored trap.
6. One independent multi-sentence Japanese writing task with original model alternatives and specifically explained misconception.
7. A newly received Japanese partner update requiring changed communication, with German support, two original replies and explanation.
8. A deliberately false authored practical Japanese message and two model revision responses with explanation.
9. A *different* unseen later situation, unrelated to the original scenario's exact facts, with independently authored Japanese models and corrective explanation.
10. An original grammar/meaning contrast with read-only cross-reference to existing P53 lexical families; written-form attestation is explicitly distinguished from thematic association.

The cumulative progression has four levels: guided cross-source comprehension; independent multi-source response; progressive source hiding and self-correction; more independent communication. In stages 3–4, the learner chooses when to expand the long reading sources, rather than being shown every detail up front.

All new Japanese and German sentences are first-party THIEPN-original authored material. Marugoto A1/A2 and other uploaded publisher materials are didactic **reference-only**; no publisher passages, exercise pages, illustrations or commercial recorded audio are copied.

## 140 new native original StudyPlayer prompts

`consolidation60.ts` emits **20 × 7 = 140** stable source prompt identities:

| Per lesson | Number | Stable ID |
| --- | ---: | --- |
| Written/spoken-source evidence questions | 2 | `p60-question-<id>-q1/q2` |
| Practical choice with independent justification | 1 | `p60-strategy-<id>` |
| Own Japanese writing | 1 | `p60-writing-<id>` |
| New spoken/written follow-up | 1 | `p60-followup-<id>` |
| Demonstrable misconception revision | 1 | `p60-revision-<id>` |
| Genuinely different delayed transfer | 1 | `p60-return-<id>` |

Each prompt reuses canonical `StudyPrompt` contracts, `primaryTarget`, `cueFamily`, original Japanese answer normalization, `sourceId:"thiepn-original"`, `contentVersion:"p60-1"`, original Account owner and StudyEvents/FSRS authority. Historical stable IDs P23–P59 remain unchanged.

The finite authored-model comparison **does not semantically grade any arbitrary natural Japanese paragraph**. Unknown free formulations are unassessed, not presumed wrong. Typed native answers still use the original accepted-example grading contract and are not evidence of independently measured auditory performance or CEFR/JLPT certification.

## P40–P59 original course discovery and evidence-aware review

`p60HistoricalSources` reads existing original P40–P59 prompt identities and actual owner-scoped StudyEvents/MemoryTraces. It provides read-only navigation and transparent original status labels:
- `due`: a genuinely due original FSRS trace;
- `needs-repair`: a latest graded incorrect original answer, **not necessarily due now**;
- `unseen`: no matching original graded event or memory;
- `previously-practiced`: original evidence present but no current genuine due status.

Original historical transfer prompts are **excluded from general source discovery** until their original return/review authority is satisfied. Direct history clicks resolve the actual original prompt through a specialist `source60:<promptId>` route; no copy of the source's events or grades is created. Native six-track navigation covers conversational repair P40–P45/P56, source reading P46/P48/P49/P54, device-supported listening P47/P55, cumulative grammar/vocabulary P51–P53, functional writing P57, and P50/P58/P59 integrated missions. Filters support original phase, track, status, source unit and phrase search.

The new `consolidation60:<id>` and `consolidation60-kind:<id>:comprehension|strategy|writing|followup|revision|return` specialist routes are unit-scoped and reuse `journey27`, `StudyPlayer`, `StudyEvents` and `FSRS` rather than introducing additional grading or persistence. First-time unseen P60 delayed-transfer content is only accessible after genuine due source comprehension evidence or an independently graded source answer at least 24 hours old; unlocking does not itself fabricate an FSRS due date. Explicit existing `return:` and `return-due:` histories remain authoritative.

## Learner-facing native Learn and writing continuation

`P60ConsolidationStudio.tsx` and `p60-consolidation.css` provide:
- a coherent A2 completion route without claims of proficiency certification;
- 20 original curriculum entries in four stages and a four-step reading / listening-response / own Japanese writing / reflection sequence;
- original P40–P59 searchable read-only source catalog and six practical learning tracks with genuine original-review statuses;
- source meaning reveal on learner request, progressive late-stage source hiding, optional device TTS playback, and optional transcript display;
- independent practice with source-specific comprehension, pragmatic choice, original written communication, updated reply and specific correction;
- German support, original vocabulary and grammar contrasts, and Japanese models shown only after a learner attempts a response;
- unobtrusive mobile/keyboard and IME controls;
- direct links to actual original StudyPlayer practice, original ungraded Learn multi-draft writing workflow and genuinely separated late-return practice;
- navigation to the next original A2 source case without creating a new progress ledger.

`P27LearningJourney.tsx` mounts the course consolidation screen and routes the same learning activities through the original owner scope. Existing writing and revision work remains ungraded, scheduler-excluded and ephemeral; unsent Japanese drafts are not written to a new persistent store. Source-based `remediation36.ts` explains chronology, speaker/source status, independent writing, revision, and nonfabricated approvals without disclosing unseen answers early.

## Safeguards and limitations

- No duplicate assessment/grading, Account, owner authority, FSRS scheduler, practice store or migration.
- No fabricated existing learner marks, completion certificates, CEFR or JLPT achievements, measured listening or spoken output.
- No copy of protected Marugoto/publisher dialogue, artwork or recording.
- No raw private user writing or spoken recording persisted without permission.
- **NOT_RUN**: TypeScript check, all tests/builds/CI/GitHub Actions, browser/mobile/device/audio acceptance, database or service qualification, independent Japanese editorial review.
- **NOT_DONE**: PR, merge, deployment, release, migration, production or paid-resource access.
- Historical review labels express original events and FSRS trace state, not formal mastery of entire language abilities.

## Post-P60 source and release work (separate authorization)

P41–P60 original content-first roadmap reaches its planned A2 consolidation milestone in source. It is **not equivalent to release readiness**. Remaining practical work includes a dedicated user-authorized source/content editorial review; issue-by-issue native route and type-safety resolution; account-owner and privacy boundary verification; accessible desktop/mobile/manual acceptance; browser and Japanese device voice behavior; measured quality and user-study usability; and, only once explicitly approved, controlled test/build/CI, PR review, merge and deployment. These activities should be separately requested and should not be reported as done merely because source files exist.

An optional next implementation-only child phase could improve course usability and source continuity without running release qualification, but the P41–P60 original roadmap is otherwise complete in committed development source.
