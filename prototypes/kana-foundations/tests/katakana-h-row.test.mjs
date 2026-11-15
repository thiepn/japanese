import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-h-row-engine.mjs';
import * as N from '../katakana-n-row-engine.mjs';
import * as T from '../katakana-t-row-engine.mjs';
import * as S from '../katakana-s-row-engine.mjs';
import * as K from '../katakana-k-row-engine.mjs';
import * as V from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('exact five H-row katakana map to known hiragana and standard sounds',()=>{
 assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['ha','ハ','は','ha'],['hi','ヒ','ひ','hi'],['fu','フ','ふ','fu'],['he','ヘ','へ','he'],['ho','ホ','ほ','ho']]);
 assert.deepEqual(U.KANA.find(k=>k.id==='fu').aliases,['hu']);
 assert(U.KANA.filter(k=>k.id!=='fu').every(k=>!k.aliases));
});
test('31 unique first questions, checkpoint at 15 and correct stage/mode distribution',()=>{
 assert.equal(U.CHECKPOINT_INDEX,15);assert.equal(U.TASKS.length,31);
 assert.equal(new Set(U.TASKS.map(t=>t.id)).size,31);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['introduction',5],['recognition',5],['word',10],['contrast',11]]);
 const tally=items=>items.reduce((x,t)=>(x[t.mode]=(x[t.mode]||0)+1,x),{});
 assert.deepEqual(tally(U.TASKS.slice(0,15)),{introduction:5,recognition:5,word:3,contrast:2});
 assert.deepEqual(tally(U.TASKS.slice(15)),{word:7,contrast:9});
});
test('all ten authentic words use exactly the previously taught 30 simple katakana',()=>{
 const letters=new Set([...V.KANA,...K.KANA,...S.KANA,...T.KANA,...N.KANA,...U.KANA].map(k=>k.kana));
 assert.equal(letters.size,30);
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['ハチ','hachi'],['フタ','futa'],['ホタテ','hotate'],['ハコ','hako'],['ハナ','hana'],['ヒト','hito'],['フク','fuku'],['フネ','fune'],['ヘソ','heso'],['ホネ','hone']]);
 for(const w of U.WORDS){assert(w.meaning&&w.note);assert([...w.kana].every(k=>letters.has(k)),w.id);assert(/^[a-z]+$/.test(w.reading));}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('each new H-row glyph appears in graded fully decodable words',()=>{
 const joined=U.WORDS.map(w=>w.kana).join('');
 for(const k of U.KANA)assert(joined.includes(k.kana),k.id);
});
test('fu/hu and earlier chi/ti romanization both accepted for appropriate words only',()=>{
 assert.deepEqual(U.WORDS.find(w=>w.id==='hachi').aliases,['hati']);
 assert.deepEqual(U.WORDS.find(w=>w.id==='futa').aliases,['huta']);
 assert.deepEqual(U.WORDS.find(w=>w.id==='fuku').aliases,['huku']);
 assert.deepEqual(U.WORDS.find(w=>w.id==='fune').aliases,['hune']);
 for(const w of U.WORDS.filter(w=>!['hachi','futa','fuku','fune'].includes(w.id)))assert(!w.aliases,w.id);
});
test('Hepburn fu and Kunrei hu both correct in typed introductory recall',()=>{
 let s=U.resume(U.initialState());s=correct(s);s=correct(s);
 assert.equal(U.taskAt(s).id,'intro-fu');s=U.beginRecall(s);s=U.answer(s,'HU',NOW);
 assert(s.feedback?.correct&&U.validState(s));assert.equal(s.feedback.submitted,'hu');
});
test('recognition remains consistent Hepburn and uses five distinct options',()=>{
 for(const t of U.TASKS.filter(t=>t.mode==='recognition')){
  assert.equal(t.choices.length,5);assert.equal(new Set(t.choices.map(c=>c.value)).size,5);
  assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
 }
 assert.equal(U.TASKS.find(t=>t.id==='recognition-fu').answer,'fu');
});
test('five hiragana counterparts and two initial script contrasts match exact writing systems',()=>{
 for(const k of U.KANA)assert.equal(U.CONTRASTS.find(c=>c.id==='hira-'+k.id).answer,k.base);
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-fu').answer,'フ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-he').answer,'ヘ');
});
test('contrast labels and answers have exactly one correct and no duplicate values',()=>{
 for(const t of U.TASKS.filter(t=>t.choices)){
  assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
  assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);
 }
});
test('four contextual choices use known genuine words and appropriate intended meanings',()=>{
 const inventory=new Set(U.WORDS.map(w=>w.kana));
 for(const id of ['insect','flower','clothes','navel']){
  const c=U.CONTRASTS.find(c=>c.id===id);assert(c);assert(c.choices.every(([k])=>inventory.has(k)),id);
 }
 assert.equal(U.CONTRASTS.find(c=>c.id==='insect').answer,'ハチ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='flower').answer,'ハナ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='clothes').answer,'フク');
 assert.equal(U.CONTRASTS.find(c=>c.id==='navel').answer,'ヘソ');
});
test('ambiguous words explain context and exercise-only spelling',()=>{
 assert.match(U.WORDS.find(w=>w.id==='hachi').note,/eight/);
 assert.match(U.WORDS.find(w=>w.id==='hana').note,/nose/);
 assert.match(U.WORDS.find(w=>w.id==='fuku').note,/fortune/);
 for(const id of ['hako','hito','fune','hone'])assert.match(U.WORDS.find(w=>w.id===id).note,/usual|usually|more usual/);
 assert.match(U.KANA.find(k=>k.id==='he').note,/particle/);
});
test('correct answer and reveal are blocked until active recall hides initial glyph reading',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-ha');
 assert.equal(U.answer(s,'ha',NOW),s);assert.equal(U.reveal(s,NOW),s);
 s=U.beginRecall(s);s=U.answer(s,'ha',NOW);assert(s.feedback?.correct&&U.validState(s));
});
test('checkpoint after 15 retains original records and requires explicit acknowledge',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<15;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.answer(s,'hako'),s);assert.equal(U.advance(s),s);
 const previous=structuredClone(s.records);s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));
 assert(U.atCheckpoint(s));assert.deepEqual(s.records,previous);s=U.acknowledgeCheckpoint(s);
 assert.equal(U.taskAt(s).id,'word-hako');
});
test('fully correct first answers preserve truthful independent totals without corrections',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===31&&s.corrections.length===0);
 const score=U.summary(s);assert.equal(score.stageA,15);assert.equal(score.stageB,16);
 for(const m of U.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('first incorrect response, reveal and last wrong contrast remain immutable after remediation',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'hi',NOW):i===11?U.reveal(s,NOW):i===30?U.answer(s,'ホネ',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s),t.id);s=U.advance(s);}
 assert.deepEqual(s.corrections,['intro-ha','word-futa','contrast-navel']);
 const original=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===34);assert.deepEqual(s.records.slice(0,31),original);assert.equal(U.summary(s).corrected,3);
});
test('all 31 assisted reveals lead to bounded corrections and zero first-response credit',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,31);for(let i=0;i<31;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===62);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('forged first records, feedback and checkpoint are rejected',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'ha',NOW);
 for(const fn of [x=>{x.records[0].submitted='hi';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='hi';},x=>{x.checkpointPassed=true;},x=>{x.schema=9;}]){const invalid=structuredClone(s);fn(invalid);assert(!U.validState(invalid));}
});
test('new local progress namespace cannot collide with Units 20–24',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-h-row:prototype-only:v1');
 for(const m of [V,K,S,T,N])assert.notEqual(m.STORAGE_KEY,U.STORAGE_KEY);
 assert.deepEqual([V.TASKS.length,K.TASKS.length,S.TASKS.length,T.TASKS.length,N.TASKS.length],[23,27,31,31,31]);
});
