import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {isStudyLesson} from "@thiepn/study-player";
import {buildBeginnerStage,chooseBeginnerContinuation,projectBeginnerOverview} from "../apps/web/src/study/beginnerCourse";
import {foundationPrompts,foundationApplicationPrompts} from "../apps/web/src/study/foundationPrompts";
const canonical=[...foundationPrompts,...foundationApplicationPrompts];
const event=(id:string,result:"correct"|"incorrect"="correct"):StudyEvent=>{
  const prompt=canonical.find(item=>item.id===id);
  if(!prompt)throw Error("MISSING_TEST_PROMPT");
  return {result,metadata:{promptId:id},primaryTarget:prompt.primaryTarget} as unknown as StudyEvent;
};
describe("A0 instructional path",()=>{
  it("starts with five vowels and locks later stages",()=>{
    const route=projectBeginnerOverview([]);
    expect(route.nextId).toBe("vowels");
    expect(route.stages[1].unlocked).toBe(false);
    expect(()=>buildBeginnerStage("k",[])).toThrow("BEGINNER_STAGE_LOCKED");
    const lesson=buildBeginnerStage("vowels",[]);
    const practice=lesson.filter(step=>!isStudyLesson(step));
    expect(practice).toHaveLength(7);
    expect(practice.every(step=>canonical.find(prompt=>prompt.id===step.id)===step)).toBe(true);
    expect(practice.map(step=>step.primaryTarget.id)).toEqual([
      "hiragana-あ","hiragana-い","hiragana-う","hiragana-え","hiragana-お","hiragana-あ","hiragana-い"
    ]);
    expect(isStudyLesson(lesson[0]!)?lesson[0].examples?.map(e=>e.expression):[]).toEqual(["あ","い","う","え","お"]);
  });
  it("reuses original IDs and requires correct answers rather than exposure",()=>{
    const ids=buildBeginnerStage("vowels",[]).filter(step=>!isStudyLesson(step)).map(step=>step.id);
    expect(ids).toHaveLength(7);
    const partial=projectBeginnerOverview(ids.map((id,index)=>event(id,index===0?"incorrect":"correct")));
    expect(partial.nextId).toBe("vowels");
    expect(partial.stages[0].correct).toBe(6);
    const completed=projectBeginnerOverview(ids.map(id=>event(id)));
    expect(completed.nextId).toBe("k");
    expect(isStudyLesson(buildBeginnerStage("k",ids.map(id=>event(id)))[0]!)).toBe(true);
    const retry=buildBeginnerStage("vowels",ids.slice(1).map(id=>event(id)));
    expect(retry.filter(step=>!isStudyLesson(step)).map(step=>step.id)).toEqual([ids[0]]);
    const completeVowels=projectBeginnerOverview(ids.map(id=>event(id)));
    expect(chooseBeginnerContinuation(completeVowels,{unitId:"a1-intro",status:"not_started"},null)).toEqual({kind:"kana",id:"k"});
  });
  it("hands off to canonical A1, skips unavailable introductions, and does not invent a new course writer",()=>{
    const all=projectBeginnerOverview([]);
    const completed={...all,nextId:null,complete:true};
    expect(chooseBeginnerContinuation(completed,{unitId:"intro",status:"not_started"},"food"))
      .toEqual({kind:"first-conversation"});
    expect(chooseBeginnerContinuation(completed,{unitId:"",status:"not_started"},"food"))
      .toEqual({kind:"a1-scene",id:"food"});
    expect(chooseBeginnerContinuation(completed,{unitId:"",status:"not_started"},null))
      .toEqual({kind:"daily"});
    expect(chooseBeginnerContinuation(completed,{unitId:"intro",status:"waiting"},"greetings"))
      .toEqual({kind:"a1-scene",id:"greetings"});
  });
  it("does not promote unrelated or incorrect events",()=>{
    const first=foundationPrompts[0]!;
    const unrelated={...event(first.id),primaryTarget:{kind:"kana",id:"unrelated"}} as StudyEvent;
    expect(projectBeginnerOverview([unrelated]).started).toBe(false);
    expect(projectBeginnerOverview([event(first.id,"incorrect")]).stages[0].correct).toBe(0);
  });
});
