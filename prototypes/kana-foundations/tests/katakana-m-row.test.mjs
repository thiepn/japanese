import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-m-row-engine.mjs';
import * as H from '../katakana-h-row-engine.mjs';
import * as N from '../katakana-n-row-engine.mjs';
import * as T from '../katakana-t-row-engine.mjs';
import * as S from '../katakana-s-row-engine.mjs';
import * as K from '../katakana-k-row-engine.mjs';
import * as V from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('five standard M-row katakana exactly map to familiar hiragana and sounds',()=>{
 assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['ma','マ','ま','ma'],['mi','ミ','み','mi'],['mu','ム','む','mu'],['me','メ','め','me'],['mo','モ','も','mo']]);
 assert(U.KANA.every(k=>!k.aliases));
});
test('31 unique original tasks and 15+16 checkpoint distribution',()=>{
 assert.equal(U.TASKS.length,31);assert.equal(U.CHECKPOINT_INDEX,15);assert.equal(new Set(U.TASKS.map(t=>t.id)).size,31);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['introduction',5],['recognition',5],['word',10],['contrast',11]]);
 const count=items=>items.reduce((m,t)=>(m[t.mode]=(m[t.mode]||0)+1,m),{});
 assert.deepEqual(count(U.TASKS.slice(0,15)),{introduction:5,recognition:5,word:3,contrast:2});
 assert.deepEqual(count(U.TASKS.slice(15)),{word:7,contrast:9});
});
test('ten independently readable real words use only the 35 taught katakana',()=>{
 const known=new Set([...V.KANA,...K.KANA,...S.KANA,...T.KANA,...N.KANA,...H.KANA,...U.KANA].map(k=>k.kana));
 assert.equal(known.size,35);
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['マメ','mame'],['ミミ','mimi'],['ムシ','mushi'],['メモ','memo'],['モモ','momo'],['マスク','masuku'],['ママ','mama'],['マウス','mausu'],['モチ','mochi'],['ムネ','mune']]);
 for(const w of U.WORDS){assert(w.meaning&&w.note);assert([...w.kana].every(k=>known.has(k)),w.id);assert(/^[a-z]+$/.test(w.reading));}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('each new M-row character occurs in a graded authentic word',()=>{
 const written=U.WORDS.map(w=>w.kana).join('');
 for(const k of U.KANA)assert(written.includes(k.kana),k.id);
});
test('context-specific peach versus poultry, mouse versus mask are explained accurately',()=>{
 assert.match(U.WORDS.find(w=>w.id==='momo').note,/thigh/);
 assert.match(U.WORDS.find(w=>w.id==='mune').note,/chicken breast/);
 assert.match(U.WORDS.find(w=>w.id==='mausu').note,/computer mouse/);
 assert.match(U.WORDS.find(w=>w.id==='masuku').note,/mask/);
 assert.equal(U.CONTRASTS.find(c=>c.id==='peach').answer,'モモ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='mask').answer,'マスク');
});
test('Korean-like romaji spelling is not accepted as Japanese kana reading',()=>{
 const t=U.TASKS.find(t=>t.id==='intro-mu');
 assert.deepEqual(t.aliases,[]);
 let s=U.resume(U.initialState());s=correct(s);s=correct(s);s=U.beginRecall(s);
 s=U.answer(s,'moo',NOW);assert.equal(s.feedback.correct,false);
});
test('legitimate previously taught Kunrei for シ and チ remains accepted in words',()=>{
 assert.deepEqual(U.WORDS.find(w=>w.id==='mushi').aliases,['musi']);
 assert.deepEqual(U.WORDS.find(w=>w.id==='mochi').aliases,['moti']);
 assert(U.WORDS.filter(w=>!['mushi','mochi'].includes(w.id)).every(w=>!w.aliases));
});
test('recognition has five unique Hepburn readings, exactly one correct option each',()=>{
 for(const t of U.TASKS.filter(t=>t.mode==='recognition')){
  assert.equal(t.choices.length,5);assert.equal(new Set(t.choices.map(c=>c.value)).size,5);
  assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
 }
});
test('two script and five hiragana contrasts use exact corresponding characters',()=>{
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-mu').answer,'ム');
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-me').answer,'メ');
 for(const k of U.KANA)assert.equal(U.CONTRASTS.find(c=>c.id==='hira-'+k.id).answer,k.base);
});
test('all contrast choices have distinct values, single correct answer and taught vocabulary',()=>{
 const known=new Set(U.WORDS.map(w=>w.kana));
 for(const t of U.TASKS.filter(t=>t.choices)){
  assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);
  assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
 }
 for(const id of ['memo','mask','peach','bug']){
  const c=U.CONTRASTS.find(c=>c.id===id);assert(c);assert(c.choices.every(([value])=>known.has(value)));
 }
});
test('native Japanese words clarify common kanji/hiragana versus katakana practice',()=>{
 for(const id of ['mame','mimi','mochi','mune'])assert.match(U.WORDS.find(w=>w.id===id).note,/also|everyday|normally|general|usually/);
 assert.match(U.WORDS.find(w=>w.id==='mama').note,/mother/);
 assert.match(U.WORDS.find(w=>w.id==='memo').note,/loanword/);
});
test('active recall hides introduction before any answer or reveal is accepted',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-ma');
 assert.equal(U.answer(s,'ma',NOW),s);assert.equal(U.reveal(s,NOW),s);
 s=U.beginRecall(s);s=U.answer(s,'ma',NOW);assert(s.feedback.correct&&U.validState(s));
});
test('checkpoint at 15 blocks early progression and survives pause/reload exactly',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<15;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.answer(s,'memo'),s);assert.equal(U.advance(s),s);
 const first=structuredClone(s.records);s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));
 assert(U.atCheckpoint(s));assert.deepEqual(s.records,first);
 s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'word-memo');
});
test('fully correct 31 first answers retain accurate independent stage and mode scores',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===31&&s.corrections.length===0);
 const q=U.summary(s);assert.equal(q.stageA,15);assert.equal(q.stageB,16);
 for(const m of U.MODES)assert.deepEqual(q[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('incorrect initial, revealed ear and incorrect bean/bug contrast preserve separate corrections',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'mi',NOW):i===11?U.reveal(s,NOW):i===30?U.answer(s,'マメ',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s),t.id);s=U.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-ma','word-mimi','contrast-bug']);
 const original=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===34);assert.deepEqual(s.records.slice(0,31),original);
 assert.equal(U.summary(s).corrected,3);
});
test('all assisted first responses make bounded correction queue and zero independent credit',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,31);for(let i=0;i<31;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===62);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('tampered first record, feedback and checkpoint states reject as invalid',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'ma',NOW);
 for(const fn of [x=>{x.records[0].submitted='mi';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='mi';},x=>{x.checkpointPassed=true;},x=>{x.schema=5;}]){const bad=structuredClone(s);fn(bad);assert(!U.validState(bad));}
});
test('dedicated storage key never intersects established Units 20–25',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-m-row:prototype-only:v1');
 for(const v of [V,K,S,T,N,H])assert.notEqual(v.STORAGE_KEY,U.STORAGE_KEY);
 assert.deepEqual([V.TASKS.length,K.TASKS.length,S.TASKS.length,T.TASKS.length,N.TASKS.length,H.TASKS.length],[23,27,31,31,31,31]);
});
