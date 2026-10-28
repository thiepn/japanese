import {describe,it,expect} from "vitest";
import {isStudyLesson} from "../../packages/study-player/src/index";
import {coreContent,senseForLexeme} from "../../apps/web/src/coreContent";
import {starterVocabulary,vocabularyMeaningPrompts,vocabularyApplicationPrompts} from "../../apps/web/src/study/vocabulary";
import {buildCur06VocabularyJourney,inspectCur06Word} from "../../apps/web/src/study/cur06VocabularyJourney";
import {coursePositionFingerprint} from "../../apps/web/src/study/cur03CoursePosition";
import {eligibleE07Draft} from "../../apps/web/src/study/e07DraftBuffer";
const linked=starterVocabulary.find(item=>coreContent.courseUnits.some(unit=>unit.vocabularyIds.includes(item.lexeme.id)))!;
const withMultiple=starterVocabulary.find(item=>coreContent.courseUnits.filter(u=>u.vocabularyIds.includes(item.lexeme.id)).length>1);
const unassigned=starterVocabulary.find(item=>!coreContent.courseUnits.some(u=>u.vocabularyIds.includes(item.lexeme.id)))!;
const getChecks=(id:string)=>buildCur06VocabularyJourney(id,"practice").filter(step=>!isStudyLesson(step));
describe("CUR-06 installed source-owned contextual vocabulary journeys",()=>{
 it("keeps the original canonical word source, spelling, sense and recorded reading intact",()=>{
  const coverage=inspectCur06Word(linked.lexeme.id);
  expect(coverage.word).toBe(linked.lexeme.canonicalForm);
  expect(coverage.reading).toBe(linked.reading);
  expect(coverage.meaning).toBe(senseForLexeme(linked.lexeme).glosses.join(" / "));
  expect(coverage.sourceIds).toEqual(linked.lexeme.sourceIds);
  for(const context of coverage.attestedSentences){
   const unit=coreContent.courseUnits.find(x=>x.id===context.unitId)!;
   const sentence=coreContent.sentences.find(s=>s.id===context.id)!;
   expect(unit.sentenceIds).toContain(sentence.id);
   expect(sentence.text).toContain(coverage.word);
   expect(context.text).toBe(sentence.text);
   expect(context.translation).toBe(sentence.translation);
  }
 });
 it("pure exploration consists entirely of original lessons and never review prompts",()=>{
  const steps=buildCur06VocabularyJourney(linked.lexeme.id,"explore");
  expect(steps.length).toBeGreaterThanOrEqual(3);
  expect(steps.every(isStudyLesson)).toBe(true);
  expect(steps[0]!.id).toBe("lesson-"+linked.lexeme.id);
  expect(steps.some(s=>s.id==="cur06-"+linked.lexeme.id+"-distinction")).toBe(true);
  expect(steps.filter(s=>s.id.includes("-unit-")).length).toBe(inspectCur06Word(linked.lexeme.id).units.length);
 });
 it("multi-unit contexts preserve each real course unit; focus cannot misattribute another unit",()=>{
  if(!withMultiple)return;
  const coverage=inspectCur06Word(withMultiple.lexeme.id);
  expect(coverage.units.length).toBeGreaterThan(1);
  expect(new Set(coverage.units.map(u=>u.id)).size).toBe(coverage.units.length);
  const focused=buildCur06VocabularyJourney(withMultiple.lexeme.id,"explore",coverage.units[1]!.id);
  expect(focused.filter(step=>step.id.includes("-unit-")).map(step=>step.id))
   .toEqual(["cur06-"+withMultiple.lexeme.id+"-unit-"+coverage.units[1]!.id]);
  expect(()=>buildCur06VocabularyJourney(withMultiple.lexeme.id,"practice","a1-unit-unknown")).toThrow(/UNLINKED_FOCUS_UNIT/);
 });
 it("unassigned original lexemes remain visibly unassigned with no invented CEFR level",()=>{
  const coverage=inspectCur06Word(unassigned.lexeme.id);
  expect(coverage.units).toEqual([]);
  const steps=buildCur06VocabularyJourney(unassigned.lexeme.id,"explore");
  expect(steps.some(s=>isStudyLesson(s)&&s.id.endsWith("-unassigned"))).toBe(true);
  expect(steps.every(isStudyLesson)).toBe(true);
 });
 it("bounds practice to two original contexts while retaining complete exploration",()=>{
  for(const word of starterVocabulary.slice(0,60)){
   const explore=buildCur06VocabularyJourney(word.lexeme.id,"explore");
   const practice=buildCur06VocabularyJourney(word.lexeme.id,"practice");
   const sourceIds=new Set(explore.filter(step=>step.id.includes("-unit-")).map(step=>step.id));
   const selected=practice.filter(step=>step.id.includes("-unit-")).map(step=>step.id);
   expect(selected.length).toBeLessThanOrEqual(2);
   expect(selected.every(id=>sourceIds.has(id))).toBe(true);
   const firstCheck=practice.findIndex(step=>step.id.endsWith("-meaning-check"));
   expect(firstCheck).toBeGreaterThanOrEqual(2);
   expect(firstCheck).toBeLessThanOrEqual(4);
  }
 });
 it("guided semantic/reading foils cite real other lexeme forms and give answer-specific repair",()=>{
  const checks=getChecks(linked.lexeme.id);
  const meaning=checks.find(step=>step.id.endsWith("-meaning-check"))!;
  const reading=checks.find(step=>step.id.endsWith("-reading-check"))!;
  expect(isStudyLesson(meaning)).toBe(false);
  expect(isStudyLesson(reading)).toBe(false);
  if(isStudyLesson(meaning)||isStudyLesson(reading))return;
  for(const item of [meaning,reading]){
   expect(item.promptType).toBe("choice");
   expect(item.choices?.length).toBeGreaterThanOrEqual(3);
   expect(item.eventMetadata).toMatchObject({cur06:true,nonAuthoritative:true,schedulerExcluded:true,independentCompetenceVerified:false});
   const feedback=item.eventMetadata?.e06FoilFeedback;
   expect(Array.isArray(feedback)).toBe(true);
   expect(feedback).toHaveLength(2);
   for(const note of feedback as Array<{response:string;feedback:string}>){
    expect(note.feedback).toMatch(/belongs to|reading belongs/);
    expect(item.choices).toContain(note.response);
   }
  }
  const alternatives=starterVocabulary.filter(w=>w.lexeme.id!==linked.lexeme.id);
  expect((meaning.choices??[]).slice(1).every(v=>alternatives.some(x=>x.meaning===v))).toBe(true);
  expect((reading.choices??[]).slice(1).every(v=>alternatives.some(x=>x.reading===v))).toBe(true);
 });
 it("independent meaning, kana, and original writing use the same unscored native player",()=>{
  const checks=getChecks(linked.lexeme.id);
  expect(checks.length).toBe(5);
  for(const step of checks)if(!isStudyLesson(step)){
   expect(step.primaryTarget).toEqual({kind:"lexeme",id:linked.lexeme.id});
   expect(step.sourceId).toBe(linked.lexeme.sourceIds[0]);
   expect(step.eventMetadata?.nonAuthoritative).toBe(true);
   expect(step.eventMetadata?.schedulerExcluded).toBe(true);
   expect(step.id.startsWith("cur06-"+linked.lexeme.id)).toBe(true);
  }
  const writing=checks.find(step=>step.id.endsWith("-own-context"))!;
  expect(isStudyLesson(writing)).toBe(false);
  if(!isStudyLesson(writing)){
   expect(writing.promptType).toBe("textarea");
   expect(eligibleE07Draft(writing)).toBe(true);
  }
 });
 it("source-driven section order is stable for content fingerprint recovery",()=>{
  const first=buildCur06VocabularyJourney(linked.lexeme.id,"practice");
  const again=buildCur06VocabularyJourney(linked.lexeme.id,"practice");
  expect(coursePositionFingerprint(first)).toBe(coursePositionFingerprint(again));
  expect(new Set(first.map(x=>x.id)).size).toBe(first.length);
  expect(first[0]?.id).toBe("lesson-"+linked.lexeme.id);
 });
 it("does not mutate authoritative native FSRS prompt IDs or skill cues",()=>{
  const existing=[...vocabularyMeaningPrompts,...vocabularyApplicationPrompts].filter(p=>p.primaryTarget.id===linked.lexeme.id);
  const original=existing.map(p=>({id:p.id,cue:p.cueFamily,source:p.sourceId,accepted:p.acceptedAnswers}));
  buildCur06VocabularyJourney(linked.lexeme.id,"practice");
  buildCur06VocabularyJourney(linked.lexeme.id,"explore");
  expect(existing.map(p=>({id:p.id,cue:p.cueFamily,source:p.sourceId,accepted:p.acceptedAnswers}))).toEqual(original);
  expect(existing.every(p=>!p.id.startsWith("cur06-"))).toBe(true);
 });
 it("rejects fabricated IDs, an unlinked focus, and unknown study modes",()=>{
  expect(()=>buildCur06VocabularyJourney("nonexistent-word","explore")).toThrow(/UNKNOWN_LEXEME/);
  expect(()=>buildCur06VocabularyJourney(linked.lexeme.id,"explore","unverified-unit")).toThrow(/UNLINKED_FOCUS_UNIT/);
  expect(()=>buildCur06VocabularyJourney(linked.lexeme.id,"certify" as "explore")).toThrow(/UNKNOWN_MODE/);
 });
});