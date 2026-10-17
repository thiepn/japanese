import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createJapaneseFirstPartySdkAdapter,
  type FirstPartyAccountSession,
  type FirstPartyBrowserSso,
  type FirstPartyIdentity,
  type FirstPartyJapaneseConnectionPort,
} from "../../packages/auth/src/firstPartyAccountAdapter";
import {
  JAPANESE_CALLBACK_URL,
  JAPANESE_CONNECT_INTENT_KEY,
  THIEPN_ACCOUNT_SUPABASE_URL,
} from "../../packages/auth/src/index";

const CLIENT = "11111111-1111-4111-8111-111111111111"; // offline fixture only
const A = "22222222-2222-4222-8222-222222222222";
const B = "33333333-3333-4333-8333-333333333333";
const owner = (id: string): FirstPartyIdentity => ({ status: "signed-in", id, email: null });
const session: FirstPartyAccountSession = {
  clientId: CLIENT,
  issuer: THIEPN_ACCOUNT_SUPABASE_URL,
  redirectUri: JAPANESE_CALLBACK_URL,
};

function storage() {
  const content = new Map<string,string>();
  return {
    content,
    getItem: (key:string) => content.get(key) ?? null,
    setItem: (key:string, value:string) => { content.set(key,value); },
    removeItem: (key:string) => { content.delete(key); },
  };
}

function harness(initial: FirstPartyIdentity, href: string) {
  const local = storage();
  const sessionStore = storage();
  vi.stubGlobal("localStorage", local);
  vi.stubGlobal("sessionStorage", sessionStore);
  const url = new URL(href);
  const loc = {
    origin:url.origin,
    pathname:url.pathname,
    search:url.search,
    hash:url.hash,
    href:url.href,
  };
  const replaceState = vi.fn((_unused:unknown,_text:string,path:string) => {
    const u = new URL(path, url.origin);
    loc.pathname=u.pathname;
    loc.search=u.search;
    loc.hash=u.hash;
    loc.href=u.href;
  });
  vi.stubGlobal("window",{location:loc, history:{replaceState}});
  let current=initial;
  const listeners=new Set<(next: FirstPartyIdentity)=>void>();
  const emit=(next:FirstPartyIdentity)=>{
    current=next;
    for(const cb of listeners)cb(next);
  };
  const sso={
    clientId:CLIENT,
    initialize:vi.fn(async()=>({status:"ready" as const,identity:current})),
    connect:vi.fn(async()=>{}),
    signOutLocal:vi.fn(()=>{emit({status:"signed-out"});return current;}),
    completeCallback:vi.fn(async(_location:Pick<Location,"href"|"hash">)=>current),
    verify:vi.fn(async()=>current),
    getAccessToken:vi.fn(async()=>current.status==="signed-in"?"synthetic-token":null),
    subscribe:vi.fn((cb:(next:FirstPartyIdentity)=>void)=>{
      listeners.add(cb);
      cb(current);
      return()=>listeners.delete(cb);
    }),
  } satisfies FirstPartyBrowserSso;
  const connections={
    isConnected:vi.fn(async(_bearer:string)=>false),
    connect:vi.fn(async(_bearer:string)=>{}),
  } satisfies FirstPartyJapaneseConnectionPort;
  const provider=createJapaneseFirstPartySdkAdapter({session,sso,connections});
  return {provider,sso,connections,local,sessionStore,emit,loc,replaceState};
}

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

