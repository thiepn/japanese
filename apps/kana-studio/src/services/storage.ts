import type { StoredCardData, UserSettings } from '../types/kana';
import type { ReviewLog } from 'ts-fsrs';
import { KANA_WORKSPACE_ID, assertKanaWorkspace } from './japaneseBridge';
import { overlayJapaneseKanaCards } from './canonicalBridge';
import {parseKanaBackup,previewKanaRestore,type KanaRestorePreview} from './backupRestore';

const DB_NAME = 'kana_mastery_v1:' + KANA_WORKSPACE_ID;
const DB_VERSION = 1;

const STORES = {
  CARDS: 'cards',
  LOGS: 'review_logs',
  SETTINGS: 'settings'
} as const;

export const defaultSettings: UserSettings = {
  theme: 'system',
  preferredScript: 'both',
  dailyNewLimit: 10,
  enableAudio: true,
  enableReversePractice: false,
  soundVolume: 0.8
};

let dbPromise: Promise<IDBDatabase> | null = null;

function isIndexedDBSupported(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      return reject(new Error('IndexedDB not supported or blocked in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.CARDS)) {
        db.createObjectStore(STORES.CARDS, { keyPath: 'cardId' });
      }
      if (!db.objectStoreNames.contains(STORES.LOGS)) {
        const logStore = db.createObjectStore(STORES.LOGS, { autoIncrement: true });
        logStore.createIndex('cardId', 'cardId', { unique: false });
        logStore.createIndex('reviewTime', 'reviewTime', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      request.result.onversionchange = () => {request.result.close();dbPromise=null;};
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  }).catch(error=>{dbPromise=null;throw error;});

  return dbPromise;
}

// LocalStorage Fallback Cache
const LOCAL_STORAGE_CARDS_KEY = 'kana_app_cards_cache:' + KANA_WORKSPACE_ID;
const LOCAL_STORAGE_SETTINGS_KEY = 'kana_app_settings_cache:' + KANA_WORKSPACE_ID;
const memoryCardsMap = new Map<string, StoredCardData>();

export async function readStudioCards(): Promise<Map<string, StoredCardData>> {
  assertKanaWorkspace();
  try {
    const db = await openDB();
    assertKanaWorkspace();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CARDS, 'readonly');
      const store = tx.objectStore(STORES.CARDS);
      const req = store.getAll();

      req.onsuccess = () => {
        const map = new Map<string, StoredCardData>();
        const list: StoredCardData[] = req.result || [];
        for (const item of list) {
          // Re-hydrate Date objects from serialization
          if (item.card) {
            if (item.card.due) item.card.due = new Date(item.card.due);
            if (item.card.last_review) item.card.last_review = new Date(item.card.last_review);
          }
          map.set(item.cardId, item);
        }
        try { assertKanaWorkspace(); resolve(map); } catch(error) { reject(error); }
      };

      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    assertKanaWorkspace();
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_STORAGE_CARDS_KEY);
        const map = new Map<string, StoredCardData>();
        if (raw) {
          const parsed: StoredCardData[] = JSON.parse(raw);
          for (const item of parsed) {
            if (item.card?.due) item.card.due = new Date(item.card.due);
            if (item.card?.last_review) item.card.last_review = new Date(item.card.last_review);
            map.set(item.cardId, item);
          }
        }
        return map;
      }
    } catch {
      // Fall through to memory fallback
    }
    return new Map(memoryCardsMap);
  }
}

export async function getAllStoredCards(): Promise<Map<string, StoredCardData>> {
  assertKanaWorkspace();
  const cards = await overlayJapaneseKanaCards(await readStudioCards());
  assertKanaWorkspace();
  return cards;
}

export async function saveStoredCard(cardData: StoredCardData): Promise<void> {
  assertKanaWorkspace();
  // Always update memory cache so sync works in any environment
  memoryCardsMap.set(cardData.cardId, cardData);

  try {
    const db = await openDB();
    assertKanaWorkspace();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.CARDS, 'readwrite');
      const store = tx.objectStore(STORES.CARDS);
      const req = store.put(cardData);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    assertKanaWorkspace();
    try {
      if (typeof localStorage !== 'undefined') {
        const current = await readStudioCards();
        current.set(cardData.cardId, cardData);
        localStorage.setItem(LOCAL_STORAGE_CARDS_KEY, JSON.stringify(Array.from(current.values())));
      }
    } catch {
      // Ignored
    }
  }
}


