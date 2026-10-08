import {afterEach,describe,expect,it,vi} from "vitest";
import {createThiepnAccountAuthProvider,getJapaneseHandoffSnapshot,getRecentJapaneseAuthStage,getRecentJapaneseAuthFailure,JAPANESE_AUTH_FAILURE_KEY,JAPANESE_LOGIN_STORAGE_KEY,JAPANESE_CONNECT_INTENT_KEY} from "../../packages/auth/src/index";

afterEach(()=>vi.unstubAllGlobals());

function setupCallback(withMarker:boolean){
  const local=new Map<string,string>(),session=new Map<string,string>();
  function storage(entries:Map<string,string>){
    return {
      getItem:vi.fn((key:string)=>entries.get(key)??null),
      setItem:vi.fn((key:string,value:string)=>{entries.set(key,value);}),
      removeItem:vi.fn((key:string)=>{entries.delete(key);}),
    };
  }
  if(withMarker){
    local.set(JAPANESE_LOGIN_STORAGE_KEY,JSON.stringify({
      started:Date.now(),returnTo:"/japanese/",
    }));
    local.set(JAPANESE_CONNECT_INTENT_KEY,"1");
  }
  vi.stubGlobal("localStorage",storage(local));
  vi.stubGlobal("sessionStorage",storage(session));
  const location={pathname:"/japanese/auth/callback/",search:"?code=verified-oauth-code",hash:""};
  const replaceState=vi.fn((_state:unknown,_unused:string,url:string)=>{
    location.pathname=url;
    location.search="";
  });
  vi.stubGlobal("window",{location,history:{replaceState}});
  let finishExchange:((value:{data:{session:{user:{id:string}}};error:null})=>void)|undefined;
  let failExchange:((reason:Error)=>void)|undefined;
  const exchangeCodeForSession=vi.fn(()=>new Promise<{data:{session:{user:{id:string}}};error:null}>(
    (resolve,reject)=>{finishExchange=resolve;failExchange=reject;},
  ));
  const getUser=vi.fn().mockResolvedValue({data:{user:{id:"user-from-google"}},error:null});
  const client={auth:{
    exchangeCodeForSession,getUser,
    onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{unsubscribe:vi.fn()}}}),
  }};
  const auth=createThiepnAccountAuthProvider({client:client as never});
  return {
    auth,local,session,location,replaceState,getUser,exchangeCodeForSession,
    finish:()=>finishExchange?.({data:{session:{user:{id:"user-from-google"}}},error:null}),
    fail:(message:string)=>failExchange?.(new Error(message)),
  };
}

