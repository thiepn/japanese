import test from 'node:test';
import assert from 'node:assert/strict';
import * as H from '../h-row-engine.mjs';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

const when=Date.UTC(2026,10,10);
function complete(state=H.resume(H.initialState())){
 for(let i=0;i<15;i++){
  const task=H.taskAt(state);
  if(task.mode==='introduction')state=H.beginRecall(state);
  state=H.answer(state,task.answer,when);
  assert.equal(state.feedback?.correct,true,'failed first answer '+task.id);
  state=H.advance(state);
 }
 return state;
}
test('Unit 06 teaches five H-row kana and the real fu/hu and ha/ho contrasts',()=>{
 assert.deepEqual(H.KANA.map(x=>x.kana),['は','ひ','ふ','へ','ほ']);
 assert.deepEqual(H.KANA.map(x=>x.reading),['ha','hi','fu','he','ho']);
 assert.deepEqual(H.KANA.find(x=>x.id==='fu').aliases,['hu']);
 assert.match(H.KANA.find(x=>x.id==='fu').note,/teeth|lips/i);
 assert.match(H.KANA.find(x=>x.id==='ho').note,/は/);
 assert.match(H.KANA.find(x=>x.id==='ha').note,/particle/i);
 assert.match(H.KANA.find(x=>x.id==='he').note,/particle/i);
 assert.equal(H.TASKS.length,15);
 for(const mode of ['introduction','recognition','decoding'])
  assert.equal(H.TASKS.filter(x=>x.mode===mode).length,5);
});
test('five meaningful words are readable using only Units 01–06 and use distinct saved progress',()=>{
 assert.deepEqual(H.WORDS.map(x=>[x.kana,x.reading,x.meaning]),[
  ['はこ','hako','box'],['ひと','hito','person'],
  ['ふね','fune','boat; ship'],['へた','heta','unskilled; not good at something'],
  ['ほし','hoshi','star']
 ]);
 const learned=new Set([...('あいうえお'),...K.KANA.map(x=>x.kana),...S.KANA.map(x=>x.kana),
  ...T.KANA.map(x=>x.kana),...N.KANA.map(x=>x.kana),...H.KANA.map(x=>x.kana)]);
 for(const word of H.WORDS){
  assert([...word.kana].every(x=>learned.has(x)),'unseen character in '+word.kana);
  assert(word.kanji.length>0);
 }
 assert.equal(new Set(['thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,
  S.STORAGE_KEY,T.STORAGE_KEY,N.STORAGE_KEY,H.STORAGE_KEY]).size,6);
});
test('all-correct Unit 06 finishes with independent first responses and no corrections',()=>{
 const done=complete();
 assert.equal(done.finished,true);
 assert.equal(done.records.length,15);
 assert.equal(done.corrections.length,0);
 assert.equal(H.validState(JSON.parse(JSON.stringify(done))),true);
 for(const mode of ['introduction','recognition','decoding'])
  assert.deepEqual(H.summary(done)[mode],{total:5,completed:5,independentCorrect:5});
});
test('typed hu, full-width HU and hune are correct; choice buttons show only canonical fu',()=>{
 let state=H.resume(H.initialState());
 for(const reading of ['ha','hi','ＨＵ']){
  state=H.beginRecall(state);
  state=H.answer(state,reading,when);
  assert.equal(state.feedback?.correct,true);
  state=H.advance(state);
 }
 assert.equal(state.records[2].submitted,'hu');
 assert.equal(H.validState(state),true);
 const recognition=H.TASKS.find(x=>x.id==='recognition-fu');
 assert.equal(recognition.answer,'fu');
 assert(recognition.options.includes('fu'));
 assert(!recognition.options.includes('hu'));
 for(let i=3;i<12;i++){
  const task=H.taskAt(state);
  if(task.mode==='introduction')state=H.beginRecall(state);
  state=H.advance(H.answer(state,task.answer,when));
 }
 assert.equal(H.taskAt(state).id,'word-fune');
 state=H.answer(state,'HUNE',when);
 assert.equal(state.feedback.correct,true);
 assert.equal(state.feedback.answer,'fune');
 assert.equal(state.feedback.submitted,'hune');
 assert(H.validState(state));
});
test('mistaken ha/ho and revealed he trigger corrections without changing first evidence',()=>{
 let state=H.resume(H.initialState());
 for(let i=0;i<15;i++){
  const task=H.taskAt(state);
  if(task.mode==='introduction')state=H.beginRecall(state);
  state=i===0?H.answer(state,'ho',when):i===3?H.reveal(state,when):H.answer(state,task.answer,when);
  state=H.advance(state);
 }
 assert.deepEqual(state.corrections,['intro-ha','intro-he']);
 assert.equal(state.finished,false);
 assert.equal(state.records[0].correct,false);
 assert.equal(state.records[3].correct,null);
 const first=structuredClone(state.records);
 state=H.advance(H.answer(state,'ha',when));
 state=H.advance(H.answer(state,'he',when));
 assert.equal(state.finished,true);
 assert.deepEqual(state.records.slice(0,15),first);
 assert.equal(H.summary(state).corrected,2);
 assert.equal(H.summary(state).introduction.independentCorrect,3);
});
test('pause, recovery and saved-answer validation preserve learner evidence',()=>{
 let state=H.resume(H.initialState());
 state=H.beginRecall(state);
 state=H.answer(state,'ha',when);
 assert.equal(H.answer(state,'ho'),state,'double-submit cannot change answer');
 state=H.pause(state);
 assert.equal(H.answer(state,'hi'),state,'paused lesson cannot accept answers');
 state=H.resume(state);
 assert.equal(state.feedback.correct,true);
 assert.equal(H.validState(state),true);
 const corrupt=structuredClone(state);
 corrupt.records[0].submitted='ho';
 assert.equal(H.validState(corrupt),false);
 const wrong=structuredClone(state);
 wrong.records[0].correct=false;
 assert.equal(H.validState(wrong),false);
 assert.equal(H.normalize('ＨＵ'),'hu');
 assert.equal(H.normalize(' fu - ne '),'fune');
});
