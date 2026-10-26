/** Do not fall back to a previously signed-in owner's persistent browser storage. */
const HANDOFF_KEY = 'thiepn:japanese:kana-handoff';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
type Handoff = { owner: string; at: number };

export function getKanaWorkspace(): string {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (raw) {
      const parsed: Handoff = JSON.parse(raw);
      if (typeof parsed.owner === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(parsed.owner) &&
          Number.isFinite(parsed.at) && Math.abs(Date.now()-parsed.at) < MAX_AGE_MS) {
        return parsed.owner;
      }
    }
  } catch { /* Private browsing fallback: isolated guest workspace. */ }
  return 'local-guest';
}

export const KANA_WORKSPACE_ID = getKanaWorkspace();
export function returnToJapanese(): void {
  try { sessionStorage.removeItem(HANDOFF_KEY); } catch { /* Disabled storage. */ }
  window.location.assign('/japanese/');
}
