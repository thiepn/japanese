/**
 * Run the actual, unchanged local-db source transpiled to localhost-only ESM.
 * GENUINE browser indexedDB. Synthetic disposable account IDs ONLY.
 *
 * This test harness is NOT the Japanese production app and must never
 * be routed from the product, bundled for release, or fed a real account ID.
 */
const PREFIX='synthetic-kana-idb-';
const TRACE='kana:hiragana-あ:form_selection:sound-to-kana';
const time='2026-11-05T14:00:00.000Z';
const source=()=>import('../.real-idb-harness/local-db.mjs');
function assertSynthetic(account){
 if(typeof account!=='string'||!/^synthetic-kana-idb-[a-z0-9-]{12,120}$/.test(account))
  throw Error('REFUSING_NON_SYNTHETIC_ACCOUNT');
}
function event(account,id,baseRevision=0,attemptId='synthetic-attempt-1',extras={}){
 return {id,userId:account,deviceId:'synthetic-browser-device',occurredAt:time,
  activity:'review',primaryTarget:{kind:'kana',id:'hiragana-あ'},
  skillDimension:'form_selection',promptFamily:'sound-to-kana',responseMode:'choice',
  result:'correct',baseRevision,
  metadata:{flashcard:true,kanaFoundationsAttemptId:attemptId,
   researchOnly:true,synthetic:true,...extras}};
}
function trace(account,revision){
 return {id:TRACE,userId:account,entity:{kind:'kana',id:'hiragana-あ'},
  skillDimension:'form_selection',cueFamily:'sound-to-kana',
  schedulerFamily:'fsrs',schedulerVersion:'ts-fsrs-5.4.2',revision,
  card:{due:'2026-11-06T14:00:00.000Z',stability:1,difficulty:5,
   elapsedDays:1,scheduledDays:1,learningSteps:0,reps:revision,
   lapses:0,state:1,lastReviewAt:time}};
}
// Native Error instances have name="Error" but the domain invariant is in message.
// Preserve the actionable code for browser assertions instead of masking it.
const errorCode=e=>String(e?.message||e?.name||e);
async function snapshot(account){
 assertSynthetic(account);
 const db=await source();
 const [events,traces,outbox]=await Promise.all([
  db.listStudyEvents(account),db.listMemoryTraces(account),db.listOutbox(account)
 ]);
 return {counts:{events:events.length,traces:traces.length,outbox:outbox.length},
  eventIds:events.map(x=>x.id).sort(),attemptIds:events.map(x=>x.metadata?.kanaFoundationsAttemptId).sort(),
  mutationIds:outbox.map(x=>x.mutation_id).sort(),
  traceRevision:traces.find(x=>x.id===TRACE)?.revision??null,
  traceOwner:traces.find(x=>x.id===TRACE)?.userId??null};
}
export async function snapshotSynthetic(account){return snapshot(account)}
export async function clearSynthetic(account){
 assertSynthetic(account);
 const {databaseNameForAccount}=await source();
 return new Promise((resolve,reject)=>{
  const request=indexedDB.deleteDatabase(databaseNameForAccount(account));
  request.onsuccess=()=>resolve(true);
  request.onerror=()=>reject(request.error||Error('DB_CLEANUP_FAILED'));
  request.onblocked=()=>reject(Error('DB_CLEANUP_BLOCKED'));
 });
}
export async function writeSynthetic(account,{id='synthetic-event-1',baseRevision=0,
 revision=1,attemptId='synthetic-attempt-1',flashcard=true}={}){
 assertSynthetic(account);
 const db=await source();
 const input=event(account,id,baseRevision,attemptId,{flashcard});
 try{
  const output=await db.saveStudyReview(input,trace(account,revision));
  return {ok:true,mutationId:output.mutation_id};
 }catch(e){return {ok:false,error:errorCode(e)}}
}
async function transactionAbortAt(account,phase){
 assertSynthetic(account);
 const originals={add:IDBObjectStore.prototype.add,put:IDBObjectStore.prototype.put};
 const label=phase==='after-event'?'study_events':phase==='after-outbox'?'sync_outbox':'memory_traces';
 const hook=phase==='after-event'?'add':'put';
 let injected=false;
 IDBObjectStore.prototype[hook]=function(...args){
  const request=originals[hook].apply(this,args);
  if(!injected&&this.name===label){
   injected=true;
   const tx=this.transaction;
   queueMicrotask(()=>{try{tx.abort()}catch{}});
  }
  return request;
 };
 try {
  const output=await writeSynthetic(account);
  return {phase,injected,output,state:await snapshot(account)};
 }finally{
  IDBObjectStore.prototype.add=originals.add;
  IDBObjectStore.prototype.put=originals.put;
 }
}
export async function runRealIndexedDbCase(account,which){
 assertSynthetic(account);
 const db=await source();
 switch(which){
  case 'atomic':{
   const result=await writeSynthetic(account);
   return {result,state:await snapshot(account)};
  }
  case 'duplicate-event':{
   const first=await writeSynthetic(account);
   const retry=await writeSynthetic(account,{revision:2,baseRevision:1});
   return {first,retry,state:await snapshot(account)};
  }
  case 'same-attempt-new-event':{
   const first=await writeSynthetic(account);
   const replay=await writeSynthetic(account,{id:'synthetic-event-2',
    attemptId:'synthetic-attempt-1',baseRevision:1,revision:2});
   return {first,replay,state:await snapshot(account),
    conclusion:'REPRODUCED_MISSING_ATTEMPT_LEVEL_UNIQUENESS'};
  }
  case 'revision-conflict':{
   const first=await writeSynthetic(account);
   const stale=await writeSynthetic(account,{id:'synthetic-event-2',
    attemptId:'synthetic-attempt-2',baseRevision:0,revision:1});
   return {first,stale,state:await snapshot(account)};
  }
  case 'abort-after-event':
  case 'abort-after-outbox':
  case 'abort-after-trace':
   return transactionAbortAt(account,which.replace('abort-',''));
  case 'ack-lost':{
   const first=await writeSynthetic(account);
   // Simulate a lost response *after* IndexedDB oncomplete. This does not
   // simulate killing the browser process during an actual transaction.
   const ackObserved=false;
   const sameId=await writeSynthetic(account,{revision:2,baseRevision:1});
   const newId=await writeSynthetic(account,{id:'synthetic-event-2',
    baseRevision:1,revision:2,attemptId:'synthetic-attempt-1'});
   return {first,ackObserved,sameId,newId,state:await snapshot(account),
    caveat:'oncomplete succeeded: simulated lost acknowledgment, not real crash'};
  }
  case 'snapshot-import':{
   const provenance=event(account,'synthetic-import-1',undefined,'synthetic-import-1',{
    kanaStudioImport:true,schedulerExcluded:true,flashcard:false});
   provenance.result='skipped';delete provenance.baseRevision;
   const original=trace(account,0);
   const first=await db.importKanaSnapshotIfMissing(account,original,provenance);
   const repeat=await db.importKanaSnapshotIfMissing(account,original,provenance);
   return {first,repeat,state:await snapshot(account)};
  }
  case 'owner-mismatch':{
   const syntheticOther=account+'-other';
   let error;
   try{await db.saveStudyReview(event(account,'synthetic-event-1'),
    trace(syntheticOther,1));}catch(e){error=errorCode(e)}
   return {error,state:await snapshot(account)};
  }
  case 'epoch-changed':{
   const key='synthetic-kana-only-lease-probe';
   localStorage.setItem(key,JSON.stringify({owner:account,epoch:'synthetic-epoch-0001'}));
   // Simulated epoch transition before the IndexedDB commit.
   localStorage.setItem(key,JSON.stringify({owner:account,epoch:'synthetic-epoch-0002'}));
   const current=JSON.parse(localStorage.getItem(key));
   const result=await writeSynthetic(account);
   localStorage.removeItem(key);
   return {result,observedEpoch:current.epoch,state:await snapshot(account),
    conclusion:'SOURCE_SAVE_STUDY_REVIEW_HAS_NO_LEASE_EPOCH_ARGUMENT'};
  }
  default:throw Error('UNSUPPORTED_SYNTHETIC_CASE');
 }
}
