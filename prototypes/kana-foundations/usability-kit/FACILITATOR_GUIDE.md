# Kana Foundations v1 — facilitator runbook (not yet executed)

**Purpose:** Observe the five-vowel prototype with 5–8 consenting adult absolute beginners, then measure unassisted recall 24–48 hours later. This is a small *qualitative* usability/retention investigation; it cannot prove educational efficacy or establish CEFR claims.

**No observations, people, pronunciations or learning results exist in this repository.** This guide and its empty CSV templates are materials for a future real study. Keep all filled documents out of GitHub.

## Prerequisites and holds

- Test the *isolated* \`prototypes/kana-foundations/index.html\` from a reviewed exact PR head on a disposable browser profile/origin. Do not use production, real accounts, legacy Studio learner data or the canonical FSRS scheduler.
- Recruit 5–8 adults aged 18+ who report little or no Japanese knowledge and **cannot already read all five** hiragana vowels. Record prior familiarity as a limitation, not a sensitive profile.
- Ideally test a 320–360px mobile, a normal ~390–430px mobile and a desktop; use own test devices or consented participant devices without collecting identifiers.
- Get consent before observing, and **separate opt-in permission** before recording screen or voice. No recordings by default. A participant may stop without explanation.
- Let participants choose typed or spoken answers; **record the modality**. Never downgrade a participant because of accessibility accommodation. Provide a separate non-audio path when device Japanese playback is unavailable.
- The host keeps an answer key privately. Do not show the participant the romaji answers before or during independent tests.
- Open or print the participant prompts below, the empty \`trial-scores.csv\` and \`session-observations.csv\`; store filled copies locally, not on the public repository.

## Consent script (verbal; record consent state privately, not identity)

"We are testing a short app that teaches five Japanese characters, not testing your intelligence. You may stop or skip any question. We will record only an anonymous code, your answers, and notes about how the interface behaves. We will not make a screen or voice recording without separate permission. Is it okay to proceed?"

Record consent as yes/no in the private session file. If no, stop without recording responses.

## Two counterbalanced character orders

Use anonymous sequential codes **P01–P08**; assign odd-numbered participants to order A, even-numbered to B. These are allocation labels, *not collected participants*.

| Phase | Order A | Order B |
|---|---|---|
| Baseline (before app) | う あ お い え | え い お あ う |
| Immediate independent test | え う い お あ | あ お い う え |
| Delayed 24–48h test | お え あ う い | い う あ え お |

Read or display *one kana at a time without romaji*. The specific order appears in the scoring row as trial sequence. Never teach a reading during baseline testing.

## Session 1 (suggested 10–15 minutes; allow extra time)

1. **Consent and pretest (2 minutes).** Confirm adult and beginner status without personal details. Present the five characters in the assigned baseline order. Ask: "What sound does this character make?" Accept spoken or typed *romaji*, but do not reveal right answers, hints or correctness. Write each response exactly; record uncertainty, skip or assistance.
2. **Unassisted product use (5–10 minutes).** Show the intro/start screen and say: "Please use this app as you normally would to learn these characters. Tell me when you think you have finished. I won't explain the controls unless you get stuck."
3. Record actual navigation, mis-taps, scroll/keyboard obstruction, audio availability/quality complaints, hint/reveal usage, repeated errors, time to locate Continue/Exit and any facilitator assistance. Do not describe hypothetical issues as observations. If blocked for ~30 seconds ask "What did you expect to happen?" before helping; mark \`facilitator_assisted=yes\` if needed.
4. **Independent immediate posttest (2 minutes).** Close/hide the learning app. Present the five kana, one at a time, in the assigned immediate order, without feedback or hints. Record independent exact readings. If a participant asks for a hint, mark assisted and do **not** score an unassisted success.
5. **Unseen recombination check.** Ask the learner to read **えう** and **いお**. These are kana *decoding strings*, **not claimed Japanese vocabulary or meaningful phrases**; only score the two-kana reading sequences (eu, io). Do not ask for or score meaning.
6. **Short feedback.** Ask on 1–5 scales: starting clarity, feedback clarity, overall ease, enjoyment and willingness to return. Ask what felt confusing and which moment helped them most. Record the participant's actual response (only if consented).

Do **not** mistake same-session correct answers, built-in game scores, or hearing a synthetic device voice for proven delayed retention or authentic native pronunciation.

## Session 2: independent retention after 24–48 hours

1. Ask whether the participant studied Japanese between sessions. Record **yes/no/unknown** and an optional neutral note. Do not send reminders containing kana readings or prompt a study session.
2. **Before showing any app results**, present five vowels in the assigned delayed order. Ask for readings with no help. Record one row per item, including omitted answers and modality.
3. Present いお and えう in the opposite order from Session 1. Again score only decoding; no semantic vocabulary claims.
4. Let the participant open the saved prototype and find weak-character practice without coaching. Observe any confusion around its results. Do not treat app-local \`practiceOnly\` events as independent scheduled-review evidence.
5. Ask if they would return to the app and why. If a participant doesn't return for Session 2, mark **missing follow-up**, never score 0% retention or invent answers.

## Scoring rubric

- \`correct=1\`: exactly correct unassisted reading (lowercase romaji, optional whitespace normalization). \`correct=0\`: wrong/uncertain/skipped, but distinguish them in \`outcome\`.
- \`outcome\`: correct, incorrect, unsure, skipped, not_assessed. Never infer missing results.
- \`assisted=yes\`: any facilitator cue, answer reveal, or guided option at the time of an independent assessment. Assisted correct responses receive \`correct=0\` in the **independent** score; preserve raw response and reason.
- Record baseline / immediate / delayed separately. Report each individual's 0–5 counts as well as the number of completed follow-ups. Avoid inferential claims with such a small sample.
- Keep learner statements, observed actions, reviewer conclusions and app-generated events in separate columns/files.

## Reporting and stop rules

Report **observed participants / eligible participants / delayed follow-ups**, character-specific confusions, first-try navigation success, observed issues by severity, baseline vs immediate vs delayed counts (individual and descriptive only), and honest human feedback. Highlight missing/assisted data. The presence of five to eight participants is not a power calculation.

Stop and investigate if the prototype loses historical data, writes to Account/FSRS, makes false mastery claims, teaches incorrect readings, blocks required actions or exposes private participant material. Do not publish raw data or screenshots with identifiable content.

**Current status: kit authored, study not conducted, outcome unknown.**
