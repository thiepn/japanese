import {
  JAPANESE_CALLBACK_URL,
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
    return publish(await sso.verify());
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
    if (typeof window !== "undefined") {
      const callback = new URL(JAPANESE_CALLBACK_URL);
      if (window.location.origin === callback.origin &&
          window.location.pathname === callback.pathname) {
        try {
          return publish(await sso.completeCallback(window.location));
        } finally {
          // Remove one-use code/state from browser history after the SDK has
          // consumed them, including cancelled/invalid responses.
          window.history.replaceState(null, "", JAPANESE_HOME_PATH);
        }
      }
    }
    const result = await sso.initialize();
    // Do not invent a user while the SDK navigates to the Account issuer.
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
      clearConnectIntent();
      publish(sso.signOutLocal());
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
