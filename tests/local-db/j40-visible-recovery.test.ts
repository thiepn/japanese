import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { databaseNameForAccount, listStudyEvents, saveStudyEvent } from "../../packages/local-db/src/index";
import { exportLocalWorkspaceBackup } from "../../packages/local-db/src/backup";
import { AccountWorkspaceLease } from "../../apps/web/src/study/accountWorkspaceLease";
import {
  localRecoveryErrorMessage,
  prepareLocalWorkspaceDownload,
  restoreLocalWorkspaceFile,
} from "../../apps/web/src/study/localRecovery";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const event=(accountId:string,id:string)=>({
  id,userId:accountId,deviceId:"offline-test",
  occurredAt:"2026-10-16T00:00:00Z",
  activity:"review" as const,result:"correct" as const,
});

async function clear(owner:string) {
  await new Promise<void>((resolve,reject)=>{
    const request=indexedDB.deleteDatabase(databaseNameForAccount(owner));
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error("BACKUP_DELETE_BLOCKED"));
  });
}
function leaseFor(owner:string) {
  const lease=new AccountWorkspaceLease();
  lease.observe({status:"authenticated",accountId:owner});
  const ticket=lease.snapshot();
  return {lease,ticket,valid:()=>lease.isCurrent(ticket)};
}

describe("J40 visible local recovery and owner fencing",()=>{
  it("restores original per-owner StudyEvents and outbox while offline into an empty workspace",async()=>{
    const owner="j40-local-recover-a-"+crypto.randomUUID();
    await saveStudyEvent(event(owner,"review-original"));
    const {valid}=leaseFor(owner);
    const exported=await prepareLocalWorkspaceDownload(owner,valid);
    expect(JSON.parse(exported)).toMatchObject({
      schema:"thiepn-japanese-workspace-backup",accountId:owner,schemaVersion:1,
    });
    await clear(owner);
    vi.stubGlobal("navigator",{onLine:false});
    await restoreLocalWorkspaceFile(owner,{size:exported.length,text:async()=>exported},valid);
    expect((await listStudyEvents(owner)).map(x=>x.id)).toEqual(["review-original"]);
  });

  it("rejects restore into a workspace with existing progress, leaving original evidence intact",async()=>{
    const owner="j40-nonempty-"+crypto.randomUUID();
    await saveStudyEvent(event(owner,"existing-review"));
    const raw=await exportLocalWorkspaceBackup(owner);
    const {valid}=leaseFor(owner);
    await expect(restoreLocalWorkspaceFile(owner,{size:raw.length,text:async()=>raw},valid))
      .rejects.toThrow("JAPANESE_BACKUP_DESTINATION_NOT_EMPTY");
    expect((await listStudyEvents(owner)).map(x=>x.id)).toEqual(["existing-review"]);
  });

  it("cannot import account A backup into account B even if B is empty",async()=>{
    const a="j40-A-"+crypto.randomUUID(),b="j40-B-"+crypto.randomUUID();
    await saveStudyEvent(event(a,"private-A-review"));
    const raw=await exportLocalWorkspaceBackup(a);
    const {valid}=leaseFor(b);
    await expect(restoreLocalWorkspaceFile(b,{size:raw.length,text:async()=>raw},valid))
      .rejects.toThrow("JAPANESE_BACKUP_HEADER_INVALID");
    expect(await listStudyEvents(b)).toEqual([]);
  });

  it("blocks abandoned downloads if A->B->A switches during IndexedDB export",async()=>{
    const a="j40-export-switch-"+crypto.randomUUID();
    await saveStudyEvent(event(a,"queued-review"));
    const {lease,valid}=leaseFor(a);
    const queued=prepareLocalWorkspaceDownload(a,valid);
    lease.observe({status:"authenticated",accountId:"B"});
    lease.observe({status:"authenticated",accountId:a});
    await expect(queued).rejects.toThrow("JAPANESE_BACKUP_WORKSPACE_CHANGED");
  });

  it("rejects an owner change while file.text awaits private JSON read",async()=>{
    const a="j40-file-read-"+crypto.randomUUID();
    const raw=await exportLocalWorkspaceBackup(a);
    const {lease,valid}=leaseFor(a);
    let read!:(raw:string)=>void;
    const file={size:raw.length,text:()=>new Promise<string>(resolve=>{read=resolve;})};
    const queued=restoreLocalWorkspaceFile(a,file,valid);
    lease.observe({status:"authenticated",accountId:"B"});
    read(raw);
    await expect(queued).rejects.toThrow("JAPANESE_BACKUP_WORKSPACE_CHANGED");
    expect(await listStudyEvents(a)).toEqual([]);
  });

  it("aborts an in-flight backup transaction if the workspace lease is revoked before data commits",async()=>{
    const a="j40-restore-race-"+crypto.randomUUID();
    await saveStudyEvent(event(a,"must-not-cross"));
    const raw=await exportLocalWorkspaceBackup(a);
    await clear(a);
    const {lease,valid}=leaseFor(a);
    const original=IDBObjectStore.prototype.add;
    let revoked=false;
    vi.spyOn(IDBObjectStore.prototype,"add").mockImplementation(function(this:IDBObjectStore,row:unknown,key?:IDBValidKey){
      if(!revoked && this.transaction.db.name===databaseNameForAccount(a)){
        revoked=true;
        lease.observe({status:"authenticated",accountId:"B"});
      }
      return key===undefined?original.call(this,row):original.call(this,row,key);
    });
    await expect(restoreLocalWorkspaceFile(a,{size:raw.length,text:async()=>raw},valid))
      .rejects.toThrow("JAPANESE_BACKUP_WORKSPACE_CHANGED");
    expect(revoked).toBe(true);
    expect(await listStudyEvents(a)).toEqual([]);
  });

  it("never accepts oversized or unverified file input",async()=>{
    const owner="j40-size-"+crypto.randomUUID();
    const {valid}=leaseFor(owner);
    const read=vi.fn(async()=>"{untrusted}");
    await expect(restoreLocalWorkspaceFile(owner,{size:128*1024*1024+1,text:read},valid))
      .rejects.toThrow("JAPANESE_BACKUP_SIZE_INVALID");
    expect(read).not.toHaveBeenCalled();
    await expect(restoreLocalWorkspaceFile(owner,{size:10,text:read},valid))
      .rejects.toThrow("JAPANESE_BACKUP_JSON_INVALID");
  });

  it("distinguishes benign empty-destination and changed-owner failures without dumping private data",()=>{
    expect(localRecoveryErrorMessage(Error("JAPANESE_BACKUP_DESTINATION_NOT_EMPTY"))).toContain("already contains data");
    expect(localRecoveryErrorMessage(Error("JAPANESE_BACKUP_WORKSPACE_CHANGED"))).toContain("workspace changed");
    expect(localRecoveryErrorMessage(Error("JAPANESE_BACKUP_OWNER_MISMATCH"))).toContain("different Japanese workspace");
    expect(localRecoveryErrorMessage(Error("sensitive user content"))).not.toContain("sensitive user content");
  });

  it("treats identical authenticated IDs as different workspaces across A→B→A lease transitions",()=>{
    const lease=new AccountWorkspaceLease();
    lease.observe({status:"authenticated",accountId:"A"});
    const old=lease.snapshot();
    lease.observe({status:"authenticated",accountId:"B"});
    lease.observe({status:"authenticated",accountId:"A"});
    expect(lease.isCurrent(old)).toBe(false);
    expect(lease.isCurrent(lease.snapshot())).toBe(true);
  });
});
