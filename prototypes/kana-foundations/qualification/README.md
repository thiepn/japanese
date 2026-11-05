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


## Transaction, failure injection and accessibility follow-up (2026-11-05)

### Verified existing source properties (main \`b6acd3fbe99ab5a6b638758145814cd0d13e2be4\`)

The actual \`packages/local-db/src/index.ts\` opens an account-specific IndexedDB named \`thiepn-japanese:<accountId>\`. \`saveStudyReview()\` uses a *single* \`readwrite\` transaction on \`study_events\`, \`sync_outbox\`, and \`memory_traces\`. \`study_events.add(event)\` rejects duplicate **event IDs**; \`studyEventToMutation()\` uses \`mutation_id=event.id\`; and the flashcard branch checks \`baseRevision\` against the existing MemoryTrace revision before \`put(trace)\`. Completion is reported from \`transaction.oncomplete\`, not from individual request success. This supports single-transaction atomicity and revision-CAS assumptions **for precisely those source paths**, not general exactly-once semantics.

**P0 unresolved for live adapter:** \`gradeJapaneseKanaCard()\` currently constructs \`id:crypto.randomUUID()\` for each new StudyEvent. A retry that constructs a different UUID for the *same underlying learner attempt* is not covered by the \`study_events\` primary-key uniqueness constraint. There is no independently verified durable \`attemptId\` unique index. Do not silently equate event-ID uniqueness with attempt-level idempotency.

**P0 unresolved for live adapter:** \`japaneseBridge.assertKanaWorkspace()\` validates account and lease \`epoch\` before/after the canonical work, and \`NativeKanaWorkspace\` listens for account changes. However \`saveStudyReview()\` does not atomically validate the owner lease epoch within the database transaction. A lease change during an awaited operation can occur after a preflight check, and a failure reported after a successful commit may be mistaken for an uncommitted grade. Account-scoped database naming provides namespace isolation, **not** a guarantee of no stale-epoch actions. Production changes are **not authorized** as part of this work.

### Isolated synthetic test model

\`qualification/transaction-failure-model.mjs\` and \`tests/transaction-failure-model.test.mjs\` simulate event/outbox/trace commits entirely in a freshly constructed in-memory object. Faults are injected after staging event, outbox, trace, before commit, and after commit before acknowledgment. Tests require all-or-nothing precommit behavior, stable same-event replay, denial of same-attempt/different-event retry, revision conflicts, lease changes and zero external writes. The synthetic *extra* attempt-ID uniqueness and commit-time lease check represent **requirements for a future adapter**, not guarantees provided by the existing production code.

\`tests/source-transaction-contract.test.mjs\` inspects the real version-pinned production source to make both the existing guarantees and missing guards explicit. These are static source checks, not injected browser IndexedDB failures, real network synchronization retries, power failures or authorization to integrate.

### Required future gate before any canonical write

1. Obtain an owner-qualified, durable attempt-to-event identity stable under retry; do not create a new random canonical event for the same attempt after uncertain completion.
2. Make event, trace revision and outbox persistence one atomic transaction; verify unique attempt representation/consumption **inside** that transaction.
3. Revalidate owner lease/epoch across the asynchronous boundary with a transactionally enforceable policy or an equivalent proven fencing mechanism; make stale-epoch behavior fail closed.
4. Test unknown commit outcomes and crash-replay after event insertion, outbox insertion, scheduler update and transaction completion using **real disposable IndexedDB** with independent tab contexts. Demonstrate exact once for an attempt even if the client receives no acknowledgment, and no cross-owner writes.
5. Preserve legacy review identities, historical Google-only cards, canonical due dates, backups and guest account transitions. Run exact-head full Japanese production security/browser suites separately.

### Accessibility qualification boundaries

Automated Playwright checks can measure keyboard reachability, focus movement, landmark/role/label semantics, \`aria-live\` feedback, and CSS reflow at a 320-CSS-pixel effective viewport with enlarged text. This approximates the layout pressure of a 640px viewport at 200% zoom; it is **not a real browser zoom or OS text scaling test**, nor is it a real NVDA, VoiceOver, TalkBack, keyboard-only human or physical-device acceptance. Do not interpret green DOM assertions as human assistive-technology approval.

**All S1 practice events remain \`practiceOnly=true\`, \`canonicalEligible=false\`, with null \`canonicalGradeId\`. There is no live FSRS, Account, event/outbox, schema, production or media write path here.**


## Genuine browser IndexedDB source harness (KP-PARITY-S2, 2026-11-05)

**No production source changes. No connection to real learners, auth or sync servers.** The new \`prepare-real-idb.mjs\` reads the exact checked-out production \`packages/local-db/src/index.ts\` and \`packages/sync-protocol/src/index.ts\`. It uses the existing workspace TypeScript compiler to transpile **their unchanged contents**, rewrites only the local module import for browser ESM resolution, and generates disposable localhost files under \`prototypes/kana-foundations/.real-idb-harness/\`. Each generated module carries its source SHA-256 and an independent provenance manifest; Playwright verifies those hashes against current source bytes. No browser mock of \`saveStudyReview\` or fake IndexedDB library is used.

The browser fixture \`real-idb-scenarios.mjs\` imports that generated implementation, and permits writes **only** to synthetic disposable account names matching \`synthetic-kana-idb-…\`. This creates ordinary native browser IndexedDB databases at \`thiepn-japanese:synthetic-kana-idb-…\` on the Playwright ephemeral localhost origin. Every scenario deletes its synthetic database. The generated modules are not committed, loaded by production or deployed.

**Exact commands (after workspace dependency installation):**

    node prototypes/kana-foundations/qualification/prepare-real-idb.mjs
    pnpm exec playwright test --config playwright.kana-foundations.config.ts

The Playwright localhost server command also runs the preparation script automatically on a fresh server. CI exercises desktop Chromium, Android-emulated Chromium, compact 320px Chromium, desktop Firefox, desktop WebKit and iOS-emulated WebKit. Browser emulation does not constitute physical device acceptance.

### Real-system positive and negative cases

- **Existing source-backed guarantees:** three-store atomic transaction, immutable event-ID uniqueness, StudyEvent→outbox mutation identity, expected MemoryTrace revision/CAS, flashcard owner/trace match, snapshot-import idempotency and per-account IndexedDB namespace isolation.
- **Injected genuine IDB aborts:** after queuing event insertion, outbox insertion and trace insertion, explicitly abort the native transaction; inspect all three native stores to ensure none retained a partial write. This is an instrumented native transaction, not a browser power failure.
- **Unknown acknowledgment:** allow the actual DB transaction to commit, simulate a lost caller acknowledgment, and retry with the same event ID (rejected) versus a new ID for the same underlying learner attempt (current production gap). This is **not** an actual mid-transaction process termination.
- **Two-tab competition:** independent browser pages racing the same trace revision; only one should commit. Separately, sequentially retrying the same learner attempt with distinct IDs/valid revisions can still write twice; the test is designed to document this **open gap**, not celebrate its acceptance.
- **Lease epoch:** the current database writer has no active-lease epoch input. The test simulates a synthetic epoch transition before invoking the *real* writer and records that it still accepts the review. This demonstrates that the **database layer alone** does not fence stale epochs; it does not prove a current end-to-end account exploit, because the application has independent workspace guards.
- **Accessibility unchanged:** all existing keyboard focus, role/label, no-overflow and approximate enlarged-text reflow suites continue to run.

A pass for a "GAP" scenario means **the unsafe possibility was reproduced**; it is not a passed safety requirement. Both attempt-level uniqueness and transactional lease fencing remain hard blockers for any canonical Kana Foundations grade integration.

### Qualification limitations

Native IndexedDB API tests on synthetic localhost browser storage can establish transaction behavior in the exercised engines. They do not simulate OS power loss, server synchronization, network reordering, production authentication, exact-HEAD deployed browser behavior, real device behavior, actual 200% browser zoom or human screen-reader understanding. Event+outbox+trace atomicity does not imply end-to-end exactly-once FSRS grading across retries, owner changes or multiple devices. Any future canonical adapter requires its own approved production write contract and full Japanese regression suite.
