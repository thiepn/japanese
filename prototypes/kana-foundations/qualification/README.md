# KP-PARITY-S1 — Screenshot review and canonical integration readiness (NO WRITE)

**Study date:** 2026-11-05. **Baseline:** draft PR #127 at `7889e9ee491f78861a8113a0f4d4b8c8789f5499`, exact-head successful Actions `42021550773`. **Status:** isolated audit and synthetic preview only; no real Account, canonical StudyEvent, FSRS or production calls.

## Actual visual evidence inspected

Downloaded original GitHub Actions artifact `kana-foundations-browser-evidence` (ID `13411793081`, 78 files, six actual browser-engine/viewports, including compact 320x700 Chromium, Android-emulated Chromium, desktop Chromium/Firefox/WebKit and iOS-emulated WebKit). Inspected source PNG screenshots of S1 recognition, reverse matching, three-character input, assisted results, sequence feedback and original results; not generated mockups.

- Recognition choices and large kana remain legible without horizontal clipping at 320px; reverse matching choices are evenly spaced, three-character text and input display cleanly, and assisted feedback visibly disclaims independent credit.
- Reproduced usability defect: skipped listening displays a large `0 / 5 (5 not assessed)` score that wraps across several lines at 320px and misrepresents an unavailable/omitted assessment as failed. Fix only presentation; underlying records must not change.
- Reproduced teaching defect: optional S1 `Need a hint?` text in `app.mjs` is generic across characters; use the actual recorded vowel's stroke count and existing original pedagogical phonetic cue, without revealing the literal romaji answer. Assistance status must remain immutable.
- Limitations: screenshots do not establish human novice comprehension, real phone keyboard/voice quality, physical Safari/WebKit behavior, screen reader announcements, color-contrast compliance, or actual 200%-zoom acceptance. Those remain human/real-device gates.

## Read-only production source boundaries

Source inspected at main `b6acd3fbe99ab5a6b638758145814cd0d13e2be4`:

1. `apps/kana-studio/src/services/canonicalBridge.ts` matches only exact kana-reading `reading/kana-to-romaji-recall` or reverse `form_selection/sound-to-kana` prompts, with matched original ID, displayed answer and expected reading. Multiple-choice kana→romaji recognition is **not** the same cue as typed recall.
2. `apps/kana-studio/src/services/srs.ts` avoids schedule mutation for cram `isCram` attempts. Actual scheduled grading calls `gradeJapaneseKanaCard` for exact canonical cues; the canonical path calls `saveStudyReview` and updates the local Studio cache afterward. This is not an authorization for our optional practice to grade anything.
3. `apps/web/src/kanaHandoff.ts`, `apps/kana-studio/src/services/japaneseBridge.ts` and `NativeKanaWorkspace.tsx` bind a specific owner and lease `epoch`; switching owner or epoch invalidates access. This must be checked before and after any future asynchronous work, not just at UI mount.
4. `apps/kana-studio/src/services/storage.ts` treats IndexedDB transaction completion as success. Merely handling request success is insufficient.

## Synthetic cue/owner/idempotency preview

`canonical-readiness.mjs` contains only deterministic classification over **supplied synthetic inputs**. It imports no production Account, scheduler, local database or network API, has no storage calls and no write action. It deliberately returns `wouldWrite:false` for every result.

- **All current S1 attempts are practice-only and categorically blocked** even if independent and correct.
- The only structurally plausible future match within these three modes is an *unassisted, exact* romaji→kana reverse selection mapped to `form_selection/sound-to-kana`, matched against target/prompt/display/card/trace identities. This is a structural **preview**, not permission to grade it, and is not yet source-qualified for a production event.
- Kana→romaji **multiple choice** does not correspond to the canonical typed-recall `reading` cue; three-character strings are not single-kana cards. Neither may be silently mapped to existing FSRS traces.
- Wrong, corrected, revealed and assisted attempts remain disqualified. Missing/stale owner lease, epoch rollover, duplicate attempt ID, already-graded and malformed attempts are rejected in the synthetic preview.
- A repeatable demonstration key identifies a hypothetical attempt, **not** a durable idempotency guarantee. A supplied in-memory `Set` cannot prove cross-tab or crash-safe atomic persistence. Future canonical integration requires database-level uniqueness, transaction/owner-lease checks, optimistic revision/CAS semantics, crash-replay tests, no double scheduler write and independent acceptance.

## Immediate release holds

No existing Japanese production file, owner lease, FSRS card, due date, study event or user backup is written by this qualification. Keep PR draft/unmerged/undeployed. Do not call synthetically generated score eligibility an approved review, prove Kana Pro learning-effect parity, or ship unapproved vowel recordings. Future integration is a separate authorization.

**Audit is technical qualification only. No human listening, usability, screen-reader or learner retention results are asserted.**
