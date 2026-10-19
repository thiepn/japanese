import {describe,expect,it} from "vitest";
import {isStudyLesson} from "../../packages/study-player/src/index";
import {buildE02Journey,e02ReviewPrompts,E02_AVAILABLE_SCENES} from "../../apps/web/src/study/a1ExcellenceCourse";
import {isUX1CafeJourney,ux1CafeStage} from "../../apps/web/src/study/UX1Cafe";
describe("UX-1 source-owned café presentation",()=>{
 it("uses the original food source and four unchanged controlled prompts",()=>{
  const food=E02_AVAILABLE_SCENES.find(scene=>scene.id==="food");
  expect(food?.unitId).toBe("a1-unit-16");
  const originals=e02ReviewPrompts.filter(prompt=>prompt.eventMetadata?.e02SceneId==="food");
  expect(originals.map(prompt=>prompt.id).sort()).toEqual([
   "a1-e02-food-hear","a1-e02-food-read","a1-e02-food-recall","a1-e02-food-reply"
  ].sort());
  const steps=buildE02Journey("food");
  expect(isUX1CafeJourney(steps)).toBe(true);
  expect(steps.filter(step=>!isStudyLesson(step)).map(step=>step.id)).toContain("a1-e02-food-recall");
  expect(steps.filter(step=>!isStudyLesson(step)).map(step=>step.id)).not.toContain("ux1-tile-assembly");
 });
 it("groups original steps into seven presentation stages without changing step IDs",()=>{
  const steps=buildE02Journey("food");
  const stageFor=(id:string)=>ux1CafeStage(steps,steps.findIndex(step=>step.id===id));
  expect(stageFor("a1-e02-food-setup")).toBe(0);
  expect(stageFor("a1-e02-food-hear")).toBe(0);
  expect(stageFor("a1-e02-food-read")).toBe(1);
  expect(stageFor("a1-e02-food-try")).toBe(3);
  expect(stageFor("a1-e02-food-reply")).toBe(4);
  expect(stageFor("a1-e02-food-recall")).toBe(5);
  expect(stageFor("a1-e02-food-return")).toBe(6);
  expect(ux1CafeStage(steps,steps.length-1)).toBe(6);
 });
 it("does not classify an ordinary course session as the café",()=>{
  expect(isUX1CafeJourney([])).toBe(false);
 });
});
