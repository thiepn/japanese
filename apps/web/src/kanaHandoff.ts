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
  localStorage.setItem(KANA_OWNER_KEY, JSON.stringify(lease));
  return lease;
}
export function openKanaStudio(owner: string): void {
  const lease = publishKanaOwnerLease(owner);
  sessionStorage.setItem(KANA_HANDOFF_KEY, JSON.stringify({...lease, at: Date.now()}));
  window.location.assign("/japanese/kana/");
}
