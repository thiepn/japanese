import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from '../yoon-kshch-engine.mjs';
import * as S from '../sokuon-rhythm-engine.mjs';
import * as BP from '../dakuten-bp-engine.mjs';
const at=Date.UTC(2026,10,14);
function correct(s,t=Y.taskAt(s),input=t.answer){
 if(t.mode==='introduction'&&!t.correction)s=Y.beginRecall(s);
 s=Y.answer(s,input,at);
 assert.equal(s.feedback?.correct,true,'correct '+t.id);
 assert(Y.validState(s),'valid response '+t.id);
 return Y.advance(s);
}
function full(){
 let s=Y.resume(Y.initialState());
 for(let i=0;i<Y.TASKS.length;i++){
  if(i===20){assert(Y.atCheckpoint(s));s=Y.acknowledgeCheckpoint(s);}
  assert.equal(Y.taskAt(s)?.id,Y.TASKS[i].id);
  s=correct(s);
  assert(Y.validState(s),'valid state '+i);
 }
 return s;
}
test('exact 33 original prompts with two stages and a checkpoint at 20',()=>{
 assert.equal(Y.TASKS.length,33);
 assert.equal(new Set(Y.TASKS.map(t=>t.id)).size,33);
 assert.equal(Y.CHECKPOINT_INDEX,20);
 const count=tasks=>tasks.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{});
 assert.deepEqual(count(Y.TASKS.slice(0,20)),{introduction:6,recognition:6,word:6,contrast:2});
 assert.deepEqual(count(Y.TASKS.slice(20)),{introduction:3,recognition:3,word:3,contrast:2,phrase:2});
 assert.deepEqual(Y.MODES.map(m=>m.total),[9,9,9,4,2]);
});
test('all nine K/SH/CH yōon forms use i-row bases and small kana',()=>{
 assert.deepEqual(Y.KANA.map(k=>k.kana),['きゃ','きゅ','きょ','しゃ','しゅ','しょ','ちゃ','ちゅ','ちょ']);
 assert.deepEqual(Y.KANA.map(k=>k.reading),['kya','kyu','kyo','sha','shu','sho','cha','chu','cho']);
 assert.deepEqual(Y.KANA.map(k=>k.base),['き','き','き','し','し','し','ち','ち','ち']);
 assert(Y.KANA.every(k=>['ゃ','ゅ','ょ'].some(sm=>k.kana.endsWith(sm))));
 assert(Y.KANA.slice(0,6).every(k=>k.stage==='a'));
 assert(Y.KANA.slice(6).every(k=>k.stage==='b'));
});
test('mora explanations distinguish contracted yōon from two full-size kana',()=>{
 assert.match(Y.KANA[0].note,/one mora/);
 assert.match(Y.KANA[0].note,/two morae/);
 assert.match(Y.WORDS.find(w=>w.id==='kyou').note,/two morae/);
 assert.match(Y.WORDS.find(w=>w.id==='chotto').note,/three morae/);
 assert.match(Y.WORDS.find(w=>w.id==='chuui').note,/three morae/);
});
test('authentic hiragana-first words are all decodable with known kana and nine additions',()=>{
 const known=new Set([...Y.PREVIOUS_KANA,'ゃ','ゅ','ょ']);
 assert.deepEqual(Y.WORDS.map(w=>[w.kana,w.reading]),[
 ['きゃく','kyaku'],['きゅうり','kyuuri'],['きょう','kyou'],['しゃしん','shashin'],['しゅみ','shumi'],
 ['しょうゆ','shouyu'],['おちゃ','ocha'],['ちゅうい','chuui'],['ちょっと','chotto']
 ]);
 for(const w of [...Y.WORDS,...Y.EXPRESSIONS]){
  assert([...w.kana].every(c=>known.has(c)),'unintroduced character in '+w.id);
  assert(w.note);
 }
});
test('real-word contrasts きゃく/きやく and きょう/きよう include correct meanings and morae',()=>{
 const [a,b]=Y.CONTRASTS;
 assert.equal(a.answer,'きゃく');
 assert.deepEqual(a.choices.map(x=>x[0]),['きやく','きゃく']);
 assert.match(a.note,/規約/);assert.match(a.note,/three morae/);
 assert.equal(b.answer,'きょう');
 assert.deepEqual(b.choices.map(x=>x[0]),['きょう','きよう']);
 assert.match(b.note,/器用/);assert.match(b.note,/three/);
});
test('Stage B contrasts small ちゃ from ちや, and counts three morae in ちょっと',()=>{
 const [a,b]=Y.CONTRASTS.slice(2);
 assert.equal(a.answer,'ちゃ');
 assert.deepEqual(a.choices.map(x=>x[0]),['ちや','ちゃ']);
 assert.equal(b.answer,'3');
 assert.deepEqual(b.choices.map(x=>x[0]),['2','3','4']);
 assert.match(b.note,/ちょ・っ・と/);
});
test('two cumulative expressions are authentic and preserve long vowels and particles',()=>{
 assert.deepEqual(Y.EXPRESSIONS.map(p=>[p.kana,p.reading]),[
 ['しゃしんをみる','shashinomiru'],['きょうはおちゃをのむ','kyouwaochaonomu']
 ]);
 assert(Y.EXPRESSIONS[0].aliases.includes('syasinomiru'));
 assert(Y.EXPRESSIONS[1].aliases.includes('kyouwaotyanomu'));
 assert.match(Y.EXPRESSIONS[1].note,/は/);
 assert.match(Y.EXPRESSIONS[1].note,/を/);
});
test('one canonical choice per recognition, no ambiguous alias-as-distractor',()=>{
 for(const t of Y.TASKS.filter(t=>t.mode==='recognition')){
  assert.equal(t.choices.filter(x=>x.value===t.answer).length,1);
  assert(t.choices.every(c=>Y.KANA.some(k=>k.reading===c.value)));
  assert.equal(new Set(t.choices.map(c=>c.value)).size,t.choices.length);
 }
});
test('explicit text aliases are accepted but true extra mora and missing long vowels fail',()=>{
 const intro=Y.TASKS.find(t=>t.id==='intro-sha');
 const photo=Y.TASKS.find(t=>t.id==='word-shashin');
 assert(intro.aliases.includes('sya'));
 assert(photo.aliases.includes('syasin'));
 const choices=Y.TASKS.find(t=>t.id==='recognition-sha');
 assert.deepEqual(choices.aliases,[]);
 const kyaku=Y.TASKS.find(t=>t.id==='word-kyaku');
 assert(!kyaku.aliases.includes('kiyaku'));
 const kyou=Y.TASKS.find(t=>t.id==='word-kyou');
 assert(!kyou.aliases.includes('kyo'));
 assert.equal(Y.normalize(' ＳＨＡ ＳＨＩＮ '),'shashin');
 assert.notEqual(Y.normalize('kiyaku'),Y.normalize('kyaku'));
});
test('first twenty attempts are durable at checkpoint; attempts cannot bypass checkpoint',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<20;i++)s=correct(s);
 assert(Y.atCheckpoint(s));
 assert.equal(Y.taskAt(s),null);
 assert.equal(Y.answer(s,'cha',at),s);
 assert.equal(Y.reveal(s,at),s);
 assert.equal(Y.advance(s),s);
 assert.equal(Y.beginRecall(s),s);
 s=Y.pause(s);assert(Y.validState(s));
 s=Y.resume(JSON.parse(JSON.stringify(s)));
 assert(Y.atCheckpoint(s));
 assert.equal(s.records.length,20);
 s=Y.acknowledgeCheckpoint(s);
 assert.equal(Y.taskAt(s).id,'intro-cha');
 assert(Y.validState(s));
});
test('full perfect session yields 33 immutable first attempts and exact scores',()=>{
 const s=full();
 assert(s.finished);assert(Y.validState(s));
 assert.equal(s.records.length,33);
 assert.equal(s.corrections.length,0);
 const scores=Y.summary(s);
 assert.equal(scores.stageKSH,20);
 assert.equal(scores.stageCH,11);
 for(const m of Y.MODES)
  assert.deepEqual(scores[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong, revealed and mistaken mora-count originals create separate corrections',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<33;i++){
  if(i===20)s=Y.acknowledgeCheckpoint(s);
  const t=Y.taskAt(s);
  if(t.mode==='introduction')s=Y.beginRecall(s);
  s=i===0?Y.answer(s,'kiya',at)
   :i===14?Y.reveal(s,at)
   :i===30?Y.answer(s,'2',at)
   :Y.answer(s,t.answer,at);
  assert(Y.validState(s));
  s=Y.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-kya','word-kyou','contrast-chotto-mora']);
 const first=structuredClone(s.records);
 for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished);assert(Y.validState(s));
 assert.equal(s.records.length,36);
 assert.deepEqual(s.records.slice(0,33),first);
 assert.equal(Y.summary(s).corrected,3);
});
test('all revealed first responses plus corrections cap stored attempts at 66',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<33;i++){
  if(i===20)s=Y.acknowledgeCheckpoint(s);
  if(Y.taskAt(s).mode==='introduction')s=Y.beginRecall(s);
  s=Y.advance(Y.reveal(s,at));
  assert(Y.validState(s));
 }
 assert.equal(s.records.length,33);
 assert.equal(s.corrections.length,33);
 for(let i=0;i<33;i++)s=correct(s);
 assert(s.finished);assert.equal(s.records.length,66);assert(Y.validState(s));
 for(const m of Y.MODES)assert.equal(Y.summary(s)[m.id].independentCorrect,0);
});
test('validator refuses edited first attempts, duplicate records and forged checkpoint',()=>{
 let s=Y.resume(Y.initialState());s=Y.beginRecall(s);s=Y.answer(s,'kya',at);
 assert.equal(Y.answer(s,'kiya',at),s);
 for(const change of [
  x=>{x.records[0].submitted='kiya';},
  x=>{x.records.push({...x.records[0]});},
  x=>{x.feedback.answer='kiya';},
  x=>{x.checkpointPassed=true;},
  x=>{x.index=20;}
 ]){
  const corrupted=structuredClone(s);
  change(corrupted);
  assert(!Y.validState(corrupted));
 }
 s=Y.pause(s);assert(Y.validState(s));assert.equal(Y.answer(s,'kiya',at),s);
});
test('Unit 16 storage key is isolated; previous units and Account/FSRS untouched',()=>{
 assert.equal(Y.STORAGE_KEY,'thiepn:kana-foundations:yoon-kshch:prototype-only:v1');
 assert.notEqual(Y.STORAGE_KEY,S.STORAGE_KEY);
 assert.notEqual(Y.STORAGE_KEY,BP.STORAGE_KEY);
 assert.equal(S.TASKS.length,24);
 assert.equal(BP.TASKS.length,36);
});
