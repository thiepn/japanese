# J33 — Independent acceptance discrepancy triage and operator escalation

## Prerequisite
J32 PR #58 had an initial full Playwright failure at commit cb762936c34b4554512acb2c3d7c2deabfddd6e8: a broad OPEN-cell selector matched ten elements rather than nine. It was repaired on J32 without altering screenshot goldens or loosening the nine-domain requirement. J32 corrected head decd14f16fecfc31fd0010426c79689892d718ec passed GitHub Actions 38072713366: all 42 CI stages, 710 browser passed / 82 skipped. Real artifact 11677836306, 49 ZIP entries, independently verified CRC, SHA-256 b51efe1dea7f15aa660799a83b366b571e69cbae9b09a3bbd8d09d5b42711949.

## Scope
This J33 branch stacks directly on qualified J32. `scripts/j33-evidence-triage.mjs` consumes the *same exact J33 candidate SHA* and J32 machine report generated earlier in CI. It rejects cross-commit evidence, a changed decision, an unblocked authorization flag, asserted human reviewer identities, missing or duplicated domains, altered 42-case/126-PNG inventories and false original-image approvals.

The output is deliberately source-side only: `artifacts/j33-evidence-triage.json` and a static read-only responsive `artifacts/j33-evidence-triage.html`. It does not modify learner UI, persisted state, screenshot goldens, acceptance manifests, cryptographic trust roots, live services, branch ancestry, deployment or release configuration.

## Operator action order
Priority P0: (1) first-party Account OAuth real callbacks, sessions, logout and isolation; (2) physical Android standalone PWA, offline, TalkBack, audio and microphone; (3) independent Japanese curriculum/audio rights and language review; (4) independent P11 representative written and spoken artifacts; (5) recover and human-review all 42 original visual cases and 126 original PNG bytes.

Priority P1: independent visual accessibility comparison; human keyboard/semantics/TalkBack acceptance; exact-build staging and provenance; controlled previous-stable rollback witness.

Each record carries stable discrepancy ID, priority, human operator role, explicit next task, original-source requirement, unresolved status and release impact. Priority is sequencing advice, NOT a rule that any other domain can be waived.

## Strict release boundary
All nine acceptance domains remain OPEN. None of the 42 visual cases and 126 original PNGs is accepted by a human. No genuine primary device/session/OAuth/reviewer/rollback evidence is supplied. Nothing here authorizes merge, deploy, migration, release, signing, live staging or a stable tag.

## Testing
Vitest adversarial cases reject forged authority, cross SHA, duplicates, fake identity claims, missing source slots and fabricated visual acceptance. Full CI also reruns the inherited unit/typecheck/content/native/provenance/build/desktop and Android/compact Playwright matrix and archives the J33 reports only after J32 generation. Passing machine triage proves truthful reporting, not real-world certification.

## Next required external handoff
The owner must commission separate real physical-device, Account and independent language/visual/accessibility reviewers, provide the original visual archive, and authorize staging/rollback testing separately. Their original observations, not these templates or source assertions, are the only basis for subsequent independent approval.
