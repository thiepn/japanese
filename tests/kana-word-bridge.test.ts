import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "@thiepn/study-player";
import {buildBeginnerStage,buildKatakanaStage,projectBeginnerOverview,type BeginnerStageId} from "../apps/web/src/study/beginnerCourse";
import {buildKanaWordBridge,buildKanaWordSourceRepair,projectKanaWordBridge} from "../apps/web/src/study/kanaWordBridge";
import {vocabularyApplicationPrompts,vocabularyMeaningPrompts,vocabularyLessons} from "../apps/web/src/study/vocabulary";

const GROUPS:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function grade(steps:readonly StudyPrompt[],owner="bridge-fixture",occurredAt="2026-10-20T10:00:00.000Z"):StudyEvent[]{
  return steps.map((prompt,index)=>{
    const event=createStudyEvent({id:owner+"-"+prompt.id+"-"+index,
      userId:owner,deviceId:"test-device",prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt,responseTimeMs:100});
    expect(event.result).toBe("correct");
    return event;
  });
}
const questions=(steps:ReturnType<typeof buildKanaWordBridge>):StudyPrompt[]=>
  steps.filter((step):step is StudyPrompt=>!isStudyLesson(step)&&!step.id.startsWith("a0-kana-first-sight-"));
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
    expect(steps).toHaveLength(6);
    expect(isStudyLesson(steps[0]!)).toBe(false);
    expect(isStudyLesson(steps[1]!)).toBe(true);
    expect(isStudyLesson(steps[3]!)).toBe(false);
    expect(isStudyLesson(steps[4]!)).toBe(true);
    expect(steps[0]).toMatchObject({
      id:"a0-kana-first-sight-lex-ii",prompt:"いい",acceptedAnswers:["ii"],
      sourceId:"thiepn-original",
      eventMetadata:{nonAuthoritative:true,schedulerExcluded:true,kanaWordFirstSight:true}
    });
    expect(steps[3]).toMatchObject({id:"a0-kana-first-sight-lex-iie",prompt:"いいえ",acceptedAnswers:["iie"]});
    expect(questions(steps).map(p=>p.id)).toEqual(["vocab-meaning-lex-ii","vocab-meaning-lex-iie"]);
    expect(questions(steps)[0]).toMatchObject({
      id:"vocab-meaning-lex-ii",primaryTarget:{kind:"lexeme",id:"lex-ii"},
      acceptedAnswers:["good"],sourceId:"thiepn-original"
    });
    expect(steps[1]).toMatchObject({id:vocabularyLessons["vocab-lex-ii"]?.id,sourceLabel:vocabularyLessons["vocab-lex-ii"]?.sourceLabel});
  });
  it("makes original meaning choices require recognition rather than a first-button shortcut",()=>{
    const vowel=knownVowels();
    const steps=buildKanaWordBridge(vowel);
    const originals=questions(steps);
    expect(originals).toHaveLength(2);
    for(const [index,prompt] of originals.entries()){
      if(prompt.promptType!=="choice")throw Error("CANONICAL_MEANING_CHOICE_REQUIRED");
      const canonical=vocabularyMeaningPrompts.find(item=>item.id===prompt.id);
      if(!canonical||canonical.promptType!=="choice")throw Error("MISSING_CANONICAL_VOCABULARY");
      expect(prompt).not.toBe(canonical);
      expect(prompt.id).toBe(canonical.id);
      expect(prompt.primaryTarget).toEqual(canonical.primaryTarget);
      expect(prompt.contextId).toBe(canonical.contextId);
      expect(prompt.sourceId).toBe(canonical.sourceId);
      expect(prompt.contentVersion).toBe(canonical.contentVersion);
      expect(prompt.skill).toBe(canonical.skill);
      expect(prompt.cueFamily).toBe(canonical.cueFamily);
      expect(prompt.acceptedAnswers).toEqual(canonical.acceptedAnswers);
      expect([...prompt.choices].sort()).toEqual([...canonical.choices].sort());
      expect(canonical.choices[0]).toBe(canonical.acceptedAnswers[0]);
      const answer=prompt.acceptedAnswers[0]!;
      expect(prompt.choices.indexOf(answer)).toBe(index+1);
      expect(prompt.choices[0]).not.toBe(answer);
      const graded=createStudyEvent({
        id:"source-meaning-"+index,userId:"bridge-fixture",deviceId:"test-device",
        prompt,response:answer,occurredAt:"2026-10-20T10:00:00.000Z",responseTimeMs:100
      });
      expect(graded.result).toBe("correct");
      expect(graded.metadata?.promptId).toBe(canonical.id);
    }
    const persisted=grade([originals[0]!],"bridge-fixture","2026-10-20T10:01:00.000Z");
    const resumed=buildKanaWordBridge([...vowel,...persisted]);
    const next=questions(resumed);
    expect(next.map(prompt=>prompt.id)).toEqual([
      "vocab-reading-lex-ii","vocab-meaning-lex-iie"
    ]);
    const remaining=next.find(prompt=>prompt.id==="vocab-meaning-lex-iie");
    if(!remaining||remaining.promptType!=="choice")throw Error("MISSING_REMAINING_MEANING");
    expect(remaining.choices.indexOf(remaining.acceptedAnswers[0]!)).toBe(2);
    const original=vocabularyMeaningPrompts.find(prompt=>prompt.id==="vocab-meaning-lex-iie");
    if(!original||original.promptType!=="choice")throw Error("MISSING_ORIGINAL_MEANING");
    expect(original.choices[0]).toBe(original.acceptedAnswers[0]);
    const forged={...persisted[0]!,id:"fake-other",metadata:{...persisted[0]!.metadata,nonAuthoritative:true}};
    expect(questions(buildKanaWordBridge([...vowel,forged]))[0]?.id).toBe("vocab-meaning-lex-ii");
    expect(questions(buildKanaWordBridge([...vowel,forged]))[0]).toEqual(originals[0]);
  });
  it("records first-sight reading only as non-authoritative evidence and never as FSRS vocabulary mastery",()=>{
    const vowel=knownVowels();
    const session=buildKanaWordBridge(vowel);
    const first=session[0]!;
    if(isStudyLesson(first))throw new Error("MISSING_FIRST_SIGHT_DECODING");
    expect(first).toMatchObject({skill:"reading",cueFamily:"a0-kana-first-sight-unscored",
      sourceId:"thiepn-original",answerNormalization:"romaji",
      eventMetadata:{schedulerExcluded:true,nonAuthoritative:true}});
    const raw=createStudyEvent({id:"first-sight-only",userId:"bridge-fixture",deviceId:"test-device",
      prompt:first,response:"ii",occurredAt:"2026-10-20T10:00:00.000Z",responseTimeMs:100});
    // recordStudyAnswer persists this prompt as skipped, not an authoritative answer.
    const saved={...raw,result:"skipped" as const,
      metadata:{...raw.metadata,structuralResult:raw.result,nonAuthoritative:true}};
    const overview=projectKanaWordBridge([...vowel,saved]);
    expect(overview).toMatchObject({learned:0,read:0,transferred:0,newWords:2});
    const resumed=buildKanaWordBridge([...vowel,saved]);
    expect(resumed[0]).toMatchObject({id:vocabularyLessons["vocab-lex-ii"]?.id});
    expect(resumed.filter(step=>!isStudyLesson(step)&&step.id==="a0-kana-first-sight-lex-ii")).toHaveLength(0);
    expect(resumed.filter(step=>!isStudyLesson(step)&&step.id==="a0-kana-first-sight-lex-iie")).toHaveLength(1);
    expect(questions(resumed).map(prompt=>prompt.id)).toEqual(["vocab-meaning-lex-ii","vocab-meaning-lex-iie"]);
    const forged={...saved,metadata:{...saved.metadata,promptId:"a0-kana-first-sight-unrelated"}};
    expect(buildKanaWordBridge([...vowel,forged])[0]).toMatchObject({id:"a0-kana-first-sight-lex-ii"});
  });
  it("decodes previously unseen original katakana words without manufactured audio or proficiency credit",()=>{
    const events=completeKana("katakana");
    const steps=buildKanaWordBridge(events);
    expect(steps[0]).toMatchObject({id:"a0-kana-first-sight-lex-toire",
      prompt:"トイレ",acceptedAnswers:["toire"],
      eventMetadata:{nonAuthoritative:true,schedulerExcluded:true}});
    expect(steps[3]).toMatchObject({id:"a0-kana-first-sight-lex-resutoran",
      prompt:"レストラン",acceptedAnswers:["resutoran"],
      eventMetadata:{nonAuthoritative:true,schedulerExcluded:true}});
    expect(questions(steps).map(prompt=>prompt.id)).toEqual([
      "vocab-meaning-lex-toire","vocab-meaning-lex-resutoran"
    ]);
  });
  it("treats incorrect first-sight decoding as a saved unscored attempt, not a failed FSRS word",()=>{
    const vowels=knownVowels();
    const step=buildKanaWordBridge(vowels)[0]!;
    if(isStudyLesson(step))throw Error("EXPECTED_FIRST_SIGHT_PROMPT");
    const event=createStudyEvent({id:"cold-miss",userId:"bridge-fixture",deviceId:"test-device",
      prompt:step,response:"aaa",occurredAt:"2026-10-20T10:00:00.000Z",responseTimeMs:100});
    expect(event.result).toBe("incorrect");
    const saved={...event,result:"skipped" as const,
      metadata:{...event.metadata,nonAuthoritative:true,structuralResult:event.result}};
    const state=projectKanaWordBridge([...vowels,saved]);
    expect(state).toMatchObject({eligible:2,learned:0,read:0,transferred:0,
      pendingReview:0,readyToRead:0});
    const followUp=buildKanaWordBridge([...vowels,saved]);
    expect(followUp[0]).toMatchObject({id:vocabularyLessons["vocab-lex-ii"]?.id});
    expect(questions(followUp).map(prompt=>prompt.id)).toEqual([
      "vocab-meaning-lex-ii","vocab-meaning-lex-iie"
    ]);
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
  it("offers only original authored lessons for attempted canonical word failures, with no grade authority",()=>{
    const vowels=knownVowels();
    expect(buildKanaWordSourceRepair([])).toEqual([]);
    expect(buildKanaWordSourceRepair(vowels)).toEqual([]);
    const meaning=questions(buildKanaWordBridge(vowels));
    const missed=meaning.map((prompt,index)=>({
      ...grade([prompt])[0]!,id:"word-failed-"+index,result:"incorrect" as const
    }));
    const blocked=[...vowels,...missed];
    expect(projectKanaWordBridge(blocked)).toMatchObject({
      pendingReview:2,available:false,learned:0
    });
    const originals=buildKanaWordSourceRepair(blocked);
    expect(originals).toHaveLength(2);
    expect(originals.every(isStudyLesson)).toBe(true);
    expect(originals[0]).toBe(vocabularyLessons["vocab-lex-ii"]);
    expect(originals[1]).toBe(vocabularyLessons["vocab-lex-iie"]);
    for(const lesson of originals){
      if(!isStudyLesson(lesson))throw Error("UNEXPECTED_GRADED_RETRY");
      expect(lesson.sourceLabel).toBe(vocabularyLessons[lesson.contextId]?.sourceLabel);
      expect(lesson.facts?.some(fact=>fact.label==="Meaning")).toBe(true);
      expect(lesson.facts?.some(fact=>fact.label==="Reading")).toBe(true);
    }
    expect(buildKanaWordBridge(blocked)).toEqual([]);
    const forged={...missed[0]!,id:"forged",metadata:{...missed[0]!.metadata,promptId:"not-original"}};
    expect(buildKanaWordSourceRepair([...vowels,forged])).toEqual([]);
    const unscored={...missed[0]!,id:"unscored",
      metadata:{...missed[0]!.metadata,nonAuthoritative:true}};
    expect(buildKanaWordSourceRepair([...vowels,unscored])).toEqual([]);
    const recovered=grade([meaning[0]!],"bridge-fixture","2026-10-20T10:01:00.000Z")[0]!;
    const afterRecovery=[...blocked,recovered];
    expect(buildKanaWordSourceRepair(afterRecovery)).toEqual([vocabularyLessons["vocab-lex-iie"]]);
    expect(questions(buildKanaWordBridge(afterRecovery)).map(prompt=>prompt.id)).toEqual([
      "vocab-reading-lex-ii"
    ]);
  });
  it("keeps original reading and active-use lapses explainable without shortcutting the original review",()=>{
    const vowels=knownVowels();
    const meaning=questions(buildKanaWordBridge(vowels))[0]!;
    const passedMeaning=grade([meaning])[0]!;
    const reading=questions(buildKanaWordBridge([...vowels,passedMeaning]))[0]!;
    const failedReading={...grade([reading])[0]!,id:"failed-reading",
      result:"incorrect" as const,occurredAt:"2026-10-20T10:01:00.000Z"};
    const blocked=[...vowels,passedMeaning,failedReading];
    expect(projectKanaWordBridge(blocked).pendingReview).toBe(1);
    expect(buildKanaWordSourceRepair(blocked)).toEqual([vocabularyLessons["vocab-lex-ii"]]);
    expect(questions(buildKanaWordBridge(blocked)).some(prompt=>prompt.id==="vocab-active-lex-ii")).toBe(false);
    const recoveredReading=grade([reading],"bridge-fixture","2026-10-20T10:02:00.000Z")[0]!;
    const active=questions(buildKanaWordBridge([...blocked,recoveredReading]))[0]!;
    expect(active.id).toBe("vocab-active-lex-ii");
    const failedActive={...grade([active])[0]!,id:"failed-active",
      result:"incorrect" as const,occurredAt:"2026-10-20T10:03:00.000Z"};
    expect(buildKanaWordSourceRepair([...blocked,recoveredReading,failedActive]))
      .toEqual([vocabularyLessons["vocab-lex-ii"]]);
    expect(questions(buildKanaWordBridge([...blocked,recoveredReading,failedActive]))
      .some(prompt=>prompt.id==="vocab-active-lex-ii")).toBe(false);
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
    const recovered=grade([prompts[0]!],"bridge-fixture","2026-10-20T10:01:00.000Z");
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
    const readingRecovered=grade(questions(buildKanaWordBridge(afterRecovery)),"bridge-fixture","2026-10-20T10:02:00.000Z");
    const use=questions(buildKanaWordBridge([...afterRecovery,missReading,...readingRecovered]));
    expect(use.map(prompt=>prompt.id)).toEqual(["vocab-active-lex-ii"]);
    const missUse={...grade(use)[0]!,id:"incorrect-use",result:"incorrect" as const};
    const withMissedUse=[...afterRecovery,missReading,...readingRecovered,missUse];
    expect(projectKanaWordBridge(withMissedUse)).toMatchObject({
      read:1,transferred:0,pendingReview:2,available:false
    });
    expect(projectKanaWordBridge([...withMissedUse,...grade(use,"bridge-fixture","2026-10-20T10:03:00.000Z")])).toMatchObject({
      read:1,transferred:1,pendingReview:1,available:false
    });
  });
  it("uses the latest canonical review regardless of IndexedDB record order",()=>{
    const vowel=knownVowels();
    const firstMeaning=questions(buildKanaWordBridge(vowel))[0]!;
    const earlierCorrect=grade([firstMeaning],"bridge-fixture","2026-10-20T10:01:00.000Z")[0]!;
    const laterIncorrect={...earlierCorrect,id:"late-failed-meaning",result:"incorrect" as const,
      occurredAt:"2026-10-20T10:05:00.000Z"};
    // An older historical pass cannot overrule the most recent incorrect due-review answer,
    // even if a datastore lists its UUID after the newer event.
    const reversed=[...vowel,laterIncorrect,earlierCorrect];
    expect(projectKanaWordBridge(reversed)).toMatchObject({
      learned:0,readyToRead:0,pendingReview:1,newWords:1,available:true
    });
    expect(questions(buildKanaWordBridge(reversed)).map(p=>p.id)).toEqual([
      "vocab-meaning-lex-iie"
    ]);

    const newerCorrect={...earlierCorrect,id:"recovered-meaning",occurredAt:"2026-10-20T10:06:00.000Z"};
    const recovered=[...vowel,newerCorrect,laterIncorrect,earlierCorrect];
    expect(projectKanaWordBridge(recovered)).toMatchObject({
      learned:1,readyToRead:1,pendingReview:0
    });
    expect(questions(buildKanaWordBridge(recovered)).map(p=>p.id)).toEqual([
      "vocab-reading-lex-ii","vocab-meaning-lex-iie"
    ]);
  });
  it("suspends active-use transfer after a newer original reading lapse and restores it after review",()=>{
    const vowel=knownVowels();
    const meaningPrompt=questions(buildKanaWordBridge(vowel))[0]!;
    const meaning=grade([meaningPrompt])[0]!;
    const readingPrompt=questions(buildKanaWordBridge([...vowel,meaning]))[0]!;
    const reading=grade([readingPrompt])[0]!;
    expect(questions(buildKanaWordBridge([...vowel,meaning,reading]))[0]!.id)
      .toBe("vocab-active-lex-ii");
    const lapse={...reading,id:"later-lapsed-reading",result:"incorrect" as const,
      occurredAt:"2026-10-20T10:05:00.000Z"};
    const blocked=[...vowel,lapse,reading,meaning];
    expect(projectKanaWordBridge(blocked)).toMatchObject({
      learned:1,read:0,readyToUse:0,pendingReview:1
    });
    expect(questions(buildKanaWordBridge(blocked)).some(p=>p.id==="vocab-active-lex-ii"))
      .toBe(false);
    const recovered={...reading,id:"subsequent-reading-pass",
      occurredAt:"2026-10-20T10:06:00.000Z"};
    expect(questions(buildKanaWordBridge([recovered,...blocked]))[0]!.id)
      .toBe("vocab-active-lex-ii");
  });
  it("does not allow an equal-time historical correct answer to erase a lapse",()=>{
    const vowels=knownVowels();
    const meaningPrompt=questions(buildKanaWordBridge(vowels))[0]!;
    const pass=grade([meaningPrompt])[0]!;
    const miss={...pass,id:"equal-time-miss",result:"incorrect" as const};
    for(const order of [[pass,miss],[miss,pass]]){
      const overview=projectKanaWordBridge([...vowels,...order]);
      expect(overview).toMatchObject({learned:0,pendingReview:1,readyToRead:0});
    }
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
