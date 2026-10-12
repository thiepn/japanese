# A1-0 / A1-1 Original-Course Inventory & Integration Contract
**Scope:** `thiepn/japanese` draft PR #76 only; **not** a production release or evidence of CEFR certification.
**Curriculum:** 24 proposed A1 lessons / 6 modules, stable IDs `a1:lesson:01`…`a1:lesson:24`; version `a1-original-contract-v1`.

## Source audit (exact legacy source inventory)
- Structured original core: **20 A1 units**, **131 distinct referenced vocabulary lexemes**, **37 distinct grammar concepts**, **89 distinct sentence records**.
- Of the 131 core-unit vocabulary lexemes, **27** have linked audio IDs that resolve to existing media records; **104** do not. This is a metadata-link check, **not** independent verification of playable audio or rights.
- **4** original A1 graded reading texts, with source IDs in lesson refs.
- **14** separately authored communication lessons, **33** exercises (choice/order/fill), **3** branching role-play scenarios.
- An existing A1 milestone has 15 prompts (3 each for reading, listening, interaction, production, writing). Text-backed speaking items **do not** establish pronunciation competence.
- The old `a1CourseUnits` view contains advanced units despite its name; `starterLexemes` likewise includes levels beyond A1. Neither existing source collection was deleted or rewritten.

## 24-lesson read-only source crosswalk
An aligned source is **not** a complete lesson. The table lists **provenance candidates**, not a learner's mastery.

| Lesson | New original lesson | Audited legacy source refs | Source state |
|---|---|---|---|
| 01 | Laute und Aussprache | hiragana-vowels | Partial existing sources |
| 02 | Hiragana | hiragana-basic, hiragana-advanced | Partial existing sources |
| 03 | Katakana | katakana-basic, katakana-advanced | Partial existing sources |
| 04 | Begrüßungen und Höflichkeit | a1-greetings, a1-thanks | Partial existing sources |
| 05 | Sich vorstellen | a1-unit-01, a1-unit-02, a1-introductions, a1-asking-names | Partial existing sources |
| 06 | Herkunft und Sprache | a1-unit-05, a1-origin | Partial existing sources |
| 07 | Beruf und Studium | NEW CONTENT REQUIRED | Unbuilt |
| 08 | Familie | a1-unit-15, a1-family, text-a1-family | Partial existing sources |
| 09 | Gegenstände und Zeigwörter | a1-unit-09 | Partial existing sources |
| 10 | Besitz und Zuordnung | a1-unit-11 | Partial existing sources |
| 11 | Personen und Dinge lokalisieren | a1-unit-06 | Partial existing sources |
| 12 | Orte und Positionen | a1-unit-10 | Partial existing sources |
| 13 | Zahlen und Mengen | NEW CONTENT REQUIRED | Unbuilt |
| 14 | Uhrzeit und Termine | a1-unit-12, a1-time | Partial existing sources |
| 15 | Alltag und Gewohnheiten | a1-unit-03, a1-unit-08, a1-unit-13, text-a1-morning | Partial existing sources |
| 16 | Wege und Vergangenes | a1-unit-04 | Partial existing sources |
| 17 | Vorlieben und Beschreibungen | a1-unit-07, a1-unit-14, a1-hobbies | Partial existing sources |
| 18 | Essen und Bestellen | a1-unit-16, a1-cafe, a1-restaurant, cafe | Partial existing sources |
| 19 | Einkaufen und Preise | a1-unit-17, a1-shopping, text-a1-shopping | Partial existing sources |
| 20 | Einladen und Vorschlagen | NEW CONTENT REQUIRED | Unbuilt |
| 21 | Unterwegs und Verkehr | a1-unit-18, a1-directions, a1-transport, station, text-a1-transport | Partial existing sources |
| 22 | Um Hilfe bitten | a1-unit-19 | Partial existing sources |
| 23 | Wetter und Wochenendpläne | NEW CONTENT REQUIRED | Unbuilt |
| 24 | Kurze Gespräche verbinden | a1-unit-20, a1-hotel, meeting, assessment-a1-milestone | Partial existing sources |

## Evidence handling and loss disclosure
- Never rewrite or delete historical `StudyEvent` objects, original content IDs, account ownership, or local scheduler traces.
- `reconcileA1Evidence` maps **only exact legacy identifiers** (unit ID, communication exercise/context, roleplay scenario, vocabulary/sentence/grammar primary target).
- Study targets linked to several A1 units generate **ambiguous** outcomes; missing matches generate **unmapped** outcomes. Both stay explicit instead of receiving fabricated credits.
- Cross-account events and explicitly advanced-context events are **out of scope**.
- Alignment produces a provenance row only, **no** course completion, no new grade, no scheduled review, and no autonomous publication.
- A1 source references and versions remain separately accountable; text/media licenses and origin evidence must be checked before new audio or external content enters the course.

## A1-only learner routing
- A1 is the default route. The existing A2–C1 path is preserved behind a deliberate archived-level control; legacy content and its existing progress remain unchanged.
- Users can open existing A1 core units, all 14 communication lessons, kana recall, the short milestone, and three role-plays from the new module path.
- The four linked readings are presently provenance references: a direct target reader route remains **not implemented**.
- The existing short A1 milestone remains accessible and is **not** represented as full A1 certification.
- All lessons that have source links may still lack complete teaching material; unbuilt slots require original authored content.

## Remaining build gates (do not infer PASS from this document)
1. Finish each lesson's vocabulary, grammar explanation, contextual dialogue, comprehension, input, output, feedback and independent assessment.
2. Complete native or properly licensed dialogue audio and accessibility alternatives; verify original source-rights custody.
3. Unify canonical A1 progress/scheduler projections without double-counting legacy SRS history.
4. Build reading, writing and actual spoken A1 production/interaction and six consolidation checkpoints.
5. Add real completion criteria and delayed retention evaluations; test on new and returning learner accounts.
6. Run exact-head TS, unit, A1 contract, browser/mobile, offline/PWA, bundle budgets; all previous P22 protected release gates stay separate.
7. No merge, deployment, source-reuse authorization or human release decision from draft code.
