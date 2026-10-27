import {describe,it,expect} from "vitest";
import type {MemoryTrace} from "../../packages/scheduler/src/index";
import {coreContent} from "../../apps/web/src/coreContent";
import {vocabularyMeaningPrompts,vocabularyApplicationPrompts} from "../../apps/web/src/study/vocabulary";
import {COURSE_LEVELS} from "../../apps/web/src/study/cefrCourseCatalog";
import {buildCourseVocabularyPreview} from "../../apps/web/src/study/runtime";
import {projectCourseLevelReview,selectCourseDuePrompts,reviewSelectionCounts,
 courseReviewTraceId,normalizeCourseReviewLevels} from "../../apps/web/src/study/cur05LevelReview";

const now=new Date("2026-10-27T03:00:00Z");
const prompts=[...vocabularyMeaningPrompts,...vocabularyApplicationPrompts];
const units=coreContent.courseUnits;
const linked=prompts.find(prompt=>units.some(unit=>unit.vocabularyIds.includes(prompt.primaryTarget.id)))!;
const unassigned=prompts.find(prompt=>!units.some(unit=>unit.vocabularyIds.includes(prompt.primaryTarget.id)))!;
const makeTrace=(prompt:typeof prompts[number],owner="one",date="2026-10-26T12:00:00Z"):MemoryTrace=>({
 id:courseReviewTraceId(prompt),userId:owner,entity:prompt.primaryTarget,skillDimension:prompt.skill,
 cueFamily:prompt.cueFamily,schedulerFamily:"fsrs",schedulerVersion:"native",revision:1,
 card:{due:date,stability:2,difficulty:5,elapsedDays:1,scheduledDays:1,learningSteps:0,reps:1,lapses:0,state:2}
});
const projection=(traces:readonly MemoryTrace[],global=prompts)=>projectCourseLevelReview({
 accountId:"one",traces,vocabularyPrompts:prompts,globalPrompts:global,now
});
describe("CUR-05 original vocabulary source and level coverage",()=>{
 it("shows A1–C2 plus honest unassigned source words; no invented lexeme CEFR fields",()=>{
  const result=projection([]);
  expect(result.perLevel.map(x=>x.level)).toEqual([...COURSE_LEVELS,"unassigned"]);
  expect(result.words.find(x=>x.id===linked.primaryTarget.id)?.units.length).toBeGreaterThan(0);
  expect(result.words.find(x=>x.id===unassigned.primaryTarget.id)?.levels).toEqual([]);
  expect(result.words.every(word=>word.sourceIds.length>0&&word.sourceTitles.length>0)).toBe(true);
  for(const word of result.words)for(const unit of word.units){
   const native=coreContent.courseUnits.find(x=>x.id===unit.id)!;
   expect(native.vocabularyIds).toContain(word.id);
   expect(native.level).toBe(unit.level);
  }
 });
 it("only FSRS source-backed due traces count, not unintroduced vocabulary",()=>{
  const result=projection([makeTrace(linked),makeTrace(unassigned)]);
  expect(result.globalDue).toBe(2);
  expect(result.mappedVocabularyDue).toBe(2);
  expect(result.otherDue).toBe(0);
  expect(result.words.find(x=>x.id===linked.primaryTarget.id)?.due).toBe(1);
  expect(result.words.find(x=>x.id===unassigned.primaryTarget.id)?.due).toBe(1);
  expect(result.perLevel.find(x=>x.level==="unassigned")?.due).toBeGreaterThanOrEqual(1);
 });
 it("global due retains other Japanese prompts not in source-linked vocabulary",()=>{
  const fake={...linked,id:"fake-kana-due",primaryTarget:{kind:"kana" as const,id:"hiragana-あ"},
    skill:"recognition" as const,cueFamily:"kana-to-sound"};
  const result=projection([makeTrace(linked),makeTrace(fake)], [...prompts,fake]);
  expect(result.globalDue).toBe(2);expect(result.mappedVocabularyDue).toBe(1);
  expect(result.otherDue).toBe(1);
  const selected=reviewSelectionCounts(result,["A1","A2","B1","B2","C1","C2","unassigned"]);
  expect(selected.due).toBe(1);
 });
 it("multi-level selection deduplicates prompt trace identity, preserves original refs and due timestamp",()=>{
  const trace=makeTrace(linked),result=projection([trace]);
  const level=result.words.find(w=>w.id===linked.primaryTarget.id)!.levels[0]!;
  const selected=selectCourseDuePrompts({levels:[level,level,"unassigned"],overview:result,prompts:[...prompts,linked],traces:[trace],now});
  expect(selected).toHaveLength(1);
  expect(selected[0]).toBe(linked);
  expect(trace.card.due).toBe("2026-10-26T12:00:00Z");
  expect(normalizeCourseReviewLevels([level,level])).toEqual([level]);
 });
 it("future FSRS due cards do not appear in due queue or count",()=>{
  const trace=makeTrace(linked,"one","2026-11-02T12:00:00Z"),result=projection([trace]);
  expect(result.globalDue).toBe(0);
  expect(result.words.find(w=>w.id===linked.primaryTarget.id)?.scheduled).toBe(1);
  const level=result.words.find(w=>w.id===linked.primaryTarget.id)!.levels[0]!;
  expect(selectCourseDuePrompts({levels:[level],overview:result,prompts,traces:[trace],now})).toEqual([]);
 });
 it("uses the existing original StudyLesson for non-scoring preview",()=>{
  const id=linked.primaryTarget.id,queue=buildCourseVocabularyPreview(id);
  expect(queue).toHaveLength(1);expect(queue[0]?.kind).toBe("lesson");
  expect(queue[0]?.id).toBe("lesson-"+id);
  expect(()=>buildCourseVocabularyPreview("invented-lexeme")).toThrow(/UNKNOWN_LEXEME/);
 });
 it("fails closed on foreign account, duplicate traces, invalid clock and selection",()=>{
  const trace=makeTrace(linked);
  expect(()=>projection([makeTrace(linked,"another")])).toThrow(/FOREIGN_ACCOUNT/);
  expect(()=>projection([trace,trace])).toThrow(/DUPLICATE_TRACE/);
  expect(()=>projectCourseLevelReview({accountId:"one",traces:[],vocabularyPrompts:prompts,
    globalPrompts:prompts,now:new Date("invalid")})).toThrow(/INVALID_OWNER_OR_CLOCK/);
  expect(()=>normalizeCourseReviewLevels([])).toThrow(/INVALID_LEVEL/);
  expect(()=>normalizeCourseReviewLevels(["N5" as "A1"])).toThrow(/INVALID_LEVEL/);
  const result=projection([trace]);
  expect(()=>selectCourseDuePrompts({levels:["C2"],overview:result,prompts,traces:[trace],now,limit:0})).toThrow(/INVALID_LIMIT/);
 });
 it("rejects forged words or mismatched source IDs, rather than showing unsourced work",()=>{
  const forged={...linked,id:"forged",primaryTarget:{kind:"lexeme" as const,id:"absent-lexeme"}};
  expect(()=>projectCourseLevelReview({accountId:"one",traces:[],vocabularyPrompts:[forged],globalPrompts:[],now})).toThrow(/UNKNOWN_OR_UNLICENSED_WORD/);
  const wrongSource={...linked,sourceId:"not-licensed"};
  expect(()=>projectCourseLevelReview({accountId:"one",traces:[],vocabularyPrompts:[wrongSource],globalPrompts:[],now})).toThrow(/UNKNOWN_OR_UNLICENSED_WORD/);
 });
});