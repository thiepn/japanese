import {describe,it,expect} from "vitest";
import {ReaderPlaybackFence} from "../../apps/web/src/immerse/playbackFence";

describe("Reader recorded-audio evidence cancellation",()=>{
  it("does not award listening completion after closing a reader",async()=>{
    const fence=new ReaderPlaybackFence();
    let resolvePlayback!:()=>void;
    const provider={play:()=>new Promise<void>(resolve=>{resolvePlayback=resolve}),stop:()=>resolvePlayback()};
    let completed=0;
    const epoch=fence.begin();
    const task=provider.play().then(()=>{if(fence.accepts(epoch))completed++});
    fence.invalidate();provider.stop();
    await task;
    expect(completed).toBe(0);
  });
  it("rejects late callbacks when a different reader starts",()=>{
    const fence=new ReaderPlaybackFence();
    const first=fence.begin();const second=fence.begin();
    expect(fence.accepts(first)).toBe(false);
    expect(fence.accepts(second)).toBe(true);
  });
  it("rejects late speech callback after unmount cancellation",()=>{
    const fence=new ReaderPlaybackFence();
    const epoch=fence.begin();
    fence.invalidate();
    expect(fence.accepts(epoch)).toBe(false);
  });
});
