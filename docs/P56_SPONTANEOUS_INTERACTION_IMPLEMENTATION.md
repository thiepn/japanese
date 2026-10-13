# THIEPN Japanese P56 — Spontaneous A2 Interaction & Conversational Repair

## Source ancestry
- Requested parent: `feature/p55-connected-a2-listening-spoken-response`
- Parent SHA confirmed with GitHub compare `identical` **before** creating the child: `311de87ee47f1d69d2584818d24848b98107aa0e`.
- Separate stacked P55-child branch: `feature/p56-spontaneous-a2-interaction-repair`.
- No previous branch was rewritten; no main/production access.

## Content-first original P56 corpus

**35 substantial first-party original A2 spontaneous response situations** in five additive corpus files:

| Corpus | Original independent scenes | Theme |
|---|---:|---|
| `interaction56-corpus-a.ts` | 7 | Train times, ingredients, directions, deadlines, library confirmations, invitations and internal sharing |
| `interaction56-corpus-b.ts` | 7 | Clinic appointments, chore swaps, form submissions, photo permission, returns, weather and fees |
| `interaction56-corpus-c.ts` | 7 | Delivery status, evidence sourcing, constrained assistance, phone spelling, register, takeaway service and polite disagreement |
| `interaction56-corpus-d.ts` | 7 | Tour delay, opening hours, test-result uncertainty, alternate meeting places, task clarification, course fees and invitations |
| `interaction56-corpus-e.ts` | 7 | Contradictory sources, heard-versus-confirmed reports, explanation repair, four-person planning, approval before sending, revised travel and independent paraphrase |
| **Total** | **35** | **4 progressive native learning stages** |

**Every scene** explicitly authors:
- An original Japanese partner opener, separately written accurate-intention German translation, realistic everyday situational setting, pragmatic role/register and communicative goal.
- A **direct valid route**: original Japanese first answer + German gloss, different original Japanese partner follow-up + German gloss, changed follow-up goal, fully independent original Japanese reply + natural alternative + misconception-specific explanation.
- An **alternate valid route** with a distinct initial strategy and a genuinely different partner's follow-up, own reply and alternative, and its own specific explanation. A route is **not** merely a randomly paraphrased first sentence: the task required of the learner changes.
- A **misunderstanding and repair route** with a plausible misleading first Japanese utterance + precise German gloss, explicit original corrective partner response + translation, original first-person repair goal, full corrective Japanese reply + natural alternative, and reason the original utterance was unsafe or incorrect.
- A new **independent production scenario** and a **different unseen delayed contextual return scenario**, each with original Japanese model, valid alternative, seductive misleading alternative, and specific explanatory feedback. The delayed context is deliberately not shown in the Learn studio.
- Read-only original P53 vocabulary references and form/meaning/register distinctions. The actual spoken-context word-attestation helper marks lexical items as spoken **only when their P53 written form appears in an original partner turn**; other links remain explicitly thematic.

That is **105 different authored follow-up pathways**, with valid direct and alternate paths plus a real corrective path for every original opening.

### 210 stable original native StudyPlayer prompts

`interaction56.ts` constructs exactly **6 original source-stable prompts per scene**:
- 1 independent route choice (two appropriate but meaningfully different choices; one misconception).
- 1 independent direct partner follow-up.
- 1 independent alternative partner follow-up.
- 1 independently tested explicit conversational repair after the mistaken route.
- 1 new independent production situation.
- 1 later unseen contextual return.
- **35 × 6 = 210 prompts**, no additional scheduler or grading system.

Identifiers: `p56-decision-<id>`, `p56-route-direct-<id>`, `p56-route-alternate-<id>`, `p56-route-repair-<id>`, `p56-production-<id>`, `p56-return-<id>`. The native prompt authority is `sourceId:"thiepn-original"`, `contentVersion:"p56-1"`, stable `primaryTarget` and `cueFamily`, source `contextId`, owner-scoped original StudyEvents, StudyPlayer and FSRS MemoryTraces.

### Native workflow integration

