import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { createStudyEvent, isStudyLesson, type StudyPrompt } from "../../packages/study-player/src/index";
import { getE06Overview, E06_LINKED_CASES, buildE11OptionalSession } from "../../apps/web/src/study/e06IndependentCourse";
import { e02ReviewPrompts } from "../../apps/web/src/study/a1ExcellenceCourse";
import { e03ReviewPrompts } from "../../apps/web/src/study/a2ExcellenceCourse";
import { e04ReviewPrompts } from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import { projectE14Review } from "../../apps/web/src/study/e14ListeningHandoff";
import {
  E15_CORRECTION_REVISIT_MS,E15_RETRIEVAL_REVISIT_MS,
  buildE15SourceRecovery,planE15Revisits,type E15Focus,
} from "../../apps/web/src/study/e15ContextRecovery";

const cohorts={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
const owner="e15-private-original-owner";

function eligible(){
  const all=getE06Overview([]).cases;
  for(const item of E06_LINKED_CASES){
    const caseRow=all.find(c=>c.id===item.id);
    if(!caseRow?.canDoId||!caseRow.canonicalUnitId)continue;
    const originals=cohorts[caseRow.anchorCohort].filter(p=>
      p.primaryTarget.kind==="can_do"&&p.primaryTarget.id===caseRow.canDoId&&
      p.eventMetadata?.[caseRow.anchorCohort+"SceneId"]===caseRow.anchorSceneId&&
      p.eventMetadata?.[caseRow.anchorCohort+"UnitId"]===caseRow.canonicalUnitId);
    const listening=originals.find(p=>p.skill==="listening"||p.skill==="audio_recognition");
    const reading=originals.find(p=>["reading","comprehension","form_selection"].includes(p.skill));
    if(!listening?.acceptedAnswers[0]||!reading?.acceptedAnswers[0])continue;
    const events=[listening,reading].map((prompt,index)=>createStudyEvent({
      id:"e15-original-prereq-"+item.id+"-"+index,
      userId:owner,deviceId:"source-fixture",prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt:"2026-10-15T08:00:0"+index+"Z",responseTimeMs:350,
    }));
    if(getE06Overview(events).cases.find(c=>c.id===item.id)?.prerequisiteReady)
      return {id:item.id,events};
  }
  throw Error("E15_NO_SOURCE_QUALIFIED_ORIGINAL_CASE");
}
const source=eligible();
const original=buildE11OptionalSession(source.id,source.events);
const prompt=(suffix:string)=>{
  const p=original.find(step=>step.id.endsWith(suffix));
  if(!p||isStudyLesson(p))throw Error("E15_MISSING_ORIGINAL_PROMPT:"+suffix);
  return p;
};
const attempt=(p:StudyPrompt,response:string,at:string,mark:string)=>createStudyEvent({
  id:"e15-attempt-"+mark,userId:owner,deviceId:"source-fixture",
  prompt:p,response,occurredAt:at,responseTimeMs:770,
});
const plan=(events=source.events,now="2026-10-16T10:00:00Z")=>
  planE15Revisits([projectE14Review(source.id,owner,events)],new Date(now));
const focus=(items:ReturnType<typeof plan>,key:E15Focus)=>items.find(row=>row.focus===key);

describe("E15 optional spaced original-context recovery (not FSRS)",()=>{
  it("suggests only original source-qualified prompts and omits a premature revision",()=>{
    const items=plan();
    expect(items).toHaveLength(4);
    expect(items.map(item=>item.focus).sort()).toEqual(
      ["listen","reply-one","reply-two","first-draft"].sort());
    expect(items.every(item=>item.ready&&item.reason==="not-attempted")).toBe(true);
    expect(items.every(item=>item.caseId===source.id&&item.nextSuggestedAt===null)).toBe(true);
    expect(()=>buildE15SourceRecovery(source.id,"revision",owner,source.events))
      .toThrow("E15_ORIGINAL_ADVICE_MISSING");
    expect(()=>buildE15SourceRecovery(source.id,"listen",owner,[])).toThrow();
  });

  it("spaces incorrect choices 20 hours, not arbitrary immediate retry or FSRS mastery",()=>{
    const reply=prompt("-e11-role-response-1");
    const incorrect=reply.choices.find(choice=>choice!==reply.acceptedAnswers[0])!;
    const at="2026-10-16T11:00:00Z";
    const events=[...source.events,attempt(reply,incorrect,at,"wrong")];
    const early=focus(plan(events,"2026-10-17T06:59:59Z"),"reply-one")!;
    expect(early).toMatchObject({
      ready:false,reason:"context-correction",lastAttemptAt:at,
      nextSuggestedAt:"2026-10-17T07:00:00.000Z",
    });
    expect(()=>buildE15SourceRecovery(source.id,"reply-one",owner,events,new Date("2026-10-17T06:59:59Z")))
      .toThrow("E15_REVISIT_NOT_YET_SUGGESTED");
    const due=focus(plan(events,"2026-10-17T07:00:00Z"),"reply-one")!;
    expect(due.ready).toBe(true);
    expect(buildE15SourceRecovery(source.id,"reply-one",owner,events,new Date("2026-10-17T07:00:00Z"))
      .filter(step=>!isStudyLesson(step))).toHaveLength(1);
    expect(E15_CORRECTION_REVISIT_MS).toBe(20*60*60*1000);
  });

  it("suggests matched original replies and self-checked writing after 72h",()=>{
    const reply=prompt("-e11-role-response-2"),writing=prompt("-e11-original-letter");
    const at="2026-10-16T11:00:00Z";
    const events=[
      ...source.events,attempt(reply,reply.acceptedAnswers[0]!,at,"right"),
      attempt(writing,"すみません。午後の受付について確認してください。",at,"private"),
    ];
    const notYet=plan(events,"2026-10-19T10:59:59Z");
    expect(focus(notYet,"reply-two")).toMatchObject({
      ready:false,reason:"independent-retrieval",nextSuggestedAt:"2026-10-19T11:00:00.000Z",
    });
    expect(focus(notYet,"first-draft")).toMatchObject({
      ready:false,reason:"writing-reflection",nextSuggestedAt:"2026-10-19T11:00:00.000Z",
    });
    expect(focus(notYet,"revision")).toMatchObject({ready:true,reason:"not-attempted"});
    expect(focus(plan(events,"2026-10-19T11:00:00Z"),"reply-two")?.ready).toBe(true);
    expect(E15_RETRIEVAL_REVISIT_MS).toBe(72*60*60*1000);
  });

  it.each(["listen","reply-one","reply-two","first-draft"] as const)(
    "%s constructs a focused actual native E11/E12 interaction without duplicate IDs or new grader",stage=>{
      const selected=buildE15SourceRecovery(source.id,stage,owner,source.events);
      const actual=selected.filter((step):step is StudyPrompt=>!isStudyLesson(step));
      const canonical=new Map(original.filter((s):s is StudyPrompt=>!isStudyLesson(s)).map(p=>[p.id,p]));
      expect(actual.length).toBeGreaterThan(0);
      expect(new Set(actual.map(x=>x.id)).size).toBe(actual.length);
      for(const p of actual){
        expect(canonical.get(p.id)).toEqual(p);
        expect(p.sourceId).toBe("thiepn-original");
        expect(p.eventMetadata).toMatchObject({
          e11CaseId:source.id,nonAuthoritative:true,schedulerExcluded:true,
        });
      }
      if(stage==="listen"){
        expect(actual.some(p=>p.speechSynthesisLanguage==="ja-JP")).toBe(true);
        expect(actual.some(p=>p.id.endsWith("-e11-micro-reading"))).toBe(true);
      }
      if(stage==="first-draft"){
        expect(actual.some(p=>p.id.endsWith("-e12-revised-letter"))).toBe(true);
      }
    }
  );

  it("offers the original revision-only route once an actual prior first draft is recorded",()=>{
    const first=prompt("-e11-original-letter");
    const text="すみません。会場の時間を確認できますか。";
    const events=[...source.events,attempt(first,text,"2026-10-16T11:00:00Z","first")];
    const selected=buildE15SourceRecovery(source.id,"revision",owner,events,new Date("2026-10-16T12:00:00Z"));
    const actual=selected.filter((p):p is StudyPrompt=>!isStudyLesson(p));
    expect(actual.map(p=>p.id)).toEqual([prompt("-e12-revised-letter").id]);
    const coach=selected.filter(isStudyLesson).flatMap(item=>item.examples??[]);
    expect(coach).toContainEqual({expression:"Your prior E11 first draft (private)",note:text});
  });

  it("rejects mixed workspaces and forged context/version metadata without surfacing foreign text",()=>{
    const first=prompt("-e11-original-letter");
    const foreign=attempt(first,"SECRET_PRIVATE_WRITING","2026-10-16T11:00:00Z","foreign");
    foreign.userId="different-owner";
    expect(()=>buildE15SourceRecovery(source.id,"first-draft",owner,[...source.events,foreign]))
      .toThrow("E15_OWNER_MISMATCH");
    const forged=attempt(first,"SECRET_PRIVATE_WRITING","2026-10-16T11:00:00Z","forged");
    forged.contentVersion="not-original";
    expect(JSON.stringify(plan([...source.events,forged]))).not.toContain("SECRET_PRIVATE_WRITING");
    expect(focus(plan([...source.events,forged]),"first-draft")).toMatchObject({ready:true,reason:"not-attempted"});
  });

  it("does not fabricate a review time from corrupt or missing local timestamps",()=>{
    const reply=prompt("-e11-role-response-1");
    const bad=attempt(reply,reply.acceptedAnswers[0]!,"invalid-local-time","bad-time");
    const suggestions=plan([...source.events,bad]);
    expect(focus(suggestions,"reply-one")).toMatchObject({
      ready:false,reason:"invalid-date",nextSuggestedAt:null,
    });
    expect(()=>buildE15SourceRecovery(source.id,"reply-one",owner,[...source.events,bad]))
      .toThrow("E15_REVISIT_NOT_YET_SUGGESTED");
  });

  it("retains the latest attempt for a source cue: new correction overrides historical matched choice",()=>{
    const p=prompt("-e11-role-response-1");
    const old=attempt(p,p.acceptedAnswers[0]!,"2026-10-15T11:00:00Z","old");
    const wrong=attempt(p,p.choices.find(x=>x!==p.acceptedAnswers[0])!,
      "2026-10-16T11:00:00Z","new");
    expect(focus(plan([...source.events,old,wrong],"2026-10-17T07:00:00Z"),"reply-one"))
      .toMatchObject({reason:"context-correction",ready:true,lastAttemptAt:"2026-10-16T11:00:00Z"});
  });
});
