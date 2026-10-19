# Japanese Vocabulary Visuals · VOC1 pilot

Eight **original THIEPN SVG illustrations**, aligned with canonical Japanese lexeme IDs: apple (`lex-ringo`), water (`lex-mizu`), green tea (`lex-ocha`), book (`lex-hon`), car (`lex-kuruma`), bread (`lex-pan`), fish (`lex-sakana`) and coffee (`lex-koohii`). Their source is `apps/web/public/vocab`; author and redistribution authority are the THIEPN application project. No external photos, Marugoto textbook crops, search-result images or unverified third-party licenses are included. Externally sourced artwork later must follow `J_ASSET_PROVENANCE.md`.

The `vocabVisuals.ts` manifest is separate from canonical vocabulary and the study/scheduler schema. Introductory word lessons and Library word reference sheets show optional images; scored recall and listening prompts stay unchanged and unassisted. A failed or unavailable image quietly restores the text-only experience, including while offline.

SVGs are individual small static assets, not bundled with JavaScript. Native lazy loading and asynchronous decoding avoid up-front downloads. Only viewed `vocab/*.svg` files enter a dedicated service-worker cache, capped at 48 items in steady state; no images are preloaded during installation. Shell cache migrates from v6 to v7 independently of saved learner progress.

Next: evaluate comprehension and performance on a real Android/browser session before expanding from 8 to approximately 100–150 concrete A1–A2 images. Maintain per-image provenance and avoid semantically ambiguous imagery. Reuse conceptual pictures across French/Chinese/Japanese later without changing any app's original lexeme IDs.

Checks (not yet executed): `pnpm exec vitest run tests/study/vocabVisuals.test.ts`, `pnpm exec playwright test tests/e2e/vocabulary-visuals.spec.ts`, `pnpm typecheck`, `pnpm build`.
