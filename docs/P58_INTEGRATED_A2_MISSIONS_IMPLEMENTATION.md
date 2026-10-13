# THIEPN Japanese P58 — Integrated A2 Practical Missions & Independent Communication Transfer

## Exact parent and development isolation

- Verified source branch `feature/p57-functional-a2-writing-messages` exactly equals the requested `b8f6fa043bc4f9c31b202babf2eb9755bcaf43a4` (GitHub compare status `identical` before branch creation).
- Created a distinct direct P57-child branch: `feature/p58-integrated-a2-practical-missions`.
- Implemented **only** committed development source. Prior stacked branches, main, production and original local-first Account, StudyEvents and FSRS state remain intact.
- This document describes source implemented; **no TypeScript compiler, tests, browser or native audio QA were run**.

## Actual original curriculum corpus

**35 original integrated A2 mission scenarios** are implemented as five independently authored corpora of seven:
1. `missions58-corpus-a.ts`: station delay, three-guest restaurant, library room, clinic scheduling, product delivery, weather relocation, photo-permission privacy.
2. `missions58-corpus-b.ts`: apartment inspection/repair, limited-place course, presentation permission, product refund, lost property, independent academic writing, sourced deadline.
3. `missions58-corpus-c.ts`: worker exception, meeting-room change, waste separation, volunteer headcounts, accurate learner feedback, pre-approval revision, report delivery.
4. `missions58-corpus-d.ts`: exam location, inconclusive clinical results (no medical advice), safe travel, included discount, library-hour exception, partial volunteer assistance, personal writing.
5. `missions58-corpus-e.ts`: source recency with special cases, room capacity changes, repeated permission before final send, changing tour entrance, multi-modal family trip, independent language-meeting registration, correction of contradictory official information.

**Every original mission is a connected new scenario, not a collage of old materials.** It contains:
- A newly authored realistic practical Japanese **notice** with German meaning and author attribution.
- A different newly authored Japanese **personal or work message** with German translation, author attribution and sometimes reported uncertainty.
- Two further original Japanese **speaker-attributed oral updates**, with separately authored German support, reflecting changing time/status, confirmation, exceptions or new tasks. Optional local **device SpeechSynthesis TTS**, not a recorded speaker, plays the updates. A single synthetic voice may read both roles. A readable transcript remains available.
- **Two source-evidence comprehension questions**, with full original Japanese and valid alternative models, explicit Japanese excerpts from the written and spoken sources, specific misleading answer and explanatory correction. Some questions draw together notice/message and live update; others distinguish chronology, inference, evidence, speaker intention and action status.
- One original **pragmatic choice** with two appropriate alternative Japanese statements and one specific erroneous statement; feedback emphasizes believable conversation rather than one arbitrary correct phrase.
- A new independent **Japanese written reaction**, with two original models, specifically misleading text and explanation.
- A distinct unexpected further Japanese **follow-up utterance** with German support, an independent response task, two full original answers, misconception and repair.
- A separately original **error-repair instruction**, two full Japanese corrected examples and explanation.
- An entirely **unseen delayed changed-context task**, with independently written situation, two valid original Japanese answers, tempting misconception and explanation. The delayed situation is not displayed prematurely in Learn.
- Original P53 vocabulary IDs with **actual source-text attestation** distinguished from thematic association; original morphological/meaning families reused read-only.
- Original P54 reading, P55 connected listening and P57 multi-message examples as direct read-only **independent preparatory sources**; same-unit P49 document, P43 branching conversation, P45 independent response and P56 spoken repair paths are exposed through their existing practice route. **These historical sources refer to distinct scenarios, never fabricated as one event or same factual timeline.**

The study progression is four increasing stages: basic time/role updates; confirmed-versus-planned requests; new multi-source limits and changing obligations; and cumulative multi-source A2 independent writing, source ranking and correction.

## Native source prompts: 245 original cases

`missions58.ts` emits **7 original canonical StudyPrompt records per mission**:

| Per mission | Count | Stable ID prefix |
|---|---:|---|
| Two independent evidence/comprehension prompts | 2 | `p58-question-<mission>-q1/q2` |
| Choice with two appropriate responses | 1 | `p58-decision-<mission>` |
| Independent writing | 1 | `p58-write-<mission>` |
| Unexpected spoken-text update/reply | 1 | `p58-reply-<mission>` |
| Specific misconception repair | 1 | `p58-repair-<mission>` |
| Distinct hidden delayed transfer | 1 | `p58-return-<mission>` |
| **Total: 35 × 7** | **245** | First-party stable IDs |

