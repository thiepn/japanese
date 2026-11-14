import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../sokuon-rhythm-engine.mjs';
import * as BP from '../dakuten-bp-engine.mjs';
import * as D from '../dakuten-d-engine.mjs';
import * as GZ from '../dakuten-gz-engine.mjs';
const at=Date.UTC(2026,10,13);
function correct(s,t=S.taskAt(s),input=t.answer){
 s=S.answer(s,input,at);
 assert.equal(s.feedback?.correct,true,'Correct response required: '+t.id);
 assert(S.validState(s),'Valid response: '+t.id);
 return S.advance(s);
}
function runPerfect(){
 let s=S.resume(S.initialState());
 for(let i=0;i<24;i++){
  if(i===S.CHECKPOINT_INDEX){assert(S.atCheckpoint(s));s=S.acknowledgeCheckpoint(s);}
  assert.equal(S.taskAt(s)?.id,S.TASKS[i].id);
  s=correct(s);
  assert(S.validState(s));
 }
 return s;
}
test('24 exactly ordered tasks, five modes and two additional rhythm types',()=>{
 assert.equal(S.TASKS.length,24);
 assert.equal(S.CHECKPOINT_INDEX,18);
 assert.equal(new Set(S.TASKS.map(t=>t.id)).size,24);
 const count=arr=>arr.reduce((o,t)=>(o[t.mode]=(o[t.mode]||0)+1,o),{});
 assert.deepEqual(count(S.TASKS.slice(0,18)),{form:2,pair:4,word:8,spelling:4});
 assert.deepEqual(count(S.TASKS.slice(18)),{'vowel-choice':2,'vowel-read':2,phrase:2});
 assert.deepEqual(S.MODES.map(m=>m.total),[2,4,8,4,2,2,2]);
});
test('small っ and full つ are not treated as equivalent',()=>{
 assert.deepEqual(S.FORM.map(x=>x.answer),['っ','3']);
 assert.equal(S.FORM[0].choices[0][0],'つ');
 assert.equal(S.FORM[0].choices[1][0],'っ');
 assert.match(S.FORM[1].note,/き・っ・て/);
 let s=S.resume(S.initialState());
 s=S.answer(s,'つ',at);
 assert.equal(s.feedback.correct,false);
 assert.equal(s.records[0].submitted,'つ');
 assert.equal(s.records[0].assisted,false);
});
test('four authentic minimal pairs contrast genuine words and meanings',()=>{
 assert.deepEqual(S.PAIRS.map(x=>[x.id,x.answer,x.choices.map(c=>c[0])]),[
  ['kite-kitte','きって',['きて','きって']],
  ['saka-sakka','さっか',['さか','さっか']],
  ['kako-kakko','かっこ',['かこ','かっこ']],
  ['seken-sekken','せっけん',['せけん','せっけん']]
 ]);
 for(const c of S.PAIRS)assert.equal(c.choices.filter(([word])=>word===c.answer).length,1);
});
test('eight genuine sokuon words have strict kana-faithful romaji',()=>{
 assert.deepEqual(S.WORDS.map(x=>[x.kana,x.reading]),[
  ['きって','kitte'],['きっぷ','kippu'],['さっか','sakka'],['ざっし','zasshi'],
  ['せっけん','sekken'],['はっぱ','happa'],['まって','matte'],['もっと','motto']
 ]);
 const allowed=new Set([...S.PREVIOUS_KANA,'っ']);
 assert.equal(allowed.size,72);
 for(const entry of [...S.WORDS,...S.EXPRESSIONS,...S.VOWELS.filter(x=>x.reading)]){
  assert([...entry.kana].every(k=>allowed.has(k)),'Unknown kana: '+entry.id);
 }
 assert.equal(new Set(S.WORDS.map(x=>x.id)).size,8);
});
test('spelling questions reject omitted doubled consonants in k, t, p, ssh contexts',()=>{
 assert.deepEqual(S.SPELLINGS.map(x=>x.answer),['kitte','kippu','zasshi','happa']);
 for(const row of S.SPELLINGS)assert.equal(row.choices.filter(x=>x[0]===row.answer).length,1);
 let s=S.resume(S.initialState());
 for(let i=0;i<14;i++)s=correct(s);
 assert.equal(S.taskAt(s).id,'spelling-kitte');
 s=S.answer(s,'kite',at);
 assert.equal(s.feedback.correct,false);
 assert.equal(s.records[14].submitted,'kite');
});
test('long vowels and compound sokuon + vowel in がっこう are explicitly preserved',()=>{
 assert.deepEqual(S.VOWELS.map(x=>x.answer||x.reading),['おばあさん','おじいさん','boushi','gakkou']);
 assert.match(S.VOWELS[3].note,/four morae/);
 let s=S.resume(S.initialState());
 for(let i=0;i<18;i++)s=correct(s);
 s=S.acknowledgeCheckpoint(s);
 s=correct(s);s=correct(s);
 s=S.answer(s,'boshi',at);
 assert.equal(s.feedback.correct,false);
 s=S.advance(s);
 s=S.answer(s,'gakko',at);
 assert.equal(s.feedback.correct,false);
});
test('explicit particle-wo typing convention leaves pronunciation o unchanged',()=>{
 assert.deepEqual(S.EXPRESSIONS.map(x=>[x.kana,x.reading,x.aliases]),[
  ['きっぷをかう','kippuokau',['kippuwokau']],
  ['ざっしをよむ','zasshioyomu',['zasshiwoyomu']]
 ]);
 let s=S.resume(S.initialState());
 for(let i=0;i<18;i++)s=correct(s);
 s=S.acknowledgeCheckpoint(s);
 for(let i=18;i<22;i++)s=correct(s);
 s=correct(s,S.taskAt(s),'KIPPU-WO KAU');
 s=correct(s,S.taskAt(s),'ZASSHI WO YOMU');
 assert(s.finished);
 assert.equal(s.records[22].submitted,'kippuwokau');
 assert.equal(s.records[23].submitted,'zasshiwoyomu');
});
test('checkpoint at index 18 blocks answers and reveals, survives pause and resume unchanged',()=>{
 let s=S.resume(S.initialState());
 for(let i=0;i<18;i++)s=correct(s);
 assert(S.atCheckpoint(s));
 assert.equal(S.taskAt(s),null);
 assert.equal(S.answer(s,'grandmother',at),s);
 assert.equal(S.reveal(s,at),s);
 assert.equal(S.advance(s),s);
 const saved=JSON.parse(JSON.stringify(S.pause(s)));
 assert(S.validState(saved));
 s=S.resume(saved);
 assert(S.atCheckpoint(s));
 assert.deepEqual(s.records,saved.records);
 s=S.acknowledgeCheckpoint(s);
 assert.equal(S.taskAt(s).id,'vowel-choice-grandmother');
 assert(S.validState(s));
});
test('all-correct session finishes with 24 immutable first attempts and accurate score denominators',()=>{
 const s=runPerfect();
 assert(s.finished);
 assert.equal(s.records.length,24);
 assert.equal(s.corrections.length,0);
 assert(S.validState(JSON.parse(JSON.stringify(s))));
 assert.equal(S.summary(s).stageSokuon,18);
 assert.equal(S.summary(s).stageRhythm,4);
 for(const mode of S.MODES){
  assert.deepEqual(S.summary(s)[mode.id],{total:mode.total,completed:mode.total,independentCorrect:mode.total});
 }
});
test('wrong, revealed and misspelled first answers generate separate immutable corrections',()=>{
 let s=S.resume(S.initialState());
 for(let i=0;i<24;i++){
  if(i===18)s=S.acknowledgeCheckpoint(s);
  const t=S.taskAt(s);
  s=i===0?S.answer(s,'つ',at):i===8?S.reveal(s,at):i===15?S.answer(s,'kipu',at):S.answer(s,t.answer,at);
  assert(S.validState(s),'record at '+i);
  s=S.advance(s);
 }
 assert.deepEqual(s.corrections,['form-small-tsu','word-sakka','spelling-kippu']);
 const original=structuredClone(s.records);
 for(let i=0;i<3;i++)s=correct(s);
 assert(s.finished);
 assert.deepEqual(s.records.slice(0,24),original);
 assert.equal(s.records.length,27);
 assert.equal(S.summary(s).corrected,3);
 assert.equal(S.summary(s).form.independentCorrect,1);
 assert.equal(S.summary(s).word.independentCorrect,7);
 assert.equal(S.summary(s).spelling.independentCorrect,3);
});
test('maximum of 48 records: 24 revealed first attempts plus 24 independent corrections',()=>{
 let s=S.resume(S.initialState());
 for(let i=0;i<24;i++){
  if(i===18)s=S.acknowledgeCheckpoint(s);
  s=S.advance(S.reveal(s,at));
  assert(S.validState(s));
 }
 assert.deepEqual(s.corrections,S.TASKS.map(t=>t.id));
 for(let i=0;i<24;i++)s=correct(s);
 assert(s.finished);
 assert.equal(s.records.length,48);
 assert(S.validState(s));
 assert.equal(S.summary(s).corrected,24);
 for(const m of S.MODES)assert.equal(S.summary(s)[m.id].independentCorrect,0);
});
test('validator rejects forged feedback, changed first attempts, duplicate, skipped or malformed evidence',()=>{
 let s=S.resume(S.initialState());s=S.answer(s,'っ',at);
 assert.equal(S.answer(s,'つ',at),s);
 let x=structuredClone(s);x.records[0].submitted='つ';assert(!S.validState(x));
 x=structuredClone(s);x.feedback.answer='つ';assert(!S.validState(x));
 x=structuredClone(s);x.records.push(structuredClone(s.records[0]));assert(!S.validState(x));
 x=structuredClone(s);x.index=18;assert(!S.validState(x));
 x=structuredClone(s);x.checkpointPassed=true;assert(!S.validState(x));
 s=S.pause(s);assert(S.validState(s));assert.equal(S.answer(s,'つ',at),s);
});
test('isolated progress key cannot overlap earlier units, Account or FSRS',()=>{
 const keys=[S.STORAGE_KEY,BP.STORAGE_KEY,D.STORAGE_KEY,GZ.STORAGE_KEY,'thiepn:account','thiepn:fsrs'];
 assert.equal(new Set(keys).size,keys.length);
 assert.equal(S.STORAGE_KEY,'thiepn:kana-foundations:sokuon-rhythm:prototype-only:v1');
 assert.equal(BP.TASKS.length,36);
 assert.equal(D.TASKS.length,23);
});
