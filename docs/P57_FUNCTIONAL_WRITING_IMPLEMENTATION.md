# THIEPN Japanese P57 — Functional A2 Writing & Multi-Message Communication

## Exact ancestry
- Required previous original development branch: `feature/p56-spontaneous-a2-interaction-repair`.
- Requested parent commit `ae1f53001f543a9dd363aeb20aedf68ba00af21a`, confirmed `identical` with GitHub comparison immediately before creating P57.
- Separate P56-child branch `feature/p57-functional-a2-writing-messages`.
- No previous branch, main, production, existing source IDs or user data rewritten.

## Substantive original curriculum implementation

**35 first-party original connected written A2 exchange scenarios**, with **147 fully authored Japanese messages**, each containing a separately authored precise German meaning explanation and attribution to its actual sender:
- `writing57-corpus-a.ts` — 7 threads, four-message reservation, library, transport, classroom, event, delivery and absence exchanges.
- `writing57-corpus-b.ts` — 7 threads, four-message professional, clinic, room, feedback, civic, school and lost-property correspondence.
- `writing57-corpus-c.ts` — 7 threads, four-message transportation, housing, workplace, social, administration, food and working-hours messages.
- `writing57-corpus-d.ts` — 7 threads, four-message privacy, community collection, event planning, updated sources, neighbor mediation, volunteer rosters and tour communication.
- `writing57-corpus-e.ts` — 7 cumulative five-message exchanges connecting competing sources, changing travel details, confirmed room capacity, correction approvals, learner reflections, family travel and public notice corrections.
- **Total: 35 distinct threads**, original full written content, 4 visibly staged learner progressions (7/14/7/7).

Every scene includes **two independently answerable Japanese source-evidence comprehension questions**, each with two originally authored Japanese models, plausible incorrect reply, contextual explanation, and Japanese quote from an original sender. Themes include chronology, writer identity, pending-versus-confirmed state, cause, permissions, deadlines, distinctions between invitation and participation, source recency, planned action and completed action.

Every scene further includes:
1. An original **independent multi-sentence message composition** task in a new setting, two natural Japanese model variants, a specific misleading solution and nuance explanation.
2. A newly authored unexpected incoming message with Japanese wording plus distinct German meaning, an independently answerable **next reply** task, two authored models, a misconception and context-specific correction. Later replies can override dates, capacities or conditions from previous messages.
3. A **specific flawed first draft**, context-driven repair instruction, full independently authored model rewrite and alternative, and explanation of the factual, pragmatic or register error. These are independent curriculum examples, not the user's private draft.
4. A **genuinely new unseen later situation**, varying speakers, dates, tasks, circumstances and grammatical choice, with original models, misconception and explanation. The later situation is not presented in the learner-facing reading or writing studio before unlocking.
5. A register label, text-interpretation contrast, and P53 read-only vocabulary links. Each link is identified as an actual written attestation **only when the exact written form appears in the original Japanese source messages**; others are labeled as thematic references, with no invented evidence.

### 210 stable native prompts
`writing57.ts` registers precisely **6 prompts per thread**: two comprehension, one independent composition, one unexpected continuation, one misconception-specific rewrite, and one delayed changed-context return. **35 × 6 = 210 original prompts** using `StudyPrompt` and original `sourceId:"thiepn-original"`, `contentVersion:"p57-1"`, `primaryTarget`, `cueFamily`, `contextId`, Japanese normalization and native source/owner metadata.

- `p57-question-<thread>-q<N>`
- `p57-compose-<thread>`
- `p57-reply-<thread>`
- `p57-revision-<thread>`
- `p57-return-<thread>`

**No new vocabulary authority, scoring algorithm, queue or database was created.** Existing native typed prompts have a finite authored answer match, **not comprehensive free-writing semantic grading**. The local P57 studio distinguishes explicitly matched authored models, known misconception and otherwise **unassessed**. Successful source-model matches do not certify A2 proficiency.

