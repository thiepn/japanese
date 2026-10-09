import {openLocalDb} from "./index";

/**
 * Explicit, owner-locked, portable backup for a SINGLE local Japanese workspace.
 *
 * Excludes the remote sync cursor: importing it would falsely claim that a new
 * device has already pulled changes. This is local device recovery, not cloud sync.
 * The JSON includes private documents and binary audio. Callers must handle it
 * as sensitive data and never send it to analytics, logs, or a public endpoint.
 */
const SCHEMA = "thiepn-japanese-workspace-backup";
const VERSION = 1;
const STORES = [
  "study_events","memory_traces","sync_outbox","private_documents",
  "private_vocabulary","private_sentences","private_media_reviews",
  "private_prosody_captures",
] as const;
type Store = typeof STORES[number];
type Row = Record<string,unknown>;
type BackupRows = Record<Store,Row[]>;
interface BackupBody{
  schema:typeof SCHEMA;
  schemaVersion:typeof VERSION;
  accountId:string;
  createdAt:string;
  stores:BackupRows;
}
interface BackupFile extends BackupBody{sha256:string}
const AUDIO_FIELD="audioBlob";
const AUDIO_MARKER="__japanese_backup_audio_v1";

function bytesToBase64(bytes:Uint8Array):string{
  let text="";
  for(let at=0;at<bytes.length;at+=32768){
    text+=String.fromCharCode(...bytes.subarray(at,at+32768));
  }
  return btoa(text);
}
function base64ToBytes(encoded:string):Uint8Array{
  if(encoded.length%4!==0||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)){
    throw new Error("JAPANESE_BACKUP_AUDIO_ENCODING_INVALID");
  }
  const binary=atob(encoded);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return bytes;
}
async function sha256(value:string):Promise<string>{
  const digest=await globalThis.crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function isRow(value:unknown):value is Row{
  return value!==null&&typeof value==="object"&&!Array.isArray(value);
}
function validateOwner(accountId:string,name:Store,rows:readonly Row[]):void{
  const ids=new Set<string>();
  for(const row of rows){
    if(!isRow(row))throw new Error("JAPANESE_BACKUP_ROW_INVALID");
    const key=name==="sync_outbox"?"mutation_id":"id";
    const id=row[key];
    if(typeof id!=="string"||!id||ids.has(id))throw new Error("JAPANESE_BACKUP_KEY_INVALID");
    ids.add(id);
    if(name==="study_events"||name==="memory_traces"){
      if(row.userId!==accountId)throw new Error("JAPANESE_BACKUP_OWNER_MISMATCH");
    }else if(name!=="sync_outbox"&&row.accountId!==accountId){
      throw new Error("JAPANESE_BACKUP_OWNER_MISMATCH");
    }
    if(name==="sync_outbox"){
      // CoreSyncMutation is the outer envelope. app_id lives inside its
      // StudyEventEnvelope payload, never at mutation top level.
      const envelope=row.data;
      if(row.primitive!=="event"||row.operation!=="append"||
        row.resource_type!=="study_event"||row.resource_id!==id||
        !isRow(envelope)||envelope.app_id!=="japanese"||
        envelope.event_type!=="study.event"||envelope.event_id!==id||
        !isRow(envelope.data)||envelope.data.id!==id||
        "userId" in envelope.data||"receivedAt" in envelope.data){
        throw new Error("JAPANESE_BACKUP_OUTBOX_INVALID");
      }
    }
  }
}
function validateBackupRows(accountId:string,rows:unknown):asserts rows is BackupRows{
  if(!isRow(rows)||Object.keys(rows).length!==STORES.length||
    Object.keys(rows).some(key=>!STORES.includes(key as Store))){
    throw new Error("JAPANESE_BACKUP_STORES_INVALID");
  }
  for(const name of STORES){
    const items=rows[name];
    if(!Array.isArray(items))throw new Error("JAPANESE_BACKUP_STORES_INVALID");
    validateOwner(accountId,name,items as Row[]);
  }
}

/** Snapshot all stores in ONE read transaction, so concurrent writes cannot
 * create an event/outbox/FSRS mismatch in the exported point-in-time view. */
async function snapshot(accountId:string):Promise<BackupRows>{
  const db=await openLocalDb(accountId);
  try{
    return await new Promise<BackupRows>((resolve,reject)=>{
      const tx=db.transaction([...STORES],"readonly");
      const rows={} as BackupRows;
      for(const name of STORES){
        const req=tx.objectStore(name).getAll();
        req.onsuccess=()=>{rows[name]=req.result as Row[];};
      }
      tx.oncomplete=()=>resolve(rows);
      tx.onerror=()=>reject(tx.error??new Error("JAPANESE_BACKUP_READ_FAILED"));
      tx.onabort=()=>reject(tx.error??new Error("JAPANESE_BACKUP_READ_ABORTED"));
    });
  }finally{db.close();}
}

/** Browser-downloadable JSON text, including private audio as reversible base64. */
export async function exportLocalWorkspaceBackup(accountId:string):Promise<string>{
  const rows=await snapshot(accountId);
  validateBackupRows(accountId,rows);
  const captures:Row[]=[];
  for(const item of rows.private_prosody_captures){
    const audio=item.audioBlob;
    if(!(audio instanceof Blob)||audio.size!==item.sizeBytes||audio.size>20_000_000){
      throw new Error("JAPANESE_BACKUP_AUDIO_INVALID");
    }
    captures.push({...item,[AUDIO_FIELD]:{
      [AUDIO_MARKER]:true,type:audio.type,data:bytesToBase64(new Uint8Array(await audio.arrayBuffer())),
    }});
  }
  const body:BackupBody={
    schema:SCHEMA,schemaVersion:VERSION,accountId,createdAt:new Date().toISOString(),
    stores:{...rows,private_prosody_captures:captures},
  };
  return JSON.stringify({...body,sha256:await sha256(JSON.stringify(body))} satisfies BackupFile);
}

/**
 * Fail-closed import into the SAME account only. It never overwrites existing
 * local data, never deletes any store, and either restores all rows or none.
 * External/core cursors are deliberately excluded from export and restore.
 */
export async function restoreLocalWorkspaceBackup(accountId:string,raw:string):Promise<void>{
  if(typeof raw!=="string"||raw.length>128*1024*1024){
    throw new Error("JAPANESE_BACKUP_SIZE_INVALID");
  }
  let parsed:unknown;
  try{parsed=JSON.parse(raw);}catch{throw new Error("JAPANESE_BACKUP_JSON_INVALID");}
  if(!isRow(parsed)||parsed.schema!==SCHEMA||parsed.schemaVersion!==VERSION||
    parsed.accountId!==accountId||typeof parsed.createdAt!=="string"||
    typeof parsed.sha256!=="string"||
    Object.keys(parsed).length!==6){
    throw new Error("JAPANESE_BACKUP_HEADER_INVALID");
  }
  const {sha256:expected,...body}=parsed;
  if(await sha256(JSON.stringify(body))!==expected)throw new Error("JAPANESE_BACKUP_DIGEST_MISMATCH");
  validateBackupRows(accountId,parsed.stores);
  const rows=parsed.stores;
  const captures:Row[]=[];
  for(const row of rows.private_prosody_captures){
    const audio=row.audioBlob;
    if(!isRow(audio)||audio[AUDIO_MARKER]!==true||typeof audio.type!=="string"||
      typeof audio.data!=="string"||audio.data.length>28_000_000){
      throw new Error("JAPANESE_BACKUP_AUDIO_INVALID");
    }
    const bytes=base64ToBytes(audio.data);
    if(bytes.length!==row.sizeBytes||bytes.length===0||bytes.length>20_000_000){
      throw new Error("JAPANESE_BACKUP_AUDIO_INVALID");
    }
    // The decoded bytes must be backed by ArrayBuffer (not SharedArrayBuffer)
    // to satisfy modern DOM BlobPart types and preserve exact audio bytes.
    const buffer=new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    captures.push({...row,audioBlob:new Blob([buffer],{type:audio.type})});
  }
  const restored:BackupRows={...rows,private_prosody_captures:captures};
  // Do not trust parsed contents merely because their SHA-256 is correct.
  validateBackupRows(accountId,restored);

  const db=await openLocalDb(accountId);
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction([...STORES,"sync_meta"],"readwrite");
      const names=[...STORES,"sync_meta"];
      let remaining=names.length,blocked=false;
      for(const name of names){
        const request=tx.objectStore(name).count();
        request.onsuccess=()=>{
          if(request.result!==0)blocked=true;
          remaining--;
          if(remaining!==0)return;
          if(blocked){
            tx.abort();
            return;
          }
          try{
            for(const storeName of STORES){
              for(const row of restored[storeName])tx.objectStore(storeName).add(row);
            }
          }catch(error){
            tx.abort();
            reject(error);
          }
        };
      }
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error("JAPANESE_BACKUP_RESTORE_FAILED"));
      tx.onabort=()=>reject(blocked
        ?new Error("JAPANESE_BACKUP_DESTINATION_NOT_EMPTY")
        :tx.error??new Error("JAPANESE_BACKUP_RESTORE_ABORTED"));
    });
  }finally{db.close();}
}
