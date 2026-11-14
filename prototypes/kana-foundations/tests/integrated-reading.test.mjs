import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../integrated-reading-engine.mjs';
import * as Prev from '../yoon-gjbp-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true);assert(U.validState(s));return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<28;i++){if(i===16)s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('28 original prompts, stages 16 + 12, no new kana',()=>{
 assert.equal(U.CHECKPOINT_INDEX,16);assert.equal(U.TASKS.length,28);assert.equal(U.KANA.length,0);
 assert.equal(new Set(U.TASKS.map(x=>x.id)).size,28);
 assert.deepEqual(U.MODES.map(m=>[m.id,m.total]),[['word',12],['phrase',8],['contrast',8]]);
 assert.deepEqual(U.TASKS.slice(0,16).map(t=>t.mode).reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{}),{word:12,contrast:4});
 assert.deepEqual(U.TASKS.slice(16).map(t=>t.mode).reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{}),{phrase:8,contrast:4});
});
test('all authentic words and sentences use only previously taught hiragana',()=>{
 const known=new Set([...U.PREVIOUS_KANA]);
 assert.deepEqual(U.WORDS.map(x=>x.kana),['きっぷ','がっこう','りょこう','びよういん','きょうしつ','ちゅうしゃじょう','じしょ','しゅうまつ','びょういん','さんびゃく','きゃく','しょくどう']);
 assert.deepEqual(U.EXPRESSIONS.map(x=>x.kana),['きょうはがっこうにいきます','きっぷをかいます','びょういんはどこですか','しゃしんをみせてください','あしたはやすみです','じゅぎょうはなんじですか','ちょっとまってください','りょこうがすきです']);
 for(const w of [...U.WORDS,...U.EXPRESSIONS]){assert([...w.kana].every(c=>known.has(c)),w.id);assert(w.meaning&&w.note&&/^[a-z]+$/.test(w.reading));}
});
test('real word contrast beauty salon/hospital and mora counts are consistent',()=>{
 const p=U.CONTRASTS.find(x=>x.id==='salon-hospital');
 assert.equal(p.answer,'びよういん');assert.match(p.note,/five morae/);assert.match(p.note,/four/);
 for(const [id,answer] of [['kippu-mora','3'],['parking-mora','5'],['wait-mora','6']])assert.equal(U.CONTRASTS.find(x=>x.id===id).answer,answer);
});
test('particles distinguish spoken o from permitted wo input convention',()=>{
 const obj=U.CONTRASTS.find(x=>x.id==='object-wo');assert.equal(obj.answer,'kippuo');
 assert.equal(U.CONTRASTS.find(x=>x.id==='topic-ha').answer,'kyouwa');
 assert(U.EXPRESSIONS.find(x=>x.id==='ticket').aliases.includes('kippuwokaimasu'));
 assert.equal(U.CONTRASTS.find(x=>x.id==='nasal-ni').answer,'byouinni');
});
test('all contrast choices contain one unambiguous correct response',()=>{
 for(const c of U.TASKS.filter(x=>x.mode==='contrast')){assert(c.choices.filter(x=>x.value===c.answer).length===1);assert(new Set(c.choices.map(x=>x.value)).size===c.choices.length);}
});
test('checkpoint is required and survives pause and reload',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<16;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);
 assert.equal(U.answer(s,'fake'),s);assert.equal(U.advance(s),s);
 s=U.pause(s);assert(U.validState(s));s=U.resume(JSON.parse(JSON.stringify(s)));
 assert(U.atCheckpoint(s));assert.equal(s.records.length,16);
 s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'phrase-school');
});
test('perfect session passes all prompts and preserves independent first scores',()=>{
 const s=full();assert(s.finished&&U.validState(s));assert.equal(s.records.length,28);
 const score=U.summary(s);assert.equal(score.stageA,16);assert.equal(score.stageB,12);
 for(const m of U.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong, revealed and false nasal choice preserve first evidence and separate corrections',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<28;i++){if(i===16)s=U.acknowledgeCheckpoint(s);const t=U.taskAt(s);
  s=i===0?U.answer(s,'kipu',NOW):i===5?U.reveal(s,NOW):i===26?U.answer(s,'byouini',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s));s=U.advance(s);}
 assert.deepEqual(s.corrections,['word-kippu','word-chuushajou','contrast-nasal-ni']);
 const first=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s));assert.deepEqual(s.records.slice(0,28),first);assert.equal(U.summary(s).corrected,3);
});
test('all revealed first responses create bounded correction-only evidence',()=>{
 let s=U.resume(U.initialState());
 for(let i=0;i<28;i++){if(i===16)s=U.acknowledgeCheckpoint(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,28);for(let i=0;i<28;i++)s=correct(s);
 assert(s.finished&&U.validState(s));assert.equal(s.records.length,56);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('tampered feedback and duplicate records fail closed',()=>{
 let s=U.resume(U.initialState());s=U.answer(s,'kippu',NOW);
 for(const alter of [x=>{x.records[0].submitted='kipu';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='kipu';},x=>{x.checkpointPassed=true;},x=>{x.index=16;},x=>{x.schema=2;}]){const fake=structuredClone(s);alter(fake);assert(!U.validState(fake));}
 s=U.pause(s);assert.equal(U.answer(s,'kippu'),s);
});
test('Unit 19 storage key is isolated and Unit 18 remains intact',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:integrated-reading:prototype-only:v1');
 assert.notEqual(U.STORAGE_KEY,Prev.STORAGE_KEY);assert.equal(Prev.TASKS.length,42);
});
