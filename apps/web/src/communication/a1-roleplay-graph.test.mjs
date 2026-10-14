// Run: node --experimental-strip-types --test apps/web/src/communication/a1-roleplay-graph.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {validateRoleplayGraph} from "./a1-roleplay-graph.ts";
import {scenarios} from "./a1-roleplay-scenarios.ts";
test("valid multi-path conversation can end on different branches",()=>{
 const turns=[
  {choices:[{correct:true,next:1},{correct:true,next:2},{correct:false}]},
  {choices:[{correct:true,next:null}]},
  {choices:[{correct:true,next:null}]}
 ];
 assert.deepEqual(validateRoleplayGraph(turns),[]);
});
test("out-of-range destinations and dead ends are rejected",()=>{
 assert.ok(validateRoleplayGraph([{choices:[{correct:true,next:9}]}]).some(e=>e.includes("invalid destination")));
 assert.ok(validateRoleplayGraph([{choices:[{correct:false}]}]).some(e=>e.includes("no valid answer")));
});

test("all real A1 dialogue graphs have reachable valid endings",()=>{
 assert.deepEqual(scenarios.map(s=>s.id),["cafe","station","meeting"]);
 for(const scenario of scenarios){
  assert.deepEqual(validateRoleplayGraph(scenario.turns),[],scenario.id);
  assert.ok(scenario.turns[0].choices.filter(c=>c.correct).length>=2,scenario.id+" needs a genuine initial branch");
 }
});
test("unreachable turns and trapped branches are rejected",()=>{
 assert.ok(validateRoleplayGraph([{choices:[{correct:true,next:null}]},{choices:[{correct:true,next:null}]}]).some(e=>e.includes("unreachable turn")));
 assert.ok(validateRoleplayGraph([{choices:[{correct:true,next:1},{correct:true,next:null}]},{choices:[{correct:true,next:1}]}]).some(e=>e.includes("branch cannot reach ending")));
});