describe("J16D actual Google -> Japanese callback behavior",()=>{
  it("exchanges a callback only once across simultaneous session refreshes",async()=>{
    const flow=setupCallback(true);
    const first=flow.auth.refresh();
    // History has already replaced /auth/callback/ by the first refresh.
    expect(flow.location.pathname).toBe("/japanese/");
    const second=flow.auth.refresh();
    expect(flow.exchangeCodeForSession).toHaveBeenCalledTimes(1);
    flow.finish();
    const [one,two]=await Promise.all([first,second]);
    expect(one).toMatchObject({status:"authenticated",accountId:"user-from-google"});
    expect(two).toMatchObject({status:"authenticated",accountId:"user-from-google"});
    expect(flow.getUser).toHaveBeenCalledTimes(1);
    expect(getRecentJapaneseAuthStage()?.stage).toBe("exchange-success");
    expect(flow.local.has(JAPANESE_LOGIN_STORAGE_KEY)).toBe(false);
    expect(flow.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
    // Reloading the home page can recover the verified session.
    expect(await flow.auth.refresh()).toMatchObject({status:"authenticated",accountId:"user-from-google"});
  });

  it("uses Supabase's PKCE verifier when PWA tab-login marker was lost",async()=>{
    const flow=setupCallback(false);
    const login=flow.auth.refresh();
    flow.finish();
    expect(await login).toMatchObject({status:"authenticated",accountId:"user-from-google"});
    expect(flow.exchangeCodeForSession).toHaveBeenCalledOnce();
  });

  it("completes a PKCE callback if hosting returns directly to /japanese/",async()=>{
    const flow=setupCallback(true);
    flow.location.pathname="/japanese/";
    const login=flow.auth.refresh();
    expect(flow.exchangeCodeForSession).toHaveBeenCalledTimes(1);
    flow.finish();
    expect(await login).toMatchObject({status:"authenticated",accountId:"user-from-google"});
  });

  it("accepts callback routes with or without a final slash",async()=>{
    const flow=setupCallback(true);
    flow.location.pathname="/japanese/auth/callback";
    const login=flow.auth.refresh();
    flow.finish();
    expect(await login).toMatchObject({status:"authenticated",accountId:"user-from-google"});
  });

  it("rejects an unrecognized callback without attempting an exchange",async()=>{
    const flow=setupCallback(false);
    flow.location.search="?error=access_denied";
    const result=await flow.auth.refresh();
    expect(result).toMatchObject({status:"expired",accountId:null});
    expect(flow.exchangeCodeForSession).not.toHaveBeenCalled();
    expect(getRecentJapaneseAuthFailure()?.code).toBe("AUTH-01");
    expect(getRecentJapaneseAuthStage()?.stage).toBe("callback-invalid");
  });
  it("records only redacted PKCE verifier failures",async()=>{
    const flow=setupCallback(true);
    const attempt=flow.auth.refresh();
    flow.fail("AuthPKCECodeVerifierMissingError: Code verifier not found");
    expect(await attempt).toMatchObject({status:"expired"});
    expect(getRecentJapaneseAuthFailure()?.code).toBe("AUTH-03");
    expect(getRecentJapaneseAuthStage()?.stage).toBe("exchange-failed");
    const raw=flow.local.get(JAPANESE_AUTH_FAILURE_KEY)??"";
    expect(raw).not.toContain("verified-oauth-code");
    expect(raw).not.toContain("Code verifier");
  });

  it("records exchange failures without exposing provider error details",async()=>{
    const flow=setupCallback(true);
    const attempt=flow.auth.refresh();
    flow.fail("Provider error with sensitive detail example");
    expect(await attempt).toMatchObject({status:"expired"});
    expect(getRecentJapaneseAuthFailure()?.code).toBe("AUTH-02");
    expect(flow.local.get(JAPANESE_AUTH_FAILURE_KEY)).not.toContain("sensitive detail");
  });

  it("clears historical login failure on confirmed session restoration",async()=>{
    const flow=setupCallback(true);
    flow.local.set(JAPANESE_AUTH_FAILURE_KEY,JSON.stringify({code:"AUTH-02",at:Date.now()}));
    const attempt=flow.auth.refresh();
    flow.finish();
    expect(await attempt).toMatchObject({status:"authenticated"});
    expect(getRecentJapaneseAuthFailure()).toBeNull();
    expect(flow.local.has(JAPANESE_AUTH_FAILURE_KEY)).toBe(false);
  });

  it("reports only presence flags for PWA-browser handoff diagnosis",()=>{
    const flow=setupCallback(true);
    const snapshot=getJapaneseHandoffSnapshot();
    expect(snapshot.pendingInThisContext).toBe(true);
    expect(snapshot.callbackCodePresent).toBe(true);
    expect(snapshot.verifierInThisContext).toBe(false);
    flow.local.set("thiepn-account-japanese-auth-v1-code-verifier","secret-never-exposed");
    const after=getJapaneseHandoffSnapshot();
    expect(after.verifierInThisContext).toBe(true);
    expect(JSON.stringify(after)).not.toContain("secret-never-exposed");
  });

  it("reports returning home without an OAuth code when pending marker survives",async()=>{
    const flow=setupCallback(true);
    flow.location.pathname="/japanese/";
    flow.location.search="";
    flow.local.set(JAPANESE_LOGIN_STORAGE_KEY,JSON.stringify({
      started:Date.now()-5000,returnTo:"/japanese/",
    }));
    expect(await flow.auth.refresh()).toMatchObject({status:"authenticated"});
    expect(getRecentJapaneseAuthStage()?.stage).toBe("returned-no-code");
    expect(JSON.stringify(getRecentJapaneseAuthStage())).not.toContain("verified-oauth-code");
  });

  it("expires non-secret diagnostics after 30 minutes",()=>{
    const flow=setupCallback(false);
    const at=Date.now()-31*60*1000;
    flow.local.set(JAPANESE_AUTH_FAILURE_KEY,JSON.stringify({code:"AUTH-02",at}));
    expect(getRecentJapaneseAuthFailure()).toBeNull();
  });

});
