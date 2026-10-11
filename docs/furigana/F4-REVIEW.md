# F4 — Furigana editorial and pilot acceptance (A1/A2)

**Source-only candidate; no production release.** This packet is a separate narrowly scoped supplement to the existing J21 Japanese-language review and J34/J35 physical witness work. It does **not** replace or approve those gates.

## Files and immutable source identity

- `f4-cases.json`: 240 source-derived review items: 161 A1/A2 sentences (89 A1 + 72 A2), 66 grammar concepts (37 A1 + 29 A2), 9 A2/A2-entry Reader texts and 4 multi-reading lexemes.
- `f4-review-submission.template.json`: a blank case-by-case human review ledger. Copy it to a separate external evidence location before editing. Every case begins `NOT_TESTED`.
- `f4-device-witness.template.json`: a blank 15-check physical-device, keyboard, TalkBack and visual witness ledger. Every check begins `NOT_TESTED`.
- Source content `content/seed/jp-core.json` is pinned by Git blob `e15c8ae44e3aac08750e8fa7e34ec0ad7d333927` and SHA-256 `e0d8c314728bad983c84fde7b3cbfb69d95af54ac8dbf43c3b56eee1388ded91` at F3 `1aca20a88a4b12a4634f1d7dad150362927e597e`. Confirm the same seed and the **actual qualified F4 head** before reviewing. No stable-deployment claim follows from the source commit.

## Independent Japanese reviewer: exact procedure

1. Confirm reviewer is fluent, independent of implementation, authorized to record observations; fill name/role, time, candidate commit, and independence field. Do **not** claim authorship or sign another person's record.
2. Open the exact locally tested build built from **the qualified F4 PR head**, not production `main`. Record its commit and source identity.
3. For each `sentence/...` record, compare on-screen kanji and ruby to `displayText`, `sourceReading` (if present), `sourceTokens`, translations and context. A2 sentences have no author full-kana reading; do not infer the correctness of the generated display merely from lexical references. Record missing or incorrect reading, okurigana splitting, homographs and sentence register. Preserve exact Japanese quoted evidence.
4. For `grammar/...` records, open related grammar lesson/example. The embedded `practicePrompt` is provided solely to identify the **unhinted** exercise; do not show it with reading-answer hints.
5. For `reader/...`, open the named A2/A2-entry Reader and verify contextual ruby vs lookup candidates. Switch Reading hints off and on without changing the Japanese. For `ambiguity/...`, verify 四/七/九/分 only with contextual evidence; `NOT_TESTED` is required if undecidable.
6. For each case update `verdict` to `PASS`, `FAIL` or `NOT_TESTED`. A PASS requires direct observation of the exact candidate and independently inspectable evidence; a FAIL requires what actually appeared, what the reviewer expects, why, reproducible steps and a screenshot/record reference. Mere absence of a report is NOT_TESTED. Record uncertain variants as NOT_TESTED with notes.
7. Store external evidence with a stable filename and SHA-256, and hand off the edited ledger plus evidence manifests to the owner for reconciliation; no autonomous signoff.

**Guardrails:** corpus seed labels are *source-derived claims*, not independent fluency certification. In particular, the four ambiguous lexemes are unresolved until reviewed in context; the F3 Reader prefers explicit authored sentence tokens when available. Unknown compounds must not get readings from a matching substring. Answers in reading-recall, grammar-cloze, dictation, productive tasks, or milestone assessments must never be disclosed by furigana.

## Physical pilot acceptance

1. Copy `f4-device-witness.template.json` and record hardware model, Android build, browser, locale, actual origin and independently confirmed candidate SHA.
2. Carry out the 15 checks **on hardware**, with real keyboard/TalkBack and 200% zoom observations; automated Playwright mobile profiles are NOT physical evidence.
3. Each case must have `PASS|FAIL|NOT_TESTED`, actual behavior, evidence reference and digest. If no handset or external reviewer is available, keep all records NOT_TESTED.
4. Do not authenticate to protected production accounts, alter current learner data, change Cloudflare or deploy to production during evidence capture. Use authorized disposable/local-only state.
5. Compare findings against existing J21/J22/J34/J35/P11/P21/P22 required independent evidence. J22's 42 cases / 126 images, Android, TalkBack, real OAuth, and owner release authorization remain separate unwaived gates.

## Acceptance classification

- **PASS (per case):** matching SHA + genuine independent witness + complete evidence + reproducible observed behavior + no remaining defect on that case.
- **FAIL:** demonstrable wrong kanji reading, incorrect ruby boundary, clipping, inaccessible focus/order, leaked quiz hint, corrupted state or mismatch to candidate. Keep it as FAIL until a corrected exact-head re-review.
- **NOT_TESTED:** missing witness, missing evidence or an inapplicable/unclear environment. Never infer PASS from CI, an auto-filled ledger or a screenshot mockup.
- **Phase status:** `SOURCE_PREPARED` once the F4 draft and its exact-head automated tests pass. `HUMAN_ACCEPTED` only after externally verifiable completed review/device records; `RELEASE_NO_GO` until existing independent platform gates and explicit owner approval pass.

**F3 evidence for orientation (not an F4 signoff):** workflow `38174104649` at `1aca20a88a4b12a4634f1d7dad150362927e597e`: 92 unit files, Playwright 782 passed / 82 skipped; artifact `11715781244`, ZIP SHA-256 `1bd996af2eefa7d9ab38c9ed8da7b95dc3ae02a25cb338b18ad7a9158e0e0867`, 55 entries, ZIP CRC OK. P21/P22 release status remains HOLD. The review ledger intentionally includes no invented external observations.
