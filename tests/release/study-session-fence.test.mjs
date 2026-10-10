import {describe,it,expect} from "vitest";
import {StudySessionFence} from "../../apps/web/src/study/sessionFence";

describe("learner workspace session isolation",()=>{
  it("rejects stale study queues after account changes",()=>{
    const fence=new StudySessionFence();
    const guest=fence.begin("guest");
    fence.invalidate();
    expect(fence.accepts(guest,"account-A")).toBe(false);
    const owner=fence.begin("account-A");
    expect(fence.accepts(owner,"account-A")).toBe(true);
    expect(fence.accepts(owner,"guest")).toBe(false);
  });
  it("rejects older requests even for the same account",()=>{
    const fence=new StudySessionFence();
    const first=fence.begin("account-A");
    const second=fence.begin("account-A");
    expect(fence.accepts(first,"account-A")).toBe(false);
    expect(fence.accepts(second,"account-A")).toBe(true);
  });
  it("cannot revive an old request by switching back to the same owner",()=>{
    const fence=new StudySessionFence();
    const old=fence.begin("guest");
    fence.invalidate();
    fence.begin("account-A");
    fence.invalidate();
    fence.begin("guest");
    expect(fence.accepts(old,"guest")).toBe(false);
  });
  it("rejects pending operations if a workspace is signed out",()=>{
    const fence=new StudySessionFence();
    const pending=fence.begin("account-A");
    fence.invalidate();
    expect(fence.accepts(pending,"account-A")).toBe(false);
  });
});
