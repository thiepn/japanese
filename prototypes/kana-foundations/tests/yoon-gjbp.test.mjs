import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from '../yoon-gjbp-engine.mjs';
import * as U17 from '../yoon-nhmr-engine.mjs';
import * as U16 from '../yoon-kshch-engine.mjs';
const now=Date.UTC(2026,10,14);
function correct(s,input=Y.taskAt(s)?.answer){
 const t=Y.taskAt(s);assert(t);
 if(t.mode==='introduction'&&!t.correction)s=Y.beginRecall(s);
 s=Y.answer(s,input,now);
 assert.equal(s.feedback?.correct,true,t.id);
 assert(Y.validState(s),'state valid after '+t.id);
 return Y.advance(s);
}
function complete(){
 let s=Y.resume(Y.initialState());
 for(let i=0;i<Y.TASKS.length;i++){
  if(i===Y.CHECKPOINT_INDEX){assert(Y.atCheckpoint(s));s=Y.acknowledgeCheckpoint(s);}
  assert.equal(Y.taskAt(s)?.id,Y.TASKS[i].id);
  s=correct(s);assert(Y.validState(s));
 }
 return s;
}
test('Unit 18 has 42 first prompts with the fixed G/J and B/P checkpoint structure',()=>{
 assert.equal(Y.TASKS.length,42);assert.equal(Y.CHECKPOINT_INDEX,20);
 assert.equal(new Set(Y.TASKS.map(t=>t.id)).size,Y.TASKS.length);
 const tally=arr=>arr.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{});
 assert.deepEqual(tally(Y.TASKS.slice(0,20)),{introduction:6,recognition:6,word:6,contrast:2});
 assert.deepEqual(tally(Y.TASKS.slice(20)),{introduction:6,recognition:6,word:6,contrast:2,phrase:2});
 assert.deepEqual(Y.MODES.map(x=>x.total),[12,12,12,4,2]);
});
test('12 voiced kana map exactly to underlying i-row and small yōon',()=>{
 assert.deepEqual(Y.KANA.map(k=>k.kana),['ぎゃ','ぎゅ','ぎょ','じゃ','じゅ','じょ','びゃ','びゅ','びょ','ぴゃ','ぴゅ','ぴょ']);
 assert.deepEqual(Y.KANA.map(k=>k.reading),['gya','gyu','gyo','ja','ju','jo','bya','byu','byo','pya','pyu','pyo']);
 assert.deepEqual(Y.KANA.map(k=>k.base),['ぎ','ぎ','ぎ','じ','じ','じ','び','び','び','ぴ','ぴ','ぴ']);
 assert(Y.KANA.every(k=>/[ゃゅょ]$/.test(k.kana)));
 assert(Y.KANA.slice(0,6).every(k=>k.stage==='a'));
 assert(Y.KANA.slice(6).every(k=>k.stage==='b'));
});
test('12 genuine words include number sandhi and onomatopoeia without fabricated rare byu/pyu vocabulary',()=>{
 assert.deepEqual(Y.WORDS.map(x=>[x.kana,x.reading]),[
  ['ぎゃく','gyaku'],['ぎゅうにゅう','gyuunyuu'],['ぎょうじ','gyouji'],
  ['じゃま','jama'],['じゅぎょう','jugyou'],['じょうず','jouzu'],
  ['さんびゃく','sanbyaku'],['びょういん','byouin'],['びょうき','byouki'],
  ['ろっぴゃく','roppyaku'],['はっぴゃく','happyaku'],['ぴょんぴょん','pyonpyon']
 ]);
 const known=new Set([...Y.PREVIOUS_KANA,'ゃ','ゅ','ょ']);
 for(const w of [...Y.WORDS,...Y.EXPRESSIONS]){
  assert([...w.kana].every(c=>known.has(c)),w.id+' unintroduced kana');
  assert(w.meaning&&w.note);
 }
 assert(!Y.WORDS.some(w=>w.kana.includes('びゅ')||w.kana.includes('ぴゅ')));
 assert.match(Y.WORDS.find(w=>w.id==='pyonpyon').meaning,/sound-symbolic/);
});
test('canonical spelling, alternate J-row keyboard conventions, and strict long vowels',()=>{
 for(const [id,aliases] of [['ja',['zya','jya']],['ju',['zyu','jyu']],['jo',['zyo','jyo']]]){
  const t=Y.TASKS.find(t=>t.id==='intro-'+id);
  assert.deepEqual(t.aliases,aliases);
  const recognition=Y.TASKS.find(t=>t.id==='recognition-'+id);
  assert.deepEqual(recognition.aliases,[]);
 }
 assert.deepEqual(Y.WORDS.find(w=>w.id==='jugyou').aliases,['zyugyou','jyugyou']);
 assert(!Y.WORDS.find(w=>w.id==='gyuunyuu').aliases?.includes('gyunyu'));
 assert.equal(Y.normalize(' ＪＵ ＧＹＯＵ '),'jugyou');
 assert.notEqual(Y.normalize('jiyuu'),Y.normalize('juu'));
});
test('contrasts teach correct meaning of freedom, 300 voicing and four-mora 800',()=>{
 assert.deepEqual(Y.CONTRASTS.map(x=>x.answer),['ぎゃく','じゆう','さんびゃく','4']);
 assert.match(Y.CONTRASTS[0].note,/not taught as a word/);
 assert.match(Y.CONTRASTS[1].note,/自由/);
 assert.match(Y.CONTRASTS[2].note,/not a second vocabulary item/);
 assert.match(Y.CONTRASTS[3].note,/は・っ・ぴゃ・く/);
});
test('expressions respect authentic object particle and destination particle',()=>{
 assert.deepEqual(Y.EXPRESSIONS.map(x=>[x.kana,x.reading]),[
  ['ぎゅうにゅうをのみます','gyuunyuuonomimasu'],
  ['びょういんにいきます','byouinniikimasu']
 ]);
 assert(Y.EXPRESSIONS[0].aliases.includes('gyuunyuuwonomimasu'));
 assert(!Y.EXPRESSIONS[1].aliases?.includes('byouiniikimasu'));
});
test('recognition choices have six unique standard readings and one correct answer',()=>{
 for(const t of Y.TASKS.filter(t=>t.mode==='recognition')){
  assert.equal(t.choices.length,6);
  assert.equal(t.choices.filter(x=>x.value===t.answer).length,1);
  assert.equal(new Set(t.choices.map(x=>x.value)).size,6);
  assert(t.choices.every(x=>Y.KANA.some(k=>k.reading===x.value)));
 }
});
test('first twenty persisted answers cannot pass checkpoint without acknowledgement',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<20;i++)s=correct(s);
 assert(Y.atCheckpoint(s));assert.equal(Y.taskAt(s),null);
 assert.equal(Y.answer(s,'bya',now),s);assert.equal(Y.reveal(s,now),s);
 assert.equal(Y.beginRecall(s),s);assert.equal(Y.advance(s),s);
 s=Y.pause(s);assert(Y.validState(s));
 s=Y.resume(JSON.parse(JSON.stringify(s)));
 assert(Y.atCheckpoint(s));assert.equal(s.records.length,20);
 s=Y.acknowledgeCheckpoint(s);assert.equal(Y.taskAt(s).id,'intro-bya');
});
test('full perfect run keeps 42 independent immutable first attempts and stages',()=>{
 const s=complete();assert(s.finished&&Y.validState(s));
 assert.equal(s.records.length,42);assert.equal(s.corrections.length,0);
 const score=Y.summary(s);
 assert.equal(score.stageGJ,20);assert.equal(score.stageBP,20);
 for(const m of Y.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong, revealed and wrong-mora first attempts create corrections without changing evidence',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<42;i++){
  if(i===20)s=Y.acknowledgeCheckpoint(s);
  const t=Y.taskAt(s);
  if(t.mode==='introduction')s=Y.beginRecall(s);
  s=i===0?Y.answer(s,'giya',now):i===13?Y.reveal(s,now):i===39?Y.answer(s,'3',now):Y.answer(s,t.answer,now);
  assert(Y.validState(s),'answer '+i);s=Y.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-gya','word-gyuunyuu','contrast-happyaku-mora']);
 const first=structuredClone(s.records);
 for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&Y.validState(s));assert.equal(s.records.length,45);
 assert.deepEqual(s.records.slice(0,42),first);
 assert.equal(Y.summary(s).corrected,3);
 for(const mode of Y.MODES)assert(Y.summary(s)[mode.id].independentCorrect<=mode.total);
});
test('all revealed first attempts and all corrected attempts remain separately countable',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<42;i++){
  if(i===20)s=Y.acknowledgeCheckpoint(s);
  if(Y.taskAt(s).mode==='introduction')s=Y.beginRecall(s);
  s=Y.advance(Y.reveal(s,now));assert(Y.validState(s));
 }
 assert.equal(s.corrections.length,42);
 for(let i=0;i<42;i++)s=correct(s);
 assert(s.finished&&Y.validState(s));assert.equal(s.records.length,84);
 for(const m of Y.MODES)assert.equal(Y.summary(s)[m.id].independentCorrect,0);
});
test('tampered history, repeated records and fabricated checkpoint cannot validate',()=>{
 let s=Y.resume(Y.initialState());s=Y.beginRecall(s);s=Y.answer(s,'gya',now);
 for(const alter of [x=>{x.records[0].submitted='giya';},x=>{x.records.push({...x.records[0]});},x=>{x.feedback.answer='giya';},x=>{x.checkpointPassed=true;},x=>{x.index=20;}]){
  const fake=structuredClone(s);alter(fake);assert(!Y.validState(fake));
 }
 s=Y.pause(s);assert(Y.validState(s));assert.equal(Y.answer(s,'gya',now),s);
});
test('Unit 18 has a separate storage key and preserves previous task inventories',()=>{
 assert.equal(Y.STORAGE_KEY,'thiepn:kana-foundations:yoon-gjbp:prototype-only:v1');
 assert.notEqual(Y.STORAGE_KEY,U17.STORAGE_KEY);assert.notEqual(Y.STORAGE_KEY,U16.STORAGE_KEY);
 assert.equal(U17.TASKS.length,39);assert.equal(U16.TASKS.length,33);
});
