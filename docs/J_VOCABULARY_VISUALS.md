# Japanese Vocabulary Visuals · VOC1 pilot

Eight **original THIEPN SVG illustrations**, aligned with canonical Japanese lexeme IDs: apple (`lex-ringo`), water (`lex-mizu`), green tea (`lex-ocha`), book (`lex-hon`), car (`lex-kuruma`), bread (`lex-pan`), fish (`lex-sakana`) and coffee (`lex-koohii`). Their source is `apps/web/public/vocab`; author and redistribution authority are the THIEPN application project. No external photos, Marugoto textbook crops, search-result images or unverified third-party licenses are included. Externally sourced artwork later must follow `J_ASSET_PROVENANCE.md`.

The `vocabVisuals.ts` manifest is separate from canonical vocabulary and the study/scheduler schema. Introductory word lessons and Library word reference sheets show optional images; scored recall and listening prompts stay unchanged and unassisted. A failed or unavailable image quietly restores the text-only experience, including while offline.

SVGs are individual small static assets, not bundled with JavaScript. Native lazy loading and asynchronous decoding avoid up-front downloads. Only viewed `vocab/*.svg` files enter a dedicated service-worker cache, capped at 48 items in steady state; no images are preloaded during installation. Shell cache migrates from v6 to v7 independently of saved learner progress.

Next: evaluate comprehension and performance on a real Android/browser session before expanding from 8 to approximately 100–150 concrete A1–A2 images. Maintain per-image provenance and avoid semantically ambiguous imagery. Reuse conceptual pictures across French/Chinese/Japanese later without changing any app's original lexeme IDs.

Checks (not yet executed): `pnpm exec vitest run tests/study/vocabVisuals.test.ts`, `pnpm exec playwright test tests/e2e/vocabulary-visuals.spec.ts`, `pnpm typecheck`, `pnpm build`.

## VOC2 — A1/A2 source-grounded extension

43 additional original THIEPN SVGs have been added (51 total). Each new image maps to an existing canonical Japanese lexeme ID referenced by at least one A1 or A2 course unit. Scenes cover food, transport, weather, places, daily activities and everyday objects. Contextual pictures, particularly for verbs and seasons, are supporting cues rather than stand-alone tests of meaning.

No external images or textbook art have been copied. Each added illustration is an app-authored vector file of under 8 KiB. A rights-safe manifest tracks all 51 images, while the original lexemes, learning events, grading and study scheduler are unchanged.

Phase 2 corrects an image cache bug: if CacheStorage access fails, the image must still load over the network. Concurrent writes are serialized and FIFO-evicted to prevent more than 48 retained images. The existing text-only rendering remains the offline fallback for an unvisited image. The dedicated simulated worker tests exercise storage refusal, offline reuse and concurrency.

Required independent qualification: full checkout with Node 24/pnpm, focused Vitest, TypeScript/Vite, real Chromium desktop and Android sessions, and visual source review. These are not marked PASS without execution.
