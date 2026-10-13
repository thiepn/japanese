# THIEPN Japanese P59 — Independent A2 Performance Missions & Cumulative Transfer

## Verified ancestry, source only

- **Requested direct parent branch** `feature/p58-integrated-a2-practical-missions`; exactly verified on GitHub as `566150b3ab1df9014d4208353e652d6e8e39ccbc` (`compare_commits` status identical before branching).
- **Separate P58-child development branch** `feature/p59-independent-a2-performance-missions`.
- Previous historical phase branches, original main and production left untouched; no PR or deployment.

## 35 substantial first-party original A2 performance missions

Five independent corpora each contain **seven** newly authored multi-source practical scenarios; total **35 original missions** and **four intentionally staged levels of decreasing assistance**:

| Corpus | Stage | Seven distinct substantive practical settings |
| --- | --- | --- |
| `performance59-corpus-a.ts` | 1: evidence orientation | Market pickup with missing number; changed cooking class; lost bicycle key with negative identification; concert seats; approved shift exception; two interlocking family appointments; authorized public cleanup notice |
| `performance59-corpus-b.ts` | 2: cross-source autonomy | Academic quotation and portal deadline; separated clinic appointment times; parcel redelivery; current bicycle path safety; multi-gate school-photo permissions; cumulative pricing and shipment; accessible campus welcome |
| `performance59-corpus-c.ts` | 2: contextual independence | Complex train connection; workshop capacity and access; repair estimate without approval; volunteer cleanup with changed weather; truthful Japanese self-reflection; public-poster authorization; separate permissions and deadline |
| `performance59-corpus-d.ts` | 3: meaningful multi-constraint repair | Confirmed seminar attendees versus safety capacity; genuine lost luggage evidence; accessible community gathering; food ingredient uncertainty; museum ticket versus tour booking; changing school notice; corrected communication |
| `performance59-corpus-e.ts` | 4: cumulative independent performance | Three-source research and cause/hope distinctions; family travel and unavailable connection; venue capacity renegotiation; incorrect invoice split and authorization; accessible visitor routing with late opening; cumulative first-party local community-language-event capstone; multi-actor written correction |

**Each original mission contains all of:**
1. **Three original longer connected Japanese source passages** (typically multi-sentence notices, source summaries or practical rules) with separate German support.
2. **Two original Japanese practical written messages** from explicitly attributed speakers, each with German meaning support.
3. **Four original attributed Japanese spoken turns**, each with precise separate German support. Optional original browser/device TTS reads these, **not prerecorded publisher audio or real measured listening performance**.
4. **Three independently authored source-based Japanese questions** (105), each with specific Japanese question, two full authored response models, tempting misconception, misconception-specific Japanese/German explanation, and **separate textual and spoken/source excerpts** supporting the answer. Modes cover chronology, evidence, actual status, pragmatic intention, informed inference and speaker attribution.
5. An independent **strategy choice** with two suitable original Japanese approaches, a plausible mistaken option and authored pragmatic feedback.
6. A new **independent multi-sentence practical Japanese writing assignment** with two original natural model paths, explicit known wrong interpretation and specific explanation. Learners first write, **never auto-score arbitrary free Japanese**.
7. A genuinely **unexpected new partner response** in Japanese with German gloss, meaningful changed communicative aim, two original replies and misconception repair.
8. A specific **flawed original message and source-aware correction task** with two corrected Japanese forms and concrete explanatory feedback. The flawed message is curriculum text, not a private real draft.
9. An entirely **different new unseen delayed cross-context transfer** situation with two original Japanese model replies, specific misconception and explanatory notes, withheld from the ordinary Learn display.
10. P53 context-checked vocabulary and contrast notes; stable historical materials are **referenced read-only** through native same-unit P49 document, P54 connected reading, P55 listening, P56 pragmatic repair, P57 writing and P58 source-integrated practice. These are **different independent scenarios**, not a fabricated historical chain.

With **three source passages, two messages and four dialogue turns per mission**, the additional original corpus provides **315 individually authored source statements / attributed speech turns** with corresponding German meanings, not just 35 isolated sentence cards. The natural writing tasks contain multiple substantive sentences and constraints; later missions progressively introduce longer and interacting conditions.

### Stable native 280 StudyPlayer prompts

`performance59.ts` maps the **35 × 8 = 280** authored practice cues into the original canonical `StudyPrompt` format:

| Per mission | Count | Stable ID |
| --- | ---: | --- |
| Source-evidence questions | 3 | `p59-question-<mission>-q<N>` |
| Independent strategic choice | 1 | `p59-strategy-<mission>` |
| Independent multi-sentence writing | 1 | `p59-write-<mission>` |
| New partner reply and adaptation | 1 | `p59-reply-<mission>` |
| Meaning-specific correction | 1 | `p59-revision-<mission>` |
| Entirely new unseen delayed context | 1 | `p59-return-<mission>` |