These are original StudyPlayer source prompts with original `primaryTarget`, `cueFamily`, `contextId`, `sourceId:"thiepn-original"`, `contentVersion:"p58-1"`, native Japanese normalization and original account-scoped memory authorities. Their finite accepted model strings are **not comprehensive free-Japanese evaluation**; a valid paraphrase may not match. The read-only local writing studio reports unfamiliar responses as **unassessed**, never wrong by default. The native typed StudyPlayer should not be presented as objectively grading open prose or actual listening, because its transcript is visible in its text prompt.

## Implemented learner workflow and authority

- `missions58-types.ts`: stable original source contracts.
- `missions58-corpus-a.ts` through `-e.ts`: the 35 authored missions.
- `missions58.ts`: source registry, progression, original P53 vocabulary read-only links and original P43/P45/P49/P54/P55/P56/P57 independent practice discovery, native prompt mapping, bounded comparison.
- `P58MissionsStudio.tsx`, `p58-missions.css`: responsive, keyboard/IME-friendly source-reading, hidden German translations, optional native browser TTS, transcript reveal, speaker lines, typed independent evidence/comparison, independent Japanese writing and rewritten answer, new reply, repair, direct native StudyPlayer and original Learn draft handoffs, hidden overdue/eligible return. No private draft or spoken audio is recorded or sent.
- `runtime.ts`: P58 prompts added to **existing Today FSRS queue** and the original Learn prompt registry. A newly authored prompt does not become `due` without the original existing due MemoryTrace.
- `journey27.ts`: explicit unit-scoped `mission58:<id>` and `mission58-kind:<id>:comprehension|choice|writing|reply|repair|return`. Both original `return:<id>` and `return-due:<id>` remain used. Never-seen return content is excluded from ordinary new/production pools; first retrieval requires a due first original comprehension prompt or at least 24 hours from a **graded** original first-comprehension StudyEvent. Existing return MemoryTraces may be reopened. Unlocking a return **does not fabricate FSRS fälligkeit**.
- `P27LearningJourney.tsx`: Learn mount, original error-sourced recommendations, owner evidence, native cross-phase preparatory handoffs, original ungraded self-writing/revision editor, source-specific original metadata and no raw-private-draft persistence or new FSRS writer. Changing writer activity clears prior phase-specific write selections as before.
- `remediation36.ts`: original source-grounded detailed Japanese communication repair for chronological conflicts, valid alternatives, status confusion, new conditions, corrections and independent distant recall.

## Rights, consent and honest status

All new Japanese and German texts, decisions, evidence hints, models, revisions, delays and mission situations are first-party THIEPN-original authoring. Uploaded Marugoto A1/A2 and other external publisher materials are **reference-only**; no book dialogue, artwork, audio, exercises or other protected publisher source is copied.

Optional spoken audio is **browser/device TTS** only; its availability, correctness and voice quality vary by device. Text-supported comprehension is **not** a measured audio-understanding exam. Any deliberate spoken or private written practice is ungraded and does not infer external JLPT or CEFR qualification. Small A2-plus institutional expressions may require separate Japanese native-speaker editorial review.

**NOT_RUN**: tests, compilation, builds, CI/GitHub Actions, runtime or browser QA, mobile/audio/TTS acceptance, Japanese editorial proofreading, automated evidence audits or release qualification.

**NOT_DONE**: PRs, merges, migrations, deployment, production or database access, paid services, credentials, new learning/grading/persistence engines.

## Proposed next P59

**P59 — Independent A2 Performance Missions & Cumulative Transfer** (continuation proposal, not a previously verified official roadmap heading). Implement substantial additional original independent scenarios demanding less scaffolding: longer integrated real-world conversations and written evidence, self-directed strategy, source hierarchy, nuanced register, genuine distractors, cumulative authoring, cross-unit recall, unseen delayed tasks, and mobile-visible practical completion workflows. Reuse original state, FSRS, StudyPlayer, P43–P58 sources and user-account boundaries. Do not fabricate standardized assessment or run CI/tests/deploy without permission.
