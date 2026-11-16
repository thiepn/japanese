import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createSyntheticLedger,previewSyntheticTransaction} from '../qualification/transaction-failure-model.mjs';

const lease={owner:'synthetic-a',epoch:'a1111111-1111-4111-8111-111111111111'};
const registry={traceId:'kana:hiragana-あ:form_selection:sound-to-kana',primaryTarget:{kind:'kana',id:'hiragana-あ'},skill:'form_selection',cueFamily:'sound-to-kana',prompt:'a',displayAnswer:'あ',cardId:'h-a:rev',kanaId:'h-a'};
const prompt={id:'reverse-1',mode:'reverse',kanaIds:['h-a'],answer:'h-a',choices:['h-a','h-i','h-u','h-e','h-o'],correctionOf:null};
const attempt={attemptId:'synthetic-s:reverse-1:1',sessionId:'synthetic-s',promptId:prompt.id,mode:'reverse',kanaIds:['h-a'],responseNormalized:'h-a',correct:true,independent:true,assistanceLevel:'none',correction:false,revealed:false,practiceOnly:false,canonicalEligible:true,canonicalGradeId:null};
const input=(changes={})=>({eventId:'synthetic-event-1',attempt,prompt,registry,leaseAtStart:lease,leaseAtCommit:lease,baseRevision:0,proposedRevision:1,...changes});
const count=ledger=>({events:ledger.events.size,traces:ledger.traces.size,outbox:ledger.outbox.size,attempts:ledger.attemptIds.size});
const allZero=x=>assert.deepEqual(count(x),{events:0,traces:0,outbox:0,attempts:0});

test('NO_WRITE model creates no external storage or production imports',()=>{
 const source=readFileSync(new URL('../qualification/transaction-failure-model.mjs',import.meta.url),'utf8');
 for(const forbidden of ['@thiepn/local-db','@thiepn/scheduler','saveStudyReview(','gradeJapaneseKanaCard(','indexedDB','localStorage','fetch('])assert(!source.includes(forbidden),forbidden);
 assert(source.includes('NO_WRITE'));
 const ledger=createSyntheticLedger();allZero(ledger);
});
test('atomic synthetic commit changes event, outbox and trace together exactly once',()=>{
 const ledger=createSyntheticLedger();
 const result=previewSyntheticTransaction(ledger,input());
 assert.equal(result.status,'COMMITTED_SYNTHETIC');
 assert.equal(result.wouldWrite,false);
 assert.deepEqual(count(ledger),{events:1,traces:1,outbox:1,attempts:1});
 assert.equal(ledger.traces.get(registry.traceId).revision,1);
 assert.equal(ledger.outbox.get('synthetic-event-1').eventId,'synthetic-event-1');
});
test('failure injection at each precommit checkpoint rolls back all stores',()=>{
 for(const step of ['after-event','after-outbox','after-trace','before-commit']){
  const ledger=createSyntheticLedger();
  const result=previewSyntheticTransaction(ledger,input({fault:step}));
  assert.deepEqual(result,{status:'ABORTED_SYNTHETIC',reason:'INJECTED_'+step.toUpperCase().replaceAll('-','_'),wouldWrite:false});
  allZero(ledger);
 }
});
test('crash after committed write but before ack replays by same event and attempt without double-grade',()=>{
 const ledger=createSyntheticLedger();
 const result=previewSyntheticTransaction(ledger,input({fault:'after-commit-before-ack'}));
 assert.equal(result.status,'COMMIT_ACK_LOST_SYNTHETIC');
 assert.deepEqual(count(ledger),{events:1,traces:1,outbox:1,attempts:1});
 const replay=previewSyntheticTransaction(ledger,input());
 assert.deepEqual(replay,{status:'ALREADY_COMMITTED_SYNTHETIC',reason:'DUPLICATE_EVENT_ID',wouldWrite:false});
 assert.deepEqual(count(ledger),{events:1,traces:1,outbox:1,attempts:1});
});
test('a new event UUID for the same underlying learner attempt is refused by extra synthetic attempt uniqueness',()=>{
 const ledger=createSyntheticLedger();
 previewSyntheticTransaction(ledger,input());
 const replay=previewSyntheticTransaction(ledger,input({eventId:'new-random-uuid-for-same-attempt',baseRevision:1,proposedRevision:2}));
 assert.equal(replay.reason,'DUPLICATE_ATTEMPT_ID');
 assert.deepEqual(count(ledger),{events:1,traces:1,outbox:1,attempts:1});
});
test('stale CAS cannot append event or outbox despite distinct attempt identity',()=>{
 const ledger=createSyntheticLedger();
 previewSyntheticTransaction(ledger,input());
 const other={...attempt,attemptId:'synthetic-s:reverse-2:1'};
 const r=previewSyntheticTransaction(ledger,input({attempt:other,eventId:'synthetic-event-2',baseRevision:0,proposedRevision:1}));
 assert.equal(r.reason,'FLASHCARD_REVISION_CONFLICT');
 assert.deepEqual(count(ledger),{events:1,traces:1,outbox:1,attempts:1});
});
test('wrong proposed revision cannot create event',()=>{
 const ledger=createSyntheticLedger();
 const r=previewSyntheticTransaction(ledger,input({proposedRevision:5}));
 assert.equal(r.reason,'REVISION_NOT_SUCCESSOR');allZero(ledger);
});
test('same-owner epoch switch during simulated in-flight transaction aborts before commit',()=>{
 const ledger=createSyntheticLedger();
 const newer={...lease,epoch:'b2222222-2222-4222-8222-222222222222'};
 const r=previewSyntheticTransaction(ledger,input({leaseAtCommit:newer}));
 assert.equal(r.reason,'OWNER_LEASE_CHANGED');allZero(ledger);
});
test('change of account or invalid lease fails without touching ledger',()=>{
 const ledger=createSyntheticLedger();
 for(const leaseAtCommit of [{...lease,owner:'synthetic-b'},null]){
  const r=previewSyntheticTransaction(ledger,input({leaseAtCommit}));
  assert.match(r.reason,/OWNER_LEASE/);
  allZero(ledger);
 }
});
test('practice-only, invalid cue, wrong and revealed attempts always stay outside transaction model',()=>{
 for(const changed of [
  {attempt:{...attempt,practiceOnly:true,canonicalEligible:false}},
  {prompt:{...prompt,mode:'recognition'}},
  {attempt:{...attempt,correct:false,independent:false}},
  {attempt:{...attempt,revealed:true,independent:false}}
 ]){
  const ledger=createSyntheticLedger();
  const r=previewSyntheticTransaction(ledger,input(changed));
  assert.equal(r.status,'BLOCKED');
  allZero(ledger);
 }
});
test('unrelated preexisting ledger data remains byte-for-byte unchanged after simulated abort',()=>{
 const ledger=createSyntheticLedger();
 const survivor={id:'sentinel',revision:17,userId:'synthetic-a'};
 ledger.traces.set('sentinel',structuredClone(survivor));
 const before=JSON.stringify([...ledger.traces]);
 const r=previewSyntheticTransaction(ledger,input({fault:'after-outbox'}));
 assert.equal(r.status,'ABORTED_SYNTHETIC');
 assert.equal(JSON.stringify([...ledger.traces]),before);
});
