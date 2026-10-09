import fs from "node:fs";
import vm from "node:vm";
import {describe,expect,it,vi} from "vitest";

function worker(){
  const handlers=new Map<string,(event:any)=>void>();
  const put=vi.fn().mockResolvedValue(undefined);
  const fetch=vi.fn().mockResolvedValue(new Response("app shell"));
  const cache={put,match:vi.fn(),addAll:vi.fn().mockResolvedValue(undefined)};
  vm.runInNewContext(fs.readFileSync("apps/web/public/sw.js","utf8"),{
    URL,Promise,Error,fetch,caches:{open:vi.fn().mockResolvedValue(cache),keys:vi.fn().mockResolvedValue([])},
    self:{location:{origin:"https://thiepn.dev"},registration:{scope:"https://thiepn.dev/japanese/"},addEventListener:(name:string,fn:any)=>handlers.set(name,fn),skipWaiting:vi.fn(),clients:{claim:vi.fn()}},
  });
  return {handlers,put,fetch};
}

describe("J16F offline cache privacy",()=>{
  it.each(["auth/callback/?code=private-code","auth/callback/","?code=private-code","?access_token=private-token"])("does not intercept or cache login URLs: %s",async(path)=>{
    const runtime=worker();
    const respondWith=vi.fn(),waitUntil=vi.fn();
    runtime.handlers.get("fetch")!({request:{method:"GET",url:"https://thiepn.dev/japanese/"+path,mode:"navigate"},respondWith,waitUntil});
    expect(respondWith).not.toHaveBeenCalled();
    expect(runtime.fetch).not.toHaveBeenCalled();
    expect(runtime.put).not.toHaveBeenCalled();
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
