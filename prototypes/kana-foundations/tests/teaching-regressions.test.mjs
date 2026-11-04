import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../engine.mjs';

// Intentionally failing regression expectations first. These tests document
// learning-quality defects observed in the exact baseline implementation.
test('intro requires an active unaided check before recording an introduced vowel',()=>{
 const started=engine.start(engine.initialState());
 const bypass=engine.advance(started);
 assert.equal(bypass.cursor,0,'Continue must not bypass an introduction recall attempt');
 assert.deepEqual(bypass.introduced,[]);
});
test('first hint offers a non-answer cue rather than immediately revealing the reading',()=>{
 let s=engine.start(engine.initialState());
 s={...s,phase:4,cursor:0}; // active recall prompt う
 const hinted=engine.setHint(s);
 assert.equal(hinted.hintLevel,1);
 assert.equal(hinted.feedback,null);
});
test('failed correction remains visible as a weak character with actionable review',()=>{
 let s=engine.start(engine.initialState());s=engine.advance(engine.advance(s));
 s=engine.submit(s,'i');s=engine.advance(s);
 s=engine.submit(s,'i');s=engine.advance(s);
 s=engine.submit(s,'i');s=engine.advance(s); // retry failed again
 const summary=engine.firstAttemptSummary(s);
 assert(summary.needsPractice?.includes('h-a'),'a failed correction must remain visible');
});
test('unavailable audio can skip its entire block, recording no listening achievement',()=>{
 const s={...engine.start(engine.initialState()),phase:5,cursor:0};
 assert.equal(typeof engine.skipListeningStage,'function');
 const done=engine.skipListeningStage(s,Date.UTC(2026,10,5));
 assert.equal(engine.currentStage(done).mode,'reading');
 assert.equal(engine.firstAttemptSummary(done).listening.skipped,5);
});
test('weak-character practice revisits only unresolved characters without altering first-attempt evidence',()=>{
 const s={...engine.start(engine.initialState()),phase:7,
  records:[{stage:'recall',mode:'recall',item:'h-u',correct:false,assisted:false,correction:false,practiceOnly:false,submitted:'o',at:'2026-11-05T00:00:00Z'}]};
 assert.equal(typeof engine.practiceWeakItems,'function');
 const next=engine.practiceWeakItems(s);
 assert.deepEqual(engine.currentItems(next),['h-u']);
 assert.equal(next.practiceOnly,true);
 assert.equal(engine.firstAttemptSummary(next).recall.total,1);
});