- `interaction56-types.ts`: original typed authoring contracts for first moves, branch-dependent continuations, misunderstandings, corrections, production and new contexts.
- `interaction56-corpus-a.ts` through `-e.ts`: full original Japanese/German scene corpora.
- `interaction56.ts`: registry, four-stage progression, original finite model comparison, native stable prompt mapping, P53 lexical and word-family re-use without a new store.
- `P56InteractionStudio.tsx` and `p56-interaction.css`: searchable, register-filtered learner-facing interactive branching studio; Japanese partner opener; optional P47/P55-style existing **browser/device TTS**; two legitimate and one misconception initial decisions; route-specific actual new Japanese partner speech and German meaning; native IME-safe self-authored follow-up, on-demand authored feedback, self-directed independent production, original Learn drafting handoff and hidden delayed return. Responsive mobile and keyboard focus support. No persistent input or speech capture in this studio.
- `runtime.ts`: registers P56 prompts alongside P23–P55 original native study corpus; Today respects only existing due FSRS MemoryTraces rather than treating new P56 returns as automatically due.
- `journey27.ts`: scoped original native routes `interaction56:<id>` and `interaction56-kind:<id>:decision|direct|alternate|repair|production|return`; preserves original `return:<id>` and `return-due:<id>` and excludes never-graded P56 return scenarios from ordinary new/production. Uses original StudyPlayer, due date and owner evidence logic.
- `P27LearningJourney.tsx`: original Learn mount and source-specific recommendations, original ungraded writing/revision editor, original account source-bound StudyEvents with `schedulerExcluded:true`, absence of persisted raw unsent text or audio, and genuine due-or-24-hour first-delay eligibility. Authoritative original account and MemoryTrace remain untouched.
- `remediation36.ts`: misconception-specific native hints differentiating first move, branch-specific unexpected follow-up, explicit repair, independent new production and distant contextual recall.

### Precise spaced recall and source restrictions

The later independent source situation is not rendered in P56 Learn before it is opened in the original native StudyPlayer. Return eligibility requires either (a) actual original first-decision FSRS trace already due or (b) a graded original first-decision StudyEvent from at least 24 hours before; if a return has already been practiced and traced, original review remains accessible. **Eligibility does not fabricate an FSRS due card.** The existing `return-due` and Today interfaces honor original actual `card.due` values.

P43 choice/branch mechanics, P44 register and repair teaching, P47/P55 device synthetic audio and P53–P55 lexical evidence are reused as source patterns. P56 does **not** claim actual live conversational speaking or audio recognition; choosing a branch and writing Japanese is a scenario simulation, not measured spoken fluency. Browser TTS voice quality/device support varies. A model-pattern match is not a comprehensive semantic Japanese grade: alternative valid sentences remain unassessed within the local studio.

All P56 Japanese/German, follow-ups and explanations are independently authored THIEPN material. Marugoto publisher books, PDFs, audio, page designs and proprietary exercises remain **reference-only**. No source material was copied, imported, migrated or published from them.

## Explicit execution and review status

**NOT_RUN:** tests, TypeScript checks, builds, CI/GitHub Actions, browser QA, device review, audio acceptance, Japanese native-speaker proofreading, content audit or external certification. Implementation is committed source, **not runtime-verified**.

**NOT_DONE:** PR, merge, production or preview deployment, migrations, credential accesses, paid services, alternative stores or grading, new backend. All earlier historical branches, main and production preserved.

## Proposed P57 follow-up

**P57 — A2 Functional Writing & Multi-Message Communication.** Author at least 35 long-ish practical original Japanese written exchanges (requests, replies, corrections, short memos, polite follow-ups, changing appointments, confirmation vs unconfirmed status), independent message composition, register-appropriate editing and delayed unseen response cases. Integrate P49/P54 original documents, P56 conversational repair, native original Learn writing, StudyPlayer/StudyEvents/FSRS. No unapproved messaging, synthesized external correspondence, copied publisher lessons, raw private drafting persistence or fabricated free-writing grades. P57 title is a proposal, not asserted as verified authoritative roadmap title.
