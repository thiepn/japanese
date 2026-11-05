# Kana Foundations — five-vowel proof of concept

**Experimental isolated prototype. Not a production route, account experience, course level or FSRS integration.**

## Goals and pedagogy

One self-contained learning unit introduces あ, い, う, え, お. Independent evidence matters more than a fake mastery score:

1. Introduce あ and い with pronunciations, shape and verified stroke counts.
2. Recognize those two before adding new characters.
3. Introduce う, え and お.
4. Recognize all five without a reading hint.
5. Type each character's reading without choices.
6. Hear a Japanese device voice, then identify the matching character; allow skipping without credit.
7. Decode いえ, あお and うえ, revealing meaning and common kanji after answering.
8. See a transparent first-attempt summary; optional later repetition is practice only.

Incorrect first attempts are retained; they reappear as correction practice. Assisted answers are not independent. Immediate completion never establishes delayed retention. Word prompts test decoding rather than contextual word mastery. Simplified English pronunciation analogies need further expert review. Stroke counts are verified; no generated stroke-order art is used.

## Preservation and learning-data boundaries

- Main is unchanged. Existing apps/web, apps/kana-studio, THIEPN Account, StudyEvents, learner databases and FSRS are not modified.
- Prototype entry is prototypes/kana-foundations/index.html, a separate static module.
- Only localStorage key thiepn:kana-foundations:prototype-only:v1 is used. No IndexedDB, auth or server calls. No existing data is read or migrated.
- Prototype-only records distinguish first attempts, correction, assisted responses, practice-only answers and listening skips.
- These are **not** canonical StudyEvents and never change real FSRS scheduling.
- An incompatible saved schema is not overwritten. The prototype enters an in-memory mode and displays a warning.
- Exported local JSON is prototype state, not a canonical backup.
- Do not import any of these records into production without consent, stable identity mapping and idempotent migration tests.

## Historical comparison baseline

The original Google AI Studio import is commit:
5974a2353d9d001aae47a1dde846f6839e95b3c7 (PR #110).

Build the exact source in a temporary detached Git worktree:

    bash scripts/kana-foundations-original-baseline.sh /tmp/kana-original-build

The script builds the historical Kana Studio package, copies its compiled output to a temporary directory, and removes the worktree. It does not merge or replace files in the current application. GitHub Actions archives the output after successful build. This verifies the **build**, not historical browser usability; visual and interaction comparison still needs an independent browser pass. No real user Account/session should be used in the baseline.

## Run and test

The static prototype needs no build tools to serve:

    python3 -m http.server 4177 --bind 127.0.0.1 --directory prototypes/kana-foundations

Open http://127.0.0.1:4177/index.html .

Node core tests:

    node --check prototypes/kana-foundations/engine.mjs
    node --check prototypes/kana-foundations/app.mjs
    node --test prototypes/kana-foundations/tests/*.test.mjs

Full cross-browser suite — Chromium desktop, Android emulation, 320px mobile, genuine desktop Firefox/WebKit and emulated iOS WebKit:

    pnpm install --no-frozen-lockfile
    pnpm exec playwright install chromium firefox webkit
    pnpm exec playwright test --config playwright.kana-foundations.config.ts

GitHub Actions repeats these tests. CI emulation is not physical-device acceptance or a human learning study.

## Intentional limits and release gates

- Synthetic device Japanese voice only, if supported. It is not a source-provenanced native recording.
- No handwriting, generated stroke-order drawings or unverifiable audio. Add only after content and reuse-rights verification.
- No delayed-retention measurement, real scheduling, accounts, sync, adaptive course, CEFR or new vocabulary database.
- No writes to existing Kana courses or learner histories.
- Prototype progress is guest-local, single-device and isolated.
- Before integration: human-reviewed Japanese content, real-device/a11y/performance tests, offline/owner boundaries and an explicit, validated bridge into canonical events and FSRS.

Visual targets: mobile-first 20 px gutters, 54 px primary controls, 57 px answers, reduced motion, legible Japanese glyphs and no secondary bottom nav during active lessons. At 320 px, test every interactive screen for clipping and scroll behavior.


## November 5 visual and multi-engine qualification

PR #127 now contains an additional [beginner study protocol](./BEGINNER_STUDY_PROTOCOL.md) with a genuine 24–48h delayed-recall session; **no participants have been tested**. This is not a validated usability result.

The retained screenshot comparison identified a cramped introductory layout on 320×700 phones that placed the sound explanation below the initial viewport, redundant Exit controls, sticky results actions competing with the learning guidance, an accidental blue outline on programmatic result focus, and a misleading "Listen" button when a Japanese device voice is unavailable.

The isolated prototype was adjusted without modifying production or canonical learner data. The CI browser suite now exercises actual installed Chromium, Firefox and WebKit engines, as well as Android- and iOS-emulated viewports. It includes DOM-visible teaching-region assertions, UI captures, keyboard/reduced-motion smoke checks, and synthetic device-audio fallbacks.

Performance measurements are ten synchronous, local in-browser DOM-interaction samples per project on a GitHub runner. They are **not** input-to-photon latencies, full user-perceived timings, physical-device benchmarks or accessibility certification. Check exact-head artifacts before quoting values. The intended next evidence gate is genuine human usability and delayed-recall observation, not additional unvalidated features.
