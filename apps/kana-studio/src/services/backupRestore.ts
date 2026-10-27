import {kanaMap} from '../data/kanaData';
import type {StoredCardData,UserSettings} from '../types/kana';

export interface RestorableKanaBackup {
  cards: StoredCardData[];
  logs: Array<{cardId:string;reviewTime:string;log:unknown}>;
  settings: UserSettings|null;
  sourceOwner: string|null;
  canonicalProjection: StoredCardData[];
}
export interface KanaRestorePreview {
  newCards:number;
  existingCards:number;
  logs:number;
  legacyCanonicalCandidates:number;
}
const MAX_BACKUP_BYTES=12*1024*1024;
const MAX_CARDS=2000;
const MAX_LOGS=50000;
const VALID_DIRECTION=['kana-to-romaji','romaji-to-kana'];
function asObject(value:unknown):Record<string,unknown>|null{
  return value && typeof value==='object' && !Array.isArray(value) ? value as Record<string,unknown> : null;
}
function validDate(value:unknown):boolean{
  return typeof value==='string'&&Number.isFinite(Date.parse(value));
}
function finiteNonnegative(value:unknown):value is number{
  return typeof value==='number'&&Number.isFinite(value)&&value>=0;
}
function parseCard(input:unknown):StoredCardData{
  const raw=asObject(input),state=asObject(raw?.card);
  if (!raw || !state || typeof raw.cardId!=='string' ||
      (!kanaMap.has(raw.cardId) && !(raw.cardId.endsWith(':rev')&&kanaMap.has(raw.cardId.slice(0,-4)))) ||
      !VALID_DIRECTION.includes(raw.direction as string) ||
      (raw.cardId.endsWith(':rev') ? raw.direction!=='romaji-to-kana' : raw.direction!=='kana-to-romaji') ||
      !validDate(state.due) ||
      (state.last_review!==null&&state.last_review!==undefined&&!validDate(state.last_review)) ||
      ![0,1,2,3].includes(state.state as number) ||
      !['stability','difficulty','elapsed_days','scheduled_days','learning_steps','reps','lapses'].every(k=>finiteNonnegative(state[k])) ||
      !Number.isInteger(state.reps) || !Number.isInteger(state.lapses) ||
      !Number.isInteger(raw.totalReviews)||!finiteNonnegative(raw.totalReviews) ||
      !Number.isInteger(raw.totalLapses)||!finiteNonnegative(raw.totalLapses) ||
      (raw.lastReviewedAt!==undefined&&!validDate(raw.lastReviewedAt)) ||
      (raw.firstReviewedAt!==undefined&&!validDate(raw.firstReviewedAt)) ||
      (raw.introducedAt!==undefined&&!validDate(raw.introducedAt)) ||
      (raw.isSuspended!==undefined&&typeof raw.isSuspended!=='boolean'))
    throw Error('BACKUP_INVALID_CARD');
  return {
    cardId:raw.cardId, direction:raw.direction as StoredCardData['direction'],
    card:{...state,due:new Date(state.due as string),
      last_review:state.last_review?new Date(state.last_review as string):undefined} as StoredCardData['card'],
    totalReviews:raw.totalReviews as number,totalLapses:raw.totalLapses as number,
    ...(typeof raw.lastReviewedAt==='string'?{lastReviewedAt:raw.lastReviewedAt}:{}),
    ...(typeof raw.firstReviewedAt==='string'?{firstReviewedAt:raw.firstReviewedAt}:{}),
    ...(typeof raw.introducedAt==='string'?{introducedAt:raw.introducedAt}:{}),
    ...(typeof raw.isSuspended==='boolean'?{isSuspended:raw.isSuspended}:{})
  };
}
function parseSettings(value:unknown):UserSettings|null{
  if(value===undefined||value===null)return null;
  const s=asObject(value);
  if(!s ||
    !['light','dark','system'].includes(s.theme as string) ||
    !['hiragana','katakana','both'].includes(s.preferredScript as string) ||
    !Number.isInteger(s.dailyNewLimit)||!finiteNonnegative(s.dailyNewLimit)||
    (s.dailyNewLimit as number)>200 ||
    typeof s.enableAudio!=='boolean'||typeof s.enableReversePractice!=='boolean'||
    !finiteNonnegative(s.soundVolume)||(s.soundVolume as number)>1)
      throw Error('BACKUP_INVALID_SETTINGS');
  return s as unknown as UserSettings;
}
/** Validate the entire file before opening an IndexedDB write transaction. */
export function parseKanaBackup(json:string):RestorableKanaBackup{
  if(new TextEncoder().encode(json).byteLength>MAX_BACKUP_BYTES)throw Error('BACKUP_TOO_LARGE');
  const payload=asObject(JSON.parse(json));
  if(!payload || (!Array.isArray(payload.cards)) ||
    (payload.appName!=='KANA' && payload.format!=='thiepn-kana-legacy-backup-v1'))
    throw Error('BACKUP_UNRECOGNIZED');
  if(payload.cards.length>MAX_CARDS)throw Error('BACKUP_TOO_MANY_CARDS');
  const seen=new Set<string>();
  const cards=payload.cards.map(value=>{
    const card=parseCard(value);
    if(seen.has(card.cardId))throw Error('BACKUP_DUPLICATE_CARD');
    seen.add(card.cardId);
    return card;
  });
  const entries=payload.logs??[];
  if(!Array.isArray(entries)||entries.length>MAX_LOGS)throw Error('BACKUP_INVALID_LOGS');
  const logs=entries.map(value=>{
    const log=asObject(value);
    if(!log || typeof log.cardId!=='string' ||
      (!kanaMap.has(log.cardId) && !(log.cardId.endsWith(':rev')&&kanaMap.has(log.cardId.slice(0,-4)))) ||
      !validDate(log.reviewTime)||!asObject(log.log)) throw Error('BACKUP_INVALID_LOG');
    return {cardId:log.cardId,reviewTime:log.reviewTime as string,log:log.log};
  });
  const settings=parseSettings(payload.settings);
  if(payload.owner!==undefined && (typeof payload.owner!=='string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(payload.owner)))
    throw Error('BACKUP_INVALID_OWNER');
  const canonicalRaw=payload.canonicalProjection??[];
  if(!Array.isArray(canonicalRaw)||canonicalRaw.length>MAX_CARDS)throw Error('BACKUP_INVALID_CANONICAL');
  const seenCanonical=new Set<string>();
  const canonicalProjection=canonicalRaw.map(value=>{
    const card=parseCard(value);
    if(seenCanonical.has(card.cardId))throw Error('BACKUP_DUPLICATE_CANONICAL');
    seenCanonical.add(card.cardId);
    return card;
  });
  return {cards,logs,settings,sourceOwner:typeof payload.owner==='string'?payload.owner:null,canonicalProjection};
}
export function previewKanaRestore(
  backup:RestorableKanaBackup,existing:ReadonlyMap<string,StoredCardData>
):KanaRestorePreview {
  return {
    newCards:backup.cards.filter(card=>!existing.has(card.cardId)).length,
    existingCards:backup.cards.filter(card=>existing.has(card.cardId)).length,
    logs:backup.logs.length,
    legacyCanonicalCandidates:backup.cards.filter(c=>c.totalReviews>0).length
  };
}