The original `sourceId:"thiepn-original"`, `contentVersion:"p59-1"`, `primaryTarget`, `cueFamily`, `contextId`, learner-owner metadata, Japanese answer normalization, original StudyPlayer, original StudyEvents and original FSRS MemoryTraces are reused. No parallel persistence, duplicate grading writer, new account or scheduler is introduced. The native typed prompt matches two **finite authored examples**; it **cannot reliably grade arbitrary valid free Japanese prose**. The ungraded P59 studio explicitly treats unknown formulations as unassessed. A visible StudyPlayer transcript and optional device TTS **cannot be reported as verified spoken or listening competence**.

### Native learner-facing integration

- `performance59-types.ts`: typed source authoring contracts, three questions, three longer Japanese texts, two original messages, four spoken turns, independent strategy, writing, reply, repair and untouched unseen return.
- `performance59-corpus-{a,b,c,d,e}.ts`: substantial original Japanese/German mission manuscripts.
- `performance59.ts`: native 280-prompt mapping, original source IDs, actual P53 exact written-form evidence marking, progressive four-stage labels, read-only historical same-unit handoffs, bounded finite Japanese comparison.
- `P59PerformanceStudio.tsx` + `p59-performance.css`: responsive, accessible and IME-composition-aware original Learn mission studio. It offers searchable mission selection, progressive control of source reveal (stages 3–4 initially withhold long reading source), optional German per excerpt, optional device SpeechSynthesis TTS with readable transcript on request, three genuinely independent evidence questions, two sensible strategic paths, free Japanese drafting, new follow-up, original correction, after-attempt reveal of the complete model and evidence, and links to native original StudyPlayer routes and ungraded original Learn writing editor. Drafts stay ephemeral local component state; no new private data store or audio recording.
- `runtime.ts`: includes P59 prompts in canonical **Today due-only FSRS** and original global learning catalogue. Fresh P59 return items never enter an ordinary new queue as invented due cards.
- `journey27.ts`: source unit-scoped original `performance59:<id>` and `performance59-kind:<id>:comprehension|strategy|writing|reply|revision|return`; retains original `return:<id>` and `return-due:<id>` history. Genuinely unseen first returns require an earlier original source question with **actually due FSRS MemoryTrace** or **actually graded first StudyEvent at least 24 hours old**. Later native reviews keep original authoritatively scheduled due dates. Unlock does not fabricate mastery or an FSRS due date.
- `P27LearningJourney.tsx`: mounts source-aware P59 studio and recommendations from real owner evidence; transitions to original staged Learn draft/revise/compare, records only source-qualified **ungraded** `StudyEvents` through the existing mutation path with `schedulerExcluded:true` and `rawTextStored:false`. Original owner ID, study traces and source selections respected; no unsent free-text persistence.
- `remediation36.ts`: native P59 source-appropriate hints for long-source chronology, conflicting statements, explicit authorization, status/capacity distinction, pragmatics, independent letter production, repairs and delayed recall.

### Materials, rights and honest qualification

All newly written Japanese paragraphs, transcripts, German translations, questions, examples, correction cues and unrelated return scenarios are separately authored THIEPN-original materials. Historical P43–P58 original THIEPN source identity and existing native learner state remain intact. User-attached **Marugoto A1/A2, publisher audio, grammar and kanji resources are reference-only**; no copyrighted book dialogue, lesson texts, artwork or audio was copied.

P59 is functional A2-targeted pedagogy; no official JLPT, CEFR-certified mastery, real-user audio assessment or human Japanese review is claimed. Browser voices, if present, are device-synthetic and cannot prove native pronunciation quality.

**NOT_RUN:** tests, builds, compiler/linter, CI/GitHub Actions, browser/mobile QA, device TTS/audio acceptance, end-to-end learning or account runtime verification, independent Japanese proofreading and pedagogical certification.

**NOT_DONE:** PR creation, merges, migrations, production/deploy access, database and credential activity, paid services, alternative Account/FSRS/StudyEvent authority.

## Proposed P60 — A2 Course Completion & Consolidated Independent Practice

Next content-first implementation would consolidate P41–P59 into substantial original A2 wrap-up: new cumulative scenario content, independent reading–listening–writing–response learning paths, source-aware revisit and repair, self-reflection without fabricated proficiency judgments, original StudyPlayer/FSRS owner-authoritative practice, and a learner-friendly coherent transition into later content. A **phase 60 proposal**, not asserted to be an audited pre-existing official roadmap title. Keep earlier stacked branches, main and production unchanged; no automated testing/CI/deploy unless newly authorized.
