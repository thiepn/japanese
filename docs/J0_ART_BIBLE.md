# J0 — Japanese Visual Art Bible

## Status

**Locked design direction for the J-series visual rebuild.**

J0 authorizes a major visual-product version after P22 without reopening learner-capability growth. The learning engine, StudyEvent evidence model, FSRS scheduling, account boundaries, canonical content graph, search, local-first storage and proficiency/evidence boundaries remain authoritative. The J-series changes presentation, navigation, spatial composition, interaction art direction and visual hierarchy.

The visual objective is not "Japanese-themed SaaS." It is an original interactive Japanese art world whose interface could not plausibly belong to another language product.

## North star

> Opening Japanese should feel like entering an evolving interactive work of Japanese art while the actual learning surface remains exceptionally legible.

The system is deliberately maximalist around learning content and deliberately disciplined inside learning content.

### Maximalism envelope

High-expression zones:
- shell, navigation, page transitions and empty space;
- section headers and chapter markers;
- progress worlds, maps and milestone moments;
- decorative side rails and large-screen canvases;
- loading, completion and seasonal states;
- Immerse covers, editorial material and library ambience.

Protected clarity zones:
- Japanese reading text;
- answer controls;
- transcript and furigana;
- grammar explanations;
- forms, assessment prompts and feedback;
- accessibility/focus states;
- dense search results.

No texture, animation, pattern or illustration may reduce reading contrast or response speed.

## Art-direction thesis

The identity is built from a controlled collision of:

1. **Washi + sumi** — tactile paper, fibre, absorbency, ink, negative space.
2. **Ukiyo-e / mokuhanga** — flat color layers, strong contour, asymmetry, cartouches, registration character, framed vistas.
3. **Nihonga / byōbu** — gold, cloud masses, large-scale composition, quiet negative space, multi-panel reveals.
4. **Calligraphy / shodō** — expressive brush line, seals, vertical labels, gesture.
5. **Japanese architecture** — shoji grids, fusuma movement, noren thresholds, tatami-derived proportion, engawa-like circulation.
6. **Textile / chiyogami pattern** — repeat motifs used as semantic texture rather than random wallpaper.
7. **Seasonal visual culture** — changing atmosphere without changing information architecture.
8. **Contemporary Japan** — rail-signage precision, editorial density, Tokyo night color, Shōwa print energy, contemporary product restraint.

The product must use contrast between these families. It must not put every motif on every screen.

## Visual vocabulary

### Materials

**Washi**
- default light-mode substrate;
- simulated with low-contrast vector/noise layers, not a large photographic texture;
- fibre visibility target: subtle at 100%, almost invisible behind body text;
- no beige "old parchment" treatment.

**Sumi**
- primary dark pigment;
- used for foreground, brush gestures and dark surfaces;
- dark mode is sumi/charcoal, not green-black.

**Aizome / indigo**
- navigation, focus and deep informational color;
- bridges historical and contemporary styling.

**Shu / vermilion**
- high-salience action, selected state, seals and milestone punctuation;
- never used for every button.

**Kin / gold**
- rare reward and landmark material;
- reserved for milestone, byōbu, seasonal and high-level mastery moments;
- simulated as layered warm gradients/noise, never gaudy metallic chrome.

**Urushi / lacquer**
- deep near-black or deep red high-value surfaces;
- used sparingly for overlays, ceremonial completion and dark-mode accents.

**Wood**
- warm structural separator, frame or rail motif;
- abstracted; no fake photoreal timber panels in ordinary UI.

### Core palette families

These are product tokens, not claims of historically exact pigment formulas.

Light:
- washi-0: #FBF8F1
- washi-1: #F3EEE3
- paper-shadow: #E6DED0
- sumi-900: #171715
- sumi-700: #34322E
- sumi-500: #656057
- ai-700: #183B56
- ai-500: #315E78
- shu-600: #C63C2F
- shu-700: #9E2E25
- kin-500: #B88A3B
- matcha-500: #64714A
- sakura-300: #E6B7B8

Dark:
- sumi-night: #0D0D0C
- charcoal-900: #151513
- charcoal-800: #1E1D1A
- lacquer-900: #240D0B
- indigo-night: #102734
- paper-night: #EDE7DC
- vermilion-night: #E05A47
- gold-night: #C9A45C

