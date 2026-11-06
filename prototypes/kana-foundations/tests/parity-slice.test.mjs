import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../engine.mjs';

const fixture=name=>JSON.parse(readFileSync(new URL('./fixtures/'+name,import.meta.url),'utf8'));
const old=()=>fixture('legacy-v1-results.json');
const session=(seed=12345)=>E.startPractice(old(),seed,'synthetic-session-'+seed,Date.UTC(2026,10,5,11));

test('RED-FIRST: new practice session API must exist without replacing legacy lessons',()=>{
 assert.equal(typeof E.startPractice,'function','startPractice must be implemented');
 assert.equal(typeof E.currentPracticePrompt,'function');
 assert.equal(typeof E.normalizePracticeAnswer,'function');
 assert.equal(typeof E.answerPractice,'function');
 assert.equal(typeof E.advancePractice,'function');
});
test('legacy saved schema one, original records and phase survive optional practice',()=>{
 const original=old();
 assert(E.validState(original));
 const partial=fixture('legacy-v1-partial.json');
 assert(E.validState(partial));
 assert.equal(E.startPractice(partial,123,'not-allowed'),partial,'cannot start before results');
 const next=session();
 assert.equal(next.schema,1);
 assert.equal(next.phase,7);
 assert.deepEqual(next.records,original.records);
 assert.equal(next.practiceSession.prompts.length,15);
 assert(E.validState(JSON.parse(JSON.stringify(next))));
});
test('two seeds make reproducible but different question manifests',()=>{
 const a=session(123),clone=session(123),b=session(124);
 assert.deepEqual(a.practiceSession.prompts,clone.practiceSession.prompts);
 assert.notDeepEqual(a.practiceSession.prompts,b.practiceSession.prompts);
 assert.equal(E.currentPracticePrompt(a)?.mode,'recognition');
});
test('each five-option block has full vowel coverage, unique correct answer positions',()=>{
 const prompts=session().practiceSession.prompts;
 const readings=new Set(['a','i','u','e','o']);
 const ids=new Set(['h-a','h-i','h-u','h-e','h-o']);
 for(const [offset,mode] of [[0,'recognition'],[5,'reverse']]){
  const group=prompts.slice(offset,offset+5);
  assert(group.every(x=>x.mode===mode&&x.choices.length===5));
  const targets=new Set(group.map(x=>x.kanaIds[0]));
  assert.deepEqual(targets,ids);
  const positions=new Set(group.map(x=>x.choices.indexOf(x.answer)));
  assert.deepEqual(positions,new Set([0,1,2,3,4]));
  for(const prompt of group){
   assert.deepEqual(new Set(prompt.choices),mode==='recognition'?readings:ids);
   assert.equal(prompt.choices.filter(x=>x===prompt.answer).length,1);
  }
 }
});
test('five novel three-character sequences are unique and use only five approved vowel IDs',()=>{
 const group=session().practiceSession.prompts.slice(10);
 assert(group.every(x=>x.mode==='sequence'&&x.kanaIds.length===3&&x.choices.length===0));
 assert.equal(new Set(group.map(x=>x.kanaIds.join('|'))).size,5);
 assert.equal(new Set(group.flatMap(x=>x.kanaIds)).size,5);
 for(const prompt of group){
  assert(prompt.kanaIds.every(id=>E.VOWELS.some(v=>v.id===id)));
  assert.equal(prompt.answer,prompt.kanaIds.map(id=>E.vowel(id).reading).join(''));
 }
});
test('strict five-vowel reading normalization only tolerates case/width and valid separators',()=>{
 const cases=fixture('romaji-acceptance.json').cases;
 for(const [input,expected,length,accepted] of cases){
  const actual=E.normalizePracticeAnswer(input,length);
  assert.equal(actual===expected,accepted,JSON.stringify([input,expected,length]));
 }
 assert.equal(E.normalizePracticeAnswer('i',3),null);
 assert.equal(E.normalizePracticeAnswer('aiu!',3),null);
 assert.equal(E.normalizePracticeAnswer('a',1),'a');
});
test('reverse matching compares kana identity, not visible text',()=>{
 let s=session();
 for(let i=0;i<5;i++){
  const p=E.currentPracticePrompt(s);
  s=E.answerPractice(s,p.answer,{elapsedMs:120,now:Date.UTC(2026,10,5)});
  s=E.advancePractice(s);
 }
 const p=E.currentPracticePrompt(s);
 assert.equal(p.mode,'reverse');
 const wrong=p.choices.find(x=>x!==p.answer);
 let mistaken=E.answerPractice(s,wrong,{elapsedMs:600});
 assert.equal(mistaken.practiceSession.attempts.at(-1).correct,false);
 assert.equal(mistaken.practiceSession.attempts.at(-1).responseNormalized,wrong);
 const repeated=E.answerPractice(mistaken,p.answer,{elapsedMs:800});
 assert.equal(repeated.practiceSession.attempts.length,mistaken.practiceSession.attempts.length,'one response only');
});
test('hinted/revealed answers never become independent achievement',()=>{
 let s=E.hintPractice(session());
 assert.equal(s.practiceSession.assistanceLevel,'cue');
 const p=E.currentPracticePrompt(s);
 s=E.answerPractice(s,p.answer,{elapsedMs:120});
 assert.equal(s.practiceSession.attempts.at(-1).correct,true);
 assert.equal(s.practiceSession.attempts.at(-1).assistanceLevel,'cue');
 assert.equal(s.practiceSession.attempts.at(-1).independent,false);
 assert.equal(s.practiceSession.attempts.at(-1).canonicalEligible,false);
 assert.equal(s.practiceSession.attempts.at(-1).practiceOnly,true);
 let reveal=E.revealPractice(session(5));
 assert.equal(reveal.practiceSession.attempts.at(-1).correct,null);
 assert.equal(reveal.practiceSession.attempts.at(-1).assistanceLevel,'revealed');
 assert.equal(reveal.practiceSession.attempts.at(-1).independent,false);
});
test('old first attempts stay byte-equivalent while wrong prompts get correction without replacement',()=>{
 let s=session(27);
 const original=JSON.stringify(s.records);
 const first=E.currentPracticePrompt(s);
 const wrong=first.choices.find(x=>x!==first.answer);
 s=E.answerPractice(s,wrong,{elapsedMs:100});
 for(let i=0;i<15;i++){
  if(i>0){const p=E.currentPracticePrompt(s);s=E.answerPractice(s,p.answer,{elapsedMs:110});}
  s=E.advancePractice(s);
 }
 assert.equal(JSON.stringify(s.records),original);
 assert.equal(s.practiceSession.status,'active');
 assert.equal(s.practiceSession.prompts.length,16,'one extra correction question');
 assert.equal(E.currentPracticePrompt(s).correctionOf,first.id);
 const p=E.currentPracticePrompt(s);
 s=E.answerPractice(s,p.answer,{elapsedMs:125});
 s=E.advancePractice(s);
 assert.equal(s.practiceSession.status,'completed');
 assert.equal(s.practiceSession.attempts[0].correct,false);
 assert.equal(s.practiceSession.attempts.at(-1).correction,true);
 assert.equal(E.practiceSummary(s).firstIndependentCorrect,14);
 assert.equal(E.firstAttemptSummary(s).recognition.total,E.firstAttemptSummary(old()).recognition.total);
});
test('pause/resume and new practice archive preserve original and earlier practice evidence',()=>{
 let s=E.pause(session());
 assert.equal(s.practiceSession.status,'paused');
 s=E.start(s);
 assert.equal(s.practiceSession.status,'active');
 for(let i=0;i<15;i++){
  const p=E.currentPracticePrompt(s);
  s=E.advancePractice(E.answerPractice(s,p.answer,{elapsedMs:44}));
 }
 assert.equal(s.practiceSession.status,'completed');
 const finished=structuredClone(s.practiceSession);
 s=E.startPractice(s,555,'new-synthetic-session');
 assert.deepEqual(s.practiceRuns[0],finished);
 assert.deepEqual(s.records,old().records);
 assert.equal(s.practiceSession.prompts.length,15);
});
test('invalid optional practice session cannot be saved as a valid resumed state',()=>{
 const sample=session();
 const malformed={...sample,practiceSession:{version:1,status:'active',prompts:'not-an-array'}};
 assert.equal(E.validState(malformed),false);
 assert.equal(E.validState(old()),true);
});
