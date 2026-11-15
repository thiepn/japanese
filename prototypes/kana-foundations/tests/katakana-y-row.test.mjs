import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-y-row-engine.mjs';
import * as M from '../katakana-m-row-engine.mjs';
import * as H from '../katakana-h-row-engine.mjs';
import * as N from '../katakana-n-row-engine.mjs';
import * as T from '../katakana-t-row-engine.mjs';
import * as S from '../katakana-s-row-engine.mjs';
import * as K from '../katakana-k-row-engine.mjs';
import * as V from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('exact THREE standard Y-row katakana, with no invented yi or ye',()=>{
 assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['ya','ヤ','や','ya'],['yu','ユ','ゆ','yu'],['yo','ヨ','よ','yo']]);
 assert.equal(U.KANA.length,3);assert(U.KANA.every(k=>!k.aliases));assert(!U.KANA.some(k=>['yi','ye'].includes(k.reading)));
});
test('proportionate 22 independent prompts, 11-question checkpoint and correct stage counts',()=>{
 assert.equal(U.TASKS.length,22);assert.equal(U.CHECKPOINT_INDEX,11);
 assert.equal(new Set(U.TASKS.map(t=>t.id)).size,22);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['introduction',3],['recognition',3],['word',8],['contrast',8]]);
 const count=a=>a.reduce((m,t)=>(m[t.mode]=(m[t.mode]||0)+1,m),{});
 assert.deepEqual(count(U.TASKS.slice(0,11)),{introduction:3,recognition:3,word:3,contrast:2});
 assert.deepEqual(count(U.TASKS.slice(11)),{word:5,contrast:6});
});
test('eight genuine vocabulary words use only the 38 taught basic katakana',()=>{
 const known=new Set([...V.KANA,...K.KANA,...S.KANA,...T.KANA,...N.KANA,...H.KANA,...M.KANA,...U.KANA].map(k=>k.kana));
 assert.equal(known.size,38);
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['ヤマ','yama'],['ユキ','yuki'],['ヨコ','yoko'],['ユカタ','yukata'],['ヤキイモ','yakiimo'],['ヤマイモ','yamaimo'],['ヤサイ','yasai'],['ヤネ','yane']]);
 for(const w of U.WORDS){assert(w.note&&w.meaning);assert([...w.kana].every(c=>known.has(c)),w.id);assert(/^[a-z]+$/.test(w.reading));assert(!w.aliases);}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('each new Y-row character gets both a full-word reading and isolated recall',()=>{
 const inventory=U.WORDS.map(w=>w.kana).join('');
 for(const k of U.KANA){assert(inventory.includes(k.kana));assert(U.TASKS.find(t=>t.id==='intro-'+k.id));}
});
test('normal native words honestly identify kanji/hiragana as typical writing',()=>{
 for(const id of ['yama','yuki','yoko','yasai','yane'])assert.match(U.WORDS.find(w=>w.id===id).note,/normal|ordinary|ordinarily|usually|more usual|typically/);
});
test('焼き芋 roasted sweet potato differs from 山芋 Japanese yam in reading and meaning',()=>{
 const a=U.WORDS.find(w=>w.id==='yakiimo'),b=U.WORDS.find(w=>w.id==='yamaimo');
 assert.equal(a.meaning,'roasted sweet potato');assert.equal(b.meaning,'Japanese yam');
 assert.equal(a.reading,'yakiimo');assert.equal(b.reading,'yamaimo');
 assert.match(a.note,/two full morae/);assert.equal(U.CONTRASTS.find(c=>c.id==='yam').answer,'ヤキイモ');
});
test('three-way recognition has three unique correct choices, never pads with fake kana',()=>{
 const tasks=U.TASKS.filter(t=>t.mode==='recognition');assert.equal(tasks.length,3);
 for(const t of tasks){assert.equal(t.choices.length,3);assert.deepEqual(new Set(t.choices.map(c=>c.value)),new Set(['ya','yu','yo']));assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);}
});
test('five script contrasts are correct and only use standard hiragana/katakana',()=>{
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-yu').answer,'ユ');assert.equal(U.CONTRASTS.find(c=>c.id==='script-yo').answer,'ヨ');
 for(const k of U.KANA)assert.equal(U.CONTRASTS.find(c=>c.id==='hira-'+k.id).answer,k.base);
});
test('three context comparisons contain only assessed words and exactly one correct answer',()=>{
 const words=new Set(U.WORDS.map(w=>w.kana));
 for(const id of ['roof','yam','yukata']){const c=U.CONTRASTS.find(c=>c.id===id);assert(c);assert(c.choices.every(([v])=>words.has(v)));assert.equal(c.choices.filter(([v])=>v===c.answer).length,1);}
 assert.equal(U.CONTRASTS.find(c=>c.id==='roof').answer,'ヤネ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='yukata').answer,'ユカタ');
});
test('recognition and all script/word contrasts have distinct options',()=>{
 for(const t of U.TASKS.filter(t=>t.choices)){assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);}
});
test('active teaching requires hide-and-recall before answer or reveal credit',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-ya');
 assert.equal(U.answer(s,'ya',NOW),s);assert.equal(U.reveal(s,NOW),s);
 s=U.beginRecall(s);s=U.answer(s,'ya',NOW);assert(s.feedback.correct&&U.validState(s));
});
test('checkpoint after 11 blocks early Stage B and persists every original record',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<11;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.answer(s,'yukata',NOW),s);assert.equal(U.advance(s),s);
 const original=structuredClone(s.records);s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));
 assert(U.atCheckpoint(s));assert.deepEqual(s.records,original);
 s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'word-yukata');
});
test('22 independent correct first attempts yield accurate 11/11 scores and no corrections',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===22&&s.corrections.length===0);
 const q=U.summary(s);assert.equal(q.stageA,11);assert.equal(q.stageB,11);
 for(const m of U.MODES)assert.deepEqual(q[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong first, revealed snow and wrong last contrast maintain separately corrected evidence',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<22;i++){
  if(i===11)s=U.acknowledgeCheckpoint(s);
  const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'yu',NOW):i===7?U.reveal(s,NOW):i===21?U.answer(s,'ヤサイ',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s),t.id);s=U.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-ya','word-yuki','contrast-yukata']);
 const first=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s));assert.equal(s.records.length,25);assert.deepEqual(s.records.slice(0,22),first);assert.equal(U.summary(s).corrected,3);
});
test('all 22 assisted originals require bounded corrections and yield zero independent credit',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<22;i++){if(i===11)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,22);for(let i=0;i<22;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===44);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('forged grades, answers, duplicated evidence or impossible checkpoint fail closed',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'ya',NOW);
 for(const fn of [x=>{x.records[0].submitted='yu';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='yu';},x=>{x.checkpointPassed=true;},x=>{x.schema=9;}]){const bad=structuredClone(s);fn(bad);assert(!U.validState(bad));}
});
test('isolated Y-row storage key and unchanged prior 20–26 task totals',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-y-row:prototype-only:v1');
 for(const x of [V,K,S,T,N,H,M])assert.notEqual(U.STORAGE_KEY,x.STORAGE_KEY);
 assert.deepEqual([V.TASKS.length,K.TASKS.length,S.TASKS.length,T.TASKS.length,N.TASKS.length,H.TASKS.length,M.TASKS.length],[23,27,31,31,31,31,31]);
});
