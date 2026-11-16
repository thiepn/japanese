import test from 'node:test';
import assert from 'node:assert/strict';
import {UNITS} from '../course-map-model.mjs';
import {reviewFromSnapshot,reviewScopeIds} from '../review-model.mjs';
import * as K from '../k-row-engine.mjs';
import * as V from '../engine.mjs';

test('wrong real first attempt yields a source-grounded review prompt without writes',()=>{
 let s=K.resume(K.initialState());s=K.beginRecall(s);s=K.answer(s,'wrong');
 assert.equal(K.validState(s),true);
 const raw=JSON.stringify(s),out=reviewFromSnapshot(UNITS[1],K,raw);
 assert.equal(out.unavailable,false);
 assert.deepEqual(out.items.map(x=>[x.prompt,x.answer,x.reason]),
  [['か','ka','Incorrect first response']]);
 assert.equal(JSON.stringify(s),raw);
});
test('assisted first answers are eligible; corrections and practice-only records are excluded',()=>{
 const t=K.TASKS[0],engine={TASKS:K.TASKS,validState:()=>true};
 const base={taskId:t.id,correction:false,correct:true,assisted:false};
 const records=[base,{...base,correction:true,correct:false},{...base,practiceOnly:true,correct:false}];
 assert.equal(reviewFromSnapshot(UNITS[1],engine,JSON.stringify({records})).items.length,0);
 const assisted=reviewFromSnapshot(UNITS[1],engine,JSON.stringify({records:[{...base,assisted:true}]}));
 assert.equal(assisted.items[0].reason,'Assisted first response');
});
test('Unit 01 uses real vowel and word objects while excluding unverified listening',()=>{
 const engine={validState:()=>true,VOWELS:V.VOWELS,WORDS:V.WORDS};
 const records=[{mode:'intro-check',item:'h-a',correction:false,correct:false,assisted:false},
  {mode:'reading',item:'ie',correction:false,correct:false,assisted:false},
  {mode:'listening',item:'h-o',correction:false,correct:false,assisted:false},
  {mode:'recall',item:'h-i',correction:true,correct:false,assisted:false}];
 assert.deepEqual(reviewFromSnapshot(UNITS[0],engine,JSON.stringify({records})).items
  .map(x=>[x.prompt,x.answer]),[['あ','a'],['いえ','ie']]);
});
test('choice identifiers resolve to their genuine human-readable option label',()=>{
 const engine={TASKS:[{id:'meaning-dog',kana:'いぬははしる',answer:'dogruns',
  choices:[{value:'dogruns',label:'The dog runs.'}],note:'は sounds wa here.'}],validState:()=>true};
 const records=[{taskId:'meaning-dog',correction:false,correct:false,assisted:false}];
 const out=reviewFromSnapshot(UNITS[10],engine,JSON.stringify({records}));
 assert.equal(out.items[0].answer,'The dog runs.');
 assert.equal(out.items[0].note,'は sounds wa here.');
});
test('unreadable and invalid states never produce guessed review prompts',()=>{
 assert.deepEqual(reviewFromSnapshot(UNITS[1],K,null),{items:[],unavailable:false});
 assert.deepEqual(reviewFromSnapshot(UNITS[1],K,'not-json'),{items:[],unavailable:true});
 assert.deepEqual(reviewFromSnapshot(UNITS[1],K,'{"schema":999}'),{items:[],unavailable:true});
});


test('real lesson aliases appear only as source-authored alternatives, never invented synonyms',async()=>{
 const review=await import('../reading-review-engine.mjs');
 const task=review.TASKS.find(t=>Array.isArray(t.aliases)&&t.aliases.includes('hasiru'));
 assert.ok(task,'source must contain a known alternate romanization');
 const engine={TASKS:review.TASKS,validState:()=>true};
 const raw=JSON.stringify({records:[{taskId:task.id,correction:false,
  correct:false,assisted:false,practiceOnly:false}]});
 const out=reviewFromSnapshot(UNITS[10],engine,raw);
 assert.equal(out.items.length,1);
 assert.equal(out.items[0].answer,task.answer);
 assert.deepEqual(out.items[0].alternatives,task.aliases);
 assert.equal(out.items[0].alternatives.includes('はしる'),false);
});
test('tasks without lesson-authored aliases do not fabricate alternatives',()=>{
 let state=K.resume(K.initialState());state=K.beginRecall(state);state=K.answer(state,'bad');
 const out=reviewFromSnapshot(UNITS[1],K,JSON.stringify(state));
 assert.deepEqual(out.items[0].alternatives,[]);
});


test('independent original correct answers are optionally reviewable, never marked difficult',()=>{
 let state=K.resume(K.initialState());state=K.beginRecall(state);state=K.answer(state,'ka');
 assert.equal(K.validState(state),true);
 const raw=JSON.stringify(state);
 assert.equal(reviewFromSnapshot(UNITS[1],K,raw).items.length,0);
 const all=reviewFromSnapshot(UNITS[1],K,raw,{includeIndependent:true});
 assert.deepEqual(all.items.map(x=>[x.prompt,x.answer,x.needsReview,x.reason]),
  [['か','ka',false,'Independent first response']]);
 assert.equal(JSON.stringify(state),raw);
});
test('expanded review includes difficult and correct first attempts exactly once',()=>{
 let state=K.resume(K.initialState());state=K.beginRecall(state);state=K.answer(state,'wrong');
 state=K.advance(state);state=K.beginRecall(state);state=K.answer(state,'ki');
 assert.equal(K.validState(state),true);
 const raw=JSON.stringify(state);
 const hard=reviewFromSnapshot(UNITS[1],K,raw);
 const all=reviewFromSnapshot(UNITS[1],K,raw,{includeIndependent:true});
 assert.deepEqual(hard.items.map(x=>[x.prompt,x.needsReview]),[['か',true]]);
 assert.deepEqual(all.items.map(x=>[x.prompt,x.needsReview]),[['か',true],['き',false]]);
 assert.equal(JSON.stringify(state),raw);
});


test('section review selects existing canonical groups without renumbering units',()=>{
 const rows=[{unitId:2},{unitId:11},{unitId:20},{unitId:18},{unitId:2}];
 assert.deepEqual(reviewScopeIds(rows,UNITS,'all'),[0,1,2,3,4]);
 assert.deepEqual(reviewScopeIds(rows,UNITS,'2'),[0,4]);
 assert.deepEqual(reviewScopeIds(rows,UNITS,'group:hiragana'),[0,4]);
 assert.deepEqual(reviewScopeIds(rows,UNITS,'group:combinations'),[1,3]);
 assert.deepEqual(reviewScopeIds(rows,UNITS,'group:katakana'),[2]);
 assert.deepEqual(reviewScopeIds(rows,UNITS,'group:nonexistent'),[]);
 assert.equal(UNITS[10].id,11);
 assert.equal(UNITS[14].id,15);
 assert.equal(UNITS[17].id,18);
});
