import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

function complete(s=S.resume(S.initialState())){
 for(let i=0;i<S.TASKS.length;i++){
  const t=S.taskAt(s);
  if(t.mode==='introduction')s=S.beginRecall(s);
  s=S.answer(s,t.answer,Date.UTC(2026,10,10));
  assert.equal(s.feedback.correct,true,'expected independent first answer '+t.id);
  s=S.advance(s);
 }
 return s;
}
test('Unit 03 teaches five S-row kana with five genuine, previously readable words',()=>{
 assert.deepEqual(S.KANA.map(x=>x.kana),['さ','し','す','せ','そ']);
 assert.deepEqual(S.KANA.map(x=>x.reading),['sa','shi','su','se','so']);
 assert.deepEqual(S.WORDS.map(x=>x.kana),['かさ','しお','すし','せかい','そこ']);
 assert.deepEqual(S.WORDS.map(x=>x.reading),['kasa','shio','sushi','sekai','soko']);
 assert.equal(S.TASKS.length,15);
 assert.equal(S.TASKS.filter(x=>x.mode==='introduction').length,5);
 assert.equal(S.TASKS.filter(x=>x.mode==='recognition').length,5);
 assert.equal(S.TASKS.filter(x=>x.mode==='decoding').length,5);
 assert.notEqual(S.STORAGE_KEY,K.STORAGE_KEY);
 assert.notEqual(S.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1');
});
test('correct S-row session finishes with untouched first-attempt evidence and no mastery grades',()=>{
 const result=complete();
 assert.equal(result.finished,true);
 assert.equal(result.records.length,15);
 assert.equal(result.corrections.length,0);
 assert.equal(S.validState(structuredClone(result)),true);
 for(const mode of ['introduction','recognition','decoding']){
  assert.deepEqual(S.summary(result)[mode],{total:5,completed:5,independentCorrect:5});
 }
});
test('shi is the displayed Hepburn form; si is an accepted typed Kunrei form only',()=>{
 let s=S.resume(S.initialState());
 for(let i=0;i<2;i++){
  s=S.beginRecall(s);
  s=S.answer(s,i===1?'SI':'sa');
  assert.equal(s.feedback.correct,true);
  if(i===1){
   assert.equal(s.feedback.submitted,'si');
   assert.equal(s.feedback.answer,'shi');
  }
  s=S.advance(s);
 }
 assert.equal(S.validState(structuredClone(s)),true);
 const shi=S.TASKS.find(x=>x.id==='recognition-shi');
 assert(shi.options.includes('shi'));
 assert(!shi.options.includes('si'),'choice answer is canonical Hepburn spelling');
});
test('Kunrei-shiki s-row word spellings are accepted only as independent typed alternatives',()=>{
 let s=S.resume(S.initialState());
 for(let i=0;i<11;i++){
  let t=S.taskAt(s);
  if(t.mode==='introduction')s=S.beginRecall(s);
  s=S.advance(S.answer(s,t.answer));
 }
 // word 1 is かさ; word 2 is しお, whose spelling sio is permitted
 const next=S.taskAt(s);
 assert.equal(next.id,'word-shio');
 s=S.answer(s,'ＳＩＯ');
 assert.equal(s.feedback.correct,true);
 assert.equal(s.feedback.submitted,'sio');
 assert(S.validState(s));
});
test('wrong first responses and explicit reveals add one correction without overwriting first records',()=>{
 let s=S.resume(S.initialState());
 s=S.beginRecall(s);s=S.answer(s,'shi');
 assert.equal(s.feedback.correct,false);
 s=S.advance(s);
 for(let i=1;i<15;i++){
  const t=S.taskAt(s);
  if(t.mode==='introduction')s=S.beginRecall(s);
  s=S.advance(i===2?S.reveal(s):S.answer(s,t.answer));
 }
 assert.deepEqual(s.corrections,['intro-sa','intro-su']);
 assert.equal(s.records.length,15);
 const first=structuredClone(s.records);
 for(const answer of ['sa','su']){
  s=S.advance(S.answer(s,answer));
 }
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,15),first);
 assert.equal(s.records[0].correct,false);
 assert.equal(s.records[2].correct,null);
 assert.equal(S.summary(s).correctionCount,2);
 assert.equal(S.summary(s).introduction.independentCorrect,3);
});
test('corrupted S-row saved state cannot turn an incorrect or absent answer into success',()=>{
 const good=complete();
 const falsified=structuredClone(good);
 falsified.records[0].submitted='shi';
 assert.equal(S.validState(falsified),false);
 const badCorrect=structuredClone(good);
 badCorrect.records[0].correct=false;
 assert.equal(S.validState(badCorrect),false);
 assert(S.validState(S.initialState()));
});
