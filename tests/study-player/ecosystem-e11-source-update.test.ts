import {describe,expect,it} from "vitest";
import {E11_TRANSFER,E11_SOURCE_UPDATES,e11SourceUpdate} from "../../apps/web/src/study/e11PracticalTransfer";
describe("Ecosystem J1 original updated notices",()=>{
 it("preserves all seven E11 source IDs with additional natural-language source comparisons",()=>{
  expect(E11_TRANSFER).toHaveLength(7);
  expect(E11_SOURCE_UPDATES).toHaveLength(7);
  expect(new Set(E11_SOURCE_UPDATES.map(u=>u.caseId)).size).toBe(7);
  expect(E11_SOURCE_UPDATES.map(u=>u.caseId).sort()).toEqual(E11_TRANSFER.map(u=>u.caseId).sort());
  for(const item of E11_SOURCE_UPDATES){
   expect(item.ja.length).toBeGreaterThan(35);
   expect(item.en.length).toBeGreaterThan(60);
   expect(item.compare.length).toBeGreaterThan(40);
   expect(item.limit.length).toBeGreaterThan(45);
   expect(item.authority).toBe("original-unscored-update");
   expect(item.decision.question.length).toBeGreaterThan(15);
   expect(item.decision.answer.length).toBeGreaterThan(5);
   expect(item.decision.wrong).toHaveLength(2);
   expect(item.decision.why).toHaveLength(2);
   expect(new Set([item.decision.answer,...item.decision.wrong]).size).toBe(3);
   expect(item.decision.why.every(why=>why.length>30)).toBe(true);
   expect(e11SourceUpdate(item.caseId)).toBe(item);
  }
  expect(e11SourceUpdate("nonexistent")).toBeNull();
 });
 it("does not carry any new grading or canonical identification authority",()=>{
  expect(E11_SOURCE_UPDATES.every(v=>!Object.keys(v).some(k=>/sourceId|canDoId|grade|eventId|taskId/i.test(k)))).toBe(true);
 });
});
