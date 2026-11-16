import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-t-row-engine.mjs';
import * as S from '../katakana-s-row-engine.mjs';
import * as K from '../katakana-k-row-engine.mjs';
import * as V from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('five T-row forms map exactly to known hiragana with Hepburn/valid Kunrei',()=>{
 assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['ta','タ','た','ta'],['chi','チ','ち','chi'],['tsu','ツ','つ','tsu'],['te','テ','て','te'],['to','ト','と','to']]);
 assert.deepEqual(U.KANA.find(k=>k.id==='chi').aliases,['ti']);
 assert.deepEqual(U.KANA.find(k=>k.id==='tsu').aliases,['tu']);
});
test('31 unique first prompts; checkpoint 15; correct totals and staged counts',()=>{
 assert.equal(U.TASKS.length,31);assert.equal(U.CHECKPOINT_INDEX,15);
 assert.equal(new Set(U.TASKS.map(t=>t.id)).size,31);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['introduction',5],['recognition',5],['word',10],['contrast',11]]);
 const count=a=>a.reduce((m,t)=>(m[t.mode]=(m[t.mode]||0)+1,m),{});
 assert.deepEqual(count(U.TASKS.slice(0,15)),{introduction:5,recognition:5,word:3,contrast:2});
 assert.deepEqual(count(U.TASKS.slice(15)),{word:7,contrast:9});
});
test('ten actual words use exclusively previously taught vowels, K, S and new T-row',()=>{
 const known=new Set([...V.KANA,...K.KANA,...S.KANA,...U.KANA].map(k=>k.kana));
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['タコ','tako'],['クツ','kutsu'],['チカチカ','chikachika'],['ツクエ','tsukue'],['トケイ','tokei'],['コツ','kotsu'],['テコ','teko'],['キツツキ','kitsutsuki'],['チクチク','chikuchiku'],['タケ','take']]);
 for(const w of U.WORDS){assert([...w.kana].every(c=>known.has(c)),w.id);assert(w.meaning&&w.note&&/^[a-z]+$/.test(w.reading));}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('visual contrast examines シ versus ツ, never claiming they have same sound',()=>{
 const c=U.CONTRASTS.find(x=>x.id==='lookalike-shi-tsu');
 assert.equal(c.answer,'ツ');assert(c.choices.some(([k])=>k==='シ'));assert(c.note.includes('top'));assert(c.note.includes('left'));
 assert(U.KANA.find(x=>x.id==='tsu').note.includes('シ'));
});
test('all romanization aliases are legitimate Kunrei replacements, not invented shortcuts',()=>{
 const expected=new Map([['kutsu','kutu'],['chikachika','tikatika'],['tsukue','tukue'],['kotsu','kotu'],['kitsutsuki','kitutuki'],['chikuchiku','tikutiku']]);
 for(const w of U.WORDS){if(expected.has(w.id))assert.deepEqual(w.aliases,[expected.get(w.id)]);else assert(!w.aliases);}
 const denied=['chikatsuka','tukutsu','tikituku'];
 for(const w of U.WORDS)assert(denied.every(x=>w.reading!==x&&!(w.aliases||[]).includes(x)));
});
test('recognition options and every script/meaning contrast have unique, single answers',()=>{
 for(const t of U.TASKS.filter(t=>t.choices)){assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);}
 assert(U.TASKS.filter(t=>t.mode==='recognition').every(t=>t.choices.length===5));
});
test('five T-row hiragana matches and both script tests are factually correct',()=>{
 for(const k of U.KANA)assert.equal(U.CONTRASTS.find(c=>c.id==='hira-'+k.id).answer,k.base);
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-chi').answer,'チ');assert.equal(U.CONTRASTS.find(c=>c.id==='script-tsu').answer,'ツ');
});
test('all meaning contrasts use real, fully taught words and distinct correct meanings',()=>{
 const inventory=new Set(U.WORDS.map(w=>w.kana));
 for(const c of U.CONTRASTS.filter(x=>x.id.startsWith('meaning-')))assert(c.choices.every(([v])=>inventory.has(v)),c.id);
 assert.equal(U.CONTRASTS.find(c=>c.id==='meaning-clock').answer,'トケイ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='meaning-octopus').answer,'タコ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='meaning-shoes').answer,'クツ');
});
test('exercise-only katakana words are explicitly marked as not default real-world spelling',()=>{
 for(const id of ['tsukue','tokei','take'])assert.match(U.WORDS.find(w=>w.id===id).note,/usual|typical|everyday/);
 assert.match(U.WORDS.find(w=>w.id==='kitsutsuki').note,/full ツ/);
});
test('initial introduction requires hiding reading before typed answer',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-ta');assert.equal(U.answer(s,'ta',NOW),s);assert.equal(U.reveal(s,NOW),s);s=U.beginRecall(s);s=U.answer(s,'ta',NOW);assert(s.feedback.correct&&U.validState(s));
});
test('Kunrei ti and tu accepted in original typed glyph answers',()=>{
 let s=U.resume(U.initialState());s=correct(s);s=U.beginRecall(s);s=U.answer(s,'TI',NOW);assert(s.feedback.correct&&U.validState(s));s=U.advance(s);s=U.beginRecall(s);s=U.answer(s,'TU',NOW);assert(s.feedback.correct&&U.validState(s));
});
test('checkpoint blocks early Stage B and preserves 15 original records on pause/reload',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<15;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.answer(s,'tsukue'),s);assert.equal(U.advance(s),s);
 const records=structuredClone(s.records);s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));assert(U.atCheckpoint(s));assert.deepEqual(s.records,records);s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'word-tsukue');
});
test('perfect 31-answer run preserves truthful independent stage summaries',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===31);
 const score=U.summary(s);assert.equal(score.stageA,15);assert.equal(score.stageB,16);for(const m of U.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong first, reveal and incorrect final contrast do not overwrite independent evidence',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'to',NOW):i===11?U.reveal(s,NOW):i===30?U.answer(s,'ツクエ',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s),t.id);s=U.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-ta','word-kutsu','contrast-meaning-shoes']);
 const originals=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s));assert.equal(s.records.length,34);assert.deepEqual(s.records.slice(0,31),originals);
 assert.equal(U.summary(s).corrected,3);
});
test('31 assisted reveals create bounded correction queue but no independent credit',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<31;i++){if(i===15)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,31);for(let i=0;i<31;i++)s=correct(s);
 assert(s.finished&&U.validState(s)&&s.records.length===62);for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('forged initial results, feedback and checkpoint rejected',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'ta',NOW);
 for(const change of [x=>{x.records[0].submitted='to';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='to';},x=>{x.checkpointPassed=true;},x=>{x.schema=8;}]){const bad=structuredClone(s);change(bad);assert(!U.validState(bad));}
});
test('Unit 23 isolated local progress key, previous three units unchanged',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-t-row:prototype-only:v1');
 assert(![S.STORAGE_KEY,K.STORAGE_KEY,V.STORAGE_KEY].includes(U.STORAGE_KEY));
 assert.equal(S.TASKS.length,31);assert.equal(K.TASKS.length,27);assert.equal(V.TASKS.length,23);
});
