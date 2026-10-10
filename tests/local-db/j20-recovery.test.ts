import "fake-indexeddb/auto";
import {afterEach,describe,expect,it,vi} from "vitest";
import {
  databaseNameForAccount,listOutbox,listStudyEvents,saveStudyEvent,
  setSyncCursor,getSyncCursor,
} from "../../packages/local-db/src/index";
import {exportLocalWorkspaceBackup,restoreLocalWorkspaceBackup} from "../../packages/local-db/src/backup";

afterEach(()=>{vi.unstubAllGlobals();});

function answer(owner:string){
  return {id:"j20-answer",userId:owner,deviceId:"offline-android",
    occurredAt:"2026-10-09T22:00:00Z",activity:"review" as const,result:"correct" as const};
}
async function erase(owner:string):Promise<void>{
  await new Promise<void>((resolve,reject)=>{
    const request=indexedDB.deleteDatabase(databaseNameForAccount(owner));
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error("J20_DATABASE_DELETE_BLOCKED"));
  });
}
function digest(text:string):Promise<string>{
  return crypto.subtle.digest("SHA-256",new TextEncoder().encode(text))
    .then(bytes=>[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join(""));
}

describe("J20 offline backup and interrupted-PWA recovery boundaries",()=>{
  it("restores the immutable StudyEvent and queued mutation while offline without importing a server cursor",async()=>{
    const owner="j20-offline-recovery";
    await saveStudyEvent(answer(owner));
    await setSyncCursor(owner,"remote-cursor-must-not-migrate");
    const backup=await exportLocalWorkspaceBackup(owner);
    expect(backup).not.toContain("remote-cursor-must-not-migrate");
    await erase(owner);
    vi.stubGlobal("navigator",{onLine:false});
    await restoreLocalWorkspaceBackup(owner,backup);
    expect((await listStudyEvents(owner)).map(e=>e.id)).toEqual(["j20-answer"]);
    expect((await listOutbox(owner)).map(m=>m.mutation_id)).toEqual(["j20-answer"]);
    expect(await getSyncCursor(owner)).toBeNull();
  });

  it("rejects a correctly rehashed alien sync envelope without losing existing local answers",async()=>{
    const owner="j20-foreign-envelope";
    await saveStudyEvent(answer(owner));
    const parsed=JSON.parse(await exportLocalWorkspaceBackup(owner)) as {
      schema:string;schemaVersion:number;accountId:string;createdAt:string;
      stores:{sync_outbox:Array<{data:{app_id:string}}>};sha256:string;
    };
    parsed.stores.sync_outbox[0]!.data.app_id="another-app";
    const {sha256:_previous,...payload}=parsed;
    parsed.sha256=await digest(JSON.stringify(payload));
    await expect(restoreLocalWorkspaceBackup(owner,JSON.stringify(parsed)))
      .rejects.toThrow("JAPANESE_BACKUP_OUTBOX_INVALID");
    expect((await listStudyEvents(owner)).map(e=>e.id)).toEqual(["j20-answer"]);
    expect(await listOutbox(owner)).toHaveLength(1);
  });
});
