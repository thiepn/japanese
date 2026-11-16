import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-n-row-engine.mjs';
import * as T from '../katakana-t-row-engine.mjs';
import * as S from '../katakana-s-row-engine.mjs';
import * as K from '../katakana-k-row-engine.mjs';
import * as V from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('N-row has exactly five standard katakana, correct hiragana and stable readings',()=>{
 assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['na','ナ','な','na'],['ni','ニ','に','ni'],['nu','ヌ','ぬ','nu'],['ne','ネ','ね','ne'],['no','ノ','の','no']]);
 assert(U.KANA.every(k=>!k.aliases));assert(!U.KANA.some(k=>k.kana==='ン'));
});
test('31 distinct first attempts with 15-response checkpoint and mode totals',()=>{
 assert.equal(U.TASKS.length,31);assert.equal(U.CHECKPOINT_INDEX,15);assert.equal(new Set(U.TASKS.map(t=>t.id)).size,31);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['introduction',5],['recognition',5],['word',10],['contrast',11]]);
 const tally=xs=>xs.reduce((m,t)=>(m[t.mode]=(m[t.mode]||0)+1,m),{});
 assert.deepEqual(tally(U.TASKS.slice(0,15)),{introduction:5,recognition:5,word:3,contrast:2});
 assert.deepEqual(tally(U.TASKS.slice(15)),{word:7,contrast:9});
});
test('ten genuine Japanese words contain only the 25 taught katakana of Units 20–24',()=>{
 const known=new Set([...V.KANA,...K.KANA,...S.KANA,...T.KANA,...U.KANA].map(k=>k.kana));
 assert.equal(known.size,25);
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['ネコ','neko'],['イヌ','inu'],['ナス','nasu'],['キノコ','kinoko'],['キツネ','kitsune'],['タヌキ','tanuki'],['カニ','kani'],['ナシ','nashi'],['ネタ','neta'],['タネ','tane']]);
 for(const w of U.WORDS){assert(w.meaning&&w.note);assert([...w.kana].every(ch=>known.has(ch)),w.id);assert(/^[a-z]+$/.test(w.reading));}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('all five newly taught N-row katakana occur in independently assessed full-word readings',()=>{
 const all=U.WORDS.map(w=>w.kana).join('');
 for(const k of U.KANA)assert(all.includes(k.kana),k.kana);
 assert(U.WORDS.some(w=>w.kana.includes('ノ')&&w.id==='kinoko'));
});
test('fruit/absence and sushi/material ambiguity explicitly contextualized',()=>{
 const pear=U.WORDS.find(w=>w.id==='nashi'),sushi=U.WORDS.find(w=>w.id==='neta');
 assert.match(pear.meaning,/pear/);assert.match(pear.note,/none/);
 assert.match(sushi.meaning,/sushi/);assert.match(sushi.note,/story material/);
 assert.equal(U.CONTRASTS.find(c=>c.id==='pear').answer,'ナシ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='seed').answer,'タネ');
});
test('proper nature vocabulary avoids confusing fox with Japanese raccoon dog',()=>{
 assert.equal(U.WORDS.find(w=>w.id==='kitsune').meaning,'fox');
 assert.match(U.WORDS.find(w=>w.id==='tanuki').meaning,/raccoon dog/);
 assert.match(U.WORDS.find(w=>w.id==='tanuki').note,/not a raccoon or a fox/);
 assert.equal(U.CONTRASTS.find(c=>c.id==='fox').answer,'キツネ');
});
test('typed word romanization accepts valid prior chi/tsu equivalents, not incorrect kana',()=>{
 assert.deepEqual(U.WORDS.find(w=>w.id==='kitsune').aliases,['kitune']);
 assert.deepEqual(U.WORDS.find(w=>w.id==='nashi').aliases,['nasi']);
 for(const w of U.WORDS.filter(w=>!['kitsune','nashi'].includes(w.id)))assert(!w.aliases,w.id);
});
test('recognition and eleven contrasts are unambiguous and not duplicated',()=>{
 for(const t of U.TASKS.filter(t=>t.choices)){
  assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);
  assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);
 }
 assert(U.TASKS.filter(t=>t.mode==='recognition').every(t=>t.choices.length===5));
 for(const k of U.KANA)assert.equal(U.CONTRASTS.find(c=>c.id==='hira-'+k.id).answer,k.base);
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-nu').answer,'ヌ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-no').answer,'ノ');
});
test('all contextual multiple-choice words use fully taught assessment inventory',()=>{
 const inventory=new Set(U.WORDS.map(w=>w.kana));
 for(const c of U.CONTRASTS.filter(c=>['fox','pear','mushroom','seed'].includes(c.id)))assert(c.choices.every(([v])=>inventory.has(v)),c.id);
 assert.equal(U.CONTRASTS.find(c=>c.id==='mushroom').answer,'キノコ');
});
test('first introduction cannot be scored until reading is hidden and recall requested',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-na');
 assert.equal(U.answer(s,'na',NOW),s);assert.equal(U.reveal(s,NOW),s);
 s=U.beginRecall(s);s=U.answer(s,'na',NOW);assert(s.feedback.correct&&U.validState(s));
});
test('checkpoint after 15 preserves first responses and cannot be skipped',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<15;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.answer(s,'kinoko'),s);assert.equal(U.advance(s),s);
 const before=structuredClone(s.records);s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));
 assert(U.atCheckpoint(s));assert.deepEqual(s.records,before);s=U.acknowledgeCheckpoint(s);
 assert.equal(U.taskAt(s).id,'word-kinoko');
});
test('full independent 31-prompt session has truthful stage/mode results',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===31&&s.corrections.length===0);
 const score=U.summary(s);assert.equal(score.stageA,15);assert.equal(score.stageB,16);
 for(const m of U.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong first, assisted animal word and wrong contextual meaning yield separate corrections',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){
  if(i===15)s=U.acknowledgeCheckpoint(s);
  const task=U.taskAt(s);if(task.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'ni',NOW):i===11?U.reveal(s,NOW):i===30?U.answer(s,'ネタ',NOW):U.answer(s,task.answer,NOW);
  assert(U.validState(s),task.id);s=U.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-na','word-inu','contrast-seed']);
 const first=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===34);
 assert.deepEqual(s.records.slice(0,31),first);assert.equal(U.summary(s).corrected,3);
});
test('all assisted first answers produce bounded corrections but zero independent credit',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,31);for(let i=0;i<31;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===62);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('forged initial grade, feedback, checkpoint and schema rejected without overwriting',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'na',NOW);
 for(const fn of [x=>{x.records[0].submitted='ni';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='ni';},x=>{x.checkpointPassed=true;},x=>{x.schema=99;}]){const invalid=structuredClone(s);fn(invalid);assert(!U.validState(invalid));}
});
test('only Unit 24 new storage namespace, prior Unit 20–23 inventories immutable',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-n-row:prototype-only:v1');
 for(const prev of [V,K,S,T])assert.notEqual(prev.STORAGE_KEY,U.STORAGE_KEY);
 assert.deepEqual([V.TASKS.length,K.TASKS.length,S.TASKS.length,T.TASKS.length],[23,27,31,31]);
});
