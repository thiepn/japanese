import {describe,it,expect} from "vitest";
import {A1_LESSONS,A1_MODULES,a1ManifestErrors,reconcileA1Evidence,a1Lesson} from "../apps/web/src/a1/a1-course-contract";
import {a1SourceInventory,auditA1SourceLinks,a1CommunicationExerciseCrosswalk,a1PrimaryTargetCrosswalk} from "../apps/web/src/a1/a1-source-audit";

describe("A1-0 immutable curriculum and source custody",()=>{
 it("contains 24 ordered lessons in six modules and retains every original source once",()=>{
  expect(A1_MODULES).toHaveLength(6);
  expect(A1_LESSONS).toHaveLength(24);
  expect(A1_LESSONS.map(l=>l.order)).toEqual(Array.from({length:24},(_,i)=>i+1));
  expect(a1Lesson("a1:lesson:24")?.moduleId).toBe("a1:module:06");
  expect(a1ManifestErrors()).toEqual([]);
  expect(auditA1SourceLinks()).toEqual([]);
 });
 it("audits the real source without counting higher levels as A1",()=>{
  const inventory=a1SourceInventory();
  expect(inventory).toMatchObject({sourceUnits:20,communicationLessons:7,referencedVocabulary:131,referencedGrammar:37,referencedSentences:89,a1ReadingTexts:4,proposedLessons:24});
  expect(inventory.vocabularyWithLinkedAudio).toBeLessThan(inventory.referencedVocabulary);
  expect(Object.keys(a1CommunicationExerciseCrosswalk())).toHaveLength(22);
  expect(a1PrimaryTargetCrosswalk()["sentence:sentence-a1-001"]).toContain("a1-unit-01");
 });
});
describe("A1-1 provenance crosswalk never manufactures mastery",()=>{
 const owner="test-owner",map=a1CommunicationExerciseCrosswalk();
 it("matches exact unit and communication evidence without changing originals",()=>{
  const events=[
   {id:"unit",userId:owner,sourceId:"thiepn-original",contextId:"a1-unit-01"},
   {id:"comm",userId:owner,sourceId:"original-a1-communication-v1",contextId:"a1-introductions",metadata:{exerciseId:"intro-topic"}},
   {id:"role",userId:owner,sourceId:"original-a1-roleplay-v1",metadata:{scenarioId:"station"}}
  ];
  const unchanged=JSON.stringify(events),report=reconcileA1Evidence(events,owner,map);
  expect(report.aligned).toBe(3);
  expect(report.ambiguous).toBe(0);
  expect(report.unmapped).toBe(0);
  expect(report.rows.map(r=>r.candidateLessonIds[0])).toEqual(["a1:lesson:05","a1:lesson:05","a1:lesson:21"]);
  expect(JSON.stringify(events)).toBe(unchanged);
  expect(report.rows[0]).not.toHaveProperty("mastery");
  expect(report.rows[0]).not.toHaveProperty("completed");
 });
 it("reads existing typed study targets and excludes explicitly advanced contexts",()=>{
  const report=reconcileA1Evidence([
   {id:"sentence",userId:owner,sourceId:"thiepn-original",primaryTarget:{kind:"sentence",id:"sentence-a1-001"}},
   {id:"advanced-context",userId:owner,sourceId:"thiepn-original",contextId:"a2-unit-01",primaryTarget:{kind:"sentence",id:"sentence-a1-001"}}
  ],owner,map,a1PrimaryTargetCrosswalk());
  expect(report.aligned).toBe(1);
  expect(report.outOfScope).toBe(1);
  expect(report.rows[0]?.candidateLessonIds).toEqual(["a1:lesson:05"]);
 });
 it("reports conflicting links and unrecognized A1 records without dropping them",()=>{
  const report=reconcileA1Evidence([
   {id:"conflict",userId:owner,sourceId:"original-a1-communication-v1",contextId:"a1-shopping",metadata:{unitId:"a1-unit-01"}},
   {id:"unmapped",userId:owner,sourceId:"original-a1-recall-v1",metadata:{recallId:"kana:あ"}},
   {id:"advanced",userId:owner,sourceId:"thiepn-original",contextId:"a2-unit-01"},
   {id:"foreign",userId:"another-owner",sourceId:"original-a1-roleplay-v1",metadata:{scenarioId:"cafe"}}
  ],owner,map);
  expect(report.ambiguous).toBe(1);
  expect(report.unmapped).toBe(1);
  expect(report.outOfScope).toBe(2);
  expect(report.rows.find(row=>row.eventId==="conflict")?.candidateLessonIds).toEqual(["a1:lesson:05","a1:lesson:19"]);
 });
});
