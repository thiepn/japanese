import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "@thiepn/study-player";
import {buildBeginnerStage,chooseBeginnerContinuation,projectBeginnerOverview,type BeginnerStageId} from "../apps/web/src/study/beginnerCourse";
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
    expect(practice.every(step=>{const original=canonical.find(prompt=>prompt.id===step.id);return original?.primaryTarget.id===step.primaryTarget.id&&original?.cueFamily===step.cueFamily;})).toBe(true);
    expect(practice.map(step=>step.primaryTarget.id)).toEqual([
      "hiragana-あ","hiragana-い","hiragana-う","hiragana-え","hiragana-お","hiragana-あ","hiragana-い"
    ]);
    expect(isStudyLesson(lesson[0]!)?lesson[0].examples?.map(e=>e.expression):[]).toEqual(["あ","い","う","え","お"]);
  });
  it("requires reading the authored kana rather than selecting the first answer throughout A0",()=>{
    const groups:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
    let evidence:StudyEvent[]=[];
    for(const group of groups){
      const prompts=buildBeginnerStage(group,evidence)
        .filter((step):step is StudyPrompt=>!isStudyLesson(step));
      expect(prompts.length).toBeGreaterThanOrEqual(5);
      const positions:number[]=[];
      const written=prompts.map((prompt,index)=>{
        if(prompt.promptType!=="choice")throw Error("A0_REQUIRES_CANONICAL_CHOICE");
        const original=canonical.find(item=>item.id===prompt.id);
        if(!original||original.promptType!=="choice")
          throw Error("MISSING_ORIGINAL_HIRAGANA_SOURCE:"+prompt.id);
        expect(prompt.primaryTarget).toEqual(original.primaryTarget);
        expect(prompt.cueFamily).toBe(original.cueFamily);
        expect(prompt.acceptedAnswers).toEqual(original.acceptedAnswers);
        expect(prompt.contextId).toBe(original.contextId);
        expect(prompt.prompt).toBe(original.prompt);
        expect([...prompt.choices].sort()).toEqual([...original.choices].sort());
        const correct=prompt.acceptedAnswers[0]!;
        const position=prompt.choices.indexOf(correct);
        expect(position).toBe((index+1)%prompt.choices.length);
        positions.push(position);
        const record=createStudyEvent({
          id:"a0-original-hira-"+group+"-"+index,userId:"a0-source-fixture",
          deviceId:"test-device",prompt,response:correct,
          occurredAt:"2026-10-20T09:00:00.000Z",responseTimeMs:100
        });
        expect(record.result).toBe("correct");
        return record;
      });
      expect(new Set(positions).size).toBeGreaterThanOrEqual(3);
      expect(positions.some(position=>position!==0)).toBe(true);
      expect(positions.some(position=>position===0)).toBe(true);
      evidence=[...evidence,...written];
      expect(projectBeginnerOverview(evidence).stages.find(stage=>stage.id===group)?.completed).toBe(true);
    }
    expect(projectBeginnerOverview(evidence)).toMatchObject({
      complete:true,completed:10,nextId:null
    });
    expect(chooseBeginnerContinuation(projectBeginnerOverview(evidence),
      {unitId:"a1-intro",status:"not_started"},null)).toEqual({kind:"first-conversation"});
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
    expect(projectBeginnerOverview([event(first.id,"incorrect")]).started).toBe(true);
    expect(projectBeginnerOverview([event(first.id,"correct")]).started).toBe(true);
  });
});
