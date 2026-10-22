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

## C4 — Preferences and meeting-time practice (bounded source-linked expansion)

- The authored path adds `a1-unit-07` (E02 `preferences`) and `a1-unit-12` (E02 `time`), each comprising five new original lessons and the unchanged original E02 capstone. **7 published units / 42 lessons / 203 native controlled checks**. Existing `cf-a1-01-*` through `cf-a1-05-*` (30 lessons) are unchanged.
- Unit 7 teaches `が好きです` as a preference (not a food order), `特に` for special favorites, modest negative preference `あまり好きではありません`, shared preference with `も`, a connected three-person reading, and choice-vs-order transfer.
- Unit 12 teaches question/answer `何時から`, time `から` versus endpoint `まで`, half hours `半`, three-event timetable comprehension, and changed-schedule confirmation without inventing missing information.
- Canonical unit **06 and 08–11 have no verified E02 scene in the current registry.** They are **not** created, credited, or represented as completed. The learner path may show 7 and 12 after 5 as authored course entries, retaining their true canonical unit labels and IDs; that is not evidence that intervening official units have been studied.
- Both new units are original THIEPN-authored Japanese, mapped to existing canonical `can_do` targets and E02 source IDs, and validated through the same C2 authoring gate. E02 `preferences` and `time` scene IDs, delayed prompts, StudyEvents and FSRS remain untouched.
- All newly authored independent writing remains **ungraded**. No recorded native audio, calibrated study time, pronunciation grade, human-reviewed fluency or full A1/A2 coverage is asserted. Device TTS (if available) is not original recorded speech. No user-provided Marugoto text, worksheets, or audio were copied.


## C5 — Canonical family (15) and café (16) source-linked teaching

- Added original authored `a1-unit-15` / E02 `family`: identification from a photograph, `A の B`, perspectives on own versus another person's family terms (`母/お母さん`, `兄/お兄さん`), relation-plus-description transfer, connected fictional family-postcard reading, and careful polite introductions; unchanged existing E02 `family` capstone.
- Added original authored `a1-unit-16` / E02 `food`: polite `すみません` and `N をください`, `N をお願いします`, quantity `一つ/二つ`, connected original three-entry café menu with exact price comparison, order correction and confirmation without confusing `が好きです` and `をください`; unchanged existing E02 `food` capstone.
- 10 newly authored teaching lessons plus 2 original capstones; now **9 actual sourced A1 units, 54 lessons, 261 controlled checks**. All previous **42 lesson IDs** and owner-scoped StudyEvents remain valid, with the same single Continue/FSRS/backup/account/offline paths and no learning engine migration.
- **Canonical units 06, 08–11 and 13–14 remain absent**, not credited or fabricated. Learner-facing unit labels show genuine canonical numbers 15 and 16; authored course ordering does not certify skipped syllabus material.
- All original text and exercises are THIEPN-authored, do not contain copied Marugoto material or recorded dialogue, and are checked by the C2 content validator against original source rights and E02 unit mappings. Independent writing remains ungraded; no measured study duration, human editorial approval, recorded audio, validated pronunciation or proficiency certification is asserted.


## C6 — Shopping (17) and transport (18), bounded original A1 content

- Canonical `a1-unit-17` / E02 `shopping`: five original guided lessons on `これはいくらですか`, `これ/それ/あれ` versus `この/その/あの`, accurate `百/千/円` price reading, a two-customer shopping passage, changed-price clarification and explicit `これをください` versus `今日は買いません` decisions. Existing original E02 shopping scene remains the unchanged sixth capstone.
- Canonical `a1-unit-18` / E02 `transport`: five guided lessons distinguishing `駅まで` destination from vehicle `バスで/電車で/自転車で`, walking with `歩いて行きます`, durations `分` versus clock time `時`, estimates with `ぐらい`, original three-route reading and changed-mode transfer. The pre-existing E02 transport scene stays the sixth capstone.
- Adds **10 original taught lessons and 2 original E02 capstones**, giving **11 source-linked A1 units, 66 guided lessons, 319 controlled checks** (29 per unit). First **54 learner lesson identities and native StudyEvents are unchanged**; course projection, FSRS, backup/offline/account ownership and original E02 IDs remain authoritative.
- Missing canonical A1 Units **6, 8–11 and 13–14** are neither authored nor counted. Canonical Unit 17 and Unit 18 labels are retained; the ordered guided path does not imply full official syllabus coverage.
- Validator maps both E02 scenes to existing original `can_do` and checks original rights, lesson order, complete checks, distinct response options and missing evidence. All new writing is independent and **ungraded**. Japanese prices and travel times are explicitly fictional exercise data; there are **no** verified retail prices or route estimates.
- No Marugoto PDF text/audio copied. Recorded native audio, external linguistic sign-off, measured learning hours, independent speaking/writing assessments and CEFR/JLPT attainment **not claimed**.


## C7 — Help and connected conversations (19/20), original and source-mapped

- Canonical `a1-unit-19` / E02 `help`: five original lessons on `すみません`, `もう一度言ってください`, noun request `切符をください` versus `て`-form action request `言ってください`, slower speech `ゆっくり話してください`, a connected ticket-desk dialogue with a separate bus notice, and explicit numerical confirmation rather than pretending comprehension. Sixth lesson reuses the existing E02 `help` capstone with unchanged original IDs and FSRS behavior.
- Canonical `a1-unit-20` / E02 `exchange`: five original lessons distinguish `そうですね` (agreement) from `そうですか` (acknowledgment), `ね` versus `よ` sentence-final intent, `今日` versus `明日`, contextual i-adjective weather descriptions, two linked conversations with supported reading answers, and repetition/confirmation repair strategies. Sixth lesson preserves E02 `exchange` unchanged.
- This expansion provides **13 verified original E02-linked A1 units, 78 guided lessons and 377 controlled checks** (29 per unit). The first **66 lesson IDs** and all prior owner-scoped StudyEvents are retained exactly. Existing FSRS, StudyPlayer, account fencing, offline/PWA and backup architecture were not altered.
- Canonical A1 Units **6, 8–11 and 13–14 remain absent**: this is **not full A1**, full A2 or an official language-proficiency assessment. The new weather and timetable settings are explicitly original fictitious language examples, not live forecasts, ticket information or bookings.
- Existing C2 content validation checks original THIEPN rights, stable prompt identities, source-linked can-do and E02 scene IDs, objective sequence and distinct controlled answers. Written production remains **independent and ungraded**. Linguistic human review remains pending; no recorded native listening, measured learning hours or verified speaking competence is claimed.
- Source rights: no user-uploaded Marugoto content, images or recordings reproduced. Synthetic device TTS remains separate from authentic native audio. Missing canonical source materials are not manufactured or awarded.
