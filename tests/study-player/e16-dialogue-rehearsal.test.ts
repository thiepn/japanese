import "fake-indexeddb/auto";
import {afterEach,describe,expect,it,vi} from "vitest";
import {createStudyEvent} from "../../packages/study-player/src/index";
import {E06_LINKED_CASES,getE06Overview} from "../../apps/web/src/study/e06IndependentCourse";
import {e02ReviewPrompts} from "../../apps/web/src/study/a1ExcellenceCourse";
import {e03ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceCourse";
import {e04ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {E11_TRANSFER,E11_BY_CASE} from "../../apps/web/src/study/e11PracticalTransfer";
import {E11_RESPONSE_BY_CASE} from "../../apps/web/src/study/e11ResponseMissions";
import {
  availableE16Dialogues,buildE16OriginalConversation,e16SourceComparison,
  normalizeE16Scratch,E16_REHEARSAL_MODES,
} from "../../apps/web/src/study/e16DialogueRehearsal";
import {createE16AudioPlayback} from "../../apps/web/src/study/e16DeviceSpeech";

const cohorts={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
const owner="e16-source-test-owner";
function sourceQualifiedCases(){
  const originalCases=getE06Overview([]).cases;
  const events:ReturnType<typeof createStudyEvent>[]=[];
  for(const caseRecord of E06_LINKED_CASES){
    const row=originalCases.find(c=>c.id===caseRecord.id);
    if(!row?.canDoId||!row.canonicalUnitId)continue;
    const base=cohorts[row.anchorCohort].filter(prompt=>
      prompt.primaryTarget.kind==="can_do"&&prompt.primaryTarget.id===row.canDoId&&
      prompt.eventMetadata?.[row.anchorCohort+"SceneId"]===row.anchorSceneId&&
      prompt.eventMetadata?.[row.anchorCohort+"UnitId"]===row.canonicalUnitId);
    const listen=base.find(p=>p.skill==="listening"||p.skill==="audio_recognition");
    const read=base.find(p=>["reading","comprehension","form_selection"].includes(p.skill));
    if(!listen?.acceptedAnswers[0]||!read?.acceptedAnswers[0])continue;
    const source=[listen,read].map((prompt,index)=>createStudyEvent({
      id:"e16-source-"+row.id+"-"+index,userId:owner,deviceId:"fixture",
      prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt:"2026-10-15T08:00:0"+index+"Z",responseTimeMs:200,
    }));
    if(getE06Overview(source).cases.find(c=>c.id===row.id)?.prerequisiteReady)events.push(...source);
  }
  return getE06Overview(events).cases;
}
const qualified=sourceQualifiedCases();

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe("E16 source-locked five-turn original Japanese dialogue",()=>{
  it("only unlocks a dialogue when original linked listening and reading evidence exist",()=>{
    expect(availableE16Dialogues(getE06Overview([]).cases)).toHaveLength(0);
    expect(()=>buildE16OriginalConversation(E11_TRANSFER[0]!.caseId,getE06Overview([]).cases))
      .toThrow("E16_SOURCE_PREREQUISITES_REQUIRED");
    const unlocked=availableE16Dialogues(qualified);
    expect(unlocked.length).toBeGreaterThanOrEqual(3);
    expect(unlocked.every(c=>Boolean(c.canonicalUnitId)&&Boolean(c.canDoId)&&c.prerequisiteReady)).toBe(true);
    expect(E16_REHEARSAL_MODES.map(mode=>mode.id)).toEqual(["listen-first","shadow-and-reply"]);
  });

  it("preserves ALL original speaker Japanese/English/intent lines and linked response questions",()=>{
    for(const caseRow of availableE16Dialogues(qualified)){
      const built=buildE16OriginalConversation(caseRow.id,qualified);
      const source=E11_BY_CASE.get(caseRow.id)!;
      const choices=E11_RESPONSE_BY_CASE.get(caseRow.id)!;
      expect(built.turns).toHaveLength(source.turns.length);
      expect(built.caseTitle).toBe(caseRow.title);
      expect(built.caseId).toBe(source.caseId);
      expect(built.setting).toBe(source.setting);
      expect(built.goal).toBe(source.goal);
      expect(built.originalNotice).toEqual({
        title:source.reading.title,japanese:source.reading.ja,english:source.reading.en,
      });
      for(const [index,turn] of built.turns.entries()){
        expect(turn.sourceTurnIndex).toBe(index);
        expect([turn.speaker,turn.japanese,turn.english,turn.intention]).toEqual([
          source.turns[index]!.speaker,source.turns[index]!.ja,
          source.turns[index]!.en,source.turns[index]!.intent,
        ]);
        const originalQuestion=choices.decisions.find(choice=>choice.correctTurn===index)?.question;
        expect(turn.replyDecision?.question??null).toBe(originalQuestion??null);
      }
      expect(built.turns.filter(turn=>turn.replyDecision)).toHaveLength(2);
      expect(built.originalDecisionQuestions).toEqual(choices.decisions.map(x=>x.question));
    }
  });

  it("keeps scratch comparison bounded, truthful and ungraded",()=>{
    const dialogue=buildE16OriginalConversation(availableE16Dialogues(qualified)[0]!.id,qualified);
    const text=normalizeE16Scratch("別の言い方".repeat(400));
    expect(text.length).toBe(1200);
    const comparison=e16SourceComparison(dialogue.turns[0]!,text);
    expect(comparison.originalLine).toBe(dialogue.turns[0]!.japanese);
    expect(comparison.translation).toBe(dialogue.turns[0]!.english);
    expect(comparison.intent).toBe(dialogue.turns[0]!.intention);
    expect(comparison.comparisonNote).toContain("No speech recognition or semantic score");
    expect(e16SourceComparison(dialogue.turns[0]!,"").comparisonNote).toContain("not a completed graded exercise");
    expect(JSON.stringify(dialogue)).not.toContain(owner);
  });
});

class MockUtterance {
  text:string;
  lang="";
  rate=1;
  voice:SpeechSynthesisVoice|null=null;
  onend:((event:Event)=>void)|null=null;
  onerror:((event:Event)=>void)|null=null;
  constructor(text:string){this.text=text;}
}
function speechFixture(){
  const utterances:MockUtterance[]=[];
  const cancel=vi.fn();
  const speak=vi.fn((utterance:MockUtterance)=>utterances.push(utterance));
  vi.stubGlobal("SpeechSynthesisUtterance",MockUtterance);
  vi.stubGlobal("speechSynthesis",{
    speak,cancel,getVoices:()=>[{lang:"ja-JP",name:"test-device-only"}],
  });
  return {utterances,cancel,speak};
}

describe("E16 synthesized playback safety and cancellation",()=>{
  it("speaks source turns in order with clamped rate and no remote audio calls",async()=>{
    const mock=speechFixture(),player=createE16AudioPlayback();
    const seen:number[]=[];
    const promise=player.play([
      {japanese:"いらっしゃいませ。"},
      {japanese:"お願いします。"},
      {japanese:"もう一度、確認してください。"},
    ],0.1,i=>seen.push(i));
    expect(seen).toEqual([0]);
    expect(mock.utterances[0]?.lang).toBe("ja-JP");
    expect(mock.utterances[0]?.rate).toBe(.75);
    mock.utterances[0]!.onend?.(new Event("end"));
    await vi.waitFor(()=>expect(mock.utterances).toHaveLength(2));
    mock.utterances[1]!.onend?.(new Event("end"));
    await vi.waitFor(()=>expect(mock.utterances).toHaveLength(3));
    mock.utterances[2]!.onend?.(new Event("end"));
    expect(await promise).toBe("completed");
    expect(seen).toEqual([0,1,2]);
    expect(player.playing).toBe(false);
  });

  it("settles interrupted speech immediately and never advances to another speaker",async()=>{
    const mock=speechFixture(),player=createE16AudioPlayback();
    const seen:number[]=[];
    const promise=player.play([{japanese:"第一声"},{japanese:"第二声"}],1,
      index=>seen.push(index));
    expect(mock.speak).toHaveBeenCalledOnce();
    player.stop();
    expect(await promise).toBe("cancelled");
    expect(seen).toEqual([0]);
    expect(mock.cancel).toHaveBeenCalledOnce();
    expect(player.playing).toBe(false);
    mock.utterances[0]!.onend?.(new Event("end"));
    await Promise.resolve();
    expect(mock.speak).toHaveBeenCalledOnce();
  });

  it("cancels first voice before another original turn takes over",async()=>{
    const mock=speechFixture(),player=createE16AudioPlayback();
    const old=player.play([{japanese:"古い元の声"},{japanese:"次の古い声"}],1,()=>{});
    const newer=player.play([{japanese:"新しい元の声"}],.9,()=>{});
    expect(await old).toBe("cancelled");
    expect(mock.cancel).toHaveBeenCalledTimes(1);
    expect(mock.speak).toHaveBeenCalledTimes(2);
    mock.utterances[1]!.onend?.(new Event("end"));
    expect(await newer).toBe("completed");
  });

  it("does not fabricate audio when the device lacks synthesis",async()=>{
    vi.stubGlobal("speechSynthesis",undefined);
    vi.stubGlobal("SpeechSynthesisUtterance",undefined);
    const player=createE16AudioPlayback();
    await expect(player.play([{japanese:"日本語"}],1,()=>{}))
      .rejects.toThrow("E16_DEVICE_JAPANESE_VOICE_UNAVAILABLE");
    expect(player.playing).toBe(false);
  });

  it("rejects empty source cues rather than inventing speech",async()=>{
    speechFixture();
    const player=createE16AudioPlayback();
    await expect(player.play([{japanese:""}],1,()=>{}))
      .rejects.toThrow("E16_EMPTY_ORIGINAL_VOICE_CUE");
  });
});
