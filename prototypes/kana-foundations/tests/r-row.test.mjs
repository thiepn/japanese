import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../r-row-engine.mjs';
import * as Y from '../y-row-engine.mjs';
import * as M from '../m-row-engine.mjs';
import * as H from '../h-row-engine.mjs';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

const at=Date.UTC(2026,10,10);
function finishCorrect(state=R.resume(R.initialState())){
 for(let i=0;i<R.TASKS.length;i++){
  const task=R.taskAt(state);
  if(task.mode==='introduction')state=R.beginRecall(state);
  state=R.answer(state,task.answer,at);
  assert.equal(state.feedback?.correct,true,'first answer: '+task.id);
  state=R.advance(state);
 }
 return state;
}
test('Unit 09 teaches exactly the five R-row kana, tapped r, and meaningful shape contrasts',()=>{
 assert.deepEqual(R.KANA.map(k=>k.kana),['ら','り','る','れ','ろ']);
 assert.deepEqual(R.KANA.map(k=>k.reading),['ra','ri','ru','re','ro']);
 assert(R.KANA.every(k=>k.note.length>75));
 assert.match(R.KANA[0].note,/tongue tap/);
 assert.match(R.KANA[2].note,/ろ/);
 assert.match(R.KANA[4].note,/る/);
 assert.deepEqual(['introduction','recognition','decoding'].map(mode=>R.TASKS.filter(t=>t.mode===mode).length),[5,5,5]);
 assert(R.TASKS.filter(t=>t.mode==='recognition').every(t=>t.options.length===5));
});
test('five authentic R-row words contain only characters from Units 01–09',()=>{
 assert.deepEqual(R.WORDS.map(w=>[w.kana,w.reading,w.meaning]),[
  ['らく','raku','ease; comfort'],
  ['りかい','rikai','understanding; comprehension'],
  ['るす','rusu','absence from home; being out'],
  ['れきし','rekishi','history'],
  ['ろく','roku','six']
 ]);
 const known=new Set([...('あいうえお'),...K.KANA.map(k=>k.kana),...S.KANA.map(k=>k.kana),
  ...T.KANA.map(k=>k.kana),...N.KANA.map(k=>k.kana),...H.KANA.map(k=>k.kana),
  ...M.KANA.map(k=>k.kana),...Y.KANA.map(k=>k.kana),...R.KANA.map(k=>k.kana)]);
 for(const word of R.WORDS){
  assert([...word.kana].every(char=>known.has(char)),'unseen kana '+word.kana);
  assert(word.kanji.length>0);
 }
 const keys=['thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,S.STORAGE_KEY,T.STORAGE_KEY,
  N.STORAGE_KEY,H.STORAGE_KEY,M.STORAGE_KEY,Y.STORAGE_KEY,R.STORAGE_KEY];
 assert.equal(new Set(keys).size,9);
});
test('15 correct first responses complete Unit 09 with correct independent scoring',()=>{
 const done=finishCorrect();
 assert.equal(done.finished,true);
 assert.equal(done.records.length,15);
 assert.equal(done.corrections.length,0);
 assert(R.validState(JSON.parse(JSON.stringify(done))));
 for(const mode of ['introduction','recognition','decoding'])
  assert.deepEqual(R.summary(done)[mode],{total:5,completed:5,independentCorrect:5});
});
test('歴史 can be typed rekishi or Kunrei-style rekisi, but not unrelated spellings',()=>{
 assert.deepEqual(R.WORDS.find(w=>w.id==='rekishi').aliases,['rekisi']);
 let state=R.resume(R.initialState());
 for(let i=0;i<13;i++){
  const task=R.taskAt(state);
  if(task.mode==='introduction')state=R.beginRecall(state);
  state=R.advance(R.answer(state,task.answer,at));
 }
 assert.equal(R.taskAt(state).id,'word-rekishi');
 state=R.answer(state,'ＲＥＫＩＳＩ',at);
 assert.equal(state.feedback?.correct,true);
 assert.equal(state.records.at(-1).submitted,'rekisi');
 assert(R.validState(state));
 const corrupted=structuredClone(state);
 corrupted.records.at(-1).submitted='rekisu';
 assert.equal(R.validState(corrupted),false);
});
test('wrong る and revealed れきし schedule correction without overwriting first attempts',()=>{
 let state=R.resume(R.initialState());
 for(let i=0;i<R.TASKS.length;i++){
  const t=R.taskAt(state);
  if(t.mode==='introduction')state=R.beginRecall(state);
  state=i===2?R.answer(state,'ro',at):i===13?R.reveal(state,at):R.answer(state,t.answer,at);
  state=R.advance(state);
 }
 assert.equal(state.finished,false);
 assert.deepEqual(state.corrections,['intro-ru','word-rekishi']);
 assert.equal(state.records[2].correct,false);
 assert.equal(state.records[13].correct,null);
 assert.equal(state.records[13].assisted,true);
 const first=structuredClone(state.records);
 state=R.advance(R.answer(state,'ru',at));
 state=R.advance(R.answer(state,'rekisi',at));
 assert.equal(state.finished,true);
 assert.deepEqual(state.records.slice(0,15),first);
 assert.equal(R.summary(state).corrected,2);
 assert.equal(R.summary(state).introduction.independentCorrect,4);
 assert.equal(R.summary(state).decoding.independentCorrect,4);
});
test('Unit 09 pause/resume, duplicate answer and invalid data are guarded',()=>{
 let state=R.resume(R.initialState());
 state=R.beginRecall(state);
 state=R.answer(state,'ra',at);
 assert.equal(R.answer(state,'ro',at),state);
 state=R.pause(state);
 assert.equal(R.answer(state,'ri',at),state);
 state=R.resume(state);
 assert(R.validState(state));
 const wrong=structuredClone(state);
 wrong.records[0].submitted='ro';
 assert.equal(R.validState(wrong),false);
 const duplicate=structuredClone(state);
 duplicate.records.push(structuredClone(duplicate.records[0]));
 assert.equal(R.validState(duplicate),false);
 assert.equal(R.normalize('ＲＥＫＩＳＩ'),'rekisi');
});
