import test from 'node:test';
import assert from 'node:assert/strict';
import * as Review from '../reading-review-engine.mjs';
import * as W from '../w-row-engine.mjs';
import * as R from '../r-row-engine.mjs';
import * as Y from '../y-row-engine.mjs';
import * as M from '../m-row-engine.mjs';
import * as H from '../h-row-engine.mjs';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

const at=Date.UTC(2026,10,11);
function complete(s=Review.resume(Review.initialState())){
 for(const task of Review.TASKS){
  assert.equal(Review.taskAt(s).id,task.id);
  s=Review.answer(s,task.answer,at);
  assert.equal(s.feedback?.correct,true,'answer to '+task.id);
  assert(Review.validState(s),'valid feedback: '+task.id);
  s=Review.advance(s);
  assert(Review.validState(s),'valid saved state: '+task.id);
 }
 return s;
}
test('Unit 11 offers 17 cumulative tasks with distinct word, particle, sentence and meaning phases',()=>{
 assert.equal(Review.TASKS.length,17);
 assert.deepEqual(Review.MODES.map(x=>[x.id,x.total]),[
  ['word',5],['particle',4],['sentence',4],['meaning',4]
 ]);
 assert.deepEqual(Review.MODES.map(x=>Review.TASKS.filter(t=>t.mode===x.id).length),[5,4,4,4]);
 assert.equal(Review.TASKS[5].mode,'particle');
 assert.equal(Review.TASKS[9].mode,'sentence');
 assert.equal(Review.TASKS[13].mode,'meaning');
 assert.equal(new Set(Review.TASKS.map(t=>t.id)).size,17);
});
test('all Japanese prompts use exclusively basic kana learned in Units 01–10',()=>{
 const learned=new Set([...('あいうえお'),...K.KANA.map(k=>k.kana),...S.KANA.map(k=>k.kana),...T.KANA.map(k=>k.kana),
  ...N.KANA.map(k=>k.kana),...H.KANA.map(k=>k.kana),...M.KANA.map(k=>k.kana),
  ...Y.KANA.map(k=>k.kana),...R.KANA.map(k=>k.kana),...W.KANA.map(k=>k.kana)]);
 assert.equal(learned.size,46);
 assert.equal(new Set(Review.KNOWN_KANA).size,46);
 assert.deepEqual([...Review.KNOWN_KANA].sort(),[...learned].sort());
 for(const task of Review.TASKS)
  assert([...task.kana].every(k=>learned.has(k)||' □'.includes(k)),'unlearned kana: '+task.id+' '+task.kana);
});
test('five real words and sentences have meaningful, non-invented readings and meanings',()=>{
 assert.deepEqual(Review.WORDS.map(w=>[w.kana,w.reading,w.meaning]),[
  ['さかな','sakana','fish'],['ねる','neru','to sleep'],['はしる','hashiru','to run'],
  ['むく','muku','to peel'],['おもしろい','omoshiroi','interesting']
 ]);
 assert.deepEqual(Review.SENTENCES.map(x=>[x.kana,x.reading,x.meaning]),[
  ['わたしはほんをよむ','watashiwahonoyomu','I read a book.'],
  ['ねこはねる','nekowaneru','The cat sleeps.'],
  ['やまはたかい','yamawatakai','The mountain is high.'],
  ['せんせいはほんをよむ','senseiwahonoyomu','The teacher reads a book.']
 ]);
 assert(Review.COMPREHENSION.every(x=>x.choices.length===3));
 assert(Review.COMPREHENSION.every(x=>x.choices.some(c=>c[0]===x.answer)));
});
test('particle choices require topic wa and object o, not the letter-by-letter ha reading',()=>{
 assert.deepEqual(Review.PARTICLES.map(x=>x.answer),['wa','o','wa','o']);
 for(const item of Review.PARTICLES){
  assert(item.note.includes('は')||item.note.includes('を'));
  const task=Review.TASKS.find(x=>x.id==='particle-'+item.id);
  assert.deepEqual(task.choices.map(x=>x.value),['wa','o']);
 }
 let s=Review.resume(Review.initialState());
 for(let i=0;i<5;i++)s=Review.advance(Review.answer(s,Review.taskAt(s).answer,at));
 assert.equal(Review.taskAt(s).mode,'particle');
 assert.equal(Review.answer(s,'ha',at),s,'ha cannot stand for topic particle wa');
 s=Review.answer(s,'wa',at);
 assert.equal(s.feedback.correct,true);
});
test('all 17 independent first answers complete with accurate per-phase denominators',()=>{
 const done=complete();
 assert(done.finished);
 assert.equal(done.records.length,17);
 assert.equal(done.corrections.length,0);
 assert(Review.validState(JSON.parse(JSON.stringify(done))));
 for(const {id,total} of Review.MODES)
  assert.deepEqual(Review.summary(done)[id],{total,completed:total,independentCorrect:total});
});
test('typed romanization spaces, shi/si and object-particle o/wo variants remain accurate',()=>{
 const word=Review.TASKS.find(t=>t.id==='word-hashiru');
 const adjective=Review.TASKS.find(t=>t.id==='word-omoshiroi');
 const sentence=Review.TASKS.find(t=>t.id==='sentence-watashi-hon');
 assert(word.aliases.includes('hasiru'));
 assert(adjective.aliases.includes('omosiroi'));
 assert.deepEqual(sentence.aliases.sort(),[
  'watasiwahonoyomu','watasiwahonwoyomu','watashiwahonwoyomu'
 ].sort());
 let s=Review.resume(Review.initialState());
 for(let i=0;i<Review.TASKS.length;i++){
  const task=Review.taskAt(s);
  const actual=task.id==='word-hashiru'?'ＨＡＳＩＲＵ':
   task.id==='word-omoshiroi'?'omosiroi':
   task.id==='sentence-watashi-hon'?'watasi wa hon wo yomu':task.answer;
  s=Review.answer(s,actual,at);
  assert.equal(s.feedback.correct,true,task.id);
  s=Review.advance(s);
 }
 assert(s.finished);
 assert.equal(s.records[2].submitted,'hasiru');
 assert.equal(s.records[4].submitted,'omosiroi');
 assert.equal(s.records[9].submitted,'watasiwahonwoyomu');
});
test('wrong word, revealed particle and wrong sentence preserve their first evidence through corrections',()=>{
 let s=Review.resume(Review.initialState());
 for(let i=0;i<Review.TASKS.length;i++){
  const task=Review.taskAt(s);
  s=i===0?Review.answer(s,'sakano',at):i===6?Review.reveal(s,at):
   i===10?Review.answer(s,'nekowamiru',at):Review.answer(s,task.answer,at);
  s=Review.advance(s);
 }
 assert.equal(s.finished,false);
 assert.deepEqual(s.corrections,['word-sakana','particle-object-hon','sentence-neko-neru']);
 assert.equal(s.records[0].correct,false);
 assert.equal(s.records[6].correct,null);
 assert.equal(s.records[6].assisted,true);
 assert.equal(s.records[10].correct,false);
 const first=structuredClone(s.records);
 for(const correction of ['sakana','o','nekowaneru']){
  s=Review.answer(s,correction,at);
  assert.equal(s.feedback.correct,true);
  s=Review.advance(s);
 }
 assert(s.finished);
 assert.equal(s.records.length,20);
 assert.deepEqual(s.records.slice(0,17),first);
 const totals=Review.summary(s);
 assert.equal(totals.word.independentCorrect,4);
 assert.equal(totals.particle.independentCorrect,3);
 assert.equal(totals.sentence.independentCorrect,3);
 assert.equal(totals.meaning.independentCorrect,4);
 assert.equal(totals.corrected,3);
});
test('pausing, duplicate answers, forged records and mismatched feedback cannot mutate saved first attempts',()=>{
 let s=Review.resume(Review.initialState());
 s=Review.answer(s,'sakana',at);
 assert.equal(Review.answer(s,'sakano',at),s);
 s=Review.pause(s);
 assert.equal(Review.answer(s,'neru',at),s);
 s=Review.resume(s);
 assert(Review.validState(s));
 const tampered=structuredClone(s);tampered.records[0].submitted='sakano';
 assert.equal(Review.validState(tampered),false);
 const wrongFeedback=structuredClone(s);wrongFeedback.feedback.answer='neru';
 assert.equal(Review.validState(wrongFeedback),false);
 const duplicated=structuredClone(s);duplicated.records.push(structuredClone(duplicated.records[0]));
 assert.equal(Review.validState(duplicated),false);
 const forgedIndex=structuredClone(s);forgedIndex.index=3;
 assert.equal(Review.validState(forgedIndex),false);
});
test('Unit 11 has a unique storage key and does not modify previous 10 unit engines',()=>{
 const keys=['thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,S.STORAGE_KEY,
  T.STORAGE_KEY,N.STORAGE_KEY,H.STORAGE_KEY,M.STORAGE_KEY,Y.STORAGE_KEY,
  R.STORAGE_KEY,W.STORAGE_KEY,Review.STORAGE_KEY];
 assert.equal(new Set(keys).size,11);
 assert.equal(W.TASKS.length,12);
 assert.equal(W.summary(W.initialState()).decoding.total,6);
 assert.equal(R.TASKS.length,15);
 assert.equal(Y.TASKS.length,11);
});
