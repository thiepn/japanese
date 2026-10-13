# THIEPN Japanese P55 — Connected A2 Listening & Spoken Response

**Starting Git parent verified exactly:** `feature/p54-connected-a2-reading-vocabulary-transfer` at `5aefc6f14b25b9f8b4762d65e1c065cf94bd695f` (GitHub compare: `identical`).

**Separate stacked P54-child development branch:** `feature/p55-connected-a2-listening-spoken-response`.

## Actual original content delivered

**35 independently authored original A2-targeted seven- or eight-turn Japanese listening situations** in five corpora:

| File | Count | Distinct cumulative content |
|---|---:|---|
| `listening55-corpus-a.ts` | 7 | Platform changes, reservations, corrected directions, out-of-stock choices, voicemail, restaurant bills, first-time clubs |
| `listening55-corpus-b.ts` | 7 | Clinic scheduling, online application status, project reporting, considerate refusals, medical caveats, private file sharing, museum information |
| `listening55-corpus-c.ts` | 7 | Conditional event locations, misheard 15 vs 50 minutes, shipment status, changed household duties, class corrections, travel alternatives, changing work shifts |
| `listening55-corpus-d.ts` | 7 | Different commute respondents, limited group rooms, neighborhood recycling, constructive feedback, tax vs discount, participant counts, formal/customer register |
| `listening55-corpus-e.ts` | 7 | Eight-turn evidence-rich announcements, presentation contingency, family travel, outdated vs current sources, limited-seat course, document repair, actual language-learning reflection |
| **Total** | **35** | **4 explicit progressive communication stages** |

Every scene has:

- Original Japanese speech turns with explicit speaker/role attribution and separately authored precise **German** line-by-line meaning support.
- Specific listening aim and pre-listening attention cue, plus independent original situation.
- Original P53 lexical ID references, with learner display distinguishing **actually spoken written forms** from context-only references; canonical P53 written form, reading, collocations and word families reused without a new store.
- Original semantic or pragmatic contrasts involving time, aspect, condition, secondhand reports, uncertainty, polite/formal or close/friendly register, role attribution, and confirmation versus proposal.
- At least **two** independently authored comprehension questions per scene, with full Japanese model and alternative, specific tempting false answer, explanation and an actual authored dialogue evidence quote. Some cumulative scenes contain three questions. **At least 70 original comprehension questions** in total.
- One independently authored **new-situation speaking/typing preparation** with two full natural Japanese models and a targeted misconception.
- One **genuinely unseen changed-context delayed return** with another distinct new situation, independent Japanese models, and explanatory feedback. No old dialogue transcript is shown for delayed transfer.

**Native prompt minimum:** 70 comprehension + 35 situational responses + 35 delayed return prompts = **140+ stable original prompts**, plus additional P53-source-attested vocabulary cues and the extra third questions. Stable IDs: `p55-question-<sceneId>-q<N>`, `p55-word-<sceneId>-<vocabularyId>`, `p55-response-<sceneId>`, `p55-return-<sceneId>`. The repository was not tested or programmatically counted, consistent with the explicit prohibition.

## Actual source integration (P23–P55 original owners reused)

