const HANDOFF_KEY = 'thiepn:japanese:kana-handoff';
const OWNER_KEY = 'thiepn:japanese:kana-owner:v2';
const MAX_AGE_MS = 4 * 60 * 60 * 1000;
type Lease = { owner: string; epoch: string };
type Handoff = Lease & { at: number };
const VALID_OWNER = /^[a-zA-Z0-9_-]{1,128}$/;
const VALID_EPOCH = /^[a-zA-Z0-9-]{16,80}$/;

function isLease(value: unknown): value is Lease {
  if (!value || typeof value !== 'object') return false;
  const lease = value as Record<string, unknown>;
  return typeof lease.owner === 'string' && VALID_OWNER.test(lease.owner) &&
    typeof lease.epoch === 'string' && VALID_EPOCH.test(lease.epoch);
}
function getActiveLease(): Lease | null {
  try {
    const raw = localStorage.getItem(OWNER_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    return isLease(data) ? data : null;
  } catch { return null; }
}
function currentHandoff(): Handoff | null {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!isLease(value)) return null;
    const data = value as Handoff;
    if (!Number.isFinite(data.at) || data.at > Date.now() ||
        Date.now() - data.at > MAX_AGE_MS) return null;
    const active = getActiveLease();
    return active?.owner === data.owner && active.epoch === data.epoch ? data : null;
  } catch { return null; }
}
export type KanaStudioView = 'home'|'learn'|'review'|'words'|'chart';
export function currentKanaView(): KanaStudioView {
  const value = new URLSearchParams(window.location.search).get('view');
  return value === 'learn' || value === 'review' || value === 'words' || value === 'chart' ? value : 'home';
}
export function hasValidKanaHandoff(): boolean {
  return currentHandoff() !== null;
}
export const KANA_WORKSPACE_ID = currentHandoff()?.owner ?? 'local-guest';
const START_LEASE = currentHandoff();

export function assertKanaWorkspace(): void {
  const current = currentHandoff();
  if (!START_LEASE || !current || current.owner !== START_LEASE.owner ||
      current.epoch !== START_LEASE.epoch)
    throw new Error('KANA_WORKSPACE_CHANGED_REOPEN_JAPANESE');
}

export function returnToJapanese(): void {
  try { sessionStorage.removeItem(HANDOFF_KEY); } catch { /* Browser storage unavailable. */ }
  window.location.assign('/japanese/');
}

/** A different tab signing out or changing the account invalidates this page immediately. */
export function watchKanaWorkspace(): () => void {
  const recheck = () => {
    if (!hasValidKanaHandoff() ||
        currentHandoff()?.owner !== START_LEASE?.owner ||
        currentHandoff()?.epoch !== START_LEASE?.epoch) {
      const view=currentKanaView();
      window.location.replace('/japanese/?kana=resume' + (view === 'home' ? '' : '&kanaView=' + view));
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === OWNER_KEY || event.key === null) recheck();
  };
  const onVisibility = () => { if (document.visibilityState === 'visible') recheck(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener('pageshow', recheck);
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('pageshow', recheck);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
