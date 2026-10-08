import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const JAPANESE_APP_SLUG = "japanese";
export const JAPANESE_CORE_APP_ID = "japanese";

export const THIEPN_ACCOUNT_SUPABASE_URL =
  "https://hycegznamzjhwinegaai.supabase.co";
export const THIEPN_ACCOUNT_PUBLISHABLE_KEY =
  "sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR";

export const THIEPN_ACCOUNT_URL = "https://account.thiepn.dev/";
export const JAPANESE_ACCOUNT_ENTRY_URL =
  "https://account.thiepn.dev/japanese/entry/";
export const JAPANESE_PUBLIC_ORIGIN = "https://thiepn.dev";
export const JAPANESE_HOME_PATH = "/japanese/";
export const JAPANESE_CALLBACK_PATH = "/japanese/auth/callback/";
export const JAPANESE_CALLBACK_URL =
  `${JAPANESE_PUBLIC_ORIGIN}${JAPANESE_CALLBACK_PATH}`;

export const JAPANESE_ACCOUNT_STORAGE_KEY =
  "thiepn-account-japanese-auth-v1";
export const JAPANESE_LOGIN_STORAGE_KEY =
  "thiepn:japanese-login:v1";
export const JAPANESE_CONNECT_INTENT_KEY =
  "thiepn-account-japanese-connect-intent-v1";

export type AuthStatus = "authenticated" | "anonymous" | "expired";

export interface AuthContext {
  accountId: string | null;
  status: AuthStatus;
  permissions: ReadonlySet<string>;
}

export interface AuthProvider {
  getCurrentContext(): Promise<AuthContext>;
  getAccessToken(): Promise<string | null>;
  isAppConnected(): Promise<boolean>;
  connectApp(): Promise<void>;
  completePendingConnection(): Promise<boolean>;
  signIn(returnTo?: string): Promise<void>;
  signOut(): Promise<void>;
  refresh(): Promise<AuthContext>;
  subscribe(listener: (context: AuthContext) => void): () => void;
}

export interface ThiepnAccountAuthOptions {
  readonly accountUrl?: string;
  readonly publishableKey?: string;
  readonly storageKey?: string;
  readonly accountEntryUrl?: string;
  readonly callbackUrl?: string;
  readonly client?: SupabaseClient;
}

export interface PendingJapaneseLogin {
  readonly started: number;
  readonly returnTo: string;
}

export const JAPANESE_PERMISSION_INTENTS = [
  "study.read",
  "study.write",
  "notes.write",
  "sources.read",
  "sources.write",
  "ai.use",
  "export",
] as const;

const ANONYMOUS_CONTEXT: AuthContext = Object.freeze({
  accountId: null,
  status: "anonymous",
  permissions: new Set<string>(),
});
const EXPIRED_CONTEXT: AuthContext = Object.freeze({
  accountId: null,
  status: "expired",
  permissions: new Set<string>(),
});

export function readPendingJapaneseLogin(
  raw: string | null,
  now = Date.now(),
): PendingJapaneseLogin | null {
  try {
    if (!raw || raw.length > 2048) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    if (
      typeof row.returnTo !== "string" ||
      !validJapaneseReturnTo(row.returnTo) ||
      typeof row.started !== "number" ||
      !Number.isFinite(row.started) ||
      now < row.started ||
      now - row.started > 10 * 60 * 1000
    ) {
      return null;
    }
    return {
      started: row.started,
      returnTo: row.returnTo,
    };
  } catch {
    return null;
  }
}

export function readJapaneseCallback(
  query: URLSearchParams,
  fragment: string,
): { readonly code: string } | null {
  if (
    fragment ||
    [...query.keys()].join(",") !== "code" ||
    query.getAll("code").length !== 1
  ) return null;
  const code = query.get("code");
  if (
    !code ||
    code.length > 2048 ||
    /[\s\x00-\x1f\x7f]/.test(code)
  ) {
    return null;
  }
  return { code };
}

export function buildJapaneseAccountEntryUrl(
  authorizationUrl: string,
  accountEntryUrl = JAPANESE_ACCOUNT_ENTRY_URL,
): string {
  const authorization = new URL(authorizationUrl);
  if (
    authorization.origin !== THIEPN_ACCOUNT_SUPABASE_URL ||
    authorization.pathname !== "/auth/v1/authorize" ||
    authorization.username ||
    authorization.password ||
    authorization.hash
  ) {
    throw new Error("INVALID_AUTHORIZATION_URL");
  }
  const entry = new URL(accountEntryUrl);
  if (
    entry.protocol !== "https:" ||
    entry.username ||
    entry.password ||
    entry.search ||
    entry.hash
  ) {
    throw new Error("INVALID_ACCOUNT_ENTRY_URL");
  }
  entry.searchParams.set("request", authorization.href);
  return entry.href;
}

