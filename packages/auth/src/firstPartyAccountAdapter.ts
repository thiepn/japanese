import { createClient } from "@supabase/supabase-js";
import {
  JAPANESE_APP_SLUG,
  JAPANESE_CALLBACK_URL,
  THIEPN_ACCOUNT_PUBLISHABLE_KEY,
  JAPANESE_HOME_PATH,
  THIEPN_ACCOUNT_SUPABASE_URL,
  clearConnectIntent,
  hasConnectIntent,
  markConnectIntent,
  type AuthContext,
  type AuthProvider,
} from "./index";

/**
 * The exact public surface of thiepn/account/packages/account-session,
 * pinned for review at 7ebde5df82ecfba6ed0aed6ffbcfccafff493da9.
 *
 * This is a structural adapter, NOT a second PKCE/OAuth implementation.
 * Japanese CI must not silently fetch a private Account repository or
 * require an automatic OAuth client registration.
 */
export type FirstPartyIdentity =
  | Readonly<{ status: "signed-out" }>
  | Readonly<{ status: "unavailable"; code: string }>
  | Readonly<{ status: "signed-in"; id: string; email: string | null }>;

export interface FirstPartyAccountSession {
  readonly issuer: string;
  readonly redirectUri: string;
  readonly clientId: string;
}

export interface FirstPartyBrowserSso {
  readonly clientId: string;
  initialize(): Promise<
    | Readonly<{ status: "redirecting" }>
    | Readonly<{ status: "ready"; identity: FirstPartyIdentity }>
  >;
  connect(): Promise<void>;
  signOutLocal(): FirstPartyIdentity;
  completeCallback(location: Pick<Location, "href" | "hash">): Promise<FirstPartyIdentity>;
  verify(): Promise<FirstPartyIdentity>;
  getAccessToken(): Promise<string | null>;
  subscribe(listener: (identity: FirstPartyIdentity) => void): () => void;
}

/**
 * A future Account-owned/RLS-enforced connector; it must NEVER infer owner
 * identity from a Japanese-provided user ID. The bearer is supplied by the
 * verified shared SDK session. No live port is connected in this PR.
 */
export interface FirstPartyJapaneseConnectionPort {
  isConnected(bearer: string): Promise<boolean>;
  connect(bearer: string): Promise<void>;
}

/**
 * Reuse the existing Account connection RLS/RPC contract, not a new database.
 * Each operation binds a single already-verified SDK bearer for its lifetime.
 * Account derives the owner server-side; this client never supplies user IDs.
 */
