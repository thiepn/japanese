# THIEPN Japanese Post-P60 R5 — Course Source Consistency & Native Handoff Finalization

## Verified exact stacked ancestry and development restrictions

- Verified parent with GitHub commit comparison status `identical` **before branching**: `feat/post-p60-r4-original-a2-content-navigation` at `017890b8229037da459148c57aacc8c7e757425b`.
- Created a **separate direct R4-child branch** `fix/post-p60-r5-source-consistency-native-handoffs`. All R5 commits belong to this branch; previous stacked branches, `main` and production were not modified.
- **NOT_RUN**: no TypeScript/typechecks, builds, CI, automated tests, browser QA, performance qualification, real-account authorization acceptance, Japanese editorial third-party proofreading or device speech synthesis/manual accessibility acceptance.
- **NOT_DONE**: no PR, merge, migration, deployment, production credentials, paid resources or published certification.

## Content first: twenty substantial original bilingual source and misconception repairs

New `sourceRepairsR5.ts` contains exactly **20 individually authored original Japanese/German correction lessons**, each keyed to an actual unchanged R4 source ID. GitHub-source inspection confirmed that all twenty referenced R4 IDs exist in the five previous original R4 corpora; no unrecognized source key and no missing dossier key were observed. This inspection was **not** a build, automated correctness test, external Japanese proofreading or full copyright audit.

Every lesson provides:
1. A specific plausible but source-wrong **Japanese assertion**, with independently worded German explanation of why it misrepresents the record.
2. A corresponding first-party Japanese source-grounded corrected statement and German interpretation.
3. Precise distinction between documented actions, chronological revisions, real permissions, speaker attribution, data comparison or promises versus execution.
4. A natural recipient-appropriate Japanese register contrast (friends, staff, administration, professionals or reflective learner voice).
5. A further independent Japanese rewriting assignment that the learner must fulfill themselves, without answer extraction from a finite form or automatic semantic grades.

Covered cases include library deposit versus electronic receipt; ticket-gated meeting access; conditional partner statements; coworker suggestions versus management approval; refund authorization, transfer and actual bank credit; inspection versus repair; venue safety capacity; inconsistent statistical denominators; privacy/individual consent; cautious noise complaints; portal submission versus approval; accessible entrance and updated event time; institutional room changes; realistic goals rather than certified Japanese levels; independent medical appointment/befund times; and corrected school notices.

All wording is independently authored first-party THIEPN practice. Uploaded Marugoto and other publishers' PDFs remain **reference-only**; no protected dialogue, official translations, audio or illustrations are copied or implied to be cleared for publication.

### Correct sequencing of source evidence

Some R5 corrected facts (e.g., later room capacity reductions, bus cancellations, approved replacement room, actual document submission) originate in the **second R4 speaker update**. Such notes now appear in `R4IndependentDossier` **only after** the learner attempts that changed-speaker reply; they cannot leak through the earlier first-draft comparison. In original Learn, the detailed R5 note is similarly gated to an independently selected **reply or transfer**, while first-stage source feedback remains limited to information already available in that stage.

No R4 transfer scenario is claimed to be a genuine FSRS-scheduled unseen/delayed review.

## Native R4 writing now has a real multi-draft progression

The existing R4 practice UI previously permitted opening its model responses after the **first** text attempt and moving directly to a second speaker, with no independent second version. The R5 changes now provide a four-part, authentically learner-facing process:

1. Read source material and independently draft the first multi-sentence Japanese message.
2. Review exactly cited original Japanese evidence and written German distinctions; **write a different second Japanese draft** before the authored models can be opened.
3. Read a newly received Japanese speaker message and independently revise the communicative response. The deeper bilingual R5 notes become available **only after** this reply.
4. Reveal a separate practical transfer situation only after the previous reply; independently write another Japanese response and optionally inspect the first-party alternative models.

The editable second draft is checked **only** for being nonblank and different as literal text. This is a UI progression condition, **not** a score, linguistic validation or proof that the rewrite is correct. No arbitrary valid Japanese paragraph is graded semantically.

If the learner modifies the first message, its second version, or the changed-speaker reply, later response state is invalidated. This prevents a stale source-dependent reply or a previously revealed transfer from being presented as if it were still a new outcome for a newly changed earlier text. All raw drafts stay in mounted React memory.