describe("E12Q first-party redirect and abandoned connection-intent boundaries",()=>{
  it("retains the explicit guest-claim intent only after a successful SDK callback",async()=>{
    const h=harness({status:"signed-out"},"https://thiepn.dev/japanese/auth/callback/?code=one-use&state=opaque");
    await h.provider.signIn();
    expect(h.local.content.get(JAPANESE_CONNECT_INTENT_KEY)).toBe("1");
    h.sso.completeCallback.mockResolvedValueOnce(owner(A));
    expect(await h.provider.refresh()).toMatchObject({status:"authenticated",accountId:A});
    expect(h.local.content.get(JAPANESE_CONNECT_INTENT_KEY)).toBe("1");
    expect(h.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
    expect(h.sso.completeCallback).toHaveBeenCalledOnce();
  });

  it("cancelling a login clears intent but preserves a separately verified prior owner",async()=>{
    const h=harness(owner(A),"https://thiepn.dev/japanese/auth/callback/?error=access_denied&state=opaque");
    await h.provider.signIn();
    h.sso.completeCallback.mockResolvedValueOnce({status:"unavailable",code:"ACCOUNT_AUTHORIZATION_CANCELLED"});
    expect(await h.provider.refresh()).toMatchObject({status:"authenticated",accountId:A});
    expect(h.sso.verify).toHaveBeenCalledOnce();
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    expect(h.connections.connect).not.toHaveBeenCalled();
    expect(h.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
  });

  it("reverifies owner A when the genuine SDK emits unavailable before a cancelled callback resolves",async()=>{
    const h=harness(owner(A),"https://thiepn.dev/japanese/auth/callback/?error=access_denied&state=opaque");
    await h.provider.signIn();
    h.sso.completeCallback.mockImplementationOnce(async()=>{
      h.emit({status:"unavailable",code:"ACCOUNT_AUTHORIZATION_CANCELLED"});
      return {status:"unavailable" as const,code:"ACCOUNT_AUTHORIZATION_CANCELLED"};
    });
    h.sso.verify.mockImplementationOnce(async()=>{
      h.emit(owner(A));
      return owner(A);
    });
    expect(await h.provider.refresh()).toMatchObject({status:"authenticated",accountId:A});
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    expect(h.connections.connect).not.toHaveBeenCalled();
    expect(h.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
  });

  it("clears A's pending claim if an unrelated B becomes active during successful SDK callback",async()=>{
    const h=harness({status:"signed-out"},"https://thiepn.dev/japanese/auth/callback/?code=one-use&state=opaque");
    await h.provider.signIn();
    h.sso.completeCallback.mockImplementationOnce(async()=>{
      h.emit(owner(A));
      h.emit(owner(B));
      return owner(A);
    });
    expect(await h.provider.refresh()).toMatchObject({status:"authenticated",accountId:B});
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    expect(await h.provider.completePendingConnection()).toBe(false);
    expect(h.connections.connect).not.toHaveBeenCalled();
  });

  it("invalid callback does not grant guest-claim intent to the next verified Account",async()=>{
    const h=harness({status:"signed-out"},"https://thiepn.dev/japanese/auth/callback/?error=invalid_request&state=bad");
    await h.provider.signIn();
    h.sso.completeCallback.mockResolvedValueOnce({status:"unavailable",code:"ACCOUNT_CALLBACK_INVALID"});
    expect(await h.provider.refresh()).toMatchObject({status:"expired",accountId:null});
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    h.emit(owner(B));
    expect(await h.provider.completePendingConnection()).toBe(false);
    expect(h.connections.connect).not.toHaveBeenCalled();
  });

  it("unavailable callback verification is never counted as an authenticated identity",async()=>{
    const h=harness(owner(A),"https://thiepn.dev/japanese/auth/callback/?error=access_denied&state=opaque");
    await h.provider.signIn();
    h.sso.completeCallback.mockResolvedValueOnce({status:"unavailable",code:"ACCOUNT_AUTHORIZATION_CANCELLED"});
    h.sso.verify.mockResolvedValueOnce({status:"unavailable",code:"ACCOUNT_VERIFY_UNAVAILABLE"});
    expect(await h.provider.refresh()).toMatchObject({status:"expired",accountId:null});
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
  });

  it("throws from the real SDK callback only after scrubbing return URL and intent",async()=>{
    const h=harness({status:"signed-out"},"https://thiepn.dev/japanese/auth/callback/?code=one-use&state=opaque");
    await h.provider.signIn();
    h.sso.completeCallback.mockRejectedValueOnce(new Error("SDK_NETWORK_FAILURE"));
    await expect(h.provider.refresh()).rejects.toThrow("SDK_NETWORK_FAILURE");
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    expect(h.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
  });

  it.each([
    "https://thiepn.dev/japanese/?code=stray&state=opaque",
    "https://thiepn.dev/japanese/auth/callback?code=stray&state=opaque",
    "https://thiepn.dev/japanese/?error=access_denied&state=opaque",
    "https://thiepn.dev/japanese/#access_token=unsafe",
    "https://thiepn.dev/japanese/learn?refresh_token=unsafe",
  ])("rejects noncanonical OAuth return without invoking either SDK method: %s",async(href)=>{
    const h=harness({status:"signed-out"},href);
    await h.provider.signIn();
    expect(await h.provider.refresh()).toMatchObject({status:"expired",accountId:null});
    expect(h.sso.initialize).not.toHaveBeenCalled();
    expect(h.sso.completeCallback).not.toHaveBeenCalled();
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    expect(h.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
  });

  it("ignores a stale login intent when visiting home as a signed-in but unconnected B",async()=>{
    const h=harness(owner(B),"https://thiepn.dev/japanese/");
    h.local.content.set(JAPANESE_CONNECT_INTENT_KEY,"1");
    expect(await h.provider.refresh()).toMatchObject({status:"authenticated",accountId:B});
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
    expect(await h.provider.completePendingConnection()).toBe(false);
    expect(h.connections.connect).not.toHaveBeenCalled();
  });

  it("does not clear pending intent when the SDK begins its authorized redirect",async()=>{
    const h=harness({status:"signed-out"},"https://thiepn.dev/japanese/");
    await h.provider.signIn();
    h.sso.initialize.mockResolvedValueOnce({status:"redirecting"});
    expect(await h.provider.refresh()).toMatchObject({status:"anonymous",accountId:null});
    expect(h.local.content.get(JAPANESE_CONNECT_INTENT_KEY)).toBe("1");
  });

  it("does not reuse a cancelled A login to connect B after account A→B→A switching",async()=>{
    const h=harness(owner(A),"https://thiepn.dev/japanese/auth/callback/?error=access_denied&state=opaque");
    await h.provider.signIn();
    h.sso.completeCallback.mockResolvedValueOnce({status:"unavailable",code:"ACCOUNT_AUTHORIZATION_CANCELLED"});
    await h.provider.refresh();
    h.emit(owner(B));
    h.emit(owner(A));
    expect(await h.provider.completePendingConnection()).toBe(false);
    expect(h.connections.connect).not.toHaveBeenCalled();
    expect(h.local.content.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
  });
});
