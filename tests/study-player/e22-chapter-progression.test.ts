import "fake-indexeddb/auto";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {buildE02Journey,E02_AVAILABLE_SCENES} from "../../apps/web/src/study/a1ExcellenceCourse";
import {describe,expect,it} from "vitest";
import {getE01Progress} from "../../apps/web/src/study/a1Excellence";
import {getE02Overview} from "../../apps/web/src/study/a1ExcellenceCourse";
import {getE03Overview} from "../../apps/web/src/study/a2ExcellenceCourse";
import {getE04Overview} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {projectE19Overview} from "../../apps/web/src/study/e19SourceWriting";
import {buildE22Chapters,getE22NextChapter,e22InitialLocation,resolveE22OwnerSelection,e24ReadyReviews} from "../../apps/web/src/study/e22ChapterProgression";
import {e22ChapterFocus} from "../../apps/web/src/design/UX1LearningPath";

const now=new Date("2026-10-17T14:00:00Z");
function fresh(){
 const e01=getE01Progress([],now);
 const e02=getE02Overview([],now);
 const e03=getE03Overview([],now);
 const e04=getE04Overview([],now);
 const e19=projectE19Overview("e22-private-owner",[],now);
 return {e01,e02,e03,e04,e19};
}
describe("E22 original A1/A2 chapter continuity without synthetic learner authority",()=>{
 it("keeps every real linked/unlinked source visible in exactly one editorial navigation chapter",()=>{
  const evidence=fresh(),path=buildE22Chapters(evidence);
  const all=[...path.a1,...path.a2].flatMap(c=>c.nodes);
  expect(new Set(all.map(n=>n.key)).size).toBe(all.length);
  expect(all.filter(n=>n.cohort==="e02").length).toBe(evidence.e02.scenes.length+evidence.e02.unmappedScenes.length);
  expect(all.filter(n=>n.cohort==="e03").length).toBe(evidence.e03.scenes.length+evidence.e03.unmappedScenes.length);
  expect(all.filter(n=>n.cohort==="e04").length).toBe(evidence.e04.scenes.length+evidence.e04.unmapped.length);
  for(const c of [...path.a1,...path.a2]){
   expect(c.linkedCount+c.previewCount).toBe(c.nodes.length);
   expect(c.guidedComplete).toBe(0);
   expect(c.reviewReady).toBe(0);
   expect(c.reviewed).toBe(0);
   for(const n of c.nodes.filter(n=>!n.linked))
    expect(n).toMatchObject({status:"preview",guidedCorrect:0,guidedRequired:0,sourceReady:false,reviewReady:false});
  }
 });
 it("keeps original UX1 route-first A1 group and provisional A2 navigation",()=>{
  expect(e22InitialLocation({origin:"e02",targetId:"food"})).toEqual({level:"A1",chapter:2});
  expect(e22InitialLocation({origin:"e02",targetId:"family"})).toEqual({level:"A1",chapter:1});
  expect(e22InitialLocation({origin:"e03",targetId:"weekend-invitation"})).toEqual({level:"A2",chapter:0});
  expect(e22InitialLocation({origin:"e04",targetId:"hotel-reservation"})).toEqual({level:"A2",chapter:1});
  const p=buildE22Chapters(fresh());
  expect(getE22NextChapter(p,"A1",0)).toEqual({level:"A1",id:1});
  expect(getE22NextChapter(p,"A1",p.a1.length-1)).toEqual({level:"A2",id:0});
  expect(getE22NextChapter(p,"A2",0)).toEqual({level:"A2",id:1});
  expect(getE22NextChapter(p,"A2",1)).toBeNull();
 });
 it("separates guided completion, spaced-review readiness and owner-private optional writing eligibility",()=>{
  const base=fresh();
  const original=base.e02.scenes[0]!;
  const caseInfo=base.e19.cases.find(c=>c.key==="e02:"+original.id);
  expect(caseInfo).toBeDefined();
  const updated={
   ...base,
   e02:{...base.e02,scenes:base.e02.scenes.map(s=>s.id===original.id?
    {...s,state:"ready" as const,completedControlled:s.requiredControlled,attempts:s.requiredControlled}:s)},
   e19:{...base.e19,cases:base.e19.cases.map(c=>c.key==="e02:"+original.id?
    {...c,sourceReady:true,sourceListening:true,sourceReading:true,status:"revise" as const,
      firstDraft:"原稿です。",firstAt:"2026-10-17T09:00:00Z"}:c)}
  };
  const path=buildE22Chapters(updated);
  const target=[...path.a1,...path.a2].find(c=>c.nodes.some(n=>n.key==="e02:"+original.id))!;
  const node=target.nodes.find(n=>n.key==="e02:"+original.id)!;
  expect(node).toMatchObject({linked:true,guidedFinished:true,reviewReady:true,reviewed:false,
   writingStatus:"revise",sourceReady:true});
  expect(target.guidedComplete).toBeGreaterThan(0);
  expect(target.reviewReady).toBeGreaterThan(0);
  expect(target.reviewed).toBe(0);
  expect(target.nextReviewKey).toBe(node.key);
  expect(target.nextWritingKey).toBe(node.key);
  // Genuine due review takes priority over optional drafting, no second grading engine.
  expect(e22ChapterFocus(target)).toMatchObject({mode:"review",node:{key:node.key}});
  const off=e24ReadyReviews(path);
  expect(off).toContainEqual({level:target.level,chapterId:target.id,chapterTitle:target.title,node});
  expect(off.every(item=>item.node.linked&&item.node.reviewReady)).toBe(true);
 });
 it("does not promote waiting, reviewed, preview-only or another owner's source as a ready review",()=>{
  const base=fresh(),scene=base.e02.scenes[0]!;
  const targetScene=base.e02.scenes.map(s=>s.id===scene.id?{...s,state:"waiting" as const}:s);
  expect(e24ReadyReviews(buildE22Chapters({...base,e02:{...base.e02,scenes:targetScene}}))).toHaveLength(0);
  const marked=base.e02.scenes.map(s=>s.id===scene.id?{...s,state:"ready" as const}:s);
  const path=buildE22Chapters({...base,e02:{...base.e02,scenes:marked}});
  expect(e24ReadyReviews(path).map(x=>x.node.key)).toContain("e02:"+scene.id);
  const completed=base.e02.scenes.map(s=>s.id===scene.id?{...s,state:"reviewed" as const}:s);
  expect(e24ReadyReviews(buildE22Chapters({...base,e02:{...base.e02,scenes:completed}}))).toHaveLength(0);
 });
 it("prepares exact owner-scoped native E02 due-review events for browser acceptance",()=>{
  const scene=E02_AVAILABLE_SCENES.find(s=>s.id==="food");
  expect(scene).toBeDefined();
  const owner="00000000-0000-4000-8000-000000000001";
  const prompts=buildE02Journey(scene!.id).filter((item):item is StudyPrompt=>!isStudyLesson(item));
  const required=["hear","read","reply","recall"].map(suffix=>
   prompts.find(p=>p.id.endsWith("-"+suffix))!);
  expect(required.every(Boolean)).toBe(true);
  const events=required.map((prompt,i)=>createStudyEvent({id:"e24-ready-"+i,userId:owner,
   deviceId:"source-review-fixture",prompt,response:prompt.acceptedAnswers[0]!,
   occurredAt:"2026-10-14T10:00:00.000Z",responseTimeMs:700}));
  expect(events.every(e=>e.result==="correct")).toBe(true);
  expect(getE02Overview(events,new Date("2026-10-18T10:00:00Z")).scenes.find(s=>s.id==="food")?.state).toBe("ready");
  mkdirSync(resolve("artifacts"),{recursive:true});
  writeFileSync(resolve("artifacts/e24-review-browser-seed.json"),JSON.stringify({owner,events,sceneId:"food"}),"utf8");
 });
 it("does not mark a chapter certified or count preview-only A2 chapters as completed",()=>{
  const path=buildE22Chapters(fresh());
  for(const c of path.a2){
   const previews=c.nodes.filter(n=>!n.linked);
   if(previews.length){
    expect(c.nextPreviewKey).toBe(previews[0]!.key);
    expect(c.guidedComplete).toBe(0);
   }
  }
 });
});

describe("E22 chapter context survives session view remount but not Account owner changes",()=>{
 it("retains the same-owner selection without materializing learner progress",()=>{
  const selection={owner:"local-owner-a",value:{level:"A1" as const,chapter:3}};
  expect(resolveE22OwnerSelection("local-owner-a",selection)).toEqual(selection.value);
  expect(resolveE22OwnerSelection("local-owner-b",selection)).toBeNull();
  expect(resolveE22OwnerSelection("",selection)).toBeNull();
  expect(resolveE22OwnerSelection("local-owner-a",null)).toBeNull();
 });
});
