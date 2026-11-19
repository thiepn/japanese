import fs from "node:fs";
import vm from "node:vm";
import {describe,expect,it,vi} from "vitest";

function worker(base="https://thiepn.dev/japanese/"){
  const handlers=new Map<string,(event:any)=>void>();
  const put=vi.fn().mockResolvedValue(undefined);
  const fetch=vi.fn().mockResolvedValue(new Response("app shell"));
  const cache={put,match:vi.fn(),addAll:vi.fn().mockResolvedValue(undefined)};
  vm.runInNewContext(fs.readFileSync("apps/web/public/sw.js","utf8"),{
    URL,Promise,Error,fetch,caches:{open:vi.fn().mockResolvedValue(cache),keys:vi.fn().mockResolvedValue([])},
    self:{location:{origin:new URL(base).origin},registration:{scope:base},addEventListener:(name:string,fn:any)=>handlers.set(name,fn),skipWaiting:vi.fn(),clients:{claim:vi.fn()}},
  });
  return {handlers,put,fetch,cache};
}

describe("J16F offline cache privacy",()=>{
  it.each(["auth/callback/?code=private-code","auth/callback/","?code=private-code","?access_token=private-token","?view=Learn&code=private-code","?view=Learn&view=Library","?view=unknown","?view=Learn&state=private-state","auth/callback/?view=Learn","different/?view=Learn","?view=Learn#access_token=private-token"])("does not intercept or cache login URLs: %s",async(path)=>{
    const runtime=worker();
    const respondWith=vi.fn(),waitUntil=vi.fn();
    runtime.handlers.get("fetch")!({request:{method:"GET",url:"https://thiepn.dev/japanese/"+path,mode:"navigate"},respondWith,waitUntil});
    expect(respondWith).not.toHaveBeenCalled();
    expect(runtime.fetch).not.toHaveBeenCalled();
    expect(runtime.put).not.toHaveBeenCalled();
  });
  it.each(["https://thiepn.dev/japanese/","https://japanese.thiepn.dev/"])("restores only a safe root view from the cached public shell at %s",async(base)=>{
    const runtime=worker(base);
    runtime.fetch.mockRejectedValueOnce(Error("offline"));
    runtime.cache.match.mockResolvedValueOnce(new Response("cached public shell"));
    const respondWith=vi.fn(),waitUntil=vi.fn();
    runtime.handlers.get("fetch")!({request:{method:"GET",url:base+"?view=Library",mode:"navigate"},respondWith,waitUntil});
    expect(respondWith).toHaveBeenCalledOnce();
    expect(await (await respondWith.mock.calls[0][0]).text()).toBe("cached public shell");
    expect(runtime.cache.match).toHaveBeenCalledOnce();
    expect(runtime.cache.match).toHaveBeenCalledWith(new URL(base).pathname);
    expect(runtime.put).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
  });
  it("does not cache safe view query URLs even when online",async()=>{
    const runtime=worker();
    const respondWith=vi.fn(),waitUntil=vi.fn();
    runtime.handlers.get("fetch")!({request:{method:"GET",url:"https://thiepn.dev/japanese/?view=Learn",mode:"navigate"},respondWith,waitUntil});
    expect((await respondWith.mock.calls[0][0]).ok).toBe(true);
    expect(runtime.put).not.toHaveBeenCalled();
    expect(runtime.cache.match).not.toHaveBeenCalled();
  });
  it("does not intercept a safe-looking resource query",()=>{
    const runtime=worker();
    const respondWith=vi.fn(),waitUntil=vi.fn();
    runtime.handlers.get("fetch")!({request:{method:"GET",url:"https://thiepn.dev/japanese/?view=Learn",mode:"cors"},respondWith,waitUntil});
    expect(respondWith).not.toHaveBeenCalled();
  });
  it("keeps a safe cache write alive until it completes without breaking the network response",async()=>{
    const runtime=worker();
    const writes:Promise<unknown>[]=[];
    let response:Promise<Response>|undefined;
    runtime.handlers.get("fetch")!({request:{method:"GET",url:"https://thiepn.dev/japanese/assets/app.js"},respondWith:(p:Promise<Response>)=>response=p,waitUntil:(p:Promise<unknown>)=>writes.push(p)});
    expect((await response)!.ok).toBe(true);
    expect(writes).toHaveLength(1);
    await Promise.all(writes);
    expect(runtime.put).toHaveBeenCalledOnce();
  });
});
