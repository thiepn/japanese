import {describe,expect,it,vi} from "vitest";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync(new URL("../../apps/web/public/sw.js",import.meta.url),"utf8");
// Asset revisions must invalidate previously cached pictures without touching learner data.
if(!source.includes("vocab-v4"))throw new Error("Vocabulary image cache must be versioned after SVG changes");
function setup({cacheDenied=false,networkGate=null}={}){
 const handlers=new Map();const entries=new Map();const waits=[];let disconnected=false;
 const store={
   match:async request=>entries.get(request.url)?.clone(),
   put:async(request,response)=>{entries.set(request.url,response.clone());},
   keys:async()=>[...entries.keys()].map(url=>({url})),
   delete:async request=>entries.delete(request.url)
 };
 const deleted=[];
 const cacheNames=["japanese-shell-vocab-v1","japanese-shell-vocab-v2","japanese-shell-vocab-v3","japanese-shell-vocab-v4","japanese-shell-v7","unrelated-cache"];
 const caches={open:async()=>{if(cacheDenied)throw Error("quota");return store;},keys:async()=>cacheNames,delete:async(name)=>{deleted.push(name);return true;}};
 const fetch=vi.fn(async()=>{if(networkGate)await networkGate;if(disconnected)throw Error("offline");return new Response("<svg/>",{status:200});});
 const self={location:{origin:"https://example.test"},registration:{scope:"https://example.test/jp/"},addEventListener:(name,handler)=>handlers.set(name,handler),skipWaiting(){},clients:{claim:async()=>{}}};
 runInNewContext(source,{self,caches,fetch,Response,Promise,URL,console});
 async function image(name){
   const request={method:"GET",url:"https://example.test/jp/vocab/"+name+".svg",destination:"image",mode:"cors"};
   let response;
   const event={request,respondWith(promise){response=promise;},waitUntil(promise){waits.push(promise);}};
   handlers.get("fetch")(event);
   if(!response)throw Error("Image fetch was not intercepted");
   return response;
 }
async function activate(){handlers.get("activate")({waitUntil(promise){waits.push(promise);}});await Promise.all(waits);}
function rawRequest(url){
   const request={method:"GET",url,destination:"image",mode:"cors"};
   let response;
   handlers.get("fetch")({request,respondWith(promise){response=promise;},waitUntil(promise){waits.push(promise);}});
   return response;
 }
 return {image,rawRequest,fetch,entries,waits,deleted,activate,setOffline(value){disconnected=value;}};
}
describe("original vocabulary-image service worker cache",()=>{
 it("retains shell and current pictures while removing old picture caches",async()=>{
   const h=setup();await h.activate();
   expect(h.deleted).toContain("japanese-shell-vocab-v1");
   expect(h.deleted).toContain("japanese-shell-vocab-v2");
   expect(h.deleted).toContain("japanese-shell-vocab-v3");
   expect(h.deleted).not.toContain("japanese-shell-vocab-v4");
   expect(h.deleted).not.toContain("japanese-shell-v7");
   expect(h.deleted).not.toContain("unrelated-cache");
 });
 it("excludes query parameters, auth routes and other origins from image interception",()=>{
   const h=setup();
   expect(h.rawRequest("https://example.test/jp/vocab/rice.svg?token=private")).toBeUndefined();
   expect(h.rawRequest("https://example.test/jp/auth/callback.svg")).toBeUndefined();
   expect(h.rawRequest("https://not-example.test/jp/vocab/rice.svg")).toBeUndefined();
   expect(h.entries.size).toBe(0);
 });
 it("registers event lifetime extension synchronously before a delayed image response",async()=>{
   let release;
   const networkGate=new Promise(resolve=>{release=resolve;});
   const h=setup({networkGate});
   const pending=h.image("apple");
   // The fetch event is no longer dispatching after this synchronous assertion.
   expect(h.waits).toHaveLength(1);
   release();
   const response=await pending;
   expect(response.status).toBe(200);
   await Promise.all(h.waits);
   expect(h.entries.size).toBe(1);
 });
 it("fetches images online when storage access is blocked",async()=>{
   const h=setup({cacheDenied:true});
   const image=await h.image("house");expect(image.status).toBe(200);
   await Promise.all(h.waits);expect(h.fetch).toHaveBeenCalledTimes(1);
 });
 it("reuses a viewed illustration offline without fetching unseen illustrations",async()=>{
   const h=setup();await h.image("apple");await Promise.all(h.waits);
   expect(h.entries.size).toBe(1);h.setOffline(true);
   const image=await h.image("apple");expect(image.status).toBe(200);
   expect(h.fetch).toHaveBeenCalledTimes(1);
   await expect(h.image("never-viewed")).rejects.toThrow("offline");
 });
 it("evicts beyond 48 entries under parallel downloads",async()=>{
   const h=setup();await Promise.all(Array.from({length:65},(_,i)=>h.image("word-"+i)));
   await Promise.all(h.waits);expect(h.entries.size).toBe(48);
   expect(h.entries.has("https://example.test/jp/vocab/word-0.svg")).toBe(false);
   expect(h.entries.has("https://example.test/jp/vocab/word-64.svg")).toBe(true);
 });
});
