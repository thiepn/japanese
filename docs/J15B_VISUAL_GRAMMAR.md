# J15B — Japanese Visual Grammar

**Status:** implemented as a repository design contract; automated and physical-device qualification remain separate.

## Intent and authority

J15B freezes the product's visual language *after* J15A, without changing curriculum, FSRS, StudyEvents, mastered-state calculation, local-first storage, Account identity or any existing learner action. The grammar follows `docs/J0_ART_BIBLE.md`; J12 mobile and J13 exhibition keep their layout authority. It does not make all five learner destinations look alike.

This contract is shared by light and dark themes. The terminal `apps/web/src/design/j15b.css` layer defines the visual-semantic tokens and enforces a small number of structural invariants. Page-specific CSS remains authoritative for every **functional** composition.

## I. Material hierarchy

| Material | Role | Restriction |
| --- | --- | --- |
| **Washi** | Main page substrate, quiet input/reading paper | Fine CSS texture only outside critical text; no fake old parchment |
| **Sumi** | Text, hairlines, focused study framing | Strong reading contrast; do not turn every section into a black card |
| **Aizome / indigo** | Information, navigation, focus relationships | Not an all-purpose call-to-action color |
| **Shu / vermilion** | One dominant action, seal, achievement punctuation | Avoid repeating red buttons down the page |
| **Urushi / lacquer** | Rare high-value/ceremonial transition | Never the default panel background |
| **Kin / gold** | Milestone, reward, byōbu accents | Exceptional usage only; no metallic gradient decoration |

Use `--j-vg-paper`, `--j-vg-sheet`, `--j-vg-ink`, `--j-vg-ink-soft`, `--j-vg-indigo`, `--j-vg-lacquer`, `--j-vg-seal`, `--j-vg-ceremonial-gold`, `--j-vg-rule` and `--j-vg-rule-strong`. Do not hardcode one theme's palette into a reusable component.

## II. Type hierarchy

- **UI Gothic** (`--j-vg-type-interface`): navigation, accessible labels, buttons, form controls, tiny metadata.
- **Editorial Mincho** (`--j-vg-type-japanese`): Japanese titles, chapter openings, primary Japanese reading and exhibit marks.
- Prefer Japanese graphemes and actual content over giant English slogans. A view has one semantically correct `h1`; decorative glyphs are `aria-hidden` when redundant.
- Reader body keeps a generous `--j-vg-reading-leading: 1.95` and a practical maximum reading measure, not compressed marketing typography.
- Furigana, transcript, grammar explanations, feedback, answer controls and search results are protected clarity zones.

## III. Line, shape and spacing

- Default paper edge is square (`--j-vg-paper-corner: 0px`). Frame sections with thin rules and deliberate blank space rather than colored cards.
- Seals may use a slight irregularity (`--j-vg-seal-corner: 2px`). Circles are allowed for genuine seals, crests, audio transport, natural motifs and progress nodes, **not** as a universal component radius.
- Spatial scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px. Section spacing can use `--j-vg-section-gap`; maintain visible 44px minimum touch targets where an interaction needs it.
- Pages may be asymmetric, but tab order, reading order and controls remain predictable. Negative space must not delay access to the primary study action.
- No floating glass dock, blurred pill navigation or heavy elevation shadows. Desktop navigation is editorial and horizontal; mobile navigation remains a practical fixed bottom rail.

## IV. Pattern selection

Pattern is meaning, not wallpaper:

| Surface | Primary artistic grammar | Allowed motif |
| --- | --- | --- |
| **Today / 今日** | Entry ritual, shoji rhythm, a single continue action | Gentle ambient light / one quiet seal |
| **Learn / 学ぶ** | Emakimono world, landmarks, path and gates | Landmarks, map terrain, occasional textile |
| **Immerse / 浸る** | Magazine covers, literary reader | Editorial rules and media-specific cover art |
| **Library / 蔵** | Archive, reference folios, dense retrieval | Spines, index rules, cartouches |
| **Progress / 道** | Landscape, journey and numerical evidence ledger | Sparse scenery and milestone seals |

One dominant pattern family per composition. Shell seasonal motifs remain ambient only. Never put contrast-reducing patterns behind lengthy Japanese text, practice answers, scripts, furigana or feedback.

## V. Motion

Use the existing J9 single-purpose ink, paper, fusuma, noren, byōbu and seal transitions. Motion must communicate arrival, progress or state; avoid continuous decorative animation, gratuitous hover movement and parallax inside Study or Reader. Reduced-motion preference takes precedence over all flourish. Audio and haptics remain opt-in.

## VI. Functional exceptions

Rounded geometry is permitted for audio or writing affordances, a crest or genuine seal, a map node, or a purposeful interactive diagram. Layout-specific cards can be used when *the learner task* requires comparison, bounded answer choices or legible feedback. These exceptions must be named and justified in component code or phase acceptance material; they are not permission to reintroduce dashboard defaults.

## VII. Implementation / regression gates

- `apps/web/src/design/j15b.css` is imported **after** J1–J10. J11 diagnostics, J12 mobile and J13 exhibition are still lazy.
- The page identity of Today, Learn, Immerse, Library and Progress remains distinct.
- Main page headers are flat paper; the primary rail has no blur/shadow and navigation buttons are not pills.
- Inherited legacy cards use rectangular paper framing, not rounded dashboard tiles.
- Reader typography, Library search and keyboard focus retain their specialized clarity.
- Light/dark states use semantic tokens. Seasonal art does not change layout or semantics.
- `pnpm verify:j15b` enforces the checked-in contract statically; `tests/e2e/j15b-visual-grammar.spec.ts` verifies browser-computed behavior.
- `pnpm build` runs both J15 native-theme and J15B grammar audits.
- Full Playwright and candidate deployment must pass before promotion. Physical Android/PWA certification remains an independent, not automated, requirement.

## Anti-pattern review checklist

Reject a change when it adds an oversized English hero as the default screen; repeats equal rounded cards across unrelated destinations; treats a shadow as information hierarchy; hides search under decorative imagery; places patterns behind reading or writing controls; breaks contrast in dark mode; sacrifices keyboard focus for aesthetic cleanliness; turns mobile navigation into a floating pill; or moves educational evidence computation into presentation CSS.

## Existing debt and scope

Older page CSS still contains historical radius, shadow and material declarations. J15B defines terminal, testable invariants for learner chrome and the main surface compositions. It does **not** pretend to have erased every legacy declaration; deleting accumulated dead rules safely is a separate audited refactor. No learning-engine behavior is modified here.