The J1 token implementation may tune values for contrast but should preserve these families.

## Pattern library

J1 should implement patterns as reusable SVG/CSS primitives with semantic names and intensity controls.

Priority set:
- seigaiha / 青海波;
- asanoha / 麻の葉;
- shippō / 七宝;
- ichimatsu / 市松;
- kikkō / 亀甲;
- yagasure / 矢絣;
- karakusa / 唐草;
- sayagata / 紗綾形;
- stylized cloud / kumo;
- wave / nami;
- bamboo, pine, plum, maple and chrysanthemum botanical motifs.

Rules:
- patterns cannot sit behind long-form Japanese text above a minimal-opacity threshold;
- one dominant pattern family per composition;
- pattern choice follows surface semantics or season;
- avoid costume-shop combinations of multiple unrelated motifs;
- no pattern becomes a universal brand background.

## Composition grammar

### Asymmetry over centered-card repetition

Preferred:
- offset columns;
- framed vistas;
- interrupted grids;
- strong blank areas;
- vertical labels against horizontal content;
- overlapping cloud/ink masses in decorative zones;
- edge-to-edge art moments;
- deliberate crop and negative space.

Avoid:
- endless 3-column card matrices;
- every section centered inside the same rounded white rectangle;
- repeating identical statistics tiles for unrelated information.

### Shoji grid

Use shoji-inspired proportion as a layout scaffold:
- strong rhythm;
- nested rectangular bays;
- sliding/revealing content behavior;
- subtle grid lines only where meaningful.

It is an abstraction, not a fake wall.

### Tatami proportion

Use tatami-like rectangular ratios to influence major dashboard regions and large-screen composition. Do not literally render tatami mats under app content.

### Cartouches

Ukiyo-e-inspired cartouches can carry:
- chapter numbers;
- Japanese surface names;
- level labels;
- milestone identity.

They should be graphic framing devices, not faux-historical labels on every component.

## Typography

The typography system needs three roles:

1. **UI Gothic** — navigation, controls, dense metadata.
2. **Editorial Mincho** — literary reading, major Japanese titles, Immerse editorial surfaces.
3. **Expressive brush/display** — decorative section glyphs, limited calligraphic moments only.

Requirements:
- Japanese glyph quality takes priority over Latin branding;
- Latin and Japanese x-height/weight must be visually harmonized;
- body copy must never use decorative brush typography;
- ruby/furigana remains readable at mobile scale;
- line-height for Japanese reading is intentionally generous;
- vertical writing (tategaki) is allowed for ornament, chapter rails, quotes and selected immersive passages, never as a forced default for exercises.

Candidate font families are implementation choices for J1 and must pass redistribution/offline licensing review before bundling.

## Iconography

Generic outline-icon packs should not define the product.

Primary icon families should derive from:
- brush marks;
- seals;
- mon-like geometric symbols;
- paper/scroll/book forms;
- landscape/weather abstractions;
- contemporary rail-signage geometry for utility actions.

Icons must remain instantly legible at 20–24 px. Decorative emblems may be more intricate but cannot replace accessible labels.

## Hanko / seal system

The seal system is a signature interaction primitive.

Possible semantics:
- complete;
- mastered;
- reviewed;
- saved/mined;
- milestone reached;
- streak/return marker.

Rules:
- the same red seal cannot mean five different things in one context;
- stamp animation is short and optional under reduced motion;
- learner data remains textually explicit; seals are reinforcement, not the only status channel.

## Ink system

Three distinct ink behaviors:

**Brush stroke** — directional, decisive, used for selection/confirmation.

**Ink wash** — ambient/background composition only.

**Ink bloom** — microinteraction for reveal/completion; never under body text.

No fake random splatter texture. The system should feel intentional and calligraphic.

## Motion language

Transitions are physical metaphors rather than generic fades:

- **fusuma**: lateral panel reveal for major context switches;
- **noren**: vertical threshold for entering a focused space;
- **washi turn**: lightweight page transition for editorial reading;
- **hanko**: short impact for completion;
- **ink draw**: progress and selected-state confirmation;
- **byōbu unfold**: rare milestone/Progress reveal;
- **emaki pan**: Learn journey navigation.

