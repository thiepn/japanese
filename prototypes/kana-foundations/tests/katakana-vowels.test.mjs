import test from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../katakana-vowels-engine.mjs';
import * as Prior from '../integrated-reading-engine.mjs';
const NOW=Date.UTC(2026,10,15);
function correct(s){const t=U.taskAt(s);assert(t);if(t.mode==='introduction'&&!t.correction)s=U.beginRecall(s);s=U.answer(s,t.answer,NOW);assert.equal(s.feedback?.correct,true,t.id);assert(U.validState(s));return U.advance(s);}
function full(){let s=U.resume(U.initialState());for(let i=0;i<23;i++){if(i===13){assert(U.atCheckpoint(s));s=U.acknowledgeCheckpoint(s);}assert.equal(U.taskAt(s).id,U.TASKS[i].id);s=correct(s);}return s;}
test('five taught vowels match hiragana, not new sounds',()=>assert.deepEqual(U.KANA.map(k=>[k.kana,k.base,k.reading]),[['ア','あ','a'],['イ','い','i'],['ウ','う','u'],['エ','え','e'],['オ','お','o']]));
test('23 prompts and checkpoint: 5 introduction, 5 recognition, 1 word, 12 contrasts',()=>{
 assert.equal(U.TASKS.length,23);assert.equal(U.CHECKPOINT_INDEX,13);assert.equal(new Set(U.TASKS.map(t=>t.id)).size,23);
 assert.deepEqual(U.MODES.map(m=>m.total),[5,5,1,12]);assert.deepEqual(U.TASKS.slice(0,13).map(t=>t.mode).reduce((o,x)=>(o[x]=(o[x]||0)+1,o),{}),{introduction:5,recognition:5,word:1,contrast:2});assert(U.TASKS.slice(13).every(t=>t.mode==='contrast'&&t.stage==='b'));
});
test('only real word エア assessed in entirety; all others are first-vowel contexts',()=>{
 assert.deepEqual(U.WORDS.map(w=>[w.kana,w.reading]),[['エア','ea']]);const known=new Set(U.KANA.map(k=>k.kana));assert(U.WORDS.every(w=>[...w.kana].every(ch=>known.has(ch))));
 const ex=[['ice','アイス','ア'],['event','イベント','イ'],['virus','ウイルス','ウ'],['aircon','エアコン','エ'],['orange','オレンジ','オ']];
 for(const [id,word,first] of ex){const t=U.CONTRASTS.find(c=>c.id==='start-'+id);assert(t.kana.startsWith(word));assert.equal(t.answer,first);assert.match(t.note,/Only the initial/);assert(t.choices.every(([k])=>known.has(k)));}
});
test('5 recognition choices and 12 contrasts have one unambiguous correct answer',()=>{
 for(const t of U.TASKS.filter(t=>t.choices)){assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);assert.equal(t.choices.filter(c=>c.value===t.answer).length,1);}
 assert(U.TASKS.filter(t=>t.mode==='recognition').every(t=>t.choices.length===5));
});
test('active teaching required before independently scoring intro',()=>{
 let s=U.resume(U.initialState());assert.equal(U.taskAt(s).id,'intro-a');assert.equal(U.answer(s,'a'),s);assert.equal(U.reveal(s),s);s=U.beginRecall(s);s=U.answer(s,'a',NOW);assert(s.feedback.correct&&U.validState(s));
});
test('checkpoint saves 13 first attempts and cannot be skipped',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<13;i++)s=correct(s);assert(U.atCheckpoint(s));assert.equal(U.taskAt(s),null);assert.equal(U.advance(s),s);
 s=U.pause(s);s=U.resume(JSON.parse(JSON.stringify(s)));assert(U.atCheckpoint(s));assert.equal(s.records.length,13);s=U.acknowledgeCheckpoint(s);assert.equal(U.taskAt(s).id,'contrast-start-ice');
});
test('perfect run yields honest independent summary',()=>{
 const s=full();assert(s.finished&&U.validState(s)&&s.records.length===23);const out=U.summary(s);assert.equal(out.stageA,13);assert.equal(out.stageB,10);for(const m of U.MODES)assert.equal(out[m.id].independentCorrect,m.total);
});
test('wrong answer, reveal and incorrect correspondence preserve initial evidence through corrections',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<23;i++){if(i===13)s=U.acknowledgeCheckpoint(s);const t=U.taskAt(s);if(t.mode==='introduction')s=U.beginRecall(s);s=i===0?U.answer(s,'o',NOW):i===10?U.reveal(s,NOW):i===22?U.answer(s,'あ',NOW):U.answer(s,t.answer,NOW);assert(U.validState(s));s=U.advance(s);}
 assert.deepEqual(s.corrections,['intro-a','word-ea','contrast-hira-o']);const first=structuredClone(s.records);for(let i=0;i<3;i++)s=correct(s);assert(s.finished&&U.validState(s)&&s.records.length===26);assert.deepEqual(s.records.slice(0,23),first);
});
test('all 23 revealed responses produce bounded corrections without independent credit',()=>{
 let s=U.resume(U.initialState());for(let i=0;i<23;i++){if(i===13)s=U.acknowledgeCheckpoint(s);if(U.taskAt(s).mode==='introduction')s=U.beginRecall(s);s=U.advance(U.reveal(s,NOW));assert(U.validState(s));}assert.equal(s.corrections.length,23);for(let i=0;i<23;i++)s=correct(s);assert(s.finished&&U.validState(s));for(const m of U.MODES)assert.equal(U.summary(s)[m.id].independentCorrect,0);
});
test('tampering first attempt, feedback, or checkpoint causes state rejection',()=>{
 let s=U.resume(U.initialState());s=U.beginRecall(s);s=U.answer(s,'a',NOW);for(const f of [x=>{x.records[0].submitted='o';},x=>{x.records.push({...x.records[0]});},x=>{x.checkpointPassed=true;},x=>{x.feedback.answer='o';}]){const bad=structuredClone(s);f(bad);assert(!U.validState(bad));}
});
test('new storage namespace and old Unit 19 task inventories remain intact',()=>{assert.equal(U.STORAGE_KEY,'thiepn:kana-foundations:katakana-vowels:prototype-only:v1');assert.notEqual(U.STORAGE_KEY,Prior.STORAGE_KEY);assert.equal(Prior.TASKS.length,28);});