- `listening55-types.ts`: first-party original content contracts, authored question/evidence typing, speakers, response and return tasks.
- `listening55-corpus-a.ts` … `listening55-corpus-e.ts`: 35 original multi-turn sources, no textbook copying, fabricated audio or SRS scores.
- `listening55.ts`: original source registry, four-stage progression, native `StudyPrompt` mapping for comprehension, actually attested P53 lexical reuse, independent response and hidden novel return. Uses the **existing** Japanese response normalizer and StudyPlayer, with finite published model answers and explicit uncertainty for alternative correct free Japanese.
- `P55ListeningStudio.tsx` + `p55-listening.css`: new learner-facing listening-first UI reusing the native **P47 device SpeechSynthesis/TTS playback pattern** (no new playback service, audio assets or server), complete-scene and single-speaker-turn replay, rate choices 0.7/0.85/1.0, pause/resume, stop, recoverable playback errors, optional Japanese transcript and German support initially hidden, source-evidence response comparison, IME-friendly keyboard controls, P53 vocabulary, native speaking/writing handoff and initially hidden delayed return.
- `runtime.ts`: P55 prompt registration into original Today **FSRS due** and native extended Learn catalog.
- `journey27.ts`: focused `listening55:<id>` and `listening55-kind:<id>:comprehension|vocabulary|response|return` with original `return:<id>` and `return-due:<id>`, restricted to original journey unit and real evidence; unexposed novel returns excluded from ordinary new/production pools.
- `P27LearningJourney.tsx`: direct original Learn mount, original error-based recommendations, original owner-scoped StudyEvents/MemoryTraces, authentic first-return eligibility, original ungraded writing draft/revision source metadata with `schedulerExcluded:true` and **no audio or raw text persistence**. Previous writer selection cleared when changing source activities.
- `remediation36.ts`: original native source-specific repair for speaker attribution, chronology, causes, report versus commitment, independent production, and P53 word use.

### Important assessment and audio boundaries

Audio is **browser/device TTS**, not a native speaker recording or real multi-voice conversation. A single Japanese synthesis voice may read multiple speakers, so visual role attribution in the original transcript is **not** asserted to be measured by voice recognition. Some devices lack Japanese TTS or pronounce a form inaccurately; the transcript remains available and a failure message is shown. The implementation contains no speech recording, cloud speech service, phonetic score or measured independent listening exam.

The standard StudyPlayer questions intentionally include a **readable Japanese script** and are labeled as **text-supported after-listening practice** for fairness. Their accepted model strings and FSRS outcomes cannot prove that a learner correctly heard the utterance without reading. Original free speaking is self-practice; the original writing and typed prompts do not auto-evaluate speech pronunciation. Existing other P47 listening remains untouched.

### Honest delayed recall

The first unseen `p55-return-<scene>` context becomes selectable when the original first comprehension prompt has (1) an existing genuine FSRS trace with actual due date reached or (2) a graded original StudyEvent at least 24 hours old. Previously reviewed return cards may be reopened. **Unlock is not a false due claim**; the `return-due` route and Today still require the original MemoryTrace's due date. Showing transcript, hearing TTS, viewing model or using ungraded writing creates **no** fabricated FSRS success.

### Intellectual property, level and limits

All 35 scenes, all Japanese spoken lines, German line meanings, tasks, explanation, register contrasts and delayed contexts are **first-party original content**. Original user-uploaded Marugoto A1/A2, kanji and grammar volumes are **reference only**. No publisher dialogue, print layout, illustrations or audio are copied. The practical communicative content aims at **A2** with some optional institutional phrases that are A2-bridge/A2+B1-adjacent; no official JLPT certification claimed. Native finite string matching may fail to accept valid Japanese paraphrases; the ungraded studio treats them as unassessed, not wrong. A qualified human Japanese language review and actual runtime QA remain outstanding.

## Explicit restrictions

**NOT_RUN:** automated tests, TypeScript/compiler checking, builds, CI/GitHub Actions, browser/device QA, playback acceptance, linguistic audits and qualifications.

**NOT_DONE:** PR creation, merges, migrations, deployment, production changes, credentials, new paid services, extra learner databases, alternate assessment engines, copying any Marugoto material.

## Next phase (proposed)

**P56 — Spontaneous A2 Interaction & Conversational Repair.** Content-first continuation with substantial original unexpected follow-up conversations, ask-to-clarify, paraphrase, polite disagreement, information repair, self-correction, flexible speaker intentions, changed plans, and independent communication with new contexts. Integrate P40–P55 original dialogue/listening, StudyPlayer, StudyEvents and FSRS without inventing live AI conversation measurement or new grading. Title proposed, not claimed as an authoritative previously verified P41–P60 heading.
