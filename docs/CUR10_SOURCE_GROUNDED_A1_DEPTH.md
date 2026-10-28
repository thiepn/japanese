# CUR-10 — Four source-grounded A1 instructional expansions

This draft-only successor continues on Japanese PR #123 without moving the native StudyPlayer, Account-scoped immutable StudyEvents, original FSRS scheduler, or existing canonical source/course/prompt IDs.

## Added complete contextual teaching

Four already-installed original A1 grammar anchors now receive the existing CUR-03 instructional sequence: two teaching screens, four Japanese examples taken **exactly from the linked native source unit**, three controlled contextual choices with misconception-specific feedback, and one explicitly ungraded independent-writing transfer prompt.

| Canonical A1 unit | Grammar anchor | Learning distinction |
| --- | --- | --- |
| a1-unit-09 | grammar-demonstrative-pronouns | これ/それ/あれ stand alone; この/その/あの modify nouns |
| a1-unit-12 | grammar-kara-made | から…まで interval versus に clock-time point |
| a1-unit-18 | grammar-de-means | vehicle で versus movement destination に |
| a1-unit-19 | grammar-te-kudasai | verb て-form + ください as action request, versus reporting non-understanding |

These are original English explanations and feedback around existing THIEPN-authored Japanese source sentences. The provided Marugoto A1 textbooks and Tae Kim grammar guide inform the pedagogical sequencing only; no workbook page, proprietary audio, illustration or exercise was copied. All four anchors occur in their current canonical A1 unit's grammar IDs, and all 16 examples match the same unit's installed sentence IDs. Test coverage asserts those source links.

Existing original course steps remain ordered, unchanged and byte-identical; added checks remain `nonAuthoritative:true`, `schedulerExcluded:true`, with no independent proficiency or grade claim. Restart/Resume still rely on exact-session fingerprints: adding teaching steps deliberately invalidates obsolete navigation-only pointers without rewriting learner events or FSRS records.

## Still held

No new audio, synthetic listening score, source-rights permission, CEFR certification, migration or release authority is introduced. Retain no-merge/no-deploy until real browser, TypeScript/Vitest, physical device, Account backup and independent language/source review qualify the combined candidate. External PR #103 and Languages PR #30 are separate and unmerged.
