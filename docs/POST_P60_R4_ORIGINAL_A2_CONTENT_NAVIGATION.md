# THIEPN Japanese Post-P60 R4 — Original A2 Content and Navigation Refinement

## Verified stacked source handoff

- Parent branch `feat/post-p60-r3-final-learner-workflows` was **exactly verified identical** to SHA `044343a51a8326352b871f82a0c078982ef122cd` **before** creating the child.
- Child development branch: `feat/post-p60-r4-original-a2-content-navigation`.
- R4 modifies its own stacked child source only, preserving all earlier branches, original `main`, production, original historical learning IDs, and the first-party Account/StudyEvents/FSRS authorities.
- **NOT_RUN**: any tests, builds, TypeScript compiler, CI, browser/mobile QA, native-speaker Japanese/German review, real-account privacy acceptance, device speech quality or accessibility acceptance. No PR, merge, migration, production access, deployment, credentials or paid services.

## Content first: twenty substantial original A2 case extensions

R4 adds **20 independently authored multi-source dossiers** mapped to **all 20 existing P60 original A2 lessons**. The current source identity roster was inspected as an inventory: all twenty `p60Id` strings match real P60 source IDs, with no missing base lessons or unrecognized extension IDs. This is source inventory only, not a TypeScript, editorial or runtime test.

Each original case includes all of:

1. **Two new substantial independently authored Japanese connected reading passages**, each with original speaker or institution and a separate German interpretation.
2. **Two new role-attributed Japanese spoken turns**, each with German meaning, with optional device synthesized voice and on-demand readable transcript. No recorded native speakers, pronunciation score or audio grade.
3. **Two explicit source-quoted Japanese evidence points** with independently written German interpretations, explaining what is and is not confirmed.
4. **One realistically addressed multi-sentence independent Japanese composition assignment** with two original model answers; explicit colloquial or polite register as appropriate, one natural but source-wrong statement, a specific misconception and **three meaningful self-check criteria**.
5. **A later newly received Japanese speaker message**, precisely separately translated, requiring the learner to reconsider their drafted statement; an independent practical second written answer with two original model replies, a plausible wrong interpretation and a context-specific explanation of the actual change.
6. **A different previously unseen third-context challenge**, only revealed **after both earlier written attempts**. It has an independent new practical situation, new original writing request, two distinct Japanese solutions, one false inference and independently authored transfer reasoning. This is deliberately *not* advertised as a scheduled delayed FSRS return; no new grade/return card is created.

This adds **60 independent user-composed Japanese practice tasks** (20 × first message, changed response, unrelated transfer) besides the **40 authored new source passages, 40 synthesized-on-demand spoken turns and 20 new follow-up speaker messages**, all with contextual German and evidence notes. Every response is original first-party lesson material; protected Marugoto A1/A2 and other publisher texts/audio/images are **reference-only** and not copied.

### Full new case coverage

| Original P60 lesson | Original additional A2 dossier |
| --- | --- |
| `library-books-return` | library box malfunction, delayed digital proof |
| `meetup-address` | group meeting accessible outside ticketed station gate |
| `course-voice-summary` | actual reported speaker statement vs learner inference |
| `parttime-request` | coworker suggestion vs authoritative shift approval |
| `shop-return-confirmation` | refund permission, transfer initiation and account credit |
| `housing-maintenance` | inspection vs actual later repair and costs |
| `volunteer-permission` | authorized room use vs participant capacity |
| `group-article-review` | mismatched statistical sources and unsupported causality |
| `student-study-event` | personal information, approved venue and changed time |
| `rainy-trip-transfer` | alternative museum booking with canceled transit |
| `privacy-event-photo` | editorial text permission vs individual photo consent |
| `housing-neighbor-noise` | observation, uncertain cause, later actual diagnosis |
| `semester-project-last-minute` | submitted file vs draft saved vs evaluated academic work |
| `accessible-event-final` | confirmed accessible entrance and independently changed start time |
| `urgent-email-correction` | verified institutional venue vs coworker's unsupported suggestion |
| `self-directed-a2-capstone` | realistic evidence-based language reflection without invented qualification |
| `clinic-times-two` | two separately confirmed times and medically unknown results |
| `school-room-correction` | classroom updates, material location and change authority |
| `personal-summary` | practical sustainable self-reflection and adjusted speaking plans |
| `comparing-reports-final` | incomparable in-person/online statistics, no invented popularity cause |

