/** The Japanese account bridge shares only a workspace lease, never authentication credentials. */
export const KANA_OWNER_KEY = "thiepn:japanese:kana-owner:v2";
export const KANA_HANDOFF_KEY = "thiepn:japanese:kana-handoff";
export const KANA_GUEST_ID = "00000000-0000-4000-8000-000000000001";
export type KanaOwnerLease = { owner: string; epoch: string };

export function readKanaOwnerLease(): KanaOwnerLease | null {
  try {
    const raw = localStorage.getItem(KANA_OWNER_KEY);
    if (!raw) return null;
    const obj: unknown = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    const value = obj as Record<string, unknown>;
    if (typeof value.owner !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.owner) ||
        typeof value.epoch !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(value.epoch)) return null;
    return { owner: value.owner, epoch: value.epoch };
  } catch { return null; }
}
export function publishKanaOwnerLease(owner: string): KanaOwnerLease {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(owner)) throw Error("KANA_OWNER_INVALID");
  const previous = readKanaOwnerLease();
  if (previous?.owner === owner) return previous;
  const lease = { owner, epoch: crypto.randomUUID() };
  try {localStorage.setItem(KANA_OWNER_KEY, JSON.stringify(lease));}
  catch { /* Japanese itself must remain usable even without browser storage. */ }
  return lease;
}
export type KanaStudioView = "home" | "learn" | "review" | "words" | "chart";
/** Resolve the legacy Kana URL from the deployment's public base.
 * Cloudflare serves at '/', while GitHub Pages retains '/japanese/'.
 * This only changes navigation, never the owner lease or FSRS data. */
export function kanaStudioUrl(view: KanaStudioView, base: string = import.meta.env.BASE_URL): string {
  if (!/^\\/(?:[a-zA-Z0-9_-]+\\/)*$/.test(base)) throw Error("KANA_PUBLIC_BASE_INVALID");
  return base + "kana/" + (view === "home" ? "" : "?view=" + encodeURIComponent(view));
}
export function openKanaStudio(owner: string, view: KanaStudioView = "home"): void {
  const lease = publishKanaOwnerLease(owner);
  sessionStorage.setItem(KANA_HANDOFF_KEY, JSON.stringify({...lease, at: Date.now()}));
  window.location.assign(kanaStudioUrl(view));
}
