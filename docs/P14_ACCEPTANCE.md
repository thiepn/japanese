# P14 — C1 Long-Form Autonomy, Domain Specialization & Cross-Session Productive Reliability

Status: implementation complete.

## Purpose

P12 established a C1 discourse foundation and P13 added real native-source depth, multi-source synthesis and hidden-future spontaneous interaction.

P14 connects those capabilities across **time, domains and modalities**.

The phase addresses a specific weakness in advanced language-learning systems: a learner can often complete isolated difficult activities without demonstrating that the same reasoning and productive control survive:

- a change of source;
- a change of modality;
- unexpected challenge;
- delayed reconstruction;
- a different domain;
- another day.

P14 therefore treats advanced autonomy as a longitudinal evidence problem rather than as another content-count expansion.

## Five long-form C1 autonomy missions

P14 adds five domain missions:

1. **Research evidence under uncertainty**
2. **Governance, trust and public policy**
3. **Technology, judgment and accountability**
4. **Media, rhetoric and public argument**
5. **Cross-domain transfer and framework limits**

Each mission contains eight stages:

1. canonical C1 reading;
2. second canonical C1 reading;
3. P13 provenance-audited native-source synthesis;
4. P13 multi-source synthesis;
5. hidden-future C1 spontaneous interaction;
6. canonical C1 productive task;
7. delayed transfer of the same productive target;
8. learner reflection.

A mission therefore cannot be completed by repeatedly doing one exercise type.

## Evidence continuity

P14 reuses existing evidence rather than introducing a new mastery database.

Mission progress is reconstructed from normal StudyEvents produced by:

- reader comprehension checks;
- P13 native-source synthesis;
- P13 multi-source synthesis;
- P13 C1 AI-coach interaction;
- canonical C1 productive tasks;
- delayed repeated production;
- P14 mission reflection.

The only new event family is the final ungraded mission reflection.

## Delayed transfer

Each mission contains one delayed-transfer stage.

The stage requires:

- the same C1 productive target;
- structurally successful evidence;
- at least two successful days;
- at least 20 hours between the first and later successful evidence.

Repeating a task several times in one sitting does not satisfy delayed transfer.

This remains an internal reliability condition. Structural success is not equivalent to complete semantic quality.

## Hidden-future interaction requirement

A mission's spontaneous-interaction stage is not completed by opening the AI coach or sending one turn.

P14 checks the underlying P13 scenario chain and requires evidence covering all hidden interaction stages.

The current C1 chains contain five stages.

This preserves the P13 principle that later pressure must be encountered rather than previewed.

## Domain specialization

P14 derives a domain profile for every mission.

The status is reconstructed from mission evidence:

- **not started** — no mission evidence;
- **exploring** — some mission evidence;
- **developing** — at least four stages across at least two active days;
- **sustained** — all mission stages complete across at least two active days.

These labels are navigation/status labels inside the product.

They are not stored as independent mastery truth and do not claim professional or CEFR specialization.

## Cross-session productive reliability

P14 adds a separate C1 reliability projection.

It covers:

- canonical C1 speaking/writing tasks;
- P13 multi-source synthesis packs;
- C1 hidden-future interaction chains;
- delayed AI revisions.

For canonical productive work and synthesis packs, a target becomes **reliable across sessions** only when:

- it has structurally successful attempts on at least two different days; and
- the evidence spans at least 20 hours.

For spontaneous interaction, reliability requires:

- use on at least two days;
- at least a 20-hour span;
- broad stage coverage within the chain.

The reliability model is descriptive. It does not assign an external proficiency score.

## C1 portfolio

P14 introduces a dedicated longitudinal C1 portfolio in Progress.

It summarizes:

- active C1 days;
- C1 texts read;
- C1 texts heard;
- C1 speaking tasks;
- C1 writing tasks;
- P13 synthesis-pack breadth;
- native-source syntheses;
- spontaneous C1 coach turns;
- completed P14 autonomy missions;
- domain status;
- repeated productive reliability;
- spontaneous-interaction reliability;
- recent C1 artifacts.

