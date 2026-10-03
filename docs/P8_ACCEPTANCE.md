# P8 — B2 Consolidation, Long-Form Autonomy & Production Reliability

Status: implementation complete; external AI/morphology runtimes and licensed native-media inventory remain deployment/source dependent

## Purpose

P8 consolidates B2 rather than widening labels toward C1. The phase makes existing B2 knowledge survive longer tasks, multiple sources, delayed retrieval and changing contexts.

No P8 metric is an accredited CEFR score or a pass/fail decision.

## Long-form autonomy missions

P8 adds six multi-document mission chains:

- responsible AI adoption at work;
- headline/source verification and defensible conclusions;
- community support planning;
- workplace negotiation and process change;
- environment/housing/transport trade-offs;
- counterargument, research evidence and synthesis.

Each mission combines:

- reading checks;
- connected-listening checks;
- independent speaking and/or writing;
- a final delayed-transfer stage.

Mission progress is inferred from normal StudyEvents. It is not a parallel mastery database.

Delayed-transfer completion requires graded production evidence on the same target separated by at least 20 hours. Exposure alone does not complete the stage.

## Sustained interaction

The AI coach now supports four-stage scenario chains:

1. plan;
2. clarify;
3. repair;
4. follow up.

Chains cover workplace change, disputed online claims, community planning and research discussion. Each stage carries explicit communicative goals so the learner must continue, clarify and repair rather than answer a sequence of unrelated prompts.

Scenario-chain metadata is persisted with advisory coach events. Model feedback still has no authority to alter durable mastery, milestone scores or FSRS scheduling.

## Delayed revision and recurring-error remediation

P8 reconstructs revision history from immutable coach events.

- advisory responses older than 20 hours can become delayed-revision candidates;
- a revision links back to the original event with `revisionOfEventId`;
- delay duration is stored as event metadata;
- prior feedback themes can be reused as revision goals;
- repeated grammar/vocabulary/coherence/task messages are summarized as recurring patterns.

Delayed revision remains advisory when it uses AI feedback. The existence of a revision is portfolio evidence, not proof of mastery.

## Production reliability

P8 derives production reliability from existing StudyEvents.

A B2 productive task is marked cross-session reliable only when structurally successful attempts occur on at least two different days and the evidence span is at least 20 hours.

The reliability projection reports:

- active production days;
- B2 tasks attempted;
- successful structural attempts;
- cross-session reliable tasks;
- delayed AI revisions;
- lexical chunks demonstrated across different tasks and days;
- recurring advisory feedback patterns.

The structural success rule is intentionally narrow. It does not claim semantic, pragmatic or acoustic correctness.

## Cumulative B2 portfolio

Progress now includes a descriptive B2 portfolio with:

- B2 texts completed through reading checks;
- B2 texts completed through listening checks;
- speaking and writing task breadth;
- productive artifacts retained in learner StudyEvents;
- autonomy-mission progress;
- cross-session reliability evidence;
- delayed revisions;
- recurring feedback patterns;
- recent learner-authored responses.

For textarea and speech prompts, the learner's response is retained in StudyEvent metadata so longitudinal artifacts can be shown later.

The portfolio deliberately contains no overall CEFR score, certification badge or pass/fail field.

## Lexical/register transfer

P8 extends the 120 first-class B2 lexical chunks with contextual phrase-family work.

Eighteen register/phrase-family prompts contrast expressions such as:

- 情報源を確認する / 信頼性を評価する / 根拠を示す / 主張を裏付ける;
- 意見を述べる / 見解を示す / 反論を述べる;
- 方針を決める / 方針を示す / 政策を実施する;
- 調査を実施する / データを分析する / 比較を行う;
- 合意に達する / 合意を得る;
- 考慮に入れる / 文脈を踏まえる / 観点から考える.

Transfer uses a separate `form_selection` evidence dimension. Knowing the chunk meaning or producing it once does not automatically create register-transfer mastery.

## Native connected-audio variation

P8 extends the licensed source-pack route to support multiple native recordings for one text.

Each audio variant can declare:

- source/credit/license/attribution;
- native-speaker admission;
- speaker label;
- source speech rate: slow / natural / fast;
- register: casual / neutral / polite / formal;
- optional ordered replay segments.

The authentic reader can switch among admitted variants while preserving segment replay.

Multiple variants do not weaken licensing rules. Every recording is validated independently. Device speech synthesis remains explicitly synthetic fallback.

P8 does not bundle unlicensed connected audio merely to increase coverage.

## Provider observability and fallback certification

AI coach and dictionary-morphology server handlers now support no-store GET health probes.

A provider can report:

- configured but not actively probed;
- operational;
- degraded.

The web app exposes AI/morphology runtime state and the active fallback behavior.

For morphology:

- an unconfigured/unreachable dictionary provider visibly falls back to bounded local analysis;
- fallback is never relabeled dictionary-grade.

For AI coaching:

- an unavailable provider leaves learner mastery unchanged;
- no synthetic model response is fabricated.

The Sudachi-compatible adapter can propagate a runtime health check when the deployed tokenizer exposes one.

## Evidence invariants

P8 preserves the existing architecture:

- all durable learner truth remains StudyEvent-derived;
- autonomy missions are orchestration over existing text/task entities;
- portfolios and reliability are projections, not new authoritative stores;
- AI feedback is advisory;
- provider confidence/status is operational metadata, not learner mastery;
- browser speech recognition remains transcript evidence, not acoustic scoring;
- device TTS is not native audio;
- no overall CEFR B2 verdict is manufactured.

## Validation coverage

P8 adds tests for:

- learner-authored productive artifact persistence;
- six autonomy-mission definitions;
- 20-hour delayed-transfer behavior;
- cross-session production reliability;
- descriptive portfolio output without pass/fail fields;
- 18 lexical/register transfer prompts;
- multi-variant native-audio admission;
- duplicate variant rejection;
- AI provider health probes;
- morphology provider health probes;
- four-stage sustained interaction chains.

## P8 milestone

The system can now require a learner to carry B2 comprehension and production across several documents, maintain a real interaction through clarification and repair, revisit output after time has passed, transfer phrase families into new contexts, and accumulate a longitudinal portfolio without corrupting the evidence model.

The next phase should focus on real-world performance hardening, deeper licensed native listening and production qualification rather than introducing premature C1 labels.
