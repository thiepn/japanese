# C0/C1 Course-First Japanese — baseline inventory and pilot acceptance

Baseline: `main` commit `951030c4cdb256e76c99c253f22bddc679bc81ab` (2026-10-20).
Branch: `feature/course-first-a1-c0-c1`. **No merge, deployment, production writes, migrations or rights promotion.**

## Actual native foundations (source-backed)

| Asset | Original files | Audit finding | Curriculum treatment |
|---|---|---|---|
| Beginning reading | `beginnerCourse.ts`, `foundationPrompts.ts` | Ten sequential hiragana sound groups, native recognition/application questions | Remains prerequisite A0 (not falsely recorded as A1 course hours) |
| Existing first conversation | `a1Excellence.ts` | Original E01 guided first meeting and delayed checks | Preserved as supplementary original source, not duplicated |
| A1 conversations | `a1ExcellenceScenes.ts` | 13 original authored A1 situations: greetings, name exchange, origin, family, time, routine, food, shopping, preferences, travel, help, exchange | C1 reuses the canonical `greetings` and `personal` E02 scenes as capstones |
| Canonical E02 controlled work | `a1ExcellenceCourse.ts` | E02 scene eligibility checks canonical A1 unit, can-do, grammar, sentences, lexemes and provenance; guided dialogue/listening/reading/reply/typed recall; unscored open production; delayed transfer | No renaming of E02 IDs, tests, review or mastery |
| A2 original scenes | `a2ExcellenceScenes.ts`, `a2ExcellenceAdvancedScenes.ts` | 10 E03 scenarios + 8 E04 scenarios; mapping and review eligibility must be established separately | Existing A2 work preserved, **not** evidence of a complete A2 course |
| Cumulative transfer | `e06IndependentCases.ts` | Seven broader scenarios; E06 staged work, writing, and delayed practice exist | Keep in optional application/review |
| Existing chapter projection | `e22ChapterProgression.ts`, `UX1LearningPath.tsx` | Chapters project E01–E04 owner events; not a complete lesson-authored curriculum | Preserved under advanced browse |
| Native student records | `runtime.ts`, `StudyPlayer.tsx`, `@thiepn/local-db`, `@thiepn/scheduler` | Owner-scoped `StudyEvent`, review data, app session fencing, guest/account continuity | Remains sole authority for history and FSRS |

Inventory numbers count declared source situations, **not** cleared, rights-approved, fully assessed lessons or verified learning hours. Exact canonical source coverage and external linguistic sign-off remain to be audited beyond the pilot.

## C1: what is actually implemented

- Two successive original A1 pilot units: `a1-unit-01` Greetings and first contact, `a1-unit-02` Names and introductions.
- Six ordered lessons per unit: **five newly authored teaching/practice lessons plus the already-original source-linked E02 capstone**.
- Each newly authored lesson has an explicit communicative objective, contextual explanation, at least three Japanese–English models, four contextual comprehension checks, one exact-expression recall, and an **unscored** independent writing task.
- The sixth lesson reuses the canonical E02 dialogue, controlled listening (device-speech-synthesis fallback explicitly labeled), reading, grammar, contextual reply, typed recall, unscored writing and speech, and the pre-existing delayed return; E02 IDs and scheduler behavior are unchanged.
- The learner chooses one `Continue lesson` action and moves in order. Unit 2 remains locked until the controlled checks in Unit 1 are correct.
- Native owner-scoped StudyEvents supply the only checkpoints; C1 performs *no new migration or write API*. Wrong latest answers do not silently count as a completed check. Earlier correct controlled prompts are omitted on re-entry into an interrupted authored lesson.
- New controlled practice writes source-linked study evidence but `schedulerExcluded:true`; only existing E02 exercises retain their already-tested FSRS behavior.
- Source-only browsing, more advanced levels, and existing review are retained. No content was copied from uploaded Marugoto workbooks.

## What C1 deliberately does NOT claim

- Two pilot units are **not** the promised 60–80-hour A1 curriculum. A1 and A2 level completion remains unclaimed.
- Unscored writing, speech-recognition output and device speech synthesis do not certify linguistic competence or native audio quality.
- The current StudyPlayer reconstructs a lesson from correct prompt evidence, not an exact page-by-page cursor across devices. Mid-lesson drafting uses the existing private draft behavior, not a new cursor store.
- No genuine native recorded listening corpus is added, so full listening quality requires recorded original/approved materials.
- No independent linguistic reviewer has signed off the newly written prompts. Curriculum publication should follow editorial review.
- The existing 13 A1 and 18 A2 scenes are not equivalent to the required full objective coverage; deeper reading, katakana/kanji, long-form writing, grammar, pronunciation and further A1/A2 units are still substantial content gaps.

