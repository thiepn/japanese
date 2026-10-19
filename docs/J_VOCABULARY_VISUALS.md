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

## VOC3 — A1–A2 selective visual extension

Added **52 original, first-party SVG drawings** (103 total across VOC1–VOC3). Every new drawing maps to a canonical existing lexeme with explicit A1/A2 course-unit membership, preserved by `vocabVisuals.ts`. Visual sets now cover people, core actions, time of day, routines, school/work, comparisons and spatial direction, meals, travel, communication and household contexts. Pictures for verbs, relations and abstract concepts are **contextual cues**, not standalone word definitions or independent assessment.

No external artwork, textbook screenshots, new dependencies, network image APIs or commercial stock images were introduced. Each SVG is committed in `apps/web/public/vocab/` and retains the original project-authored rights marker. The service worker still caches **at most 48 encountered images**, so adding 52 files does not require an initial 52-image download. Unvisited image failure remains optional to core learning.

This branch is unmerged and undeployed. Source asset and mapping checks were performed; full Node 24, pnpm/Vitest, Vite/TypeScript and real desktop/Android Playwright remain necessary before release.

### VOC3 focused verification evidence (isolated)

- GitHub source and tree inspection: 103 distinct, canonical mapped records; 103 physically present SVGs; original 51 records unchanged, all 52 new lexemes enrolled in canonical A1/A2 units; total 89,767 bytes of SVG source. No grading/content schema changes.
- All 52 new SVGs were fetched and inspected for XML tag balance, expected 320×240 viewBox, and absence of script/foreignObject/image embedding or external links. This is not a visual UX check.
- Three source-equivalent isolated service-worker scenarios executed under Node 22 with `node --test`: CacheStorage denied and online fallback, revisiting cached artwork offline, and parallel request eviction at 48. All three passed **after correcting the existing test's missing `self.location` fixture**.
- Corrected the earlier Playwright test that assumed `友達` remained unillustrated; the new negative reference is `日本語`. Added original VOC3 A1/A2 mapping and lazy-load reference checks.
- Node 24 and pnpm are absent; `git ls-remote` fails DNS for GitHub. Exact-head TypeScript/Vite/Vitest and real Chromium/Android app qualification remain `NOT_TESTED`. Browser test source has been authored but not executed.

## VOC4 — visual clarity repairs and cache invalidation

Reviewed nine original SVG assets at 300×225 raster previews and their reduced presentation in a 3×3 contact sheet. Replaced visually ambiguous house-shaped `school`, `hospital`, `hotel`, `restaurant`, and `station` imagery with differentiated buildings and unmistakable functional marks (classroom windows/clock, medical cross, hotel sign, restaurant awning, station tracks). Added explicit rice grains to `rice`. Reworked `front` and `behind` using the **same house/tree pair** with depth/occlusion reversed, and replaced the platform-dependent airplane glyph in `travel` with an authored vector pictogram. Updated accessible descriptions for all nine; no canonical IDs or media filenames changed.

Updated the separate illustration cache identifier from `vocab-v1` to `vocab-v2` so devices do not keep the old SVG versions forever. Activation retires the old picture-only cache through the existing prefix filter. This may temporarily remove previously viewed *image* offline copies until visited online again; it does **not** clear app/learner data, review history, backups or the ordinary shell cache. The existing 48-image limit, lazy requests, image failure text fallback and event/grading isolation are preserved.

**Qualification:** static source and original visual previews performed; full project Node 24/pnpm + desktop/Android browser acceptance not available in this container. Do not treat visual preview as actual app acceptance.