export function createThiepnAccountAuthProvider(
  options: ThiepnAccountAuthOptions = {},
): AuthProvider {
  const accountEntryUrl =
    options.accountEntryUrl ?? JAPANESE_ACCOUNT_ENTRY_URL;
  const callbackUrl = options.callbackUrl ?? JAPANESE_CALLBACK_URL;
  const client =
    options.client ??
    createClient(
      options.accountUrl ?? THIEPN_ACCOUNT_SUPABASE_URL,
      options.publishableKey ?? THIEPN_ACCOUNT_PUBLISHABLE_KEY,
      {
        auth: {
          flowType: "pkce",
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: options.storageKey ?? JAPANESE_ACCOUNT_STORAGE_KEY,
        },
      },
    );

  const listeners = new Set<(context: AuthContext) => void>();
  let current = ANONYMOUS_CONTEXT;
  let busy = false;
  let callbackInFlight: Promise<AuthContext> | null = null;

  function publish(context: AuthContext): AuthContext {
    current = context;
    for (const listener of listeners) listener(context);
    return context;
  }

  async function readContext(): Promise<AuthContext> {
    const response = await client.auth.getUser();
    if (response.error) {
      if (isMissingSession(response.error)) return ANONYMOUS_CONTEXT;
      throw response.error;
    }
    return contextForUser(response.data.user);
  }

  async function verify(): Promise<AuthContext> {
    return publish(await readContext());
  }

  async function completeCallback(): Promise<AuthContext> {
    if (typeof window === "undefined") return verify();

    const callback = readJapaneseCallback(
      new URLSearchParams(window.location.search),
      window.location.hash,
    );

    let pending: PendingJapaneseLogin | null = null;
    try {
      pending = readStoredPendingLogin();
      clearPendingLogin();
    } catch {
      clearConnectIntent();
      return publish(EXPIRED_CONTEXT);
    }

    const returnTo = pending?.returnTo ?? JAPANESE_HOME_PATH;
    window.history.replaceState(null, "", returnTo);

    if (!callback) {
      clearConnectIntent();
      return publish(EXPIRED_CONTEXT);
    }

    // A PWA can return from the browser with the PKCE verifier still available
    // but without its per-tab intent marker. Supabase authenticates the
    // one-use code against the locally stored verifier; the marker alone is
    // not the security authority.

    busy = true;
    try {
      const response = await client.auth.exchangeCodeForSession(callback.code);
      if (response.error) throw response.error;
      return await verify();
    } catch {
      clearConnectIntent();
      return publish(EXPIRED_CONTEXT);
    } finally {
      busy = false;
    }
  }

  async function refresh(): Promise<AuthContext> {
    // A callback may be requested twice while a previous exchange is
    // pending (app mount, visibility restoration, or multiple consumers).
    // Its authorization code is single-use, so join the first exchange.
    if (callbackInFlight) return callbackInFlight;
    if (
      typeof window !== "undefined" &&
      window.location.pathname === new URL(callbackUrl).pathname
    ) {
      const attempt = completeCallback();
      callbackInFlight = attempt;
      try {
        return await attempt;
      } finally {
        if (callbackInFlight === attempt) callbackInFlight = null;
      }
    }
    return verify();
  }

  client.auth.onAuthStateChange((event) => {
    if (event === "INITIAL_SESSION" || busy) return;
    queueMicrotask(() => {
      if (
        !busy &&
        (typeof window === "undefined" ||
          window.location.pathname !== new URL(callbackUrl).pathname)
      ) {
        void verify().catch(() => publish(ANONYMOUS_CONTEXT));
      }
    });
  });

  async function appConnected(): Promise<boolean> {
    const context = await readContext();
    if (context.status !== "authenticated") return false;
    const response = await client
      .from("account_app_connections")
      .select("status")
      .eq("app_slug", JAPANESE_APP_SLUG)
      .maybeSingle();
    if (response.error) throw response.error;
    return (
      response.data?.status === "connected" ||
      response.data?.status === "limited"
    );
  }

  async function connectJapaneseApp(): Promise<void> {
    const context = await readContext();
    if (context.status !== "authenticated") {
      throw new Error("ACCOUNT_AUTH_REQUIRED");
    }
    const response = await client.rpc("connect_thiepn_app", {
      p_app_slug: JAPANESE_APP_SLUG,
    });
    if (response.error) throw response.error;
    clearConnectIntent();
  }

  async function completePendingConnection(): Promise<boolean> {
    if (await appConnected()) {
      clearConnectIntent();
      return true;
    }
    if (!hasConnectIntent()) return false;
    await connectJapaneseApp();
    return true;
  }

  async function beginSignIn(returnTo?: string): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("ACCOUNT_BROWSER_REQUIRED");
    }
    const safeReturnTo = validJapaneseReturnTo(returnTo)
      ? returnTo
      : JAPANESE_HOME_PATH;
    markConnectIntent();
    try {
      storePendingLogin({
        started: Date.now(),
        returnTo: safeReturnTo,
      });
    } catch {
      clearConnectIntent();
      throw new Error("LOGIN_STORAGE_UNAVAILABLE");
    }

    const callback = new URL(callbackUrl);
    if (callback.search || callback.hash) {
      clearPendingLogin();
      clearConnectIntent();
      throw new Error("INVALID_CALLBACK_URL");
    }

    const response = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callback.href,
        skipBrowserRedirect: true,
        queryParams: { prompt: "select_account" },
      },
    });

    if (response.error || !response.data.url) {
      clearPendingLogin();
      clearConnectIntent();
      throw response.error ?? new Error("LOGIN_START_FAILED");
    }

    window.location.assign(
      buildJapaneseAccountEntryUrl(response.data.url, accountEntryUrl),
    );
  }

  return Object.freeze({
    getCurrentContext: readContext,
    async getAccessToken() {
      const response = await client.auth.getSession();
      if (response.error) {
        if (isMissingSession(response.error)) return null;
        throw response.error;
      }
      const session = response.data.session;
      if (!session?.access_token) return null;
      if (
        current.status === "authenticated" &&
        current.accountId &&
        session.user.id !== current.accountId
      ) {
        return null;
      }
      return session.access_token;
    },
    isAppConnected: appConnected,
    connectApp: connectJapaneseApp,
    completePendingConnection,
    signIn: beginSignIn,
    async signOut() {
      clearPendingLogin();
      clearConnectIntent();
      const response = await client.auth.signOut({ scope: "local" });
      if (response.error) throw response.error;
      publish(ANONYMOUS_CONTEXT);
    },
    refresh,
    subscribe(listener: (context: AuthContext) => void) {
      listeners.add(listener);
      listener(current);
      return () => {
        listeners.delete(listener);
      };
    },
  });
}

