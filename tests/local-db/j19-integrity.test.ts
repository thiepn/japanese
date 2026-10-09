import "fake-indexeddb/auto";
import {afterEach,describe,expect,it,vi} from "vitest";
import {createFsrsScheduler} from "../../packages/scheduler/src/index";
import {
  databaseNameForAccount,openLocalDb,listStudyEvents,listMemoryTraces,listOutbox,
  listPrivateDocuments,listPrivateProsodyCaptures,saveStudyEvent,saveStudyReview,
  savePrivateDocument,savePrivateProsodyCapture,setSyncCursor,getSyncCursor,
} from "../../packages/local-db/src/index";
import {exportLocalWorkspaceBackup,restoreLocalWorkspaceBackup} from "../../packages/local-db/src/backup";

afterEach(()=>{vi.restoreAllMocks();});

function event(id:string,owner:string,result:"correct"|"incorrect"="correct"){
  return {id,userId:owner,deviceId:"browser",occurredAt:"2026-10-09T00:00:00Z",
    activity:"review" as const,result};
}

describe("J19 — immutable evidence and non-destructive local recovery",()=>{
  it("rejects duplicate IDs instead of overwriting immutable evidence or outbox",async()=>{
    const owner="j19-duplicate-event";
    await saveStudyEvent(event("duplicate",owner));
    await expect(saveStudyEvent(event("duplicate",owner,"incorrect"))).rejects.toThrow();
    expect((await listStudyEvents(owner))).toMatchObject([{id:"duplicate",result:"correct"}]);
    expect(await listOutbox(owner)).toHaveLength(1);
  });

  it("one of two concurrent writes with identical event identity fails closed",async()=>{
    const owner="j19-concurrent";
    const results=await Promise.allSettled([
      saveStudyEvent(event("same-id",owner)),
      saveStudyEvent(event("same-id",owner,"incorrect")),
    ]);
    expect(results.filter(result=>result.status==="fulfilled")).toHaveLength(1);
    expect(results.filter(result=>result.status==="rejected")).toHaveLength(1);
    expect(await listStudyEvents(owner)).toHaveLength(1);
    expect(await listOutbox(owner)).toHaveLength(1);
  });

  it("rolls back scheduler/outbox/event together on duplicate evidence",async()=>{
    const owner="j19-duplicate-review",scheduler=createFsrsScheduler();
    const trace=scheduler.create({id:"trace-a",userId:owner,entity:{kind:"kana",id:"kana-a"},
      skillDimension:"recognition",cueFamily:"kana-to-sound"},"2026-10-09T00:00:00Z");
    await saveStudyReview(event("one",owner),trace);
    const revised={...trace,revision:99};
    await expect(saveStudyReview(event("one",owner,"incorrect"),revised)).rejects.toThrow();
    expect((await listMemoryTraces(owner))[0]?.revision).toBe(trace.revision);
    expect((await listStudyEvents(owner))[0]?.result).toBe("correct");
    expect(await listOutbox(owner)).toHaveLength(1);
  });

  it("round trips same-owner evidence, FSRS, outbox, private documents and audio",async()=>{
    const owner="j19-roundtrip-source",scheduler=createFsrsScheduler();
    const trace=scheduler.create({id:"trace-r",userId:owner,entity:{kind:"kana",id:"kana-i"},
      skillDimension:"recognition",cueFamily:"kana-to-sound"},"2026-10-09T00:00:00Z");
    await saveStudyReview(event("roundtrip",owner),trace);
    await savePrivateDocument(owner,{id:"doc",accountId:owner,title:"Private",sourceKind:"paste",
      text:"日本語",importedAt:"2026-10-09T00:00:00Z",updatedAt:"2026-10-09T00:00:00Z"});
    const blob=new Blob(["private audio \u0000\u0001"],{type:"audio/webm"});
    await savePrivateProsodyCapture(owner,{id:"audio",accountId:owner,
      createdAt:"2026-10-09T00:00:00Z",updatedAt:"2026-10-09T00:00:00Z",
      mimeType:"audio/webm",audioBlob:blob,sizeBytes:blob.size,durationMs:900,
      activeSpeechRatio:.8,pauseRatio:.1,longPauseCount:0,phraseCount:1,dynamicRangeDb:5});
    const backup=await exportLocalWorkspaceBackup(owner);
    expect(backup).not.toContain("sync_meta");
    expect(backup).not.toContain("v1:42");
    expect(backup).not.toContain("private audio");
    // Recovery simulates a new, empty local IndexedDB for the SAME owner.
    const old=await openLocalDb(owner);old.close();
    await new Promise<void>((resolve,reject)=>{
      const req=indexedDB.deleteDatabase(databaseNameForAccount(owner));
      req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error);
    });
    await restoreLocalWorkspaceBackup(owner,backup);
    expect((await listStudyEvents(owner)).map(x=>x.id)).toEqual(["roundtrip"]);
    expect((await listMemoryTraces(owner))[0]?.id).toBe("trace-r");
    expect((await listOutbox(owner))).toHaveLength(1);
    expect((await listPrivateDocuments(owner))[0]?.text).toBe("日本語");
    const captures=await listPrivateProsodyCaptures(owner);
    expect(captures).toHaveLength(1);
    expect(await captures[0]!.audioBlob.text()).toBe(await blob.text());
    expect(await getSyncCursor(owner)).toBeNull();
  });

  it("refuses overwriting populated destinations or importing another account",async()=>{
    const owner="j19-preserve-account",other="j19-other-account";
    await saveStudyEvent(event("existing",owner));
    const backup=await exportLocalWorkspaceBackup(owner);
    await expect(restoreLocalWorkspaceBackup(owner,backup)).rejects.toThrow("JAPANESE_BACKUP_DESTINATION_NOT_EMPTY");
    expect((await listStudyEvents(owner))[0]?.id).toBe("existing");
    await expect(restoreLocalWorkspaceBackup(other,backup)).rejects.toThrow("JAPANESE_BACKUP_HEADER_INVALID");
    expect(await listStudyEvents(other)).toHaveLength(0);
  });

  it("rejects a damaged backup before touching existing local records",async()=>{
    const owner="j19-digest";
    await saveStudyEvent(event("sealed",owner));
    const exported=await exportLocalWorkspaceBackup(owner);
    const altered=exported.replace('"correct"','"incorrect"');
    expect(altered).not.toBe(exported);
    await expect(restoreLocalWorkspaceBackup(owner,altered)).rejects.toThrow("JAPANESE_BACKUP_DIGEST_MISMATCH");
    expect((await listStudyEvents(owner))[0]?.result).toBe("correct");
  });

  it("fails closed when even an otherwise empty workspace has a remote cursor",async()=>{
    const owner="j19-cursor",source="j19-cursor-source";
    await saveStudyEvent(event("for-backup",source));
    const backup=await exportLocalWorkspaceBackup(source);
    // Account binding is immutable; adapt the payload only by generating a real
    // empty-workspace backup of this account, not by changing its owner metadata.
    await setSyncCursor(owner,"remote-cursor");
    const empty=await exportLocalWorkspaceBackup(owner);
    await expect(restoreLocalWorkspaceBackup(owner,empty)).rejects.toThrow("JAPANESE_BACKUP_DESTINATION_NOT_EMPTY");
    expect(await getSyncCursor(owner)).toBe("remote-cursor");
    expect(backup).toContain("j19-cursor-source");
  });

  it("preserves a v1 legacy study event during the current v8 schema upgrade",async()=>{
    const owner="j19-migration";
    await new Promise<void>((resolve,reject)=>{
      const req=indexedDB.open(databaseNameForAccount(owner),1);
      req.onupgradeneeded=()=>{
        req.result.createObjectStore("study_events",{keyPath:"id"}).put(event("legacy",owner));
      };
      req.onsuccess=()=>{req.result.close();resolve();};
      req.onerror=()=>reject(req.error);
    });
    const opened=await openLocalDb(owner);
    expect(opened.version).toBeGreaterThanOrEqual(8);
    opened.close();
    expect((await listStudyEvents(owner))[0]?.id).toBe("legacy");
  });

  it("restores atomically if IndexedDB rejects a row mid-transaction",async()=>{
    const owner="j19-interrupted-restore",scheduler=createFsrsScheduler();
    const trace=scheduler.create({id:"trace",userId:owner,entity:{kind:"kana",id:"kana-a"},
      skillDimension:"recognition",cueFamily:"kana-to-sound"},"2026-10-09T00:00:00Z");
    await saveStudyReview(event("review",owner),trace);
    const backup=await exportLocalWorkspaceBackup(owner);
    await new Promise<void>((resolve,reject)=>{
      const req=indexedDB.deleteDatabase(databaseNameForAccount(owner));
      req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error);
    });
    const add=IDBObjectStore.prototype.add;
    vi.spyOn(IDBObjectStore.prototype,"add").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      if(this.name==="memory_traces")throw new Error("simulated interrupted restore");
      return key===undefined?add.call(this,value):add.call(this,value,key);
    });
    await expect(restoreLocalWorkspaceBackup(owner,backup)).rejects.toThrow("simulated interrupted restore");
    expect(await listStudyEvents(owner)).toHaveLength(0);
    expect(await listOutbox(owner)).toHaveLength(0);
    expect(await listMemoryTraces(owner)).toHaveLength(0);
  });
});