export function createJapaneseFirstPartyConnectionPort(): FirstPartyJapaneseConnectionPort {
  const clientFor = (bearer: string) => {
    if (!bearer) throw new Error("ACCOUNT_TOKEN_UNAVAILABLE");
    return createClient(THIEPN_ACCOUNT_SUPABASE_URL, THIEPN_ACCOUNT_PUBLISHABLE_KEY, {
      accessToken: async () => bearer,
    });
  };
  return {
    async isConnected(bearer) {
      const response = await clientFor(bearer)
        .from("account_app_connections")
        .select("status")
        .eq("app_slug", JAPANESE_APP_SLUG)
        .maybeSingle();
      if (response.error) throw response.error;
      return response.data?.status === "connected" || response.data?.status === "limited";
    },
    async connect(bearer) {
      const response = await clientFor(bearer).rpc("connect_thiepn_app", {
        p_app_slug: JAPANESE_APP_SLUG,
      });
      if (response.error) throw response.error;
    },
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ANONYMOUS: AuthContext = { status: "anonymous", accountId: null, permissions: new Set<string>() };
const EXPIRED: AuthContext = { status: "expired", accountId: null, permissions: new Set<string>() };

function authContext(identity: FirstPartyIdentity): AuthContext {
  if (identity.status === "signed-in") {
    if (!UUID.test(identity.id)) return EXPIRED;
    return { status: "authenticated", accountId: identity.id, permissions: new Set<string>() };
  }
  return identity.status === "signed-out" ? ANONYMOUS : EXPIRED;
}

/**
 * Deliberately NOT selected by the app yet. The owner must first register
 * the real public OAuth client and pin/install the reviewed Account SDK.
 * This adapter only translates its verified identity and SSO lifecycle to
 * Japanese's existing owner-scoped AuthProvider; it does not replace Core,
 * alter guest data, or advertise cloud sync.
 */
export function createJapaneseFirstPartySdkAdapter(options: {
  readonly session: FirstPartyAccountSession;
  readonly sso: FirstPartyBrowserSso;
  readonly connections: FirstPartyJapaneseConnectionPort;
}): AuthProvider {
  const { session, sso, connections } = options;
  if (
    !UUID.test(session.clientId) ||
    session.clientId !== sso.clientId ||
    session.issuer !== THIEPN_ACCOUNT_SUPABASE_URL ||
    session.redirectUri !== JAPANESE_CALLBACK_URL
  ) throw new Error("JAPANESE_FIRST_PARTY_CLIENT_BINDING_INVALID");

  let current: AuthContext = ANONYMOUS;
  let revision = 0;
  let lastKey = "anonymous:";
  let callbackFlight: Promise<AuthContext> | null = null;
  const listeners = new Set<(context: AuthContext) => void>();

  const publish = (identity: FirstPartyIdentity): AuthContext => {
    const next = authContext(identity);
    const key = `${next.status}:${next.accountId ?? ""}`;
    if (key !== lastKey) revision++;
    lastKey = key;
    current = next;
    for (const listener of listeners) listener(current);
    return current;
  };

  // The SDK owns token verification, refresh, revocation and OAuth races.
  // Its identity events fence Japanese's existing workspace lease.
  sso.subscribe(publish);

  async function verified(): Promise<AuthContext> {
    const startedAt = revision;
    const verifiedIdentity = await sso.verify();
    // Another verified owner/sign-out event may have arrived during an
    // in-flight /user request. Never republish a stale result over it.
    return startedAt === revision ? publish(verifiedIdentity) : current;
  }

  async function verifiedBearer(): Promise<{ token: string; accountId: string; epoch: number }> {
    const context = await verified();
    if (context.status !== "authenticated" || !context.accountId) {
      throw new Error("ACCOUNT_AUTH_REQUIRED");
    }
    const epoch = revision;
    const token = await sso.getAccessToken();
    if (!token) throw new Error("ACCOUNT_TOKEN_UNAVAILABLE");
    const latest = await verified();
    if (
      epoch !== revision ||
      latest.status !== "authenticated" ||
      latest.accountId !== context.accountId
    ) throw new Error("ACCOUNT_WORKSPACE_CHANGED");
    return { token, accountId: context.accountId, epoch };
  }

  async function withBearer<T>(action: (token: string) => Promise<T>): Promise<T> {
    const { token, accountId, epoch } = await verifiedBearer();
    const result = await action(token);
    const latest = await verified();
    if (
      epoch !== revision ||
      latest.status !== "authenticated" ||
      latest.accountId !== accountId
    ) throw new Error("ACCOUNT_WORKSPACE_CHANGED");
    return result;
  }

  async function refresh(): Promise<AuthContext> {
    // Duplicate React effects, focus refresh and route re-entry must join
    // exactly one callback. The Account SDK owns its PKCE state and exchange.
    if (callbackFlight) return callbackFlight;
    if (typeof window !== "undefined") {
      const callback = new URL(JAPANESE_CALLBACK_URL);
      const location = window.location;
      if (location.origin === callback.origin &&
          location.pathname === callback.pathname) {
        const startedAt = revision;
        const attempt = (async () => {
          try {
            const identity = await sso.completeCallback(location);
            if (startedAt !== revision) return current;
            if (identity.status !== "signed-in") {
              // A rejected, cancelled or expired code cannot give a future
              // unrelated Account identity the pending guest-claim intent.
              clearConnectIntent();
              // An OAuth cancellation is not revocation. Reverify an existing
              // session with the SDK instead of dropping its owner or trusting
              // a stale cached account ID.
              const verifiedIdentity = await sso.verify();
              if (startedAt !== revision) return current;
              return publish(verifiedIdentity.status === "signed-in"
                ? verifiedIdentity : identity);
            }
            return publish(identity);
          } catch (error) {
            clearConnectIntent();
            throw error;
          } finally {
            // The one-use code, state and error fields are never retained in
            // the address bar; no PKCE verifier is copied between PWA/Chrome.
            window.history.replaceState(null, "", JAPANESE_HOME_PATH);
          }
        })();
        callbackFlight = attempt;
        try { return await attempt; }
        finally { if (callbackFlight === attempt) callbackFlight = null; }
      }
      // Only the one exact registered callback may consume OAuth data.
      // Redirect/proxy slash normalization and accidental home-path codes
      // must never silently fall through into SSO initialize or local caches.
      const params = new URLSearchParams(location.search);
      const unexpectedOAuthQuery = ["code","error","access_token","refresh_token","id_token"].some(
        key => params.has(key)
      );
      const unexpectedOAuthFragment = /(?:^|[&#])(access_token|refresh_token|id_token|code)=/i
        .test(location.hash);
      if (location.pathname.startsWith(JAPANESE_HOME_PATH) &&
          (unexpectedOAuthQuery || unexpectedOAuthFragment)) {
        clearConnectIntent();
        window.history.replaceState(null, "", JAPANESE_HOME_PATH);
        return publish({ status: "unavailable", code: "ACCOUNT_CALLBACK_ROUTE_INVALID" });
      }
    }
    const startedAt = revision;
    const result = await sso.initialize();
    // A sign-out/owner switch during a slow SSO probe invalidates its answer.
    if (startedAt !== revision) return current;
    // A signed-in Account seen without the matching one-use callback must not
    // reuse a previous, abandoned Japanese guest-claim intent.
    if (result.status === "ready") clearConnectIntent();
    // Never invent an authenticated user while navigating to Account.
    return result.status === "ready" ? publish(result.identity) : current;
  }

  async function connectApp(): Promise<void> {
    await withBearer(token => connections.connect(token));
    clearConnectIntent();
  }

  return Object.freeze({
    getCurrentContext: verified,
    getAccessToken: async () => {
      try { return (await verifiedBearer()).token; }
      catch { return null; }
    },
    isAppConnected: () => withBearer(token => connections.isConnected(token)),
    connectApp,
    async completePendingConnection() {
      if (await withBearer(token => connections.isConnected(token))) {
        clearConnectIntent();
        return true;
      }
      if (!hasConnectIntent()) return false;
      await connectApp();
      return true;
    },
    async signIn(returnTo?: string) {
      if (returnTo !== undefined && returnTo !== JAPANESE_HOME_PATH) {
        throw new Error("JAPANESE_FIRST_PARTY_RETURN_ROUTE_NOT_SUPPORTED");
      }
      // Preserve the original explicit Japanese guest-workspace claim intent.
      // This key is NOT an auth credential; the SDK owns PKCE state.
      markConnectIntent();
      try { await sso.connect(); }
      catch (error) { clearConnectIntent(); throw error; }
    },
    async signOut() {
      // Revoke the adapter's in-flight response epoch BEFORE SDK logout so
      // a delayed verification/callback cannot reattach the former owner.
      revision++;
      clearConnectIntent();
      try { sso.signOutLocal(); }
      finally { publish({ status: "signed-out" }); }
      // This is app-local logout; canonical Account sessions remain intact.
    },
    refresh,
    subscribe(listener: (context: AuthContext) => void) {
      listeners.add(listener);
      listener(current);
      return () => { listeners.delete(listener); };
    },
  });
}
