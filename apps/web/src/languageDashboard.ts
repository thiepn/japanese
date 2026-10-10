import type { AuthProvider } from "@thiepn/auth";
import { createCoreLanguageDashboardClient } from "@thiepn/languages/dashboard";
import { getJapaneseLanguageReadModel } from "./languageReadModel";
import { getDevelopmentAccountId } from "./study/runtime";
import { getAuthenticAccountId } from "./immerse/authentic";
import { GuardedLanguagePublisher } from "./study/guardedLanguagePublish";

export const THIEPN_CORE_GATEWAY_URL = "https://thiepn-core-gateway.thiepn.workers.dev";

export function createJapaneseLanguageDashboardPublisher(
  auth: AuthProvider,
  baseUrl = THIEPN_CORE_GATEWAY_URL,
) {
  const guard = new GuardedLanguagePublisher();

  return Object.freeze({
    // Account/workspace transitions invalidate in-flight read models, including A -> B -> A.
    invalidate: () => guard.invalidate(),
    publish: () => guard.publish({
      readAuth: () => auth.getCurrentContext(),
      isConnected: () => auth.isAppConnected(),
      currentStudyAccount: getDevelopmentAccountId,
      currentReaderAccount: getAuthenticAccountId,
      readModel: () => getJapaneseLanguageReadModel(),
      accessToken: () => auth.getAccessToken(),
      send: (snapshot, getAccessToken) =>
        createCoreLanguageDashboardClient({ baseUrl, getAccessToken }).publish(snapshot),
    }),
  });
}
