import "fake-indexeddb/auto";
import {afterEach,describe,expect,it,vi} from "vitest";
import * as db from "../../packages/local-db/src/index";
import {AccountWorkspaceLease,attachWorkspaceWithLease} from "../../apps/web/src/study/accountWorkspaceLease";

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

function deferred<T>(){
  let resolve!:(value:T)=>void;
  let reject!:(error:unknown)=>void;
  const promise=new Promise<T>((ok,fail)=>{resolve=ok;reject=fail;});
  return {promise,resolve,reject};
}
function setup(){
  const guard=new AccountWorkspaceLease();
  let canonical={status:"authenticated",accountId:"p22-A"};
  const current=guard.observe(canonical);
  const calls:string[]=[];
  const claim=(allowed:()=>boolean)=>{
    calls.push(canonical.accountId??"none");
    return db.claimGuestWorkspace("p22-guest-"+crypto.randomUUID(),"p22-A",allowed);
  };
  return {
    guard,current,calls,claim,
    readAuth:async()=>canonical,
    observe:(status:string,accountId:string|null)=>{
      canonical={status,accountId};return guard.observe(canonical);
    },
    changeCanonical:(status:string,accountId:string|null)=>{canonical={status,accountId};},
  };
}
const event=(owner:string,id:string)=>({
  id,userId:owner,deviceId:"p22-test",activity:"review" as const,
  result:"correct" as const,occurredAt:"2026-10-11T18:00:00.000Z",
});