### Native practical integration
- `writing57-types.ts` provides original question, genre, source message, task, revision and delayed return contracts, independently of UI state.
- `writing57-corpus-a.ts` through `-e.ts` contain all original Japanese and German material, not Marugoto reproductions.
- `writing57.ts` binds corpora to the original native typed StudyPlayer schema and stable source identifiers, four-stage progression, P53 vocabulary read-only references, and finite original model comparison.
- `P57WritingStudio.tsx` / `p57-writing.css` mount a real searchable, register-aware, responsive and keyboard-usable original writing experience. It displays complete multi-sender message chains with hidden optional individual German translations, evidence-based Japanese answers, source-specific independent composition, an unexpected follow-up, model reveal **only after the learner has first attempted the current task**, a separate independent revised draft and original Learn editor handoff. It never sends messages or keeps draft data in persistent browser storage.
- `runtime.ts` adds P57 source prompts to the **existing Today due** and original Learn global study catalogue.
- `journey27.ts` uses unit-scoped `writing57:<id>`, `writing57-kind:<id>:comprehension|compose|reply|revision|return`, and original `return:<id>` / `return-due:<id>`. Never-seen delayed P57 prompts are excluded from ordinary new sessions and require real return eligibility.
- `P27LearningJourney.tsx` mounts the writing studio inside the original owner-protected Learn workspace, uses actual mistakes to suggest a relevant text, and continues the original multi-stage **ungraded** writing/draft/revision editor, without raw private text persistence. The original StudyEvents / FSRS processing stays the sole progress authority.
- `remediation36.ts` extends native misconception-specific revision advice for multi-source chronology, pending status, explicit written evidence, unconfirmed requests, misleading drafts, delayed return and novel follow-up conditions.

### Delayed return and privacy model
A first genuinely unseen P57 return is only available after the **first original comprehension prompt** has either a due native FSRS MemoryTrace or a real graded original StudyEvent at least 24 hours old. A previously created return trace can be reopened in the original practice flow. This **does not fabricate due dates**; native `return-due` and Today continue to rely on the actual original MemoryTrace `card.due`.

The P57 local studio's freeform drafts and second revisions exist only in ephemeral React component state; they are not sent, uploaded, evaluated semantically or saved. The original Learn editor's explicit ungraded revision events keep `schedulerExcluded:true` and no raw unsent text. Any independent StudyPlayer typed answer uses **only the existing original StudyPlayer / FSRS writer**. Natural valid Japanese outside the finite model strings can still be treated differently by the original exact-match engine; therefore users must not interpret its graded scores as a reliable evaluation of arbitrary free composition. No automated general-purpose writing critic or novel custody process was introduced.

### Intellectual-property and qualification boundaries
All paragraphs, messages, directions, alternate replies, corrections, translations and explanations are separately authored THIEPN-original material. Uploaded Marugoto A1/A2 textbooks, grammar manuals, kanji references and media remain **reference-only**, with no copied publisher text, audio or exercises. Target is practical A2 written communication, with a few original formal institutional phrases stretching toward A2+; no official JLPT or external CEFR certification asserted.

### Explicitly excluded operations and current evidence
**NOT_RUN**: automated tests, TypeScript/ESLint, builds, CI/GitHub Actions, browser/device QA, end-to-end flow, human native-speaker review, source evidence audits and release qualification.

**NOT_DONE**: PR creation, merge, migration, deployment, production/database activity, credentials, paid services, alternative grade writers, duplicate learner stores.

**P58 proposed next phase:** **Integrated A2 Practical Missions & Independent Communication Transfer**. A content-first continuation of P49/P54 documents, P55 listening, P56 branching repair and P57 writing: ≥35 original multi-skill real-life tasks requiring comprehension across a message, practical document and spoken/contextual instruction, new independent Japanese writing and pragmatic reply, multiple-turn corrections, evidence-based summary, and delayed unseen cross-skill transfer. Reuse original StudyPlayer, Learn/Today, StudyEvents, FSRS, original Account, rights and stable IDs. The P58 title is a proposed continuation: no authoritative P58 heading was found in the accessible default-branch repository search.