export async function saveReviewLog(log: ReviewLog, cardId: string): Promise<void> {
  assertKanaWorkspace();
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readwrite');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.add({
        cardId,
        log,
        reviewTime: log.review ? new Date(log.review).toISOString() : new Date().toISOString()
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Logging skipped in fallback mode:', err);
  }
}

export async function getReviewLogs(): Promise<Array<{ cardId: string; log: ReviewLog; reviewTime: string }>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readonly');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function getSettings(): Promise<UserSettings> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.get('app_settings');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          resolve({ ...defaultSettings, ...req.result.value });
        } else {
          resolve(defaultSettings);
        }
      };
      req.onerror = () => resolve(defaultSettings);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      // fallback
    }
    return defaultSettings;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  assertKanaWorkspace();
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.put({ key: 'app_settings', value: settings });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // fallback
    }
  }
}

/** The backup retains the original Google snapshots, not an overlay pretending
 * to be an original review. The canonical projection is supplementary only. */
export async function exportProgressJSON(): Promise<string> {
  assertKanaWorkspace();
  const [originalCards,projectedCards,logs,settings] = await Promise.all([
    readStudioCards(),getAllStoredCards(),getReviewLogs(),getSettings()
  ]);
  assertKanaWorkspace();
  return JSON.stringify({
    version:2,appName:'KANA',exportedAt:new Date().toISOString(),
    cards:[...originalCards.values()],
    canonicalProjection:[...projectedCards.values()].filter(card=>
      !originalCards.has(card.cardId)||card.card.reps!==originalCards.get(card.cardId)?.card.reps),
    logs,settings
  },null,2);
}

export async function previewProgressImportJSON(jsonString:string):Promise<KanaRestorePreview>{
  assertKanaWorkspace();
  const backup=parseKanaBackup(jsonString);
  const current=await readStudioCards();
  assertKanaWorkspace();
  return previewKanaRestore(backup,current);
}

export async function importProgressJSON(jsonString:string):
  Promise<{success:boolean;count:number;message:string}>{
  assertKanaWorkspace();
  try {
    const backup=parseKanaBackup(jsonString);
    const db=await openDB();
    assertKanaWorkspace();
    // Preserve every existing Google card and its FSRS schedule. Import only
    // missing card IDs. No canonical Japanese trace is written by this action.
    const existingLogs=await getReviewLogs();
    const fingerprints=new Set(existingLogs.map(item=>
      JSON.stringify({cardId:item.cardId,reviewTime:item.reviewTime,log:item.log})));
    assertKanaWorkspace();
    const summary=await new Promise<{added:number;skipped:number;logs:number}>((resolve,reject)=>{
      const tx=db.transaction([STORES.CARDS,STORES.LOGS,STORES.SETTINGS],'readwrite');
      const cards=tx.objectStore(STORES.CARDS),logs=tx.objectStore(STORES.LOGS);
      const prefs=tx.objectStore(STORES.SETTINGS);
      let added=0,skipped=0,addedLogs=0;
      for(const card of backup.cards){
        const request=cards.get(card.cardId);
        request.onsuccess=()=>{
          if(request.result){skipped++;return;}
          cards.add(card);
          added++;
        };
      }
      for(const record of backup.logs){
        const key=JSON.stringify(record);
        if(fingerprints.has(key))continue;
        fingerprints.add(key);
        // This transaction-local marker also protects concurrent restore tabs.
        const marker='restore-log:'+key;
        const request=prefs.get(marker);
        request.onsuccess=()=>{
          if(request.result)return;
          prefs.add({key:marker,value:'1'});
          logs.add(record);
          addedLogs++;
        };
      }
      if(backup.settings){
        const request=prefs.get('app_settings');
        request.onsuccess=()=>{
          if(!request.result)prefs.add({key:'app_settings',value:backup.settings});
        };
      }
      tx.oncomplete=()=>resolve({added,skipped,logs:addedLogs});
      tx.onerror=()=>reject(tx.error??Error('RESTORE_TRANSACTION_FAILED'));
      tx.onabort=()=>reject(tx.error??Error('RESTORE_TRANSACTION_ABORTED'));
    });
    assertKanaWorkspace();
    return {success:true,count:summary.added,
      message:`Restored ${summary.added} missing cards and ${summary.logs} review logs. Kept ${summary.skipped} existing cards and their schedules unchanged.`};
  } catch(error){
    // A wrong owner or broken storage must never silently report a completed restore.
    return {success:false,count:0,message:error instanceof Error?error.message:'Unable to restore backup.'};
  }
}