Performance rules:
- transform/opacity first;
- no continuous high-cost blur/filter animation;
- reduced-motion version must preserve state change without simulated physical movement;
- decorative ambient motion pauses when hidden or backgrounded.

## Seasonal system

Season changes atmosphere, not navigation.

### Spring
- sakura;
- young green;
- pale sky;
- light haze.

### Tsuyu / rainy season
- indigo;
- ripple and rain-line motifs;
- hydrangea accents.

### Summer
- deep blue;
- morning glory;
- lantern warmth;
- restrained festival/firework moments.

### Autumn
- maple;
- persimmon/vermilion;
- warm gold;
- clearer high-contrast landscapes.

### Winter
- snow;
- black ink landscape;
- bare branches;
- plum accents.

New Year may receive a short red/white/gold ceremonial layer.

Seasonality must be opt-out-able and must never reduce contrast.

## Contemporary Japan layer

The product must not become a historical museum.

Contemporary references:
- transit-wayfinding clarity;
- editorial/magazine crop and typography;
- vertical signage;
- convenience/package graphic confidence;
- Shōwa poster geometry where appropriate;
- controlled Tokyo-neon color only in selected Immerse/night surfaces;
- manga-panel rhythm as a compositional device, without copying manga characters or panels;
- compact high-information utility zones.

The core tension is **craft + city**, **paper + screen**, **ink + light**.

## Surface art direction

### Today / 今日 — Morning ritual

Mood: calm, intentional, tactile.

- soft shoji-light field;
- oversized decorative 今日;
- one dominant study action;
- compact queue visualized as an ink route;
- daily completion receives one restrained seal;
- secondary information recedes.

No dashboard wall of equal-weight statistic cards.

### Learn / 学 — Emakimono journey

Mood: expansive, adventurous, signature product moment.

The A1→C1 path becomes a navigable illustrated landscape/scroll:
- level regions;
- bridges/gates for transitions;
- chapter landmarks;
- mastered areas visually "inked in";
- current route highlighted;
- distant future visible but not noisy;
- mobile uses a guided vertical/hybrid path; large screens can pan horizontally.

The metaphor visualizes progress but never changes prerequisite truth.

### Study — Focus chamber

Mood: concentration.

- app chrome recedes;
- primary prompt occupies visual center;
- task-specific art framing;
- kana/kanji can use genkō/shūji-inspired grids;
- audio interaction uses large tactile control;
- feedback uses ink/seal language;
- no decorative pattern behind answer text.

Study is the most usable screen, not the most decorated screen.

### Immerse / 浸 — Editorial Japan

Mood: contemporary media culture.

- magazine/poster/book-cover compositions;
- native content organized visually by medium/genre;
- richer photography/art only when licensed;
- day/night variants allowed;
- strong vertical Japanese display type;
- motion can feel cinematic but remains optional.

### Reader — Modern Japanese book

Mood: typographic and quiet.

- Mincho-forward;
- excellent ruby;
- strong measure/line-height;
- marginal vertical chapter markers;
- translation/grammar support appears as layers, not permanent visual clutter;
- optional tategaki mode can be explored later, but not required for J0.

### Library / 蔵 — Archive

Mood: fast, dense, beautiful.

- search dominates;
- dictionary-like results;
- vertical labels/book-spine abstraction in decorative areas;
- semantic filters remain contemporary and clear;
- no fake 3D bookshelf dependency.

### Progress / 道 — Path

Mood: longitudinal achievement.

- evidence remains real and inspectable;
- major levels become landmarks;
- skill families become an emblem/crest-style visualization plus accessible numerical detail;
- milestone moments receive collectible seals;
- learner journey can gradually generate a personal evolving artwork.

Operational/admin panels do not belong here.

## Living-world concept

The visual world may evolve as real learner evidence accumulates:

- script knowledge adds written forms/signage;
- lexical breadth enriches objects and labels;
- grammar connects locations/actions;
- reading opens books/notices;
- listening introduces ambient media/sound indicators;
- advanced levels shift toward journalism, professional communication, research and native media.

This world is a projection of existing learner state. It must never become a second mastery system.

## Admin / operations boundary

P22 operational content is removed from the normal learner experience in the J-series.

Release identity, provider health, human-review administration and release operations move to an explicit diagnostics/developer route or build-time tools.