Japanese IME-safe Ctrl/Meta+Enter works across all independent stages, with accessible programmatic focus on the next available heading and responsive 44px controls. These device/keyboard behaviors are **source-implemented, NOT manually accepted**.

## True native R4 → original Learn writer source and text handoff

**Previously**, R4's “continue original writing” action merely opened the base P60 writing task; it neither preserved the actual R4 source case nor carried the learner's typed text. R5 fixes this in existing `P60ConsolidationStudio`, `R4IndependentDossier` and `P27LearningJourney`:

- The user can explicitly choose to transfer the **first/rewritten source message**, **the reply to the newer speaker**, or **the distinct final transfer context** into the *same existing* P27 multi-draft Learn editor.
- The exact R4 original case ID, selected stage, relevant Japanese passage, attributable speaker turn and German explanation, and precisely corresponding current task are displayed in that editor. For a transfer, the new situation is described separately and the older source is labeled as historical context, not as a valid statement about the new situation.
- Only the user-selected raw Japanese text is passed **directly in-memory on that user action**, never via a new store, IndexedDB writer, localStorage, network service or query string. An explicit confirmation explains that other unsubmitted drafts will not be carried.
- When the R4 case belongs to a different real P23/P25/P26 foundation unit, a **single-use owner- and destination-unit-bound pending handoff** prevents the original `[unitId,owner]` cleanup effect from accidentally erasing the chosen draft. The pending value is immediately cleared once consumed; it is never a durable resume record. On original Account change, the R4 context and pending source are cleared.
- The original Learn editor retains its existing two-draft sequence and character-based (not semantic) revision observations. The existing `schedulerExcluded:true` StudyEvent metadata can identify this as original R4 supplementary writing, but the private raw text is not recorded and no FSRS schedule or learner mastery is generated.
- Bounded native StudyPlayer buttons are clearly identified as **original P60 prompts**, not fictitious newly graded R4 production. Their existing original prompt IDs and trace identities remain unchanged.
- Upon returning from the writer to the original P60 course in the current mounted page, the last R4 case is used as the preferred lesson and its existing writing section is selected. The raw R4 draft is not reconstructed in the now-remounted R4 studio; the deliberately transferred text remains in the original Learn writer only while mounted.

## More precise unsent work and account handling

- Changing *P60 base* activity mode or question only warns about base-writing text it would actually clear, not an unrelated mounted R4 draft that remains intact.
- Switching *lessons* checks both original P60 and all new R4 drafts via a boolean dirty signal, and requires discard confirmation. No raw text is exposed through the signal.
- The R4 phase-specific handoff uses a truthful user confirmation: one chosen answer is transferred, but the other ephemeral responses of that case will not persist after navigation.
- The original Account-switch cleanup remains authoritative, clearing text, source exposure, speaker audio, selected supplementary owner view and the new temporary pending handoff. No unauthorized account-local reuse or cross-account transfer is implemented.

## Limits, release gates and next milestone

- Source inventory proves that all twenty R5 IDs match the existing R4 cases. It does not prove Japanese correctness, compilation, full app navigation or data privacy under real accounts.
- The third transfer context is revealed during one continuous session following independent work, **not** after an actual FSRS interval; true due-only return and grading stay with the original StudyPlayer, StudyEvents and FSRS.
- Speech remains optional device/browser-generated synthesis. Listening proficiency, independent pronunciation or spontaneous speech are never measured.
- Original P23–P60 source IDs, P40–P52 historical return readiness, P53–P60 delayed-review gating, local-first Account stores, ownership, native FSRS scheduler, Learn/Today/StudyPlayer and R1–R4 stacks remain preserved.
- **NOT_RUN**: all checks, builds, tests, CI, browser/mobile/IME/screen-reader device acceptance, real-account owner-switch acceptance, independent Japanese/German speaker editorial validation, and third-party publishing/rights review.
- **NOT_DONE**: PR, merge, migrations, deployment, production.

**Release-readiness work must be separately authorized.** This includes actual TypeScript/static compilation and focused module fixes, original Japanese editorial quality and English/German gloss review, real-device/keyboard/IME acceptance, StudyEvents/FSRS/Account privacy and historical-return acceptance, PR review and deliberate eventual merge/deployment. R5 is a committed *source* milestone rather than a qualification claim.

If the user wants a further *implementation-only* phase, R6 could resolve additional source-inspected content/navigation inconsistencies while staying separate from runtime verification. For release, stop generating indefinite extra phases and request explicit verification authorization.
