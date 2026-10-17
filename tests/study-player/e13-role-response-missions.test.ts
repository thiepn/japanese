import {describe,expect,it} from "vitest";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {e02ReviewPrompts} from "../../apps/web/src/study/a1ExcellenceCourse";
import {e03ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceCourse";
import {e04ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {
  E06_LINKED_CASES,buildE11OptionalSession,getE06Overview,e06ReviewPrompts,
} from "../../apps/web/src/study/e06IndependentCourse";
import {
  E11_RESPONSE_MISSIONS,assertE11ResponseMissionSources,
} from "../../apps/web/src/study/e11ResponseMissions";
import {E11_BY_CASE} from "../../apps/web/src/study/e11PracticalTransfer";

const sourcePrompts={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
const when=(minute:number)=>new Date(Date.UTC(2026,9,16,8,minute)).toISOString();
function sourceEvents(id:string,owner:string){
  const item=getE06Overview([]).cases.find(x=>x.id===id);
  if(!item?.canDoId||!item.canonicalUnitId)throw Error("E11_CAN_DO_MISSING:"+id);
  const candidates=sourcePrompts[item.anchorCohort].filter(x=>
    x.primaryTarget.kind==="can_do"&&x.primaryTarget.id===item.canDoId&&
    x.eventMetadata?.[item.anchorCohort+"SceneId"]===item.anchorSceneId&&
    x.eventMetadata?.[item.anchorCohort+"UnitId"]===item.canonicalUnitId);
  const listen=candidates.find(x=>x.skill==="listening"||x.skill==="audio_recognition");
  const read=candidates.find(x=>["reading","comprehension","form_selection"].includes(x.skill));
  if(!listen||!read)throw Error("E11_CANONICAL_SOURCE_LISTEN_READ_MISSING:"+id);
  return [listen,read].map((p,i)=>createStudyEvent({
    id:"e11-source-"+id+"-"+i,userId:owner,deviceId:"test-only",prompt:p,
    response:p.acceptedAnswers[0]!,occurredAt:when(i),responseTimeMs:450,
  }));
}
function replyPrompt(steps:ReturnType<typeof buildE11OptionalSession>,index:1|2){
  const result=steps.find(x=>!isStudyLesson(x)&&x.id.endsWith("-e11-role-response-"+index));
  if(!result||isStudyLesson(result))throw Error("E11_SOURCE_RESPONSE_MISSING:"+index);
  return result;
}

describe("E13 seven-case original next-reply communication practice",()=>{
  it("maps exactly two original response decisions per seven E11 dialogues, with no invented strings",()=>{
    expect(()=>assertE11ResponseMissionSources()).not.toThrow();
    expect(E11_RESPONSE_MISSIONS).toHaveLength(7);
    expect(E11_RESPONSE_MISSIONS.map(x=>x.caseId).sort()).toEqual([...E11_BY_CASE.keys()].sort());
    for(const entry of E11_RESPONSE_MISSIONS){
      const t=E11_BY_CASE.get(entry.caseId)!;
      for(const cue of entry.decisions){
        expect(t.turns[cue.correctTurn]?.ja).toBeTruthy();
        expect(cue.contrastTurns.every(i=>t.turns[i]?.ja)).toBe(true);
        expect(new Set([cue.correctTurn,...cue.contrastTurns]).size).toBe(3);
      }
    }
  });

  it("adds fourteen authentic Japanese reply choices while keeping all original E06 and E12 prompt identities",()=>{
    const authoritativeIds=new Set(e06ReviewPrompts.map(p=>p.id));
    expect(authoritativeIds.size).toBe(e06ReviewPrompts.length);
    let decisions=0;
    for(const c of E06_LINKED_CASES){
      const t=E11_BY_CASE.get(c.id);
      if(!t)continue;
      const evidence=sourceEvents(c.id,"owner-"+c.id);
      const steps=buildE11OptionalSession(c.id,evidence);
      expect(steps.find(s=>s.id.endsWith("-e11-micro-listening"))).toBeDefined();
      expect(steps.find(s=>s.id.endsWith("-e11-micro-reading"))).toBeDefined();
      expect(steps.find(s=>s.id.endsWith("-e11-original-letter"))).toBeDefined();
      expect(steps.find(s=>s.id.endsWith("-e12-revised-letter"))).toBeDefined();
      for(const index of [1,2] as const){
        const cue=E11_RESPONSE_MISSIONS.find(x=>x.caseId===c.id)!.decisions[index-1];
        const task=replyPrompt(steps,index);
        decisions++;
        expect(task.promptType).toBe("choice");
        expect(task.acceptedAnswers).toEqual([t.turns[cue.correctTurn]!.ja]);
        if(task.promptType!=="choice")throw Error("E11_NOT_CHOICE");
        expect(task.choices).toHaveLength(3);
        expect(new Set(task.choices).size).toBe(3);
        expect(task.choices).toContain(task.acceptedAnswers[0]);
        expect(task.primaryTarget).toEqual({kind:"can_do",id:getE06Overview(evidence).cases.find(x=>x.id===c.id)!.canDoId});
        expect(authoritativeIds.has(task.id)).toBe(false);
        expect(task.eventMetadata).toMatchObject({
          e06:true,e11:true,e11RoleResponse:true,nonAuthoritative:true,
          schedulerExcluded:true,semanticScore:false,accreditedCefrVerdict:false,
          e11CaseId:c.id,
        });
        expect(task.speechSynthesisText).toBeUndefined();
      }
    }
    // All seven role-mission records are original and validated above, but
    // only cases with a verified canonical listening AND reading anchor may
    // instantiate a graded-choice interface. The remaining E11 material
    // stays source-only rather than inventing Can-do evidence.
    expect(decisions).toBe(2*E06_LINKED_CASES.filter(c=>E11_BY_CASE.has(c.id)).length);
  });

  it("requires real original source listening and reading; optional choices do not unlock E06 mastery",()=>{
    const c=E06_LINKED_CASES.find(x=>E11_BY_CASE.has(x.id))!;
    expect(()=>buildE11OptionalSession(c.id,[])).toThrow("E11_SOURCE_LESSON_FIRST");
    const owner="e13-fixture-owner";
    const evidence=sourceEvents(c.id,owner);
    const baseline=getE06Overview(evidence).cases.find(x=>x.id===c.id)!;
    expect(baseline.prerequisiteReady).toBe(true);
    const prompt=replyPrompt(buildE11OptionalSession(c.id,evidence),1);
    const attempt=createStudyEvent({
      id:"e13-reply-1",userId:owner,deviceId:"test-only",prompt,
      response:prompt.acceptedAnswers[0]!,occurredAt:when(3),responseTimeMs:440,
    });
    attempt.result="skipped"; // app-owned nonAuthoritative practice
    const next=getE06Overview([...evidence,attempt]).cases.find(x=>x.id===c.id)!;
    expect(next.e11ResponseAttempts).toBe(1);
    expect(next.correct).toBe(baseline.correct);
    expect(next.delayedCorrect).toBe(baseline.delayedCorrect);
    expect(next.status).toBe(baseline.status);
    const other=getE06Overview([...evidence,attempt].filter(e=>e.userId!=="stranger"));
    expect(other.cases.find(x=>x.id===c.id)?.e11ResponseAttempts).toBe(1);
    const empty=getE06Overview(evidence).cases.find(x=>x.id===c.id)!;
    expect(empty.e11ResponseAttempts).toBe(0);
  });
});