Normal learners should never see phase labels such as "P22 stable release activation" in the primary shell.

## Accessibility boundary

Maximalism is conditional on legibility.

Mandatory:
- WCAG-compatible text/control contrast;
- focus styles that remain visible over decorative backgrounds;
- text alternatives for status conveyed by art;
- reduced-motion support;
- no mandatory audio ambience;
- no meaning encoded by color alone;
- minimum touch targets preserved;
- zoom/reflow support;
- screen-reader order follows information order, not decorative art placement;
- decorative Japanese glyphs hidden from accessibility APIs when they duplicate labels.

## Performance boundary

The visual system must remain PWA-first.

Preferred implementation:
- CSS/SVG procedural patterns;
- compressed local textures;
- small reusable masks;
- responsive art assets;
- lazy-loaded surface illustration;
- no WebGL requirement for core navigation;
- no autoplay video backgrounds;
- no multi-megabyte hero images on initial route.

J14 will set measurable budgets, but J1 must make performance a primitive constraint.

## Art/source policy

The redesign may use:
- original vector art created for the product;
- procedural patterns derived from geometric/traditional motifs;
- public-domain/CC0 museum artwork where exact reuse materially improves a surface;
- licensed open fonts/assets after explicit verification.

Preferred research/source pools:
- The Metropolitan Museum of Art Open Access / CC0;
- Smithsonian Open Access / National Museum of Asian Art;
- Library of Congress Japanese Fine Prints, item-by-item rights review;
- Japan House London educational material for research/reference only unless an asset's reuse terms independently permit redistribution.

Museum artwork must be stored with provenance: institution, object title, artist when known, date/period, object URL, image URL/source, rights statement/license, retrieval date and app usage.

No image is admitted merely because it appears old or appears in search results.

## Research basis

J0 was informed by museum/institution material describing:
- ukiyo-e as a multi-block color-print process in which line/color and layered registration are fundamental;
- Japanese woodblock collaboration and strong absorbent paper;
- shoji/fusuma/tatami as defining spatial elements of Japanese rooms;
- washi as a durable long-fibre paper used across books, images, shoji/fusuma and everyday objects;
- chiyogami as patterned printed washi drawing heavily from textile/natural/seasonal motifs;
- asymmetric composition, elongated formats and intentional empty space as influential characteristics of Japanese print aesthetics.

Reference URLs:
- https://www.metmuseum.org/essays/woodblock-prints-in-the-ukiyo-e-style
- https://www.metmuseum.org/hubs/open-access
- https://www.japanhouselondon.uk/read-and-watch/washi/
- https://www.japanhouselondon.uk/read-and-watch/chiyogami-hand-printed-japanese-paper/
- https://www.japanhouselondon.uk/read-and-watch/japanese-houses/
- https://www.loc.gov/collections/japanese-fine-prints-pre-1915/about-this-collection/
- https://www.si.edu/openaccess

## Anti-rules

The following fail J0:

- generic beige "zen" minimalism;
- anime characters as the core visual identity;
- cherry blossoms on every screen;
- torii/lantern/pagoda clip-art pasted into unrelated controls;
- random Japanese text used as decoration without knowing what it says;
- pseudo-Japanese fonts for Latin text;
- replacing usability with ornamental skeuomorphism;
- copying a living artist's signature visual language;
- reproducing copyrighted manga/anime/game UI;
- green-tinted dark mode;
- glassmorphism as the dominant surface language;
- every block becoming a rounded card;
- every state using the same red seal;
- mixing five traditional patterns in one viewport;
- shipping unverified museum images or web-found artwork.

## J0 lock

J1 and later phases may tune implementation details, but the following are locked unless explicitly reopened:

1. Japanese maximalist art direction.
2. Traditional × contemporary collision.
3. Protected clarity zones for learning.
4. Washi/sumi/indigo/vermilion/gold material family.
5. Surface-specific art direction rather than one repeated card language.
6. Learn as the signature emakimono-style journey.
7. Study as the highest-usability, lowest-clutter surface.
8. Progress as 道 and longitudinal visual journey.
9. Dark mode as sumi/charcoal/indigo/lacquer, never dark green.
10. Provenance-first asset licensing.
11. J-series is a visual/product-version track, not a new proficiency-capability track.
