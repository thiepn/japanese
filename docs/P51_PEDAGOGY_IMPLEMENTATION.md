# THIEPN Japanese P51 — Contextual A2 Grammar & Meaning Contrasts

**Exact original source parent:** `feature/p50-integrated-japanese-comprehension` at `74c1fe6d9f9a696cef1c7d42874018dbe1e4b09a`.
**Isolated child branch:** `feature/p51-contextual-a2-grammar-contrasts`.
**Mode:** IMPLEMENTATION ONLY, content-first. No tests, TypeScript checks, builds, CI, browser/device QA, PR, merges, migrations, deployment or production access.

## Original content delivered

Five original first-party content corpora (`grammar51-corpus-a.ts` … `-e.ts`) contain **50 distinct A2-targeted contextual meaning contrasts**, **150 original Japanese sentence examples**, **50 independent Japanese production tasks** and **50 genuinely changed-context recall situations**. Each unit includes two compared Japanese structures, different communicative meanings, an actual conversational situation, named listener/role, register choice, form-usage explanation, three original illustrative Japanese sentences with original German glosses and context-specific explanation, a plausible category-level misconception, specific repair advice, one learner-directed production context with two original possible Japanese answers, one erroneous model and targeted feedback, and a different communicative scenario for independent delayed return. Content references previous P23–P50 study functions as instructional linkage, not copied exercises.

**Curricular groups:**
1. `grammar51-corpus-a.ts` (10): ongoing action versus resulting state, habitual versus current actions, before/after sequence, timing of とき, もう/まだ, あとで/てから, ながら/たり, preparatory ておく versus experimental てみる, completion/regret てしまう, intentional てある versus resulting ている.
2. `grammar51-corpus-b.ts` (10): たら/と/なら/ても, ので/から, のに/けど, ために/ように, opinion versus possibility, hearsay versus thinking, visual appearance versus hearsay そう, inferential よう and indirect らしい.
3. `grammar51-corpus-c.ts` (10): permission versus requests, prohibition versus obligation, optional versus required, expectations versus normative advice, self-wish versus wish for someone else, personal intention versus scheduled plan, mitigated request versus direct polite request, giving/receiving favors and perspective, evidence-strength predictions.
4. `grammar51-corpus-d.ts` (10): comparisons with より/ほうが, comparative versus superlative, だけ/しか, quantities versus graded ほど, activity versus existence place particles, direction and endpoint particles, closed versus open noun lists, becoming versus active causation, potential versus ことができる, object wish versus action wish.
5. `grammar51-corpus-e.ts` (10): experiential たことがある versus occasional ことがある, acquired ability versus current potential, degree すぎる versus ease やすい, ease やすい versus difficulty にくい, continuous 間 versus event 間に, ないで versus ずに, embedded yes/no versus content questions, exclusivity だけ versus one-sided ばかり, personal ことにする versus established ことになる, naming という versus being called と呼ばれる.

The corpus recognizes non-absolute subtleties (e.g. 〜ています can mark routines, 〜ので and 〜から can both occur in polite sentences, 〜ようだ/らしい nuances vary with evidence). Contrast descriptions are pedagogical context rules, not rigid claims that only a single translation is valid. Some forms have early-A2 to A2/B1-adjacent nuances introduced receptively and through constrained contexts, not certified proficiency.

## Real source architecture integration

- `grammar51-types.ts`: typed original contrast and task contracts.
- `grammar51.ts`: original authoring lookup, unit mapping, limited finite example comparison and **150 native `StudyPrompt` instances**, following stable IDs:
  - **50** `p51-meaning-<contrastId>`: contextual original grammar meaning discrimination with an authored Japanese example.
  - **50** `p51-production-<contrastId>`: original situated independent Japanese production with two authored models.
  - **50** `p51-return-<contrastId>`: independent new-context production without old examples.
- All native cues reuse `primaryTarget`, `cueFamily`, `sourceId:"thiepn-original"`, `contentVersion:"p51-1"`, existing `contextId`, real original course unit IDs, normal Japanese answer normalization and source-owned `eventMetadata`. No parallel learner or assessment authority was added.
- `P51GrammarStudio.tsx`: **50-scenario interactive Learn / Verstehen** workspace; searchable contrasts, topical filters, speaker/audience and register cues, two genuinely different meanings, on-demand choice rule and three Japanese examples, independent original typed answer prior to comparison, misconception-specific bounded feedback, optional original examples only after own attempt, original teaching and error notes, direct native StudyPlayer form-choice/production routes, one-action transition to existing Learn / Schreiben, and new-context voluntary practice.
- The guided interface reports only exact authored matches, one known misconception, or **unassessed** unknown answers. It does **not** mark all unrecognized grammatical answers wrong, invent progress, or count guided exposure as reviewed FSRS.
- `P27LearningJourney.tsx` mounts P51 on the existing original learner route, supports every contrast in original Learn draft → revision → model comparison, carries only the existing safe source metadata through native excluded writing events, and clears selected source when older P40–P50 writing activities are chosen. Existing `StudyEvents` and original owner account remain the sole authority.
- `runtime.ts` extends the original Today and Learn prompt catalog with all 150 canonical cues; `journey27.ts` adds `contrast:<id>`, `contrast-kind:<id>:meaning|production|return` and original unit-scoped session selection. `return:<id>` is voluntary. `return-due:<id>` and native Today/Learn due selection use **only actual `MemoryTrace.card.due` set by the original FSRS engine**.
- `remediation36.ts` adds targeted explanation for A2 conditional, evidential, social, tense/aspect, grammar-writing and later transfer errors, never using a separate grader.
- `p27-journey.css` adds responsive neutral comparison cards, keyboard/touch-accessible controls, Japanese typography, search, narrow mobile stack and correct overflow behavior in the established workspace.

All P51 content-selected canonical P23, P25, P26 unit IDs were compared with the IDs authored in the existing scenario/mission source definitions at **source level** (not a runtime test). Preserved past P23–P50 source records and stable IDs.

## Accuracy, rights and exclusions

The content is **newly authored original Japanese instructional material**. User-supplied Marugoto A1/A2, kanji and grammar books remain **reference only**; no publisher lesson bodies, exercises, audio or images have been reproduced. No credentials, paid models, recorded speech, parallel sync or storage systems were introduced.

**NOT_RUN:** TypeScript checks, build, unit/integration/e2e tests, CI, browser QA, voice QA, expert/native-speaker grammatical verification, audit, PR, merge, migration, deployment and all production operations. GitHub commit/ancestry verification confirms changed source only, not a qualified executable release. Finite answer matching may fail to recognize valid Japanese paraphrases.

## P52 content-first handoff

**P52 — Japanese Sentence Transformation:** author at least **60 substantial original progressive A2 transformations** across intention, register, chronology, conditions, reported uncertainty, potential, contrast, voice and explanatory structure. Require full communicative context, original input and targeted output sentences, variants, misconception-specific explanations, meaningful independent production, limited authored feedback and genuinely unseen delayed transfer. Reuse original P23–P51 Learn, Today, StudyPlayer, StudyEvents and FSRS without duplication or new mastery authority.
