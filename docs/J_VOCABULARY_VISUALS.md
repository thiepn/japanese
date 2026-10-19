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

### VOC4 executable preview and source-integrity evidence

- Nine corrected SVGs were rendered with locally available CairoSVG and visually inspected in a 3×3 contact sheet. The exact local Git blob SHAs for all nine were compared with GitHub's asset-tree SHAs at the VOC4 branch head; all nine were identical to the committed sources.
- The same nine exact-source SVGs were displayed in **system Chromium** through an isolated static HTML image harness, at 320, 390, 768 and 1440 px viewports: **36/36 PASS** for successful SVG decode, image-fit bounds and absence of horizontal overflow. This tests original image rendering only, not live Japanese app routes, components, service worker or Android native usage.
- Total original SVG assets remain **103**, 95,876 bytes in the GitHub tree; maximum file size **3,892 bytes**. No new vocabulary concepts were added while nine ambiguous illustrations were corrected.
- Local checkout remains blocked by GitHub DNS resolution, Node is 22 rather than project-required 24 and pnpm is absent. Accordingly, full TypeScript/Vite, repository Vitest, desktop/mobile app E2E, real offline browser and Android tests remain **NOT_TESTED**; skipped GitHub CI is not a PASS. Further semantic review and native testing are required before merging/releasing.

## VOC5 — semantic clarity revision (no new words)

The illustrated library remains at **103 canonical lexemes**. Ten existing first-party SVGs were redrawn to communicate relationships and actions rather than an unrelated object: `walk` shows a person taking a stride (previously one shoe), `board` and `get-off` show movement through a distinctive train door, `near` and `far` use comparably sized separated houses, `new` and `old` use clear shoe condition, `shop` adds retail merchandise and awning, `meeting` depicts shared documents and `rest` visibly reclines on a sofa. The original lexical IDs, files, lessons and rights provenance remain unchanged. Matching accessible descriptions were corrected.

Dedicated optional-image cache identity advances to `vocab-v3` to replace stale copies of the changed SVG files without altering learner records or the shell cache. The image cache retains a **48-item maximum**, lazy on-view fetch and online fallback. Added a worker activate regression to assert old image caches are deleted while the current cache, shell and unrelated entries remain untouched. No learner history, schema, grading or backup source was modified.

Full Node 24/pnpm checkout, repository Vitest/TypeScript/Vite and actual app Playwright remain unexecuted: GitHub hostname DNS fails in the local container. The standalone Chromium executable may be used to qualify isolated illustrations, not as evidence of full app acceptance. Expansion beyond 103 is deferred until executable qualification is possible.

### Phase 5 executable checks (isolated, no deployment)

Obtained the actual Phase 5 `apps/web/public/sw.js` file through authenticated GitHub file retrieval, reconstructed it locally byte-for-byte and verified `git hash-object` equals GitHub blob `2441ddebaa679b27a18eadb536b239fcfc77afc2`. Executed **five Node 22 built-in `node --test` checks** against those exact service-worker bytes: (1) picture-cache activation retires `v1`/`v2` but preserves `v3`, shell and unrelated caches; (2) denied CacheStorage still permits online image fetch; (3) previously visited image is retrievable offline and unvisited image fails normally; (4) 65 parallel image requests evict down to 48; (5) URL query/token and auth routes do not enter the picture cache. **5 PASS, 0 FAIL.** This is independent of the repository's Vitest environment, which remains unexecuted. Added the fifth exclusion scenario to the repository's existing Vitest suite to preserve the coverage.

All ten VOC5 changed SVGs were read back from GitHub and checked for balanced XML element tags, a fixed 320×240 viewBox and absence of embedded images, scripts, foreign objects and external links. **10 PASS.** These structural checks do not establish semantic effectiveness with learners, responsive app acceptance, or native Android performance. Full Node 24/pnpm checkout and actual React/Vite/Chromium app E2E remain NOT_TESTED because GitHub DNS is blocked in the local runtime. No vocabulary expansion was authorized by executable qualification; retain the curated set of 103.

### VOC5 isolated image preview and browser blocker

Reconstructed the exact committed `board.svg` source locally and checked `git hash-object` = `780f7c999b01c05de9f16cc23a758267f47ec4f8`, matching the GitHub blob. CairoSVG successfully rasterized the image at 320×240; Pillow also generated readable 160×120 and 190×143 mobile-scale previews, which were visually inspected. Only this representative SVG has a byte-verified raster preview in this phase; other revised SVGs received source/markup checks, not full visual or user comprehension acceptance.

System Chromium was launched with Playwright, but both `file://` and locally hosted `http://127.0.0.1` navigation returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore **Chromium visual tests are NOT_TESTED** for VOC5, not PASS. The proper executable repository checkout, pnpm, Node 24, Vite, full Vitest, offline browser, and Android remain blocked/unexecuted. The 103-illustration PR must remain draft and unmerged pending those gates.

## VOC6 — fetch-event lifecycle repair

The vocabulary image fetch handler now calls `FetchEvent.waitUntil` **synchronously during dispatch**, before awaiting either CacheStorage or network. Its lifetime promise waits for the image response and its queued cache write, so a slow image cannot lose background persistence when the fetch event closes. The existing online/no-storage fallback, FIFO 48-image bound, route/token exclusions and offline previously-viewed behavior remain unchanged. A focused regression with delayed network resolution asserts immediate `waitUntil` registration and later successful caching; the previous implementation did not satisfy this assertion. This changes service-worker logic only, not learner data, vocabulary IDs, grading or backup formats.

### VOC6 full static-asset review and metadata constraints

The **entire set of 103 GitHub SVG blobs** was fetched (not merely the manifest) and audited against its committed tree SHA. All **103/103 PASS** tag-balance checks, exact `viewBox=\"0 0 320 240\"`, file hash equality and rejection of inline event handlers/embedded scripts/external SVG references. Source-structure pass does **not** mean all 103 images were rasterized at 160/190 px or tested for learner comprehension: that is still pending browser/mobile and human visual verification.

Strengthened the manifest validator so illustration IDs must be safe slugs and match the dedicated `id.svg` basename; added negative validation tests. The SVG unit tests also reject SVG links, embedded foreign resources, CSS URL use and event-handler attributes to prevent future unsafe picture additions. No original record IDs, file names, rights attribution or learning schema were changed.

Independent isolated Node 22 `node --test` execution against byte-for-byte `sw.js` (Git blob `ba0c3567cc0249d17cf10db7defa0b337063a677`): **7/7 PASS** for delayed synchronous fetch-event persistence, denied storage, offline visited/unvisited images, concurrent FIFO eviction, excluded token/auth/external requests and selective cache activation. Full repository Vitest, Node24/pnpm, Vite/TypeScript, browser and Android remain NOT_TESTED. Chromium isolated file preview timed out in this runtime (no usable screenshot), not a PASS. Preserve the draft and the 103-art limit until executable qualification.