## Rights

`docs/SOURCE_AND_LICENSING.md` requires unknown/unclear licensing to default non-exportable and private uploaded books to stay in private namespaces. The uploaded Marugoto books may inform topical objectives privately, but no worksheets, textbook dialogues, illustrations, recordings, or scans are redistributed by C1. New C1 teaching strings and checks are original and identified as `thiepn-original`.

Open draft PR #76 is a **separate unintegrated content seed**; it is not a source of permission to copy or publish. Existing integration PR #102 remains untouched.

## Qualification requirements before merge or release

1. Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, and `pnpm test -- tests/study-player/course-first-a1.test.ts` on the authentic original Node/pnpm toolchain.
2. Verify real mobile Chromium session: A0 completion → first guided A1 unit → controlled answers → capstone → Unit 2 unlock; restart and account change; slow/no TTS; offline.
3. Verify wrong-answer correction; logout and login; guest data separation; native export/import preserving original IDs/events; no completion from unscored drafts.
4. Human review of new Japanese original teaching, register and feedback; assess A1 objective coverage and real study duration rather than counting question screens.
5. Keep draft, never deploy, merge, publish textbook media, or trigger production writes from this pilot without explicit authorization.

## Next content work after pilot validation

- A1: remaining original situations from E02 can be full unit anchors only after unit-by-unit source mapping, original activity expansion, independent literacy/grammar/speaking tasks, and practical can-do checks. Target breadth cannot be inferred from 13 anchor scenes.
- A2: map both existing E03/E04 collections to independently defined skill and grammar prerequisites, reading/listening/production outcomes, then author full units and assess them.
- Fill real audio/reading coverage and improve narrative lesson length before claiming dozens of hours at either level.


## C2 — Source-backed authoring pipeline and third A1 unit (2026-10-22)

- `courseAuthoring.ts` defines original-ownership rights, six explicit lesson stages, can-do and E02-capstone mapping, ordered unique prompt IDs, minimum explanation and varied-choice checks, and review/evidence constraints. It can reject an incorrectly mapped or unsupported candidate before publishing.
- `c2A1DailyRoutine.ts` adds **a third substantive guided unit** on clock times, polite routine verbs, に for time/destination, schedule reading and question/answer transfer. It contains five original authored lessons and the already-existing E02 `routine` capstone; the canonical anchor is `a1-unit-03`.
- Original C1 first twelve lesson IDs and native event records are unchanged. The guided course now has **18 lessons across 3 units**. Previously completed users continue into Unit 3 through existing StudyEvents. No second engine or content-migration write.
- Coverage ledger tracks per-unit objectives and controlled checks separately from unscored writing. Recorded audio availability is **false**, independently verified hours are **null**, human language review is **pending**, and independent competence is **not certified**. These flags must not be silently changed by a content batch.
- The source registry identifies `thiepn-original` as owned and exportable. All new Japanese strings are original; no Marugoto chapter dialogue/scan/audio was copied or repackaged.
- C2 does not complete A1 or A2. Additional original listening recordings, structured reading and writing, pronunciation work, assessed transfer and remaining units still need authoring and human review.


## C3 — Original past and origin units

- Canonical `a1-unit-04` / E02 `past` adds five guided lessons and the unchanged source-linked E02 past capstone: yesterday vs habitual activity, polite past `-ました`, past destination questions, two-speaker/two-day reading, and shared experience `も`.
- Canonical `a1-unit-05` / E02 `origin` adds five guided lessons and unchanged original origin capstone: `どこから来ましたか`, `から` for source vs `に` for destination, polite named return questions, full short reading and a reversed journey transfer.
- Each authored lesson includes a substantive grammatical explanation, at least four original Japanese-English examples, four distinctive controlled checks, exact-form recall and independent *ungraded* writing with transfer. The 10 new authored lessons are separate from their two preserved native E02 capstones.
- The same single native Continue path now contains **5 sequential A1 units, 30 lessons, 145 controlled checks**. All **18 existing C0–C2 lesson IDs and prior StudyEvents remain valid**; no migrations, new grader, synthetic FSRS path or source remapping were introduced.
- C3 uses the existing C2 validation pipeline for per-unit original-rights, canonical can-do, scene mapping, order, unique checks and missing-media/competence assertions. Human linguistic review remains pending and duration unmeasured. Device-synthesized Japanese remains synthetic speech, **not licensed recorded native audio**.
- Source rights: all newly authored writing is original THIEPN educational content; existing E02 scenes are reused only via native prompt IDs. No user-uploaded Marugoto PDF content or recording is redistributed.
- This does **not** establish full A1 or A2, verified learning hours, accessible audio comprehensiveness, production fluency or independent CEFR/JLPT proficiency.
