import {test,expect} from '@playwright/test';
import {randomUUID,createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';

const syntheticId=()=>('synthetic-kana-idb-'+randomUUID()).toLowerCase();
const files=['packages/local-db/src/index.ts','packages/sync-protocol/src/index.ts'];
const browser=async (page,account,scenario)=>page.evaluate(
 async ({account,scenario})=>(await import('./qualification/real-idb-scenarios.mjs'))
  .runRealIndexedDbCase(account,scenario),{account,scenario});
const snapshot=async(page,account)=>page.evaluate(
 async id=>(await import('./qualification/real-idb-scenarios.mjs')).snapshotSynthetic(id),account);
const directWrite=async(page,account,input)=>page.evaluate(
 async ({account,input})=>(await import('./qualification/real-idb-scenarios.mjs'))
  .writeSynthetic(account,input),{account,input});
const erase=async(page,account)=>page.evaluate(
 async id=>(await import('./qualification/real-idb-scenarios.mjs')).clearSynthetic(id),account);
async function ready(page){await page.goto('/index.html');}
function logReviewEvidence(testInfo,name,output){
 if(!process.env.CI)return;
 const dir='prototypes/kana-foundations/.visual-evidence';
 mkdirSync(dir,{recursive:true});
 const path=dir+'/'+testInfo.project.name+'-real-idb-'+name+'.json';
 writeFileSync(path,JSON.stringify({syntheticOnly:true,scenario:name,head:'exact checkout',
  project:testInfo.project.name,evidence:output},null,2)+'\n');
}

test('exact version-pinned source is transpiled without editing production modules',async({page},testInfo)=>{
 await ready(page);
 const provenance=await page.evaluate(()=>fetch('./.real-idb-harness/provenance.json').then(r=>r.json()));
 expect(provenance.reviewOnly).toBe(true);
 expect(provenance.productionCodeModified).toBe(false);
 for(const path of files){
  const file=provenance.modules.find(x=>x.source===path);
  expect(file).toBeTruthy();
  const actual=createHash('sha256').update(readFileSync(resolve(path))).digest('hex');
  expect(file.sha256).toBe(actual);
 }
 expect(await page.evaluate(async()=>typeof (await import('./.real-idb-harness/local-db.mjs')).saveStudyReview)).toBe('function');
 logReviewEvidence(testInfo,'exact-source',provenance);
});
for(const [scenario,verifier] of [
 ['atomic',r=>{
  expect(r.result).toMatchObject({ok:true,mutationId:'synthetic-event-1'});
  expect(r.state).toMatchObject({counts:{events:1,outbox:1,traces:1},
   traceRevision:1,eventIds:['synthetic-event-1'],mutationIds:['synthetic-event-1']});
 }],
 ['duplicate-event',r=>{
  expect(r.first.ok).toBe(true);expect(r.retry.ok).toBe(false);
  expect(r.state.counts).toEqual({events:1,traces:1,outbox:1});
  expect(r.state.traceRevision).toBe(1);
 }],
 ['same-attempt-new-event',r=>{
  // This is an OPEN PRODUCT GAP, not a safety success.
  expect(r.first.ok).toBe(true);expect(r.replay.ok).toBe(true);
  expect(r.state.counts).toEqual({events:2,traces:1,outbox:2});
  expect(r.state.traceRevision).toBe(2);
  expect(new Set(r.state.attemptIds).size).toBe(1);
  expect(r.conclusion).toBe('REPRODUCED_MISSING_ATTEMPT_LEVEL_UNIQUENESS');
 }],
 ['revision-conflict',r=>{
  expect(r.first.ok).toBe(true);expect(r.stale.ok).toBe(false);
  expect(r.stale.error).toMatch(/FLASHCARD_REVISION_CONFLICT/i);
  expect(r.state.counts).toEqual({events:1,traces:1,outbox:1});
  expect(r.state.traceRevision).toBe(1);
 }],
 ['abort-after-event',r=>{
  expect(r.injected).toBe(true);expect(r.output.ok).toBe(false);
  expect(r.state.counts).toEqual({events:0,traces:0,outbox:0});
 }],
 ['abort-after-outbox',r=>{
  expect(r.injected).toBe(true);expect(r.output.ok).toBe(false);
  expect(r.state.counts).toEqual({events:0,traces:0,outbox:0});
 }],
 ['abort-after-trace',r=>{
  expect(r.injected).toBe(true);expect(r.output.ok).toBe(false);
  expect(r.state.counts).toEqual({events:0,traces:0,outbox:0});
 }],
 ['ack-lost',r=>{
  expect(r.first.ok).toBe(true);expect(r.ackObserved).toBe(false);
  expect(r.sameId.ok).toBe(false);
  // Same-attempt with *new* event ID still bypasses uniqueness: real gap.
  expect(r.newId.ok).toBe(true);
  expect(r.state.counts).toEqual({events:2,traces:1,outbox:2});
 }],
 ['snapshot-import',r=>{
  expect(r.first).toBe(true);expect(r.repeat).toBe(false);
  expect(r.state.counts).toEqual({events:1,traces:1,outbox:1});
  expect(r.state.traceRevision).toBe(0);
 }],
 ['owner-mismatch',r=>{
  expect(r.error).toMatch(/MEMORY_TRACE_ACCOUNT_MISMATCH/);
  expect(r.state.counts).toEqual({events:0,traces:0,outbox:0});
 }],
 ['epoch-changed',r=>{
  // The direct production DB writer has no epoch input; do not misrepresent
  // this source-only reproduction as an end-to-end account takeover.
  expect(r.result.ok).toBe(true);
  expect(r.observedEpoch).toBe('synthetic-epoch-0002');
  expect(r.state.counts).toEqual({events:1,traces:1,outbox:1});
  expect(r.conclusion).toBe('SOURCE_SAVE_STUDY_REVIEW_HAS_NO_LEASE_EPOCH_ARGUMENT');
 }]
]){
 test('REAL browser IndexedDB: '+scenario,async({page},testInfo)=>{
  const id=syntheticId();await ready(page);
  try {const result=await browser(page,id,scenario);verifier(result);logReviewEvidence(testInfo,scenario,result);}
  finally{await erase(page,id);}
 });
}

test('two tabs compete at the same revision: only one transaction wins',async({context},testInfo)=>{
 const id=syntheticId();const a=await context.newPage(),b=await context.newPage();
 await Promise.all([ready(a),ready(b)]);
 try{
  const [x,y]=await Promise.all([
   directWrite(a,id,{id:'synthetic-a',baseRevision:0,revision:1,attemptId:'attempt-a'}),
   directWrite(b,id,{id:'synthetic-b',baseRevision:0,revision:1,attemptId:'attempt-b'})
  ]);
  expect([x.ok,y.ok].filter(Boolean)).toHaveLength(1);
  const state=await snapshot(a,id);
  expect(state.counts).toEqual({events:1,outbox:1,traces:1});
  expect(state.traceRevision).toBe(1);
  logReviewEvidence(testInfo,'two-tabs-compete',{x,y,state});
 }finally{await a.close();await erase(b,id);await b.close();}
});
test('two tabs can submit same attempt with different event IDs after revision advance: GAP',async({context},testInfo)=>{
 const id=syntheticId();const a=await context.newPage(),b=await context.newPage();
 await Promise.all([ready(a),ready(b)]);
 try{
  const one=await directWrite(a,id,{id:'synthetic-a',baseRevision:0,revision:1,attemptId:'one-attempt'});
  const two=await directWrite(b,id,{id:'synthetic-b',baseRevision:1,revision:2,attemptId:'one-attempt'});
  expect(one.ok).toBe(true);expect(two.ok).toBe(true);
  const state=await snapshot(a,id);
  expect(state.counts).toEqual({events:2,outbox:2,traces:1});
  expect(new Set(state.attemptIds).size).toBe(1);
  logReviewEvidence(testInfo,'two-tabs-replay-gap',{one,two,state});
 }finally{await a.close();await erase(b,id);await b.close();}
});
test('different synthetic account namespaces never see each other data',async({page},testInfo)=>{
 const first=syntheticId(),second=syntheticId();await ready(page);
 try{
  expect((await directWrite(page,first,{id:'synthetic-first'})).ok).toBe(true);
  expect((await snapshot(page,first)).counts.events).toBe(1);
  expect((await snapshot(page,second)).counts).toEqual({events:0,outbox:0,traces:0});
  logReviewEvidence(testInfo,'account-isolation',{firstEvents:1,secondEvents:0});
 }finally{await erase(page,first);await erase(page,second);}
});

test('two tabs transition synthetic lease epoch; raw production DB writer remains unfenced: GAP',async({context},testInfo)=>{
 const id=syntheticId(),a=await context.newPage(),b=await context.newPage();
 await Promise.all([ready(a),ready(b)]);
 const key='synthetic-kana-only-cross-tab-lease';
 try{
  await a.evaluate(([key,id])=>localStorage.setItem(key,JSON.stringify({owner:id,epoch:'synthetic-epoch-0001'})),[key,id]);
  const first=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  expect(first.epoch).toBe('synthetic-epoch-0001');
  await b.evaluate(([key,id])=>localStorage.setItem(key,JSON.stringify({owner:id,epoch:'synthetic-epoch-0002'})),[key,id]);
  const changed=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  expect(changed.epoch).toBe('synthetic-epoch-0002');
  const rawWriter=await directWrite(a,id,{id:'synthetic-event-after-epoch',revision:1,baseRevision:0});
  expect(rawWriter.ok).toBe(true); // source-layer gap, NOT a user-facing account exploit
  const state=await snapshot(b,id);
  expect(state.counts).toEqual({events:1,outbox:1,traces:1});
  logReviewEvidence(testInfo,'two-tabs-lease-epoch-gap',{changed,rawWriter,state});
 }finally{
  await a.evaluate(key=>localStorage.removeItem(key),key).catch(()=>{});
  await a.close();await erase(b,id);await b.close();
 }
});
