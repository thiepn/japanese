# THIEPN Japanese P53 — Natural Vocabulary Usage

**Exact GitHub parent verified before work:** `feature/p52-a2-sentence-transformation` at `8762be75c9f34d2991b9eeaef319506ab74861e5`. The source parent branch was identical to that exact SHA.

**Isolated P52-child source branch:** `feature/p53-natural-vocabulary-usage`.

## First-party A2 practical language corpus

**207 individually authored original contextual lexical entries** in five new corpus files:

- `vocabulary53-travel.ts`: **41** terms about public transport, directions, schedules, timing and practical travel choices.
- `vocabulary53-services.ts`: **41** terms about shops, payment, return/exchange, ordering, institutions, registration and forms.
- `vocabulary53-study.ts`: **39** terms about studying, research, actual office communication, digital files, device use, publication and repair.
- `vocabulary53-home.ts`: **39** terms about housework, food distinctions, health appointments, prevention, recovery and symptoms.
- `vocabulary53-social.ts`: **47** terms about emotion, social roles, requests, invitations, obligation, register, information status and personal conversation.

Each item includes:
1. A distinct stable ID, original written word, reading and precise German meaning.
2. Two concrete Japanese collocations/word combinations, a lexical nuance and a realistic social or practical scene.
3. One original contextual Japanese sentence with an original German gloss.
4. A situation-specific misconception plus repair (e.g. `発送` versus `配達`, `自由` versus `無料`, `聞く` versus `報告`, `熱い` versus `暑い`).
5. One **independently authored changed-situation production prompt and Japanese model sentence**.
6. A second **new, previously unseen** delayed-return situation, with its own original Japanese sentence; it is not shown in the ungraded Learn studio before eligibility.

`vocabulary53-families.ts` adds authored, searchable cross-entry distinctions, including semantic contrasts, morphology/transitivity links, transaction sequences, emotional/communicative functions and common linguistic alternatives. Every link is read-only learning content based on the original P53 corpus, not another authoritative vocabulary database.

**Native cue total:** 207 contextual meaning prompts, 207 independent production prompts and 207 delayed different-context return prompts = **621 stable first-party `StudyPrompt` IDs**:
`p53-meaning-<id>`, `p53-production-<id>`, and `p53-return-<id>`.

Original source metadata uses the previous `can_do` target mechanism, unique `cueFamily`, `contextId`, `sourceId:"thiepn-original"`, `contentVersion:"p53-1"`, `answerNormalization:"japanese"`, original unit mappings and `eventMetadata`. No duplicate scoring, teacher certification or mastery calculation is introduced.

### Native learner functionality

- `vocabulary53-types.ts`: compact typed 16-field authored entry adapter and explicit independent/return task structures. Stable IDs never depend on display position.
- `vocabulary53.ts`: normal StudyPlayer meaning, independent production and return prompts; exact finite authored sentence checking, situational explanation, original word-family context and misconception repair. Other natural answers may not exactly match the authored models.
- `P53VocabularyStudio.tsx` and `p53-vocabulary.css`: searchable, filtered, responsive and keyboard-usable Learn UI; original written form/readings; two collocations, original scene; alternate first meaning vs independent production mode; independent Japanese text typed before optional authored model; bounded model comparison; explanatory teaching; navigable word-family associations; mobile-friendly paginated item discovery; and direct native practice/writing routes. This practice widget persists **no additional learner text, grades or mastery**.
- `runtime.ts`: registers all 621 source cues with the existing original Today due-prompt catalog and original Learn journey pool. Unseen return prompts do not become automatically due.
- `journey27.ts`: unit-scoped `lexical:<id>`, `lexical-kind:<id>:meaning|production|return` and existing `return:<id>` / `return-due:<id>` native StudyPlayer routes. The new unseen transfer source is excluded from normal new prompt discovery so it cannot be prematurely shown as a familiar item.
- `P27LearningJourney.tsx`: native Learn access, recommended source word on actual lexical mistakes, existing owner-scoped FSRS evidence, real return availability, existing native player handoffs, original ungraded draft/revision system and privacy-safe `StudyEvents` metadata with `schedulerExcluded:true` and no stored free text. Earlier writing selections are cleared on P53 handoff.
- `remediation36.ts`: context- and domain-specific misconception recovery based only on authored prompt metadata.

### Genuine delayed recall rule

The **first previously unseen** transfer for a word is unlocked when either:
- its original native meaning card has an actual FSRS due timestamp that is in the past, **or**
- at least 24 hours have elapsed since a real graded native meaning-card event.

Once an authentic P53 return card exists, it can be practiced voluntarily; a **due** label still requires its own actual existing FSRS `MemoryTrace.card.due`. This never fabricates a review, elapsed training, comprehension score or external backup acceptance. Neither ungraded Learn model exposure nor original writing drafts make a card due.

### Curricular and usage limitations

These are originally written first-party practice sentences, not copied textbook exercises. User-supplied **Marugoto**, Japanese grammar and kanji PDFs remain reference-only: no publisher exercise body, scans, audio or images have been copied. The corpus is **A2-targeted in communicative contexts**, with some domain-specific or A2/B1-adjacent vocabulary (e.g. formal business, health, written institutional processes) as receptive enrichment, not an official level classification.

The finite `StudyPrompt` models cannot recognize all valid Japanese paraphrases. Native typed checking may fail to accept grammatically valid unseen synonyms; the ungraded Learn comparison does not falsely assert that they are incorrect. An expert Japanese language editorial review remains necessary before claiming certified linguistic accuracy.

## Excluded operations

**NOT_RUN:** tests of every kind, TS type checks, builds, CI/GitHub Actions, browser or device QA, runtime acceptance, migration checks, production acceptance, independent Japanese expert verification and qualification audits.

**NOT_DONE:** PR creation, merge, deployment, migration, production operations, credentials/paid services, parallel stores and unauthorized user data operations. P23–P52 content IDs, original owner authority, prior development branches and main remain preserved.

## Next phase proposal

**P54 — Connected A2 Reading & Vocabulary Transfer.** Author substantial original connected everyday written narratives, social messages and practical multi-paragraph texts, reusing P46–P53 vocabulary, grammar, comprehension, independently authored production, evidential/chronological understanding and genuinely changed-context delayed recall. Reuse original Learn, Today, StudyPlayer, StudyEvents, FSRS; make no parallel grading or storage engine. This title is a continuation proposal, not a verified historical roadmap heading.
