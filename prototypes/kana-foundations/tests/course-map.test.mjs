import test from 'node:test';
import assert from 'node:assert/strict';
import {UNITS,GROUPS,COURSE_FILTERS,statusFromSnapshot,suggestedUnit,filterRows} from '../course-map-model.mjs';
import * as K from '../k-row-engine.mjs';
test('27 unique existing lesson routes ordered into three groups',()=>{
 assert.deepEqual(UNITS.map(x=>x.id),Array.from({length:27},(_,i)=>i+1));
 assert.equal(new Set(UNITS.map(x=>x.href)).size,27);
 assert.equal(new Set(UNITS.map(x=>x.engine)).size,27);
 assert.deepEqual(GROUPS.map(g=>UNITS.filter(u=>u.group===g.id).length),[10,9,8]);
 assert.equal(UNITS[0].href,'./index.html');
 assert.equal(UNITS.at(-1).href,'./katakana-y-row.html');
});
test('missing versus malformed storage are distinct and fail closed',()=>{
 assert.equal(statusFromSnapshot(2,K,null).kind,'not-started');
 assert.equal(statusFromSnapshot(2,K,undefined).kind,'unavailable');
 assert.equal(statusFromSnapshot(2,K,'not-json').kind,'invalid');
 assert.equal(statusFromSnapshot(2,K,'{"schema":99}').kind,'invalid');
});
test('in-flight first attempt is counted without editing learner evidence',()=>{
 let s=K.resume(K.initialState());s=K.beginRecall(s);s=K.answer(s,K.taskAt(s).answer);
 assert.equal(K.validState(s),true);
 const raw=JSON.stringify(s),status=statusFromSnapshot(2,K,raw);
 assert.equal(status.kind,'in-progress');
 assert.match(status.detail,/1\/15 first responses/);
 assert.equal(JSON.stringify(s),raw);
});
test('Unit 01 requires actual completion, including optional practice continuation',()=>{
 const fake={validState:()=>true,firstAttemptSummary:()=>({introduced:5,reading:{total:3}})};
 const save=(phase,practiceOnly)=>JSON.stringify({phase,practiceOnly,introduced:['h-a'],records:[{}]});
 assert.equal(statusFromSnapshot(1,fake,save(6,false)).kind,'in-progress');
 assert.equal(statusFromSnapshot(1,fake,save(7,false)).kind,'finished');
 assert.equal(statusFromSnapshot(1,fake,save(3,true)).kind,'finished');
});
test('resumes unfinished lessons before earliest untouched lesson',()=>{
 const r=(id,kind)=>({unit:{id},status:{kind}});
 assert.equal(suggestedUnit([r(1,'finished'),r(2,'not-started'),r(3,'in-progress')]).unit.id,3);
 assert.equal(suggestedUnit([r(1,'finished'),r(2,'not-started')]).unit.id,2);
 assert.equal(suggestedUnit([r(1,'finished')]),null);
});

test('filtering by status preserves original row references, groups and order',()=>{
 const rows=UNITS.map(unit=>({unit,status:{kind:unit.id===27?'in-progress':unit.id===1?'finished':unit.id===2?'invalid':'not-started'}}));
 assert.deepEqual(COURSE_FILTERS.map(f=>f.id),['all','in-progress','not-started','finished','attention']);
 assert.deepEqual(filterRows(rows,{filter:'in-progress'}).map(x=>x.unit.id),[27]);
 assert.deepEqual(filterRows(rows,{filter:'finished'}).map(x=>x.unit.id),[1]);
 assert.deepEqual(filterRows(rows,{filter:'attention'}).map(x=>x.unit.id),[2]);
 assert.equal(filterRows(rows,{filter:'not-started'}).length,24);
 assert.equal(filterRows(rows,{filter:'all'}).length,27);
 assert.strictEqual(filterRows(rows,{filter:'in-progress'})[0],rows[26]);
});
test('kana, romaji and numbered unit queries combine with status without changing state',()=>{
 const rows=UNITS.map(unit=>({unit,status:{kind:unit.id===27?'in-progress':'not-started'}}));
 assert.deepEqual(filterRows(rows,{query:'ヤ'}).map(x=>x.unit.id),[27]);
 assert.deepEqual(filterRows(rows,{query:'unit 27'}).map(x=>x.unit.id),[27]);
 assert.deepEqual(filterRows(rows,{query:'katakana y'}).map(x=>x.unit.id),[27]);
 assert.deepEqual(filterRows(rows,{query:'yo',filter:'in-progress'}).map(x=>x.unit.id),[27]);
 assert.deepEqual(filterRows(rows,{query:'does-not-exist'}),[]);
 assert.deepEqual(filterRows(rows,{query:' katakana   y '}).map(x=>x.unit.id),[27]);
});
