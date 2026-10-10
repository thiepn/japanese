# J36 — Field session recovery and evidence integrity repair

## Source prerequisite
J35 draft PR #62 remains open and unmerged at `818a34aa1b32bb0e49de1d75675adc46ec6e3dbc`. CI 38080065578 finished all 49 job steps successfully: 433 unit/security tests, 728 Playwright passed, 82 skipped, source/content validation, typecheck, build and J20–J35 report generation. Its independently downloaded, CRC-clean 55-file archive #11680771168 had SHA256 `cdb40c1c60a11ece34fc5c8315ab39a7c5aa893391fb90c75b85a4ffef417363`. The archived J27 eight records each revalidated by raw SHA256/byte count and linked SHA; the J27 report digest, J32→J35 JSON bindings and 40-character candidate commit all independently checked.

## Demonstrated source flaw repaired: visual source verification can be forged in memory
Previously, `makeReproductionReport(...,visual)` accepted a plain object that claimed `checkedPngs:126`, `mappedCases:42`, and zero approvals. Calling it with such an object could generate a J35 report claiming all PNG bytes were inspected without ever reading a file. The normal J35 CLI path already ran `inspectOriginalFiles`, but other callers could use the exported report function directly.

J36 uses a module-private `WeakSet` to bind a visual inspection summary to an actual invocation of `inspectOriginalFiles` in the current process; a caller-constructed JSON/object no longer passes. The CLI's genuine byte-inspection path and all negative tests remain intact. This change does **not** establish that 126 images are genuine originals, or that any human accepted them.

## Practical offline field-kit recovery
The J34 HTML operator checklist was purely local and did not preserve state after a browser/tab restart. A real physical test spans long offline sessions and interrupted device usage; previously the tester had to reenter all 32 observations by hand despite exporting the current notes.

J36 adds an explicit "Resume previously exported unverified JSON" local file picker:
- Reads a maximum 128 KiB local JSON file using browser File APIs; **no fetch/network, provider actions, background processing or persistent browser storage**.
- Requires the same exact candidate SHA **both as the field-kit head and the observed deployed commit**, same J33 bound report digest, original 32 check IDs in exact order, safe status values, bounded notes, and every approval/authority flag false.
- Rejects wrong commit, truncated/duplicated checks, forged signatures/approval fields, invalid schema and overlarge files **without changing the existing input fields**.
- When valid, restores only the unverified operator alias, check statuses and notes. The STOP/BLOCKED banner and all release authority remain unchanged. It can be reexported as the original explicitly unsigned J34 format.
- Offline import is a usability function, **not a provider OAuth test or independent witness validation**. It must not be mistaken for approval.

## Exact owner actions outside software
1. **First:** expressly authorize an isolated, disposable staging URL serving the *exact J36 draft head* and a disposable first-party Google Account test arrangement. Nothing is deployed or provisioned by CI.
2. On the real physical Android phone, confirm `release-meta.json` and standalone PWA installed-build SHA match J36 exactly; witness Android/TalkBack, all 12 P21 controls, offline/resume, speakers/headphones, microphone capture and local deletion.
3. In a real authorized Account session, test Google consent/PKCE callback, cold PWA return, true logout and strict isolation between two disposable owners. Never export tokens, callback codes, account identifiers or sensitive credentials.
4. Independently commission a Japanese teacher/reviewer to check language and audio source rights, and at least six original P11 writing/spoken artifacts. No qualified external review exists in CI.
5. Obtain the authentic original **42 cases and 126 PNGs** under authorized independent custody. Run the local J35 byte inspector and separately perform genuine human source/candidate/diff/accessibility comparison; do not treat a hash or mapping as a human verdict.
6. With separate explicit permission, independently witness exact-head staging identity and **real rollback** to previously proven stable original bytes. This phase does not initiate any such operation.

## CI and preserved boundaries
Added adversarial Vitest and cross-browser Playwright for the real source fix and local resume, including cross-head and forged approval rejection, 320px/200% zoom, keyboard, dark mode and reduced motion. No screenshot golden updates, weaker tests, new live resources, real credentials, earlier draft edits, merge, deploy, migrations, tags or release activation.

All nine human acceptance domains remain **OPEN**; original human approvals **0/42 cases and 0/126 PNGs**; P11/P21 are HOLD until authentic independent external evidence arrives.
