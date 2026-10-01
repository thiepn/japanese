export const JAPANESE_APP_SLUG = "japanese";
export const JAPANESE_CORE_APP_ID = "japanese";

export type AuthStatus = "authenticated" | "anonymous" | "expired";

export interface AuthContext {
  accountId: string | null;
  status: AuthStatus;
  permissions: ReadonlySet<string>;
}

export interface AuthProvider {
  getCurrentContext(): Promise<AuthContext>;
  signIn(returnTo?: string): Promise<void>;
  signOut(): Promise<void>;
  refresh(): Promise<AuthContext>;
  subscribe(listener: (context: AuthContext) => void): () => void;
}

export const JAPANESE_PERMISSION_INTENTS = [
  "study.read", "study.write", "notes.write", "sources.read", "sources.write", "ai.use", "export"
] as const;

// Production implementation must consume THIEPN Account/Core identity. This package deliberately does not create a second auth authority.
