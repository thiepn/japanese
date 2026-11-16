import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-k-row-engine.mjs';
import * as Prev from '../katakana-vowels-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s),t.id);return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<U.TASKS.length;i++){if(i===U.CHECKPOINT_INDEX){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('K-row has five standard katakana with matching hiragana',()=>assert.deepEqual(U.KANA.map(k=>[k.id,k.kana,k.base,k.reading]),[['ka','カ','か','ka'],['ki','キ','き','ki'],['ku','ク','く','ku'],['ke','ケ','け','ke'],['ko','コ','こ','ko']]));
test('27 distinct original prompts, checkpoint 15 and exact modes',()=>{
 assert.equal(U.TASKS.length,27);assert.equal(U.CHECKPOINT_INDEX,15);assert.equal(new Set(U.TASKS.map(t=>t.id)).size,27);
 assert.deepEqual(U.MODES.map(x=>[x.id,x.total]),[['introduction',5],['recognition',5],['word',7],['contrast',10]]);
 const tally=a=>a.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{});
 assert.deepEqual(tally(U.TASKS.slice(0,15)),{introduction:5,recognition:5,word:3,contrast:2});
 assert.deepEqual(tally(U.TASKS.slice(15)),{word:4,contrast:8});
});
test('seven genuine fully decodable words use only Units 20–21 katakana',()=>{
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['カキ','kaki'],['キク','kiku'],['コケ','koke'],['キウイ','kiui'],['ココア','kokoa'],['カカオ','kakao'],['エコ','eko']]);
 const known=new Set([...Prev.KANA.map(k=>k.kana),...U.KANA.map(k=>k.kana)]);
 for(const w of U.WORDS){assert([...w.kana].every(c=>known.has(c)),w.id);assert(w.meaning&&w.note);assert(/^[a-z]+$/.test(w.reading));}
 assert.equal(U.EXPRESSIONS.length,0);
});
test('context-sensitive natural words do not conflate persimmon and oyster',()=>{
 const oyster=U.WORDS.find(w=>w.id==='kaki');
 assert.match(oyster.meaning,/oyster/);assert.match(oyster.note,/persimmon/);assert.equal(oyster.kanji,'牡蠣');
 assert.equal(U.WORDS.find(w=>w.id==='kiku').kanji,'菊');
 assert.equal(U.WORDS.find(w=>w.id==='koke').kanji,'苔');
});
test('cocoa and cacao are distinct words with distinct unambiguous meanings',()=>{
 assert.equal(U.WORDS.find(w=>w.id==='kokoa').reading,'kokoa');
 assert.equal(U.WORDS.find(w=>w.id==='kakao').reading,'kakao');
 assert.equal(U.CONTRASTS.find(c=>c.id==='cocoa').answer,'ココア');
 assert.equal(U.CONTRASTS.find(c=>c.id==='kiwi').answer,'キウイ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='moss').answer,'コケ');
});
test('all five hiragana transfer choices and two katakana-vs-hiragana tests are correct',()=>{
 for(const k of U.KANA){const t=U.CONTRASTS.find(c=>c.id==='hira-'+k.id);assert(t);assert.equal(t.answer,k.base);}
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-ka').answer,'カ');
 assert.equal(U.CONTRASTS.find(c=>c.id==='script-ke').answer,'ケ');
});
test('recognition has five distinct romanizations and contrasts a single correct choice',()=>{
 for(const t of U.TASKS.filter(t=>t.choices)){assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);}
 assert(U.TASKS.filter(t=>t.mode==='recognition').every(t=>t.choices.length===5));
});
test('active form introduction hides first answer until recall requested',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-ka');assert.equal(U.answer(s,'ka',NOW),s);assert.equal(U.reveal(s,NOW),s);
 s=U.beginRecall(s);s=U.answer(s,'ka',NOW);assert(s.feedback?.correct);assert(U.validState(s));
});
test('checkpoint after 15 first records blocks premature actions and survives reload',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<15;i++)s=correct(s);
 assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.answer(s,'kiui'),s);assert.equal(U.advance(s),s);
 s=U.pause(s);assert(U.validState(s));s=U.resume(JSON.parse(JSON.stringify(s)));assert(U.atCheckpoint(s)&&s.records.length===15);
 s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'word-kiui');
});
test('perfect session preserves 27 independently correct first records',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===27);
 const score=U.summary(s);assert.equal(score.stageA,15);assert.equal(score.stageB,12);
 for(const m of U.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong, reveal and script error create immutable first evidence and separate corrections',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<27;i++){
  if(i===15)s=U.acknowledgeCheckpoint(s);const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);
  s=i===0?U.answer(s,'ko',NOW):i===11?U.reveal(s,NOW):i===26?U.answer(s,'キク',NOW):U.answer(s,t.answer,NOW);
  assert(U.validState(s),t.id);s=U.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-ka','word-kiku','contrast-moss']);
 const original=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&U.validState(s));assert.deepEqual(s.records.slice(0,27),original);assert.equal(U.summary(s).corrected,3);
});
test('all 27 revealed responses yield bounded corrections but zero independent credit',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<27;i++){if(i===15)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}
 assert.equal(s.corrections.length,27);for(let i=0;i<27;i++)s=correct(s);
 assert(s.finished&&U.validState(s));assert.equal(s.records.length,54);
 for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('tampered answer records and forged checkpoint fail validation',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'ka',NOW);
 for(const change of [x=>{x.records[0].submitted='ko';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='ko';},x=>{x.checkpointPassed=true;},x=>{x.schema=5;}]){const bad=structuredClone(s);change(bad);assert(!U.validState(bad));}
});
test('dedicated key and previous unit inventory remain unchanged',()=>{
 assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-k-row:prototype-only:v1');assert.notEqual(U.STORAGE_KEY,Prev.STORAGE_KEY);assert.equal(Prev.TASKS.length,23);
});
