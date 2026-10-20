import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "@thiepn/study-player";
import {buildBeginnerStage,buildKatakanaStage,projectBeginnerOverview,type BeginnerStageId} from "../apps/web/src/study/beginnerCourse";
import {buildKanaWordBridge,projectKanaWordBridge} from "../apps/web/src/study/kanaWordBridge";
import {vocabularyApplicationPrompts,vocabularyMeaningPrompts,vocabularyLessons} from "../apps/web/src/study/vocabulary";

const GROUPS:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function grade(steps:readonly StudyPrompt[],owner="bridge-fixture"):StudyEvent[]{
  return steps.map((prompt,index)=>{
    const event=createStudyEvent({id:owner+"-"+prompt.id+"-"+index,
      userId:owner,deviceId:"test-device",prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt:"2026-10-20T10:00:00.000Z",responseTimeMs:100});
    expect(event.result).toBe("correct");
    return event;
  });
}
const questions=(steps:ReturnType<typeof buildKanaWordBridge>):StudyPrompt[]=>
  steps.filter((step):step is StudyPrompt=>!isStudyLesson(step));
function knownVowels():StudyEvent[]{
  return grade(questions(buildBeginnerStage("vowels",[])));
}
function completeKana(script:"hiragana"|"katakana"):StudyEvent[]{
  let events:StudyEvent[]=[];
  for(const stage of GROUPS){
    const steps=script==="hiragana"?buildBeginnerStage(stage,events):buildKatakanaStage(stage,events);
    events=[...events,...grade(questions(steps))];
  }
  return events;
}
describe("source-backed Kana-to-Words Bridge",()=>{
  it("starts after canonical kana evidence, without inventing a new course grade",()=>{
    expect(projectKanaWordBridge([]).available).toBe(false);
    expect(buildKanaWordBridge([])).toEqual([]);
    const events=knownVowels();
    const overview=projectKanaWordBridge(events);
    expect(overview).toMatchObject({eligible:2,learned:0,read:0,transferred:0,newWords:2,readyToRead:0,readyToUse:0,available:true});
    const steps=buildKanaWordBridge(events);
    expect(steps).toHaveLength(4);
    expect(isStudyLesson(steps[0]!)).toBe(true);
    expect(isStudyLesson(steps[2]!)).toBe(true);
    expect(questions(steps).map(p=>p.id)).toEqual(["vocab-meaning-lex-ii","vocab-meaning-lex-iie"]);
    expect(questions(steps)[0]).toBe(vocabularyMeaningPrompts.find(p=>p.id==="vocab-meaning-lex-ii"));
    expect(steps[0]).toMatchObject({id:vocabularyLessons["vocab-lex-ii"]?.id,sourceLabel:vocabularyLessons["vocab-lex-ii"]?.sourceLabel});
  });
  it("uses existing meaning → reading → active-use prerequisites, with independent follow-up",()=>{
    const vowel=knownVowels(), first=buildKanaWordBridge(vowel);
    const meanings=grade(questions(first));
    expect(projectKanaWordBridge([...vowel,...meanings])).toMatchObject({learned:2,read:0,readyToRead:2,readyToUse:0});
    const readSession=buildKanaWordBridge([...vowel,...meanings]);
    const reading=questions(readSession);
    expect(reading.map(p=>p.id)).toEqual(["vocab-reading-lex-ii","vocab-reading-lex-iie"]);
    expect(reading.every(p=>vocabularyApplicationPrompts.includes(p))).toBe(true);
    const readEvidence=grade(reading);
    const useSession=buildKanaWordBridge([...vowel,...meanings,...readEvidence]);
    const active=questions(useSession);
    expect(active.map(p=>p.id)).toEqual(["vocab-active-lex-ii","vocab-active-lex-iie"]);
    expect(active.every(p=>vocabularyApplicationPrompts.includes(p))).toBe(true);
    const all=[...vowel,...meanings,...readEvidence,...grade(active)];
    expect(projectKanaWordBridge(all)).toMatchObject({learned:2,read:2,transferred:2,available:false});
    expect(buildKanaWordBridge(all)).toEqual([]);
    expect(projectBeginnerOverview(all).nextId).toBe("k");
  });
  it("does not manufacture a pass after incorrect answers, unscored events, or fake prompt IDs",()=>{
    const vowel=knownVowels(), first=grade(questions(buildKanaWordBridge(vowel)));
    const incorrect={...first[0]!,result:"incorrect" as const};
    const forged={...first[1]!,metadata:{...first[1]!.metadata,promptId:"not-a-canonical-prompt"}};
    const unscored={...first[1]!,metadata:{...first[1]!.metadata,nonAuthoritative:true}};
    const overview=projectKanaWordBridge([...vowel,incorrect,forged,unscored]);
    expect(overview.learned).toBe(0);
    expect(overview.readyToRead).toBe(0);
    expect(overview.newWords).toBe(1);
    expect(buildKanaWordBridge([...vowel,incorrect,forged,unscored]).filter(isStudyLesson)).toHaveLength(1);
  });
  it("keeps failed source words visible for the original review queue without unearned unlocks",()=>{
    const vowels=knownVowels();
    const prompts=questions(buildKanaWordBridge(vowels));
    const failed=prompts.map((prompt,index)=>({
      ...grade([prompt])[0]!,id:"incorrect-meaning-"+index,result:"incorrect" as const
    }));
    const afterMisses=[...vowels,...failed];
    expect(projectKanaWordBridge(afterMisses)).toMatchObject({
      eligible:2,learned:0,newWords:0,readyToRead:0,readyToUse:0,
      pendingReview:2,available:false
    });
    expect(buildKanaWordBridge(afterMisses)).toEqual([]);

    // The same canonical meaning prompt can be answered later by the existing
    // due-review session. It is not regraded through a new bridge writer.
    const recovered=grade([prompts[0]!]);
    const afterRecovery=[...afterMisses,...recovered];
    expect(projectKanaWordBridge(afterRecovery)).toMatchObject({
      learned:1,pendingReview:1,readyToRead:1,available:true
    });
    expect(questions(buildKanaWordBridge(afterRecovery)).map(prompt=>prompt.id))
      .toEqual(["vocab-reading-lex-ii"]);

    const missReading={...grade(questions(buildKanaWordBridge(afterRecovery)))[0]!,
      id:"incorrect-reading",result:"incorrect" as const};
    expect(projectKanaWordBridge([...afterRecovery,missReading])).toMatchObject({
      learned:1,read:0,pendingReview:2,readyToRead:0,readyToUse:0,available:false
    });
    expect(buildKanaWordBridge([...afterRecovery,missReading])).toEqual([]);
    const readingRecovered=grade(questions(buildKanaWordBridge(afterRecovery)));
    const use=questions(buildKanaWordBridge([...afterRecovery,missReading,...readingRecovered]));
    expect(use.map(prompt=>prompt.id)).toEqual(["vocab-active-lex-ii"]);
    const missUse={...grade(use)[0]!,id:"incorrect-use",result:"incorrect" as const};
    const withMissedUse=[...afterRecovery,missReading,...readingRecovered,missUse];
    expect(projectKanaWordBridge(withMissedUse)).toMatchObject({
      read:1,transferred:0,pendingReview:2,available:false
    });
    expect(projectKanaWordBridge([...withMissedUse,...grade(use)])).toMatchObject({
      read:1,transferred:1,pendingReview:1,available:false
    });
  });
  it("unlocks source katakana words only after their original script groups are acquired",()=>{
    const hira=completeKana("hiragana");
    expect(projectKanaWordBridge(hira).eligible).toBeGreaterThan(2);
    const before=projectKanaWordBridge(hira).eligible;
    const kata=completeKana("katakana");
    const progress=projectKanaWordBridge([...hira,...kata]);
    expect(progress.eligible).toBeGreaterThan(before);
    expect(questions(buildKanaWordBridge([...hira,...kata])).every(p=>p.primaryTarget.kind==="lexeme")).toBe(true);
    const sourceWords=buildKanaWordBridge([...hira,...kata]).filter(isStudyLesson);
    expect(sourceWords.every(step=>Boolean(step.sourceLabel))).toBe(true);
  });
});
