import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

function complete(s=T.resume(T.initialState())){
 for(let i=0;i<T.TASKS.length;i++){
  const task=T.taskAt(s);
  if(task.mode==='introduction')s=T.beginRecall(s);
  s=T.answer(s,task.answer,Date.UTC(2026,10,10));
  assert.equal(s.feedback?.correct,true,'expected independent first answer '+task.id);
  s=T.advance(s);
 }
 return s;
}
test('Unit 04 teaches the five T-row kana and five authentic, decodable words',()=>{
 assert.deepEqual(T.KANA.map(x=>x.kana),['た','ち','つ','て','と']);
 assert.deepEqual(T.KANA.map(x=>x.reading),['ta','chi','tsu','te','to']);
 assert.deepEqual(T.WORDS.map(x=>x.kana),['たこ','ちかい','つき','すてき','とけい']);
 assert.deepEqual(T.WORDS.map(x=>x.reading),['tako','chikai','tsuki','suteki','tokei']);
 const known=new Set([...('あいうえお'),...K.KANA.map(x=>x.kana),...S.KANA.map(x=>x.kana),...T.KANA.map(x=>x.kana)]);
 for(const word of T.WORDS)assert([...word.kana].every(ch=>known.has(ch)),'unseen kana in '+word.kana);
 assert.equal(T.TASKS.length,15);
 for(const mode of ['introduction','recognition','decoding'])assert.equal(T.TASKS.filter(t=>t.mode===mode).length,5);
 assert.equal(new Set([K.STORAGE_KEY,S.STORAGE_KEY,T.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1']).size,4);
});
test('Unit 04 completes with fifteen independent first attempts and no false mastery claim',()=>{
 const done=complete();
 assert.equal(done.finished,true);
 assert.equal(done.records.length,15);
 assert.equal(done.corrections.length,0);
 assert.equal(T.validState(structuredClone(done)),true);
 for(const mode of ['introduction','recognition','decoding'])assert.deepEqual(T.summary(done)[mode],{total:5,completed:5,independentCorrect:5});
});
test('typed chi/tsu alternatives ti/tu are accepted, but recognition shows canonical readings',()=>{
 let s=T.resume(T.initialState());
 for(const reading of ['ta','TI','ＴＵ']){
  s=T.beginRecall(s);
  s=T.answer(s,reading,Date.UTC(2026,10,10));
  assert.equal(s.feedback?.correct,true);
  s=T.advance(s);
 }
 assert.deepEqual(s.records.map(x=>x.submitted),['ta','ti','tu']);
 assert.equal(s.records[1].correct,true);
 assert.equal(s.records[2].correct,true);
 assert.equal(T.validState(s),true);
 const chi=T.TASKS.find(t=>t.id==='recognition-chi');
 const tsu=T.TASKS.find(t=>t.id==='recognition-tsu');
 assert.equal(chi.answer,'chi');
 assert.equal(tsu.answer,'tsu');
 assert(chi.options.includes('chi')&&!chi.options.includes('ti'));
 assert(tsu.options.includes('tsu')&&!tsu.options.includes('tu'));
});
test('word decoding accepts systematic romaji only for the matching chi and tsu words',()=>{
 let s=T.resume(T.initialState());
 for(let i=0;i<11;i++){
  const task=T.taskAt(s);
  if(task.mode==='introduction')s=T.beginRecall(s);
  s=T.advance(T.answer(s,task.answer,Date.UTC(2026,10,10)));
 }
 assert.equal(T.taskAt(s).id,'word-chikai');
 s=T.answer(s,'TIKAI',Date.UTC(2026,10,10));
 assert.equal(s.feedback?.correct,true);
 s=T.advance(s);
 assert.equal(T.taskAt(s).id,'word-tsuki');
 s=T.answer(s,'TUKI',Date.UTC(2026,10,10));
 assert.equal(s.feedback?.correct,true);
 s=T.advance(s);
 assert.deepEqual(s.records.slice(11,13).map(r=>r.submitted),['tikai','tuki']);
 assert(T.validState(s));
});
test('mistakes and revealed answers trigger corrections without overwriting first answers',()=>{
 let s=T.resume(T.initialState());
 s=T.beginRecall(s);
 s=T.answer(s,'chi');
 assert.equal(s.feedback.correct,false);
 s=T.advance(s);
 for(let i=1;i<15;i++){
  const task=T.taskAt(s);
  if(task.mode==='introduction')s=T.beginRecall(s);
  s=T.advance(i===2?T.reveal(s):T.answer(s,task.answer));
 }
 assert.deepEqual(s.corrections,['intro-ta','intro-tsu']);
 assert.equal(s.records.length,15);
 const original=structuredClone(s.records);
 s=T.advance(T.answer(s,'ta'));
 s=T.advance(T.answer(s,'tu'));
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,15),original);
 assert.equal(s.records.at(-1).correct,true);
 assert.equal(T.summary(s).introduction.independentCorrect,3);
 assert.equal(T.summary(s).corrected,2);
});
test('Unit 04 pause/resume and corrupt persisted evidence are guarded',()=>{
 let s=T.resume(T.initialState());
 s=T.beginRecall(s);
 s=T.answer(s,'ta');
 s=T.pause(s);
 assert.equal(s.paused,true);
 assert.equal(T.answer(s,'chi'),s);
 s=T.resume(s);
 assert.equal(s.feedback.correct,true);
 const bad=structuredClone(s);
 bad.records[0].submitted='chi';
 assert.equal(T.validState(bad),false);
 const another=structuredClone(s);
 another.records[0].correct=false;
 assert.equal(T.validState(another),false);
 assert.equal(T.normalize('ＴＵ'),'tu');
 assert.equal(T.validState(s),true);
});
