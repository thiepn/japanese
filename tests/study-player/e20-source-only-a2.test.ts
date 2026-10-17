import "fake-indexeddb/auto";
import {describe,expect,it} from "vitest";
import {isStudyLesson} from "../../packages/study-player/src/index";
import {listStudyEvents,listMemoryTraces} from "../../packages/local-db/src/index";
import {E03_SCENES} from "../../apps/web/src/study/a2ExcellenceScenes";
import {E04_SCENES} from "../../apps/web/src/study/a2ExcellenceAdvancedScenes";
import {E03_UNMAPPED_SCENES,buildE03Preview} from "../../apps/web/src/study/a2ExcellenceCourse";
import {E04_UNMAPPED,buildE04Preview} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {getE20SourceOnlyScenes,getE20SourceOnlyScene,compareE20WrittenDrafts,E20_STAGES} from "../../apps/web/src/study/e20SourceOnlyA2";

describe("E20 original A2 unlinked-source communication",()=>{
 const scenes=getE20SourceOnlyScenes();
 it("exposes exactly original unmapped E03/E04 scenes without claiming a canonical Can-do",()=>{
  const expected=[
   ...E03_UNMAPPED_SCENES.map(s=>"e03:"+s.id),
   ...E04_UNMAPPED.map(s=>"e04:"+s.id)
  ];
  expect(scenes.map(s=>s.key)).toEqual(expected);
  expect(new Set(expected).size).toBe(expected.length);
  expect(scenes.length).toBeGreaterThan(0);
  expect(scenes.length).toBeLessThanOrEqual(E03_SCENES.length+E04_SCENES.length);
  expect(getE20SourceOnlyScene("e03:unverified-invented")).toBeNull();
  expect(E20_STAGES.map(s=>s.id)).toEqual(["listen","read","respond","compose"]);
 });
 it("preserves all original authored dialogue, reading, response choices, explanations and writing task exactly",()=>{
  for(const s of scenes){
   const original=s.cohort==="e03"?E03_SCENES.find(x=>x.id===s.sceneId)
    :E04_SCENES.find(x=>x.id===s.sceneId);
   expect(original).toBeDefined();
   const content=s.cohort==="e03"?E03_SCENES.find(x=>x.id===s.sceneId)!:E04_SCENES.find(x=>x.id===s.sceneId)!;
   const dialogue=s.cohort==="e03"
    ?(content as typeof E03_SCENES[number]).dialogue.map(t=>t.speaker+"： "+t.ja).join("\n")
    :(content as typeof E04_SCENES[number]).turns.map(t=>t.who+"： "+t.ja).join("\n");
   expect(s.originalJapaneseDialogue).toBe(dialogue);
   expect(s.originalJapaneseDialogue.length).toBeGreaterThan(5);
   expect(s.listenQuestions).toHaveLength(2);
   expect(s.readQuestions).toHaveLength(2);
   expect(s.sourceNotes.length).toBeGreaterThan(0);
   expect(s.writingTask.length).toBeGreaterThan(10);
   expect(s.speakingTask.length).toBeGreaterThan(10);
   const all=[...s.listenQuestions,...s.readQuestions,s.reply];
   expect(new Set(all.map(q=>q.id)).size).toBe(5);
   for(const q of all){
    expect(q.choices).toHaveLength(3);
    expect(new Set(q.choices).size).toBe(3);
    expect(q.choices.filter(v=>v===q.reference)).toHaveLength(1);
    expect(q.prompt.length).toBeGreaterThan(5);
    expect(q.sourceExplanation.length).toBeGreaterThan(10);
   }
   expect(s.model.references.length).toBeGreaterThan(0);
   expect(s.model.references.every(v=>v.trim())).toBe(true);
  }
 });
 it("retains the complete original reading-only StudyLesson preview with no StudyPrompt or grader",()=>{
  for(const s of scenes){
   const preview=s.cohort==="e03"?buildE03Preview(s.sceneId):buildE04Preview(s.sceneId);
   expect(preview.length).toBeGreaterThanOrEqual(4);
   expect(preview.every(isStudyLesson)).toBe(true);
   const text=preview.map(x=>isStudyLesson(x)?x.sourceLabel??"":"").join(" ");
   expect(text).toContain("thiepn-original");
   expect(text).not.toMatch(/verified Can-do association/);
  }
 });
 it("uses only literal text comparison rather than semantic or Japanese correctness assessment",()=>{
  expect(compareE20WrittenDrafts("駅で会いましょう。","駅で会いましょう。")).toEqual({
   changed:false,beforeChange:"",afterChange:""
  });
  expect(compareE20WrittenDrafts("駅で会いましょう。","駅で会いませんか。")).toMatchObject({
   changed:true,beforeChange:"しょう",afterChange:"せんか"
  });
  expect(compareE20WrittenDrafts("","日本語")).toMatchObject({changed:true,beforeChange:"",afterChange:"日本語"});
 });
 it("cannot create any owner events or scheduler traces when building the source-only workshop",async()=>{
  const owner="e20-original-preview-owner";
  expect((await listStudyEvents(owner)).length).toBe(0);
  for(const s of scenes)getE20SourceOnlyScene(s.key);
  expect((await listStudyEvents(owner)).length).toBe(0);
  expect((await listMemoryTraces(owner)).length).toBe(0);
 });
});
