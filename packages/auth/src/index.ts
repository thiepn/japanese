import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const JAPANESE_APP_SLUG = "japanese";
export const JAPANESE_CORE_APP_ID = "japanese";
export const THIEPN_ACCOUNT_SUPABASE_URL =
  "https://hycegznamzjhwinegaai.supabase.co";
export const THIEPN_ACCOUNT_PUBLISHABLE_KEY =
  "sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR";
export const JAPANESE_ACCOUNT_STORAGE_KEY =
  "thiepn-account-japanese-auth-v1";
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
  readonly client?: SupabaseClient;
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

export function createThiepnAccountAuthProvider(
  options: ThiepnAccountAuthOptions = {},
): AuthProvider {
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
          detectSessionInUrl: true,
          storageKey: options.storageKey ?? JAPANESE_ACCOUNT_STORAGE_KEY,
        },
      },
    );

  const listeners = new Set<(context: AuthContext) => void>();
  let current = ANONYMOUS_CONTEXT;

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

  async function refresh(): Promise<AuthContext> {
    return publish(await readContext());
  }

  client.auth.onAuthStateChange(() => {
    queueMicrotask(() => {
      void refresh().catch(() => publish(ANONYMOUS_CONTEXT));
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
    if (context.status !== "authenticated")
      throw new Error("ACCOUNT_AUTH_REQUIRED");
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

  return Object.freeze({
    getCurrentContext: readContext,
    async getAccessToken() {
      const response = await client.auth.getSession();
      if (response.error) {
        if (isMissingSession(response.error)) return null;
        throw response.error;
      }
      return response.data.session?.access_token ?? null;
    },
    isAppConnected: appConnected,
    connectApp: connectJapaneseApp,
    completePendingConnection,
    async signIn(returnTo?: string) {
      markConnectIntent();
      const redirectTo =
        returnTo ??
        (typeof window !== "undefined"
          ? window.location.origin + window.location.pathname
          : undefined);
      const response = await client.auth.signInWithOAuth(
        redirectTo
          ? { provider: "google", options: { redirectTo } }
          : { provider: "google" },
      );
      if (response.error) {
        clearConnectIntent();
        throw response.error;
      }
    },
    async signOut() {
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

// Production identity is THIEPN Account. Core still verifies bearer tokens server-side;
// getSession() is used only to transport the token, never as an authorization decision.


function markConnectIntent(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(JAPANESE_CONNECT_INTENT_KEY, "1");
}

function hasConnectIntent(): boolean {
  return (
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(JAPANESE_CONNECT_INTENT_KEY) === "1"
  );
}

function clearConnectIntent(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(JAPANESE_CONNECT_INTENT_KEY);
}
