# THIEPN Japanese P60 — A2 Course Consolidation & Independent Review

## Scope and ancestry

- **Required prior P59 branch:** `feature/p59-independent-a2-performance-missions` was exactly verified at commit `0c10672c29309134b3f5b064204944e094c31e41` before making a branch (`compare_commits`: `identical`).
- **Distinct direct P59-child development branch:** `feature/p60-a2-consolidation-independent-review`.
- Main, production and historical stacked development branches are not merged or modified.
- P60 is **an original learning implementation**, not an authorization for tests, builds, CI, deployment, credentials, migrations, production access or external paid services.

## Cumulative original Japanese A2 learning corpus

Four new independent THIEPN-first-party corpora each contain **five** substantially written original A2 lessons: **20 new cumulative scenarios** in four progressively less scaffolded stages.

| Corpus | Five detailed practical themes |
| --- | --- |
| `consolidation60-corpus-a.ts` | Library extension versus return; rescheduled group meeting; independent listening summary; permitted shift exception; refund authorization versus actual receipt |
| `consolidation60-corpus-b.ts` | Housing inspection versus repair; community venue/capacity; independent academic source comparison; individually changing medical appointments without medical advice; family/school notice correction |
| `consolidation60-corpus-c.ts` | Approved student event and revised fire safety capacity; disrupted travel and still-uncertain tickets; private photos versus approved publication; neighbor noise without unsupported blame; honest language self-review |
| `consolidation60-corpus-d.ts` | Source-based final report with submission verification; accessible event entrance versus attendee confirmation; numerical evidence with changed research scope; cumulative long message with multiple changing venue constraints; next-stage independent-language practice and realistic self-reflection |

Each original scenario contains:
1. **Three original multi-sentence Japanese practical source passages** with individual German meaning annotations and speaker/source provenance.
2. **Two independent messages** in original Japanese with precise German meanings and attributed authors.
3. **Three Japanese oral-dialogue turns** with named speakers and original German meanings. Optional local browser/device SpeechSynthesis plays the Japanese text; **not** prerecorded publisher/native audio, no genuine audio comprehension certification.
4. **Two original answerable evidence-based questions**, each with an original Japanese question, two natural full-response models, a specific tempting misconception, explanatory feedback, and two separately attributed Japanese supporting quotes from written and spoken sources.
5. A grounded **pragmatic strategy decision** with two acceptable original Japanese approaches and a specific flawed alternative.
6. A substantial independent **multi-sentence practical writing task** with two complete Japanese models and authored misconception-specific explanatory feedback.
7. A genuinely unexpected **new Japanese spoken/message update** with separate German annotation, new productive response goal, two original independent replies and corrective instruction.
8. A deliberately flawed original Japanese notice for **source-grounded multistep revision**, two corrected Japanese forms and explanatory repair.
9. An **entirely different, unseen later context**, not displayed in the ordinary Learn lesson. This has two new Japanese model responses, explicit misconception and new German task instruction.
10. Curated P53 vocabulary links with **exact-source-written-form attestation** differentiated from thematic support; grammatical contrasts and communication roles explicitly explained.

The four stages increasingly require self-directed cross-source chronology, real approval and capacity conditions, register, contextual vocabulary, independently drafted longer Japanese and correction without premature model reveal.

**Original authored source/turn components:** 20 × (3 written passages + 2 messages + 3 spoken turns) = **160 source passages or speaker turns**, each with independent Japanese and German support.
**Stable native StudyPlayer prompts:** 20 × (2 evidence comprehension + strategy + writing + new follow-up + multi-part revision + hidden delayed new context) = **140 original prompts**.

## Original native learner and scheduling architecture

- `consolidation60-types.ts`, `consolidation60-corpus-a.ts` through `-d.ts`: typed independent first-party Japanese teaching content; no new learner-state authority.
- `consolidation60.ts`: original authored registry, source-aware P53 vocabulary linkage, original P60 prompt adapter, exact model comparison clearly marked non-semantic, read-only original review evidence, and a six-path historical source navigation map.
- Every P60 prompt uses a stable `p60-...` source ID, `sourceId:"thiepn-original"`, `contentVersion:"p60-1"`, original `primaryTarget`, `cueFamily`, `contextId`, original Japanese answer normalization and existing StudyPlayer event writer. The six activity types are question (two), choice, writing, follow-up, revision and gated unseen transfer.
- `runtime.ts`: P60 original prompts appended to the same canonical Learn/Today prompt sets and original FSRS due logic. An authored new prompt is not automatically due.
- `journey27.ts`: native unit-scoped `consolidation60:<id>`, `consolidation60-kind:<id>:comprehension|strategy|writing|followup|revision|return` and **`source60:<exact-prior-prompt-id>`**. The historical selection points to an actual original prompt already in the existing catalog, rather than duplicating content or grading. Existing source IDs P40–P59 remain unchanged. Hidden new returns are excluded from ordinary sessions and only first become accessible based on existing due original comprehension MemoryTrace or a real graded first-source StudyEvent at least 24 hours old. An unlocked transfer is **not automatically FSRS-due**.
- `P60ConsolidationStudio.tsx`, `p60-consolidation.css`: responsive four-stage course shell with 20 original lessons, source reading, optional German annotations, optional non-recorded device-TTS dialogue, new source question/strategy/writing/follow-up/revision task, answer models only after the learner attempts, hidden delayed changed-context handoff, vocabulary/collocation connections and practical onward reflection.
- `P27LearningJourney.tsx`: mounts the course completion component, uses genuine original owner-scoped `StudyEvents` and `MemoryTraces` to derive due/last-wrong/unseen status; reads original P40–P59 prompts through a unified historical catalog; opens exact original prompt IDs in StudyPlayer. Reuses original ungraded draft/revise/compare Learn workflow, with no new draft store or grade writer.
- `remediation36.ts`: source-specific existing native misconception repair for chronological changes, source hierarchy, permission, register, incomplete actions, independent writing, and unseen returns.

