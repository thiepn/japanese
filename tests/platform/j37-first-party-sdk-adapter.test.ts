import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createJapaneseFirstPartySdkAdapter,
  type FirstPartyIdentity,
  type FirstPartyBrowserSso,
  type FirstPartyAccountSession,
  type FirstPartyJapaneseConnectionPort,
} from "../../packages/auth/src/firstPartyAccountAdapter";
import {
  JAPANESE_CALLBACK_URL,
  JAPANESE_CONNECT_INTENT_KEY,
  JAPANESE_HOME_PATH,
  THIEPN_ACCOUNT_SUPABASE_URL,
} from "../../packages/auth/src/index";

const CLIENT = "11111111-1111-4111-8111-111111111111"; // fixture, never a configured client
const A = "22222222-2222-4222-8222-222222222222";
const B = "33333333-3333-4333-8333-333333333333";
const signedIn = (id: string): FirstPartyIdentity => ({ status: "signed-in", id, email: null });
const session: FirstPartyAccountSession = {
  clientId: CLIENT,
  issuer: THIEPN_ACCOUNT_SUPABASE_URL,
  redirectUri: JAPANESE_CALLBACK_URL,
};

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

function harness(initial: FirstPartyIdentity = { status: "signed-out" }) {
  let identity = initial;
  const subscribers = new Set<(state: FirstPartyIdentity) => void>();
  const emit = (next: FirstPartyIdentity) => {
    identity = next;
    for (const subscriber of subscribers) subscriber(next);
  };
  const sdk = {
    clientId: CLIENT,
    initialize: vi.fn(async () => ({ status: "ready" as const, identity })),
    connect: vi.fn(async () => {}),
    signOutLocal: vi.fn(() => {
      emit({ status: "signed-out" });
      return identity;
    }),
    completeCallback: vi.fn(async () => { emit(signedIn(A)); return identity; }),
    verify: vi.fn(async () => identity),
    getAccessToken: vi.fn(async () => identity.status === "signed-in" ? "test-only-token" : null),
    subscribe: vi.fn((listener: (state: FirstPartyIdentity) => void) => {
      subscribers.add(listener);
      listener(identity);
      return () => { subscribers.delete(listener); };
    }),
  } satisfies FirstPartyBrowserSso;
  const connections = {
    isConnected: vi.fn(async (_bearer: string) => false),
    connect: vi.fn(async (_bearer: string) => {}),
  } satisfies FirstPartyJapaneseConnectionPort;
  const provider = createJapaneseFirstPartySdkAdapter({
    session, sso: sdk, connections,
  });
  return { sdk, connections, provider, emit };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("J18 first-party Account SDK adapter preparation (NOT activated)", () => {
  it("fails closed on an unbound/incorrect registered-client contract", () => {
    const { sdk, connections } = harness();
    for (const changed of [
      { ...session, clientId: "invalid" },
      { ...session, clientId: B },
      { ...session, issuer: "https://untrusted.example" },
      { ...session, redirectUri: "https://evil.example/callback/" },
      { ...session, redirectUri: "https://thiepn.dev/japanese/auth/callback" },
    ]) {
      expect(() => createJapaneseFirstPartySdkAdapter({
        session: changed, sso: sdk, connections,
      })).toThrow("JAPANESE_FIRST_PARTY_CLIENT_BINDING_INVALID");
    }
  });

  it("uses the shared SDK SSO lifecycle without generating Google or PKCE URLs itself", async () => {
    const store = memoryStorage();
    vi.stubGlobal("localStorage", store);
    vi.stubGlobal("sessionStorage", memoryStorage());
    const { sdk, provider } = harness();
    expect(await provider.refresh()).toMatchObject({ status: "anonymous", accountId: null });
    expect(sdk.initialize).toHaveBeenCalledTimes(1);
    await provider.signIn();
    expect(store.values.get(JAPANESE_CONNECT_INTENT_KEY)).toBe("1");
    expect(sdk.connect).toHaveBeenCalledOnce();
    expect([...store.values.keys()]).toEqual([JAPANESE_CONNECT_INTENT_KEY]);
    await expect(provider.signIn("/japanese/learn/")).rejects.toThrow("JAPANESE_FIRST_PARTY_RETURN_ROUTE_NOT_SUPPORTED");
    expect(sdk.connect).toHaveBeenCalledOnce();
  });

  it("finishes an SDK-owned callback before clearing one-use code and state from history", async () => {
    const location = {
      origin: "https://thiepn.dev",
      pathname: "/japanese/auth/callback/",
      href: "https://thiepn.dev/japanese/auth/callback/?code=one-use&state=one-use",
      hash: "",
    };
    const replaceState = vi.fn();
    vi.stubGlobal("window", { location, history: { replaceState } });
    const { sdk, provider } = harness();
    sdk.completeCallback.mockImplementation(async loc => {
      expect(loc.href).toContain("code=one-use");
      expect(replaceState).not.toHaveBeenCalled();
      return signedIn(A);
    });
    expect(await provider.refresh()).toMatchObject({ status: "authenticated", accountId: A });
    expect(sdk.completeCallback).toHaveBeenCalledOnce();
    expect(replaceState).toHaveBeenCalledWith(null, "", JAPANESE_HOME_PATH);
    expect(sdk.initialize).not.toHaveBeenCalled();
  });

  it("strips invalid/cancelled callback params and never invents identity", async () => {
    vi.stubGlobal("window", {
      location: {
        origin: "https://thiepn.dev",
        pathname: "/japanese/auth/callback/",
        href: "https://thiepn.dev/japanese/auth/callback/?error=access_denied&state=redacted",
        hash: "",
      },
      history: { replaceState: vi.fn() },
    });
    const { sdk, provider } = harness();
    sdk.completeCallback.mockResolvedValueOnce({ status: "unavailable", code: "ACCOUNT_AUTHORIZATION_CANCELLED" });
    expect(await provider.refresh()).toMatchObject({ status: "expired", accountId: null });
    expect(vi.mocked(window.history.replaceState)).toHaveBeenCalledWith(null, "", JAPANESE_HOME_PATH);
  });

  it("keeps connection writes explicit and verifies Account identity before/after RLS RPCs", async () => {
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("sessionStorage", memoryStorage());
    const { provider, connections, emit } = harness(signedIn(A));
    expect(await provider.completePendingConnection()).toBe(false);
    expect(connections.connect).not.toHaveBeenCalled();
    await provider.signIn();
    expect(await provider.completePendingConnection()).toBe(true);
    expect(connections.connect).toHaveBeenCalledWith("test-only-token");
    expect(await provider.getCurrentContext()).toMatchObject({ status: "authenticated", accountId: A });
    emit(signedIn(B));
    expect(await provider.getCurrentContext()).toMatchObject({ status: "authenticated", accountId: B });
    expect(await provider.getAccessToken()).toBe("test-only-token");
  });

  it("rejects a cross-owner switch while an Account-connected RPC is in flight", async () => {
    const { provider, connections, emit } = harness(signedIn(A));
    let complete!: (value: boolean) => void;
    connections.isConnected.mockImplementationOnce(() => new Promise<boolean>(resolve => { complete = resolve; }));
    const attempt = provider.isAppConnected();
    await vi.waitFor(() => expect(connections.isConnected).toHaveBeenCalled());
    emit(signedIn(B));
    complete(true);
    await expect(attempt).rejects.toThrow("ACCOUNT_WORKSPACE_CHANGED");
    expect(await provider.getCurrentContext()).toMatchObject({ status: "authenticated", accountId: B });
  });

  it("does not leak a prior owner's token when the SDK changes identity while getting it", async () => {
    const { provider, sdk, emit } = harness(signedIn(A));
    sdk.getAccessToken.mockImplementationOnce(async () => {
      emit(signedIn(B));
      return "stale-A-token";
    });
    expect(await provider.getAccessToken()).toBeNull();
  });

  it("downgrades unavailable verification, and locally signs out without global Account logout", async () => {
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("sessionStorage", memoryStorage());
    const { provider, sdk, emit } = harness(signedIn(A));
    const updates: string[] = [];
    provider.subscribe(context => updates.push(`${context.status}:${context.accountId ?? ""}`));
    emit({ status: "unavailable", code: "ACCOUNT_VERIFY_UNAVAILABLE" });
    expect(await provider.getCurrentContext()).toMatchObject({ status: "expired", accountId: null });
    expect(await provider.getAccessToken()).toBeNull();
    emit(signedIn(B));
    await provider.signOut();
    expect(sdk.signOutLocal).toHaveBeenCalledOnce();
    expect(updates).toContain(`authenticated:${B}`);
    expect(updates.at(-1)).toBe("anonymous:");
    expect(await provider.getCurrentContext()).toMatchObject({ status: "anonymous", accountId: null });
  });

  it("propagates original SDK sign-in errors and clears only the existing non-secret intent", async () => {
    const store = memoryStorage();
    vi.stubGlobal("localStorage", store);
    vi.stubGlobal("sessionStorage", memoryStorage());
    const { provider, sdk } = harness();
    sdk.connect.mockRejectedValueOnce(new Error("ACCOUNT_NOT_REGISTERED"));
    await expect(provider.signIn()).rejects.toThrow("ACCOUNT_NOT_REGISTERED");
    expect(store.values.has(JAPANESE_CONNECT_INTENT_KEY)).toBe(false);
  });
});
