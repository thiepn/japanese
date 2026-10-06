import "fake-indexeddb/auto";
import { afterEach,describe,expect,it,vi } from "vitest";
import {
  buildJapaneseAccountEntryUrl,
  createThiepnAccountAuthProvider,
  JAPANESE_ACCOUNT_ENTRY_URL,
  JAPANESE_CALLBACK_URL,
  readJapaneseCallback,
  readPendingJapaneseLogin,
  THIEPN_ACCOUNT_SUPABASE_URL,
  type AuthProvider
} from "../../packages/auth/src/index";
import {
  GUEST_ACCOUNT_ID,
  getDevelopmentAccountId,
  setDevelopmentAccountId
} from "../../apps/web/src/study/runtime";
import {
  AUTHENTIC_GUEST_ACCOUNT_ID,
  getAuthenticAccountId,
  setAuthenticAccountId
} from "../../apps/web/src/immerse/authentic";
import { createJapaneseLanguageDashboardPublisher } from "../../apps/web/src/languageDashboard";

afterEach(()=>{
  setDevelopmentAccountId(GUEST_ACCOUNT_ID);
  setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
  vi.unstubAllGlobals();
});

describe("P9 THIEPN Account boundary",()=>{

  it("routes production sign-in through the shared THIEPN Account entry",()=>{
    const authorize=new URL("/auth/v1/authorize",THIEPN_ACCOUNT_SUPABASE_URL);
    authorize.searchParams.set("provider","google");
    authorize.searchParams.set("redirect_to",JAPANESE_CALLBACK_URL);
    authorize.searchParams.set("code_challenge","b".repeat(43));
    authorize.searchParams.set("code_challenge_method","s256");
    authorize.searchParams.set("prompt","select_account");

    const entry=new URL(buildJapaneseAccountEntryUrl(authorize.href));
    expect(entry.origin+entry.pathname).toBe(JAPANESE_ACCOUNT_ENTRY_URL);
    expect(entry.searchParams.get("request")).toBe(authorize.href);
    expect(()=>buildJapaneseAccountEntryUrl("https://evil.test/auth/v1/authorize")).toThrow("INVALID_AUTHORIZATION_URL");
  });

  it("uses a fresh pending-login marker and rejects unsafe callback state",()=>{
    const now=1_800_000;
    const raw=JSON.stringify({started:now-30_000,returnTo:"/japanese/"});
    expect(readPendingJapaneseLogin(raw,now)).toEqual({
      started:now-30_000,
      returnTo:"/japanese/"
    });
    expect(readPendingJapaneseLogin(raw,now+10*60*1000+1)).toBeNull();
    expect(readPendingJapaneseLogin(JSON.stringify({started:now-1,returnTo:"https://evil.test/"}),now)).toBeNull();

    expect(
      readJapaneseCallback(new URLSearchParams({code:"one-use-code"}),""),
    ).toEqual({code:"one-use-code"});
    expect(
      readJapaneseCallback(new URLSearchParams({code:"one-use-code",extra:"x"}),""),
    ).toBeNull();
    expect(
      readJapaneseCallback(new URLSearchParams("code=one&code=two"),""),
    ).toBeNull();
    expect(
      readJapaneseCallback(new URLSearchParams({code:"one-use-code"}),"#access_token=x"),
    ).toBeNull();
  });

  it("surfaces an invalid Account callback as expired instead of silently anonymous",async()=>{
    const storage=new Map<string,string>();
    const sessionStorageMock={
      getItem:vi.fn((key:string)=>storage.get(key)??null),
      setItem:vi.fn((key:string,value:string)=>{storage.set(key,value);}),
      removeItem:vi.fn((key:string)=>{storage.delete(key);}),
    };
    sessionStorageMock.setItem(
      "thiepn:japanese-login:v1",
      JSON.stringify({started:Date.now(),returnTo:"/japanese/"}),
    );
    const replaceState=vi.fn();
    vi.stubGlobal("sessionStorage",sessionStorageMock);
    vi.stubGlobal("window",{
      location:{
        pathname:"/japanese/auth/callback/",
        search:"",
        hash:"",
        assign:vi.fn(),
      },
      history:{replaceState},
    });
    const client={
      auth:{
        getUser:vi.fn(),
        getSession:vi.fn(),
        exchangeCodeForSession:vi.fn(),
        signInWithOAuth:vi.fn(),
        signOut:vi.fn(),
        onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{closed:false,unsubscribe:vi.fn()}}}),
      },
    };
    const provider=createThiepnAccountAuthProvider({client:client as never});
    expect(await provider.refresh()).toMatchObject({status:"expired",accountId:null});
    expect(client.auth.exchangeCodeForSession).not.toHaveBeenCalled();
    expect(replaceState).toHaveBeenCalledWith(null,"","/japanese/");
  });

  it("uses canonical Account user verification and bearer session transport",async()=>{
    const userId="11111111-1111-4111-8111-111111111111";
    const client={
      auth:{
        getUser:vi.fn().mockResolvedValue({data:{user:{id:userId}},error:null}),
        getSession:vi.fn().mockResolvedValue({data:{session:{access_token:"account-token"}},error:null}),
        signInWithOAuth:vi.fn().mockResolvedValue({data:{},error:null}),
        signOut:vi.fn().mockResolvedValue({error:null}),
        onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{closed:false,unsubscribe:vi.fn()}}})
      }
    };
    const provider=createThiepnAccountAuthProvider({client:client as never});
    expect(await provider.getCurrentContext()).toMatchObject({
      accountId:userId,
      status:"authenticated"
    });
    expect(await provider.getAccessToken()).toBe("account-token");
    expect(client.auth.getUser).toHaveBeenCalledTimes(1);
    expect(client.auth.getSession).toHaveBeenCalledTimes(1);
  });

  it("verified reads do not recursively notify auth subscribers",async()=>{
    const userId="11111111-1111-4111-8111-111111111111";
    const maybeSingle=vi.fn().mockResolvedValue({data:{status:"connected"},error:null});
    const eq=vi.fn().mockReturnValue({maybeSingle});
    const select=vi.fn().mockReturnValue({eq});
    const client={
      auth:{
        getUser:vi.fn().mockResolvedValue({data:{user:{id:userId}},error:null}),
        getSession:vi.fn().mockResolvedValue({data:{session:{access_token:"account-token"}},error:null}),
        signInWithOAuth:vi.fn().mockResolvedValue({data:{},error:null}),
        signOut:vi.fn().mockResolvedValue({error:null}),
        onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{closed:false,unsubscribe:vi.fn()}}})
      },
      from:vi.fn().mockReturnValue({select}),
      rpc:vi.fn()
    };
    const provider=createThiepnAccountAuthProvider({client:client as never});
    const listener=vi.fn();
    provider.subscribe(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    await provider.getCurrentContext();
    await provider.isAppConnected();
    expect(listener).toHaveBeenCalledTimes(1);
    await provider.refresh();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("does not publish when Account is authenticated but Japanese is not connected",async()=>{
    const accountId="33333333-3333-4333-8333-333333333333";
    setDevelopmentAccountId(accountId);
    setAuthenticAccountId(accountId);
    const auth:AuthProvider={
      getCurrentContext:async()=>({accountId,status:"authenticated",permissions:new Set()}),
      getAccessToken:async()=>"account-token",
      isAppConnected:async()=>false,
      connectApp:async()=>{},
      completePendingConnection:async()=>false,
      signIn:async()=>{},
      signOut:async()=>{},
      refresh:async()=>({accountId,status:"authenticated",permissions:new Set()}),
      subscribe:()=>()=>{}
    };
    const fetch=vi.fn();
    vi.stubGlobal("fetch",fetch);
    const publisher=createJapaneseLanguageDashboardPublisher(auth,"https://core.example");
    expect(await publisher.publish()).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed instead of publishing an authenticated account over a different local workspace",async()=>{
    const accountId="22222222-2222-4222-8222-222222222222";
    const auth:AuthProvider={
      getCurrentContext:async()=>({accountId,status:"authenticated",permissions:new Set()}),
      getAccessToken:async()=>"account-token",
      isAppConnected:async()=>true,
      connectApp:async()=>{},
      completePendingConnection:async()=>true,
      signIn:async()=>{},
      signOut:async()=>{},
      refresh:async()=>({accountId,status:"authenticated",permissions:new Set()}),
      subscribe:()=>()=>{}
    };
    const fetch=vi.fn();
    vi.stubGlobal("fetch",fetch);
    const publisher=createJapaneseLanguageDashboardPublisher(auth,"https://core.example");

    expect(getDevelopmentAccountId()).toBe(GUEST_ACCOUNT_ID);
    expect(getAuthenticAccountId()).toBe(AUTHENTIC_GUEST_ACCOUNT_ID);
    expect(await publisher.publish()).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