This intentionally sits beside the existing B2 portfolio instead of replacing or mutating it.

## Portfolio export

The C1 portfolio can be exported as:

- JSON;
- Markdown.

The export schema is:

`thiepn-japanese-c1-portfolio`

Schema version:

`1`

Phase:

`P14`

The export includes the evidence boundary directly so that a portable file does not become misleading once separated from the app.

It explicitly states that:

- the portfolio is not an accredited CEFR result;
- AI feedback does not alter mastery;
- structural checks are not full semantic scores;
- browser speech recognition is not acoustic scoring;
- native playback is exposure evidence, not automatic comprehension mastery;
- repeated internal reliability is not external certification.

## Cross-surface mission routing

P14 turns the mission cards into actionable orchestration rather than static checklists.

A next stage can open:

- the relevant C1 reading;
- the required P13 native-source set;
- the required P13 synthesis pack;
- the matching hidden-future C1 coach chain;
- the relevant canonical productive task.

The native source lab accepts a mission-selected set.

The AI coach accepts a one-shot requested C1 chain and then clears the cross-surface routing request so normal manual use is unaffected.

## Mission reflection

The final mission stage asks the learner to explain how their reasoning changed after source comparison, challenge and delay.

The reflection:

- requires at least 80 characters;
- is saved as a StudyEvent;
- is explicitly ungraded;
- does not enter FSRS;
- does not alter semantic mastery;
- does not create a CEFR result.

Its purpose is longitudinal metacognitive evidence, not scoring.

## Product surfaces

### Immerse

P14 adds the **C1 Long-Form Autonomy** workspace.

It shows:

- five missions;
- stage-by-stage completion;
- active-day count;
- delayed-transfer requirements;
- next actionable stage;
- final reflection input.

### Learn

Mission interaction stages can route directly to the required C1 spontaneous coach chain.

### Progress

P14 adds the dedicated C1 portfolio and cross-session reliability views.

## Architecture

P14 keeps the established architecture intact:

- no new learner-state authority;
- no parallel scheduler;
- no parallel mastery database;
- no new source registry;
- no duplicated native-media truth;
- no new CEFR gate.

It composes P12 and P13 evidence through projection functions.

## P11 boundary

The explicit P12 roadmap override remains in force.

P14 development does not alter the independent P11 release-evidence state.

P14 must not:

- count mission completion as external review;
- count AI interaction as human productive-language validation;
- count internal reliability as P11 qualification;
- rewrite P11 manifests;
- fabricate reviewer evidence.

## Acceptance criteria

P14 is complete when:

- five long-form C1 missions exist;
- each mission spans reading, native sources, synthesis, spontaneous interaction, production, delayed transfer and reflection;
- delayed transfer requires at least two successful days and 20+ hours;
- interaction stages require full hidden-stage coverage;
- domain status is derived from evidence;
- canonical C1 production and synthesis reliability is measured across sessions;
- spontaneous interaction reliability is measured separately;
- a dedicated C1 portfolio exists;
- JSON and Markdown portfolio exports preserve evidence-boundary metadata;
- mission cards can route to their next real activity;
- P11 evidence remains untouched;
- unit, content validation, build and browser E2E suites remain green.

## Later direction

P14 makes the C1 system longitudinal.

Later phases should deepen the actual source and task environment rather than adding another progress abstraction. High-value directions include:

- broader native genres beyond official/public-policy speech;
- long-form native articles paired with source-provenanced audio/video;
- live multi-source research dossiers;
- citation and source-evaluation discipline;
- advanced writing projects revised over several days;
- domain-specific tracks with richer specialist vocabulary;
- more unpredictable live interaction;
- stronger human-review workflows for C1 productive work.

Those later phases should continue to keep product evidence, model feedback, human review and external certification clearly separated.
