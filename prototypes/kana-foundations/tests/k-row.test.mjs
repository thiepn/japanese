import test from 'node:test';
import assert from 'node:assert/strict';
import * as K from '../k-row-engine.mjs';

function passLesson(s=K.resume(K.initialState())){
 for(let n=0;n<15;n++){
  const task=K.taskAt(s);
  if(task.mode==='introduction')s=K.beginRecall(s);
  s=K.answer(s,task.answer,Date.UTC(2026,10,10));
  assert.equal(s.feedback.correct,true);
  s=K.advance(s);
 }
 return s;
}
test('Unit 02 contains five K-row prompts, five recognition checks and five readable real words',()=>{
 assert.deepEqual(K.KANA.map(k=>k.kana),['か','き','く','け','こ']);
 assert.deepEqual(K.TASKS.map(t=>t.mode).reduce((a,v)=>(a[v]=(a[v]||0)+1,a),{}),
  {introduction:5,recognition:5,decoding:5});
 assert.deepEqual(K.WORDS.map(w=>w.reading),['kao','ike','koe','kiku','koko']);
 assert.equal(K.STORAGE_KEY,'thiepn:kana-foundations:k-row:prototype-only:v1');
});
test('all-correct first session completes, remains valid and gives no inflated memory claim',()=>{
 const s=passLesson();
 assert.equal(s.finished,true);
 assert.equal(s.records.length,15);
 assert.equal(s.corrections.length,0);
 assert.equal(K.validState(JSON.parse(JSON.stringify(s))),true);
 const summary=K.summary(s);
 for(const mode of ['introduction','recognition','decoding']){
  assert.deepEqual(summary[mode],{total:5,completed:5,independentCorrect:5});
 }
});
test('wrong first character is preserved and typed correction is answerable',()=>{
 let s=K.resume(K.initialState());
 s=K.beginRecall(s);
 s=K.answer(s,'ki');
 assert.equal(s.feedback.correct,false);
 s=K.advance(s);
 for(let i=1;i<15;i++){
  const t=K.taskAt(s);
  if(t.mode==='introduction')s=K.beginRecall(s);
  s=K.advance(K.answer(s,t.answer));
 }
 assert.equal(s.finished,false);
 assert.deepEqual(s.corrections,['intro-ka']);
 assert.equal(K.taskAt(s).correction,true);
 const first=structuredClone(s.records[0]);
 s=K.answer(s,'ka');
 assert.equal(s.feedback.correct,true,'correction must not be blocked by the initial reveal/recall step');
 s=K.advance(s);
 assert.equal(s.finished,true);
 assert.deepEqual(s.records[0],first);
 assert.equal(s.records.at(-1).correction,true);
 assert.equal(K.summary(s).introduction.independentCorrect,4);
});
test('revealed answers remain unscored and trigger later correction',()=>{
 let s=K.resume(K.initialState());
 s=K.beginRecall(s);
 s=K.reveal(s);
 assert.deepEqual({correct:s.feedback.correct,assisted:s.feedback.assisted},{correct:null,assisted:true});
 s=K.advance(s);
 for(let i=1;i<15;i++){
  const t=K.taskAt(s);
  if(t.mode==='introduction')s=K.beginRecall(s);
  s=K.advance(K.answer(s,t.answer));
 }
 assert.deepEqual(s.corrections,['intro-ka']);
 assert.equal(s.records[0].correct,null);
});
test('legacy vowels and new Unit 02 use distinct keys; malformed evidence is refused',()=>{
 assert.notEqual(K.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1');
 assert.equal(K.validState(K.initialState()),true);
 let s=K.resume(K.initialState());
 const invalid=structuredClone(s);invalid.index=21;
 assert.equal(K.validState(invalid),false);
 s=K.beginRecall(s);s=K.answer(s,'ka');
 const corrupt=structuredClone(s);corrupt.records[0].correct=false;
 assert.equal(K.validState(corrupt),false);
 assert.equal(K.normalize('ＫＡ'),'ka');
 assert.equal(K.normalize(' ki - ku '),'kiku');
});
