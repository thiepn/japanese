import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {isStudyLesson,createStudyEvent,type StudyPrompt} from "@thiepn/study-player";
import {buildBeginnerStage,buildKatakanaStage,chooseBeginnerContinuation,
  projectBeginnerOverview,projectKatakanaOverview,type BeginnerStageId} from "../apps/web/src/study/beginnerCourse";
import {basicKatakana,foundationPrompts,foundationApplicationPrompts} from "../apps/web/src/study/foundationPrompts";

const canonical=[...foundationPrompts,...foundationApplicationPrompts];
const groupIds:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function answered(steps:ReturnType<typeof buildKatakanaStage>):StudyEvent[]{
  return steps.filter((step):step is StudyPrompt=>!isStudyLesson(step)).map((prompt,index)=>{
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
    const prompts=steps.filter((step):step is StudyPrompt=>!isStudyLesson(step));
    expect(prompts).toHaveLength(7);
    expect(prompts.every(step=>{const original=canonical.find(item=>item.id===step.id);return original?.primaryTarget.id===step.primaryTarget.id&&original?.cueFamily===step.cueFamily;})).toBe(true);
    expect(prompts.map(step=>step.primaryTarget.id)).toEqual([
      "katakana-ア","katakana-イ","katakana-ウ","katakana-エ","katakana-オ","katakana-ア","katakana-イ"
    ]);
    expect(isStudyLesson(steps[0]!)?steps[0].examples?.map(item=>item.expression):[])
      .toEqual(["ア","イ","ウ","エ","オ"]);
    expect(steps[0]!.id).toBe("a0-katakana-vowels-teach");
  });
  it("requires choosing original katakana forms and sounds instead of a first-button shortcut",()=>{
    let events:StudyEvent[]=[];
    for(const id of groupIds){
      const prompts=buildKatakanaStage(id,events)
        .filter((step):step is StudyPrompt=>!isStudyLesson(step));
      const positions=prompts.map((prompt,index)=>{
        if(prompt.promptType!=="choice")throw Error("MISSING_KATAKANA_CHOICE");
        const original=canonical.find(source=>source.id===prompt.id);
        if(!original||original.promptType!=="choice")
          throw Error("MISSING_ORIGINAL_KATAKANA_PROMPT:"+prompt.id);
        expect(prompt.acceptedAnswers).toEqual(original.acceptedAnswers);
        expect(prompt.primaryTarget).toEqual(original.primaryTarget);
        expect(prompt.cueFamily).toBe(original.cueFamily);
        expect([...prompt.choices].sort()).toEqual([...original.choices].sort());
        return prompt.choices.indexOf(prompt.acceptedAnswers[0]!);
      });
      expect(positions.length).toBeGreaterThanOrEqual(5);
      expect(positions).toEqual(prompts.map((prompt,index)=>(index+1)%(prompt.promptType==="choice"?prompt.choices.length:4)));
      expect(new Set(positions).size).toBeGreaterThanOrEqual(3);
      const next=answered(buildKatakanaStage(id,events));
      events=[...events,...next];
      expect(projectKatakanaOverview(events).stages.find(stage=>stage.id===id)?.completed).toBe(true);
    }
    expect(projectKatakanaOverview(events)).toMatchObject({complete:true,completed:10,nextId:null});
    expect(projectBeginnerOverview(events).started).toBe(false);
  });
  it("rotates wrong katakana cue positions without changing canonical source or hiragana progress",()=>{
    const first=buildKatakanaStage("vowels",[])[1];
    if(!first||isStudyLesson(first)||first.promptType!=="choice")throw Error("EXPECTED_KATAKANA_CHOICE");
    const correct=first.acceptedAnswers[0]!;
    const wrong=first.choices.find(choice=>!first.acceptedAnswers.includes(choice))!;
    const fail=createStudyEvent({
      id:"wrong-kata-choice",userId:"isolated-test-owner",deviceId:"katakana-test-device",
      prompt:first,response:wrong,occurredAt:"2026-10-20T10:00:00.000Z",responseTimeMs:100
    });
    expect(fail.result).toBe("incorrect");
    const second=buildKatakanaStage("vowels",[fail])[1];
    if(!second||isStudyLesson(second)||second.promptType!=="choice")throw Error("EXPECTED_KATAKANA_RETRY");
    expect(first.choices.indexOf(correct)).toBe(1);
    expect(second.choices.indexOf(correct)).toBe(2);
    expect(second.acceptedAnswers).toEqual(first.acceptedAnswers);
    expect(second.primaryTarget).toEqual(first.primaryTarget);
    expect(second.cueFamily).toBe(first.cueFamily);
    expect([...second.choices].sort()).toEqual([...first.choices].sort());
    expect(projectKatakanaOverview([fail]).stages[0].correct).toBe(0);
    expect(projectBeginnerOverview([fail]).started).toBe(false);
    const irrelevant={...fail,id:"mismatched",metadata:{...fail.metadata,promptId:"foundation-hiragana-recognition-1"}};
    expect(buildKatakanaStage("vowels",[irrelevant])[1]).toEqual(first);
    const good=createStudyEvent({
      id:"kata-recovered",userId:"isolated-test-owner",deviceId:"katakana-test-device",
      prompt:second,response:correct,occurredAt:"2026-10-20T10:01:00.000Z",responseTimeMs:100
    });
    expect(good.result).toBe("correct");
    expect(projectKatakanaOverview([fail,good]).stages[0].correct).toBe(1);
    expect(buildKatakanaStage("vowels",[fail,good])
      .filter((step):step is StudyPrompt=>!isStudyLesson(step))
      .some(step=>step.id===first.id)).toBe(false);
  });
  it("keeps katakana separate from the existing hiragana → A1 route",()=>{
    const hiragana=buildBeginnerStage("vowels",[]).filter((step):step is StudyPrompt=>!isStudyLesson(step));
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
    expect(retry.filter((step):step is StudyPrompt=>!isStudyLesson(step)).map(step=>step.id))
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
    expect(buildKatakanaStage("w",events).filter((step):step is StudyPrompt=>!isStudyLesson(step))).toHaveLength(0);
  });
  it("does not count incorrect, non-authoritative, or mismatched original evidence",()=>{
    const first=answered(buildKatakanaStage("vowels",[]))[0]!;
    expect(projectKatakanaOverview([{...first,result:"incorrect"}]).started).toBe(true);
    expect(projectKatakanaOverview([{...first,result:"incorrect"}]).stages[0].correct).toBe(0);
    expect(projectKatakanaOverview([{...first,metadata:{...first.metadata,nonAuthoritative:true}}]).started).toBe(false);
    expect(projectKatakanaOverview([{...first,metadata:{...first.metadata,promptId:"fabricated"}}]).stages[0].correct).toBe(0);
  });
});