function validJapaneseReturnTo(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value, JAPANESE_PUBLIC_ORIGIN);
    return (
      url.origin === JAPANESE_PUBLIC_ORIGIN &&
      url.pathname.startsWith(JAPANESE_HOME_PATH) &&
      !url.pathname.startsWith(JAPANESE_CALLBACK_PATH) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function contextForUser(user: User | null): AuthContext {
  if (!user) return ANONYMOUS_CONTEXT;
  return Object.freeze({
    accountId: user.id,
    status: "authenticated" as const,
    permissions: new Set<string>(),
  });
}

function isMissingSession(error: unknown): boolean {
  const value =
    error && typeof error === "object"
      ? `${"name" in error ? String(error.name) : ""} ${
          "message" in error ? String(error.message) : ""
        }`
      : String(error ?? "");
  return /AuthSessionMissing|session missing|no session/i.test(value);
}

// A standalone Android PWA can complete its OAuth redirect in a new Chrome
// browsing context. Keep the short-lived pending marker in origin-scoped
// localStorage as well as tab sessionStorage; PKCE itself remains managed by
// Supabase on the same Japanese origin and no tokens cross the Account origin.
function availableLoginStores(): Storage[] {
  const stores: Storage[] = [];
  for(const name of ["localStorage","sessionStorage"] as const) {
    try {
      const candidate=globalThis[name];
      if(candidate)stores.push(candidate);
    } catch { /* storage can be disabled */ }
  }
  return stores;
}
function storePendingLogin(marker:PendingJapaneseLogin):void {
  const raw=JSON.stringify(marker);
  let stored=false;
  for(const storage of availableLoginStores()){
    try{storage.setItem(JAPANESE_LOGIN_STORAGE_KEY,raw);stored=true;}catch{}
  }
  if(!stored)throw new Error("LOGIN_STORAGE_UNAVAILABLE");
}
function readStoredPendingLogin():PendingJapaneseLogin|null {
  for(const storage of availableLoginStores()){
    try{
      const pending=readPendingJapaneseLogin(storage.getItem(JAPANESE_LOGIN_STORAGE_KEY));
      if(pending)return pending;
    }catch{}
  }
  return null;
}

function markConnectIntent(): void {
  for(const storage of availableLoginStores()){
    try{storage.setItem(JAPANESE_CONNECT_INTENT_KEY,"1");}catch{}
  }
}
function hasConnectIntent(): boolean {
  return availableLoginStores().some(storage=>{
    try{return storage.getItem(JAPANESE_CONNECT_INTENT_KEY)==="1";}catch{return false;}
  });
}
function clearConnectIntent(): void {
  for(const storage of availableLoginStores()){
    try{storage.removeItem(JAPANESE_CONNECT_INTENT_KEY);}catch{}
  }
}
function clearPendingLogin(): void {
  for(const storage of availableLoginStores()){
    try{storage.removeItem(JAPANESE_LOGIN_STORAGE_KEY);}catch{}
  }
}

// Japanese is a consumer of the canonical THIEPN Account identity.
// It owns no user database, password flow, OAuth issuer, or account profile.
// Browser PKCE material stays in Japanese, the user-facing sign-in enters through
// account.thiepn.dev, and Core independently verifies the bearer token server-side.
