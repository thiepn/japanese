import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../m-row-engine.mjs';
import * as H from '../h-row-engine.mjs';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

const when=Date.UTC(2026,10,10);
function allCorrect(s=M.resume(M.initialState())){
 for(let i=0;i<M.TASKS.length;i++){
  const task=M.taskAt(s);
  if(task.mode==='introduction')s=M.beginRecall(s);
  s=M.answer(s,task.answer,when);
  assert.equal(s.feedback?.correct,true,'independent correct response for '+task.id);
  s=M.advance(s);
 }
 return s;
}
test('Unit 07 contains M-row kana and useful, distinct shape and sound instruction',()=>{
 assert.deepEqual(M.KANA.map(x=>x.kana),['ま','み','む','め','も']);
 assert.deepEqual(M.KANA.map(x=>x.reading),['ma','mi','mu','me','mo']);
 assert(M.KANA.every(x=>x.note.length>60));
 assert.match(M.KANA.find(x=>x.id==='mu').note,/ぬ/);
 assert.match(M.KANA.find(x=>x.id==='me').note,/ぬ/);
 assert.equal(M.TASKS.length,15);
 for(const mode of ['introduction','recognition','decoding'])
  assert.equal(M.TASKS.filter(x=>x.mode===mode).length,5);
});
test('Unit 07 uses five genuine decodable words and an independent storage key',()=>{
 assert.deepEqual(M.WORDS.map(x=>[x.kana,x.reading,x.meaning]),[
  ['まめ','mame','bean; beans'],['みみ','mimi','ear'],
  ['むし','mushi','insect; bug'],['めし','meshi','cooked rice; meal (informal word)'],
  ['もも','momo','peach']
 ]);
 const known=new Set([...('あいうえお'),...K.KANA.map(x=>x.kana),...S.KANA.map(x=>x.kana),
  ...T.KANA.map(x=>x.kana),...N.KANA.map(x=>x.kana),...H.KANA.map(x=>x.kana),
  ...M.KANA.map(x=>x.kana)]);
 for(const word of M.WORDS){
  assert([...word.kana].every(ch=>known.has(ch)),'unseen kana in '+word.kana);
  assert(word.kanji.length>0);
 }
 const keys=['thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,S.STORAGE_KEY,
  T.STORAGE_KEY,N.STORAGE_KEY,H.STORAGE_KEY,M.STORAGE_KEY];
 assert.equal(new Set(keys).size,7);
});
test('Unit 07 all-correct lesson finishes with independent first answers and persisted valid evidence',()=>{
 const done=allCorrect();
 assert.equal(done.finished,true);
 assert.equal(done.records.length,15);
 assert.equal(done.corrections.length,0);
 assert(M.validState(JSON.parse(JSON.stringify(done))));
 for(const mode of ['introduction','recognition','decoding'])
  assert.deepEqual(M.summary(done)[mode],{total:5,completed:5,independentCorrect:5});
});
test('previously taught shi/si alternatives are accepted only for relevant typed words',()=>{
 assert.deepEqual(M.WORDS.find(x=>x.id==='mushi').aliases,['musi']);
 assert.deepEqual(M.WORDS.find(x=>x.id==='meshi').aliases,['mesi']);
 let s=M.resume(M.initialState());
 for(let i=0;i<12;i++){
  const t=M.taskAt(s);
  if(t.mode==='introduction')s=M.beginRecall(s);
  s=M.advance(M.answer(s,t.answer,when));
 }
 assert.equal(M.taskAt(s).id,'word-mushi');
 s=M.answer(s,'ＭＵＳＩ',when);
 assert.equal(s.feedback.correct,true);
 assert.equal(s.feedback.answer,'mushi');
 s=M.advance(s);
 assert.equal(M.taskAt(s).id,'word-meshi');
 s=M.answer(s,'MESI',when);
 assert.equal(s.feedback.correct,true);
 assert.equal(s.feedback.answer,'meshi');
 assert.equal(M.validState(s),true);
 assert.deepEqual(s.records.slice(-2).map(x=>x.submitted),['musi','mesi']);
 const invalid=structuredClone(s);
 invalid.records.at(-1).submitted='mesu';
 assert.equal(M.validState(invalid),false);
});
test('wrong ま and revealed む are corrected without rewriting first evidence',()=>{
 let s=M.resume(M.initialState());
 for(let i=0;i<15;i++){
  const task=M.taskAt(s);
  if(task.mode==='introduction')s=M.beginRecall(s);
  s=i===0?M.answer(s,'mo',when):i===2?M.reveal(s,when):M.answer(s,task.answer,when);
  s=M.advance(s);
 }
 assert.equal(s.finished,false);
 assert.deepEqual(s.corrections,['intro-ma','intro-mu']);
 assert.equal(s.records[0].correct,false);
 assert.equal(s.records[2].correct,null);
 assert.equal(s.records[2].assisted,true);
 const first=structuredClone(s.records);
 s=M.advance(M.answer(s,'ma',when));
 s=M.advance(M.answer(s,'mu',when));
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,15),first);
 assert.equal(M.summary(s).corrected,2);
 assert.equal(M.summary(s).introduction.independentCorrect,3);
});
test('pause/resume, duplicate-answer and invalid saved records preserve Unit 07 evidence',()=>{
 let s=M.resume(M.initialState());
 s=M.beginRecall(s);
 s=M.answer(s,'ma',when);
 assert.equal(M.answer(s,'mo',when),s);
 s=M.pause(s);
 assert.equal(M.answer(s,'mi',when),s);
 s=M.resume(s);
 assert.equal(s.feedback.correct,true);
 assert.equal(M.validState(s),true);
 const wrong=structuredClone(s);
 wrong.records[0].submitted='mo';
 assert.equal(M.validState(wrong),false);
 const duplicate=structuredClone(s);
 duplicate.records.push(structuredClone(duplicate.records[0]));
 assert.equal(M.validState(duplicate),false);
 assert.equal(M.normalize('ＭＡ'),'ma');
 assert.equal(M.normalize(' mu - shi '),'mushi');
});
