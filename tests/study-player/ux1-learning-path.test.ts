import {describe,expect,it} from "vitest";
import {ux1InitialPathLocation} from "../../apps/web/src/design/UX1LearningPath";

describe("UX-1 source-selected chapter navigation",()=>{
 it("opens the original A1 café recommendation in Daily Life",()=>{
  expect(ux1InitialPathLocation({origin:"e02",targetId:"food"})).toEqual({level:"A1",chapter:2});
  expect(ux1InitialPathLocation({origin:"e02",targetId:"family"})).toEqual({level:"A1",chapter:1});
 });
 it("keeps A2.1 and A2.2 as provisional display groups without certifying either",()=>{
  expect(ux1InitialPathLocation({origin:"e03",targetId:"weekend-invitation"})).toEqual({level:"A2",chapter:0});
  expect(ux1InitialPathLocation({origin:"e04",targetId:"train-disruption"})).toEqual({level:"A2",chapter:1});
 });
 it("falls back to the first A1 chapter when E07 recommends FSRS review",()=>{
  expect(ux1InitialPathLocation({origin:"fsrs"})).toEqual({level:"A1",chapter:0});
  expect(ux1InitialPathLocation({origin:"e02",targetId:"unrecognized"})).toEqual({level:"A1",chapter:0});
 });
});
