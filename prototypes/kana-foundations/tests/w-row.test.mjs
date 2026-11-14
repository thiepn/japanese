import test from 'node:test';
import assert from 'node:assert/strict';
import * as W from '../w-row-engine.mjs';
import * as R from '../r-row-engine.mjs';
import * as Y from '../y-row-engine.mjs';
import * as M from '../m-row-engine.mjs';
import * as H from '../h-row-engine.mjs';
import * as N from '../n-row-engine.mjs';
import * as T from '../t-row-engine.mjs';
import * as S from '../s-row-engine.mjs';
import * as K from '../k-row-engine.mjs';

const at=Date.UTC(2026,10,10);
function allCorrect(s=W.resume(W.initialState())){
 for(let i=0;i<W.TASKS.length;i++){
  const t=W.taskAt(s);
  if(t.mode==='introduction')s=W.beginRecall(s);
  s=W.answer(s,t.answer,at);
  assert.equal(s.feedback?.correct,true,t.id);
  s=W.advance(s);
 }
 return s;
}
test('Unit 10 has three meaningful kana lessons: wa, object-particle o, moraic nasal n',()=>{
 assert.deepEqual(W.KANA.map(k=>k.kana),['わ','を','ん']);
 assert.deepEqual(W.KANA.map(k=>k.reading),['wa','o','n']);
 assert.deepEqual(W.KANA.find(k=>k.id==='wo').aliases,['wo']);
 assert.match(W.KANA.find(k=>k.id==='wo').note,/object|direct object/i);
 assert.match(W.KANA.find(k=>k.id==='wo').note,/pronounced o/);
 assert.match(W.KANA.find(k=>k.id==='n').note,/moraic nasal/);
 assert(W.KANA.every(k=>k.note.length>90));
 assert.deepEqual(['introduction','recognition','decoding'].map(m=>W.TASKS.filter(t=>t.mode===m).length),[3,3,6]);
 assert(W.TASKS.filter(t=>t.mode==='recognition').every(t=>t.options.length===3));
 assert.deepEqual(W.TASKS.find(t=>t.id==='recognition-wo').options,['o','n','wa']);
});
test('five real words and one natural object-marked phrase use only kana taught in Units 01–10',()=>{
 assert.deepEqual(W.WORDS.map(w=>[w.kana,w.reading,w.meaning]),[
  ['わに','wani','crocodile; alligator'],['ほん','hon','book'],
  ['みかん','mikan','mandarin orange'],['せんせい','sensei','teacher'],
  ['わかる','wakaru','to understand']
 ]);
 assert.deepEqual(W.PHRASES.map(p=>[p.kana,p.reading,p.meaning]),[['ほんをよむ','honoyomu','read a book']]);
 assert.deepEqual(W.PHRASES[0].aliases,['honwoyomu']);
 assert.match(W.PHRASES[0].note,/object marker/);
 const known=new Set([...('あいうえお'),...K.KANA.map(x=>x.kana),...S.KANA.map(x=>x.kana),
  ...T.KANA.map(x=>x.kana),...N.KANA.map(x=>x.kana),...H.KANA.map(x=>x.kana),
  ...M.KANA.map(x=>x.kana),...Y.KANA.map(x=>x.kana),...R.KANA.map(x=>x.kana),...W.KANA.map(x=>x.kana)]);
 for(const word of [...W.WORDS,...W.PHRASES]){
  assert([...word.kana].every(k=>known.has(k)),'unseen kana in '+word.kana);
  assert(word.kanji.length>0);
 }
 const keys=['thiepn:kana-foundations:prototype-only:v1',K.STORAGE_KEY,S.STORAGE_KEY,T.STORAGE_KEY,N.STORAGE_KEY,H.STORAGE_KEY,M.STORAGE_KEY,Y.STORAGE_KEY,R.STORAGE_KEY,W.STORAGE_KEY];
 assert.equal(new Set(keys).size,10,'Unit 10 cannot rewrite prior unit storage');
 assert.equal(W.TASKS.find(t=>t.kind==='phrase').mode,'decoding');
});
test('Unit 10 completes 12 prompts (3+3+5+1) with correct evidence totals',()=>{
 const s=allCorrect();
 assert.equal(s.finished,true);
 assert.equal(s.records.length,12);
 assert.equal(s.corrections.length,0);
 assert(W.validState(JSON.parse(JSON.stringify(s))));
 assert.deepEqual(W.summary(s).introduction,{total:3,completed:3,independentCorrect:3});
 assert.deepEqual(W.summary(s).recognition,{total:3,completed:3,independentCorrect:3});
 assert.deepEqual(W.summary(s).decoding,{total:6,completed:6,independentCorrect:6});
});
test('wo is accepted only as a typed variant of を and the particle sounds o in the phrase',()=>{
 let s=W.resume(W.initialState());
 s=W.beginRecall(s);
 s=W.advance(W.answer(s,'wa',at));
 s=W.beginRecall(s);
 s=W.answer(s,'ＷＯ',at);
 assert.equal(s.feedback.correct,true);
 assert.equal(s.feedback.answer,'o');
 assert.equal(s.records[1].submitted,'wo');
 assert(W.validState(s));
 s=W.advance(s);
 for(let i=2;i<11;i++){
  const task=W.taskAt(s);
  if(task.mode==='introduction')s=W.beginRecall(s);
  s=W.advance(W.answer(s,task.answer,at));
 }
 assert.equal(W.taskAt(s).kind,'phrase');
 s=W.answer(s,'hon o yomu',at);
 assert.equal(s.feedback.correct,true);
 assert.equal(s.records[11].submitted,'honoyomu');
 assert(W.validState(s));
 assert.equal(W.answer(s,'honwoyomu'),s,'cannot replace first response');
 const phraseOnly=W.TASKS.find(t=>t.kind==='phrase');
 assert.equal(phraseOnly.answer,'honoyomu');
 assert(phraseOnly.aliases.includes('honwoyomu'));
});
test('wrong ん, revealed word and wrong phrase remain uncredited until separate correction',()=>{
 let s=W.resume(W.initialState());
 for(let i=0;i<12;i++){
  const t=W.taskAt(s);
  if(t.mode==='introduction')s=W.beginRecall(s);
  s=i===2?W.answer(s,'nu',at):i===7?W.reveal(s,at):i===11?W.answer(s,'honoyomi',at):W.answer(s,t.answer,at);
  s=W.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-n','word-hon','phrase-hon-o-yomu']);
 assert.equal(s.finished,false);
 assert.equal(s.records[2].correct,false);
 assert.equal(s.records[7].correct,null);
 assert.equal(s.records[7].assisted,true);
 assert.equal(s.records[11].correct,false);
 const first=structuredClone(s.records);
 s=W.advance(W.answer(s,'n',at));
 s=W.advance(W.answer(s,'hon',at));
 s=W.advance(W.answer(s,'hon wo yomu',at));
 assert.equal(s.finished,true);
 assert.deepEqual(s.records.slice(0,12),first,'corrections must not replace original first attempts');
 assert.equal(W.summary(s).corrected,3);
 assert.equal(W.summary(s).introduction.independentCorrect,2);
 assert.equal(W.summary(s).decoding.independentCorrect,4);
 assert.equal(W.validState(s),true);
});
test('resume, duplicate responses, tampered records and prior three-kana lesson are safe',()=>{
 let s=W.resume(W.initialState());
 s=W.beginRecall(s);
 s=W.answer(s,'wa',at);
 assert.equal(W.answer(s,'wo',at),s);
 s=W.pause(s);
 assert.equal(W.answer(s,'n',at),s);
 s=W.resume(s);
 assert(W.validState(s));
 const modified=structuredClone(s);
 modified.records[0].submitted='nu';
 assert.equal(W.validState(modified),false);
 const duplicated=structuredClone(s);
 duplicated.records.push(structuredClone(duplicated.records[0]));
 assert.equal(W.validState(duplicated),false);
 assert.equal(W.normalize('ＨＯＮ　Ｏ　ＹＯＭＵ'),'honoyomu');
 assert.equal(Y.TASKS.length,11);
 assert.equal(Y.summary(Y.initialState()).decoding.total,5);
 assert.equal(R.TASKS.length,15);
});