describe("P22 account-connect and workspace claim recovery",()=>{
  it("reproduces stale manual connect RPC: signed-out user cannot claim guest workspace",async()=>{
    const s=setup();const rpc=deferred<boolean>();
    const started=deferred<void>();
    const pending=attachWorkspaceWithLease(s.guard,s.current,{
      connect:()=>{started.resolve();return rpc.promise;},readAuth:s.readAuth,claim:s.claim,
    });
    await started.promise;
    s.observe("anonymous",null);
    rpc.resolve(true);
    expect(await pending).toBeNull();
    expect(s.calls).toHaveLength(0);
  });

  it("rejects an old auto-connect A after A -> B -> A even though owner ID matches",async()=>{
    const s=setup();const rpc=deferred<boolean>();const begun=deferred<void>();
    const pending=attachWorkspaceWithLease(s.guard,s.current,{
      connect:()=>{begun.resolve();return rpc.promise;},readAuth:s.readAuth,claim:s.claim,
    });
    await begun.promise;s.observe("authenticated","p22-B");s.observe("authenticated","p22-A");
    rpc.resolve(true);
    expect(await pending).toBeNull();
    expect(s.calls).toHaveLength(0);
  });

  it("checks canonical auth even without a subscription notification",async()=>{
    const s=setup();s.changeCanonical("authenticated","p22-B");
    const result=await attachWorkspaceWithLease(s.guard,s.current,{
      connect:async()=>true,readAuth:s.readAuth,claim:s.claim,
    });
    expect(result).toBeNull();
    expect(s.calls).toHaveLength(0);
  });

  it("does not start a claim after auth replacement during canonical verification",async()=>{
    const s=setup();const auth=deferred<{status:string;accountId:string|null}>();
    const readStarted=deferred<void>();
    const pending=attachWorkspaceWithLease(s.guard,s.current,{
      connect:async()=>true,
      readAuth:()=>{readStarted.resolve();return auth.promise;},
      claim:s.claim,
    });
    await readStarted.promise;
    s.observe("authenticated","p22-B");
    auth.resolve({status:"authenticated",accountId:"p22-A"});
    expect(await pending).toBeNull();
    expect(s.calls).toHaveLength(0);
  });

  it("checks queued claim lease before accessing the destination",async()=>{
    const guest="p22-queued-"+crypto.randomUUID(),target="p22-queued-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"pending-review"));
    const s=setup();let valid=true;
    const original=IDBFactory.prototype.open;
    const seen:string[]=[];
    const open=vi.spyOn(IDBFactory.prototype,"open").mockImplementation(function(this:IDBFactory,name:string,version?:number){
      seen.push(name);
      if(name===db.databaseNameForAccount(target))valid=false;
      return version===undefined?original.call(this,name):original.call(this,name,version);
    });
    await expect(db.claimGuestWorkspace(guest,target,()=>valid)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    open.mockRestore();
    expect((await db.listStudyEvents(guest)).map(x=>x.id)).toEqual(["pending-review"]);
    expect(await db.listStudyEvents(target)).toHaveLength(0);
  });

  it("revokes during the guest snapshot without migrating or deleting its events",async()=>{
    const guest="p22-read-"+crypto.randomUUID(),target="p22-read-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"snapshot-event"));
    let valid=true;const original=IDBObjectStore.prototype.getAll;
    vi.spyOn(IDBObjectStore.prototype,"getAll").mockImplementation(function(this:IDBObjectStore,...args:Parameters<typeof original>){
      if(this.transaction.db.name===db.databaseNameForAccount(guest)) valid=false;
      return original.apply(this,args);
    });
    await expect(db.claimGuestWorkspace(guest,target,()=>valid)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    expect((await db.listStudyEvents(guest)).map(x=>x.id)).toEqual(["snapshot-event"]);
    expect(await db.listStudyEvents(target)).toHaveLength(0);
  });

  it("aborts an in-progress destination transaction if the lease is revoked on a put",async()=>{
    const guest="p22-write-"+crypto.randomUUID(),target="p22-write-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"e1"));
    await db.saveStudyEvent(event(guest,"e2"));
    let valid=true;let intercepted=false;
    const put=IDBObjectStore.prototype.put;
    vi.spyOn(IDBObjectStore.prototype,"put").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      if(this.transaction.db.name===db.databaseNameForAccount(target)&&!intercepted){
        intercepted=true;valid=false;
      }
      return key===undefined?put.call(this,value):put.call(this,value,key);
    });
    await expect(db.claimGuestWorkspace(guest,target,()=>valid)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    expect(intercepted).toBe(true);
    expect(await db.listStudyEvents(target)).toHaveLength(0);
    expect(await db.listStudyEvents(guest)).toHaveLength(2);
  });

  it("aborts if the final outbox write revokes the claim lease",async()=>{
    const guest="p22-final-"+crypto.randomUUID(),target="p22-final-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"only-event"));
    let valid=true;let intercepted=false;
    const put=IDBObjectStore.prototype.put;
    vi.spyOn(IDBObjectStore.prototype,"put").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      if(this.transaction.db.name===db.databaseNameForAccount(target)&&this.name==="sync_outbox"){
        valid=false;intercepted=true;
      }
      return key===undefined?put.call(this,value):put.call(this,value,key);
    });
    await expect(db.claimGuestWorkspace(guest,target,()=>valid)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    expect(intercepted).toBe(true);
    expect(await db.listStudyEvents(guest)).toHaveLength(1);
    expect(await db.listOutbox(guest)).toHaveLength(1);
    expect(await db.listStudyEvents(target)).toHaveLength(0);
    expect(await db.listOutbox(target)).toHaveLength(0);
  });

  it("retains original guest records if auth is revoked after destination commit",async()=>{
    const guest="p22-clean-"+crypto.randomUUID(),target="p22-clean-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"e1"));
    let valid=true;let copied=false;let targetOpens=0;
    const original=IDBFactory.prototype.open;
    vi.spyOn(IDBFactory.prototype,"open").mockImplementation(function(this:IDBFactory,name:string,version?:number){
      if(name===db.databaseNameForAccount(guest)&&copied)valid=false;
      if(name===db.databaseNameForAccount(target)&&++targetOpens===2)copied=true;
      return version===undefined?original.call(this,name):original.call(this,name,version);
    });
    await expect(db.claimGuestWorkspace(guest,target,()=>valid)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    vi.restoreAllMocks();
    expect((await db.listStudyEvents(guest)).map(x=>x.id)).toEqual(["e1"]);
    expect((await db.listStudyEvents(target)).map(x=>x.id)).toEqual(["e1"]);
  });

  it("aborts source cleanup when auth changes on the final guest deletion",async()=>{
    const guest="p22-delete-"+crypto.randomUUID(),target="p22-delete-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"delete-event"));
    let valid=true;let deleted=false;
    const original=IDBObjectStore.prototype.delete;
    vi.spyOn(IDBObjectStore.prototype,"delete").mockImplementation(function(this:IDBObjectStore,key:IDBValidKey){
      if(this.transaction.db.name===db.databaseNameForAccount(guest)&&this.name==="sync_outbox"){
        deleted=true;valid=false;
      }
      return original.call(this,key);
    });
    await expect(db.claimGuestWorkspace(guest,target,()=>valid)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    expect(deleted).toBe(true);
    expect((await db.listStudyEvents(guest)).map(x=>x.id)).toEqual(["delete-event"]);
    expect(await db.listOutbox(guest)).toHaveLength(1);
    expect((await db.listStudyEvents(target)).map(x=>x.id)).toEqual(["delete-event"]);
  });

  it("retries a canceled pre-copy claim without data loss and preserves existing target data",async()=>{
    const guest="p22-retry-"+crypto.randomUUID(),target="p22-retry-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"retry-event"));
    await expect(db.claimGuestWorkspace(guest,target,()=>false)).rejects.toThrow("WORKSPACE_CLAIM_CANCELLED");
    expect(await db.claimGuestWorkspace(guest,target,()=>true)).toBe("migrated");
    expect(await db.claimGuestWorkspace(guest,target,()=>true)).toBe("target-populated");
    expect(await db.listStudyEvents(guest)).toHaveLength(0);
    expect((await db.listStudyEvents(target)).map(x=>x.id)).toEqual(["retry-event"]);
  });

  it("isolates concurrent claims and does not overwrite another target's account data",async()=>{
    const guest="p22-parallel-"+crypto.randomUUID(),a="p22-A-"+crypto.randomUUID(),b="p22-B-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"guest-event"));
    await db.saveStudyEvent(event(b,"existing-B"));
    const outcomes=await Promise.all([db.claimGuestWorkspace(guest,a),db.claimGuestWorkspace(guest,b)]);
    expect(outcomes).toEqual(["migrated","target-populated"]);
    expect((await db.listStudyEvents(a)).map(x=>x.id)).toEqual(["guest-event"]);
    expect((await db.listStudyEvents(b)).map(x=>x.id)).toEqual(["existing-B"]);
  });

  it("retries after an unavailable IndexedDB destination without changing guest evidence",async()=>{
    const guest="p22-unavailable-"+crypto.randomUUID(),target="p22-unavailable-target-"+crypto.randomUUID();
    await db.saveStudyEvent(event(guest,"safe-event"));
    const open=IDBFactory.prototype.open;
    let deny=true;
    vi.spyOn(IDBFactory.prototype,"open").mockImplementation(function(this:IDBFactory,name:string,version?:number){
      if(deny&&name===db.databaseNameForAccount(target))throw Error("IDB unavailable");
      return version===undefined?open.call(this,name):open.call(this,name,version);
    });
    await expect(db.claimGuestWorkspace(guest,target)).rejects.toThrow("IDB unavailable");
    expect((await db.listStudyEvents(guest)).map(x=>x.id)).toEqual(["safe-event"]);
    deny=false;
    expect(await db.claimGuestWorkspace(guest,target)).toBe("migrated");
    expect((await db.listStudyEvents(target)).map(x=>x.id)).toEqual(["safe-event"]);
  });
});
