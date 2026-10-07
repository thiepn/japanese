import type { AuthProvider } from "@thiepn/auth";
import { createCoreLanguageDashboardClient } from "@thiepn/languages/dashboard";
import { getJapaneseLanguageReadModel } from "./languageReadModel";
import { getDevelopmentAccountId } from "./study/runtime";
import { getAuthenticAccountId } from "./immerse/authentic";

export const THIEPN_CORE_GATEWAY_URL = "https://thiepn-core-gateway.thiepn.workers.dev";

export function createJapaneseLanguageDashboardPublisher(
  auth: AuthProvider,
  baseUrl = THIEPN_CORE_GATEWAY_URL,
) {
  const client = createCoreLanguageDashboardClient({
    baseUrl,
    getAccessToken: () => auth.getAccessToken(),
  });

  return Object.freeze({
    async publish() {
      const context = await auth.getCurrentContext();
      if (context.status !== "authenticated" || !context.accountId) return null;
      if (!(await auth.isAppConnected())) return null;
      if (
        getDevelopmentAccountId() !== context.accountId ||
        getAuthenticAccountId() !== context.accountId
      )
        return null;
      return client.publish(await getJapaneseLanguageReadModel());
    },
  });
}
