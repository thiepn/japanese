import "fake-indexeddb/auto";
import {describe,expect,it} from "vitest";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {getE06Overview,E06_LINKED_CASES,buildE11OptionalSession} from "../../apps/web/src/study/e06IndependentCourse";
import {e02ReviewPrompts} from "../../apps/web/src/study/a1ExcellenceCourse";
import {e03ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceCourse";
import {e04ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {E11_RESPONSE_MISSIONS} from "../../apps/web/src/study/e11ResponseMissions";
import {E11_BY_CASE} from "../../apps/web/src/study/e11PracticalTransfer";
import {
  buildE14HandoffSession,eligibleE14Cases,projectE14Review,
  type E14HandoffMode,
} from "../../apps/web/src/study/e14ListeningHandoff";
import {saveStudyEvent,listStudyEvents,listMemoryTraces} from "../../packages/local-db/src/index";

const sets={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
const owner="e14-learner-original";
function readySource(){
  const summary=getE06Overview([]).cases;
  const ids:string[]=[];
  const events:ReturnType<typeof createStudyEvent>[]=[];
  for(const source of E06_LINKED_CASES){
    const row=summary.find(c=>c.id===source.id);
    if(!row?.canDoId||!row.canonicalUnitId)continue;
    const original=sets[row.anchorCohort].filter(prompt=>
      prompt.primaryTarget.kind==="can_do"&&prompt.primaryTarget.id===row.canDoId&&
      prompt.eventMetadata?.[row.anchorCohort+"SceneId"]===row.anchorSceneId&&
      prompt.eventMetadata?.[row.anchorCohort+"UnitId"]===row.canonicalUnitId);
    const listen=original.find(p=>p.skill==="listening"||p.skill==="audio_recognition");
    const reading=original.find(p=>["reading","comprehension","form_selection"].includes(p.skill));
    if(!listen?.acceptedAnswers[0]||!reading?.acceptedAnswers[0])continue;
    const evidence=[listen,reading].map((prompt,i)=>createStudyEvent({
      id:"e14-original-"+source.id+"-"+i,userId:owner,deviceId:"fixture",
      prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt:"2026-10-16T10:00:0"+i+"Z",responseTimeMs:400,
    }));
    if(getE06Overview(evidence).cases.find(c=>c.id===source.id)?.prerequisiteReady){
      ids.push(source.id);events.push(...evidence);
    }
  }
  if(ids.length<3)throw Error("E14_NOT_ENOUGH_ORIGINAL_QUALIFIED_CASES");
  return {ids,events};
}
const source=readySource();
const id=source.ids[0]!;
function prompts(steps:ReturnType<typeof buildE14HandoffSession>){
  return steps.filter((step):step is StudyPrompt=>!isStudyLesson(step));
}
describe("E14 listening -> original reply -> private follow-up authority",()=>{
  it("only offers original E11 cases with canonical course listening/reading prerequisites",()=>{
    expect(eligibleE14Cases(getE06Overview([]).cases)).toEqual([]);
    expect(()=>buildE14HandoffSession(id,"complete-handoff",owner,[]))
      .toThrow("E11_SOURCE_LESSON_FIRST");
    expect(()=>buildE14HandoffSession("not-original","complete-handoff",owner,source.events))
      .toThrow();
    expect(eligibleE14Cases(getE06Overview(source.events).cases).map(c=>c.id))
      .toEqual(expect.arrayContaining(source.ids));
    expect(E11_RESPONSE_MISSIONS).toHaveLength(E11_BY_CASE.size);
  });

  it.each([
    ["listen-and-reply",3],
    ["follow-up-and-revise",4],
    ["complete-handoff",6],
  ] as const)("reuses exact historical native E11/E12 StudyPrompt IDs in %s", (mode,count)=>{
    const steps=buildE14HandoffSession(id,mode,owner,source.events);
    const original=prompts(buildE11OptionalSession(id,source.events));
    const included=prompts(steps);
    expect(included).toHaveLength(count);
    expect(new Set(included.map(p=>p.id)).size).toBe(count);
    expect(included.every(p=>original.includes(p))).toBe(true);
    expect(included.every(p=>p.eventMetadata?.nonAuthoritative===true&&
      p.eventMetadata?.schedulerExcluded===true&&
      p.sourceId==="thiepn-original")).toBe(true);
    const kinds=included.map(p=>String(p.eventMetadata?.e11Task));
    expect(kinds).toContain("e11-role-response-1");
    expect(kinds).toContain("e11-role-response-2");
    expect(included[0]?.id.endsWith("e11-micro-listening")).toBe(mode!=="follow-up-and-revise");
    expect(included.some(p=>p.eventMetadata?.e11Task==="independent-letter"))
      .toBe(mode!=="listen-and-reply");
    expect(steps.at(-1)).toMatchObject({kind:"lesson"});
    expect(steps.at(-1)&&isStudyLesson(steps.at(-1)!)
      ?(steps.at(-1) as {examples?:unknown[]}).examples?.length:0).toBeGreaterThan(4);
  });

  it("cannot import a foreign owner's source evidence or invent E14 grade/target",()=>{
    const foreign=createStudyEvent({
      id:"foreign",userId:"other-learner",deviceId:"fixture",
      prompt:prompts(buildE11OptionalSession(id,source.events))[0]!,
      response:"incorrect",occurredAt:"2026-10-16T10:00:00Z",responseTimeMs:500,
    });
    expect(()=>buildE14HandoffSession(id,"complete-handoff",owner,[...source.events,foreign]))
      .toThrow("E14_OWNER_MISMATCH");
    expect(()=>buildE14HandoffSession(id,"invalid" as E14HandoffMode,owner,source.events))
      .toThrow("E14_UNKNOWN_MODE");
    const session=buildE14HandoffSession(id,"complete-handoff",owner,source.events);
    const original=prompts(buildE11OptionalSession(id,source.events));
    expect(prompts(session).map(p=>p.primaryTarget)).toEqual(
      prompts(session).map(p=>original.find(x=>x.id===p.id)!.primaryTarget));
  });

  it("projects original listening/reply evidence and the latest real private draft without invented semantic scores",()=>{
    const original=prompts(buildE11OptionalSession(id,source.events));
    const listening=original.find(p=>p.id.endsWith("-e11-micro-listening"))!;
    const reply=original.find(p=>p.id.endsWith("-e11-role-response-1"))!;
    const first=original.find(p=>p.id.endsWith("-e11-original-letter"))!;
    const latest="すみません。会場の場所を確認していただけますか。";
    const previous="すみません。場所をもう一度教えてください。";
    const history=[
      [listening,listening.acceptedAnswers[0]!,"a", "2026-10-16T11:00:00Z"],
      [reply,reply.choices.find(x=>x!==reply.acceptedAnswers[0])!,"b","2026-10-16T11:02:00Z"],
      [first,previous,"c","2026-10-16T11:03:00Z"],
      [first,latest,"d","2026-10-16T11:04:00Z"],
    ].map(([prompt,response,key,occurredAt])=>createStudyEvent({
      id:key!,userId:owner,deviceId:"fixture",prompt:prompt as StudyPrompt,
      response:response!,occurredAt:occurredAt!,responseTimeMs:700,
    }));
    const mine=projectE14Review(id,owner,[...source.events,...history]);
    const byKey=new Map(mine.review.map(row=>[row.key,row]));
    expect(byKey.get("listening")).toMatchObject({attempted:true,result:"matched"});
    expect(byKey.get("reply-one")).toMatchObject({attempted:true,result:"needs-context-review"});
    expect(byKey.get("first-draft")).toMatchObject({result:"unscored-writing",learnerText:latest});
    expect(byKey.get("revision")).toMatchObject({attempted:false,learnerText:null});
    expect(mine.reviewQuestions).toHaveLength(3);
    expect(mine.review.every(r=>!r.sourceFeedback.includes("CEFR score"))).toBe(true);
    const theirs=projectE14Review(id,"another-account",
      source.events.map(e=>({...e,userId:"another-account"})));
    expect(theirs.review.every(row=>!row.attempted&&row.learnerText===null)).toBe(true);
  });

  it("ignores forged/stale prompt metadata and never shows another owner's writing",()=>{
    const original=prompts(buildE11OptionalSession(id,source.events));
    const first=original.find(p=>p.id.endsWith("-e11-original-letter"))!;
    const foreign=createStudyEvent({
      id:"forged-private",userId:owner,deviceId:"fixture",prompt:first,
      response:"PRIVATE_STRING_SHOULD_NOT_APPEAR",
      occurredAt:"2026-10-16T11:06:00Z",responseTimeMs:300,
    });
    foreign.contentVersion="unknown-content-version";
    const review=projectE14Review(id,owner,[...source.events,foreign]);
    expect(JSON.stringify(review)).not.toContain("PRIVATE_STRING_SHOULD_NOT_APPEAR");
    expect(review.review.find(x=>x.key==="first-draft")?.attempted).toBe(false);
  });

  it("persists original optional prompts into the native owner outbox but never FSRS memory traces",async()=>{
    const isolatedOwner="e14-native-owner-"+crypto.randomUUID();
    const events=source.events.map(e=>({...e,
      id:e.id+isolatedOwner,userId:isolatedOwner,deviceId:"fixture"}));
    const steps=buildE14HandoffSession(id,"complete-handoff",isolatedOwner,events);
    const write=prompts(steps).find(p=>p.id.endsWith("-e11-original-letter"))!;
    const response="すみません。午後の交流会の入口をもう一度確認してください。";
    const event=createStudyEvent({id:"e14-owner-only-write",userId:isolatedOwner,deviceId:"fixture",
      prompt:write,response,occurredAt:"2026-10-16T12:00:00Z",responseTimeMs:1000});
    event.result="skipped";
    await saveStudyEvent(event);
    expect((await listStudyEvents(isolatedOwner)).map(x=>x.id)).toContain(event.id);
    expect((await listStudyEvents(isolatedOwner))[0]?.metadata?.learnerResponse).toBe(response);
    expect(await listMemoryTraces(isolatedOwner)).toEqual([]);
    expect((await listStudyEvents("not-the-owner")).find(x=>x.id===event.id)).toBeUndefined();
  });
});
