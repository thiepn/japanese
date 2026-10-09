import "fake-indexeddb/auto";
import {afterEach,describe,expect,it,vi} from "vitest";
import * as localDb from "../../packages/local-db/src/index";
import {createThiepnAccountAuthProvider,JAPANESE_CONNECT_INTENT_KEY,JAPANESE_LOGIN_STORAGE_KEY,readPendingJapaneseLogin} from "../../packages/auth/src/index";
import {foundationPrompts} from "../../apps/web/src/study/foundationPrompts";
import {GUEST_ACCOUNT_ID,recordStudyAnswer,setDevelopmentAccountId} from "../../apps/web/src/study/runtime";
import {createFsrsScheduler} from "../../packages/scheduler/src/index";

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();setDevelopmentAccountId(GUEST_ACCOUNT_ID);});

describe("J16F auth and durable workspace races",()=>{
  it("clears login intent when OAuth initialization throws",async()=>{
    const values=new Map<string,string>();
    vi.stubGlobal("localStorage",{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)});
    vi.stubGlobal("window",{location:{assign:vi.fn()}});
    const client={auth:{signInWithOAuth:vi.fn().mockRejectedValue(new Error("unavailable")),onAuthStateChange:vi.fn()}};
    const auth=createThiepnAccountAuthProvider({client:client as never});
    await expect(auth.signIn()).rejects.toThrow("unavailable");
    expect(values.has(JAPANESE_LOGIN_STORAGE_KEY)).toBe(false);
    expect(values.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
  });

  it.each(["/japanese/auth/callback","/japanese/auth/callback/","/japanese/?code=old-code","/japanese/#access_token=old-token"])("rejects return targets that could replay login state: %s",(returnTo)=>{
    expect(readPendingJapaneseLogin(JSON.stringify({started:Date.now(),returnTo}))).toBeNull();
  });

  it("joins overlapping account refreshes and ignores a verification completed after sign-out",async()=>{
    let finish!:(value:unknown)=>void;
    const getUser=vi.fn(()=>new Promise(resolve=>{finish=resolve;}));
    const client={auth:{getUser,signOut:vi.fn().mockResolvedValue({error:null}),onAuthStateChange:vi.fn()}};
    const auth=createThiepnAccountAuthProvider({client:client as never});
    const listener=vi.fn();auth.subscribe(listener);
    const one=auth.refresh(),two=auth.refresh();
    expect(getUser).toHaveBeenCalledTimes(1);
    await auth.signOut();
    finish({data:{user:{id:"old-account"}},error:null});
    expect(await one).toMatchObject({status:"anonymous",accountId:null});
    expect(await two).toMatchObject({status:"anonymous",accountId:null});
    expect(listener.mock.calls.some(([context])=>context.accountId==="old-account")).toBe(false);
  });

  it("saves an answer in its starting workspace if account changes before the DB read finishes",async()=>{
    const account="review-start-account",other="review-next-account";
    const prompt=foundationPrompts[0]!;
    setDevelopmentAccountId(account);
    const answer=recordStudyAnswer({prompt,response:"a",result:"correct",responseTimeMs:900});
    setDevelopmentAccountId(other);
    await answer;
    expect(await localDb.listStudyEvents(account)).toHaveLength(1);
    expect(await localDb.listMemoryTraces(account)).toHaveLength(1);
    expect(await localDb.listStudyEvents(other)).toHaveLength(0);
    expect(await localDb.listMemoryTraces(other)).toHaveLength(0);
  });

  it("keeps both scheduler revisions for overlapping answers on one skill",async()=>{
    const account="parallel-reviews-account";
    setDevelopmentAccountId(account);
    const input={prompt:foundationPrompts[0]!,response:"a",result:"correct" as const,responseTimeMs:900};
    await Promise.all([recordStudyAnswer(input),recordStudyAnswer(input)]);
    expect((await localDb.listMemoryTraces(account))[0]?.revision).toBe(2);
    expect((await localDb.listStudyEvents(account)).map(event=>event.baseRevision).sort()).toEqual([0,1]);
  });

  it("rolls back evidence and outbox if scheduler state cannot be saved",async()=>{
    const account="atomic-failed-review";
    const event={id:"atomic-failure",userId:account,deviceId:"browser",occurredAt:new Date().toISOString(),activity:"review" as const,result:"correct" as const};
    const trace=createFsrsScheduler().create({id:"bad-trace",userId:account,entity:{kind:"kana",id:"kana-a"},skillDimension:"recognition",cueFamily:"kana-to-sound"},event.occurredAt);
    Object.assign(trace,{uncloneable:()=>{}});
    await expect(localDb.saveStudyReview(event,trace)).rejects.toThrow();
    expect(await localDb.listStudyEvents(account)).toHaveLength(0);
    expect(await localDb.listOutbox(account)).toHaveLength(0);
    expect(await localDb.listMemoryTraces(account)).toHaveLength(0);
  });

  it("attaches guest evidence to only one account during simultaneous claims",async()=>{
    const guest="simultaneous-guest";
    await localDb.saveStudyEvent({id:"guest-single-owner",userId:guest,deviceId:"browser",occurredAt:new Date().toISOString(),activity:"review",result:"correct"});
    const result=await Promise.all([localDb.claimGuestWorkspace(guest,"claim-first"),localDb.claimGuestWorkspace(guest,"claim-second")]);
    expect(result).toEqual(["migrated","guest-empty"]);
    expect(await localDb.listStudyEvents("claim-first")).toHaveLength(1);
    expect(await localDb.listStudyEvents("claim-second")).toHaveLength(0);
  });

  it("keeps a late guest save that arrived after the migration snapshot",async()=>{
    const guest="late-write-guest",target="late-write-target";
    const event={id:"snapshot-event",userId:guest,deviceId:"browser",occurredAt:new Date().toISOString(),activity:"review" as const,result:"correct" as const};
    await localDb.saveStudyEvent(event);
    const put=IDBObjectStore.prototype.put;
    let lateSave:Promise<unknown>|undefined;
    vi.spyOn(IDBObjectStore.prototype,"put").mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){
      if(this.transaction.db.name===localDb.databaseNameForAccount(target)&&this.name==="study_events"&&!lateSave){
        lateSave=localDb.saveStudyEvent({...event,id:"late-guest-event"});
      }
      return key===undefined?put.call(this,value):put.call(this,value,key);
    });
    expect(await localDb.claimGuestWorkspace(guest,target)).toBe("migrated");
    await lateSave;
    expect((await localDb.listStudyEvents(guest)).map(row=>row.id)).toEqual(["late-guest-event"]);
    expect((await localDb.listStudyEvents(target)).map(row=>row.id)).toEqual(["snapshot-event"]);
  });

  it("preserves account data written between the empty check and attachment",async()=>{
    const guest="late-target-guest",target="late-target-account";
    const event={id:"colliding-event",userId:guest,deviceId:"browser",occurredAt:new Date().toISOString(),activity:"review" as const,result:"incorrect" as const};
    await localDb.saveStudyEvent(event);
    const getAll=IDBObjectStore.prototype.getAll;
    let lateSave:Promise<unknown>|undefined;
    vi.spyOn(IDBObjectStore.prototype,"getAll").mockImplementation(function(this:IDBObjectStore,...args:Parameters<typeof getAll>){
      if(this.transaction.db.name===localDb.databaseNameForAccount(guest)&&!lateSave){
        lateSave=localDb.saveStudyEvent({...event,userId:target,result:"correct"});
      }
      return getAll.apply(this,args);
    });
    expect(await localDb.claimGuestWorkspace(guest,target)).toBe("target-populated");
    await lateSave;
    expect((await localDb.listStudyEvents(target))[0]?.result).toBe("correct");
    expect((await localDb.listStudyEvents(guest))[0]?.result).toBe("incorrect");
  });
});
