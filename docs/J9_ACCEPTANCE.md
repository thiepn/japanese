# J9 Acceptance — Japanese Motion & Sensory Layer

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J9 commit.**

J9 adds a restrained Japanese motion language across the completed J-series learner surfaces. It does not add required ambience, background audio, continuous decorative movement or new learner meaning.

## Motion principles

J9 follows five constraints:

1. motion explains spatial transition or state;
2. motion is one-shot rather than continuously decorative;
3. all transition overlays are pointer-transparent;
4. reduced-motion preference removes the decorative choreography completely;
5. no animation changes StudyEvent, mastery, assessment, navigation or evidence semantics.

The app remains fully usable before an animation finishes.

## Fusuma route transitions

Primary learner-surface changes now receive a short fusuma-inspired reveal.

Implementation:
- two lightweight paper panels;
- surface-tinted treatment;
- panels move away from the center;
- panels use `pointer-events:none`;
- no navigation lock or artificial delay.

The underlying surface is interactive immediately.

## Noren / threshold motion

Threshold-style motion is used where the learner enters a focused context.

Applied to:
- Today surface arrival;
- Study Focus Chamber entry.

The Study Player remains isolated from the normal app shell exactly as in J5.

## Emakimono motion

Learn / 学 now receives an emakimono-style entrance:

- the Learn surface settles laterally;
- the A1→C1 landscape unrolls from the left;
- mobile uses a simpler paper-settle motion because the learning path is vertical there.

No auto-panning is introduced. Learner-controlled scroll remains authoritative.

## Washi page turn

The connected Reader receives a restrained washi-turn reveal.

The Reader paper:
- rotates only a few degrees;
- settles quickly;
- never delays support controls;
- does not alter text layout after the transition completes.

This is a page-entry treatment, not a simulated 3D book.

## Hanko motion

Completion/result seals receive one-shot hanko-style ink arrival.

Applied where already meaningful:
- Today daily seal;
- completed Learn gates;
- Study feedback;
- Reader-check feedback;
- completed Progress milestones.

The seal remains decorative reinforcement. Explicit text/numerical state remains authoritative.

## Ink draw / bloom

Existing semantic progress bars now receive a directional ink-draw gesture.

Applied to:
- J-series ink progress;
- J8 numerical mastery bars;
- legacy meter elements inside preserved portfolio evidence.

The final width remains the existing semantic value.

No continuously animated progress is used.

## Byōbu reveal

Expandable evidence/detail regions receive a restrained byōbu-like unfold.

Applied to:
- J8 skill-crest drill-down;
- J8 B2/C1 evidence vaults;
- J6 advanced studios;
- J4 specialist-practice drawers.

This is presentation-only progressive disclosure over the existing `details/summary` controls.

## Progress landscape arrival

The J8 evolving landscape receives a single entrance settle.

There is no idle looping animation.

The landscape stage continues to derive from the existing six displayed mastery views and remains explicitly non-authoritative.

## Optional sensory feedback

J9 adds a separate, explicit opt-in control in the J2 top bar.

Default:
- off.

When enabled:
- navigation may produce a very short haptic pulse where `navigator.vibrate` is supported;
- Study grading may produce restrained success/correction haptics;
- a very short Web Audio tone may accompany those gestures where supported.

There is:
- no ambient soundtrack;
- no remote audio asset;
- no autoplay;
- no sound before explicit opt-in;
- no effect on grading or learner evidence.

Preference is stored locally as:

`japanese:j-sensory = on | off`

The document exposes `data-j-sensory` for state/debugging.

## Sensory implementation safety

The feedback helper is defensive:
- unsupported vibration is ignored;
- unavailable Web Audio is ignored;
- suspended AudioContext resume failure is ignored;
- feedback failures never fail study/navigation;
- no audio asset is bundled or fetched.

Audio is synthesized locally through a tiny oscillator only after opt-in.

## Theme and seasonal compatibility

J9 uses existing J1/J2 tokens.

Motion does not introduce:
- a separate theme;
- separate seasonal state;
- green dark mode;
- new external artwork.

Fusuma tinting and accents inherit the active J-series surface/theme/season tokens.

## Reduced-motion behavior

Under `prefers-reduced-motion: reduce`:

- fusuma overlay is removed;
- surface entrance animations are removed;
- emakimono unroll is removed;
- Reader page turn is removed;
- hanko animation is removed;
- ink-draw animation is removed;
- byōbu reveal animation is removed;
- decorative transition durations are removed.

Content, controls and final states remain unchanged.

The sensory opt-in is independent of reduced-motion because it is explicitly user-controlled and defaults off.

## Performance boundary

J9 intentionally avoids:
- continuously running requestAnimationFrame loops;
- large video/canvas ambience;
- particle systems;
- backdrop-filter animation;
- remote motion assets;
- heavy scroll-bound JavaScript animation.

The primary motion primitives use short opacity/transform/clip-path transitions.

## Automated qualification

Added:

`tests/e2e/j9-motion-sensory.spec.ts`

Coverage includes:
- Today noren-style motion;
- Learn emakimono motion;
- Library ink-bloom motion;
- Progress byōbu surface motion;
- pointer-transparent fusuma route transition;
- immediate navigation through the transition;
- Reader washi-turn treatment;
- J8 crest byōbu drill-down;
- sensory default-off state;
- sensory opt-in/persistence/opt-out;
- reduced-motion suppression;
- mobile sensory touch sizing;
- document overflow protection.

Existing J2–J8 regression suites remain authoritative for behavior because J9 does not replace their interaction contracts.

## J10 handoff

J10 should implement the **Seasonal Japan System** as a controlled ambient-art layer.

It should:
- preserve stable layouts and learning hierarchy;
- change only ambient motifs/material accents;
- support spring, tsuyu, summer, autumn, winter and New Year;
- keep seasonal art subtle during Study and Reader;
- avoid cliché saturation;
- require no network assets;
- honor reduced motion;
- avoid tying learner progress or rewards to calendar season.
