import {describe,expect,it} from "vitest";
import {ux2CanReview,ux2CaseEntry} from "../../apps/web/src/design/UX2TransferPath";
describe("UX2 source-owned mobile cumulative route",()=>{
 it("keeps an unlinked original situation reading-only",()=>{
  expect(ux2CaseEntry({canDoId:null,prerequisiteReady:false,nextDailyStage:null})).toBe("preview");
 });
 it("requires the native source prerequisites before graded cumulative practice",()=>{
  expect(ux2CaseEntry({canDoId:"verified-id",prerequisiteReady:false,nextDailyStage:"listen-read"})).toBe("source");
 });
 it("uses the native daily stage, otherwise the existing complete lesson",()=>{
  expect(ux2CaseEntry({canDoId:"verified-id",prerequisiteReady:true,nextDailyStage:"respond"})).toBe("short");
  expect(ux2CaseEntry({canDoId:"verified-id",prerequisiteReady:true,nextDailyStage:null})).toBe("full");
 });
 it("never unlocks delayed transfer before source readiness or the existing gate",()=>{
  expect(ux2CanReview({canDoId:"verified-id",prerequisiteReady:true,status:"ready"})).toBe(true);
  expect(ux2CanReview({canDoId:"verified-id",prerequisiteReady:true,status:"reviewed"})).toBe(true);
  expect(ux2CanReview({canDoId:"verified-id",prerequisiteReady:true,status:"waiting"})).toBe(false);
  expect(ux2CanReview({canDoId:"verified-id",prerequisiteReady:false,status:"ready"})).toBe(false);
  expect(ux2CanReview({canDoId:null,prerequisiteReady:false,status:"needs-prerequisite"})).toBe(false);
 });
});
