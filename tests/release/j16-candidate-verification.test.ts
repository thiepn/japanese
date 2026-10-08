import {describe,it,expect} from "vitest";
import {probeJ16Candidate} from "../../scripts/j16-candidate-verify.mjs";

const SHA="a".repeat(40);
const BASE="https://thiepn.dev/japanese/";
const manifest={name:"Japanese",start_url:"./",scope:"./",display:"standalone",icons:[{src:"icon.svg"}]};
function mockFetch({commit=SHA,channel="candidate",fail=null,htmlSw=false,badManifest=false}={}){
  return async url=>{
    const target=new URL(String(url));
    const key=target.pathname.endsWith("/release-meta.json")?"releaseMeta":
      target.pathname.endsWith("/manifest.webmanifest")?"pwaManifest":
      target.pathname.endsWith("/sw.js")?"serviceWorker":
      target.hostname==="account.thiepn.dev"?"accountEntry":
      target.pathname.endsWith("/auth/callback/")?"accountCallback":"other";
    if(fail===key)return new Response("missing",{status:404});
    if(key==="releaseMeta")return new Response(JSON.stringify({schema:"thiepn-japanese-release-meta",schemaVersion:1,phase:"P22",channel,commit,builtAt:"2026-10-08T17:00:00Z"}),{status:200,headers:{"content-type":"application/json"}});
    if(key==="pwaManifest")return new Response(JSON.stringify(badManifest?{...manifest,display:"browser"}:manifest),{status:200,headers:{"content-type":"application/manifest+json"}});
    return new Response(key==="serviceWorker"?"self.addEventListener('fetch',()=>{})":"<!doctype html><html><title>Japanese</title>",{status:200,headers:{"content-type":key==="serviceWorker"?(htmlSw?"text/html":"text/javascript"):"text/html"}});
  };
}
describe("J16A live candidate verification",()=>{
  it("verifies exact Pages identity, shared Account routes and PWA shell",async()=>{
    const result=await probeJ16Candidate({expectedCommit:SHA,fetchImpl:mockFetch(),now:new Date("2026-10-08T17:00:00Z")});
    expect(result.status).toBe("verified_candidate");
    expect(result.observedCommit).toBe(SHA);
    expect(Object.values(result.checks).every(x=>x.pass)).toBe(true);
    expect(result.nextHumanChecks).toContain("Real installed Android PWA testing");
  });
  it("fails closed if deployed commit does not match the requested exact SHA",async()=>{
    const result=await probeJ16Candidate({expectedCommit:SHA,fetchImpl:mockFetch({commit:"b".repeat(40)})});
    expect(result.status).toBe("blocked");
    expect(result.blockers).toContain("releaseMeta: CANDIDATE_IDENTITY_MISMATCH");
  });
  it("rejects a stable-channel claim or broken Account entry route",async()=>{
    const stable=await probeJ16Candidate({expectedCommit:SHA,fetchImpl:mockFetch({channel:"stable"})});
    expect(stable.checks.releaseMeta.pass).toBe(false);
    const route=await probeJ16Candidate({expectedCommit:SHA,fetchImpl:mockFetch({fail:"accountEntry"})});
    expect(route.checks.accountEntry.pass).toBe(false);
  });
  it("rejects invalid PWA scope, nonstandalone display or HTML service-worker fallback",async()=>{
    const app=await probeJ16Candidate({expectedCommit:SHA,fetchImpl:mockFetch({badManifest:true})});
    expect(app.checks.pwaManifest.pass).toBe(false);
    const worker=await probeJ16Candidate({expectedCommit:SHA,fetchImpl:mockFetch({htmlSw:true})});
    expect(worker.checks.serviceWorker.reason).toBe("SERVICE_WORKER_HTML_FALLBACK");
  });
  it("rejects inexact commits and insecure or malformed bases",async()=>{
    await expect(probeJ16Candidate({expectedCommit:"short",fetchImpl:mockFetch()})).rejects.toThrow("40_HEX");
    await expect(probeJ16Candidate({expectedCommit:SHA,baseUrl:"http://example.com/japanese/",fetchImpl:mockFetch()})).rejects.toThrow("HTTPS_DIRECTORY");
  });
});
