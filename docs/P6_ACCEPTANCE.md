# P6 — B1→B2 Independent Communication, AI Conversation & Advanced Feedback

Status: implementation complete; two provider integrations remain deliberately optional and non-authoritative

## B2 bridge content and course graph

- [x] one course graph continues from Foundation through A1, A2, B1 and a focused B2 bridge
- [x] 416 canonical lexemes
- [x] 102 canonical grammar concepts, including 16 new B2 discourse/qualification patterns
- [x] 267 linked canonical sentences, including explicit multi-speaker B2 dialogue
- [x] 50 Can-do descriptors and 50 structured course units
- [x] 30 graded immersion texts spanning A1 through B2
- [x] 20 canonical productive tasks: 10 B1 and 10 B2
- [x] content package advances to v0.8.0 / schema 9
- [x] all B2 entities reuse the same StudyPrompt, StudyEvent, learner projection, delayed-check and FSRS paths

P6's B2 label means that the app now contains a structured B1→B2 bridge and B2-targeted activity set. It is not a claim that 416 words constitute complete CEFR B2 lexical breadth, nor that the internal milestone is an accredited CEFR examination.

## Independent discourse range

P6 adds explicit practice for:

- [x] qualification with 〜わけではない and 〜にすぎない
- [x] logical conclusions and stronger inference with 〜わけだ and 〜に違いない
- [x] evidence-based reasoning with 〜ことから
- [x] balanced contrast and concession with 〜一方で, 〜ものの and 〜にもかかわらず
- [x] formal topic/setting framing with 〜に関して and 〜において
- [x] comparison/targeting with 〜に対して and 〜によって
- [x] linked change with 〜につれて and 〜に伴って
- [x] proportional relationships with 〜ば〜ほど
- [x] formal risk language with 〜おそれがある
- [x] abstract vocabulary for evidence, research, work, technology, policy, interpretation, evaluation, risk and counterargument
- [x] coherent report-style passages and explicit multi-speaker dialogues rather than only isolated B2 example sentences

## AI conversation contract

- [x] multi-turn Japanese conversation mode
- [x] B2 scenario and target-language goals come from canonical productive tasks
- [x] recent dialogue history is supplied to the coach rather than treating each turn as unrelated
- [x] microphone speech recognition can populate a conversation turn when the browser supports Japanese recognition
- [x] server-side model interaction is represented by a provider-agnostic JSON model contract
- [x] response parsing enforces an explicit evidence contract
- [x] the model is forbidden from declaring CEFR mastery, pass/fail, pronunciation quality or durable learner truth
- [x] AI feedback StudyEvents use result=skipped and metadata modelFeedbackAppliedToMastery=false
- [x] therefore AI feedback cannot silently alter learner mastery, FSRS state or milestone scores
- [x] UI failures leave learner evidence unchanged

The client calls VITE_JAPANESE_COACH_ENDPOINT, defaulting to /api/japanese/coach. Deployment must connect that route to a real server-side model provider. P6 does not place an API secret in the browser or fabricate an offline “AI” response when no provider exists.

## Advanced writing revision

- [x] dedicated writing-revision mode accepts connected learner text
- [x] feedback is structurally separated into grammar, vocabulary, coherence and task achievement
- [x] each area has its own summary, correction items and feedback confidence
- [x] correction items can preserve original text, proposed revision and explanation independently
- [x] the coach can request a next revision rather than replacing the learner's writing with an authoritative rewrite
- [x] repeated revisions remain learner responses; model output remains advisory metadata

## B2 receptive/productive milestone

- [x] separate 15-item B2 milestone
- [x] 3 reading tasks
- [x] 3 connected-listening tasks
- [x] 3 microphone-based spoken-interaction tasks
- [x] 3 microphone-based spoken-production tasks
- [x] 3 connected-writing tasks
- [x] each activity area is reported independently
- [x] B2 listening uses explicitly labeled Japanese device speech synthesis where no reusable recording is attached
- [x] device speech synthesis is not labeled native audio
- [x] AI coach judgments are excluded from milestone scoring
- [x] no single overall CEFR pass/fail verdict is manufactured

## Connected listening

- [x] graded reader now supports a listening-first mode
- [x] listening-first hides the transcript until one complete playback has finished
- [x] normal/slower connected playback remains available
- [x] native recordings are used only when source-provenanced assets exist
- [x] browser/device voices remain labeled fallback/synthesis
- [x] reading and listening evidence remain separate targets in the learner model

## Adaptive remediation

