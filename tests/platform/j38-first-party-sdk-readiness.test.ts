import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createJapaneseFirstPartySdkAdapter,
  type FirstPartyIdentity,
  type FirstPartyBrowserSso,
  type FirstPartyAccountSession,
  type FirstPartyJapaneseConnectionPort,
} from "../../packages/auth/src/firstPartyAccountAdapter";
import {
  prepareJapaneseFirstPartySdkCandidate,
  JAPANESE_FIRST_PARTY_ACCOUNT_ORIGIN,
  JAPANESE_FIRST_PARTY_STORAGE_KEY,
} from "../../packages/auth/src/firstPartySdkCandidate";
import {
  JAPANESE_CALLBACK_URL,
  THIEPN_ACCOUNT_SUPABASE_URL,
} from "../../packages/auth/src/index";

const CLIENT = "11111111-1111-4111-8111-111111111111"; // test UUID only
const A = "22222222-2222-4222-8222-222222222222";
const B = "33333333-3333-4333-8333-333333333333";
const signedIn = (id: string): FirstPartyIdentity => ({ status: "signed-in", id, email: null });
const session: FirstPartyAccountSession = {
  issuer: THIEPN_ACCOUNT_SUPABASE_URL,
  redirectUri: JAPANESE_CALLBACK_URL,
  clientId: CLIENT,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

function setup(initial: FirstPartyIdentity = signedIn(A)) {
  let identity = initial;
  const subscribers = new Set<(state: FirstPartyIdentity) => void>();
  const emit = (next: FirstPartyIdentity) => {
    identity = next;
    for (const subscriber of subscribers) subscriber(next);
  };
  const sso = {
    clientId: CLIENT,
    initialize: vi.fn(async () => ({ status: "ready" as const, identity })),
    connect: vi.fn(async () => {}),
    signOutLocal: vi.fn(() => { emit({ status: "signed-out" }); return identity; }),
    completeCallback: vi.fn(async (_location: Pick<Location, "href"|"hash">) => identity),
    verify: vi.fn(async () => identity),
    getAccessToken: vi.fn(async () => identity.status === "signed-in" ? "fixture-token" : null),
    subscribe: vi.fn((listener: (state: FirstPartyIdentity) => void) => {
      subscribers.add(listener);
      listener(identity);
      return () => { subscribers.delete(listener); };
    }),
  } satisfies FirstPartyBrowserSso;
  const connections = {
    isConnected: vi.fn(async (_bearer: string) => true),
    connect: vi.fn(async (_bearer: string) => {}),
  } satisfies FirstPartyJapaneseConnectionPort;
  const provider = createJapaneseFirstPartySdkAdapter({ session, sso, connections });
  return { sso, connections, provider, emit };
}

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("E12Q first-party Account SDK candidate and multi-owner races (no live client)", () => {
  it("uses actual shared SDK factories and an isolated app-local storage key", async () => {
    const { sso, connections } = setup();
    const createThiepnAccountSession = vi.fn((config: {
      issuer: string; redirectUri: string; clientId: string;
      authPolicy: "guest-first"; storageKey: string;
    }) => ({
      issuer: config.issuer, redirectUri: config.redirectUri, clientId: config.clientId,
    }));
    const createThiepnBrowserSso = vi.fn(() => sso);
    const candidate = prepareJapaneseFirstPartySdkCandidate(
      { createThiepnAccountSession, createThiepnBrowserSso }, CLIENT, connections,
    );
    expect(createThiepnAccountSession).toHaveBeenCalledWith(expect.objectContaining({
      issuer: THIEPN_ACCOUNT_SUPABASE_URL,
      redirectUri: JAPANESE_CALLBACK_URL,
      clientId: CLIENT,
      authPolicy: "guest-first",
      storageKey: JAPANESE_FIRST_PARTY_STORAGE_KEY,
    }));
    expect(createThiepnBrowserSso).toHaveBeenCalledWith(
      expect.objectContaining({ clientId: CLIENT }),
      { accountOrigin: JAPANESE_FIRST_PARTY_ACCOUNT_ORIGIN },
    );
    expect(candidate.sso).toBe(sso);
    expect(await candidate.provider.getCurrentContext()).toMatchObject({
      status: "authenticated", accountId: A,
    });
  });

  it("rejects missing, invented and invalid client IDs before touching the SDK", () => {
    const createThiepnAccountSession = vi.fn(() => session);
    const createThiepnBrowserSso = vi.fn(() => setup().sso);
    for (const value of ["", "japanese", "UNREGISTERED", "00000000-0000-0000-0000-000000000000"]) {
      expect(() => prepareJapaneseFirstPartySdkCandidate(
        { createThiepnAccountSession, createThiepnBrowserSso }, value,
      )).toThrow("JAPANESE_OAUTH_CLIENT_NOT_REGISTERED");
    }
    expect(createThiepnAccountSession).not.toHaveBeenCalled();
  });

  it("does not let delayed verification for account A overwrite a newer account B", async () => {
    const { provider, sso, emit } = setup(signedIn(A));
    const slow = deferred<FirstPartyIdentity>();
    sso.verify.mockImplementationOnce(() => slow.promise);
    const pending = provider.getCurrentContext();
    emit(signedIn(B));
    slow.resolve(signedIn(A));
    expect(await pending).toMatchObject({ status: "authenticated", accountId: B });
    expect(await provider.getCurrentContext()).toMatchObject({ status: "authenticated", accountId: B });
  });

  it("does not resurrect A after A→B→A during an in-flight token fetch", async () => {
    const { provider, sso, emit } = setup(signedIn(A));
    sso.getAccessToken.mockImplementationOnce(async () => {
      emit(signedIn(B));
      emit(signedIn(A));
      return "stale-token-for-A";
    });
    expect(await provider.getAccessToken()).toBeNull();
  });

  it("ignores late Account SSO initialize responses after local sign-out", async () => {
    const { provider, sso } = setup({ status: "signed-out" });
    const slow = deferred<{ status: "ready"; identity: FirstPartyIdentity }>();
    sso.initialize.mockImplementationOnce(() => slow.promise);
    const pending = provider.refresh();
    await provider.signOut();
    slow.resolve({ status: "ready", identity: signedIn(A) });
    expect(await pending).toMatchObject({ status: "anonymous", accountId: null });
  });

  it("joins two concurrent callback refreshes and sanitizes the URL only once", async () => {
    const slow = deferred<FirstPartyIdentity>();
    const replaceState = vi.fn();
    vi.stubGlobal("window", {
      location: {
        origin: "https://thiepn.dev",
        pathname: "/japanese/auth/callback/",
        href: "https://thiepn.dev/japanese/auth/callback/?code=single-use&state=nonce",
        hash: "",
      },
      history: { replaceState },
    });
    const { provider, sso } = setup({ status: "signed-out" });
    sso.completeCallback.mockImplementationOnce(() => slow.promise);
    const first = provider.refresh();
    const second = provider.refresh();
    expect(sso.completeCallback).toHaveBeenCalledTimes(1);
    slow.resolve(signedIn(A));
    expect(await first).toMatchObject({ status: "authenticated", accountId: A });
    expect(await second).toMatchObject({ status: "authenticated", accountId: A });
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(replaceState).toHaveBeenCalledWith(null, "", "/japanese/");
  });

  it("does not publish a late callback result after app-local logout", async () => {
    const slow = deferred<FirstPartyIdentity>();
    const replaceState = vi.fn();
    vi.stubGlobal("window", {
      location: {
        origin: "https://thiepn.dev",
        pathname: "/japanese/auth/callback/",
        href: "https://thiepn.dev/japanese/auth/callback/?code=single-use&state=nonce",
        hash: "",
      },
      history: { replaceState },
    });
    const { provider, sso } = setup({ status: "signed-out" });
    sso.completeCallback.mockImplementationOnce(() => slow.promise);
    const callback = provider.refresh();
    await provider.signOut();
    slow.resolve(signedIn(A));
    expect(await callback).toMatchObject({ status: "anonymous", accountId: null });
    expect(replaceState).toHaveBeenCalledTimes(1);
  });

  it("redacts failed callback state without claiming a logged-in identity", async () => {
    vi.stubGlobal("window", {
      location: {
        origin: "https://thiepn.dev",
        pathname: "/japanese/auth/callback/",
        href: "https://thiepn.dev/japanese/auth/callback/?state=secret&error=access_denied",
        hash: "",
      },
      history: { replaceState: vi.fn() },
    });
    const { provider, sso } = setup({ status: "signed-out" });
    sso.completeCallback.mockRejectedValueOnce(new Error("ACCOUNT_CALLBACK_INVALID"));
    await expect(provider.refresh()).rejects.toThrow("ACCOUNT_CALLBACK_INVALID");
    expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "/japanese/");
    expect(await provider.getCurrentContext()).toMatchObject({ status: "anonymous", accountId: null });
  });
});
