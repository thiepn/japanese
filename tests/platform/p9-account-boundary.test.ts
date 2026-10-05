import "fake-indexeddb/auto";
import { afterEach,describe,expect,it,vi } from "vitest";
import {
  createThiepnAccountAuthProvider,
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
