# P49 — Everyday Japanese Document Literacy

**Exact P48 parent:** `feature/p48-connected-japanese-information` at `c8427a5ebaabc8c335eae61b49960b28f603d2d9`
**Isolated P48-child branch:** `feature/p49-everyday-document-literacy`
**Mode:** source implementation and substantive original learning content only.

## Original practical Japanese learning library

Five source corpora (`documents49-corpus-a.ts` through `-e.ts`) contain **40 original A1–A2 first-party documents** ordered progressively: **14 A1 and 26 A2**. Each is framed as a coherent fictitious Japanese real-life document with an explicit issuer, audience, genre, reading goal and several written sections. Ten genres:

- Menus: breakfast sets, noodles, lunch ingredients, optional add-ons, time-limited special prices and transparent limitations.
- Notices: temporary closures, photographing rules, parcel collection, exchange conditions and opening-time exceptions.
- Timetables: bus weekdays/weekends, construction exceptions, cultural-center programme and study activities.
- Forms: study registration, group-room booking, school participation and language-course preferences with compulsory and optional fields.
- Tickets: museum entry, local trains, connecting buses, lecture entry and service queue number.
- Invitations: volunteering, local exchange gathering, study group and attendance/arrival conditions.
- Messages: changed cinema meeting, lodging check-in, changed reading-group meeting and lost-property correspondence.
- Advertisements: weekend book discount, part-time flower-shop job, housing, bike sharing.
- Instructions: rice cooker, parcel locker, workshop participation and library-card use.
- Public information: fictional town recycling, clinic administrative hours, public-document assistance, trial library opening times, fictional water-service works.

Content distinguishes a fixed condition from broad inference, actual right from permission, allowed choice from requirement, explicit uncertainty from proven outcome, one-time exception from recurring rule, documentation/registration from an approved result, and ticket/admission/closing windows. Fictitious prices, dates and conditions are provided for reading practice only, **never represented as actual local or official rules**.

**For every original document:**
- exactly **2 document-specific contextual Japanese vocabulary entries** with kana reading, German gloss and authored Japanese context: **80 total**;
- exactly **3 original comprehension tasks**: locate a real stated fact, interpret an explicit document condition or exception, and draw a warranted inference: **120 total**;
- every task supplies two original Japanese model answers, a plausible original misconception, a specific corrective reason and verbatim Japanese evidence from its own authored document;
- **1 purpose-specific independent writing task** with the appropriate real-world communicative outcome, original alternative and misconception-specific guidance: **40 total**;
- **1 changed-fact independent delayed return** not copying the earlier numbers, roles, constraints or genre-relevant conclusion: **40 total**.

All textual examples are newly written first-party content. The provided Marugoto A1/A2, Japanese, kanji and grammar PDFs are **reference-only**; no text, exercises, publisher audio or page illustrations from them were reproduced.

## Original Learn and review integration

`documents49-types.ts` supplies explicit typed authoring contracts with `P49Genre` and 40 stable document IDs.

`documents49.ts` maps content into **280 original canonical `StudyPrompt` objects**:
- 120 `p49-question-<documentId>-q1|q2|q3`;
- 80 `p49-word-<documentId>-<index>`;
- 40 `p49-write-<documentId>`;
- 40 `p49-return-<documentId>`.

Original first-party source provenance `sourceId:"thiepn-original"`, `contentVersion:"p49-1"`, original course unit IDs, `primaryTarget`, `cueFamily` and `contextId` are applied to all cues. **No parallel progress store, assessments, due-date writer, FSRS authority, fake records or alternative ownership mechanism** was added.

`P49DocumentLibrary.tsx` is mounted in **Learn / Verstehen** within the original course. The actual learner UI supports:
- all 40 documents with A1/A2, ten genre filters and full text/title/issuer/purpose search;
- semantic, typographic document-paper surface, readable Japanese text, original sender/audience and explicit genre;
- optional original culture/document-context note and contextual words;
- three interactive comprehension steps and freely written Japanese answer before any model or evidence is displayed; correct original answer and one plausible misconception are compared by **bounded exact normalization**, and other free responses are marked **unassessed**, not wrongly graded;
- expandable exact original evidence and both authored Japanese answer models only after attempting a question;
- direct links to native StudyPlayer for document questions, source-linked words, practical production and genuinely unseen transfer.

`P27LearningJourney.tsx` also allows every document's original writing task to open the **existing Learn / Schreiben** draft → revision → comparison interaction, with safe prompt/source metadata only. It neither writes raw learner text to a new store nor creates a mastery event through exposure. Old P39–P48 task selections are explicitly cleared when a P49 document is selected, and previous task selectors clear P49 selection.

`runtime.ts` extends original Today and study prompt registry; `journey27.ts` adds `document:<id>` and `document-kind:<id>:comprehension|vocabulary|writing|return` scoped to canonical course units. Native StudyPlayer, StudyEvents and FSRS remain the only graded practice and scheduling paths. `return:<id>` is voluntary practice; original `return-due:<id>` and Today/Learn review status only use **actual preexisting `MemoryTrace.card.due` created by FSRS**.

`remediation36.ts` adds original issue-specific guidance for document vocabulary, locate/condition/inference questions, writing and delayed unseen recall.

`p27-journey.css` adds responsive paper-document styling, genre filters, touch/keyboard focus, narrow mobile layout, and native overflow handling. No new page, app, route, back-end, service, editor engine, paid tool or persistence layer.

## Boundaries / NOT_RUN

The user explicitly forbade tests, TypeScript checks, builds, browser QA, CI, PRs, merges, deployments, migrations or production access. **None were run or performed.** GitHub branch and final commit inspection is source-level confirmation only, not runtime or linguistic verification. The Japanese content and original model answers have not had independent native-speaker review. Finite normalization of a handwritten response is never equivalent to robust semantic language assessment.

All prior P23–P48 commits, IDs, existing local-first user/device/account authority and source restrictions remain preserved on a separate stacked branch.

## P50 handoff

P50 — Integrated Comprehension: author **at least 20 substantial original A1–A2 reading + listening + independent written-response missions** with separate first-party visual/textual and optional synthetic spoken materials, cross-modal differences, factual and contextual evidence, progressive comprehension, writing, misconception-specific correction and unseen delayed transfer. Reuse the original Learn/Today/StudyPlayer/StudyEvents/FSRS engines without duplicate assessment or progress stores, and do not invent native-speaker recordings or exact semantic grading.
