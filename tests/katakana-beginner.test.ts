import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {isStudyLesson,createStudyEvent} from "@thiepn/study-player";
import {buildBeginnerStage,buildKatakanaStage,chooseBeginnerContinuation,
  projectBeginnerOverview,projectKatakanaOverview,type BeginnerStageId} from "../apps/web/src/study/beginnerCourse";
import {basicKatakana,foundationPrompts,foundationApplicationPrompts} from "../apps/web/src/study/foundationPrompts";

const canonical=[...foundationPrompts,...foundationApplicationPrompts];
const groupIds:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function answered(steps:ReturnType<typeof buildKatakanaStage>):StudyEvent[]{
  return steps.filter(step=>!isStudyLesson(step)).map((prompt,index)=>{
    const answer=prompt.acceptedAnswers[0]!;
    const event=createStudyEvent({id:"katakana-test-"+prompt.id+"-"+index,
      userId:"isolated-test-owner",deviceId:"katakana-test-device",
      prompt,response:answer,occurredAt:"2026-10-20T09:00:00.000Z",responseTimeMs:100});
    if(event.result!=="correct")throw new Error("ORIGINAL_PROMPT_NOT_CORRECT:"+prompt.id);
    return event;
  });
}
describe("optional original katakana continuation",()=>{
  it("uses five existing recognition prompts and two existing reverse choices",()=>{
    const steps=buildKatakanaStage("vowels",[]);
    const prompts=steps.filter(step=>!isStudyLesson(step));
    expect(prompts).toHaveLength(7);
    expect(prompts.every(step=>canonical.find(item=>item.id===step.id)===step)).toBe(true);
    expect(prompts.map(step=>step.primaryTarget.id)).toEqual([
      "katakana-ア","katakana-イ","katakana-ウ","katakana-エ","katakana-オ","katakana-ア","katakana-イ"
    ]);
    expect(isStudyLesson(steps[0]!)?steps[0].examples?.map(item=>item.expression):[])
      .toEqual(["ア","イ","ウ","エ","オ"]);
    expect(steps[0]!.id).toBe("a0-katakana-vowels-teach");
  });
  it("keeps katakana separate from the existing hiragana → A1 route",()=>{
    const hiragana=buildBeginnerStage("vowels",[]).filter(step=>!isStudyLesson(step));
    const preexisting=hiragana.map((prompt,index)=>createStudyEvent({
      id:"prior-"+index,userId:"isolated-test-owner",deviceId:"test",
      prompt,response:prompt.acceptedAnswers[0]!,occurredAt:"2026-10-20T09:00:00.000Z",responseTimeMs:100
    }));
    const katakana=projectKatakanaOverview(preexisting);
    expect(katakana.started).toBe(false);
    expect(katakana.completed).toBe(0);
    expect(katakana.nextId).toBe("vowels");
    expect(projectBeginnerOverview(preexisting).nextId).toBe("k");
    const existingA1={...projectBeginnerOverview([]),complete:true,nextId:null};
    expect(chooseBeginnerContinuation(existingA1,{unitId:"original-a1",status:"not_started"},"scene"))
      .toEqual({kind:"first-conversation"});
  });
  it("unlocks only the next group and omits already-correct cues",()=>{
    const steps=buildKatakanaStage("vowels",[]);
    const events=answered(steps);
    const all=projectKatakanaOverview(events);
    expect(all.completed).toBe(1);
    expect(all.nextId).toBe("k");
    expect(all.stages[1].unlocked).toBe(true);
    expect(all.stages[2].unlocked).toBe(false);
    expect(()=>buildKatakanaStage("s",events)).toThrow("BEGINNER_STAGE_LOCKED");
    const partial=projectKatakanaOverview(events.slice(0,-1));
    expect(partial.stages[0].correct).toBe(6);
    const retry=buildKatakanaStage("vowels",events.slice(0,-1));
    expect(retry.filter(step=>!isStudyLesson(step)).map(step=>step.id))
      .toEqual([steps[steps.length-1]!.id]);
  });
  it("covers all 46 canonical basic katakana without shadow progression",()=>{
    let events:StudyEvent[]=[];
    const visited:string[]=[];
    for(const id of groupIds){
      const current=projectKatakanaOverview(events);
      expect(current.nextId).toBe(id);
      const steps=buildKatakanaStage(id,events);
      const lesson=steps[0];
      if(!isStudyLesson(lesson))throw Error("MISSING_KATAKANA_LESSON");
      visited.push(...(lesson.examples??[]).map(e=>e.expression));
      const next=answered(steps);
      expect(next.every(event=>event.primaryTarget.id.startsWith("katakana-"))).toBe(true);
      events=[...events,...next];
    }
    expect(visited).toEqual(basicKatakana.map(seed=>seed.kana));
    expect(new Set(visited).size).toBe(46);
    expect(projectKatakanaOverview(events).complete).toBe(true);
    expect(projectKatakanaOverview(events).nextId).toBeNull();
    expect(buildKatakanaStage("w",events).filter(step=>!isStudyLesson(step))).toHaveLength(0);
  });
  it("does not count incorrect, non-authoritative, or mismatched original evidence",()=>{
    const first=answered(buildKatakanaStage("vowels",[]))[0]!;
    expect(projectKatakanaOverview([{...first,result:"incorrect"}]).started).toBe(true);
    expect(projectKatakanaOverview([{...first,result:"incorrect"}]).stages[0].correct).toBe(0);
    expect(projectKatakanaOverview([{...first,metadata:{...first.metadata,nonAuthoritative:true}}]).started).toBe(false);
    expect(projectKatakanaOverview([{...first,metadata:{...first.metadata,promptId:"fabricated"}}]).stages[0].correct).toBe(0);
  });
});
