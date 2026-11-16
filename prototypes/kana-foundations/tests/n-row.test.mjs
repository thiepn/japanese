import test from 'node:test';
import assert from 'node:assert/strict';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

function complete(s=N.resume(N.initialState())){
 for(let i=0;i<N.TASKS.length;i++){
  const task=N.taskAt(s);
  if(task.mode==='introduction')s=N.beginRecall(s);
  s=N.answer(s,task.answer,Date.UTC(2026,10,10));
  assert.equal(s.feedback?.correct,true,'failed to independently read '+task.id);
  s=N.advance(s);
 }
 return s;
}
test('Unit 05 teaches exactly five N-row characters with meaningful contrast notes',()=>{
 assert.deepEqual(N.KANA.map(k=>k.kana),['な','に','ぬ','ね','の']);
 assert.deepEqual(N.KANA.map(k=>k.reading),['na','ni','nu','ne','no']);
 assert(N.KANA.every(k=>k.note&&k.note.length>50));
 assert.match(N.KANA.find(k=>k.id==='nu').note,/の/);
 assert.match(N.KANA.find(k=>k.id==='no').note,/ぬ/);
 assert.equal(N.TASKS.length,15);
 for(const mode of ['introduction','recognition','decoding'])
  assert.equal(N.TASKS.filter(t=>t.mode===mode).length,5);
});
test('Unit 05 words are real, useful and entirely readable from Units 01–05 kana',()=>{
 assert.deepEqual(N.WORDS.map(w=>[w.kana,w.reading,w.meaning]),[
  ['なに','nani','what'],['いぬ','inu','dog'],['ねこ','neko','cat'],
  ['きのこ','kinoko','mushroom'],['ぬの','nuno','cloth; fabric']
 ]);
 const learned=new Set([...('あいうえお'),...K.KANA.map(x=>x.kana),...S.KANA.map(x=>x.kana),
  ...T.KANA.map(x=>x.kana),...N.KANA.map(x=>x.kana)]);
 for(const w of N.WORDS){
  assert([...w.kana].every(k=>learned.has(k)),'unseen kana in '+w.kana);
  assert(typeof w.kanji==='string'&&w.kanji.length>0);
 }
 const keys=['thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,S.STORAGE_KEY,T.STORAGE_KEY,N.STORAGE_KEY];
 assert.equal(new Set(keys).size,5,'Unit 05 must never share a storage key with prior units');
});
test('all-correct Unit 05 finishes with 15 independent first attempts and no corrections',()=>{
 const done=complete();
 assert.equal(done.finished,true);
 assert.equal(done.records.length,15);
 assert.equal(done.corrections.length,0);
 assert(N.validState(JSON.parse(JSON.stringify(done))));
 for(const mode of ['introduction','recognition','decoding'])
  assert.deepEqual(N.summary(done)[mode],{total:5,completed:5,independentCorrect:5});
});
test('confusing ぬ with の does not earn credit and schedules genuine correction',()=>{
 let s=N.resume(N.initialState());
 for(let i=0;i<15;i++){
  let task=N.taskAt(s);
  if(task.mode==='introduction')s=N.beginRecall(s);
  s=N.answer(s,i===2?'no':task.answer,Date.UTC(2026,10,10));
  assert.equal(s.feedback.correct,i!==2);
  s=N.advance(s);
 }
 assert.equal(s.finished,false);
 assert.deepEqual(s.corrections,['intro-nu']);
 const original=structuredClone(s.records);
 assert.equal(N.taskAt(s).correction,true);
 s=N.answer(s,'nu',Date.UTC(2026,10,10));
 assert.equal(s.feedback.correct,true);
 s=N.advance(s);
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,15),original);
 assert.equal(N.summary(s).introduction.independentCorrect,4);
 assert.equal(N.summary(s).corrected,1);
});
test('revealing a word gets no credit, triggers correction, and preserves first evidence',()=>{
 let s=N.resume(N.initialState());
 for(let i=0;i<15;i++){
  const task=N.taskAt(s);
  if(task.mode==='introduction')s=N.beginRecall(s);
  s=i===13?N.reveal(s,Date.UTC(2026,10,10)):N.answer(s,task.answer,Date.UTC(2026,10,10));
  s=N.advance(s);
 }
 assert.deepEqual(s.corrections,['word-kinoko']);
 assert.equal(s.records[13].correct,null);
 assert.equal(s.records[13].assisted,true);
 const first=structuredClone(s.records);
 s=N.advance(N.answer(s,'kinoko',Date.UTC(2026,10,10)));
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,15),first);
 assert.equal(N.summary(s).decoding.independentCorrect,4);
});
test('pause and restore preserve answers and reject altered saved evidence',()=>{
 let s=N.resume(N.initialState());
 s=N.beginRecall(s);
 s=N.answer(s,'na',Date.UTC(2026,10,10));
 assert.equal(N.answer(s,'no'),s,'second response must not overwrite first attempt');
 s=N.pause(s);
 assert.equal(s.paused,true);
 s=N.resume(s);
 assert.equal(s.feedback.correct,true);
 assert.equal(N.validState(s),true);
 const altered=structuredClone(s);altered.records[0].submitted='nu';
 assert.equal(N.validState(altered),false);
 const wrong=structuredClone(s);wrong.records[0].correct=false;
 assert.equal(N.validState(wrong),false);
 assert.equal(N.normalize('ＮＵ'),'nu');
 assert.equal(N.normalize(' ki - no - ko '),'kinoko');
});