export async function resetAllProgress(): Promise<void> {
  assertKanaWorkspace();
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORES.CARDS, STORES.LOGS], 'readwrite');
      tx.objectStore(STORES.CARDS).clear();
      tx.objectStore(STORES.LOGS).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fallback
    localStorage.removeItem(LOCAL_STORAGE_CARDS_KEY);
  }
}

/** Opening an absent legacy database never creates a replacement empty database.
 * This works on browsers without the optional indexedDB.databases() API. */
async function openExistingLegacyGuestDB():Promise<IDBDatabase|null>{
  assertKanaWorkspace();
  if(typeof indexedDB==='undefined')return null;
  return new Promise((resolve,reject)=>{
    let absent=false;
    const req=indexedDB.open('kana_mastery_v1:local-guest',1);
    req.onupgradeneeded=()=>{absent=true;req.transaction?.abort();};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>absent?resolve(null):reject(req.error);
  });
}
/** The original standalone guest DB is read-only here. It is never claimed implicitly. */
export async function readLegacyGuestCards(): Promise<StoredCardData[]> {
  assertKanaWorkspace();
  const name = 'kana_mastery_v1:local-guest';
  let cards: StoredCardData[] = [];
  try {
    const db=await openExistingLegacyGuestDB();
    assertKanaWorkspace();
    if(db){
      try {
        const values = await new Promise<StoredCardData[]>((resolve,reject) => {
          if (!db.objectStoreNames.contains('cards')) return resolve([]);
          const req = db.transaction('cards','readonly').objectStore('cards').getAll();
          req.onsuccess = () => resolve(req.result as StoredCardData[]);
          req.onerror = () => reject(req.error);
        });
        cards = values.map(item => ({
          ...item,card:{...item.card,due:new Date(item.card.due),
            last_review:item.card.last_review ? new Date(item.card.last_review) : undefined}
        }));
      } finally {db.close();}
    }
  } catch { assertKanaWorkspace(); }
  if (cards.length === 0) {
    try {
      const raw = localStorage.getItem('kana_app_cards_cache:local-guest');
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) cards = parsed.filter(item=>item&&typeof item.cardId==='string'&&item.card)
        .map(item=>({...item,card:{...item.card,due:new Date(item.card.due),
          last_review:item.card.last_review?new Date(item.card.last_review):undefined}}));
    } catch { /* No guest fallback. */ }
  }
  assertKanaWorkspace();
  return cards;
}
async function readLegacyGuestArchive(): Promise<{logs: unknown[];settings: UserSettings | null}> {
  assertKanaWorkspace();
  const db=await openExistingLegacyGuestDB();
  if(!db)return {logs:[],settings:null};
  assertKanaWorkspace();
  try {
    const records=await Promise.all(['review_logs','settings'].map(store=>
      new Promise<unknown[]>((resolve,reject)=>{
        if(!db.objectStoreNames.contains(store))return resolve([]);
        const req=db.transaction(store,'readonly').objectStore(store).getAll();
        req.onsuccess=()=>resolve(req.result as unknown[]);
        req.onerror=()=>reject(req.error);
      })
    ));
    assertKanaWorkspace();
    const found=records[1]?.find((item):item is {key:string;value:UserSettings} =>
      typeof item === 'object' && item !== null && (item as {key?:string}).key === 'app_settings');
    return {logs:records[0]??[],settings:found?.value??null};
  } finally {db.close();}
}
export async function serializeLegacyKanaBackup(
  cards: readonly StoredCardData[], source: 'current-studio'|'legacy-guest'
): Promise<string> {
  assertKanaWorkspace();
  const archive = source === 'legacy-guest'
    ? await readLegacyGuestArchive()
    : {logs:await getReviewLogs(),settings:await getSettings()};
  assertKanaWorkspace();
  return JSON.stringify({
    format:'thiepn-kana-legacy-backup-v1',source,createdAt:new Date().toISOString(),
    cards,logs:archive.logs,settings:archive.settings,
    note:'Historical logs are preserved verbatim; only exact FSRS snapshots are imported as ungraded Japanese provenance.'
  },null,2);
}