- [x] P6 derives cross-surface recommendations from course mastery, productive target evidence and immersion readiness
- [x] weakest active course capability can be surfaced for review
- [x] productive tasks can be selected from comparatively weak target grammar/production evidence
- [x] immersion recommendation continues to use lexical readiness plus reading/listening evidence
- [x] B2 material receives an explicit ranking signal in adaptive immersion
- [x] recommendations remain advisory and never hard-lock another activity

## Authentic input, morphology and sense identity

- [x] B1 deinflection remains available
- [x] P6 adds bounded B2 forms including additional passive/causative-passive, conditional, ずに, 〜ことになる / 〜ことにする and 〜ようになる / 〜ようにする surfaces
- [x] local surface resolution now carries explicit confidence
- [x] resolved tokens carry canonical sense IDs
- [x] single-sense, ambiguous-sense and provider-resolved states are represented explicitly
- [x] ambiguous local senses remain ambiguous instead of being silently guessed
- [x] a JapaneseMorphologyProvider contract defines how a future dictionary-grade analyzer can return provider-backed candidates
- [x] provider candidates outrank bounded local guesses when a real provider is connected
- [x] the built-in resolver still identifies itself as bounded, not dictionary-grade

A real dictionary-grade analyzer is an optional provider integration, not a reason to mislabel the existing browser heuristic. Provider results must map back to canonical/private identities rather than replacing learner truth.

## Redistributable source packs

- [x] JSON source-pack format supports manifest provenance, version, source URL, license and attribution
- [x] public source-pack import requires redistributable=true
- [x] CC0/public-domain/attribution-compatible routes are admitted
- [x] noncommercial and no-derivatives packs are rejected
- [x] native audio requires its own reusable license and credit
- [x] audio must explicitly declare nativeSpeaker:true before the UI may label it native
- [x] attribution URL is required where the audio license requires attribution
- [x] text-only source packs remain valid and receive an explicit warning that device voice may only be a fallback
- [x] imported pack items remain account-scoped private documents rather than silently becoming canonical public content
- [x] the existing license-aware Tatoeba sentence/audio route remains available

See docs/SOURCE_PACK_FORMAT.md.

## Pronunciation boundary

- [x] speech recognition remains transcript evidence, not acoustic evidence
- [x] shadowing self-rating remains self-reported pronunciation evidence
- [x] AI coach evidenceContract.acousticAnalysis is forced to false
- [x] P6 does not claim phoneme, pitch-accent, mora-timing, prosody or native-likeness scores

No acoustic model/provider is integrated in P6. This is intentional: the roadmap permits acoustic scoring only after a real documented provider is connected.

## Validation and regression coverage

- [x] coverage tests updated for 416 lexemes / 102 grammar / 267 sentences / 50 units / 30 texts / 20 productive tasks
- [x] B2 milestone tests certify three tasks in all five activity areas
- [x] AI coach tests reject unsafe mastery-authority payloads
- [x] server coach tests verify that the safe evidence contract is injected independently of model output
- [x] source-pack tests reject NC/ND and unverified native-audio metadata
- [x] morphology tests keep ambiguous senses explicit and prefer real provider candidates
- [x] browser course/immersion expectations advance to Foundation→B2 and 30 texts

## Deliberate P6 boundaries

P6 is an independent-communication architecture and content bridge, not a claim of complete B2 coverage. A future phase should broaden vocabulary, collocations, genres, native connected audio and topic domains substantially before presenting the curriculum as comprehensive B2 preparation.

AI feedback is intentionally non-authoritative. It can suggest corrections and support revision, but it cannot write directly into durable mastery. A deployed server-side model endpoint is required for live AI conversation; secrets must remain server-side.

The built-in authentic-input resolver has improved B2 deinflection and explicit sense ambiguity, but it remains bounded. Dictionary-grade analysis is represented by a provider contract and becomes active only when a real provider is connected.

No acoustic pronunciation model is present. P6 therefore continues to separate transcript recognition and learner self-review from acoustic scoring.

Native connected audio is never fabricated. Source-pack and Tatoeba workflows can admit licensed native recordings when they actually exist; device TTS remains visibly synthetic.

## P6 milestone

A learner can now continue one unified path into B2-targeted discourse, read and listen to connected B2 material, practice multi-speaker dialogues, write and speak from open-ended scenarios, receive structured AI conversation/writing feedback without surrendering learner truth, receive cross-surface remediation recommendations, and import redistributable source packs under explicit license/audio rules.

The next development phase should focus on **P7 — B2 Breadth, Native Media & Advanced Lexical/Collocational Fluency** rather than prematurely adding C1 labels.
