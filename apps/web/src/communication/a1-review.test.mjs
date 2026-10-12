// Run: node --experimental-strip-types --test apps/web/src/communication/a1-review.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {recallSchedule,isRecallDue,countStudiedDue} from "./a1-review-schedule.ts";
import {nextRecallCard,advanceRecallQueue} from "./a1-review-queue.ts";

test("chronological scheduling survives unsorted event ingestion",()=>{
 const attempts=[{id:"a",at:"2026-10-03T00:00:00Z",correct:true},{id:"a",at:"2026-10-01T00:00:00Z",correct:true},{id:"a",at:"2026-10-02T00:00:00Z",correct:false}];
 const state=recallSchedule(attempts).a;
 assert.equal(state.streak,1);
 assert.equal(state.incorrect,1);
 assert.equal(state.dueAt,"2026-10-04T00:00:00.000Z");
 assert.equal(isRecallDue(state,Date.parse("2026-10-03T12:00:00Z")),false);
 assert.equal(countStudiedDue({a:state},Date.parse("2026-10-04T00:00:00Z")),1);
});
test("retries cannot escape eligible filter and do not immediately repeat",()=>{
 const eligible=[{id:"a"},{id:"b"}];
 assert.equal(nextRecallCard(eligible,["excluded","a"],["b"],"a")?.id,"b");
 const next=advanceRecallQueue(["excluded"],["b"],"a",false,eligible.map(x=>x.id));
 assert.deepEqual(next.retries,["a"]);
 assert.equal(nextRecallCard(eligible,next.retries,["a"],"a")?.id,"b");
 assert.equal(nextRecallCard(eligible,next.retries,["a"],"b")?.id,"a");
});
test("single-card mode remains usable",()=>{
 const only=[{id:"one"}];
 assert.equal(nextRecallCard(only,[],["one"],"one")?.id,"one");
});

test("a wrong answer schedules immediate retry, then a correct answer postpones review",()=>{
 const attempts=[{id:"kana",at:"2026-10-10T09:00:00Z",correct:false},{id:"kana",at:"2026-10-10T09:05:00Z",correct:true}];
 const state=recallSchedule(attempts).kana;
 assert.equal(state.incorrect,1);
 assert.equal(state.streak,1);
 assert.equal(state.dueAt,"2026-10-11T09:05:00.000Z");
});
test("invalid event dates cannot corrupt persistent scheduling",()=>{
 const state=recallSchedule([{id:"a",at:"not-a-date",correct:true},{id:"a",at:"2026-10-10T00:00:00Z",correct:false}]).a;
 assert.equal(state.attempts,1);
 assert.equal(state.dueAt,"2026-10-10T00:00:00.000Z");
});
test("filter transitions remove stale retries and keep a single eligible card",()=>{
 const eligible=["one"];
 const state=advanceRecallQueue(["old","one"],["old"],"one",false,eligible);
 assert.deepEqual(state.retries,["one"]);
 assert.deepEqual(state.seen,["one"]);
 assert.equal(nextRecallCard([{id:"one"}],state.retries,state.seen,"one")?.id,"one");
});
