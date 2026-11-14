import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from '../yoon-nhmr-engine.mjs';
import * as U16 from '../yoon-kshch-engine.mjs';
const now=Date.UTC(2026,10,14);
function correct(s){
 const t=Y.taskAt(s);assert(t);
 if(t.mode==='introduction'&&!t.correction)s=Y.beginRecall(s);
 s=Y.answer(s,t.answer,now);
 assert.equal(s.feedback?.correct,true,t.id);
 assert(Y.validState(s),t.id);
 return Y.advance(s);
}
function complete(){
 let s=Y.resume(Y.initialState());
 for(let i=0;i<Y.TASKS.length;i++){
  if(i===Y.CHECKPOINT_INDEX){assert(Y.atCheckpoint(s));s=Y.acknowledgeCheckpoint(s);}
  assert.equal(Y.taskAt(s)?.id,Y.TASKS[i].id);
  s=correct(s);
 }
 return s;
}
test('Unit 17 has 39 original prompts, honest stage counts and a checkpoint at 18',()=>{
 assert.equal(Y.TASKS.length,39);
 assert.equal(new Set(Y.TASKS.map(t=>t.id)).size,39);
 assert.equal(Y.CHECKPOINT_INDEX,18);
 const count=ts=>ts.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{});
 assert.deepEqual(count(Y.TASKS.slice(0,18)),{introduction:6,recognition:6,word:4,contrast:2});
 assert.deepEqual(count(Y.TASKS.slice(18)),{introduction:6,recognition:6,word:5,contrast:2,phrase:2});
 assert.deepEqual(Y.MODES.map(m=>m.total),[12,12,9,4,2]);
});
test('all twelve contracted forms have exact bases and kana mappings',()=>{
 assert.deepEqual(Y.KANA.map(x=>x.kana),['にゃ','にゅ','にょ','ひゃ','ひゅ','ひょ','みゃ','みゅ','みょ','りゃ','りゅ','りょ']);
 assert.deepEqual(Y.KANA.map(x=>x.reading),['nya','nyu','nyo','hya','hyu','hyo','mya','myu','myo','rya','ryu','ryo']);
 assert.deepEqual(Y.KANA.map(x=>x.base),['に','に','に','ひ','ひ','ひ','み','み','み','り','り','り']);
 assert(Y.KANA.every(x=>x.kana.endsWith('ゃ')||x.kana.endsWith('ゅ')||x.kana.endsWith('ょ')));
});
test('word inventory contains authentic kana-decodable words without forcing uncommon sounds',()=>{
 assert.deepEqual(Y.WORDS.map(x=>[x.kana,x.reading]),[
  ['にゃんこ','nyanko'],['にゅうがく','nyuugaku'],['ひゃく','hyaku'],['ひょうじ','hyouji'],
  ['みゃく','myaku'],['みょうじ','myouji'],['しょうりゃく','shouryaku'],['りゅう','ryuu'],['りょうり','ryouri']
 ]);
 const known=new Set([...Y.PREVIOUS_KANA,'ゃ','ゅ','ょ']);
 for(const t of [...Y.WORDS,...Y.EXPRESSIONS]){
  assert([...t.kana].every(c=>known.has(c)),t.id+' uses new kana');
  assert(t.meaning&&t.note);
 }
 assert(!Y.WORDS.some(w=>['にょ','ひゅ','みゅ'].some(k=>w.kana.includes(k))));
});
test('contrasts do not invent word meanings, and maintain correct mora counts',()=>{
 assert.deepEqual(Y.CONTRASTS.map(c=>c.answer),['にゃ','ひょう','3','りょう']);
 assert.match(Y.CONTRASTS[0].note,/not presented as a vocabulary word/);
 assert.match(Y.CONTRASTS[1].note,/費用/);
 assert.match(Y.CONTRASTS[2].note,/みょ・う・じ/);
 assert.match(Y.CONTRASTS[3].note,/利用/);
});
test('expressions are real and particle を is pronounced o',()=>{
 assert.deepEqual(Y.EXPRESSIONS.map(x=>[x.kana,x.reading]),[
  ['ひゃくえんです','hyakuendesu'],['りょうりをする','ryouriosuru']
 ]);
 assert(Y.EXPRESSIONS[1].aliases.includes('ryouriwosuru'));
 assert(!Y.EXPRESSIONS[1].aliases.includes('ryourisuru'));
});
test('recognition has unique exact canonical choices; length distinctions reject skipped morae',()=>{
 for(const t of Y.TASKS.filter(t=>t.mode==='recognition')){
  assert.equal(t.choices.filter(x=>x.value===t.answer).length,1);
  assert.equal(new Set(t.choices.map(x=>x.value)).size,t.choices.length);
  assert(t.choices.length===6);
 }
 assert.equal(Y.normalize(' ＲＹＯ ＵＲＩ '),'ryouri');
 let s=Y.resume(Y.initialState());s=Y.beginRecall(s);
 s=Y.answer(s,'niya',now);assert.equal(s.feedback.correct,false);
 assert(!Y.WORDS.find(x=>x.id==='nyuugaku').aliases?.includes('niyuugaku'));
});
test('checkpoint cannot be skipped and survives pause/reload without rewriting records',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<18;i++)s=correct(s);
 assert(Y.atCheckpoint(s));assert.equal(Y.taskAt(s),null);
 assert.equal(Y.answer(s,'mya',now),s);assert.equal(Y.reveal(s,now),s);assert.equal(Y.advance(s),s);
 s=Y.pause(s);assert(Y.validState(s));s=Y.resume(JSON.parse(JSON.stringify(s)));
 assert(Y.atCheckpoint(s));assert.equal(s.records.length,18);
 s=Y.acknowledgeCheckpoint(s);assert.equal(Y.taskAt(s).id,'intro-mya');
});
test('perfect run finishes with 39 independent first attempts and accurate summaries',()=>{
 const s=complete();
 assert(s.finished&&Y.validState(s));assert.equal(s.records.length,39);
 assert.equal(s.corrections.length,0);
 const score=Y.summary(s);
 assert.equal(score.stageNH,18);
 assert.equal(score.stageMR,19);
 for(const m of Y.MODES)assert.deepEqual(score[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
});
test('wrong, revealed and mora mistakes create separate correction attempts without changing originals',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<Y.TASKS.length;i++){
  if(i===18)s=Y.acknowledgeCheckpoint(s);
  const t=Y.taskAt(s);
  if(t.mode==='introduction')s=Y.beginRecall(s);
  s=i===0?Y.answer(s,'niya',now):i===13?Y.reveal(s,now):i===35?Y.answer(s,'2',now):Y.answer(s,t.answer,now);
  assert(Y.validState(s));s=Y.advance(s);
 }
 assert.deepEqual(s.corrections,['intro-nya','word-nyuugaku','contrast-myouji-mora']);
 const first=structuredClone(s.records);
 for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished&&Y.validState(s));assert.deepEqual(s.records.slice(0,39),first);
 assert.equal(Y.summary(s).corrected,3);
});
test('all revealed originals yield at most 39 separately marked corrections',()=>{
 let s=Y.resume(Y.initialState());
 for(let i=0;i<39;i++){
  if(i===18)s=Y.acknowledgeCheckpoint(s);
  if(Y.taskAt(s).mode==='introduction')s=Y.beginRecall(s);
  s=Y.advance(Y.reveal(s,now));assert(Y.validState(s));
 }
 assert.equal(s.corrections.length,39);
 for(let i=0;i<39;i++)s=correct(s);
 assert(s.finished&&Y.validState(s));assert.equal(s.records.length,78);
 assert(Y.MODES.every(m=>Y.summary(s)[m.id].independentCorrect===0));
});
test('validator rejects tampered records, duplicate IDs, forged stage and answer changes',()=>{
 let s=Y.resume(Y.initialState());s=Y.beginRecall(s);s=Y.answer(s,'nya',now);
 for(const mutate of [
  x=>{x.records[0].submitted='niya';},
  x=>{x.records.push({...x.records[0]});},
  x=>{x.feedback.answer='niya';},
  x=>{x.checkpointPassed=true;},
  x=>{x.index=18;}
 ]){
  const fake=structuredClone(s);mutate(fake);assert(!Y.validState(fake));
 }
 s=Y.pause(s);assert(Y.validState(s));assert.equal(Y.answer(s,'nya',now),s);
});
test('Unit 17 has its own storage and no old Unit 16 or canonical imports',()=>{
 assert.equal(Y.STORAGE_KEY,'thiepn:kana-foundations:yoon-nhmr:prototype-only:v1');
 assert.notEqual(Y.STORAGE_KEY,U16.STORAGE_KEY);
 assert.equal(U16.TASKS.length,33);
});
