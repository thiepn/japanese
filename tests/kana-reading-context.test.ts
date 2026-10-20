import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "@thiepn/study-player";
import {coreContent} from "../apps/web/src/coreContent";
import {buildBeginnerStage,projectBeginnerOverview,chooseBeginnerContinuation,type BeginnerStageId} from "../apps/web/src/study/beginnerCourse";
import {buildKanaReadingContext,projectKanaReadingContext} from "../apps/web/src/study/kanaReadingContext";
import {projectKanaWordBridge} from "../apps/web/src/study/kanaWordBridge";

const GROUPS:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function completedHiragana():StudyEvent[]{
  let events:StudyEvent[]=[];
  for(const id of GROUPS){
    const steps=buildBeginnerStage(id,events).filter((step):step is StudyPrompt=>!isStudyLesson(step));
    const correct=steps.map((prompt,index)=>createStudyEvent({
      id:"hira-"+id+"-"+index,userId:"test-owner",deviceId:"test-device",prompt,
      response:prompt.acceptedAnswers[0]!,occurredAt:"2026-10-20T09:00:00.000Z",responseTimeMs:100
    }));
    expect(correct.every(event=>event.result==="correct")).toBe(true);
    events=[...events,...correct];
  }
  return events;
}
function submitted(prompt:StudyPrompt,answer:string){
  const graded=createStudyEvent({id:"reading-"+prompt.id,userId:"test-owner",deviceId:"test-device",
    prompt,response:answer,occurredAt:"2026-10-20T09:30:00.000Z",responseTimeMs:100});
  return {...graded,result:"skipped" as const,
    metadata:{...graded.metadata,nonAuthoritative:true,structuralResult:graded.result}};
}
describe("original A1 sentences as basic-kana reading transfer",()=>{
  it("remains locked before all ten original hiragana groups, without gating A1",()=>{
    expect(projectKanaReadingContext([])).toMatchObject({available:false,completed:0,remaining:0,total:7});
    expect(buildKanaReadingContext([])).toEqual([]);
    const completed=completedHiragana();
    expect(projectBeginnerOverview(completed).complete).toBe(true);
    expect(projectKanaReadingContext(completed)).toMatchObject({available:true,completed:0,remaining:7,total:7});
    expect(projectKanaWordBridge(completed).readingContext.remaining).toBe(7);
    expect(chooseBeginnerContinuation(projectBeginnerOverview(completed),
      {unitId:"source-a1-introduction",status:"not_started"},"next-a1-scene"))
      .toEqual({kind:"first-conversation"});
  });
  it("selects only original sentences with authored basic-kana readings and authentic translations",()=>{
    const prompts=buildKanaReadingContext(completedHiragana());
    expect(prompts).toHaveLength(2);
    expect(prompts.every(step=>!isStudyLesson(step))).toBe(true);
    const correctPositions=prompts.map(step=>isStudyLesson(step)?-1:step.choices.indexOf(step.acceptedAnswers[0]!));
    expect(correctPositions).toEqual([0,1]);
    const first=prompts[0] as StudyPrompt;
    expect(first).toMatchObject({
      id:"a0-source-reading-sentence-a1-004",prompt:"ほんをよみます。",
      acceptedAnswers:["I read a book."],sourceId:"thiepn-original",
      primaryTarget:{kind:"sentence",id:"sentence-a1-004"},
      eventMetadata:{nonAuthoritative:true,schedulerExcluded:true,kanaSourceReadingContext:true}
    });
    for(const step of prompts){
      if(isStudyLesson(step))throw Error("EXPECTED_ORIGINAL_SENTENCE_PROMPT");
      const sentence=coreContent.sentences.find(row=>row.id===step.primaryTarget.id);
      expect(sentence).toBeDefined();
      expect(step.prompt).toBe(sentence?.reading);
      expect(step.explanation).toContain(sentence!.text);
      expect(step.explanation).toContain(sentence!.translation);
      expect(step.choices).toContain(sentence!.translation);
      expect(step.choices.every(choice=>coreContent.sentences.some(row=>row.translation===choice))).toBe(true);
      expect(step.promptType).toBe("choice");
      expect(step.eventMetadata?.nonAuthoritative).toBe(true);
    }
  });
  it("persists original attempts but never awards sentence, vocabulary or FSRS mastery",()=>{
    const completed=completedHiragana();
    const first=buildKanaReadingContext(completed)[0];
    if(!first||isStudyLesson(first))throw Error("EXPECTED_SENTENCE_QUESTION");
    const wrong=submitted(first,first.choices[1]!);
    expect(wrong.result).toBe("skipped");
    expect(wrong.primaryTarget).toEqual({kind:"sentence",id:"sentence-a1-004"});
    expect(wrong.metadata?.nonAuthoritative).toBe(true);
    expect(projectKanaReadingContext([...completed,wrong])).toMatchObject({
      available:true,completed:1,remaining:6
    });
    expect(projectKanaWordBridge([...completed,wrong]).learned).toBe(0);
    const next=buildKanaReadingContext([...completed,wrong]);
    expect(next).toHaveLength(2);
    expect(next[0]?.id).toBe("a0-source-reading-sentence-a1-008");
    const forged={...wrong,id:"forged",metadata:{...wrong.metadata,promptId:"unrelated"}};
    expect(projectKanaReadingContext([...completed,forged]).completed).toBe(0);
    const graded={...wrong,id:"not-unscored",result:"correct" as const};
    expect(projectKanaReadingContext([...completed,graded]).completed).toBe(0);
  });
  it("finishes all original source readings without duplicating attempts or resetting A0",()=>{
    const original=completedHiragana();
    let events=[...original];
    const ids:string[]=[];
    for(let i=0;i<7;i++){
      const next=buildKanaReadingContext(events);
      expect(next.length).toBeGreaterThan(0);
      const first=next[0];
      if(!first||isStudyLesson(first))throw Error("MISSING_SOURCE_READING");
      ids.push(first.primaryTarget.id);
      events.push(submitted(first,first.acceptedAnswers[0]!));
    }
    expect(new Set(ids).size).toBe(7);
    expect(projectKanaReadingContext(events)).toMatchObject({available:false,completed:7,remaining:0});
    expect(buildKanaReadingContext(events)).toEqual([]);
    expect(projectBeginnerOverview(events).complete).toBe(true);
    expect(projectKanaWordBridge(events).readingContext.completed).toBe(7);
  });
});
