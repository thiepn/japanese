import { describe,expect,it } from "vitest";
import { entityKey,type StudyEvent } from "../../packages/domain/src/index";
import { replayStudyEvents } from "../../packages/learner-engine/src/index";

function event(id:string,result:"correct"|"incorrect",occurredAt:string):StudyEvent{return {id,userId:"u",deviceId:"d",occurredAt,activity:"review",primaryTarget:{kind:"kana",id:"hiragana-あ"},skillDimension:"reading",promptFamily:"kana-to-romaji-recall",result};}

describe("learner mastery replay",()=>{
  it("replays evidence chronologically and separates skill dimensions",()=>{const state=replayStudyEvents([event("2","incorrect","2026-10-02T00:00:00Z"),event("1","correct","2026-10-01T00:00:00Z")]);const key=entityKey({kind:"kana",id:"hiragana-あ"},"reading");expect(state.mastery[key]?.evidenceCount).toBe(2);expect(state.eventCount).toBe(2);expect(state.mastery[key]?.modelVersion).toBe("p1.3");});
  it("does not fabricate mastery for unseen skills",()=>{const state=replayStudyEvents([event("1","correct","2026-10-01T00:00:00Z")]);expect(state.mastery[entityKey({kind:"kana",id:"hiragana-あ"},"form_selection")]).toBeUndefined();});
});
