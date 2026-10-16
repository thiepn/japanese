import "fake-indexeddb/auto";
import {describe,expect,it} from "vitest";
import {createStudyEvent} from "../../packages/study-player/src/index";
import {
  E06_LINKED_CASES,getE06Overview,type E06CaseProgress,
} from "../../apps/web/src/study/e06IndependentCourse";
import {e02ReviewPrompts} from "../../apps/web/src/study/a1ExcellenceCourse";
import {e03ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceCourse";
import {e04ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {buildE16OriginalConversation} from "../../apps/web/src/study/e16DialogueRehearsal";
import {E11_BY_CASE} from "../../apps/web/src/study/e11PracticalTransfer";
import {
  E17_NOTE_MAX_CHARACTERS,deleteE17ListeningNote,
  getE17OriginalListeningQuestion,listE17ListeningNotes,saveE17ListeningNote,
} from "../../apps/web/src/study/e17OriginalListeningNotebook";
import {
  databaseNameForAccount,listMemoryTraces,listPrivateDocuments,listStudyEvents,
  savePrivateDocument,
} from "../../packages/local-db/src/index";
import {exportLocalWorkspaceBackup,restoreLocalWorkspaceBackup} from "../../packages/local-db/src/backup";

const sourceSets={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
function sourceQualifiedCases(){
  const rows=getE06Overview([]).cases;
  const owner="e17-fixture-prerequisite-owner";
  const events:ReturnType<typeof createStudyEvent>[]=[];
  for(const item of E06_LINKED_CASES){
    const c=rows.find(x=>x.id===item.id);
    if(!c?.canDoId||!c.canonicalUnitId)continue;
    const original=sourceSets[c.anchorCohort].filter(p=>
      p.primaryTarget.kind==="can_do"&&p.primaryTarget.id===c.canDoId&&
      p.eventMetadata?.[c.anchorCohort+"SceneId"]===c.anchorSceneId&&
      p.eventMetadata?.[c.anchorCohort+"UnitId"]===c.canonicalUnitId);
    const listen=original.find(p=>p.skill==="listening"||p.skill==="audio_recognition");
    const reading=original.find(p=>["reading","comprehension","form_selection"].includes(p.skill));
    if(!listen?.acceptedAnswers[0]||!reading?.acceptedAnswers[0])continue;
    const pair=[listen,reading].map((prompt,i)=>createStudyEvent({
      id:"e17-prereq-"+item.id+"-"+i,userId:owner,deviceId:"fixture",prompt,
      response:prompt.acceptedAnswers[0]!,occurredAt:"2026-10-16T08:00:0"+i+"Z",
      responseTimeMs:350,
    }));
    if(getE06Overview(pair).cases.find(row=>row.id===item.id)?.prerequisiteReady)
      events.push(...pair);
  }
  return getE06Overview(events).cases;
}
const cases=sourceQualifiedCases();
const eligible=cases.filter(c=>c.prerequisiteReady&&E11_BY_CASE.has(c.id));
if(eligible.length<3)throw Error("E17_ORIGINAL_SOURCE_FIXTURE_MISSING");
const first=eligible[0]!;
const owner=()=> "e17-private-"+crypto.randomUUID();

async function clear(ownerId:string){
  await new Promise<void>((resolve,reject)=>{
    const request=indexedDB.deleteDatabase(databaseNameForAccount(ownerId));
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(Error("E17_DB_BLOCKED"));
  });
}

describe("E17 optional owner-private source-backed listening and recovery",()=>{
  it("never unlocks unlinked or unqualified E11 source material",async()=>{
    const locked=getE06Overview([]).cases;
    await expect(saveE17ListeningNote(owner(),first.id,0,"私の言葉",locked))
      .rejects.toThrow("E16_SOURCE_PREREQUISITES_REQUIRED");
    await expect(listE17ListeningNotes(owner(),first.id,locked))
      .rejects.toThrow("E16_SOURCE_PREREQUISITES_REQUIRED");
    await expect(saveE17ListeningNote(owner(),first.id,200,"私の言葉",cases))
      .rejects.toThrow("E17_INVALID_ORIGINAL_TURN");
    await expect(saveE17ListeningNote(owner(),first.id,-1,"私の言葉",cases))
      .rejects.toThrow("E17_INVALID_ORIGINAL_TURN");
    expect(()=>getE17OriginalListeningQuestion(first.id,locked))
      .toThrow("E16_SOURCE_PREREQUISITES_REQUIRED");
  });

  it("preserves exact original E11 listening answer and both source misconception explanations",()=>{
    for(const item of eligible){
      const source=E11_BY_CASE.get(item.id)!;
      const question=getE17OriginalListeningQuestion(item.id,cases);
      expect(question.question).toBe(source.listening.question);
      expect(question.answer).toBe(source.listening.answer);
      expect(question.misconceptionExplanations).toEqual(
        source.listening.wrong.map((wrong,index)=>wrong+" — "+source.listening.wrongWhy[index]));
    }
  });

  it("persists one explicit original speaker note into the EXISTING owner private document store and original backup",async()=>{
    const account=owner();
    const turn=buildE16OriginalConversation(first.id,cases).turns[0]!;
    const saved=await saveE17ListeningNote(account,first.id,0,
      "最初の声は受付の場所を確認していました。",cases);
    expect(saved).toMatchObject({
      caseId:first.id,turnIndex:0,speaker:turn.speaker,
      originalJapanese:turn.japanese,text:"最初の声は受付の場所を確認していました。",
    });
    const notes=await listE17ListeningNotes(account,first.id,cases);
    expect(notes).toEqual([saved]);
    const documents=await listPrivateDocuments(account);
    expect(documents).toHaveLength(1);
    expect(documents[0]).toMatchObject({
      accountId:account,sourceKind:"paste",text:saved.text,
    });
    expect(documents[0]!.id).toContain("e17-original-listening-note:");
    const download=JSON.parse(await exportLocalWorkspaceBackup(account)) as {
      schema:string;schemaVersion:number;accountId:string;
      stores:{private_documents:Array<Record<string,unknown>>;study_events:unknown[];memory_traces:unknown[];sync_outbox:unknown[]};
    };
    expect(download).toMatchObject({
      schema:"thiepn-japanese-workspace-backup",schemaVersion:1,accountId:account,
    });
    expect(download.stores.private_documents).toHaveLength(1);
    expect(download.stores.private_documents[0]?.text).toBe(saved.text);
    expect(download.stores.study_events).toEqual([]);
    expect(download.stores.memory_traces).toEqual([]);
    expect(download.stores.sync_outbox).toEqual([]);
    expect(await listStudyEvents(account)).toEqual([]);
    expect(await listMemoryTraces(account)).toEqual([]);
  });

  it("restores the same account's private original listening note using the existing all-or-nothing v1 backup",async()=>{
    const account=owner();
    await saveE17ListeningNote(account,first.id,2,"二人目の会話を聞きました。",cases);
    const raw=await exportLocalWorkspaceBackup(account);
    await clear(account);
    await restoreLocalWorkspaceBackup(account,raw);
    const notes=await listE17ListeningNotes(account,first.id,cases);
    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatchObject({
      turnIndex:2,text:"二人目の会話を聞きました。",
    });
    const wrongOwner=await listE17ListeningNotes(owner(),first.id,cases);
    expect(wrongOwner).toEqual([]);
  });

  it("updates only its original stable turn document and explicitly deletes only that turn",async()=>{
    const account=owner();
    const original=await saveE17ListeningNote(account,first.id,1,"最初の試み",cases);
    const next=await saveE17ListeningNote(account,first.id,2,"別の話者のメモ",cases);
    const revised=await saveE17ListeningNote(account,first.id,1,"もう一度聞きました。",cases);
    expect(revised.text).not.toBe(original.text);
    expect((await listPrivateDocuments(account))).toHaveLength(2);
    expect((await listE17ListeningNotes(account,first.id,cases)).map(n=>n.turnIndex)).toEqual([1,2]);
    await deleteE17ListeningNote(account,first.id,1,cases);
    expect((await listE17ListeningNotes(account,first.id,cases))).toEqual([next]);
    await deleteE17ListeningNote(account,first.id,1,cases);
    expect((await listPrivateDocuments(account))).toHaveLength(1);
  });

  it("never overwrites or deletes an unrelated user document that collides with the derived identifier",async()=>{
    const account=owner();
    const firstSaved=await saveE17ListeningNote(account,first.id,1,"保存",cases);
    const document=(await listPrivateDocuments(account))[0]!;
    await savePrivateDocument(account,{...document,
      sourceLabel:"some-other-user-document",text:"PRIVATE_UNRELATED_CONTENT"});
    expect(await listE17ListeningNotes(account,first.id,cases)).toEqual([]);
    await expect(saveE17ListeningNote(account,first.id,1,firstSaved.text,cases))
      .rejects.toThrow("E17_EXISTING_SOURCE_NOTE_INVALID");
    await expect(deleteE17ListeningNote(account,first.id,1,cases))
      .rejects.toThrow("E17_EXISTING_SOURCE_NOTE_INVALID");
    expect((await listPrivateDocuments(account))[0]?.text).toBe("PRIVATE_UNRELATED_CONTENT");
  });

  it("rejects oversized/blank attempts and does not write under a revoked A→B→A workspace lease",async()=>{
    const account=owner();
    await expect(saveE17ListeningNote(account,first.id,0," ",cases))
      .rejects.toThrow("E17_NOTE_CONTENT_INVALID");
    await expect(saveE17ListeningNote(account,first.id,0,"あ".repeat(E17_NOTE_MAX_CHARACTERS+1),cases))
      .rejects.toThrow("E17_NOTE_CONTENT_INVALID");
    await expect(saveE17ListeningNote(account,first.id,0,"保存",cases,()=>false))
      .rejects.toThrow("E17_WORKSPACE_CHANGED");
    await expect(listE17ListeningNotes(account,first.id,cases,()=>false))
      .rejects.toThrow("E17_WORKSPACE_CHANGED");
    expect(await listPrivateDocuments(account)).toEqual([]);
  });

  it("saves no notes across owner scope and does not invent stored learner answer correctness",async()=>{
    const alpha=owner(),beta=owner();
    await saveE17ListeningNote(alpha,first.id,0,"私だけのメモ",cases);
    const alphaNotes=await listE17ListeningNotes(alpha,first.id,cases);
    const betaNotes=await listE17ListeningNotes(beta,first.id,cases);
    expect(alphaNotes).toHaveLength(1);
    expect(betaNotes).toEqual([]);
    expect(JSON.stringify(betaNotes)).not.toContain("私だけのメモ");
    expect(await listMemoryTraces(alpha)).toEqual([]);
    expect(await listStudyEvents(alpha)).toEqual([]);
    const question=getE17OriginalListeningQuestion(first.id,cases);
    expect(question).not.toHaveProperty("graded");
    expect(question).not.toHaveProperty("mastery");
  });
});
