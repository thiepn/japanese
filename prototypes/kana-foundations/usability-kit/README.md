# Ready-to-run five-vowel beginner testing kit

**All templates here are blank. There are no recruited participants, completed trials, learner scores, human pronunciation reviews, or fabricated success results.**

## How to conduct the study

1. Read **[FACILITATOR_GUIDE.md](FACILITATOR_GUIDE.md)** and use it verbatim to obtain consent, screen adult beginners, assign anonymized codes and complete the baseline → prototype → immediate recall → 24–48h independent retention sequence.
2. Prepare **[PARTICIPANT_CARDS.md](PARTICIPANT_CARDS.md)** as individual kana cards. The participant should never see the facilitator's expected readings or the remaining cards during a recall attempt.
3. Copy these **empty** CSV files *outside the repo* into local, access-controlled study storage:
   - **[trial-scores.csv](trial-scores.csv):** one row per actual kana/decoding response. Record raw response, assisted status, correct/incorrect/unsure/skipped, independent score and exact trial order.
   - **[session-observations.csv](session-observations.csv):** one row per actual session. Record consent outcome, device category, accessibility accommodations, facilitator intervention, experienced obstacles and optional 1–5 subjective ratings.
   - **[reviewer-issues.csv](reviewer-issues.csv):** one row per *observed* or genuinely reproduced UI/teaching issue, keeping exact reproduction evidence and severity.
4. In Session 1, score five pretest vowel items, observe independent prototype use, score five posttest vowel items plus two unseen decoding strings, and ask the standardized short feedback questions.
5. In Session 2, 24–48 hours later, score five delayed vowel items plus the two decoding strings *before reopening the prototype*. Track intermediate outside study and missing follow-ups honestly.
6. Report individual anonymized observations and descriptive patterns, not statistical efficacy or generalizable retention. Record **zero** when wrong but **missing/not_assessed** when a participant did not provide a response or session.

### Rules for the CSV scorecard

Allowed \`session\`: \`baseline\`, \`immediate\`, \`delayed\`. The app-use session and optional participant-feedback row live in the observations sheet.

Allowed \`item_kind\`: \`kana\` (five vowels) or \`decoding\` (two two-kana strings).

Allowed \`outcome\`: \`correct\`, \`incorrect\`, \`unsure\`, \`skipped\`, \`not_assessed\`. For \`not_assessed\`, leave \`independent_correct\` blank. For wrong/unsure/skipped, record \`independent_correct=0\`. For unassisted correct response, \`independent_correct=1\`.

\`assisted\`: \`yes\` or \`no\`. A correct assisted answer **does not count** as independent success. Record the actual assistance separately; do not silently recode it.

\`answer_mode\`: \`spoken\` or \`typed\`. Record actual modality and accommodation. \`observed_seconds\` may be blank if not measured; never guess.

\`correct_reading\` is an evaluator-only answer key field, not participant-facing information. Keep the completed CSV private. Reference key: あ=a, い=i, う=u, え=e, お=o, えう=eu, いお=io. The latter two are *decoding sequences only*, not vocabulary items.

\`outside_study\` on Session 2: \`yes\`, \`no\`, or \`unknown\`. Do not assume participants followed a restriction; no restriction is imposed.

### Data hygiene

- The repo contains **templates only**. Never commit completed CSVs, participant recordings, session notes, raw app progress exports, names, contact details or dates of birth.
- Obtain explicit consent to observe, and separately obtain recording consent; default to *no recording*.
- Do not put personal identifiers into anonymous participant codes. Keep any contact arrangements and consent records outside GitHub, under appropriate access controls.
- Do not merge or deploy this prototype merely because a kit or browser CI exists.
- No automatic transfer of prototype localStorage to Account or FSRS.

### What is not proven

Even a well-run 5–8-person pilot identifies UX problems; it cannot validate CEFR outcomes, speech grading, long-term learning effects, or superiority to the historical Studio. Browser emulation is not real hardware, and the published Commons rights declarations in **[AUDIO_RIGHTS_REVIEW.md](AUDIO_RIGHTS_REVIEW.md)** do not substitute for expert auditory review.

## Start checklist (all require actual work)

- [ ] Recruit and obtain consent from 5–8 eligible consenting adult beginners
- [ ] Reserve disposable test-browser profiles, including at least one real narrow phone
- [ ] Print individual prompt cards and keep the reading key hidden
- [ ] Complete Session 1 on real devices and write actual observations privately
- [ ] Complete independent Session 2 after 24–48 hours, or record missing follow-ups
- [ ] Analyze results honestly and identify prioritized pedagogical/UX defects
- [ ] Obtain a qualified Japanese speaker's **real** audio review before bundling any candidate sound

**Current status: 0 participants, 0 results, 0 human audio signoffs.**
