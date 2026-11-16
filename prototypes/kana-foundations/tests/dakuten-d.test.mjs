import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dakuten-d-engine.mjs';
import * as GZ from '../dakuten-gz-engine.mjs';
import * as Review from '../reading-review-engine.mjs';

const when=Date.UTC(2026,10,12);
function correct(s,t=D.taskAt(s),raw=t.answer){
 if(t.mode==='introduction'&&!t.correction)s=D.beginRecall(s);
 s=D.answer(s,raw,when);
 assert.equal(s.feedback?.correct,true,'correct answer for '+t.id);
 assert(D.validState(s));
 return D.advance(s);
}
test('Unit 13 contains exactly 23 unique prompts in the approved order and counts',()=>{
 assert.equal(D.TASKS.length,23);
 assert.equal(new Set(D.TASKS.map(x=>x.id)).size,23);
 assert.deepEqual(D.TASKS.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{}),
  {introduction:5,recognition:5,word:5,spelling:2,contrast:2,expression:2,meaning:2});
 assert.deepEqual(D.MODES.map(x=>x.total),[5,5,5,2,2,2,2]);
});
test('D-row is だ/ぢ/づ/で/ど, spoken da/ji/zu/de/do with explicit standard merger caveat',()=>{
 assert.deepEqual(D.KANA.map(x=>x.kana),[...'だぢづでど']);
 assert.deepEqual(D.KANA.map(x=>x.base),[...'たちつてと']);
 assert.deepEqual(D.KANA.map(x=>x.reading),['da','ji','zu','de','do']);
 assert.match(D.KANA.find(x=>x.kana==='ぢ').note,/generally pronounced ji/);
 assert.match(D.KANA.find(x=>x.kana==='づ').note,/generally pronounced zu/);
 assert.match(D.KANA.find(x=>x.kana==='ぢ').note,/input methods type di/);
 assert.match(D.KANA.find(x=>x.kana==='づ').note,/input methods type du/);
 assert(D.KANA.every(x=>!x.aliases?.includes('di')&&!x.aliases?.includes('du')));
});
test('five genuine words and all expressions/sentences contain only previously introduced kana',()=>{
 const allowed=new Set([...D.PREVIOUS_KANA,...D.KANA.map(x=>x.kana)]);
 assert.equal(allowed.size,61);
 assert.deepEqual(D.WORDS.map(x=>[x.kana,x.reading,x.meaning]),[
  ['だれ','dare','who'],['ちぢむ','chijimu','to shrink'],
  ['つづく','tsuzuku','to continue'],['でんわ','denwa','telephone; phone call'],
  ['どこ','doko','where']
 ]);
 for(const w of [...D.WORDS,...D.EXPRESSIONS,...D.COMPREHENSION])
  assert([...w.kana].every(k=>allowed.has(k)),'unintroduced kana in '+w.id);
 assert.equal(new Set(D.WORDS.map(x=>x.id)).size,5);
});
test('orthography is visual only; ちぢむ and つづく are not graded by identical sound',()=>{
 assert.deepEqual(D.SPELLINGS.map(x=>[x.answer,x.choices]),[
  ['ちぢむ',['ちぢむ','ちじむ']],['つづく',['つずく','つづく']]
 ]);
 assert(D.SPELLINGS.every(x=>x.kana.includes('spelling')));
 assert(D.TASKS.filter(x=>x.mode==='spelling').every(x=>x.choices.some(y=>y.value===x.answer)));
 assert.deepEqual(D.CONTRASTS.map(x=>[x.answer,x.choices]),[
  ['だ',['た','だ']],['で',['で','て']]
 ]);
});
test('all 23 correct answers complete with exact independent denominators',()=>{
 let s=D.resume(D.initialState());
 for(const t of D.TASKS){assert.equal(D.taskAt(s).id,t.id);s=correct(s,t);}
 assert(s.finished);
 assert(D.validState(JSON.parse(JSON.stringify(s))));
 assert.equal(s.records.length,23);
 assert.equal(s.corrections.length,0);
 for(const m of D.MODES)
  assert.deepEqual(D.summary(s)[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('di/du are not accepted as spoken readings for ぢ/づ, while ji/zu are',()=>{
 let s=D.resume(D.initialState());
 s=correct(s);
 assert.equal(D.taskAt(s).id,'intro-di');
 s=D.beginRecall(s);s=D.answer(s,'di',when);assert.equal(s.feedback.correct,false);s=D.advance(s);
 assert.equal(D.taskAt(s).id,'intro-du');
 s=D.beginRecall(s);s=D.answer(s,'du',when);assert.equal(s.feedback.correct,false);s=D.advance(s);
 assert.equal(D.taskAt(s).id,'intro-de');
 s=correct(s);s=correct(s);
 assert.equal(D.taskAt(s).id,'recognition-da');
 for(let i=5;i<10;i++)s=correct(s);
 assert.equal(D.taskAt(s).id,'word-dare');s=correct(s);
 assert.equal(D.taskAt(s).id,'word-chijimu');s=correct(s);
 assert.equal(D.taskAt(s).id,'word-tsuzuku');s=correct(s);
 assert.equal(s.records.find(x=>x.taskId==='word-chijimu').submitted,'chijimu');
 assert.equal(s.records.find(x=>x.taskId==='word-tsuzuku').submitted,'tsuzuku');
});
test('wrong, revealed and incorrect spelling responses create distinct correction records',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<23;i++){
  const t=D.taskAt(s);
  if(t.mode==='introduction')s=D.beginRecall(s);
  const raw=i===0?'ta':i===15?'ちじむ':t.answer;
  s=i===12?D.reveal(s,when):D.answer(s,raw,when);
  assert(D.validState(s),'valid first attempt '+i);
  s=D.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-da','word-tsuzuku','spelling-chijimu']);
 const originals=structuredClone(s.records);
 for(const id of s.corrections){
  const t=D.taskAt(s);
  assert.equal(t.id,id);
  s=correct(s,t);
 }
 assert(s.finished);
 assert.equal(s.records.length,26);
 assert.deepEqual(s.records.slice(0,23),originals);
 assert.equal(D.summary(s).corrected,3);
 assert.equal(D.summary(s).introduction.independentCorrect,4);
 assert.equal(D.summary(s).word.independentCorrect,4);
 assert.equal(D.summary(s).spelling.independentCorrect,1);
});
test('23 revealed first answers plus 23 independent corrections produce valid maximum 46 records',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<23;i++){
  if(D.taskAt(s).mode==='introduction')s=D.beginRecall(s);
  s=D.advance(D.reveal(s,when));
  assert(D.validState(s));
 }
 assert.deepEqual(s.corrections,D.TASKS.map(x=>x.id));
 for(let i=0;i<23;i++)s=correct(s);
 assert(s.finished);
 assert.equal(s.records.length,46);
 assert(D.validState(s));
 assert.equal(D.summary(s).corrected,23);
 for(const m of D.MODES)assert.equal(D.summary(s)[m.id].independentCorrect,0);
});
test('saved-state validation rejects forged feedback, duplicate evidence, skipped records and altered answers',()=>{
 let s=D.resume(D.initialState());
 s=D.beginRecall(s);s=D.answer(s,'da',when);
 assert.equal(D.answer(s,'do',when),s,'no overwriting a submitted answer');
 let forged=structuredClone(s);forged.records[0].submitted='do';assert(!D.validState(forged));
 forged=structuredClone(s);forged.records[0].recordId='first-intro-di';assert(!D.validState(forged));
 forged=structuredClone(s);forged.feedback.answer='de';assert(!D.validState(forged));
 forged=structuredClone(s);forged.records.push(structuredClone(forged.records[0]));assert(!D.validState(forged));
 forged=structuredClone(s);forged.index=2;assert(!D.validState(forged));
 forged=structuredClone(s);forged.corrections.push('intro-da');assert(!D.validState(forged));
 s=D.pause(s);assert(D.validState(s));assert.equal(D.answer(s,'do',when),s);
});
test('normalization accepts harmless letter formatting and spaces; spelling choices require exact kana',()=>{
 assert.equal(D.normalize(' ＤＥＮＷＡ-Ｏ ＳＵＲＵ '),'denwaosuru');
 let s=D.resume(D.initialState());
 for(let i=0;i<15;i++)s=correct(s);
 assert.equal(D.taskAt(s).id,'spelling-chijimu');
 assert.equal(D.answer(s,'chijimu',when),s,'a latin reading cannot replace the spelling exercise');
 s=D.answer(s,'ちぢむ',when);assert.equal(s.feedback.correct,true);s=D.advance(s);
 s=D.answer(s,'つずく',when);assert.equal(s.feedback.correct,false);
});
test('new isolated storage key cannot collide with Units 01–12, Account or FSRS',()=>{
 assert.equal(D.STORAGE_KEY,'thiepn:kana-foundations:dakuten-d:prototype-only:v1');
 assert.notEqual(D.STORAGE_KEY,GZ.STORAGE_KEY);
 assert.notEqual(D.STORAGE_KEY,Review.STORAGE_KEY);
 assert.equal(GZ.TASKS.length,36);
 assert.equal(Review.TASKS.length,17);
});