## Native source-only implementation

- `extensionR4-types.ts` and five original `extensionR4-corpus-{a,b,c,d,e}.ts` contain explicitly authored Japanese/German manuscripts and strong source-grounded typed models.
- `extensionR4.ts` exposes exactly original `p60Id`-keyed supplementary content via `r4ForP60`. No new canonical `StudyPrompt` IDs or FSRS trace source is invented.
- `R4IndependentDossier.tsx`: original optional three-decision practice section with revealable Japanese written sources and German translations, optional independent device-Japanese voice reading, individual self-composed Japanese messages, feedback and models **only after actual input**, a changed speaker message, and a separate newly revealed unrelated situation **only after a second independent attempt**. No semantic evaluation, audio recording, raw prose storage, grade or completion claim.
- `P60ConsolidationStudio.tsx`: the new supplement is keyed by the selected original lesson and **kept mounted while the learner switches the four existing R3 reading/listening/writing/reflection steps**. Its Japanese text therefore survives local step navigation, but does not survive deliberately switching away from the lesson or closing/reloading the page. Existing discard confirmation sees both the prior P60 base writer and new R4 writer **through a boolean dirty flag only**, never via raw text. Selecting another original lesson remounts the original isolated source as before.
- Each lesson in the original P60 list visibly advertises its associated original R4 supplementary case; the writing step links directly to a programmatically focusable source panel, with the existing original `onPractice(lesson.id,"comprehension")` and native `onWriting(lesson.id)` routes available. No new source/practice engine.
- `p60-consolidation.css`: fixed a real narrow-screen defect: the old horizontal-scrolling lesson strip **hid the search label and input** on phones, making 20 lesson discovery cumbersome. Now original labeled course search remains visible and accessible, with a keyboard-operable two-column/one-column scrollable lesson catalog. R4 controls have sensible mobile sizing, native focus rings and reduced clutter.
- Existing original P23–P60 source ID authority, Account local-first isolation, P40–P60 study-player prompts, Today due-only FSRS reviews, R1 unsubmitted-work safeguard, R2 historical-return rule and R3 owner-scoped navigation remain unchanged.

## Important limitations

- **NOT_RUN**: Typescript compilation, static analysis, automated and visual browser QA, device speech synthesis/voice settings, mobile touch/IME and accessibility acceptance, account-switching with two genuinely authorized accounts, Japanese-language and German translation editorial proofreading, copyright review, and full content-source/answer correctness audit.
- Not a formal Japanese proficiency measurement; finite authored samples and practical writing self-review cannot grade arbitrary valid Japanese sentences or verify real speaking/listening.
- The third context is hidden until a second current-session attempt. It is **not** a time-delayed FSRS return; the native original FSRS system remains the only scheduler.
- Unsaved user Japanese writing remains ephemeral in the mounted UI, is discarded after an explicitly confirmed lesson change and is **not recoverable across page reloads**. No new private text persistence was authorized.
- Content coverage and GitHub commits are implementation facts, not certification that app source compiles or that Japanese speakers approved the prose.

## Next authorization boundary

R4 completes the source-only A2 content extension for the full original 20-lesson P60 consolidation. Future work should prioritize **separately authorized release-readiness verification**: TypeScript/checks, focused native module integration, actual Account owner-switch and FSRS due/return acceptance, Japanese/German professional editorial review, accessible mobile/keyboard/device-TTS acceptance, and only later PR review, merge and deployment. None of these was performed in R4.

If implementation-only development continues before qualification, a narrower **Post-P60 R5 — Course Source Consistency & Native Handoff Finalization** should fix actual source-identified defects and improve cross-phase UI with no duplicate learner authority.
