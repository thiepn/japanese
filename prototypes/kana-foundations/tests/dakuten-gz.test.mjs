import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dakuten-gz-engine.mjs';
import * as W from '../w-row-engine.mjs';
import * as R from '../r-row-engine.mjs';
import * as Review from '../reading-review-engine.mjs';

const at=Date.UTC(2026,10,12);
function respond(s,t,value=t.answer){
 if(t.mode==='introduction'&&!t.correction)s=D.beginRecall(s);
 s=D.answer(s,value,at);
 assert.equal(s.feedback?.correct,true,'correct response to '+t.id);
 assert(D.validState(s),'valid submitted answer for '+t.id);
 return D.advance(s);
}
function complete(s=D.resume(D.initialState())){
 for(let i=0;i<D.TASKS.length;i++){
  if(i===D.CHECKPOINT_INDEX){assert(D.atCheckpoint(s));s=D.acknowledgeCheckpoint(s);}
  const t=D.taskAt(s);
  assert.equal(t?.id,D.TASKS[i].id);
  s=respond(s,t);
  assert(D.validState(s),'valid after '+t.id);
 }
 return s;
}
test('Unit 12 defines exactly 36 first prompts: 17 G, 17 Z and two practical expressions',()=>{
 assert.equal(D.CHECKPOINT_INDEX,17);
 assert.equal(D.TASKS.length,36);
 assert.deepEqual(D.TASKS.slice(0,17).map(t=>t.mode).reduce((m,k)=>(m[k]=(m[k]||0)+1,m),{}),
  {introduction:5,recognition:5,word:5,contrast:2});
 assert.deepEqual(D.TASKS.slice(17,34).map(t=>t.mode).reduce((m,k)=>(m[k]=(m[k]||0)+1,m),{}),
  {introduction:5,recognition:5,word:5,contrast:2});
 assert.deepEqual(D.TASKS.slice(34).map(t=>t.mode),['phrase','phrase']);
 assert.equal(new Set(D.TASKS.map(t=>t.id)).size,36);
});
test('all 10 new kana pair with their unvoiced predecessors; ji is spoken ji',()=>{
 assert.deepEqual(D.KANA.map(x=>x.kana),[...'がぎぐげござじずぜぞ']);
 assert.deepEqual(D.KANA.map(x=>x.base),[...'かきくけこさしすせそ']);
 assert.deepEqual(D.KANA.map(x=>x.reading),['ga','gi','gu','ge','go','za','ji','zu','ze','zo']);
 assert.deepEqual(D.KANA.find(k=>k.kana==='じ').aliases,['zi']);
 assert.match(D.KANA.find(k=>k.kana==='じ').note,/pronounced ji/);
 assert.match(D.KANA.find(k=>k.kana==='ぞ').note,/long o/);
 assert.match(D.KANA.find(k=>k.kana==='ず').note,/づ/);
});
test('ten genuine words use only previously learned or newly introduced hiragana',()=>{
 const allowed=new Set([...D.BASE_KANA,...D.KANA.map(x=>x.kana)]);
 assert.equal(allowed.size,56);
 assert.deepEqual(D.WORDS.map(x=>[x.kana,x.reading,x.meaning]),[
  ['がくせい','gakusei','student'],['かぎ','kagi','key'],['かぐ','kagu','furniture'],
  ['げんき','genki','well; energetic'],['ごはん','gohan','cooked rice; meal'],
  ['ざせき','zaseki','seat'],['じかん','jikan','time; duration'],['みず','mizu','water'],
  ['かぜ','kaze','wind; common cold (depending on context)'],['ぞう','zou','elephant']
 ]);
 assert.equal(new Set(D.WORDS.map(x=>x.id)).size,10);
 for(const item of [...D.WORDS,...D.PHRASES])
  assert([...item.kana].every(k=>allowed.has(k)),'unintroduced kana: '+item.id);
 assert.match(D.WORDS.find(w=>w.id==='kaze').note,/context/);
 assert.match(D.WORDS.find(w=>w.id==='zou').note,/long o/);
});
test('the four contrasts really distinguish base and voiced kana without audio',()=>{
 assert.deepEqual(D.CONTRASTS.map(c=>[c.answer,c.choices]),[
  ['が',['か','が']],['ぎ',['ぎ','き']],['じ',['し','じ']],['ず',['ず','す']]
 ]);
 assert(D.CONTRASTS.every(c=>c.choices.length===2));
 assert(D.TASKS.filter(t=>t.mode==='contrast').every(t=>t.choices.some(c=>c.value===t.answer)));
});
test('all first attempts complete with five accurate score denominators and no corrections',()=>{
 const s=complete();
 assert(s.finished);
 assert.equal(s.records.length,36);
 assert.equal(s.corrections.length,0);
 assert(D.validState(JSON.parse(JSON.stringify(s))));
 for(const m of D.MODES)
  assert.deepEqual(D.summary(s)[m.id],{total:m.total,completed:m.total,independentCorrect:m.total});
 assert.equal(D.summary(s).stageG,17);
 assert.equal(D.summary(s).stageZ,17);
});
test('checkpoint is compulsory, persists, and cannot be bypassed by typing or reveal',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<17;i++)s=respond(s,D.taskAt(s));
 assert.equal(s.index,17);
 assert(D.atCheckpoint(s));
 assert.equal(D.taskAt(s),null);
 assert.equal(D.beginRecall(s),s);
 assert.equal(D.answer(s,'za'),s);
 assert.equal(D.reveal(s),s);
 assert.equal(D.advance(s),s);
 s=D.pause(s);
 assert(D.validState(s));
 const saved=JSON.parse(JSON.stringify(s));
 s=D.resume(saved);
 assert(D.atCheckpoint(s));
 s=D.acknowledgeCheckpoint(s);
 assert(D.validState(s));
 assert.equal(D.atCheckpoint(s),false);
 assert.equal(D.taskAt(s).id,'intro-za');
 assert.equal(D.acknowledgeCheckpoint(s),s);
});
test('NFKC, spaces and hyphens normalize; ji/zi are typing alternatives, not two sounds',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<17;i++)s=respond(s,D.taskAt(s));
 s=D.acknowledgeCheckpoint(s);
 for(let i=17;i<34;i++){
  const t=D.taskAt(s);
  const raw=t.id==='intro-ji'?'ＺＩ':t.id==='word-jikan'?'zi kan':t.answer;
  if(t.mode==='introduction')s=D.beginRecall(s);
  s=D.answer(s,raw,at);
  assert.equal(s.feedback?.correct,true,t.id);
  s=D.advance(s);
 }
 s=D.answer(s,'KAGI-WO SAGASU',at);
 assert.equal(s.feedback.correct,true);
 assert.equal(s.records[34].submitted,'kagiwosagasu');
 s=D.advance(s);
 s=D.answer(s,'MIZU O NOMU',at);
 assert.equal(s.feedback.correct,true);
 s=D.advance(s);
 assert(s.finished);
 assert.equal(s.records.find(r=>r.taskId==='intro-ji').submitted,'zi');
 assert.equal(s.records.find(r=>r.taskId==='word-jikan').submitted,'zikan');
});
test('zo must not receive credit for the long-vowel word zou',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<17;i++)s=respond(s,D.taskAt(s));
 s=D.acknowledgeCheckpoint(s);
 for(let i=17;i<31;i++)s=respond(s,D.taskAt(s));
 assert.equal(D.taskAt(s).id,'word-zou');
 s=D.answer(s,'zo',at);
 assert.equal(s.feedback.correct,false);
 assert.equal(s.records.at(-1).correct,false);
});
test('wrong, assisted and incorrect contrast answers produce separate corrections after all first prompts',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<36;i++){
  if(i===17)s=D.acknowledgeCheckpoint(s);
  const t=D.taskAt(s);
  if(t.mode==='introduction')s=D.beginRecall(s);
  s=i===0?D.answer(s,'ka',at):i===12?D.reveal(s,at):i===33?D.answer(s,'す',at):D.answer(s,t.answer,at);
  assert(D.validState(s));
  s=D.advance(s);
 }
 assert.equal(s.finished,false);
 assert.deepEqual(s.corrections,['intro-ga','word-kagu','contrast-zu-su']);
 assert.equal(s.records[0].correct,false);
 assert.equal(s.records[12].correct,null);
 assert.equal(s.records[12].assisted,true);
 assert.equal(s.records[33].correct,false);
 const originals=structuredClone(s.records);
 for(const response of ['ga','kagu','ず']){
  s=D.answer(s,response,at);
  assert.equal(s.feedback.correct,true);
  s=D.advance(s);
  assert(D.validState(s));
 }
 assert(s.finished);
 assert.equal(s.records.length,39);
 assert.deepEqual(s.records.slice(0,36),originals);
 assert.equal(D.summary(s).corrected,3);
 assert.equal(D.summary(s).introduction.independentCorrect,9);
 assert.equal(D.summary(s).word.independentCorrect,9);
 assert.equal(D.summary(s).contrast.independentCorrect,3);
});
test('maximum 72 records are valid after 36 wrong or revealed attempts and 36 corrections',()=>{
 let s=D.resume(D.initialState());
 for(let i=0;i<36;i++){
  if(i===17)s=D.acknowledgeCheckpoint(s);
  if(D.taskAt(s).mode==='introduction')s=D.beginRecall(s);
  s=D.advance(D.reveal(s,at));
 }
 assert.equal(s.corrections.length,36);
 assert.equal(s.finished,false);
 for(let i=0;i<36;i++)s=D.advance(D.answer(s,D.taskAt(s).answer,at));
 assert.equal(s.records.length,72);
 assert(s.finished);
 assert(D.validState(s));
 assert.equal(D.summary(s).corrected,36);
 for(const m of D.MODES)assert.equal(D.summary(s)[m.id].independentCorrect,0);
});
test('saved-state validator rejects duplicates, forged feedback, future stages and overwritten answers',()=>{
 let s=D.resume(D.initialState());s=D.beginRecall(s);s=D.answer(s,'ga',at);
 assert.equal(D.answer(s,'ka',at),s,'first answer must be immutable');
 const forged=structuredClone(s);forged.records[0].submitted='ka';
 assert.equal(D.validState(forged),false);
 const feedback=structuredClone(s);feedback.feedback.answer='gi';
 assert.equal(D.validState(feedback),false);
 const duplicate=structuredClone(s);duplicate.records.push(structuredClone(s.records[0]));
 assert.equal(D.validState(duplicate),false);
 const skip=structuredClone(s);skip.index=18;
 assert.equal(D.validState(skip),false);
 const illegal=structuredClone(s);illegal.checkpointPassed=true;
 assert.equal(D.validState(illegal),false);
 s=D.pause(s);assert.equal(D.answer(s,'gi',at),s);
 assert(D.validState(s));
});
test('Unit 12 storage isolation and earlier engines are preserved',()=>{
 const keys=[D.STORAGE_KEY,Review.STORAGE_KEY,W.STORAGE_KEY,R.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1'];
 assert.equal(new Set(keys).size,keys.length);
 assert.equal(Review.TASKS.length,17);
 assert.equal(W.TASKS.length,12);
 assert.equal(R.TASKS.length,15);
 assert.equal(D.STORAGE_KEY,'thiepn:kana-foundations:dakuten-gz:prototype-only:v1');
});
