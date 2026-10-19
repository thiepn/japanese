import {
  JAPANESE_CALLBACK_URL,
  THIEPN_ACCOUNT_PUBLISHABLE_KEY,
  THIEPN_ACCOUNT_SUPABASE_URL,
} from "./index";
import {
  createJapaneseFirstPartyConnectionPort,
  createJapaneseFirstPartySdkAdapter,
  type FirstPartyAccountSession,
  type FirstPartyBrowserSso,
  type FirstPartyJapaneseConnectionPort,
} from "./firstPartyAccountAdapter";

/**
 * Production must use the real, independently reviewed Account package:
 * thiepn/account@7ebde5df82ecfba6ed0aed6ffbcfccafff493da9
 * packages/account-session/src/{index,browser-sso}.ts.
 *
 * Do NOT import Account from a private Git URL here; public/credential-free
 * Japanese CI cannot install it. A separate, approved dependency resolution
 * must pass scripts/verify-account-sdk-distribution.mjs before this factory
 * may be wired into Japanese's live entry. It is intentionally not imported
 * by the app and cannot create/register OAuth clients.
 */
export const JAPANESE_FIRST_PARTY_ACCOUNT_ORIGIN = "https://account.thiepn.dev";
export const JAPANESE_FIRST_PARTY_STORAGE_KEY = "thiepn:japanese:first-party-oauth:v1";
export const JAPANESE_ACCOUNT_SDK_PINNED_COMMIT =
  "7ebde5df82ecfba6ed0aed6ffbcfccafff493da9";

export interface FirstPartySessionFactoryOptions {
  readonly issuer: string;
  readonly publishableKey: string;
  readonly clientId: string;
  readonly redirectUri: string;
  readonly storageKey: string;
  readonly authPolicy: "guest-first";
}

export interface FirstPartySsoFactoryOptions {
  readonly accountOrigin: string;
}

/**
 * Generic Session keeps the actual Account SDK return type intact across both
 * factories; Japanese does not copy, reimplement or monkeypatch OAuth.
 */
export interface FirstPartySdkFunctions<Session extends FirstPartyAccountSession> {
  createThiepnAccountSession(options: FirstPartySessionFactoryOptions): Session;
  createThiepnBrowserSso(
    session: Session,
    options: FirstPartySsoFactoryOptions,
  ): FirstPartyBrowserSso;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * A candidate factory only: caller MUST supply an actually registered,
 * operator-approved UUID and a verified package distribution. No UUID is
 * embedded, inferred from legacy Google settings, or read from an unchecked
 * URL/localStorage entry.
 */
export function prepareJapaneseFirstPartySdkCandidate<Session extends FirstPartyAccountSession>(
  sdk: FirstPartySdkFunctions<Session>,
  registeredClientId: string,
  connections: FirstPartyJapaneseConnectionPort = createJapaneseFirstPartyConnectionPort(),
) {
  if (!UUID.test(registeredClientId)) {
    throw new Error("JAPANESE_OAUTH_CLIENT_NOT_REGISTERED");
  }
  const session = sdk.createThiepnAccountSession({
    issuer: THIEPN_ACCOUNT_SUPABASE_URL,
    publishableKey: THIEPN_ACCOUNT_PUBLISHABLE_KEY,
    clientId: registeredClientId,
    redirectUri: JAPANESE_CALLBACK_URL,
    storageKey: JAPANESE_FIRST_PARTY_STORAGE_KEY,
    authPolicy: "guest-first",
  });
  const sso = sdk.createThiepnBrowserSso(session, {
    accountOrigin: JAPANESE_FIRST_PARTY_ACCOUNT_ORIGIN,
  });
  return Object.freeze({
    provider: createJapaneseFirstPartySdkAdapter({ session, sso, connections }),
    sso,
  });
}
