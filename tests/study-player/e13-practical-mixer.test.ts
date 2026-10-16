import "fake-indexeddb/auto";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,expect,it} from "vitest";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {getE06Overview,E06_LINKED_CASES,buildE11OptionalSession} from "../../apps/web/src/study/e06IndependentCourse";
import {e02ReviewPrompts} from "../../apps/web/src/study/a1ExcellenceCourse";
import {e03ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceCourse";
import {e04ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {buildE13PracticalMix,eligibleE13Cases,type E13PracticeMode} from "../../apps/web/src/study/e13PracticalMixer";
import {saveStudyEvent,listStudyEvents,listMemoryTraces} from "../../packages/local-db/src/index";

const sets={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
const guest="00000000-0000-4000-8000-000000000001";

function sourceReady(owner:string){
  const summary=getE06Overview([]).cases;
  const selections:Array<{id:string;events:ReturnType<typeof createStudyEvent>[]}>=[];
  for(const caseSource of E06_LINKED_CASES){
    const row=summary.find(c=>c.id===caseSource.id);
    if(!row?.canDoId||!row.canonicalUnitId)continue;
    const original=sets[row.anchorCohort].filter(prompt=>
      prompt.primaryTarget.kind==="can_do"&&prompt.primaryTarget.id===row.canDoId&&
      prompt.eventMetadata?.[row.anchorCohort+"SceneId"]===row.anchorSceneId&&
      prompt.eventMetadata?.[row.anchorCohort+"UnitId"]===row.canonicalUnitId);
    const audio=original.find(p=>p.skill==="listening"||p.skill==="audio_recognition");
    const reading=original.find(p=>["reading","comprehension","form_selection"].includes(p.skill));
    if(!audio?.acceptedAnswers[0]||!reading?.acceptedAnswers[0])continue;
    const events=[audio,reading].map((prompt,index)=>createStudyEvent({
      id:`e13-original-${owner}-${caseSource.id}-${index}`,userId:owner,deviceId:"original-source-fixture",
      prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt:new Date(Date.UTC(2026,9,16,7,index)).toISOString(),responseTimeMs:500,
    }));
    if(events.every(e=>e.result==="correct")&&getE06Overview(events).cases.find(c=>c.id===caseSource.id)?.prerequisiteReady)
      selections.push({id:caseSource.id,events});
    if(selections.length>=3)break;
  }
  if(selections.length<2)throw Error("E13_NOT_TWO_VERIFIED_ORIGINAL_SOURCE_CASES");
  return {ids:selections.map(c=>c.id),events:selections.flatMap(c=>c.events)};
}
function prompts(steps:ReturnType<typeof buildE13PracticalMix>):StudyPrompt[]{
  return steps.filter((step):step is StudyPrompt=>!isStudyLesson(step));
}

describe("E13 native cross-situation rehearsal: original A1/A2 authority only",()=>{
  const source=sourceReady("e13-qualified");
  const two=source.ids.slice(0,2);

  it("only allows two or three different cases, each with original verified listening and reading prerequisites",()=>{
    expect(eligibleE13Cases([])).toEqual([]);
    expect(()=>buildE13PracticalMix(two,"understand",[])).toThrow("E13_ORIGINAL_SOURCE_PREREQUISITES_REQUIRED");
    expect(()=>buildE13PracticalMix([two[0]!],"understand",source.events)).toThrow("E13_SELECT_TWO_OR_THREE_DISTINCT_CASES");
    expect(()=>buildE13PracticalMix([two[0]!,two[0]!],"understand",source.events)).toThrow("E13_SELECT_TWO_OR_THREE_DISTINCT_CASES");
    expect(()=>buildE13PracticalMix([two[0]!,"unlinked-invented-case"],"understand",source.events)).toThrow("E13_ORIGINAL_SOURCE_PREREQUISITES_REQUIRED");
    expect(()=>buildE13PracticalMix(two,"nonexistent" as E13PracticeMode,source.events)).toThrow("E13_UNKNOWN_PRACTICE_MODE");
    expect(eligibleE13Cases(source.events).map(c=>c.id)).toEqual(expect.arrayContaining(two));
  });

  it.each(["understand","write-revise","whole-situation"] as const)(
    "executes %s in one native player with no duplicate, invented or authoritative E11 events",
    mode=>{
      const steps=buildE13PracticalMix(two,mode,source.events);
      const original=two.flatMap(id=>prompts(buildE11OptionalSession(id,source.events)));
      const originalIds=new Set(original.map(p=>p.id));
      const actual=prompts(steps);
      expect(new Set(actual.map(p=>p.id)).size).toBe(actual.length);
      expect(actual.every(p=>originalIds.has(p.id))).toBe(true);
      expect(actual.every(p=>p.eventMetadata?.nonAuthoritative===true&&
        p.eventMetadata?.schedulerExcluded===true&&p.sourceId==="thiepn-original")).toBe(true);
      expect(actual.filter(p=>p.id.endsWith("-e11-micro-listening"))).toHaveLength(mode==="write-revise"?0:2);
      expect(actual.filter(p=>p.id.endsWith("-e11-micro-reading"))).toHaveLength(mode==="write-revise"?0:2);
      expect(actual.filter(p=>p.id.endsWith("-e11-original-letter"))).toHaveLength(mode==="understand"?0:2);
      expect(actual.filter(p=>p.id.endsWith("-e12-revised-letter"))).toHaveLength(mode==="understand"?0:2);
      expect(steps.filter(isStudyLesson).length).toBeGreaterThan(3);
    }
  );

  it("keeps both originally assigned Can-do identities intact in a three-situation mix",()=>{
    const ids=source.ids.slice(0,3);
    if(ids.length<3)return;
    const result=prompts(buildE13PracticalMix(ids,"whole-situation",source.events));
    for(const id of ids){
      const original=prompts(buildE11OptionalSession(id,source.events));
      const fromMix=result.filter(p=>p.eventMetadata?.e11CaseId===id);
      expect(fromMix.map(p=>p.id)).toEqual(original.map(p=>p.id));
      expect(fromMix.map(p=>p.primaryTarget)).toEqual(original.map(p=>p.primaryTarget));
    }
  });

  it("retains one owner's original private draft only inside that source case and never creates mastery cards",async()=>{
    const owner="e13-private-owner";
    const src=sourceReady(owner);
    const ids=src.ids.slice(0,2);
    for(const event of src.events)await saveStudyEvent(event);
    const first=prompts(buildE11OptionalSession(ids[0]!,src.events)).find(p=>p.id.endsWith("-e11-original-letter"))!;
    const response="すみません。午後六時の交流会は西の入り口で受付します。場所をもう一度確認してください。";
    const writing=createStudyEvent({
      id:"e13-private-first-draft",userId:owner,deviceId:"original-source-fixture",prompt:first,
      response,occurredAt:"2026-10-16T10:10:00.000Z",responseTimeMs:800,
    });
    writing.result="skipped";
    await saveStudyEvent(writing);
    const mine=buildE13PracticalMix(ids,"write-revise",await listStudyEvents(owner));
    const other=buildE13PracticalMix(ids,"write-revise",src.events);
    const privateNotes=(steps:typeof mine)=>steps.filter(isStudyLesson).flatMap(s=>s.examples??[])
      .filter(e=>e.expression==="Your prior E11 first draft (private)").map(e=>e.note);
    expect(privateNotes(mine)).toContain(response);
    expect(privateNotes(other)).not.toContain(response);
    expect(await listMemoryTraces(owner)).toHaveLength(0);
  });

  it("writes only disposable original StudyEvent fixtures for desktop/mobile browser, not a new runtime API",()=>{
    const fixture=sourceReady(guest);
    mkdirSync(resolve("artifacts"),{recursive:true});
    writeFileSync(resolve("artifacts/e13-browser-seed.json"),JSON.stringify({
      guest,caseIds:fixture.ids.slice(0,2),events:fixture.events,
    }),"utf8");
    expect(fixture.events).toHaveLength(4);
  });
});
