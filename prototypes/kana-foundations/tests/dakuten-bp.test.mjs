import test from 'node:test';
import assert from 'node:assert/strict';
import * as BP from '../dakuten-bp-engine.mjs';
import * as GZ from '../dakuten-gz-engine.mjs';
import * as D from '../dakuten-d-engine.mjs';
import * as Review from '../reading-review-engine.mjs';
const when=Date.UTC(2026,10,13);
function correct(s,t=BP.taskAt(s),raw=t.answer){
 if(t.mode==='introduction'&&!t.correction)s=BP.beginRecall(s);
 s=BP.answer(s,raw,when);
 assert.equal(s.feedback?.correct,true,'correct response for '+t.id);
 assert(BP.validState(s),'submitted state valid for '+t.id);
 return BP.advance(s);
}
function completed(){
 let s=BP.resume(BP.initialState());
 for(let i=0;i<36;i++){
  if(i===17){assert(BP.atCheckpoint(s));s=BP.acknowledgeCheckpoint(s);}
  assert.equal(BP.taskAt(s)?.id,BP.TASKS[i].id);
  s=correct(s);
  assert(BP.validState(s),'valid after '+i);
 }
 return s;
}
test('Unit 14 exactly 36 first attempts: 17 B, 17 P, and two application prompts',()=>{
 assert.equal(BP.TASKS.length,36);
 assert.equal(new Set(BP.TASKS.map(t=>t.id)).size,36);
 assert.equal(BP.CHECKPOINT_INDEX,17);
 const count=tasks=>tasks.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{});
 const stage={introduction:5,recognition:5,word:5,contrast:2};
 assert.deepEqual(count(BP.TASKS.slice(0,17)),stage);
 assert.deepEqual(count(BP.TASKS.slice(17,34)),stage);
 assert.deepEqual(BP.TASKS.slice(34).map(t=>t.mode),['phrase','phrase']);
 assert.deepEqual(BP.TASKS.slice(17,22).map(t=>t.kana),[...'ぱぴぷぺぽ']);
 assert.deepEqual(BP.MODES.map(m=>m.total),[10,10,10,4,2]);
});
test('B-row dakuten and P-row handakuten are mapped correctly to shared bases',()=>{
 assert.deepEqual(BP.KANA.map(k=>k.kana),[...'ばびぶべぼぱぴぷぺぽ']);
 assert.deepEqual(BP.KANA.map(k=>k.base),[...'はひふへほはひふへほ']);
 assert.deepEqual(BP.KANA.map(k=>k.reading),['ba','bi','bu','be','bo','pa','pi','pu','pe','po']);
 assert(BP.KANA.slice(0,5).every(k=>k.stage==='b'));
 assert(BP.KANA.slice(5).every(k=>k.stage==='p'));
 assert.match(BP.KANA.find(k=>k.kana==='ぱ').note,/voiceless/);
 assert.match(BP.KANA.find(k=>k.kana==='ぷ').note,/English f/);
 assert.match(BP.KANA.find(k=>k.kana==='ぶ').note,/English f/);
});
test('all ten genuine words and both applications use only previously learned and newly learned kana',()=>{
 const allowed=new Set([...BP.PREVIOUS_KANA,...BP.KANA.map(x=>x.kana)]);
 assert.equal(allowed.size,71);
 assert.deepEqual(BP.WORDS.map(w=>[w.kana,w.reading]),[
  ['ばらばら','barabara'],['びん','bin'],['ぶた','buta'],['べんり','benri'],['ぼうし','boushi'],
  ['さんぱつ','sanpatsu'],['えんぴつ','enpitsu'],['てんぷら','tenpura'],['ぺこぺこ','pekopeko'],['さんぽ','sanpo']
 ]);
 for(const w of [...BP.WORDS,...BP.PHRASES])
  assert([...w.kana].every(c=>allowed.has(c)),'unintroduced character in '+w.id);
 assert.equal(new Set(BP.WORDS.map(w=>w.id)).size,10);
});
test('mimetic word meaning is contextual, and kanji or katakana conventions are not misrepresented',()=>{
 const hunger=BP.WORDS.find(w=>w.id==='pekopeko');
 assert.match(hunger.meaning,/context/);
 assert.match(hunger.note,/other meanings/);
 const barabara=BP.WORDS.find(w=>w.id==='barabara');
 assert.match(barabara.note,/mimetic/);
 assert.match(BP.WORDS.find(w=>w.id==='tenpura').note,/天ぷら or テンプラ/);
 assert.match(BP.WORDS.find(w=>w.id==='bin').note,/瓶 or ビン/);
 assert.match(BP.PHRASES.find(p=>p.id==='hungry').note,/other senses/);
});
test('two B-row contrasts and two three-way H/B/P contrasts grade exact marked characters',()=>{
 assert.deepEqual(BP.CONTRASTS.map(c=>[c.answer,c.choices]),[
  ['ば',['は','ば']],['ぼ',['ぼ','ほ']],['ぱ',['は','ば','ぱ']],['ぷ',['ふ','ぶ','ぷ']]
 ]);
 assert(BP.CONTRASTS.every(c=>c.choices.filter(x=>x===c.answer).length===1));
 for(const t of BP.TASKS.filter(x=>x.mode==='contrast')){
  assert(t.choices.some(c=>c.value===t.answer));
 }
});
test('17-prompt checkpoint cannot be bypassed; pause/reload/resume preserves first evidence',()=>{
 let s=BP.resume(BP.initialState());
 for(let i=0;i<17;i++)s=correct(s);
 assert(BP.atCheckpoint(s));
 assert.equal(BP.taskAt(s),null);
 assert.equal(BP.answer(s,'pa',when),s);
 assert.equal(BP.reveal(s,when),s);
 assert.equal(BP.advance(s),s);
 assert.equal(BP.beginRecall(s),s);
 s=BP.pause(s);
 const saved=JSON.parse(JSON.stringify(s));
 assert(BP.validState(saved));
 s=BP.resume(saved);
 assert(BP.atCheckpoint(s));
 assert.equal(s.records.length,17);
 s=BP.acknowledgeCheckpoint(s);
 assert.equal(BP.taskAt(s).id,'intro-pa');
 assert(BP.validState(s));
 assert.equal(BP.acknowledgeCheckpoint(s),s);
});
test('all 36 independent first attempts succeed; completed score denominators are exact',()=>{
 const s=completed();
 assert(s.finished);
 assert.equal(s.records.length,36);
 assert.equal(s.corrections.length,0);
 assert(BP.validState(JSON.parse(JSON.stringify(s))));
 const totals=BP.summary(s);
 assert.equal(totals.stageB,17);
 assert.equal(totals.stageP,17);
 for(const m of BP.MODES)
  assert.deepEqual(totals[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('long vowels and expression particle readings are meaningful and strictly scored',()=>{
 let s=BP.resume(BP.initialState());
 for(let i=0;i<14;i++)s=correct(s);
 assert.equal(BP.taskAt(s).id,'word-boushi');
 s=BP.answer(s,'boshi',when);
 assert.equal(s.feedback.correct,false,'long o omitted');
 s=BP.advance(s);
 s=correct(s);s=correct(s);
 assert(BP.atCheckpoint(s));
 s=BP.acknowledgeCheckpoint(s);
 for(let i=17;i<34;i++)s=correct(s);
 assert.equal(BP.taskAt(s).id,'phrase-where-hat');
 s=BP.answer(s,'boushihadokodesuka',when);
 assert.equal(s.feedback.correct,false,'topic particle is wa, not ha');
 s=BP.advance(s);
 assert.equal(BP.taskAt(s).id,'phrase-hungry');
 s=BP.answer(s,'onakagapekopeko',when);
 assert.equal(s.feedback.correct,true);
});
test('three wrong, revealed or incorrect B/P contrast first attempts trigger separate corrections',()=>{
 let s=BP.resume(BP.initialState());
 for(let i=0;i<36;i++){
  if(i===17)s=BP.acknowledgeCheckpoint(s);
  const t=BP.taskAt(s);
  if(t.mode==='introduction')s=BP.beginRecall(s);
  s=i===0?BP.answer(s,'ha',when)
   :i===12?BP.reveal(s,when)
   :i===32?BP.answer(s,'ば',when)
   :BP.answer(s,t.answer,when);
  assert(BP.validState(s),'valid at '+i);
  s=BP.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-ba','word-buta','contrast-pa-ha-ba']);
 const first=structuredClone(s.records);
 for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished);
 assert.equal(s.records.length,39);
 assert.deepEqual(s.records.slice(0,36),first,'corrections cannot replace original evidence');
 assert.equal(BP.summary(s).corrected,3);
 assert.equal(BP.summary(s).introduction.independentCorrect,9);
 assert.equal(BP.summary(s).word.independentCorrect,9);
 assert.equal(BP.summary(s).contrast.independentCorrect,3);
});
test('maximum 72 evidence rows: 36 revealed first attempts plus 36 successful corrections',()=>{
 let s=BP.resume(BP.initialState());
 for(let i=0;i<36;i++){
  if(i===17)s=BP.acknowledgeCheckpoint(s);
  if(BP.taskAt(s).mode==='introduction')s=BP.beginRecall(s);
  s=BP.advance(BP.reveal(s,when));
  assert(BP.validState(s));
 }
 assert.deepEqual(s.corrections,BP.TASKS.map(t=>t.id));
 assert.equal(s.records.length,36);
 for(let i=0;i<36;i++)s=correct(s);
 assert.equal(s.records.length,72);
 assert(s.finished);
 assert(BP.validState(s));
 assert.equal(BP.summary(s).corrected,36);
 for(const m of BP.MODES)assert.equal(BP.summary(s)[m.id].independentCorrect,0);
});
test('the validator rejects corrupted, duplicated, skipped or forged first attempt evidence',()=>{
 let s=BP.resume(BP.initialState());
 s=BP.beginRecall(s);s=BP.answer(s,'ba',when);
 assert.equal(BP.answer(s,'ha',when),s,'cannot change first answer');
 let invalid=structuredClone(s);invalid.records[0].submitted='ha';assert(!BP.validState(invalid));
 invalid=structuredClone(s);invalid.feedback.answer='pa';assert(!BP.validState(invalid));
 invalid=structuredClone(s);invalid.records.push(structuredClone(invalid.records[0]));assert(!BP.validState(invalid));
 invalid=structuredClone(s);invalid.index=12;assert(!BP.validState(invalid));
 invalid=structuredClone(s);invalid.checkpointPassed=true;assert(!BP.validState(invalid));
 s=BP.pause(s);assert(BP.validState(s));assert.equal(BP.answer(s,'ha',when),s);
});
test('input normalization handles NFKC, spacing, and case but no guessed readings',()=>{
 assert.equal(BP.normalize(' ＢＯＵＳＨＩ ＷＡ ＤＯＫＯ-ＤＥＳＵＫＡ '),'boushiwadokodesuka');
 assert.equal(BP.normalize('TENPURA'),'tenpura');
 assert.equal(BP.TASKS[34].answer,'boushiwadokodesuka');
 assert.equal(BP.TASKS[35].answer,'onakagapekopeko');
});
test('Unit 14 saved progress is isolated from Unit 12, Unit 13, Review, Account, FSRS',()=>{
 const keys=[BP.STORAGE_KEY,GZ.STORAGE_KEY,D.STORAGE_KEY,Review.STORAGE_KEY,'thiepn:account','thiepn:fsrs'];
 assert.equal(new Set(keys).size,keys.length);
 assert.equal(BP.STORAGE_KEY,'thiepn:kana-foundations:dakuten-bp:prototype-only:v1');
 assert.equal(GZ.TASKS.length,36);
 assert.equal(D.TASKS.length,23);
 assert.equal(Review.TASKS.length,17);
});
