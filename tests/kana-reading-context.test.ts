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
function submitted(prompt:StudyPrompt,answer:string,occurredAt="2026-10-20T09:30:00.000Z",id="reading-"+prompt.id){
  const graded=createStudyEvent({id,userId:"test-owner",deviceId:"test-device",
    prompt,response:answer,occurredAt,responseTimeMs:100});
  return {...graded,result:"skipped" as const,
    metadata:{...graded.metadata,nonAuthoritative:true,structuralResult:graded.result}};
}
describe("original A1 sentences as basic-kana reading transfer",()=>{
  it("remains locked before all ten original hiragana groups, without gating A1",()=>{
    expect(projectKanaReadingContext([])).toMatchObject({available:false,completed:0,remaining:0,needsRetry:0,total:7});
    expect(buildKanaReadingContext([])).toEqual([]);
    const completed=completedHiragana();
    expect(projectBeginnerOverview(completed).complete).toBe(true);
    expect(projectKanaReadingContext(completed)).toMatchObject({available:true,completed:0,remaining:7,needsRetry:0,total:7});
    expect(projectKanaWordBridge(completed).readingContext.remaining).toBe(7);
    expect(chooseBeginnerContinuation(projectBeginnerOverview(completed),
      {unitId:"source-a1-introduction",status:"not_started"},"next-a1-scene"))
      .toEqual({kind:"first-conversation"});
  });
  it("selects only original sentences with authored basic-kana readings and authentic translations",()=>{
    const prompts=buildKanaReadingContext(completedHiragana());
    expect(prompts).toHaveLength(2);
    expect(prompts.every(step=>!isStudyLesson(step))).toBe(true);
    expect((prompts[0] as StudyPrompt).explanation).toContain("本 (ほん) — book");
    expect((prompts[0] as StudyPrompt).explanation).toContain("を — marks the direct object of an action");
    expect((prompts[0] as StudyPrompt).explanation).toContain("〜ます — polite nonpast verb predicate");
    const correctPositions=prompts.map(step=>!isStudyLesson(step)&&step.promptType==="choice"?step.choices.indexOf(step.acceptedAnswers[0]!):-1);
    expect(correctPositions).toEqual([0,1]);
    const first=prompts[0] as StudyPrompt;
    expect(first).toMatchObject({
      id:"a0-source-reading-sentence-a1-004",prompt:"ほんをよみます。",
      acceptedAnswers:["I read a book."],sourceId:"thiepn-original",
      primaryTarget:{kind:"sentence",id:"sentence-a1-004"},
      eventMetadata:{nonAuthoritative:true,schedulerExcluded:true,kanaSourceReadingContext:true}
    });
    for(const step of prompts){
      if(isStudyLesson(step)||step.promptType!=="choice")throw Error("EXPECTED_ORIGINAL_SENTENCE_PROMPT");
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
    if(!first||isStudyLesson(first)||first.promptType!=="choice")throw Error("EXPECTED_SENTENCE_QUESTION");
    const wrong=submitted(first,first.choices[1]!);
    expect(wrong.result).toBe("skipped");
    expect(wrong.primaryTarget).toEqual({kind:"sentence",id:"sentence-a1-004"});
    expect(wrong.metadata?.nonAuthoritative).toBe(true);
    expect(projectKanaReadingContext([...completed,wrong])).toMatchObject({
      available:true,completed:1,remaining:6,needsRetry:1
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
  it("puts unseen source sentences before missed ones and permits an explicit retry",()=>{
    const original=completedHiragana();
    let events=[...original];
    const encountered=new Set<string>();
    let missed:StudyPrompt|null=null;
    for(let i=0;i<7;i++){
      const first=buildKanaReadingContext(events)[0];
      if(!first||isStudyLesson(first)||first.promptType!=="choice")throw Error("SOURCE_READING_NOT_AVAILABLE");
      encountered.add(first.primaryTarget.id);
      if(i===0){
        missed=first;
        const wrong=first.choices.find(choice=>choice!==first.acceptedAnswers[0])!;
        events.push(submitted(first,wrong));
        expect(projectKanaReadingContext(events)).toMatchObject({completed:1,needsRetry:1,remaining:6});
      }else{
        expect(first.primaryTarget.id).not.toBe(missed!.primaryTarget.id);
        events.push(submitted(first,first.acceptedAnswers[0]!));
      }
    }
    expect(encountered.size).toBe(7);
    expect(projectKanaReadingContext(events)).toMatchObject({
      available:true,completed:7,remaining:0,needsRetry:1,total:7
    });
    const retry=buildKanaReadingContext(events);
    expect(retry).toHaveLength(1);
    expect(retry[0]?.id).toBe(missed!.id);
    events.push(submitted(missed!,missed!.acceptedAnswers[0]!,
      "2026-10-20T10:00:00.000Z","retry-"+missed!.id));
    expect(projectKanaReadingContext(events)).toMatchObject({
      available:false,completed:7,remaining:0,needsRetry:0
    });
    expect(buildKanaReadingContext(events)).toEqual([]);
    expect(projectBeginnerOverview(events).complete).toBe(true);
    expect(projectKanaWordBridge(events).learned).toBe(0);
  });
  it("uses latest unscored outcome by time, including a lapse and equal-time ambiguity",()=>{
    const original=completedHiragana();
    const first=buildKanaReadingContext(original)[0];
    if(!first||isStudyLesson(first)||first.promptType!=="choice")throw Error("EXPECTED_FIRST_SENTENCE");
    const correct=submitted(first,first.acceptedAnswers[0]!);
    const wrongChoice=first.choices.find(choice=>choice!==first.acceptedAnswers[0])!;
    const laterWrong=submitted(first,wrongChoice,"2026-10-20T10:00:00.000Z","later-wrong");
    const outOfOrder=[...original,laterWrong,correct];
    expect(projectKanaReadingContext(outOfOrder)).toMatchObject({
      completed:1,remaining:6,needsRetry:1
    });
    const laterCorrect=submitted(first,first.acceptedAnswers[0]!,
      "2026-10-20T10:01:00.000Z","later-correct");
    expect(projectKanaReadingContext([...outOfOrder,laterCorrect]).needsRetry).toBe(0);
    const equalWrong=submitted(first,wrongChoice,"2026-10-20T10:01:00.000Z","equal-wrong");
    for(const order of [[laterCorrect,equalWrong],[equalWrong,laterCorrect]]){
      expect(projectKanaReadingContext([...original,correct,laterWrong,...order]))
        .toMatchObject({completed:1,remaining:6,needsRetry:1});
    }
    const forged={...laterWrong,id:"forged-unscored",
      metadata:{...laterWrong.metadata,promptId:"not-original"}};
    const before=projectKanaReadingContext([...original,correct]).needsRetry;
    expect(projectKanaReadingContext([...original,correct,forged]).needsRetry).toBe(before);
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
    expect(projectKanaReadingContext(events)).toMatchObject({available:false,completed:7,remaining:0,needsRetry:0});
    expect(buildKanaReadingContext(events)).toEqual([]);
    expect(projectBeginnerOverview(events).complete).toBe(true);
    expect(projectKanaWordBridge(events).readingContext.completed).toBe(7);
  });
});
