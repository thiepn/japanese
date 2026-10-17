import {describe,expect,it} from "vitest";
import type {StudyEvent} from "../../packages/domain/src/index";
import {countUX1SavedAnswersToday,projectUX1Engagement} from "../../apps/web/src/study/ux1Engagement";

const now=new Date(2026,9,17,16);
function e(id:string,when:Date,promptId:string,result:"correct"|"incorrect"|"skipped",metadata:Record<string,unknown>={}):StudyEvent{
 return {id,userId:"owner",deviceId:"device",occurredAt:when.toISOString(),activity:"review",result,
  promptFamily:promptId,metadata:{promptId,...metadata}};
}
const on=(day:number,hour=12)=>new Date(2026,9,day,hour);
describe("UX-1 source-owned engagement",()=>{
 it("counts first correct original prompt per day once, but meaningful incorrect answers still count for a streak",()=>{
  const events=[e("a",on(17),"kana-1","correct"),e("b",on(17),"kana-1","correct"),
   e("c",on(17),"kana-2","incorrect"),e("d",on(16),"kana-1","correct")];
  expect(projectUX1Engagement(events,now)).toEqual({totalXp:10,streakDays:2,todayUniqueAnswers:2,dailyGoal:3});
 });
 it("never awards XP or quest participation for unscored optional writing or skipped cues",()=>{
  const events=[e("a",on(17),"free-writing","correct",{nonAuthoritative:true}),
   e("b",on(17),"optional-speech","skipped"),e("c",on(18),"future","correct")];
  expect(projectUX1Engagement(events,now)).toEqual({totalXp:0,streakDays:0,todayUniqueAnswers:0,dailyGoal:3});
 });
 it("awards the E02 first-completion bonus once, not for a repeated lesson or duplicate event",()=>{
  const names=["hear","read","reply","recall"];
  const events=names.map((name,i)=>e(String(i),on(17,11),"a1-e02-food-"+name,"correct",{e02SceneId:"food"}));
  events.push(events[0]!,e("again",on(17,13),"a1-e02-food-recall","correct",{e02SceneId:"food"}));
  expect(projectUX1Engagement(events,now).totalXp).toBe(35);
 });
 it("does not award a scene completion bonus for unanswered or currently incorrect required prompts",()=>{
  const events=["hear","read","reply","recall"].map((key,i)=>e(String(i),on(17),"a1-e02-food-"+key,i===3?"incorrect":"correct",{e02SceneId:"food"}));
  expect(projectUX1Engagement(events,now).totalXp).toBe(15);
 });
 it("keeps the daily recorded-answer total aligned with the authoritative quest filter",()=>{
  const correct=e("scored",on(17),"kana-1","correct");
  const repeated=e("repeated",on(17),"kana-1","incorrect");
  const optional=e("optional",on(17),"e12-writing","correct",{nonAuthoritative:true});
  const prior=e("yesterday",on(16),"kana-2","correct");
  const future=e("tomorrow",on(18),"kana-3","correct");
  const invalid={...e("invalid",on(17),"kana-4","correct"),occurredAt:"not-a-date"};
  expect(countUX1SavedAnswersToday([correct,repeated,optional,prior,future,invalid,correct],now)).toBe(2);
  expect(projectUX1Engagement([correct,repeated,optional,prior,future,invalid,correct],now).todayUniqueAnswers).toBe(1);
 });
 it("keeps yesterday's valid streak and counts distinct answers without another scheduler",()=>{
  const yesterday=e("a",on(16),"gram-1","incorrect");
  expect(projectUX1Engagement([yesterday],now)).toEqual({totalXp:0,streakDays:1,todayUniqueAnswers:0,dailyGoal:3});
 });
});
