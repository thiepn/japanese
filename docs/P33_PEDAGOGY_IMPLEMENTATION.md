# P33 — Conversational Fluency & Adaptive Learning Consolidation

Stacked parent: feature/p32-advanced-contextual-practice-flow at exact commit 6e771a2719ecb735161132cec419f114884db014.
Branch: feature/p33-conversational-fluency-adaptive-consolidation.

## Learner-facing functionality delivered
- **Eight original two-perspective role situations**, 16 role paths and 32 authored Japanese production turns across introductions, transport, study/library, service orders, shopping, lost property, appointments and weekend invitations. Each perspective includes two sequential partner turns and independent Japanese answer composition. Integrated into the existing P27 Learn conversation step under an expandable role-switch workflow; not a separate learning dashboard or engine.
- **Listening-first answer mode**: the partner's Japanese script can be hidden while the learner hears browser-synthesized Japanese before composing a response. The transcript can be shown; German comprehension support is optional and marks any subsequent answer as assisted. Synthetic speech does not establish pronunciation quality or listening mastery.
- **Editable independent and assisted responses**: exact, first, unaided authored target matches use canonical StudyPlayer grading and FSRS/StudyEvents. Free alternative utterances, retries after a model, grammar hints and German supports remain ungraded (with event metadata explicitly schedulerExcluded and rawTextStored:false). Model exposure is tracked ephemerally by scenario, role and turn through immediate replays, without creating a second persistent mastery store.
- **Eight original interactive clarification exchanges**: ask a partner to repeat, slow down or explain, receive an original Japanese clarification, and then return to the original role scenario. Repair is an ungraded local StudyEvent, without raw speech/text persistence.
- **Twelve additional original contextual tile exercises**, each with two specific permissible Japanese word orders and grammar explanations. This extends the integrated sentence pool from 84 to **96** original exercises without changing historic P24–P32 prompt identities. They use the same tile builder, StudyPlayer/FSRS cue registry and Today due catalog.
- **Source-owned adaptive review navigation**: up to four ranked units with actual due FSRS traces link directly from the existing "Festigen" step to the existing focused due-only StudyPlayer session. The learner can alternatively view the unit. Neither future reminders nor false due/automatic mastery data are created.
- **Contextual feedback**: the role practice reuses the original lesson's grammar feedback and P32 particle, sentence-function and politeness explanations after responses. Unrecognized free Japanese is never automatically treated as an error or proof of mastery.
- **Source correction**: optional German translation in the role player now marks the next role response as assisted, so a reading/translation scaffold is not credited as independent listening/production. Replay exposure limits are kept in local UI state.

## Preservation
- Preserves all P23–P32 original authored lesson material, existing StudyPlayer cue IDs, native local StudyEvents, FSRS traces, Learn and Today routes. No new DB schema, sync engine, progress scoring, auth, account change, migration or credential.
- The eight uploaded Marugoto and grammar/reference PDFs are pedagogical references only. P33 content was independently authored without importing or copying publisher lessons, dialogs or audio.
- The role and repair UI resides inside the same unified journey, and the sentence tasks reuse the same existing builder. The user retains native learner progress authority.

## Limits and executable status
- P33 remains finite authored Japanese templates, not open conversational AI, grammar-parsing, flexible semantic grading, pronunciation grading or CEFR assessment. Natural alternative Japanese responses beyond the authored targets remain ungraded.
- Browser Japanese synthesis depends on system voices and does not guarantee audio availability/quality. Audio-only practice changes the presentation, not the underlying scheduler.
- StudyEvents omit raw authored replies and recordings, persisting only target-linked metadata.
- Source commits have been created remotely. CI/GitHub Actions, TypeScript checking, builds, full tests and browser acceptance were **NOT_RUN / NOT_TESTED** at the user's request. The branch is not verified as runtime/build-ready. No PR, merge, deployment, production DB, credentials or real learner data were touched.

## Suggested P34 — Natural Response Expansion & Learning Flow Continuity
Expand carefully reviewed alternatives and multi-turn response repair for already-covered A1–A2 situations, deepen pragmatic role transitions and keyboard/mobile study controls, and refine routing from genuine FSRS due traces to the correct modality of practice. Preserve the existing single five-stage Learn experience, local-first data authority, native StudyPlayer/FSRS and original-content licensing boundaries. Implement source first; do not substitute audits or qualification-only work.
