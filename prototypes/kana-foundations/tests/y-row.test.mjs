import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from '../y-row-engine.mjs';
import * as M from '../m-row-engine.mjs';
import * as H from '../h-row-engine.mjs';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

const at=Date.UTC(2026,10,10);
function finishCorrect(s=Y.resume(Y.initialState())){
 for(let i=0;i<Y.TASKS.length;i++){
  const t=Y.taskAt(s);
  if(t.mode==='introduction')s=Y.beginRecall(s);
  s=Y.answer(s,t.answer,at);
  assert.equal(s.feedback?.correct,true,t.id);
  s=Y.advance(s);
 }
 return s;
}
test('Unit 08 correctly teaches only the three modern basic Y-row kana with absent yi/ye slots',()=>{
 assert.deepEqual(Y.KANA.map(x=>x.kana),['や','ゆ','よ']);
 assert.deepEqual(Y.KANA.map(x=>x.reading),['ya','yu','yo']);
 assert.match(Y.KANA.find(x=>x.id==='ya').note,/no ordinary yi/);
 assert.match(Y.KANA.find(x=>x.id==='yu').note,/no ordinary ye/);
 assert(Y.KANA.every(x=>x.note.length>80));
 assert.equal(Y.TASKS.length,11);
 assert.deepEqual(['introduction','recognition','decoding'].map(mode=>Y.TASKS.filter(t=>t.mode===mode).length),[3,3,5]);
 assert(Y.TASKS.filter(t=>t.mode==='recognition').every(t=>t.options.length===3));
});
test('five genuine Y-row words contain only already learned kana and no unrelated kana',()=>{
 assert.deepEqual(Y.WORDS.map(x=>[x.kana,x.reading,x.meaning]),[
  ['やま','yama','mountain'],['ゆき','yuki','snow'],['よこ','yoko','side; beside'],
  ['ゆめ','yume','dream'],['やさい','yasai','vegetables']
 ]);
 const known=new Set([...('あいうえお'),...K.KANA.map(x=>x.kana),...S.KANA.map(x=>x.kana),
  ...T.KANA.map(x=>x.kana),...N.KANA.map(x=>x.kana),...H.KANA.map(x=>x.kana),
  ...M.KANA.map(x=>x.kana),...Y.KANA.map(x=>x.kana)]);
 for(const word of Y.WORDS){
  assert([...word.kana].every(c=>known.has(c)),'unseen kana in '+word.kana);
  assert(word.kanji.length>0);
 }
 assert.equal(new Set([
  'thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,S.STORAGE_KEY,T.STORAGE_KEY,
  N.STORAGE_KEY,H.STORAGE_KEY,M.STORAGE_KEY,Y.STORAGE_KEY
 ]).size,8);
});
test('all-correct three-character lesson completes and records accurate denominators',()=>{
 const s=finishCorrect();
 assert.equal(s.finished,true);
 assert.equal(s.records.length,11);
 assert.equal(s.corrections.length,0);
 assert.equal(Y.validState(JSON.parse(JSON.stringify(s))),true);
 const sums=Y.summary(s);
 assert.deepEqual(sums.introduction,{total:3,completed:3,independentCorrect:3});
 assert.deepEqual(sums.recognition,{total:3,completed:3,independentCorrect:3});
 assert.deepEqual(sums.decoding,{total:5,completed:5,independentCorrect:5});
});
test('wrong and revealed first attempts trigger only their genuine correction tasks',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<Y.TASKS.length;i++){
  const t=Y.taskAt(s);
  if(t.mode==='introduction')s=Y.beginRecall(s);
  s=i===1?Y.answer(s,'yo',at):i===8?Y.reveal(s,at):Y.answer(s,t.answer,at);
  assert.equal(s.feedback.correct,i===1?false:i===8?null:true);
  s=Y.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-yu','word-yoko']);
 assert.equal(s.finished,false);
 const original=structuredClone(s.records);
 s=Y.advance(Y.answer(s,'yu',at));
 s=Y.advance(Y.answer(s,'yoko',at));
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,11),original);
 assert.equal(Y.summary(s).introduction.independentCorrect,2);
 assert.equal(Y.summary(s).decoding.independentCorrect,4);
 assert.equal(Y.summary(s).corrected,2);
});
test('pause/resume, answer reveal and forged saved evidence are safely handled',()=>{
 let s=Y.resume(Y.initialState());
 s=Y.beginRecall(s);
 s=Y.answer(s,'ya',at);
 assert.equal(Y.answer(s,'yu',at),s);
 s=Y.pause(s);
 assert.equal(Y.answer(s,'yo',at),s);
 s=Y.resume(s);
 assert.equal(Y.validState(s),true);
 const bad=structuredClone(s);
 bad.records[0].submitted='yo';
 assert.equal(Y.validState(bad),false);
 const duplicated=structuredClone(s);
 duplicated.records.push(structuredClone(duplicated.records[0]));
 assert.equal(Y.validState(duplicated),false);
 assert.equal(Y.normalize('ＹＡ'),'ya');
});
test('existing five-kana Unit 07 retains the original 15-task scoring contract',()=>{
 assert.equal(M.TASKS.length,15);
 let s=M.resume(M.initialState());
 for(const t of M.TASKS){
  if(t.mode==='introduction')s=M.beginRecall(s);
  s=M.advance(M.answer(s,t.answer,at));
 }
 assert.equal(s.finished,true);
 assert.deepEqual(M.summary(s).introduction,{total:5,completed:5,independentCorrect:5});
 assert.deepEqual(M.summary(s).decoding,{total:5,completed:5,independentCorrect:5});
});
