import {afterEach,describe,expect,it,vi} from "vitest";
import {
  buildJapaneseAccountEntryUrl,
  createThiepnAccountAuthProvider,
  getRecentJapaneseAuthFailure,
  getRecentJapaneseAuthStage,
  JAPANESE_CALLBACK_URL,
  JAPANESE_CONNECT_INTENT_KEY,
  THIEPN_ACCOUNT_SUPABASE_URL,
} from "../../packages/auth/src/index";

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

function fakeStorage(map:Map<string,string>){
  return {
    getItem:(key:string)=>map.get(key)??null,
    setItem:(key:string,value:string)=>{map.set(key,value);},
    removeItem:(key:string)=>{map.delete(key);},
  };
}

function callbackFixture(){
  const storage=new Map<string,string>();
  const pathname={value:"/japanese/auth/callback/"};
  const location={get pathname(){return pathname.value;},search:"?code=single-use-code",hash:""};
  vi.stubGlobal("localStorage",fakeStorage(storage));
  vi.stubGlobal("sessionStorage",fakeStorage(new Map()));
  vi.stubGlobal("window",{
    location,
    history:{replaceState:vi.fn((_s:unknown,_unused:string,next:string)=>{
      pathname.value=next;
      location.search="";
    })},
  });
  const owner="11111111-1111-4111-8111-111111111111";
  const getUser=vi.fn()
    .mockRejectedValueOnce(new Error("temporary /user outage"))
    .mockResolvedValue({data:{user:{id:owner}},error:null});
  const exchangeCodeForSession=vi.fn().mockResolvedValue({
    data:{session:{user:{id:owner}}},
    error:null,
  });
  const client={auth:{
    getUser,
    exchangeCodeForSession,
    onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{unsubscribe:vi.fn()}}}),
  }};
  return {
    provider:createThiepnAccountAuthProvider({client:client as never}),
    exchangeCodeForSession,getUser,storage,owner,
  };
}

describe("J18 authentication error boundaries",()=>{
  it("does not misreport a successful code exchange as PKCE failure when /user is temporarily down",async()=>{
    const {provider,exchangeCodeForSession,storage,owner}=callbackFixture();
    storage.set(JAPANESE_CONNECT_INTENT_KEY,"1");
    await expect(provider.refresh()).rejects.toThrow("temporary /user outage");
    expect(exchangeCodeForSession).toHaveBeenCalledTimes(1);
    expect(getRecentJapaneseAuthStage()?.stage).toBe("exchange-success");
    expect(getRecentJapaneseAuthFailure()).toBeNull();
    expect(storage.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(true);
    // The OAuth code is removed from the URL and never replayed.
    expect(await provider.refresh()).toMatchObject({status:"authenticated",accountId:owner});
    expect(exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });

  it("keeps an already verified Account workspace on a transient background verification error",async()=>{
    const owner="22222222-2222-4222-8222-222222222222";
    let callback:((event:string)=>void)|undefined;
    const getUser=vi.fn()
      .mockResolvedValueOnce({data:{user:{id:owner}},error:null})
      .mockRejectedValueOnce(new Error("offline refresh"));
    const client={auth:{
      getUser,
      onAuthStateChange:vi.fn((fn:(event:string)=>void)=>{
        callback=fn;
        return {data:{subscription:{unsubscribe:vi.fn()}}};
      }),
    }};
    const provider=createThiepnAccountAuthProvider({client:client as never});
    const observer=vi.fn();
    provider.subscribe(observer);
    expect(await provider.refresh()).toMatchObject({status:"authenticated",accountId:owner});
    callback?.("TOKEN_REFRESHED");
    await vi.waitFor(()=>expect(getUser).toHaveBeenCalledTimes(2));
    await Promise.resolve();
    const contexts=observer.mock.calls.map(([state])=>state);
    expect(contexts.at(-1)).toMatchObject({status:"authenticated",accountId:owner});
    expect(contexts.some(state=>state.status==="anonymous"&&contexts.indexOf(state)>0)).toBe(false);
  });

  it("accepts only canonical Japanese Google S256 authorization requests",()=>{
    const valid=new URL("/auth/v1/authorize",THIEPN_ACCOUNT_SUPABASE_URL);
    valid.searchParams.set("provider","google");
    valid.searchParams.set("redirect_to",JAPANESE_CALLBACK_URL);
    valid.searchParams.set("code_challenge","a".repeat(43));
    valid.searchParams.set("code_challenge_method","s256");
    valid.searchParams.set("prompt","select_account");
    expect(buildJapaneseAccountEntryUrl(valid.href)).toContain("request=");
    for(const change of [
      (u:URL)=>u.searchParams.set("provider","github"),
      (u:URL)=>u.searchParams.set("redirect_to","https://evil.example/callback"),
      (u:URL)=>u.searchParams.set("code_challenge_method","plain"),
      (u:URL)=>u.searchParams.set("code_challenge","bad"),
      (u:URL)=>u.searchParams.append("prompt","select_account"),
      (u:URL)=>u.searchParams.set("next","https://evil.example"),
    ]){
      const invalid=new URL(valid);
      change(invalid);
      expect(()=>buildJapaneseAccountEntryUrl(invalid.href)).toThrow("INVALID_AUTHORIZATION_URL");
    }
  });
});
