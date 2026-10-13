# P47 — Progressive Japanese Listening Comprehension

**Exact source parent:** `feature/p46-progressive-japanese-reading-library` at `f87c82156d5d288a3dbc6668295818180d8df76e`.
**Isolated P46-child branch:** `feature/p47-progressive-listening-comprehension`.
**Mode:** implementation only, content first. **No tests, TypeScript runs, builds, CI, browser QA, PR, merge, deployment, migration or production access.**

## Original A1–A2 learning content

Five 8-scene Japanese corpora (`listening47-corpus-a.ts` through `-e.ts`) contain **40 original realistic listening scripts**, moving from 16 A1 to 24 A2. All content is first-party written for the app, **not** a publisher-script excerpt, recorded dialogue, speaker recording or downloaded audio.

Every original scene includes:
- a specific interpersonal or public-service context, differentiated A1/A2 goal, pre-listening prediction, and **four to six or more individual Japanese speaker turns** with accurate German line support;
- clearly authored information changes, conditions, misunderstandings, changes of address/time/quantity or social intent that the listener must track;
- **three independent comprehension prompts** of distinct functions: explicit detail, contextual inference and communicative intent; each gives original Japanese correct/model and alternative responses, a plausible scenario-specific mistaken response, grounded corrective explanation, and a *precise excerpt from the original source speech*;
- **two contextual vocabulary entries** with reading, German meaning and quoted Japanese context; specific situational language notes;
- an independent written reaction to the original scenario and an **entirely different factual/social transfer** with two separately written Japanese models and a mistake explanation.

**Source corpus coverage:** A1 personal messages and invitations; café and retail service; library checkout; wayfinding; train announcements; voicemail; health-center opening times; bus detours; bakery availability; sports venue; classroom changes; museum admission; package pickup; cooking instructions; lost umbrellas. A2 station replacement travel; appointments and booking; hotel conditions; library room rules; community interviews; teaching instructions; guest dietary coordination; delivery options; festival relocation; bike-rental instructions; commute interviews; returns and exchanges; room changes; alternate-language museum guides; apartment viewings; teacher correction; ferry cancellation; lost-phone reports; team handoffs; declined invitations; restaurant reservations; one-time sports-course changes; language-learning interviews; volunteering messages.

**200 new canonical StudyPlayer prompts:** 120 contextual comprehension follow-ups, 40 independent Japanese reaction tasks, 40 separate source-owned unseen cross-context transfer prompts. Stable `p47-question-<sceneId>-q1|q2|q3`, `p47-response-<sceneId>` and `p47-return-<sceneId>` IDs; inherited `StudyPrompt` structure, `sourceId:"thiepn-original"`, `contentVersion:"p47-1"`, original course unit IDs, `primaryTarget`, `cueFamily`, `contextId`, and source-owned metadata.

## Implemented learner-facing functionality

- `listening47-types.ts` defines source-only data contracts, original line transcripts and comprehension-evidence cues; `listening47.ts` maps all authored material to existing study prompts and bounded authored-answer comparisons.
- `P47ListeningStudio.tsx` is mounted inside the established **Learn / Verstehen** stage. It offers all 40 scripts, searchable scenario chooser and A1/A2 filters. The learner gets a situation and a listening prediction but **not an automatically revealed Japanese transcript**.
- Optional **device/browser TTS**, explicitly labelled as synthetic, not authentic native-speaker audio or recordings: Japanese playback at adjustable speeds, repeat whole scenario, cancel, pause/resume, **per-line playback** and manual shadowing prompt after each line. No microphone capture, new audio recording, file cache or remote API. Missing/unusable Japanese voice or TTS shows a truthful limitation and permits the visible transcript fallback. TTS playback is initiated only by direct user gestures, and cancelled on scenario change/unmount.
- Separate and reversible **Japanese transcript reveal**, optional German line translations, optional original word hints and notes. These supports do not themselves produce graded evidence.
- Three distinct freely typed Japanese comprehension answers, with feedback against **two specifically authored model forms** and one explicit scenario-specific error. Unknown alternative Japanese remains **unassessed**, not incorrectly declared wrong by the guided interface. Exact source quotations and authored models appear only after the learner submits and then actively reveals them.
- Independent written reaction opens existing Learn draft → revision → bounded comparison. Any optional existing source-scoped revision `StudyEvent` remains `result:"skipped"`, `schedulerExcluded:true`; it records only previous safe source IDs/length, not raw learner text or audio; no new store.
- `runtime.ts` registers all 200 source-owned cues in `allPrompts` / `p35JourneyExtras`. `journey27.ts` adds precise specialist routes `listening:<id>` and `listening-kind:<id>:comprehension|response|return`, gated to the actual original unit IDs. All independent graded prompts use original `StudyPlayer`, owner/device authority, `StudyEvents` and FSRS.
- The native **StudyPlayer comprehension prompts are text-supported follow-ups**, displaying the original script and **explicitly not claiming audio-only scoring**. This matters because the current native StudyPlayer is a typed/text exercise engine, not an integrated audio test: completed post-listening written responses are not proof the audio was independently understood.
- The 40 changed-context `return:<id>` prompts provide voluntary independent recall. Existing **`return-due:<id>`**, Today and Learn / Festigen only identify real due items by the existing `MemoryTrace.card.due` timestamps. Nothing guided, revealed or merely heard creates synthetic due dates.
- `remediation36.ts` adds source-specific **answer-free** hints for listening details, inference, speaker intent, post-listening writing and new-context transfer; original source and account boundaries retained.
- Existing `p27-journey.css` gains compact responsive mobile layout, scrollable scenario navigation, readable Japanese line transcript and keyboard/touch-friendly playback, question and writing controls.

## Integrity and release boundaries

- Marugoto A1/A2, kanji, and grammar source PDFs remain **reference only**, with no reproduction of their original dialogues, exercise passages, images or audio; the speech scripts and translations here are new.
- Device TTS voices vary and can sound unnatural or pronounce unknown proper names oddly. **No recorded human pronunciation** is implied. TTS on a given browser may be missing entirely.
- The teaching interface is not an open-ended Japanese semantic judge. Two finite original answer keys for native StudyPlayer do not exhaust all acceptable Japanese expressions. Do not infer clinical language proficiency or listening comprehension solely from rigid string matching.
- P23–P46 IDs, existing account permissions, local-first study ownership, original memory traces, progress history, and original writer architecture are preserved on the isolated branch; no parallel authority was created.
- Compilation, linguistic accuracy, audio output, responsiveness and end-to-end user interaction are **NOT_TESTED** on the user-requested source-only branch. No tests/CI/builds/manual browser QA or paid APIs were run, and no PR/merge/deployment/migration occurred. GitHub commits establish source changes, **not a verified runnable release**.

## P48 handoff — Connected Japanese Information

Build at least 25 substantial original A1–A2 multi-source comprehension tasks that combine two or more independent original messages/announcements/notes. Teach contradictions, last-valid information, uncertainty, source-specific evidence and original independently produced conclusions, with misconception-specific corrections and delayed unseen contextual recall. Reuse P46/P47 reading/listening and the original StudyPlayer/FSRS architecture. Do not duplicate lesson, data or scheduler engines.
