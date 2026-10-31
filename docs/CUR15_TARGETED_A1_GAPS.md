# CUR-15 — Closing remaining high-value A1 grammar contrasts without duplicating completed teaching

Continues Japanese draft PR #124, preserving its source registry, Account-owned immutable StudyEvents, backup, existing SRS/FSRS and all canonical prompts. An audit found many grammar IDs not used as standalone anchors but **already explained** within existing instruction: も, ました, noun-list と, ね/よ, and demonstrative differences. Adding separate lessons for all those IDs would add unnecessary steps and invalidate more resume fingerprints.

CUR-15 concentrates on three distinct learner decisions:

| Canonical A1 unit | Native grammar anchor | What is newly practised | Verbatim same-unit examples |
| --- | --- | --- | --- |
| 09 Point to things | `grammar-demonstrative-determiners` | Distance and listener versus speaker perspective when selecting この/その + noun, rather than a standalone pronoun | 5 |
| 13 Daily routines across time | `grammar-time-ni` | Clock-time に versus event-location で, alongside frequency 毎日 | 5 |
| 14 Describe now and before | `grammar-na-noun-negative` | な-adjective past/nonpast negation versus い-adjective ～くない | 4 |

**Fourteen Japanese examples** are exact sentences from the installed corresponding original `thiepn-original` unit's `sentenceIds`. The explanation for `静かじゃないです` and its practice foil is **original grammatical construction, not claimed to be a quotation from the unit**; the unit explicitly attests `静かじゃなかったです`. External Marugoto content is not copied.

Each of the three contexts adds two authored teaching screens, three misconception-specific unscored choices, a transfer screen and one ungraded independent writing task (9 choices + 3 writing tasks). All new prompt events are `nonAuthoritative:true`, `schedulerExcluded:true`, `independentCompetenceVerified:false`. Preserved earlier unit-specific teaching always precedes these new cases, with original prompt IDs and canonical ordering unchanged. Native checks verify original exact sentences, unchanged canonical steps, source scoping, meta grading holds, and session IDs. Browser tests complete the existing first context, including its three unscored checks and writing, before asserting the new original content appears on desktop and compact mobile.

Current release policy **NO_GO**: no merge, deployment, migration, production data writes, independent language/rightsholder clearance or CEFR proficiency. Physical Android/iPad acceptance, authenticated Account recovery, and full historic suite remain pending. External Japanese PR #103 and Languages PR #30 remain separate and unmerged.
