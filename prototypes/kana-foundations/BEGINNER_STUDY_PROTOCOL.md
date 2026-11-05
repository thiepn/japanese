# Kana Foundations — Beginner usability and delayed-recall protocol

**Status: proposed protocol only. Not executed. No learner results or human review are claimed.**

## Purpose and boundary

Evaluate whether a real beginner can use the *five-hiragana-vowel* learning prototype comfortably and independently, whether immediate improvement reflects learning rather than guessing or answer copying, and what they retain after a delay. This is not CEFR validation, speech assessment, a comparative efficacy trial or proof that the complete Japanese app is ready.

The test application remains the isolated prototype on draft PR #127. Do not enable Account, modify canonical FSRS schedules, collect participant identity inside the app, import historical data or use production learner profiles.

## Participants

- Recruit **5–8 adult absolute beginners** who cannot already read the five hiragana vowels. Screen before beginning; exclude advanced Japanese readers from the beginner analysis.
- Document prior language-learning experience and general accessibility needs only when volunteered and relevant. Do not collect medical diagnoses or sensitive personal history.
- Use at least one 320–360 px Android device, one typical 390–430 px mobile screen and a laptop/desktop. Record the *device/browser*, viewport and input method, not identifying device IDs.
- Obtain informed, opt-in consent to observe tasks; separately request permission for screen capture. Participation can stop at any time. Use anonymous participant codes and aggregate notes. Do not upload recordings or localStorage exports to public GitHub.

## Session 1 — unassisted learning (roughly 10–15 minutes)

1. Before opening the lesson, ask the participant to read the five displayed kana **without feedback**, in a shuffled order. Score independently correct readings, uncertain answers and non-answers. Do not teach during the pretest.
2. Start the prototype at the first lesson. Say only: "Use this app to learn to read these Japanese characters. Tell me when you think you have finished." Avoid pointing to controls, giving clues, explaining terms or revealing answers.
3. Observe first interaction, character introduction, optional listening, hints, wrong-answer feedback, typed recall, word decoding and results. Record number of prompts requested, wrong presses, time spent looking for next controls, audio failures and situations in which the visible content is hidden by the footer or keyboard.
4. Allow normal help and corrections provided *by the prototype*, not by the facilitator. If the participant gets stuck for 30 seconds, ask what they expect to happen before offering neutral help; record the intervention.
5. Immediately after the session, present the five kana in a *new randomized order with no romaji or answer choices*. Ask the participant to type or speak readings without assistance. Separately record recognition versus typed recall already logged by the app.
6. Ask a small held-out decoding task using **いい** and **あう** after independent Japanese-language verification. Score pronunciation/reading only; do **not** claim knowledge of vocabulary meaning. If these examples are not approved, substitute explicitly labeled artificial vowel strings and do not present them as words.
7. Obtain short subjective ratings: ease of starting, clarity of feedback, confidence, enjoyment and willingness to return (each 1–5), followed by "What was the most frustrating moment?" and "What did you think would happen next?"

Optional: run the *historical* October 26 Studio with separate disposable storage to compare first-interaction friction. If doing so, counterbalance the order of prototypes; acknowledge strong practice effects. Do not connect original Studio to real accounts. This qualitative round is not a randomized learning-efficacy comparison.

## Session 2 — independent retention (24–48 hours later)

Do not send study reminders containing answers, hints or practice prompts between sessions. Record participant-declared outside Japanese study; report such cases separately.

1. Before opening the prototype or showing the previous results, present the same five kana in a **different randomized order**. Record correct unassisted readings, hesitant answers and unanswered items.
2. Present the held-out decoding strings from the approved list, with randomized item order. Record accurate decoding and error patterns; do not score the meaning unless taught and assessed separately.
3. Only then let the participant return to the prototype and describe which characters they wish to review. Observe whether the results are understandable and whether they can find weak-item practice without assistance.
4. Ask whether the experience felt worth returning to. Record actual statement and reason, not a fabricated satisfaction score.

## Measurement sheet (one row per participant and attempt)

Use an anonymous participant code and these non-identifying fields:
- Session (baseline, immediate, 24–48h), anonymized device/browser category, time since prior session.
- Item ID, task type (recognition, recall, word decoding), answer, independent/assisted status, correct/incorrect/not attempted, response latency (only where actually observed).
- Whether audio was available, whether it worked, and whether it was synthetic. Listening is **not assessed** when absent or unverified.
- Friction: lost focus, hidden control, mis-tap, accidental progression, need for external explanation, unexpected reload, perceived lag, visible clipping.
- User-rated enjoyment, clarity and intention to return (1–5), plus concise verbatim feedback only with consent.
- Outside study since session 1, facilitator interventions, withdrawals and missing session 2 data.

## Review and stop gates

**Safety and correctness gates:** zero observed loss of existing learner data; no account or production writes; no wrong kana readings or false achievement; no inaccessible mandatory actions. Any critical violation blocks expansion.

**Usability signals (provisional, not success claims):**
- Most novices finish the unit without facilitator instructions; log any intervention as a failure of unassisted completion.
- Learners can find and activate sound/hints/corrections/results. On small phones, teaching content is visible without being obscured by the next action.
- Incorrect answers consistently trigger comprehensible explanations and maintain correct first-attempt records.
- Independent five-kana performance immediately afterward is reported alongside the 24–48h measure; *do not replace delayed performance with same-session scores*.

**Do not use averages alone:** show each anonymized outcome and error pattern. Five to eight participants reveal usability problems but are insufficient for statistical superiority, validated retention effect sizes or generalizable language-learning claims.

## Evidence discipline

- Separate **observed** participant actions, **reported** opinions, app telemetry, and evaluator interpretation.
- If no participant is recruited, report "human learner evidence: none".
- If no Japanese specialist checks the spoken pronunciation and the held-out words, report "audio / educational accuracy: pending expert review".
- If native speech playback is unavailable, mark listening as "not assessed"; never mark it correct or penalize the learner.
- Preserve all historical commits and deployed app behavior. Only consider wider kana coverage after a follow-up learning/usability iteration supported by this evidence.

## Compact observer script

> "This is a prototype that teaches five Japanese characters. Please use it as you normally would. I won't explain its controls unless you become stuck. Your performance is not being graded; we're evaluating the app. If you want to stop, please tell me."

No testing has been performed under this protocol at authoring time.
