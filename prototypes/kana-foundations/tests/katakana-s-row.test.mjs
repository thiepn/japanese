import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-s-row-engine.mjs';
import * as Prev from '../katakana-k-row-engine.mjs';
import * as Vowels from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('Five exact S-row katakana match previously learned hiragana; シ = shi',()=>{
 assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['sa','サ','さ','sa'],['shi','シ','し','shi'],['su','ス','す','su'],['se','セ','せ','se'],['so','ソ','そ','so']]);
 assert.deepEqual(U.KANA.find(k=>k.id==='shi').aliases,['si']);
});
test('31 unique original tasks and exact 15+16 stage distribution',()=>{
 assert.equal(U.TASKS.length,31);assert.equal(U.CHECKPOINT_INDEX,15);
 assert.equal(new Set(U.TASKS.map(t=>t.id)).size,31);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['introduction',5],['recognition',5],['word',10],['contrast',11]]);
 const count=items=>items.reduce((o,x)=>(o[x.mode]=(o[x.mode]||0)+1,o),{});
 assert.deepEqual(count(U.TASKS.slice(0,15)),{introduction:5,recognition:5,word:3,contrast:2});
 assert.deepEqual(count(U.TASKS.slice(15)),{word:7,contrast:9});
});
test('Ten authentic words are fully decodable with Units 20–22 and no future katakana',()=>{
 const known=new Set([...Vowels.KANA.map(k=>k.kana),...Prev.KANA.map(k=>k.kana),...U.KANA.map(k=>k.kana)]);
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['スシ','sushi'],['イス','isu'],['アシ','ashi'],['スイカ','suika'],['アサ','asa'],['イシ','ishi'],['ウソ','uso'],['エサ','esa'],['セキ','seki'],['サケ','sake']]);
 for(const w of U.WORDS){assert([...w.kana].every(c=>known.has(c)),w.id);assert(w.meaning&&w.note&&/^[a-z]+$/.test(w.reading));}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('native Japanese words in katakana are labeled as instructional, not claimed default writing',()=>{
 for(const id of ['ashi','asa','ishi','seki'])assert.match(U.WORDS.find(w=>w.id===id).note,/usual|typical|more typical|usually|everyday/);
 assert.match(U.WORDS.find(w=>w.id==='sake').note,/salmon/);
 assert.match(U.WORDS.find(w=>w.id==='sake').note,/alcoholic drink/);
});
test('シ accepts standard shi and Kunrei si without accepting the wrong sounds',()=>{
 let s=U.resume(U.initialState());
 s=correct(s);
 const t=U.TASKS.find(x=>x.id==='intro-shi');assert(t.aliases.includes('si'));
 s=U.beginRecall(s);
 s=U.answer(s,'si',NOW);assert.equal(s.feedback.correct,true);assert(U.validState(s));
 assert(U.WORDS.find(w=>w.id==='sushi').aliases.includes('susi'));
 assert(U.WORDS.find(w=>w.id==='ashi').aliases.includes('asi'));
 assert(U.WORDS.find(w=>w.id==='ishi').aliases.includes('isi'));
});
test('S-row recognition choices each contain five distinct readings with exactly one correct answer',()=>{
 for(const t of U.TASKS.filter(t=>t.mode==='recognition')){
  assert.equal(t.choices.length,5);assert.equal(new Set(t.choices.map(c=>c.value)).size,5);
  assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
  if(t.answer==='shi')assert(t.choices.some(c=>c.value==='shi'));
 }
});
test('11 written contrasts each include one correct response, no duplicated distractors',()=>{
 for(const t of U.TASKS.filter(t=>t.mode==='contrast')){
  assert(t.choices.length>=2);assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
  assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);
 }
});
test('Five hiragana transfer answers and two script contrasts match actual characters',()=>{
 for(const k of U.KANA)assert.equal(U.CONTRASTS.find(x=>x.id==='hira-'+k.id).answer,k.base);
 assert.equal(U.CONTRASTS.find(x=>x.id==='script-shi').answer,'シ');
 assert.equal(U.CONTRASTS.find(x=>x.id==='script-se').answer,'セ');
});
test('Vocabulary contrasts use original word inventory and unambiguous meanings',()=>{
 const byId=new Map(U.WORDS.map(w=>[w.kana,w.meaning]));
 for(const c of U.CONTRASTS.filter(x=>x.stage==='b'&&!x.id.startsWith('hira-')))assert(c.choices.every(([v])=>byId.has(v)),c.id);
 assert.equal(U.CONTRASTS.find(x=>x.id==='watermelon').answer,'スイカ');
 assert.equal(U.CONTRASTS.find(x=>x.id==='seat').answer,'セキ');
 assert.equal(U.CONTRASTS.find(x=>x.id==='lie').answer,'ウソ');
 assert.equal(U.CONTRASTS.find(x=>x.id==='salmon').answer,'サケ');
});
test('Cannot score unrecalled introduction or reveal before hiding written answer',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-sa');
 assert.equal(U.answer(s,'sa',NOW),s);assert.equal(U.reveal(s,NOW),s);
 s=U.beginRecall(s);assert(s.checking);s=U.answer(s,'sa',NOW);assert(s.feedback?.correct&&U.validState(s));
});
test('Checkpoint at 15 blocks bypass and survives saved pause/reload',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<15;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);
 assert.equal(U.answer(s,'suika'),s);assert.equal(U.advance(s),s);
 const first=structuredClone(s.records);
 s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));assert(U.atCheckpoint(s));assert.deepEqual(s.records,first);
 s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'word-suika');
});
test('All 31 first attempts successful produce correct independent summary, no corrective tasks',()=>{
 const s=full();assert(s.finished&&U.validState(s));assert.equal(s.records.length,31);assert.equal(s.corrections.length,0);
 const score=U.summary(s);assert.equal(score.stageA,15);assert.equal(score.stageB,16);
 for(const m of U.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('Wrong first, revealed word and incorrect contrast remain immutable after correction',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){
  if(i===15)s=U.acknowledgeCheckpoint(s);
  const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'so',NOW):i===11?U.reveal(s,NOW):i===30?U.answer(s,'エサ',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s),t.id);s=U.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-sa','word-isu','contrast-salmon']);
 const first=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===34);assert.deepEqual(s.records.slice(0,31),first);
 assert.equal(U.summary(s).corrected,3);
});
test('All revealed original answers create bounded correction set without first-attempt credit',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,31);for(let i=0;i<31;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===62);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('Forged feedback, original grades and checkpoint flags are rejected',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'sa',NOW);
 for(const change of [x=>{x.records[0].submitted='so';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='so';},x=>{x.checkpointPassed=true;},x=>{x.schema=8;}]){const bad=structuredClone(s);change(bad);assert(!U.validState(bad));}
});
test('Unit 22 storage key unique; Unit 20 and 21 inventories intact',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-s-row:prototype-only:v1');
 assert.notEqual(U.STORAGE_KEY,Prev.STORAGE_KEY);assert.notEqual(U.STORAGE_KEY,Vowels.STORAGE_KEY);
 assert.equal(Prev.TASKS.length,27);assert.equal(Vowels.TASKS.length,23);
});