### Six original-source learning routes (P40–P59)

Historical source discovery is **read-only**, based on actual original prompt IDs, declared original unit provenance, and existing owner-scoped evidence. It hides unseen return prompts and supports filtering by original phase, thematic pathway, actual status, unit and search.

The six navigable routes are:
1. Speaking, pragmatics, conversation repair: P40–P45, P56.
2. Connected reading and source attribution: P46, P48, P49, P54.
3. Listening and attributed dialogue: P47, P55.
4. Contextual grammar and vocabulary: P51–P53.
5. Multi-message independent writing and revision: P57.
6. Integrated practical independence: P50, P58, P59.

The dashboard shows counts of genuinely source-backed original prompts, previously graded prompt attempts, authentic original FSRS-due cards, and last-incorrect original attempts. **A wrong answer does not become FSRS-due simply because it was wrong**, and the dashboard does not invent percentage mastery or CEFR/JLPT grades. The next review entry opens the real original StudyPlayer prompt, not a replacement evaluator.

## Consent, copyright, and assessment boundaries

All new Japanese passages, dialogue, German annotations, questions, response models, grammar notes, alternative answers, practical letters, misconception notes, revision prompts and previously unseen returns are written as THIEPN-original material. User-attached Marugoto A1/A2 and other copyrighted Japanese publisher files remain **teaching references only**; publisher-owned text, audio, artwork, data tables and exercises were not copied.

Native free-writing editor drafts remain ephemeral and its events source-qualified, ungraded and `schedulerExcluded:true` through the original event path, with no private full-draft persistence or fabricated FSRS memory writes. Exact authored examples can be recognized by finite string matching, but this is **not full Japanese semantic grading**: different natural valid responses may remain unassessed or fail finite native StudyPlayer acceptance. Device speech synthesis produces **no recorded human audio or validated listening assessment**.

P60 is original A2-targeted instructional content, **not** an earned CEFR A2 certificate, JLPT result or global mastery assessment. Unit navigation and source-level code were edited and inspected only.

**NOT_RUN:** all tests, TypeScript compiler, builds, CI/GitHub Actions, browser QA, mobile accessibility acceptance, actual audio synthesis/listening, integrated learner-state runtime, privacy acceptance and native-speaker Japanese editorial review.

**NOT_DONE:** PR creation, merge, migrations, production access, deployments, credentials, paid services, external native voice installation, publisher copying, new progress/grading stores.


### P60 source-choice assessment boundary (final correction)

The native P60 **writing, follow-up, revision and unseen transfer** StudyPrompts intentionally use the *original* `form_selection` / `choice` mode: two original context-supported Japanese responses and one specifically wrong source-trap. These are the only alternatives the original graded StudyPlayer records for those modalities. Truly independent user-authored longer Japanese text is composed in the existing ephemeral P60 studio and original multi-draft Learn writer and remains **ungraded** and scheduler-excluded. A matching correct choice is **not** an assessed grade of the learner's separate open writing; no semantic evaluator or private draft persistence has been introduced. Source comprehension retains bounded original textual prompts, with no claim of full semantic Japanese assessment. The late-stage reading source panels are initially concealed at stages three and four and expanded only by user choice, without grading or recording the reveal.

## Post-P60 outstanding work / proposed next work

P41–P60 original A2 content phases now have substantial committed source. Before release or making any proficiency promises, follow-up must address:
- Focused source-level integration stabilization and confirmed actual learn-unit navigation for P41–P60.
- Controlled TypeScript/runtime checks, only **if explicitly authorized in a future request**.
- Native Japanese teaching-content editorial review; accessibility and keyboard/mobile checks; device-Japanese-TTS behavior and fallback.
- Real guest/account isolation and IndexedDB/FSRS data integrity validation in authorized environments, including due-only returns and old source IDs.
- A deliberate PR review and merge sequence over all stacked branches before any production deployment; explicit separate authorization required for PRs/CI/merging/deployments.
- Post-A2 next-level teaching should begin as independently authored new material, without implying that completing these exercises alone proves B1.

A suitable next development batch is **Post-P60 R1 — Native Course Integration & Source-Level Stabilization**, preserving the original main/production branches and explicitly requesting approval before any tests, builds, PRs, merges or release activities.
